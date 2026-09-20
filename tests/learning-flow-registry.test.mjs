import assert from "node:assert/strict";
import test from "node:test";

import {
  getSingleLearningFlowDefinition,
  isSingleLearningFlowUnit,
} from "../src/learning-flow/learningFlowRegistry.js";

test("single learning flow registry keeps the three validated diagnostic lesson families sparse", () => {
  const lists = getSingleLearningFlowDefinition("rendering-lists-key");
  const snapshot = getSingleLearningFlowDefinition("state-snapshot-queue");
  const effect = getSingleLearningFlowDefinition("not-need-effect");

  assert.equal(lists.learningUnitId, "rendering-lists-key");
  assert.equal(snapshot.learningUnitId, "state-snapshot-queue");
  assert.equal(effect.learningUnitId, "not-need-effect");

  assert.equal(snapshot.coreModelTitle, "Render Snapshot → Update Queue → Next Render State");
  assert.equal(snapshot.conceptModel.learningUnitId, "state-snapshot-queue");

  assert.equal(effect.coreModelTitle, "Why it runs → Where it belongs");
  assert.equal(effect.conceptModel.learningUnitId, "not-need-effect");
  assert.match(effect.mentalModel, /Event Handler/);
  assert.match(effect.mentalModel, /外部系统/);
  assert.match(effect.decisionRule, /memoization/);
  assert.match(effect.decisionRule, /identity/);
  assert.equal(effect.stageHints.verify.length > 0, true);

  assert.equal(isSingleLearningFlowUnit("rendering-lists-key"), true);
  assert.equal(isSingleLearningFlowUnit("state-snapshot-queue"), true);
  assert.equal(isSingleLearningFlowUnit("not-need-effect"), true);
  assert.equal(isSingleLearningFlowUnit("props"), false);
  assert.equal(getSingleLearningFlowDefinition("props"), null);
});
