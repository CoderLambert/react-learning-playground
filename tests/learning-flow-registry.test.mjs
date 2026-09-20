import assert from "node:assert/strict";
import test from "node:test";

import {
  getSingleLearningFlowDefinition,
  isSingleLearningFlowUnit,
} from "../src/learning-flow/learningFlowRegistry.js";

test("single learning flow registry keeps Lists & Key and adds State Snapshot without widening to unrelated units", () => {
  const lists = getSingleLearningFlowDefinition("rendering-lists-key");
  const snapshot = getSingleLearningFlowDefinition("state-snapshot-queue");

  assert.equal(lists.learningUnitId, "rendering-lists-key");
  assert.equal(snapshot.learningUnitId, "state-snapshot-queue");
  assert.equal(snapshot.coreModelTitle, "Render Snapshot → Update Queue → Next Render State");
  assert.equal(snapshot.conceptModel.learningUnitId, "state-snapshot-queue");
  assert.equal(snapshot.stageHints.verify.length > 0, true);

  assert.equal(isSingleLearningFlowUnit("rendering-lists-key"), true);
  assert.equal(isSingleLearningFlowUnit("state-snapshot-queue"), true);
  assert.equal(isSingleLearningFlowUnit("props"), false);
  assert.equal(getSingleLearningFlowDefinition("props"), null);
});
