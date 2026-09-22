import assert from "node:assert/strict";
import test from "node:test";

import { createSessionItem } from "../src/assessment/domain/assessmentSession.js";
import { getCanonicalAssessmentQuestions } from "../src/assessment/content/canonicalQuestions.js";
import { getGuidedActivityDefinition } from "../src/workbench/guidedActivity.js";
import {
  createGuidedFlowState,
  GUIDED_FLOW_ACTIONS,
  guidedFlowReducer,
} from "../src/workbench/guidedFlow.js";
import {
  evaluateGuidedPracticeResponse,
  getExpectedGuidedPracticeResponse,
} from "../src/workbench/guidedPractice.js";
import { serializeGuidedSessionSnapshot } from "../src/workbench/guidedSessionStorage.js";
import {
  LEARNER_EVIDENCE_CONTRACT_VERSION,
  LEARNER_EVIDENCE_RECORD_KINDS,
  LEARNER_EVIDENCE_SOURCES,
  validateLearnerEvidenceProjection,
} from "../scripts/learning-evidence/contract.mjs";

function projection(learningUnitId, sources) {
  return {
    contractVersion: LEARNER_EVIDENCE_CONTRACT_VERSION,
    learningUnitId,
    sources,
  };
}

function projectAssessmentSlice(session, attempts) {
  return {
    source: LEARNER_EVIDENCE_SOURCES.ASSESSMENT,
    sourceRef: { sessionId: session.id },
    lifecycle: {
      status: session.status,
      startedAt: session.startedAt,
      completedAt: session.completedAt,
    },
    records: attempts.map((attempt) => {
      const item = session.items.find(({ questionId }) => questionId === attempt.questionId);
      return {
        projectionKey: "assessment:attempt:" + attempt.id,
        kind: LEARNER_EVIDENCE_RECORD_KINDS.ASSESSMENT_ANSWER,
        task: {
          id: attempt.questionId,
          revision: attempt.questionRevision,
          snapshot: item.snapshot,
        },
        response: { kind: "answer", value: attempt.answer },
        outcome: {
          kind: "correctness",
          correct: attempt.correct,
          authority: LEARNER_EVIDENCE_SOURCES.ASSESSMENT,
        },
        occurredAt: attempt.submittedAt,
        provenance: {
          owner: LEARNER_EVIDENCE_SOURCES.ASSESSMENT,
          sessionId: session.id,
          attemptId: attempt.id,
          questionId: attempt.questionId,
          questionRevision: attempt.questionRevision,
        },
      };
    }),
  };
}

function projectGuidedSlice(snapshot, definition) {
  const records = [];
  const step = (type) => definition.steps.find((candidate) => candidate.type === type);
  const predict = step("predict");
  const experiment = step("experiment");
  const explain = step("explain");
  const practice = step("practice");
  const common = (task) => ({
    task: { id: task.id, type: task.type, revision: definition.revision },
    occurredAt: null,
    provenance: {
      owner: LEARNER_EVIDENCE_SOURCES.GUIDED,
      activityRevision: definition.revision,
      stepId: task.id,
    },
  });

  if (snapshot.firstPrediction) {
    records.push({
      projectionKey: "guided:" + definition.learningUnitId + ":" + predict.id,
      kind: LEARNER_EVIDENCE_RECORD_KINDS.GUIDED_PREDICTION,
      ...common(predict),
      response: { kind: "choice", optionId: snapshot.firstPrediction },
      outcome: null,
    });
  }
  if (snapshot.experimentAcknowledged) {
    records.push({
      projectionKey: "guided:" + definition.learningUnitId + ":" + experiment.id,
      kind: LEARNER_EVIDENCE_RECORD_KINDS.GUIDED_EXPERIMENT_ACK,
      ...common(experiment),
      response: { kind: "acknowledgement", acknowledged: true },
      context: { observation: snapshot.observation },
      outcome: null,
    });
  }
  if (snapshot.explanationSubmitted) {
    records.push({
      projectionKey: "guided:" + definition.learningUnitId + ":" + explain.id,
      kind: LEARNER_EVIDENCE_RECORD_KINDS.GUIDED_EXPLANATION,
      ...common(explain),
      response: { kind: "text", text: snapshot.explanation },
      outcome: null,
    });
  }
  if (snapshot.practiceResponse) {
    const result = evaluateGuidedPracticeResponse(practice, snapshot.practiceResponse);
    records.push({
      projectionKey: "guided:" + definition.learningUnitId + ":" + practice.id,
      kind: LEARNER_EVIDENCE_RECORD_KINDS.GUIDED_PRACTICE,
      ...common(practice),
      response: { kind: "guided-practice", value: snapshot.practiceResponse },
      outcome: {
        kind: "correctness",
        correct: result.correct,
        authority: LEARNER_EVIDENCE_SOURCES.GUIDED,
      },
    });
  }

  return {
    source: LEARNER_EVIDENCE_SOURCES.GUIDED,
    sourceRef: { activityRevision: definition.revision },
    lifecycle: {
      status: snapshot.sessionCompleted
        ? "completed"
        : snapshot.sessionStarted
          ? "in_progress"
          : "not_started",
      updatedAt: snapshot.updatedAt,
    },
    learnerState: { needsReview: snapshot.needsReview },
    records,
  };
}

function reduce(state, type, extra = {}) {
  return guidedFlowReducer(state, { type, ...extra });
}

function completeGuided(definition, needsReview = false) {
  const predict = definition.steps.find((step) => step.type === "predict");
  const experiment = definition.steps.find((step) => step.type === "experiment");
  const practice = definition.steps.find((step) => step.type === "practice");
  let state = createGuidedFlowState({
    learningUnitId: definition.learningUnitId,
    activityRevision: definition.revision,
  });

  state = reduce(state, GUIDED_FLOW_ACTIONS.START);
  state = reduce(state, GUIDED_FLOW_ACTIONS.SET_PREDICTION_DRAFT, {
    value: predict.reveal.expectedOptionId,
  });
  state = reduce(state, GUIDED_FLOW_ACTIONS.SUBMIT_PREDICTION);
  state = reduce(state, GUIDED_FLOW_ACTIONS.ACKNOWLEDGE_EXPERIMENT, {
    observation: experiment.expectedObservation,
  });
  state = reduce(state, GUIDED_FLOW_ACTIONS.SET_EXPLANATION, {
    value: "raw learner reasoning",
  });
  state = reduce(state, GUIDED_FLOW_ACTIONS.SUBMIT_EXPLANATION);
  state = reduce(state, GUIDED_FLOW_ACTIONS.SET_PRACTICE_DRAFT, {
    value: getExpectedGuidedPracticeResponse(practice),
  });
  state = reduce(state, GUIDED_FLOW_ACTIONS.SUBMIT_PRACTICE);
  if (needsReview) state = reduce(state, GUIDED_FLOW_ACTIONS.TOGGLE_NEEDS_REVIEW);
  return state;
}

function assessmentFixture({
  sessionId,
  status = "completed",
  startedAt = "2026-09-22T08:00:00.000Z",
  completedAt = "2026-09-22T08:02:00.000Z",
  correct = true,
}) {
  const question = getCanonicalAssessmentQuestions("props")[0];
  const session = {
    id: sessionId,
    learningUnitId: "props",
    items: [createSessionItem(question)],
    status,
    startedAt,
    completedAt,
  };
  const wrong = question.content.options.find(
    ({ id }) => id !== question.content.correctOptionId,
  ).id;
  const attempt = {
    id: "attempt-" + sessionId,
    sessionId,
    questionId: question.id,
    questionRevision: question.revision,
    answer: correct ? question.content.correctOptionId : wrong,
    correct,
    submittedAt: completedAt ?? "2026-09-22T08:01:00.000Z",
  };
  return { session, attempt };
}

test("Evidence V1 preserves Assessment provenance and persisted correctness", () => {
  const first = assessmentFixture({ sessionId: "a1", correct: true });
  const second = assessmentFixture({
    sessionId: "a2",
    startedAt: "2026-09-22T09:00:00.000Z",
    completedAt: "2026-09-22T09:02:00.000Z",
    correct: false,
  });
  const value = projection("props", [
    projectAssessmentSlice(first.session, [first.attempt]),
    projectAssessmentSlice(second.session, [second.attempt]),
  ]);

  assert.deepEqual(validateLearnerEvidenceProjection(value), {
    valid: true,
    errors: [],
  });
  assert.deepEqual(
    value.sources.map(({ sourceRef }) => sourceRef.sessionId),
    ["a1", "a2"],
  );
  assert.equal(value.sources[0].records[0].provenance.attemptId, "attempt-a1");
  assert.equal(value.sources[0].records[0].outcome.correct, true);
  assert.equal(value.sources[1].records[0].outcome.correct, false);
  assert.deepEqual(
    value.sources[0].records[0].task.snapshot,
    first.session.items[0].snapshot,
  );
  assert.equal("resolved" in value, false);
  assert.equal("retryCount" in value, false);
});

test("Evidence V1 keeps submitted attempts in an in-progress Assessment session", () => {
  const source = assessmentFixture({
    sessionId: "in-progress",
    status: "in_progress",
    completedAt: null,
  });
  const value = projection("props", [
    projectAssessmentSlice(source.session, [source.attempt]),
  ]);

  assert.deepEqual(validateLearnerEvidenceProjection(value), {
    valid: true,
    errors: [],
  });
  assert.equal(value.sources[0].lifecycle.status, "in_progress");
  assert.equal(value.sources[0].records.length, 1);
});

for (const learningUnitId of ["props", "render-commit"]) {
  test("Evidence V1 uses one Guided envelope for " + learningUnitId, () => {
    const definition = getGuidedActivityDefinition(learningUnitId);
    const snapshot = serializeGuidedSessionSnapshot(
      completeGuided(definition, true),
      {
        definition,
        updatedAt: "2026-09-22T11:00:00.000Z",
      },
    );
    const value = projection(learningUnitId, [
      projectGuidedSlice(snapshot, definition),
    ]);

    assert.deepEqual(validateLearnerEvidenceProjection(value), {
      valid: true,
      errors: [],
    });

    const source = value.sources[0];
    assert.equal(source.lifecycle.status, "completed");
    assert.equal(source.learnerState.needsReview, true);
    assert.equal("runId" in source.sourceRef, false);
    assert.deepEqual(
      source.records.map(({ kind }) => kind),
      [
        "guided-prediction",
        "guided-experiment-acknowledgement",
        "guided-explanation",
        "guided-practice",
      ],
    );

    const explanation = source.records[2];
    assert.equal(explanation.response.text, "raw learner reasoning");
    assert.equal(explanation.outcome, null);
    assert.equal(explanation.occurredAt, null);

    const practice = source.records[3];
    assert.equal(practice.outcome.correct, true);
    assert.equal(practice.outcome.authority, "guided");
    assert.equal(practice.occurredAt, null);

    assert.equal(
      practice.response.value.kind,
      learningUnitId === "props" ? "patch-choice" : "ordered-sequence",
    );
  });
}

test("Evidence V1 excludes Guided drafts and future steps", () => {
  const definition = getGuidedActivityDefinition("props");
  const predict = definition.steps.find((step) => step.type === "predict");
  let state = createGuidedFlowState({
    learningUnitId: definition.learningUnitId,
    activityRevision: definition.revision,
  });
  state = reduce(state, GUIDED_FLOW_ACTIONS.START);
  state = reduce(state, GUIDED_FLOW_ACTIONS.SET_PREDICTION_DRAFT, {
    value: predict.reveal.expectedOptionId,
  });

  const draft = serializeGuidedSessionSnapshot(state, {
    definition,
    updatedAt: "2026-09-22T12:00:00.000Z",
  });
  const draftValue = projection("props", [projectGuidedSlice(draft, definition)]);

  assert.deepEqual(validateLearnerEvidenceProjection(draftValue), {
    valid: true,
    errors: [],
  });
  assert.deepEqual(draftValue.sources[0].records, []);

  state = reduce(state, GUIDED_FLOW_ACTIONS.SUBMIT_PREDICTION);
  const committed = serializeGuidedSessionSnapshot(state, {
    definition,
    updatedAt: "2026-09-22T12:01:00.000Z",
  });
  const committedValue = projection("props", [
    projectGuidedSlice(committed, definition),
  ]);

  assert.equal(committedValue.sources[0].records.length, 1);
  assert.equal(committedValue.sources[0].records[0].kind, "guided-prediction");
  assert.equal(
    "predictionDraft" in committedValue.sources[0].records[0],
    false,
  );
});

test("Evidence V1 rejects invented authority and Guided event timestamps", () => {
  const definition = getGuidedActivityDefinition("props");
  const snapshot = serializeGuidedSessionSnapshot(completeGuided(definition), {
    definition,
    updatedAt: "2026-09-22T13:00:00.000Z",
  });
  const value = projection("props", [
    projectGuidedSlice(snapshot, definition),
  ]);

  value.mastery = 0.8;
  value.retryCount = 2;
  value.sources[0].records[0].occurredAt = "2026-09-22T12:59:00.000Z";

  const validation = validateLearnerEvidenceProjection(value);
  assert.equal(validation.valid, false);
  const codes = validation.errors.map(({ code }) => code);
  assert.ok(codes.includes("FORBIDDEN_DERIVED_AUTHORITY"));
  assert.ok(codes.includes("GUIDED_RECORD_TIME_NOT_OWNED"));
});
