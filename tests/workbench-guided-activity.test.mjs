import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  assertGuidedActivityDefinition,
  GUIDED_ACTIVITY_DEFINITIONS,
  getGuidedActivity,
  getGuidedActivityDefinition,
  GUIDED_RESPONSE_KINDS,
  GUIDED_STEP_TYPES,
  hasGuidedActivity,
  STATE_SNAPSHOT_QUEUE_GUIDED_ACTIVITY,
  validateGuidedActivityDefinition,
} from "../src/workbench/guidedActivity.js";

const TARGET_LEARNING_UNIT_IDS = [
  "state-snapshot-queue",
  "rendering-lists-key",
  "preserving-resetting-state",
  "not-need-effect",
  "lifecycle-of-reactive-effects",
];

const FROZEN_EXPECTED_OPTIONS = {
  "state-snapshot-queue": { predict: "count-1", practice: "same-result-different-semantics" },
  "rendering-lists-key": { predict: "stays-first-position", practice: "stable-task-id" },
  "preserving-resetting-state": { predict: "draft-preserved", practice: "stable-product-key" },
  "not-need-effect": { predict: "derive-during-render", practice: "render-event-effect" },
  "lifecycle-of-reactive-effects": { predict: "cleanup-then-setup", practice: "connection-target-only" },
};

const FROZEN_EXPERIMENT_ACTIONS = {
  "state-snapshot-queue": "replace-three-times",
  "rendering-lists-key": "compare-index-and-stable-key",
  "preserving-resetting-state": "compare-preserved-and-keyed-chat",
  "not-need-effect": "exercise-render-event-identity-boundaries",
  "lifecycle-of-reactive-effects": "observe-room-resynchronization",
};

function createValidDefinition(overrides = {}) {
  return {
    learningUnitId: "fixture-lesson",
    revision: 1,
    goal: "建立一个可观察的 React mental model。",
    steps: [
      {
        id: "predict-answer",
        type: GUIDED_STEP_TYPES.PREDICT,
        prompt: "你预测会发生什么？",
        response: {
          kind: GUIDED_RESPONSE_KINDS.CHOICE,
          options: [
            { id: "answer-a", label: "答案 A" },
            { id: "answer-b", label: "答案 B" },
          ],
        },
        reveal: { expectedOptionId: "answer-a", observation: "观察到答案 A。" },
      },
      {
        id: "experiment-demo",
        type: GUIDED_STEP_TYPES.EXPERIMENT,
        prompt: "运行 Demo 并记录观察。",
        demoActionId: "run-demo",
        expectedObservation: "Demo 显示预期结果。",
      },
      {
        id: "explain-model",
        type: GUIDED_STEP_TYPES.EXPLAIN,
        prompt: "用自己的话解释原因。",
        response: { kind: GUIDED_RESPONSE_KINDS.TEXT },
      },
      {
        id: "practice-transfer",
        type: GUIDED_STEP_TYPES.PRACTICE,
        prompt: "把这个模型迁移到新情境。",
        response: {
          kind: GUIDED_RESPONSE_KINDS.CHOICE,
          options: [
            { id: "transfer-a", label: "迁移答案" },
            { id: "transfer-b", label: "其他答案" },
          ],
        },
        reveal: { expectedOptionId: "transfer-a", observation: "迁移答案成立。" },
      },
      {
        id: "review-evidence",
        type: GUIDED_STEP_TYPES.REVIEW,
        prompt: "回顾 Notes、Source 与 Demo。",
        resources: ["notes", "source", "demo"],
      },
    ],
    ...overrides,
  };
}

test("state-snapshot-queue is a sparse, frozen Guided Activity fixture", () => {
  const definition = getGuidedActivityDefinition("state-snapshot-queue");

  assert.equal(definition, STATE_SNAPSHOT_QUEUE_GUIDED_ACTIVITY);
  assert.ok(Object.isFrozen(definition));
  assert.ok(Object.isFrozen(definition.steps));
  assert.deepEqual(
    definition.steps.map(({ type }) => type),
    ["predict", "experiment", "explain", "practice", "review"],
  );
  assert.deepEqual(validateGuidedActivityDefinition(definition), { valid: true, errors: [] });
});

test("the first five Guided definitions are available, frozen, and follow the contract", async () => {
  const registrySource = await readFile(new URL("../src/demos/index.js", import.meta.url), "utf8");
  const demosStart = registrySource.indexOf("export const demos = [");
  assert.notEqual(demosStart, -1);
  const demoIds = [...registrySource.slice(demosStart).matchAll(/\bid:\s*"([a-z0-9-]+)"/g)].map((match) => match[1]);

  assert.deepEqual(Object.keys(GUIDED_ACTIVITY_DEFINITIONS).sort(), [...TARGET_LEARNING_UNIT_IDS].sort());
  for (const learningUnitId of TARGET_LEARNING_UNIT_IDS) {
    assert.ok(demoIds.includes(learningUnitId), `${learningUnitId} must exist in the authoritative demo registry`);
    const definition = getGuidedActivityDefinition(learningUnitId);
    assert.ok(definition);
    assert.equal(definition, GUIDED_ACTIVITY_DEFINITIONS[learningUnitId]);
    assert.ok(Object.isFrozen(definition));
    assert.ok(Object.isFrozen(definition.steps));
    assert.deepEqual(validateGuidedActivityDefinition(definition), { valid: true, errors: [] });
    assert.deepEqual(
      definition.steps.map(({ type }) => type),
      ["predict", "experiment", "explain", "practice", "review"],
    );
    assert.equal(new Set(definition.steps.map(({ id }) => id)).size, definition.steps.length);
    for (const step of definition.steps) {
      if (step.response?.kind === GUIDED_RESPONSE_KINDS.CHOICE) {
        assert.equal(new Set(step.response.options.map(({ id }) => id)).size, step.response.options.length);
      }
    }
    assert.deepEqual(definition.steps.at(-1).resources, ["notes", "source", "demo"]);
    assert.equal(definition.steps[0].reveal.expectedOptionId, FROZEN_EXPECTED_OPTIONS[learningUnitId].predict);
    if (learningUnitId === "rendering-lists-key") {
      assert.equal(
        definition.steps[0].response.options.find(({ id }) => id === "stays-first-position")?.label,
        "仍留在第一行，因此看起来跟到了「发布生产版本 / Carol」",
      );
    }
    assert.equal(definition.steps[1].demoActionId, FROZEN_EXPERIMENT_ACTIONS[learningUnitId]);
    assert.equal(definition.steps[3].reveal.expectedOptionId, FROZEN_EXPECTED_OPTIONS[learningUnitId].practice);
  }
});

test("lookup returns an explicit no-guided state for an unconfigured unit", () => {
  for (const learningUnitId of ["not-configured", "immutable-state", "render-vs-dom-update"]) {
    assert.equal(hasGuidedActivity(learningUnitId), false);
    assert.equal(getGuidedActivityDefinition(learningUnitId), null);
    assert.deepEqual(getGuidedActivity(learningUnitId), {
      kind: "none",
      learningUnitId,
    });
  }
  assert.deepEqual(getGuidedActivity("state-snapshot-queue"), {
    kind: "definition",
    definition: STATE_SNAPSHOT_QUEUE_GUIDED_ACTIVITY,
  });
});

test("duplicate step ids are rejected deterministically", () => {
  const definition = createValidDefinition();
  definition.steps[4].id = definition.steps[0].id;

  const result = validateGuidedActivityDefinition(definition);
  assert.equal(result.valid, false);
  assert.deepEqual(result.errors, ['steps contains duplicate id "predict-answer"']);
  assert.throws(() => assertGuidedActivityDefinition(definition), /duplicate id "predict-answer"/);
});

test("unsupported step types are rejected deterministically", () => {
  const definition = createValidDefinition();
  definition.steps[2].type = "mastery";

  const result = validateGuidedActivityDefinition(definition);
  assert.equal(result.valid, false);
  assert.ok(result.errors.includes('steps[2].type "mastery" is unsupported'));
  assert.ok(result.errors.some((error) => error.includes("must express predict -> experiment -> explain -> practice -> review")));
});

test("choice responses require stable option identity separate from display labels", () => {
  const definition = createValidDefinition();
  definition.steps[0].response.options[1].id = definition.steps[0].response.options[0].id;

  const result = validateGuidedActivityDefinition(definition);
  assert.equal(result.valid, false);
  assert.ok(result.errors.includes('steps[0].response.options contains duplicate id "answer-a"'));
});

test("Guided contract does not copy Learning Unit catalog fields or score fields", async () => {
  const definition = STATE_SNAPSHOT_QUEUE_GUIDED_ACTIVITY;
  assert.deepEqual(
    Object.keys(definition).sort(),
    ["goal", "learningUnitId", "revision", "steps"],
  );
  for (const forbiddenField of ["title", "category", "chapter", "order", "Component", "masteryPercentage", "skillScore"]) {
    assert.equal(Object.hasOwn(definition, forbiddenField), false, forbiddenField);
  }
  const publicSource = await readFile(new URL("../src/workbench/public.js", import.meta.url), "utf8");
  assert.match(publicSource, /getGuidedActivityDefinition/);
});
