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

test("State Snapshot concept model separates snapshot, queue items, queue processing and next render", () => {
  const model = getConceptModelForLearningUnit("state-snapshot-queue");

  assert.equal(model.learningUnitId, "state-snapshot-queue");
  assert.deepEqual(
    model.mechanismMap.map((item) => item.id),
    [
      "render-snapshot",
      "update-request",
      "replace-update",
      "updater-function",
      "update-queue",
      "next-render-state",
    ],
  );
  assert.deepEqual(
    model.contrastCases.map((item) => item.id),
    ["replace-three", "updater-three", "mixed-queue"],
  );
  assert.deepEqual(
    model.contrastDimensions.map((item) => item.id),
    ["handlerStory", "queueStory", "processingStory", "resultStory"],
  );
});

test("observed Lists & Key misconceptions have deterministic counter-evidence and experiments", () => {
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

test("State Snapshot misconceptions are backed by queue evidence rather than async folklore", () => {
  const ids = [
    "setter-mutates-snapshot",
    "repeated-replace-accumulates",
    "updater-is-syntax-sugar",
    "queue-keeps-last-only",
    "same-result-same-semantics",
    "last-result-means-last-only",
  ];

  for (const id of ids) {
    const misconception = getMisconceptionForLearningUnit("state-snapshot-queue", id);
    assert.ok(misconception, `missing misconception ${id}`);
    assert.ok(misconception.diagnosis.length > 0);
    assert.ok(misconception.counterEvidence.length > 0);
    assert.ok(misconception.experiment.length > 0);
    assert.ok(misconception.evidenceRefs.length > 0);
  }
});


test("You Might Not Need an Effect models causal source instead of API categories", () => {
  const model = getConceptModelForLearningUnit("not-need-effect");

  assert.equal(model.learningUnitId, "not-need-effect");
  assert.deepEqual(
    model.mechanismMap.map((item) => item.id),
    [
      "render-derivation",
      "event-caused-logic",
      "external-synchronization",
      "identity-reset",
      "memoization",
    ],
  );
  assert.deepEqual(
    model.contrastCases.map((item) => item.id),
    ["derived-list", "purchase-event", "external-sync", "identity-reset"],
  );
  assert.deepEqual(
    model.contrastDimensions.map((item) => item.id),
    ["causeStory", "placementStory", "failureStory", "boundaryStory"],
  );
});

test("Effect-decision misconceptions include deterministic counter-evidence and experiments", () => {
  const ids = [
    "derived-needs-effect-state",
    "side-effect-means-effect",
    "state-change-needs-effect",
    "effect-is-change-listener",
    "expensive-means-effect",
    "key-reset-is-universal",
  ];

  for (const id of ids) {
    const misconception = getMisconceptionForLearningUnit("not-need-effect", id);
    assert.ok(misconception, `missing Effect misconception ${id}`);
    assert.ok(misconception.diagnosis.length > 0);
    assert.ok(misconception.counterEvidence.length > 0);
    assert.ok(misconception.experiment.length > 0);
    assert.ok(misconception.evidenceRefs.length > 0);
  }
});

test("Preserving / Resetting State models identity matching and boundary placement", () => {
  const model = getConceptModelForLearningUnit("preserving-resetting-state");

  assert.equal(model.learningUnitId, "preserving-resetting-state");
  assert.deepEqual(
    model.mechanismMap.map((item) => item.id),
    [
      "business-entity",
      "tree-slot",
      "component-type",
      "key",
      "component-identity",
      "local-state",
    ],
  );
  assert.deepEqual(
    model.contrastCases.map((item) => item.id),
    [
      "prop-change-preserves",
      "business-key-resets",
      "narrow-reset-boundary",
      "unstable-key-over-resets",
    ],
  );
  assert.deepEqual(
    model.contrastDimensions.map((item) => item.id),
    ["inputStory", "identityStory", "stateStory", "productStory"],
  );
});

test("Preserving / Resetting misconceptions have deterministic identity counter-evidence", () => {
  const ids = [
    "props-reset-state",
    "state-follows-business-object",
    "key-only-for-lists",
    "key-is-dom-refresh",
    "random-key-is-reset-strategy",
    "reset-boundary-too-high",
  ];

  for (const id of ids) {
    const misconception = getMisconceptionForLearningUnit("preserving-resetting-state", id);
    assert.ok(misconception, `missing Preserve/Reset misconception ${id}`);
    assert.ok(misconception.diagnosis.length > 0);
    assert.ok(misconception.counterEvidence.length > 0);
    assert.ok(misconception.experiment.length > 0);
    assert.ok(misconception.evidenceRefs.length > 0);
  }
});

test("Effect Lifecycle models external synchronization instead of dependency-array folklore", () => {
  const model = getConceptModelForLearningUnit("lifecycle-of-reactive-effects");

  assert.equal(model.learningUnitId, "lifecycle-of-reactive-effects");
  assert.deepEqual(
    model.mechanismMap.map((item) => item.id),
    [
      "render-reactive-read",
      "commit",
      "sync-target",
      "effect-cleanup",
      "effect-setup",
      "functional-updater",
      "effect-event",
      "strict-mode-check",
    ],
  );
  assert.deepEqual(
    model.contrastCases.map((item) => item.id),
    [
      "room-target-change",
      "muted-event-behavior",
      "message-updater",
      "strict-mode-development",
    ],
  );
  assert.deepEqual(
    model.contrastDimensions.map((item) => item.id),
    ["triggerStory", "syncStory", "dependencyStory", "boundaryStory"],
  );
});

test("Effect Lifecycle misconceptions have deterministic synchronization counter-evidence", () => {
  const ids = [
    "dependency-array-run-switch",
    "cleanup-only-on-unmount",
    "setup-before-old-cleanup",
    "every-changing-value-reconnects",
    "remove-true-dependency",
    "updater-is-dependency-hack",
    "effect-event-is-dependency-hack",
    "strict-mode-is-production-duplicate",
  ];

  for (const id of ids) {
    const misconception = getMisconceptionForLearningUnit("lifecycle-of-reactive-effects", id);
    assert.ok(misconception, `missing Effect Lifecycle misconception ${id}`);
    assert.ok(misconception.diagnosis.length > 0);
    assert.ok(misconception.counterEvidence.length > 0);
    assert.ok(misconception.experiment.length > 0);
    assert.ok(misconception.evidenceRefs.length > 0);
  }
});

test("current rollout concept models expose source-backed VNext authoring and lookup stays lesson-scoped", () => {
  for (const learningUnitId of [
    "component-jsx-pure-render",
    "props",
    "children",
    "multi-slots",
    "conditional-rendering",
    "prop-drilling",
    "event-propagation",
    "immutable-state",
    "render-commit",
    "state-dry",
    "controlled-uncontrolled",
    "lifting-state-up",
    "preserving-resetting-state",
    "state-reducer",
    "context-propagation",
    "use-reduce-with-context",
  ]) {
    const model = getConceptModelForLearningUnit(learningUnitId);
    assert.equal(model.learningUnitId, learningUnitId);
    assert.ok(model.codeEvidence?.length >= 2, `${learningUnitId} must expose source-backed code evidence`);
    assert.ok(Object.keys(model.misconceptions ?? {}).length >= 3, `${learningUnitId} must expose misconceptions`);
  }

  assert.equal(getMisconceptionForLearningUnit("props", "dom-not-updated"), null);
  assert.equal(getConceptModelForLearningUnit("use-ref"), null);
  assert.equal(getMisconceptionForLearningUnit("use-ref", "unknown"), null);
  assert.equal(getMisconceptionForLearningUnit("rendering-lists-key", "unknown"), null);
  assert.equal(getMisconceptionForLearningUnit("state-snapshot-queue", "unknown"), null);
  assert.equal(getMisconceptionForLearningUnit("not-need-effect", "unknown"), null);
  assert.equal(getMisconceptionForLearningUnit("preserving-resetting-state", "unknown"), null);
  assert.equal(getMisconceptionForLearningUnit("lifecycle-of-reactive-effects", "unknown"), null);
});
