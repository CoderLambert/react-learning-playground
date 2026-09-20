import assert from "node:assert/strict";
import test from "node:test";

import {
  GUIDED_FLOW_ACTIONS,
  createGuidedFlowState,
  guidedFlowReducer,
} from "../src/workbench/guidedFlow.js";
import { STATE_SNAPSHOT_QUEUE_GUIDED_ACTIVITY } from "../src/workbench/guidedActivity.js";
import { getGuidedReviewModel } from "../src/workbench/guidedReview.js";

function completedState() {
  let state = guidedFlowReducer(
    createGuidedFlowState({ learningUnitId: "state-snapshot-queue", activityRevision: STATE_SNAPSHOT_QUEUE_GUIDED_ACTIVITY.revision }),
    { type: GUIDED_FLOW_ACTIONS.START },
  );
  for (const action of [
    { type: GUIDED_FLOW_ACTIONS.SET_PREDICTION_DRAFT, value: "count-3" },
    { type: GUIDED_FLOW_ACTIONS.SUBMIT_PREDICTION },
    { type: GUIDED_FLOW_ACTIONS.ACKNOWLEDGE_EXPERIMENT, observation: "next render state 为 1" },
    { type: GUIDED_FLOW_ACTIONS.SET_EXPLANATION, value: "三个更新读取同一份 render snapshot。" },
    { type: GUIDED_FLOW_ACTIONS.SUBMIT_EXPLANATION },
    {
      type: GUIDED_FLOW_ACTIONS.SET_PRACTICE_DRAFT,
      value: { kind: "patch-choice", optionId: "functional-updaters" },
    },
    { type: GUIDED_FLOW_ACTIONS.SUBMIT_PRACTICE },
  ]) state = guidedFlowReducer(state, action);
  return state;
}

test("review model exposes deterministic outcome facts and raw reasoning only", () => {
  const model = getGuidedReviewModel(completedState(), STATE_SNAPSHOT_QUEUE_GUIDED_ACTIVITY);

  assert.deepEqual(model.firstPrediction, { optionId: "count-3", label: "3" });
  assert.equal(model.actualObservation, "next render state 为 1");
  assert.equal(model.explanation, "三个更新读取同一份 render snapshot。");
  assert.equal(model.practiceOutcome.correct, true);
  assert.equal(model.practiceOutcome.response.kind, "patch-choice");
  assert.equal(model.practiceOutcome.response.optionId, "functional-updaters");
  assert.equal(model.practiceOutcome.response.label, "Patch A");
  assert.match(model.practiceOutcome.response.patch, /setCount\(\(n\) => n \+ 1\)/);
  assert.equal(model.practiceOutcome.expected.optionId, "functional-updaters");
  assert.match(model.practiceOutcome.rationale, /updater|queue/);
  assert.equal(model.needsReview, false);
  assert.deepEqual(model.resources, ["notes", "source", "demo"]);
  assert.equal("mastery" in model, false);
  assert.equal("skillLevel" in model, false);
});

test("review model is unavailable before a completed session", () => {
  const state = guidedFlowReducer(
    createGuidedFlowState({ learningUnitId: "state-snapshot-queue", activityRevision: STATE_SNAPSHOT_QUEUE_GUIDED_ACTIVITY.revision }),
    { type: GUIDED_FLOW_ACTIONS.START },
  );
  assert.equal(getGuidedReviewModel(state, STATE_SNAPSHOT_QUEUE_GUIDED_ACTIVITY), null);
});
