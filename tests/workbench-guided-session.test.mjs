import assert from "node:assert/strict";
import test from "node:test";

import { createFixedClock } from "../src/platform/clock.js";
import {
  GUIDED_FLOW_ACTIONS,
  guidedFlowReducer,
  createGuidedFlowState,
} from "../src/workbench/guidedFlow.js";
import {
  createGuidedSessionPersistence,
  deserializeGuidedSessionSnapshot,
  GUIDED_SESSION_PERSISTENCE_STATUS,
  getGuidedSessionStorageKey,
  restoreGuidedFlowState,
  serializeGuidedSessionSnapshot,
  validateGuidedSessionSnapshot,
} from "../src/workbench/guidedSessionStorage.js";
import { STATE_SNAPSHOT_QUEUE_GUIDED_ACTIVITY } from "../src/workbench/guidedActivity.js";

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
    dump() {
      return Object.fromEntries(values.entries());
    },
  };
}

function createUnavailableStorage() {
  return {
    getItem() {
      throw new Error("storage denied");
    },
    setItem() {
      throw new Error("storage denied");
    },
    removeItem() {
      throw new Error("storage denied");
    },
  };
}

function reduce(state, action) {
  return guidedFlowReducer(state, action);
}

function createStartedState() {
  return reduce(
    createGuidedFlowState({
      learningUnitId: STATE_SNAPSHOT_QUEUE_GUIDED_ACTIVITY.learningUnitId,
      activityRevision: STATE_SNAPSHOT_QUEUE_GUIDED_ACTIVITY.revision,
    }),
    { type: GUIDED_FLOW_ACTIONS.START },
  );
}

function createReviewState() {
  let state = createStartedState();
  state = reduce(state, {
    type: GUIDED_FLOW_ACTIONS.SET_PREDICTION_DRAFT,
    value: "count-3",
  });
  state = reduce(state, { type: GUIDED_FLOW_ACTIONS.SUBMIT_PREDICTION });
  state = reduce(state, {
    type: GUIDED_FLOW_ACTIONS.ACKNOWLEDGE_EXPERIMENT,
    observation: "next render state 为 1；三个 replace 都读取同一份 render snapshot。",
  });
  state = reduce(state, {
    type: GUIDED_FLOW_ACTIONS.SET_EXPLANATION,
    value: "三个更新读取同一份 render snapshot。",
  });
  state = reduce(state, { type: GUIDED_FLOW_ACTIONS.SUBMIT_EXPLANATION });
  state = reduce(state, {
    type: GUIDED_FLOW_ACTIONS.SET_PRACTICE_DRAFT,
    value: "same-result-different-semantics",
  });
  return reduce(state, { type: GUIDED_FLOW_ACTIONS.SUBMIT_PRACTICE });
}

const definition = STATE_SNAPSHOT_QUEUE_GUIDED_ACTIVITY;
const fixedTimestamp = "2026-09-18T15:00:00.000Z";

test("serializes and restores the original Guided responses and current step", () => {
  const state = createReviewState();
  const snapshot = serializeGuidedSessionSnapshot(state, {
    definition,
    updatedAt: fixedTimestamp,
  });

  assert.deepEqual(snapshot, {
    schemaVersion: 1,
    learningUnitId: "state-snapshot-queue",
    activityRevision: 1,
    currentStepId: "review-snapshot-queue",
    predictionDraft: "count-3",
    firstPrediction: "count-3",
    experimentAcknowledged: true,
    observation: "next render state 为 1；三个 replace 都读取同一份 render snapshot。",
    explanation: "三个更新读取同一份 render snapshot。",
    explanationSubmitted: true,
    practiceDraft: "same-result-different-semantics",
    practiceResponse: "same-result-different-semantics",
    needsReview: false,
    completedSteps: [
      "predict-replace-triple",
      "experiment-replace-triple",
      "explain-shared-snapshot",
      "practice-updater-replace-semantics",
      "review-snapshot-queue",
    ],
    sessionStarted: true,
    sessionCompleted: true,
    updatedAt: fixedTimestamp,
  });

  const decoded = deserializeGuidedSessionSnapshot(JSON.stringify(snapshot), { definition });
  assert.equal(decoded.status, GUIDED_SESSION_PERSISTENCE_STATUS.RESTORED);
  const restored = restoreGuidedFlowState(decoded.snapshot, { definition });
  assert.equal(restored.active, false);
  assert.equal(restored.stepIndex, 4);
  assert.equal(restored.firstPrediction, "count-3");
  assert.equal(restored.explanation, "三个更新读取同一份 render snapshot。");
  assert.equal(restored.practiceResponse, "same-result-different-semantics");
  assert.equal(restored.needsReview, false);
  assert.equal(restored.completionState, "completed");
});

test("Needs Review persists without making older v1 snapshots incompatible", () => {
  const state = reduce(createReviewState(), { type: GUIDED_FLOW_ACTIONS.TOGGLE_NEEDS_REVIEW });
  const snapshot = serializeGuidedSessionSnapshot(state, { definition, updatedAt: fixedTimestamp });
  assert.equal(snapshot.needsReview, true);
  assert.equal(restoreGuidedFlowState(snapshot, { definition }).needsReview, true);

  const legacySnapshot = { ...snapshot };
  delete legacySnapshot.needsReview;
  const legacyDecoded = deserializeGuidedSessionSnapshot(JSON.stringify(legacySnapshot), { definition });
  assert.equal(legacyDecoded.status, GUIDED_SESSION_PERSISTENCE_STATUS.RESTORED);
  assert.equal(restoreGuidedFlowState(legacyDecoded.snapshot, { definition }).needsReview, false);
});

test("in-progress draft and first prediction survive restore without changing identity", () => {
  let state = createStartedState();
  state = reduce(state, { type: GUIDED_FLOW_ACTIONS.SET_PREDICTION_DRAFT, value: "count-2" });
  state = reduce(state, { type: GUIDED_FLOW_ACTIONS.SUBMIT_PREDICTION });
  state = reduce(state, {
    type: GUIDED_FLOW_ACTIONS.ACKNOWLEDGE_EXPERIMENT,
    observation: "next render state 为 1。",
  });
  state = reduce(state, {
    type: GUIDED_FLOW_ACTIONS.SET_EXPLANATION,
    value: "我的原始解释还没有提交。",
  });

  const snapshot = serializeGuidedSessionSnapshot(state, { definition, updatedAt: fixedTimestamp });
  const restored = restoreGuidedFlowState(snapshot, { definition });
  assert.equal(restored.stepIndex, 2);
  assert.equal(restored.firstPrediction, "count-2");
  assert.equal(restored.predictionDraft, "count-2");
  assert.equal(restored.explanation, "我的原始解释还没有提交。");
  assert.equal(restored.explanationSubmitted, false);

  let resumed = reduce(restored, { type: GUIDED_FLOW_ACTIONS.START });
  resumed = reduce(resumed, { type: GUIDED_FLOW_ACTIONS.NAVIGATE, stepIndex: 0 });
  resumed = reduce(resumed, { type: GUIDED_FLOW_ACTIONS.SET_PREDICTION_DRAFT, value: "count-1" });
  assert.equal(resumed.firstPrediction, "count-2");
  assert.equal(resumed.predictionDraft, "count-2");
});

test("persistence is lesson-scoped and invalid lesson data is rejected", () => {
  const storage = createMemoryStorage();
  const persistence = createGuidedSessionPersistence({
    definition,
    storage,
    clock: createFixedClock(fixedTimestamp),
  });
  persistence.write(createReviewState());

  assert.equal(getGuidedSessionStorageKey("state-snapshot-queue"), persistence.key);
  const otherDefinition = {
    ...definition,
    learningUnitId: "rendering-lists-key",
  };
  const otherPersistence = createGuidedSessionPersistence({ definition: otherDefinition, storage });
  assert.equal(otherPersistence.read().status, GUIDED_SESSION_PERSISTENCE_STATUS.EMPTY);

  storage.setItem(otherPersistence.key, JSON.stringify({
    ...JSON.parse(storage.getItem(persistence.key)),
    learningUnitId: "state-snapshot-queue",
  }));
  assert.equal(otherPersistence.read().status, GUIDED_SESSION_PERSISTENCE_STATUS.INVALID);
  assert.equal(storage.getItem(otherPersistence.key), null);
});

test("malformed and impossible snapshots fall back safely", () => {
  const key = getGuidedSessionStorageKey(definition.learningUnitId);
  const malformedStorage = createMemoryStorage({ [key]: "{not-json" });
  const malformed = createGuidedSessionPersistence({ definition, storage: malformedStorage });
  assert.equal(malformed.read().status, GUIDED_SESSION_PERSISTENCE_STATUS.INVALID);
  assert.equal(malformedStorage.getItem(key), null);

  const valid = serializeGuidedSessionSnapshot(createReviewState(), { definition, updatedAt: fixedTimestamp });
  const impossibleStorage = createMemoryStorage({
    [key]: JSON.stringify({ ...valid, currentStepId: "unknown-step" }),
  });
  const impossible = createGuidedSessionPersistence({ definition, storage: impossibleStorage });
  assert.equal(impossible.read().status, GUIDED_SESSION_PERSISTENCE_STATUS.INVALID);
  assert.equal(impossibleStorage.getItem(key), null);
});

test("activity revision mismatch invalidates old responses instead of migrating them", () => {
  const snapshot = serializeGuidedSessionSnapshot(createReviewState(), { definition, updatedAt: fixedTimestamp });
  const changedDefinition = { ...definition, revision: 2 };
  const validation = validateGuidedSessionSnapshot(snapshot, { definition: changedDefinition });
  assert.equal(validation.valid, false);
  assert.equal(validation.reason, GUIDED_SESSION_PERSISTENCE_STATUS.INCOMPATIBLE);

  const storage = createMemoryStorage({
    [getGuidedSessionStorageKey(definition.learningUnitId)]: JSON.stringify(snapshot),
  });
  const persistence = createGuidedSessionPersistence({ definition: changedDefinition, storage });
  assert.equal(persistence.read().status, GUIDED_SESSION_PERSISTENCE_STATUS.INCOMPATIBLE);
  assert.equal(storage.getItem(persistence.key), null);
});

test("invalid Needs Review data fails closed", () => {
  const snapshot = serializeGuidedSessionSnapshot(createReviewState(), { definition, updatedAt: fixedTimestamp });
  const validation = validateGuidedSessionSnapshot({ ...snapshot, needsReview: "yes" }, { definition });
  assert.equal(validation.valid, false);
  assert.match(validation.errors.join("; "), /needsReview must be boolean/);
});

test("explicit clear removes the persisted session and unavailable storage stays session-local", () => {
  const storage = createMemoryStorage();
  const persistence = createGuidedSessionPersistence({ definition, storage });
  persistence.write(createReviewState());
  assert.equal(persistence.read().status, GUIDED_SESSION_PERSISTENCE_STATUS.RESTORED);
  assert.equal(persistence.clear().ok, true);
  assert.equal(persistence.read().status, GUIDED_SESSION_PERSISTENCE_STATUS.EMPTY);

  const unavailable = createGuidedSessionPersistence({
    definition,
    storage: createUnavailableStorage(),
  });
  assert.equal(unavailable.read().status, GUIDED_SESSION_PERSISTENCE_STATUS.UNAVAILABLE);
  assert.equal(unavailable.write(createReviewState()).ok, false);
  assert.equal(unavailable.clear().ok, false);
  assert.equal(createStartedState().learningUnitId, definition.learningUnitId);
});
