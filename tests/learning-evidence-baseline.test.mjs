import assert from "node:assert/strict";
import test from "node:test";

import { createAssessmentSessionReview } from "../src/assessment/application/assessmentReview.js";
import {
  ASSESSMENT_SESSION_STATUSES,
  createSessionItem,
} from "../src/assessment/domain/assessmentSession.js";
import { assertAttempt } from "../src/assessment/domain/attempt.js";
import { getCanonicalAssessmentQuestions } from "../src/assessment/content/canonicalQuestions.js";
import { getGuidedActivityDefinition } from "../src/workbench/guidedActivity.js";
import {
  createGuidedFlowState,
  GUIDED_FLOW_ACTIONS,
  guidedFlowReducer,
} from "../src/workbench/guidedFlow.js";
import {
  getExpectedGuidedPracticeResponse,
} from "../src/workbench/guidedPractice.js";
import { getGuidedReviewModel } from "../src/workbench/guidedReview.js";
import {
  restoreGuidedFlowState,
  serializeGuidedSessionSnapshot,
} from "../src/workbench/guidedSessionStorage.js";

function reduce(state, type, extra = {}) {
  return guidedFlowReducer(state, { type, ...extra });
}

function completeGuided(definition, {
  explanation = "This is the learner's raw explanation.",
  needsReview = false,
} = {}) {
  const predict = definition.steps.find((step) => step.type === "predict");
  const experiment = definition.steps.find((step) => step.type === "experiment");
  const practice = definition.steps.find((step) => step.type === "practice");
  const prediction = predict.reveal.expectedOptionId;
  const practiceResponse = getExpectedGuidedPracticeResponse(practice);

  let state = createGuidedFlowState({
    learningUnitId: definition.learningUnitId,
    activityRevision: definition.revision,
  });
  state = reduce(state, GUIDED_FLOW_ACTIONS.START);
  state = reduce(state, GUIDED_FLOW_ACTIONS.SET_PREDICTION_DRAFT, { value: prediction });
  state = reduce(state, GUIDED_FLOW_ACTIONS.SUBMIT_PREDICTION);
  state = reduce(state, GUIDED_FLOW_ACTIONS.ACKNOWLEDGE_EXPERIMENT, {
    observation: experiment.expectedObservation,
  });
  state = reduce(state, GUIDED_FLOW_ACTIONS.SET_EXPLANATION, { value: explanation });
  state = reduce(state, GUIDED_FLOW_ACTIONS.SUBMIT_EXPLANATION);
  state = reduce(state, GUIDED_FLOW_ACTIONS.SET_PRACTICE_DRAFT, {
    value: practiceResponse,
  });
  state = reduce(state, GUIDED_FLOW_ACTIONS.SUBMIT_PRACTICE);
  if (needsReview) {
    state = reduce(state, GUIDED_FLOW_ACTIONS.TOGGLE_NEEDS_REVIEW);
  }
  return state;
}

test("Assessment source facts preserve frozen question provenance and formal attempt identity", () => {
  const questions = getCanonicalAssessmentQuestions("props").slice(0, 2);
  const session = {
    id: "session-evidence-a1",
    learningUnitId: "props",
    items: questions.map(createSessionItem),
    status: ASSESSMENT_SESSION_STATUSES.COMPLETED,
    startedAt: "2026-09-22T08:00:00.000Z",
    completedAt: "2026-09-22T08:02:00.000Z",
  };

  const correctAnswer = questions[0].content.correctOptionId;
  const wrongAnswer = questions[1].content.options
    .find(({ id }) => id !== questions[1].content.correctOptionId).id;

  const attempts = [
    {
      id: "attempt-a1-correct",
      sessionId: session.id,
      questionId: questions[0].id,
      questionRevision: questions[0].revision,
      answer: correctAnswer,
      correct: true,
      submittedAt: "2026-09-22T08:01:00.000Z",
    },
    {
      id: "attempt-a1-wrong",
      sessionId: session.id,
      questionId: questions[1].id,
      questionRevision: questions[1].revision,
      answer: wrongAnswer,
      correct: false,
      submittedAt: "2026-09-22T08:02:00.000Z",
    },
  ];

  for (const attempt of attempts) assert.doesNotThrow(() => assertAttempt(attempt));

  assert.equal(session.items[0].questionId, questions[0].id);
  assert.equal(session.items[0].revision, questions[0].revision);
  assert.deepEqual(session.items[0].snapshot, questions[0]);

  // Raw attempts own exact response identity and deterministic correctness.
  assert.deepEqual(
    attempts.map(({ id, sessionId, questionId, questionRevision, correct }) => ({
      id,
      sessionId,
      questionId,
      questionRevision,
      correct,
    })),
    [
      {
        id: "attempt-a1-correct",
        sessionId: session.id,
        questionId: questions[0].id,
        questionRevision: questions[0].revision,
        correct: true,
      },
      {
        id: "attempt-a1-wrong",
        sessionId: session.id,
        questionId: questions[1].id,
        questionRevision: questions[1].revision,
        correct: false,
      },
    ],
  );

  const review = createAssessmentSessionReview({ session, attempts });

  // Review is a UI-friendly derived projection: wrong answers are sorted first.
  assert.equal(review.items[0].questionId, questions[1].id);
  assert.equal(review.items[0].correct, false);
  assert.equal(review.incorrectCount, 1);

  // Exact attempt identity is not carried by the existing review projection.
  assert.equal("attemptId" in review.items[0], false);
  assert.equal("id" in review.items[0], false);
});

test("Guided completed snapshot owns committed raw evidence while correctness stays derived", () => {
  for (const learningUnitId of ["props", "render-commit"]) {
    const definition = getGuidedActivityDefinition(learningUnitId);
    const state = completeGuided(definition, {
      explanation: "raw learner reasoning for " + learningUnitId,
      needsReview: true,
    });
    const snapshot = serializeGuidedSessionSnapshot(state, {
      definition,
      updatedAt: "2026-09-22T08:10:00.000Z",
    });
    const review = getGuidedReviewModel(state, definition);

    assert.equal(snapshot.learningUnitId, learningUnitId);
    assert.equal(snapshot.activityRevision, definition.revision);
    assert.equal(snapshot.firstPrediction, state.firstPrediction);
    assert.equal(snapshot.experimentAcknowledged, true);
    assert.equal(snapshot.observation, state.observation);
    assert.equal(snapshot.explanation, "raw learner reasoning for " + learningUnitId);
    assert.equal(snapshot.explanationSubmitted, true);
    assert.deepEqual(snapshot.practiceResponse, state.practiceResponse);
    assert.equal(snapshot.needsReview, true);
    assert.equal(snapshot.sessionCompleted, true);
    assert.equal(snapshot.updatedAt, "2026-09-22T08:10:00.000Z");

    // Drafts persist for recovery but are distinct from submitted evidence.
    assert.deepEqual(snapshot.practiceDraft, snapshot.practiceResponse);
    assert.equal(snapshot.predictionDraft, snapshot.firstPrediction);

    // Practice correctness is derived by the existing Guided evaluator.
    assert.equal(review.practiceOutcome.correct, true);
    assert.equal(review.explanation, snapshot.explanation);
    assert.equal(review.needsReview, true);

    const restored = restoreGuidedFlowState(snapshot, { definition });
    assert.deepEqual(restored.practiceResponse, state.practiceResponse);
    assert.equal(restored.explanation, state.explanation);
    assert.equal(restored.needsReview, true);
  }
});

test("Guided drafts can persist without becoming committed evidence", () => {
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

  const snapshot = serializeGuidedSessionSnapshot(state, {
    definition,
    updatedAt: "2026-09-22T08:20:00.000Z",
  });

  assert.equal(snapshot.predictionDraft, predict.reveal.expectedOptionId);
  assert.equal(snapshot.firstPrediction, null);
  assert.equal(snapshot.experimentAcknowledged, false);
  assert.equal(snapshot.explanationSubmitted, false);
  assert.equal(snapshot.practiceResponse, null);
  assert.equal(snapshot.sessionCompleted, false);

  assert.equal(getGuidedReviewModel(state, definition), null);
});
