import assert from "node:assert/strict";
import test from "node:test";

import {
  LEARNING_COMPLETION_CONTRACT_VERSION,
  LEARNING_COMPLETION_EVIDENCE_STATE,
  LEARNING_COMPLETION_NEXT_ACTION,
  LEARNING_COMPLETION_STATUS,
  LearningCompletionContractError,
  evaluateLearningCompletionCandidate,
} from "../src/learning-completion/contract.js";

function guidedSlice({
  status = "completed",
  correct = true,
  needsReview = false,
  practiceKind = "patch-choice",
  activityRevision = 1,
} = {}) {
  const records = status === "completed"
    ? [{
        projectionKey: "guided:practice:practice",
        kind: "guided-practice",
        task: {
          id: "practice",
          type: "practice",
          revision: activityRevision,
        },
        response: {
          kind: "guided-practice",
          value: practiceKind === "ordered-sequence"
            ? { kind: practiceKind, itemIds: ["a", "b", "c"] }
            : { kind: practiceKind, optionId: "correct-option" },
        },
        outcome: {
          kind: "correctness",
          correct,
          authority: "guided",
        },
        occurredAt: null,
        provenance: {
          owner: "guided",
          activityRevision,
          stepId: "practice",
        },
      }]
    : [];

  return {
    source: "guided",
    sourceRef: { activityRevision },
    lifecycle: {
      status,
      updatedAt: "2026-10-05T00:00:00.000Z",
    },
    learnerState: { needsReview },
    records,
  };
}

function assessmentSlice({
  sessionId,
  startedAt,
  status = "completed",
  correctness = [true, true],
} = {}) {
  const completedAt = status === "completed"
    ? new Date(new Date(startedAt).getTime() + 60_000).toISOString()
    : null;

  return {
    source: "assessment",
    sourceRef: { sessionId },
    lifecycle: {
      status,
      startedAt,
      completedAt,
    },
    records: correctness.map((correct, index) => {
      const questionId = "q-" + (index + 1);
      const attemptId = sessionId + "-attempt-" + (index + 1);
      return {
        projectionKey: "assessment:attempt:" + attemptId,
        kind: "assessment-answer",
        task: {
          id: questionId,
          revision: 1,
          snapshot: {
            id: questionId,
            revision: 1,
            learningUnitId: "props",
            type: "single-choice",
            content: {
              prompt: "Pilot question " + (index + 1),
              options: [
                { id: "a", label: "A" },
                { id: "b", label: "B" },
              ],
              correctOptionId: "a",
            },
          },
        },
        response: {
          kind: "answer",
          value: correct ? "a" : "b",
        },
        outcome: {
          kind: "correctness",
          correct,
          authority: "assessment",
        },
        occurredAt: new Date(new Date(startedAt).getTime() + ((index + 1) * 10_000)).toISOString(),
        provenance: {
          owner: "assessment",
          sessionId,
          attemptId,
          questionId,
          questionRevision: 1,
        },
      };
    }),
  };
}

function projection(...sources) {
  return {
    contractVersion: "learner-evidence-v1",
    learningUnitId: "props",
    sources,
  };
}

test("candidate freezes one small state model without a separate verified state", () => {
  assert.deepEqual(Object.values(LEARNING_COMPLETION_STATUS).sort(), [
    "complete",
    "in_progress",
    "needs_review",
    "not_started",
  ]);
  assert.equal("verified" in LEARNING_COMPLETION_STATUS, false);
});

test("clean patch-choice Guided plus clean Verify is complete", () => {
  const result = evaluateLearningCompletionCandidate(projection(
    guidedSlice({ practiceKind: "patch-choice" }),
    assessmentSlice({
      sessionId: "verify-clean",
      startedAt: "2026-10-05T00:10:00.000Z",
      correctness: [true, true],
    }),
  ));

  assert.equal(result.contractVersion, LEARNING_COMPLETION_CONTRACT_VERSION);
  assert.equal(result.status, LEARNING_COMPLETION_STATUS.COMPLETE);
  assert.equal(result.nextAction, LEARNING_COMPLETION_NEXT_ACTION.CONTINUE);
  assert.equal(result.canContinue, true);
  assert.deepEqual(result.requiredEvidence, {
    guidedPractice: LEARNING_COMPLETION_EVIDENCE_STATE.SATISFIED,
    verify: LEARNING_COMPLETION_EVIDENCE_STATE.SATISFIED,
  });
  assert.deepEqual(result.reviewReasons, []);
});

test("ordered-sequence uses the same Completion contract", () => {
  const result = evaluateLearningCompletionCandidate(projection(
    guidedSlice({ practiceKind: "ordered-sequence" }),
    assessmentSlice({
      sessionId: "verify-sequence",
      startedAt: "2026-10-05T00:20:00.000Z",
    }),
  ));

  assert.equal(result.status, LEARNING_COMPLETION_STATUS.COMPLETE);
  assert.equal(result.nextAction, LEARNING_COMPLETION_NEXT_ACTION.CONTINUE);
});

test("no Guided evidence fails closed to start Practice", () => {
  const result = evaluateLearningCompletionCandidate(projection(
    guidedSlice({ status: "not_started" }),
  ));

  assert.equal(result.status, LEARNING_COMPLETION_STATUS.NOT_STARTED);
  assert.equal(result.nextAction, LEARNING_COMPLETION_NEXT_ACTION.START_PRACTICE);
  assert.equal(result.canContinue, false);
});

test("in-progress Guided evidence resumes Practice before Verify", () => {
  const result = evaluateLearningCompletionCandidate(projection(
    guidedSlice({ status: "in_progress" }),
    assessmentSlice({
      sessionId: "verify-bypassed",
      startedAt: "2026-10-05T00:25:00.000Z",
      correctness: [true, true],
    }),
  ));

  assert.equal(result.status, LEARNING_COMPLETION_STATUS.IN_PROGRESS);
  assert.equal(result.nextAction, LEARNING_COMPLETION_NEXT_ACTION.RESUME_PRACTICE);
  assert.equal(result.canContinue, false);
});

test("incorrect Guided Practice requires deterministic retry", () => {
  const result = evaluateLearningCompletionCandidate(projection(
    guidedSlice({ correct: false }),
  ));

  assert.equal(result.status, LEARNING_COMPLETION_STATUS.NEEDS_REVIEW);
  assert.equal(result.nextAction, LEARNING_COMPLETION_NEXT_ACTION.RETRY_PRACTICE);
  assert.deepEqual(result.reviewReasons, ["guided-practice-incorrect"]);
});

test("learner-owned needsReview blocks closure without becoming correctness", () => {
  const result = evaluateLearningCompletionCandidate(projection(
    guidedSlice({ correct: true, needsReview: true }),
    assessmentSlice({
      sessionId: "verify-clean-but-review",
      startedAt: "2026-10-05T00:30:00.000Z",
      correctness: [true, true],
    }),
  ));

  assert.equal(result.status, LEARNING_COMPLETION_STATUS.NEEDS_REVIEW);
  assert.equal(result.nextAction, LEARNING_COMPLETION_NEXT_ACTION.REVIEW_GUIDED);
  assert.equal(result.requiredEvidence.guidedPractice, LEARNING_COMPLETION_EVIDENCE_STATE.REVIEW);
  assert.equal(result.canContinue, false);
});

test("clean Guided evidence with no Verify starts Verify", () => {
  const result = evaluateLearningCompletionCandidate(projection(
    guidedSlice(),
  ));

  assert.equal(result.status, LEARNING_COMPLETION_STATUS.IN_PROGRESS);
  assert.equal(result.nextAction, LEARNING_COMPLETION_NEXT_ACTION.START_VERIFY);
  assert.equal(result.requiredEvidence.verify, LEARNING_COMPLETION_EVIDENCE_STATE.MISSING);
});

test("current in-progress Verify resumes Verify", () => {
  const result = evaluateLearningCompletionCandidate(projection(
    guidedSlice(),
    assessmentSlice({
      sessionId: "verify-active",
      startedAt: "2026-10-05T00:40:00.000Z",
      status: "in_progress",
      correctness: [true],
    }),
  ));

  assert.equal(result.status, LEARNING_COMPLETION_STATUS.IN_PROGRESS);
  assert.equal(result.nextAction, LEARNING_COMPLETION_NEXT_ACTION.RESUME_VERIFY);
  assert.equal(result.canContinue, false);
});

test("formal wrong Verify evidence requires a new deterministic Verify attempt", () => {
  const evidence = projection(
    guidedSlice(),
    assessmentSlice({
      sessionId: "verify-wrong",
      startedAt: "2026-10-05T00:50:00.000Z",
      correctness: [true, false],
    }),
  );

  const result = evaluateLearningCompletionCandidate(evidence);

  assert.equal(result.status, LEARNING_COMPLETION_STATUS.NEEDS_REVIEW);
  assert.equal(result.nextAction, LEARNING_COMPLETION_NEXT_ACTION.RETRY_VERIFY);
  assert.deepEqual(result.reviewReasons, ["verify-has-incorrect-answer"]);

  // Local correction is not Learner Evidence V1. Without a new source-owned session,
  // the same durable evidence must produce the same blocking decision.
  assert.deepEqual(evaluateLearningCompletionCandidate(evidence), result);
});

test("later clean completed Verify can resolve the blocking action without deleting earlier wrong evidence", () => {
  const wrong = assessmentSlice({
    sessionId: "verify-old-wrong",
    startedAt: "2026-10-05T01:00:00.000Z",
    correctness: [true, false],
  });
  const clean = assessmentSlice({
    sessionId: "verify-new-clean",
    startedAt: "2026-10-05T01:10:00.000Z",
    correctness: [true, true],
  });
  const evidence = projection(guidedSlice(), wrong, clean);

  const result = evaluateLearningCompletionCandidate(evidence);

  assert.equal(result.status, LEARNING_COMPLETION_STATUS.COMPLETE);
  assert.equal(result.nextAction, LEARNING_COMPLETION_NEXT_ACTION.CONTINUE);
  assert.ok(evidence.sources.includes(wrong));
  assert.ok(wrong.records.some(({ outcome }) => outcome.correct === false));
  assert.equal(
    result.basis.some(({ sourceRef }) => sourceRef.sessionId === "verify-new-clean"),
    true,
  );
  assert.equal(
    result.basis.some(({ sourceRef }) => sourceRef.sessionId === "verify-old-wrong"),
    false,
  );
});

test("equivalent Evidence source ordering derives the same decision", () => {
  const guided = guidedSlice();
  const wrong = assessmentSlice({
    sessionId: "verify-old",
    startedAt: "2026-10-05T01:20:00.000Z",
    correctness: [false, true],
  });
  const clean = assessmentSlice({
    sessionId: "verify-new",
    startedAt: "2026-10-05T01:30:00.000Z",
    correctness: [true, true],
  });

  const left = evaluateLearningCompletionCandidate(projection(guided, wrong, clean));
  const right = evaluateLearningCompletionCandidate(projection(clean, guided, wrong));

  assert.deepEqual(left, right);
});

test("invalid Learner Evidence never returns a continuable Completion decision", () => {
  assert.throws(
    () => evaluateLearningCompletionCandidate({
      contractVersion: "learner-evidence-bogus",
      learningUnitId: "props",
      sources: [guidedSlice()],
    }),
    (error) => (
      error instanceof LearningCompletionContractError
      && error.code === "LEARNER_EVIDENCE_INVALID"
    ),
  );
});

test("Completion decision exposes no mastery, score, confidence or AI authority", () => {
  const result = evaluateLearningCompletionCandidate(projection(
    guidedSlice(),
    assessmentSlice({
      sessionId: "verify-no-ai",
      startedAt: "2026-10-05T01:40:00.000Z",
    }),
  ));
  const serialized = JSON.stringify(result);

  for (const forbidden of ["mastery", "score", "confidence", "aiVerdict"]) {
    assert.equal(serialized.includes(forbidden), false);
  }
});
