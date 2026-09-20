import assert from "node:assert/strict";
import test from "node:test";

import {
  getConceptModelForLearningUnit,
  getMisconceptionForLearningUnit,
} from "../src/content/conceptModels.js";

test("Lists & Key concept model separates the mechanism layers needed for reorder reasoning", () => {
  const model = getConceptModelForLearningUnit("rendering-lists-key");

  assert.equal(model.learningUnitId, "rendering-lists-key");
  assert.deepEqual(
    model.mechanismMap.map((item) => item.id),
    [
      "business-entity",
      "key",
      "props",
      "component-identity",
      "local-state",
      "dom",
    ],
  );
  assert.deepEqual(
    model.contrastCases.map((item) => item.id),
    ["index-reorder", "stable-reorder", "strategy-switch"],
  );
});

test("observed learner misconceptions have deterministic counter-evidence and experiments", () => {
  const ids = [
    "dom-not-updated",
    "state-lives-in-dom",
    "stable-key-remounts",
    "id-changes-with-data",
  ];

  for (const id of ids) {
    const misconception = getMisconceptionForLearningUnit("rendering-lists-key", id);
    assert.ok(misconception, `missing misconception ${id}`);
    assert.ok(misconception.diagnosis.length > 0);
    assert.ok(misconception.counterEvidence.length > 0);
    assert.ok(misconception.experiment.length > 0);
    assert.ok(misconception.evidenceRefs.length > 0);
  }
});

test("concept-model lookup remains sparse and lesson-scoped", () => {
  assert.equal(getConceptModelForLearningUnit("props"), null);
  assert.equal(getMisconceptionForLearningUnit("props", "dom-not-updated"), null);
  assert.equal(getMisconceptionForLearningUnit("rendering-lists-key", "unknown"), null);
});
