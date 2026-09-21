import assert from "node:assert/strict";
import test from "node:test";

import {
  createGuidedFlowState,
  guidedFlowReducer,
  GUIDED_FLOW_ACTIONS,
} from "../src/workbench/guidedFlow.js";
import { STATE_SNAPSHOT_QUEUE_GUIDED_ACTIVITY } from "../src/workbench/guidedActivity.js";
import {
  createGuidedSessionPersistence,
  getGuidedSessionStorageKey,
  GUIDED_SESSION_PERSISTENCE_STATUS,
  readGuidedSessionReviewSignal,
} from "../src/workbench/guidedSessionStorage.js";

function createMemoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
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

function reduce(state, action) {
  return guidedFlowReducer(state, action);
}

function createCompletedState() {
  const definition = STATE_SNAPSHOT_QUEUE_GUIDED_ACTIVITY;
  let state = reduce(createGuidedFlowState({
    learningUnitId: definition.learningUnitId,
    activityRevision: definition.revision,
  }), { type: GUIDED_FLOW_ACTIONS.START });

  for (const action of [
    { type: GUIDED_FLOW_ACTIONS.SET_PREDICTION_DRAFT, value: "count-1" },
    { type: GUIDED_FLOW_ACTIONS.SUBMIT_PREDICTION },
    {
      type: GUIDED_FLOW_ACTIONS.ACKNOWLEDGE_EXPERIMENT,
      observation: "三个 replace 读取同一份 render snapshot。",
    },
    {
      type: GUIDED_FLOW_ACTIONS.SET_EXPLANATION,
      value: "setter 把更新请求加入 queue，不会改写当前 snapshot。",
    },
    { type: GUIDED_FLOW_ACTIONS.SUBMIT_EXPLANATION },
    {
      type: GUIDED_FLOW_ACTIONS.SET_PRACTICE_DRAFT,
      value: { kind: "patch-choice", optionId: "functional-updaters" },
    },
    { type: GUIDED_FLOW_ACTIONS.SUBMIT_PRACTICE },
  ]) {
    state = reduce(state, action);
  }

  return state;
}

test("persisted Guided needsReview is readable without a second Review store", () => {
  const definition = STATE_SNAPSHOT_QUEUE_GUIDED_ACTIVITY;
  const storage = createMemoryStorage();
  const persistence = createGuidedSessionPersistence({ definition, storage });

  let state = createCompletedState();
  state = reduce(state, { type: GUIDED_FLOW_ACTIONS.TOGGLE_NEEDS_REVIEW });
  assert.equal(persistence.write(state).ok, true);

  assert.deepEqual(readGuidedSessionReviewSignal({ definition, storage }), {
    status: GUIDED_SESSION_PERSISTENCE_STATUS.RESTORED,
    needsReview: true,
  });

  state = reduce(state, { type: GUIDED_FLOW_ACTIONS.TOGGLE_NEEDS_REVIEW });
  assert.equal(persistence.write(state).ok, true);
  assert.deepEqual(readGuidedSessionReviewSignal({ definition, storage }), {
    status: GUIDED_SESSION_PERSISTENCE_STATUS.RESTORED,
    needsReview: false,
  });
});

test("Guided review projection read is non-destructive for malformed persisted data", () => {
  const definition = STATE_SNAPSHOT_QUEUE_GUIDED_ACTIVITY;
  const key = getGuidedSessionStorageKey(definition.learningUnitId);
  const storage = createMemoryStorage({ [key]: "{bad-json" });

  assert.deepEqual(readGuidedSessionReviewSignal({ definition, storage }), {
    status: GUIDED_SESSION_PERSISTENCE_STATUS.INVALID,
    needsReview: false,
  });
  assert.equal(storage.getItem(key), "{bad-json");
});
