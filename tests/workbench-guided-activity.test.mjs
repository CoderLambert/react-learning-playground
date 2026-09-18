import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  assertGuidedActivityDefinition,
  getGuidedActivity,
  getGuidedActivityDefinition,
  GUIDED_RESPONSE_KINDS,
  GUIDED_STEP_TYPES,
  hasGuidedActivity,
  STATE_SNAPSHOT_QUEUE_GUIDED_ACTIVITY,
  validateGuidedActivityDefinition,
} from "../src/workbench/guidedActivity.js";

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

test("lookup returns an explicit no-guided state for an unconfigured unit", () => {
  assert.equal(hasGuidedActivity("not-configured"), false);
  assert.equal(getGuidedActivityDefinition("not-configured"), null);
  assert.deepEqual(getGuidedActivity("not-configured"), {
    kind: "none",
    learningUnitId: "not-configured",
  });
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
