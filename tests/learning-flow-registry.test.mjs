import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  SINGLE_LEARNING_FLOW_UNIT_IDS,
  getSingleLearningFlowDefinition,
  isSingleLearningFlowUnit,
} from "../src/learning-flow/learningFlowRegistry.js";

const CURRENT_VNEXT_IDS = [
  "component-jsx-pure-render",
  "props",
  "children",
  "multi-slots",
  "conditional-rendering",
  "rendering-lists-key",
  "prop-drilling",
  "event-propagation",
  "state-snapshot-queue",
  "immutable-state",
  "render-commit",
  "state-dry",
  "controlled-uncontrolled",
  "lifting-state-up",
  "preserving-resetting-state",
  "state-reducer",
  "context-propagation",
  "use-reduce-with-context",
  "use-ref",
  "use-effect-correct-usage",
];

test("single learning flow registry includes the current VNext rollout while preserving existing migrated lessons", () => {
  for (const learningUnitId of CURRENT_VNEXT_IDS) {
    const flow = getSingleLearningFlowDefinition(learningUnitId);
    assert.equal(flow.learningUnitId, learningUnitId);
    assert.equal(flow.conceptModel.learningUnitId, learningUnitId);
    assert.equal(typeof flow.aiReviewTarget, "string");
    assert.ok(flow.aiReviewTarget.trim().length > 0);
    assert.equal(flow.stageHints.verify.length > 0, true);
    assert.equal(isSingleLearningFlowUnit(learningUnitId), true);
  }

  const lists = getSingleLearningFlowDefinition("rendering-lists-key");
  const snapshot = getSingleLearningFlowDefinition("state-snapshot-queue");
  const effect = getSingleLearningFlowDefinition("not-need-effect");
  const preserveReset = getSingleLearningFlowDefinition("preserving-resetting-state");
  const lifecycle = getSingleLearningFlowDefinition("lifecycle-of-reactive-effects");

  assert.equal(snapshot.coreModelTitle, "Render Snapshot → Update Queue → Next Render State");
  assert.equal(snapshot.conceptModel.learningUnitId, "state-snapshot-queue");
  assert.match(snapshot.aiReviewTarget, /snapshot|queue/i);
  assert.match(lists.aiReviewTarget, /stable key|身份/);

  assert.equal(effect.coreModelTitle, "Why it runs → Where it belongs");
  assert.equal(effect.conceptModel.learningUnitId, "not-need-effect");
  assert.match(effect.mentalModel, /Event Handler/);
  assert.match(effect.mentalModel, /外部系统/);
  assert.match(effect.decisionRule, /memoization/);
  assert.match(effect.decisionRule, /identity/);

  assert.equal(preserveReset.coreModelTitle, "Identity match → Preserve State / New identity → Reset State");
  assert.equal(preserveReset.conceptModel.learningUnitId, "preserving-resetting-state");
  assert.match(preserveReset.decisionRule, /identity|State|key/);

  assert.equal(lifecycle.coreModelTitle, "Render → Commit → Cleanup(old) → Setup(new)");
  assert.equal(lifecycle.conceptModel.learningUnitId, "lifecycle-of-reactive-effects");
  assert.match(lifecycle.decisionRule, /functional updater/);
  assert.match(lifecycle.decisionRule, /Effect Event/);

  for (const learningUnitId of [
    "state-snapshot-queue",
    "not-need-effect",
    "preserving-resetting-state",
    "lifecycle-of-reactive-effects",
  ]) {
    assert.equal(isSingleLearningFlowUnit(learningUnitId), true);
  }

  assert.equal(isSingleLearningFlowUnit("event-vs-effect"), false);
  assert.equal(getSingleLearningFlowDefinition("event-vs-effect"), null);
  assert.equal(new Set(SINGLE_LEARNING_FLOW_UNIT_IDS).size, SINGLE_LEARNING_FLOW_UNIT_IDS.length);
});


test("the first 20 authoritative demos are VNext-complete without leaking rollout into later units", async () => {
  const registrySource = await readFile(new URL("../src/demos/index.js", import.meta.url), "utf8");
  const demosStart = registrySource.indexOf("export const demos = [");
  assert.notEqual(demosStart, -1);
  const demoIds = [...registrySource.slice(demosStart).matchAll(/\bid:\s*"([a-z0-9-]+)"/g)].map((match) => match[1]);

  assert.deepEqual(demoIds.slice(0, 20), CURRENT_VNEXT_IDS);
  assert.ok(CURRENT_VNEXT_IDS.every((learningUnitId) => isSingleLearningFlowUnit(learningUnitId)));

  const allowedExistingBeyondTwenty = new Set([
    "not-need-effect",
    "lifecycle-of-reactive-effects",
  ]);
  const migratedBeyondTwenty = demoIds
    .slice(20)
    .filter((learningUnitId) => isSingleLearningFlowUnit(learningUnitId));

  assert.deepEqual(
    [...migratedBeyondTwenty].sort(),
    [...allowedExistingBeyondTwenty].sort(),
    "unit 21+ must not receive accidental VNext rollout beyond the pre-existing pilot lessons",
  );
});
