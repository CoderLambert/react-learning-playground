import assert from "node:assert/strict";
import test from "node:test";

import {
  createGuidedFlowState,
  GUIDED_FLOW_ACTIONS,
  GUIDED_FLOW_STEP_INDEX,
  getGuidedFlowUnlockedStep,
  guidedFlowReducer,
} from "../src/workbench/guidedFlow.js";
import { getGuidedActivityDefinition } from "../src/workbench/guidedActivity.js";

function reduce(state, action) {
  return guidedFlowReducer(state, action);
}

function startState(learningUnitId = "state-snapshot-queue") {
  const definition = getGuidedActivityDefinition(learningUnitId);
  return reduce(
    createGuidedFlowState({ learningUnitId, activityRevision: definition.revision }),
    { type: GUIDED_FLOW_ACTIONS.START },
  );
}

function expectedPracticeResponse(definition) {
  const practice = definition.steps[GUIDED_FLOW_STEP_INDEX.PRACTICE];
  if (practice.response.kind === "ordered-sequence") {
    return {
      kind: practice.response.kind,
      itemIds: [...practice.reveal.expectedOrder],
    };
  }
  return {
    kind: practice.response.kind,
    optionId: practice.reveal.expectedOptionId,
  };
}

test("Guided flow stores the first prediction before the experiment and reaches review", () => {
  let state = startState();
  state = reduce(state, {
    type: GUIDED_FLOW_ACTIONS.SET_PREDICTION_DRAFT,
    value: "count-3",
  });
  state = reduce(state, { type: GUIDED_FLOW_ACTIONS.SUBMIT_PREDICTION });
  assert.equal(state.firstPrediction, "count-3");
  assert.equal(state.stepIndex, GUIDED_FLOW_STEP_INDEX.EXPERIMENT);

  state = reduce(state, {
    type: GUIDED_FLOW_ACTIONS.ACKNOWLEDGE_EXPERIMENT,
    observation: "next render state 为 1",
  });
  state = reduce(state, {
    type: GUIDED_FLOW_ACTIONS.SET_EXPLANATION,
    value: "三个 replace 使用同一份 render snapshot。",
  });
  state = reduce(state, { type: GUIDED_FLOW_ACTIONS.SUBMIT_EXPLANATION });
  state = reduce(state, {
    type: GUIDED_FLOW_ACTIONS.SET_PRACTICE_DRAFT,
    value: {
      kind: "patch-choice",
      optionId: "functional-updaters",
    },
  });
  state = reduce(state, { type: GUIDED_FLOW_ACTIONS.SUBMIT_PRACTICE });

  assert.equal(state.stepIndex, GUIDED_FLOW_STEP_INDEX.REVIEW);
  assert.equal(state.completionState, "completed");
  assert.equal(state.observation, "next render state 为 1");
  assert.equal(state.explanation, "三个 replace 使用同一份 render snapshot。");
  assert.deepEqual(state.practiceResponse, {
    kind: "patch-choice",
    optionId: "functional-updaters",
  });
  assert.equal(state.needsReview, false);
  assert.equal(getGuidedFlowUnlockedStep(state), GUIDED_FLOW_STEP_INDEX.REVIEW);
});

test("the same reducer completes several new Guided definitions without lesson-specific state", () => {
  for (const learningUnitId of [
    "rendering-lists-key",
    "preserving-resetting-state",
    "not-need-effect",
    "lifecycle-of-reactive-effects",
  ]) {
    const definition = getGuidedActivityDefinition(learningUnitId);
    let state = startState(learningUnitId);
    state = reduce(state, {
      type: GUIDED_FLOW_ACTIONS.SET_PREDICTION_DRAFT,
      value: definition.steps[0].reveal.expectedOptionId,
    });
    state = reduce(state, { type: GUIDED_FLOW_ACTIONS.SUBMIT_PREDICTION });
    state = reduce(state, {
      type: GUIDED_FLOW_ACTIONS.ACKNOWLEDGE_EXPERIMENT,
      observation: definition.steps[1].expectedObservation,
    });
    state = reduce(state, {
      type: GUIDED_FLOW_ACTIONS.SET_EXPLANATION,
      value: `explanation for ${learningUnitId}`,
    });
    state = reduce(state, { type: GUIDED_FLOW_ACTIONS.SUBMIT_EXPLANATION });
    const practiceResponse = expectedPracticeResponse(definition);
    state = reduce(state, {
      type: GUIDED_FLOW_ACTIONS.SET_PRACTICE_DRAFT,
      value: practiceResponse,
    });
    state = reduce(state, { type: GUIDED_FLOW_ACTIONS.SUBMIT_PRACTICE });

    assert.equal(state.learningUnitId, learningUnitId);
    assert.equal(state.firstPrediction, definition.steps[0].reveal.expectedOptionId);
    assert.equal(state.observation, definition.steps[1].expectedObservation);
    assert.deepEqual(state.practiceResponse, practiceResponse);
    assert.equal(state.completionState, "completed");
    assert.equal(state.stepIndex, GUIDED_FLOW_STEP_INDEX.REVIEW);
  }
});

test("Needs Review is an explicit reversible state only at completed review", () => {
  let state = startState();
  state = reduce(state, { type: GUIDED_FLOW_ACTIONS.SET_PREDICTION_DRAFT, value: "count-3" });
  state = reduce(state, { type: GUIDED_FLOW_ACTIONS.SUBMIT_PREDICTION });
  state = reduce(state, {
    type: GUIDED_FLOW_ACTIONS.ACKNOWLEDGE_EXPERIMENT,
    observation: "next render state 为 1",
  });
  state = reduce(state, { type: GUIDED_FLOW_ACTIONS.SET_EXPLANATION, value: "我的原始解释" });
  state = reduce(state, { type: GUIDED_FLOW_ACTIONS.SUBMIT_EXPLANATION });
  state = reduce(state, { type: GUIDED_FLOW_ACTIONS.SET_PRACTICE_DRAFT, value: {
      kind: "patch-choice",
      optionId: "functional-updaters",
    } });
  state = reduce(state, { type: GUIDED_FLOW_ACTIONS.SUBMIT_PRACTICE });

  state = reduce(state, { type: GUIDED_FLOW_ACTIONS.TOGGLE_NEEDS_REVIEW });
  assert.equal(state.needsReview, true);
  state = reduce(state, { type: GUIDED_FLOW_ACTIONS.TOGGLE_NEEDS_REVIEW });
  assert.equal(state.needsReview, false);

  state = reduce(state, { type: GUIDED_FLOW_ACTIONS.NAVIGATE, stepIndex: GUIDED_FLOW_STEP_INDEX.PREDICT });
  const unchanged = reduce(state, { type: GUIDED_FLOW_ACTIONS.TOGGLE_NEEDS_REVIEW });
  assert.equal(unchanged.needsReview, false);
});

test("first prediction is frozen across ordinary navigation and only reset starts a new run", () => {
  let state = startState();
  state = reduce(state, { type: GUIDED_FLOW_ACTIONS.SET_PREDICTION_DRAFT, value: "count-3" });
  state = reduce(state, { type: GUIDED_FLOW_ACTIONS.SUBMIT_PREDICTION });
  state = reduce(state, { type: GUIDED_FLOW_ACTIONS.NAVIGATE, stepIndex: GUIDED_FLOW_STEP_INDEX.PREDICT });
  state = reduce(state, { type: GUIDED_FLOW_ACTIONS.SET_PREDICTION_DRAFT, value: "count-1" });
  state = reduce(state, { type: GUIDED_FLOW_ACTIONS.SUBMIT_PREDICTION, value: "count-1" });

  assert.equal(state.firstPrediction, "count-3");
  assert.equal(state.predictionDraft, "count-3");
  assert.equal(state.stepIndex, GUIDED_FLOW_STEP_INDEX.PREDICT);

  state = reduce(state, { type: GUIDED_FLOW_ACTIONS.START_OVER });
  assert.equal(state.active, true);
  assert.equal(state.firstPrediction, null);
  assert.equal(state.predictionDraft, null);
  assert.equal(state.stepIndex, GUIDED_FLOW_STEP_INDEX.PREDICT);
});

test("lesson reset isolates all temporary Guided responses", () => {
  let state = startState("state-snapshot-queue");
  state = reduce(state, { type: GUIDED_FLOW_ACTIONS.SET_PREDICTION_DRAFT, value: "count-2" });
  state = reduce(state, { type: GUIDED_FLOW_ACTIONS.SUBMIT_PREDICTION });
  state = reduce(state, {
    type: GUIDED_FLOW_ACTIONS.SET_EXPLANATION,
    value: "temporary explanation",
  });

  state = reduce(state, {
    type: GUIDED_FLOW_ACTIONS.RESET_SESSION,
    learningUnitId: "rendering-lists-key",
    activityRevision: getGuidedActivityDefinition("rendering-lists-key").revision,
  });

  assert.deepEqual(state, {
    ...createGuidedFlowState({
      learningUnitId: "rendering-lists-key",
      activityRevision: getGuidedActivityDefinition("rendering-lists-key").revision,
    }),
  });
});

test("exit returns to free explore without silently changing the recorded session", () => {
  let state = startState();
  state = reduce(state, { type: GUIDED_FLOW_ACTIONS.SET_PREDICTION_DRAFT, value: "count-1" });
  state = reduce(state, { type: GUIDED_FLOW_ACTIONS.SUBMIT_PREDICTION });
  state = reduce(state, { type: GUIDED_FLOW_ACTIONS.EXIT });

  assert.equal(state.active, false);
  assert.equal(state.firstPrediction, "count-1");
  state = reduce(state, { type: GUIDED_FLOW_ACTIONS.START });
  assert.equal(state.active, true);
  assert.equal(state.firstPrediction, "count-1");
});
