import assert from "node:assert/strict";
import test from "node:test";

import { createAssessmentRuntime } from "../src/assessment/composition/assessmentRuntime.js";
import { getCanonicalAssessmentQuestions } from "../src/assessment/content/canonicalQuestions.js";
import {
  createLearnerEvidenceRuntime,
  LearnerEvidenceProjectionError,
  LearnerEvidenceSourceError,
  validateLearnerEvidenceProjection,
} from "../src/learning-evidence/public.js";
import { createFixedClock } from "../src/platform/clock.js";
import { getGuidedActivityDefinition } from "../src/workbench/guidedActivity.js";
import {
  createGuidedEvidenceSource,
  GUIDED_EVIDENCE_SOURCE_STATUS,
} from "../src/workbench/evidencePublic.js";
import {
  createGuidedFlowState,
  GUIDED_FLOW_ACTIONS,
  guidedFlowReducer,
} from "../src/workbench/guidedFlow.js";
import { getExpectedGuidedPracticeResponse } from "../src/workbench/guidedPractice.js";
import {
  createGuidedSessionPersistence,
  getGuidedSessionStorageKey,
  serializeGuidedSessionSnapshot,
} from "../src/workbench/guidedSessionStorage.js";

function createMemoryStorage() {
  const values = new Map();
  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
    removeItem(key) {
      values.delete(key);
    },
  };
}

function reduce(state, type, extra = {}) {
  return guidedFlowReducer(state, { type, ...extra });
}

function completeGuided(definition, { needsReview = false } = {}) {
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
    value: "Learner explains the mechanism in their own words.",
  });
  state = reduce(state, GUIDED_FLOW_ACTIONS.SUBMIT_EXPLANATION);
  state = reduce(state, GUIDED_FLOW_ACTIONS.SET_PRACTICE_DRAFT, {
    value: getExpectedGuidedPracticeResponse(practice),
  });
  state = reduce(state, GUIDED_FLOW_ACTIONS.SUBMIT_PRACTICE);
  if (needsReview) state = reduce(state, GUIDED_FLOW_ACTIONS.TOGGLE_NEEDS_REVIEW);
  return state;
}

async function seedAssessment(runtime, learningUnitId) {
  const questions = getCanonicalAssessmentQuestions(learningUnitId).slice(0, 2);
  const session = await runtime.sessionLifecycle.start({
    learningUnitId,
    questionRecords: questions,
  });

  await runtime.sessionLifecycle.submit({
    learningUnitId,
    sessionId: session.id,
    questionId: questions[0].id,
    answer: questions[0].content.correctOptionId,
  });

  const wrong = questions[1].content.options.find(
    ({ id }) => id !== questions[1].content.correctOptionId,
  ).id;
  await runtime.sessionLifecycle.submit({
    learningUnitId,
    sessionId: session.id,
    questionId: questions[1].id,
    answer: wrong,
  });

  return { session, questions };
}

function seedGuided(storage, learningUnitId, options = {}) {
  const definition = getGuidedActivityDefinition(learningUnitId);
  const persistence = createGuidedSessionPersistence({
    definition,
    storage,
    clock: createFixedClock("2026-09-22T12:00:00.000Z"),
  });
  const write = persistence.write(completeGuided(definition, options));
  assert.equal(write.ok, true);
  return { definition, snapshot: write.snapshot };
}

test("Learner Evidence runtime canary reads Assessment and Guided owners through one API", async () => {
  let id = 0;
  const assessmentRuntime = await createAssessmentRuntime({
    indexedDb: undefined,
    clock: createFixedClock("2026-09-22T11:00:00.000Z"),
    idFactory: (prefix) => prefix + "-evidence-" + (++id),
    evidenceResolver: () => true,
  });
  const { session } = await seedAssessment(assessmentRuntime, "props");

  const storage = createMemoryStorage();
  seedGuided(storage, "props", { needsReview: true });

  const runtime = createLearnerEvidenceRuntime({
    assessmentSource: assessmentRuntime.evidenceSource,
    guidedSource: createGuidedEvidenceSource({ storage }),
  });
  const evidence = await runtime.read({ learningUnitId: "props" });

  assert.deepEqual(validateLearnerEvidenceProjection(evidence), {
    valid: true,
    errors: [],
  });

  assert.equal(evidence.sources.length, 2);
  const assessment = evidence.sources.find(({ source }) => source === "assessment");
  const guided = evidence.sources.find(({ source }) => source === "guided");

  assert.equal(assessment.sourceRef.sessionId, session.id);
  assert.equal(assessment.lifecycle.status, "completed");
  assert.equal(assessment.records.length, 2);
  assert.deepEqual(
    assessment.records.map(({ outcome }) => outcome.correct),
    [true, false],
  );
  assert.ok(assessment.records.every(({ provenance }) => provenance.attemptId));
  assert.ok(assessment.records.every(({ task }) => task.snapshot?.content));

  assert.equal(guided.lifecycle.status, "completed");
  assert.equal(guided.learnerState.needsReview, true);
  assert.deepEqual(
    guided.records.map(({ kind }) => kind),
    [
      "guided-prediction",
      "guided-experiment-acknowledgement",
      "guided-explanation",
      "guided-practice",
    ],
  );
  assert.equal(guided.records[2].outcome, null);
  assert.equal(guided.records[3].outcome.correct, true);
  assert.equal(guided.records[3].response.value.kind, "patch-choice");

  assert.equal("mastery" in evidence, false);
  assert.equal("score" in evidence, false);
  assert.equal("aiVerdict" in evidence, false);
});

test("Learner Evidence runtime preserves ordered-sequence Guided Practice without a second envelope", async () => {
  const storage = createMemoryStorage();
  seedGuided(storage, "render-commit");

  const runtime = createLearnerEvidenceRuntime({
    assessmentSource: { async read() { return []; } },
    guidedSource: createGuidedEvidenceSource({ storage }),
  });
  const evidence = await runtime.read({ learningUnitId: "render-commit" });

  assert.deepEqual(validateLearnerEvidenceProjection(evidence), {
    valid: true,
    errors: [],
  });

  const practice = evidence.sources[0].records.find(
    ({ kind }) => kind === "guided-practice",
  );
  assert.equal(practice.response.value.kind, "ordered-sequence");
  assert.equal(practice.outcome.correct, true);
  assert.equal(practice.outcome.authority, "guided");
});

test("Learner Evidence runtime represents empty Guided persistence as not_started without fake records", async () => {
  const storage = createMemoryStorage();
  const runtime = createLearnerEvidenceRuntime({
    assessmentSource: { async read() { return []; } },
    guidedSource: createGuidedEvidenceSource({ storage }),
  });
  const evidence = await runtime.read({ learningUnitId: "props" });

  assert.deepEqual(validateLearnerEvidenceProjection(evidence), {
    valid: true,
    errors: [],
  });
  assert.equal(evidence.sources.length, 1);
  assert.equal(evidence.sources[0].source, "guided");
  assert.equal(evidence.sources[0].lifecycle.status, "not_started");
  assert.deepEqual(evidence.sources[0].records, []);
  assert.equal(evidence.sources[0].learnerState.needsReview, false);
});

test("Learner Evidence runtime fails closed on incompatible Guided persistence", async () => {
  const storage = createMemoryStorage();
  const definition = getGuidedActivityDefinition("props");
  const snapshot = serializeGuidedSessionSnapshot(completeGuided(definition), {
    definition,
    updatedAt: "2026-09-22T13:00:00.000Z",
  });
  snapshot.activityRevision += 1;
  storage.setItem(
    getGuidedSessionStorageKey("props"),
    JSON.stringify(snapshot),
  );

  const runtime = createLearnerEvidenceRuntime({
    assessmentSource: { async read() { return []; } },
    guidedSource: createGuidedEvidenceSource({ storage }),
  });
  await assert.rejects(
    runtime.read({ learningUnitId: "props" }),
    (error) => (
      error instanceof LearnerEvidenceSourceError
      && error.source === "guided"
      && error.status === GUIDED_EVIDENCE_SOURCE_STATUS.INCOMPATIBLE
    ),
  );
});

test("Learner Evidence projection fails closed when Assessment provenance is inconsistent", async () => {
  const question = getCanonicalAssessmentQuestions("props")[0];
  const badSource = {
    session: {
      id: "bad-session",
      learningUnitId: "props",
      items: [],
      status: "completed",
      startedAt: "2026-09-22T14:00:00.000Z",
      completedAt: "2026-09-22T14:01:00.000Z",
    },
    attempts: [{
      id: "bad-attempt",
      sessionId: "bad-session",
      questionId: question.id,
      questionRevision: question.revision,
      answer: question.content.correctOptionId,
      correct: true,
      submittedAt: "2026-09-22T14:01:00.000Z",
    }],
  };

  const runtime = createLearnerEvidenceRuntime({
    assessmentSource: { async read() { return [badSource]; } },
    guidedSource: createGuidedEvidenceSource({
      storage: createMemoryStorage(),
    }),
  });

  await assert.rejects(
    runtime.read({ learningUnitId: "props" }),
    (error) => (
      error instanceof LearnerEvidenceProjectionError
      && error.code === "ASSESSMENT_QUESTION_PROVENANCE_MISSING"
    ),
  );
});

test("Learner Evidence contract does not scan opaque source payload keys as projection authority", () => {
  const value = {
    contractVersion: "learner-evidence-v1",
    learningUnitId: "props",
    sources: [{
      source: "assessment",
      sourceRef: { sessionId: "opaque-session" },
      lifecycle: {
        status: "completed",
        startedAt: "2026-09-22T15:00:00.000Z",
        completedAt: "2026-09-22T15:01:00.000Z",
      },
      records: [{
        projectionKey: "assessment:attempt:opaque",
        kind: "assessment-answer",
        task: {
          id: "q",
          revision: 1,
          snapshot: { content: { score: "source-authored field" } },
        },
        response: {
          kind: "answer",
          value: { confidence: "source response payload" },
        },
        outcome: {
          kind: "correctness",
          correct: true,
          authority: "assessment",
        },
        occurredAt: "2026-09-22T15:01:00.000Z",
        provenance: {
          owner: "assessment",
          sessionId: "opaque-session",
          attemptId: "opaque",
          questionId: "q",
          questionRevision: 1,
        },
      }],
    }],
  };

  assert.deepEqual(validateLearnerEvidenceProjection(value), {
    valid: true,
    errors: [],
  });
});
