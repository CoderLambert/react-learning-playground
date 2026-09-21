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
  "component-jsx-pure-render",
  "props",
  "children",
  "multi-slots",
  "conditional-rendering",
  "rendering-lists-key",
  "prop-drilling",
  "state-snapshot-queue",
  "preserving-resetting-state",
  "not-need-effect",
  "lifecycle-of-reactive-effects",
];

const CODE_CONTEXT_LEARNING_UNIT_IDS = new Set([
  "component-jsx-pure-render",
  "props",
  "children",
  "multi-slots",
  "conditional-rendering",
  "rendering-lists-key",
  "prop-drilling",
  "state-snapshot-queue",
]);

const FROZEN_EXPECTED_PRACTICE = {
  "component-jsx-pure-render": {
    predict: "same-result",
    kind: GUIDED_RESPONSE_KINDS.PATCH_CHOICE,
    expectedOptionId: "remove-external-sequence",
  },
  "props": {
    predict: "new-prop-rendered",
    kind: GUIDED_RESPONSE_KINDS.PATCH_CHOICE,
    expectedOptionId: "derive-during-render",
  },
  "children": {
    predict: "nothing-about-form",
    kind: GUIDED_RESPONSE_KINDS.PATCH_CHOICE,
    expectedOptionId: "accept-children",
  },
  "multi-slots": {
    predict: "footer-hidden",
    kind: GUIDED_RESPONSE_KINDS.PATCH_CHOICE,
    expectedOptionId: "explicit-three-state",
  },
  "conditional-rendering": {
    predict: "only-error",
    kind: GUIDED_RESPONSE_KINDS.PATCH_CHOICE,
    expectedOptionId: "derive-is-empty",
  },
  "rendering-lists-key": {
    predict: "stays-first-position",
    kind: GUIDED_RESPONSE_KINDS.PATCH_CHOICE,
    expectedOptionId: "stable-todo-id-key",
  },
  "prop-drilling": {
    predict: "all-update",
    kind: GUIDED_RESPONSE_KINDS.PATCH_CHOICE,
    expectedOptionId: "compose-avatar-from-page",
  },
  "state-snapshot-queue": {
    predict: "count-1",
    kind: GUIDED_RESPONSE_KINDS.PATCH_CHOICE,
    expectedOptionId: "functional-updaters",
  },
  "preserving-resetting-state": {
    predict: "draft-preserved",
    kind: GUIDED_RESPONSE_KINDS.PATCH_CHOICE,
    expectedOptionId: "key-editor-by-customer",
  },
  "not-need-effect": {
    predict: "derive-during-render",
    kind: GUIDED_RESPONSE_KINDS.PATCH_CHOICE,
    expectedOptionId: "derive-visible-products",
  },
  "lifecycle-of-reactive-effects": {
    predict: "cleanup-then-setup",
    kind: GUIDED_RESPONSE_KINDS.ORDERED_SEQUENCE,
    expectedOrder: [
      "change-topic",
      "render-new-topic",
      "commit-new-render",
      "cleanup-old-subscription",
      "setup-new-subscription",
    ],
  },
};
const FROZEN_EXPERIMENT_ACTIONS = {
  "component-jsx-pure-render": "compare-pure-and-impure-calculation",
  "props": "edit-parent-props-inputs",
  "children": "compare-children-composition",
  "multi-slots": "compare-slot-three-state-contract",
  "conditional-rendering": "switch-four-conditional-states",
  "rendering-lists-key": "compare-index-and-stable-key",
  "prop-drilling": "compare-props-composition-context",
  "state-snapshot-queue": "replace-three-times",
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

test("all currently migrated Guided definitions are available, frozen, and follow the shared contract", async () => {
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
    assert.ok(Number.isInteger(definition.revision) && definition.revision >= 1);
    assert.deepEqual(definition.steps.at(-1).resources, ["notes", "source", "demo"]);

    const expected = FROZEN_EXPECTED_PRACTICE[learningUnitId];
    const practiceStep = definition.steps[3];
    if (CODE_CONTEXT_LEARNING_UNIT_IDS.has(learningUnitId)) {
      assert.equal(typeof practiceStep.codeContext?.code, "string");
      assert.ok(practiceStep.codeContext.code.trim().length > 0);
    } else {
      assert.equal(practiceStep.codeContext, undefined);
    }

    assert.equal(definition.steps[0].reveal.expectedOptionId, expected.predict);
    assert.equal(definition.steps[1].demoActionId, FROZEN_EXPERIMENT_ACTIONS[learningUnitId]);
    assert.equal(practiceStep.response.kind, expected.kind);

    if (expected.kind === GUIDED_RESPONSE_KINDS.ORDERED_SEQUENCE) {
      assert.deepEqual(practiceStep.reveal.expectedOrder, expected.expectedOrder);
      assert.equal(new Set(practiceStep.response.items.map(({ id }) => id)).size, practiceStep.response.items.length);
    } else {
      assert.equal(practiceStep.reveal.expectedOptionId, expected.expectedOptionId);
      assert.equal(new Set(practiceStep.response.options.map(({ id }) => id)).size, practiceStep.response.options.length);
      assert.ok(practiceStep.response.options.every(({ patch }) => typeof patch === "string" && patch.trim()));
    }
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


test("Practice V2 accepts a bounded patch-choice contract with stable ids", () => {
  const definition = createValidDefinition();
  definition.steps[3] = {
    id: "practice-patch",
    type: GUIDED_STEP_TYPES.PRACTICE,
    prompt: "选择最小正确修复。",
    response: {
      kind: GUIDED_RESPONSE_KINDS.PATCH_CHOICE,
      options: [
        {
          id: "use-updater",
          label: "改为 functional updater",
          patch: "- setCount(count + 1)\n+ setCount((value) => value + 1)",
        },
        {
          id: "keep-snapshot",
          label: "继续读取 snapshot",
          patch: "- setCount(count + 1)\n+ setCount(count + 2)",
        },
      ],
    },
    reveal: {
      expectedOptionId: "use-updater",
      observation: "updater 会从 queue 中前一项结果继续计算。",
    },
  };

  assert.deepEqual(validateGuidedActivityDefinition(definition), { valid: true, errors: [] });
});

test("Practice codeContext is optional but must contain inspectable code when present", () => {
  const definition = createValidDefinition();
  definition.steps[3].codeContext = {
    label: "当前实现",
    language: "jsx",
    code: "<Row key={index} />",
  };
  assert.deepEqual(validateGuidedActivityDefinition(definition), { valid: true, errors: [] });

  definition.steps[3].codeContext.code = "   ";
  const invalid = validateGuidedActivityDefinition(definition);
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.includes("steps[3].codeContext.code must be a non-blank string"));
});

test("Practice V2 rejects patch alternatives without inspectable patch text", () => {
  const definition = createValidDefinition();
  definition.steps[3] = {
    id: "practice-patch",
    type: GUIDED_STEP_TYPES.PRACTICE,
    prompt: "选择最小正确修复。",
    response: {
      kind: GUIDED_RESPONSE_KINDS.PATCH_CHOICE,
      options: [
        { id: "patch-a", label: "方案 A", patch: "" },
        { id: "patch-b", label: "方案 B", patch: "+ valid();" },
      ],
    },
    reveal: {
      expectedOptionId: "patch-b",
      observation: "方案 B 保留目标语义。",
    },
  };

  const result = validateGuidedActivityDefinition(definition);
  assert.equal(result.valid, false);
  assert.ok(result.errors.includes("steps[3].response.options[0].patch must be a non-blank string"));
});

test("Practice V2 accepts ordered-sequence only when expectedOrder is a complete stable-id permutation", () => {
  const definition = createValidDefinition();
  definition.steps[3] = {
    id: "practice-sequence",
    type: GUIDED_STEP_TYPES.PRACTICE,
    prompt: "按真实执行顺序排列。",
    response: {
      kind: GUIDED_RESPONSE_KINDS.ORDERED_SEQUENCE,
      items: [
        { id: "commit", label: "commit" },
        { id: "event", label: "event" },
        { id: "render", label: "render" },
        { id: "update", label: "update" },
      ],
    },
    reveal: {
      expectedOrder: ["event", "update", "render", "commit"],
      observation: "事件触发更新，React 随后 render 并 commit。",
    },
  };

  assert.deepEqual(validateGuidedActivityDefinition(definition), { valid: true, errors: [] });

  definition.steps[3].reveal.expectedOrder = ["event", "update", "render", "unknown"];
  const invalid = validateGuidedActivityDefinition(definition);
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.includes(
    "steps[3].reveal.expectedOrder must contain every response item id exactly once",
  ));
});


test("the migrated practices use applied deterministic artifacts rather than conceptual choice recall", () => {
  const practiceKinds = new Set();
  for (const learningUnitId of TARGET_LEARNING_UNIT_IDS) {
    const definition = getGuidedActivityDefinition(learningUnitId);
    const practiceStep = definition.steps[3];
    practiceKinds.add(practiceStep.response.kind);
    assert.notEqual(practiceStep.response.kind, GUIDED_RESPONSE_KINDS.CHOICE);
    assert.notEqual(practiceStep.prompt, definition.steps[0].prompt);
  }

  assert.deepEqual(
    [...practiceKinds].sort(),
    [GUIDED_RESPONSE_KINDS.ORDERED_SEQUENCE, GUIDED_RESPONSE_KINDS.PATCH_CHOICE].sort(),
  );
});
