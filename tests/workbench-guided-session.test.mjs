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
    value: {
      kind: "patch-choice",
      optionId: "functional-updaters",
    },
  });
  return reduce(state, { type: GUIDED_FLOW_ACTIONS.SUBMIT_PRACTICE });
}

const definition = STATE_SNAPSHOT_QUEUE_GUIDED_ACTIVITY;
const fixedTimestamp = "2026-09-18T15:00:00.000Z";

function createDefinitionWithPractice(practiceStep) {
  return {
    ...definition,
    revision: definition.revision + 1,
    steps: definition.steps.map((step, index) => (index === 3 ? practiceStep : step)),
  };
}

function createCompletedStateForDefinition(customDefinition, practiceResponse) {
  let state = reduce(createGuidedFlowState({
    learningUnitId: customDefinition.learningUnitId,
    activityRevision: customDefinition.revision,
  }), { type: GUIDED_FLOW_ACTIONS.START });
  state = reduce(state, { type: GUIDED_FLOW_ACTIONS.SET_PREDICTION_DRAFT, value: "count-3" });
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
    value: practiceResponse,
  });
  return reduce(state, {
    type: GUIDED_FLOW_ACTIONS.SUBMIT_PRACTICE,
  });
}

test("serializes and restores the original Guided responses and current step", () => {
  const state = createReviewState();
  const snapshot = serializeGuidedSessionSnapshot(state, {
    definition,
    updatedAt: fixedTimestamp,
  });

  assert.deepEqual(snapshot, {
    schemaVersion: 2,
    learningUnitId: "state-snapshot-queue",
    activityRevision: 2,
    currentStepId: "review-snapshot-queue",
    predictionDraft: "count-3",
    firstPrediction: "count-3",
    experimentAcknowledged: true,
    observation: "next render state 为 1；三个 replace 都读取同一份 render snapshot。",
    explanation: "三个更新读取同一份 render snapshot。",
    explanationSubmitted: true,
    practiceDraft: {
      kind: "patch-choice",
      optionId: "functional-updaters",
    },
    practiceResponse: {
      kind: "patch-choice",
      optionId: "functional-updaters",
    },
    needsReview: false,
    completedSteps: [
      "predict-replace-triple",
      "experiment-replace-triple",
      "explain-shared-snapshot",
      "practice-compose-three-increments",
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
  assert.deepEqual(restored.practiceResponse, {
    kind: "patch-choice",
    optionId: "functional-updaters",
  });
  assert.equal(restored.needsReview, false);
  assert.equal(restored.completionState, "completed");
});

test("legacy v1 choice sessions still migrate when the authored choice activity itself is unchanged", () => {
  const legacyDefinition = {
    ...definition,
    revision: 1,
    steps: definition.steps.map((step, index) => (
      index === 3
        ? {
            id: "practice-updater-replace-semantics",
            type: "practice",
            prompt: "旧版 choice practice",
            response: {
              kind: "choice",
              options: [
                { id: "same-result-different-semantics", label: "结果相同但语义不同" },
                { id: "same-result-same-semantics", label: "结果相同且语义相同" },
              ],
            },
            reveal: {
              expectedOptionId: "same-result-different-semantics",
              observation: "旧版 choice activity 的迁移 fixture。",
            },
          }
        : step
    )),
  };
  const legacySnapshot = {
    schemaVersion: 1,
    learningUnitId: "state-snapshot-queue",
    activityRevision: 1,
    currentStepId: "review-snapshot-queue",
    predictionDraft: "count-3",
    firstPrediction: "count-3",
    experimentAcknowledged: true,
    observation: "next render state 为 1。",
    explanation: "三个更新读取同一份 render snapshot。",
    explanationSubmitted: true,
    practiceDraft: "same-result-different-semantics",
    practiceResponse: "same-result-different-semantics",
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
  };

  const decoded = deserializeGuidedSessionSnapshot(JSON.stringify(legacySnapshot), {
    definition: legacyDefinition,
  });
  assert.equal(decoded.status, GUIDED_SESSION_PERSISTENCE_STATUS.RESTORED);
  assert.equal(decoded.snapshot.schemaVersion, 2);
  assert.deepEqual(decoded.snapshot.practiceResponse, {
    kind: "choice",
    optionId: "same-result-different-semantics",
  });
  assert.equal(restoreGuidedFlowState(decoded.snapshot, { definition: legacyDefinition }).needsReview, false);
});

test("pre-V2 state-snapshot sessions fail safely after the lesson revision changes", () => {
  const legacyDefinition = {
    ...definition,
    revision: 1,
    steps: definition.steps.map((step, index) => (
      index === 3
        ? {
            id: "practice-updater-replace-semantics",
            type: "practice",
            prompt: "旧版 choice practice",
            response: {
              kind: "choice",
              options: [
                { id: "same-result-different-semantics", label: "结果相同但语义不同" },
                { id: "same-result-same-semantics", label: "结果相同且语义相同" },
              ],
            },
            reveal: {
              expectedOptionId: "same-result-different-semantics",
              observation: "旧版 choice activity。",
            },
          }
        : step
    )),
  };
  const oldState = createGuidedFlowState({
    learningUnitId: legacyDefinition.learningUnitId,
    activityRevision: legacyDefinition.revision,
  });
  const storage = createMemoryStorage({
    [getGuidedSessionStorageKey(definition.learningUnitId)]: JSON.stringify({
      schemaVersion: 1,
      learningUnitId: definition.learningUnitId,
      activityRevision: 1,
      currentStepId: "predict-replace-triple",
      predictionDraft: null,
      firstPrediction: null,
      experimentAcknowledged: false,
      observation: null,
      explanation: "",
      explanationSubmitted: false,
      practiceDraft: null,
      practiceResponse: null,
      completedSteps: [],
      sessionStarted: false,
      sessionCompleted: false,
      updatedAt: fixedTimestamp,
    }),
  });
  assert.equal(oldState.activityRevision, 1);

  const persistence = createGuidedSessionPersistence({ definition, storage });
  assert.equal(persistence.read().status, GUIDED_SESSION_PERSISTENCE_STATUS.INCOMPATIBLE);
  assert.equal(storage.getItem(persistence.key), null);
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
  const changedDefinition = { ...definition, revision: definition.revision + 1 };
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


test("patch-choice Practice responses persist and restore without collapsing into strings", () => {
  const patchDefinition = createDefinitionWithPractice({
    id: "practice-patch",
    type: "practice",
    prompt: "选择最小正确修复。",
    response: {
      kind: "patch-choice",
      options: [
        { id: "patch-good", label: "正确 patch", patch: "- bad()\n+ good()" },
        { id: "patch-wrong", label: "错误 patch", patch: "- bad()\n+ alsoBad()" },
      ],
    },
    reveal: {
      expectedOptionId: "patch-good",
      observation: "使用最小正确修复。",
    },
  });
  const response = { kind: "patch-choice", optionId: "patch-wrong" };
  const state = createCompletedStateForDefinition(patchDefinition, response);
  const snapshot = serializeGuidedSessionSnapshot(state, {
    definition: patchDefinition,
    updatedAt: fixedTimestamp,
  });

  assert.deepEqual(snapshot.practiceResponse, response);
  const decoded = deserializeGuidedSessionSnapshot(JSON.stringify(snapshot), {
    definition: patchDefinition,
  });
  assert.equal(decoded.status, GUIDED_SESSION_PERSISTENCE_STATUS.RESTORED);
  assert.deepEqual(
    restoreGuidedFlowState(decoded.snapshot, { definition: patchDefinition }).practiceResponse,
    response,
  );
});

test("ordered-sequence Practice responses persist their committed stable-id order", () => {
  const sequenceDefinition = createDefinitionWithPractice({
    id: "practice-sequence",
    type: "practice",
    prompt: "按执行顺序排列。",
    response: {
      kind: "ordered-sequence",
      items: [
        { id: "commit", label: "commit" },
        { id: "event", label: "event" },
        { id: "render", label: "render" },
        { id: "update", label: "update" },
      ],
    },
    reveal: {
      expectedOrder: ["event", "update", "render", "commit"],
      observation: "event → update → render → commit。",
    },
  });
  const response = {
    kind: "ordered-sequence",
    itemIds: ["event", "update", "render", "commit"],
  };
  const state = createCompletedStateForDefinition(sequenceDefinition, response);
  const snapshot = serializeGuidedSessionSnapshot(state, {
    definition: sequenceDefinition,
    updatedAt: fixedTimestamp,
  });

  assert.deepEqual(snapshot.practiceResponse, response);
  assert.equal(
    validateGuidedSessionSnapshot({
      ...snapshot,
      practiceResponse: {
        kind: "ordered-sequence",
        itemIds: ["event", "render", "render", "commit"],
      },
    }, { definition: sequenceDefinition }).valid,
    false,
  );
});
