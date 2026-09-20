import { GUIDED_PRACTICE_KINDS } from "./guidedPractice.js";

const STABLE_ID_PATTERN = /^[a-z0-9][a-z0-9-]*$/;
const FORBIDDEN_FIELD_NAMES = new Set([
  "mastery",
  "masteryPercentage",
  "skill",
  "skillScore",
  "recommendation",
  "recommendations",
]);

export const GUIDED_STEP_TYPES = Object.freeze({
  PREDICT: "predict",
  EXPERIMENT: "experiment",
  EXPLAIN: "explain",
  PRACTICE: "practice",
  REVIEW: "review",
});

export const GUIDED_RESPONSE_KINDS = Object.freeze({
  CHOICE: GUIDED_PRACTICE_KINDS.CHOICE,
  PATCH_CHOICE: GUIDED_PRACTICE_KINDS.PATCH_CHOICE,
  ORDERED_SEQUENCE: GUIDED_PRACTICE_KINDS.ORDERED_SEQUENCE,
  TEXT: "text",
});

export const GUIDED_REVIEW_RESOURCES = Object.freeze(["notes", "source", "demo"]);

const STEP_TYPE_VALUES = Object.freeze(Object.values(GUIDED_STEP_TYPES));
const REVIEW_RESOURCE_SET = new Set(GUIDED_REVIEW_RESOURCES);

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isNonBlankString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isStableId(value) {
  return typeof value === "string" && STABLE_ID_PATTERN.test(value);
}

function collectForbiddenFields(value, path, errors, visited = new WeakSet()) {
  if (!value || typeof value !== "object") return;
  if (visited.has(value)) {
    errors.push(`${path} must not contain cyclic data`);
    return;
  }

  visited.add(value);
  Object.entries(value).forEach(([key, child]) => {
    if (FORBIDDEN_FIELD_NAMES.has(key)) {
      errors.push(`${path}.${key} is not supported by Guided Activity`);
    }
    collectForbiddenFields(child, `${path}.${key}`, errors, visited);
  });
}

function validateOptionResponse(response, path, errors, { kind, requirePatch = false } = {}) {
  if (!isRecord(response)) {
    errors.push(`${path} must be an object`);
    return [];
  }
  if (response.kind !== kind) {
    errors.push(`${path}.kind must be "${kind}"`);
  }
  if (!Array.isArray(response.options) || response.options.length === 0) {
    errors.push(`${path}.options must contain at least one option`);
    return [];
  }

  const optionIds = new Set();
  response.options.forEach((option, index) => {
    const optionPath = `${path}.options[${index}]`;
    if (!isRecord(option)) {
      errors.push(`${optionPath} must be an object`);
      return;
    }
    if (!isStableId(option.id)) {
      errors.push(`${optionPath}.id must be a stable kebab-case id`);
    } else if (optionIds.has(option.id)) {
      errors.push(`${path}.options contains duplicate id "${option.id}"`);
    } else {
      optionIds.add(option.id);
    }
    if (!isNonBlankString(option.label)) {
      errors.push(`${optionPath}.label must be a non-blank string`);
    }
    if (requirePatch && !isNonBlankString(option.patch)) {
      errors.push(`${optionPath}.patch must be a non-blank string`);
    }
  });

  return [...optionIds];
}

function validateChoiceResponse(response, path, errors) {
  return validateOptionResponse(response, path, errors, {
    kind: GUIDED_RESPONSE_KINDS.CHOICE,
  });
}

function validatePatchChoiceResponse(response, path, errors) {
  return validateOptionResponse(response, path, errors, {
    kind: GUIDED_RESPONSE_KINDS.PATCH_CHOICE,
    requirePatch: true,
  });
}

function validateOrderedSequenceResponse(response, path, errors) {
  if (!isRecord(response)) {
    errors.push(`${path} must be an object`);
    return [];
  }
  if (response.kind !== GUIDED_RESPONSE_KINDS.ORDERED_SEQUENCE) {
    errors.push(`${path}.kind must be "${GUIDED_RESPONSE_KINDS.ORDERED_SEQUENCE}"`);
  }
  if (!Array.isArray(response.items) || response.items.length < 2) {
    errors.push(`${path}.items must contain at least two items`);
    return [];
  }

  const itemIds = new Set();
  response.items.forEach((item, index) => {
    const itemPath = `${path}.items[${index}]`;
    if (!isRecord(item)) {
      errors.push(`${itemPath} must be an object`);
      return;
    }
    if (!isStableId(item.id)) {
      errors.push(`${itemPath}.id must be a stable kebab-case id`);
    } else if (itemIds.has(item.id)) {
      errors.push(`${path}.items contains duplicate id "${item.id}"`);
    } else {
      itemIds.add(item.id);
    }
    if (!isNonBlankString(item.label)) {
      errors.push(`${itemPath}.label must be a non-blank string`);
    }
  });

  return [...itemIds];
}

function validateStep(step, index, errors) {
  const path = `steps[${index}]`;
  if (!isRecord(step)) {
    errors.push(`${path} must be an object`);
    return null;
  }

  if (!isStableId(step.id)) {
    errors.push(`${path}.id must be a stable kebab-case id`);
  }
  if (!STEP_TYPE_VALUES.includes(step.type)) {
    errors.push(`${path}.type "${String(step.type)}" is unsupported`);
    return null;
  }
  if (!isNonBlankString(step.prompt)) {
    errors.push(`${path}.prompt must be a non-blank string`);
  }

  let optionIds = [];
  let sequenceItemIds = [];

  if (step.type === GUIDED_STEP_TYPES.PREDICT) {
    if (!isRecord(step.response) || step.response.kind !== GUIDED_RESPONSE_KINDS.CHOICE) {
      errors.push(`${path}.response must be a choice response`);
    } else {
      optionIds = validateChoiceResponse(step.response, `${path}.response`, errors);
    }
  }

  if (step.type === GUIDED_STEP_TYPES.PRACTICE) {
    if (!isRecord(step.response)) {
      errors.push(`${path}.response must be a deterministic practice response`);
    } else if (step.response.kind === GUIDED_RESPONSE_KINDS.CHOICE) {
      optionIds = validateChoiceResponse(step.response, `${path}.response`, errors);
    } else if (step.response.kind === GUIDED_RESPONSE_KINDS.PATCH_CHOICE) {
      optionIds = validatePatchChoiceResponse(step.response, `${path}.response`, errors);
    } else if (step.response.kind === GUIDED_RESPONSE_KINDS.ORDERED_SEQUENCE) {
      sequenceItemIds = validateOrderedSequenceResponse(step.response, `${path}.response`, errors);
    } else {
      errors.push(`${path}.response.kind "${String(step.response.kind)}" is unsupported for practice`);
    }
  }

  if (step.type === GUIDED_STEP_TYPES.PREDICT || step.type === GUIDED_STEP_TYPES.PRACTICE) {
    if (!isRecord(step.reveal)) {
      errors.push(`${path}.reveal must be an object`);
    } else {
      const hasObservation = isNonBlankString(step.reveal.observation);
      if (!hasObservation) {
        errors.push(`${path}.reveal.observation must be a non-blank string`);
      }

      if (step.response?.kind === GUIDED_RESPONSE_KINDS.ORDERED_SEQUENCE) {
        if (!Array.isArray(step.reveal.expectedOrder)) {
          errors.push(`${path}.reveal.expectedOrder must be an array of stable item ids`);
        } else {
          const expectedOrder = step.reveal.expectedOrder;
          const expectedSet = new Set(expectedOrder);
          if (
            expectedOrder.length !== sequenceItemIds.length
            || expectedSet.size !== expectedOrder.length
            || expectedOrder.some((itemId) => !isStableId(itemId) || !sequenceItemIds.includes(itemId))
          ) {
            errors.push(`${path}.reveal.expectedOrder must contain every response item id exactly once`);
          }
        }
        if (step.reveal.expectedOptionId !== undefined) {
          errors.push(`${path}.reveal.expectedOptionId is not supported for ordered-sequence`);
        }
      } else {
        if (!isStableId(step.reveal.expectedOptionId)) {
          errors.push(`${path}.reveal.expectedOptionId must be a stable option id`);
        } else if (!optionIds.includes(step.reveal.expectedOptionId)) {
          errors.push(`${path}.reveal.expectedOptionId must reference a response option`);
        }
        if (step.reveal.expectedOrder !== undefined) {
          errors.push(`${path}.reveal.expectedOrder is only supported for ordered-sequence`);
        }
      }
    }
  }

  if (step.type === GUIDED_STEP_TYPES.EXPERIMENT) {
    if (!isStableId(step.demoActionId)) {
      errors.push(`${path}.demoActionId must be a stable kebab-case id`);
    }
    if (!isNonBlankString(step.expectedObservation)) {
      errors.push(`${path}.expectedObservation must be a non-blank string`);
    }
  }

  if (step.type === GUIDED_STEP_TYPES.EXPLAIN) {
    if (!isRecord(step.response) || step.response.kind !== GUIDED_RESPONSE_KINDS.TEXT) {
      errors.push(`${path}.response must be a text response`);
    }
  }

  if (step.type === GUIDED_STEP_TYPES.REVIEW) {
    if (!Array.isArray(step.resources) || step.resources.length === 0) {
      errors.push(`${path}.resources must contain at least one review resource`);
    } else {
      const resourceIds = new Set();
      step.resources.forEach((resource, resourceIndex) => {
        if (!REVIEW_RESOURCE_SET.has(resource)) {
          errors.push(`${path}.resources[${resourceIndex}] "${String(resource)}" is unsupported`);
        } else if (resourceIds.has(resource)) {
          errors.push(`${path}.resources contains duplicate id "${resource}"`);
        } else {
          resourceIds.add(resource);
        }
      });
    }
  }

  return step.type;
}

/**
 * Validate the Workbench-owned Guided Activity contract without consulting the
 * demo registry or any runtime service. The returned error order is stable so
 * authoring and focused tests can report deterministic failures.
 *
 * @param {unknown} definition
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateGuidedActivityDefinition(definition) {
  const errors = [];
  collectForbiddenFields(definition, "definition", errors);

  if (!isRecord(definition)) {
    errors.push("definition must be an object");
    return { valid: false, errors: [...new Set(errors)] };
  }

  if (!isStableId(definition.learningUnitId)) {
    errors.push("learningUnitId must be a stable kebab-case id");
  }
  if (!Number.isInteger(definition.revision) || definition.revision < 1) {
    errors.push("revision must be a positive integer");
  }
  if (!isNonBlankString(definition.goal)) {
    errors.push("goal must be a non-blank string");
  }
  if (!Array.isArray(definition.steps) || definition.steps.length === 0) {
    errors.push("steps must contain at least one step");
    return { valid: false, errors: [...new Set(errors)] };
  }

  const stepIds = new Set();
  const stepTypes = [];
  definition.steps.forEach((step, index) => {
    if (isRecord(step) && isStableId(step.id)) {
      if (stepIds.has(step.id)) {
        errors.push(`steps contains duplicate id "${step.id}"`);
      } else {
        stepIds.add(step.id);
      }
    }
    const stepType = validateStep(step, index, errors);
    if (stepType) stepTypes.push(stepType);
  });

  const requiredOrder = STEP_TYPE_VALUES;
  let requiredIndex = 0;
  stepTypes.forEach((stepType, index) => {
    const candidateIndex = requiredOrder.indexOf(stepType);
    if (candidateIndex < requiredIndex) {
      errors.push(`steps[${index}].type is out of Guided Activity order`);
      return;
    }
    if (candidateIndex === requiredIndex) requiredIndex += 1;
  });
  if (requiredIndex < requiredOrder.length) {
    errors.push(`steps must express ${requiredOrder.join(" -> ")} in order`);
  }

  const uniqueErrors = [...new Set(errors)];
  return {
    valid: uniqueErrors.length === 0,
    errors: uniqueErrors,
  };
}

/**
 * Assert a definition at the static registry boundary. Runtime consumers can
 * therefore rely on every returned definition being deterministic and valid.
 */
export function assertGuidedActivityDefinition(definition) {
  const result = validateGuidedActivityDefinition(definition);
  if (!result.valid) {
    throw new TypeError(`Invalid Guided Activity definition: ${result.errors.join("; ")}`);
  }
  return definition;
}

function deepFreeze(value, visited = new WeakSet()) {
  if (!value || typeof value !== "object" || visited.has(value)) return value;
  visited.add(value);
  Object.values(value).forEach((child) => deepFreeze(child, visited));
  return Object.freeze(value);
}

const STATE_SNAPSHOT_QUEUE_DEFINITION = {
  learningUnitId: "state-snapshot-queue",
  revision: 1,
  goal: "理解当前 render snapshot 如何决定 update queue 的下一次 render。",
  steps: [
    {
      id: "predict-replace-triple",
      type: GUIDED_STEP_TYPES.PREDICT,
      prompt: "当前 count = 0。连续执行三次 setCount(count + 1) 后，下一次 render 显示多少？",
      response: {
        kind: GUIDED_RESPONSE_KINDS.CHOICE,
        options: [
          { id: "count-1", label: "1" },
          { id: "count-2", label: "2" },
          { id: "count-3", label: "3" },
        ],
      },
      reveal: {
        expectedOptionId: "count-1",
        observation: "Replace × 3 从 count = 0 开始时，下一次 render 的 count 是 1。",
      },
    },
    {
      id: "experiment-replace-triple",
      type: GUIDED_STEP_TYPES.EXPERIMENT,
      prompt: "在真实 Demo 中运行 Replace × 3，并观察 Queue Debugger 的 handler snapshot 与 next render state。",
      demoActionId: "replace-three-times",
      expectedObservation: "next render state 为 1；三个 replace 都读取同一份 render snapshot。",
    },
    {
      id: "explain-shared-snapshot",
      type: GUIDED_STEP_TYPES.EXPLAIN,
      prompt: "用自己的话解释：为什么三个 setCount(count + 1) 没有让 count 连续增加三次？",
      response: {
        kind: GUIDED_RESPONSE_KINDS.TEXT,
        placeholder: "写下你对 snapshot 与 update queue 的解释…",
      },
    },
    {
      id: "practice-updater-replace-semantics",
      type: GUIDED_STEP_TYPES.PRACTICE,
      prompt: "setCount(count + 3) 与连续三个 updater function 的结果可能相同；它们的更新语义是否也相同？",
      response: {
        kind: GUIDED_RESPONSE_KINDS.CHOICE,
        options: [
          { id: "same-result-different-semantics", label: "结果可以相同，但 queue 处理语义不同" },
          { id: "same-result-same-semantics", label: "结果相同，所以更新语义完全相同" },
          { id: "different-result", label: "两种写法必然得到不同结果" },
        ],
      },
      reveal: {
        expectedOptionId: "same-result-different-semantics",
        observation: "两种写法在这个起点可以得到相同输出，但 updater 会按 queue 中的前一项结果继续计算。",
      },
    },
    {
      id: "review-snapshot-queue",
      type: GUIDED_STEP_TYPES.REVIEW,
      prompt: "回到现有 Notes、Source 或 Demo，核对你的预测、观察和解释。",
      resources: ["notes", "source", "demo"],
    },
  ],
};

assertGuidedActivityDefinition(STATE_SNAPSHOT_QUEUE_DEFINITION);

const RENDERING_LISTS_KEY_DEFINITION = {
  learningUnitId: "rendering-lists-key",
  revision: 1,
  goal: "理解 key 如何让列表项的局部 State 跟随数据身份，而不是数组位置。",
  steps: [
    {
      id: "predict-index-key-reorder",
      type: GUIDED_STEP_TYPES.PREDICT,
      prompt: `当前使用 index key。

给第一行「修复登录页 / Alice」输入备注 A-note，
然后点击「反转顺序」。

反转后，A-note 最可能出现在哪里？`,
      response: {
        kind: GUIDED_RESPONSE_KINDS.CHOICE,
        options: [
          { id: "stays-first-position", label: "仍留在第一行，因此看起来跟到了「发布生产版本 / Carol」" },
          { id: "follows-task-a", label: "跟着「修复登录页 / Alice」移动到最后一行" },
          { id: "clears-after-reorder", label: "反转后备注会被清空" },
        ],
      },
      reveal: {
        expectedOptionId: "stays-first-position",
        observation: `使用 index key 时，React 仍用当前数组位置作为身份线索。
反转后 index 0 对应的数据从 task-a 变成 task-c，但原先 index 0
组件里的输入 State 仍留在这个位置，所以备注看起来跟错了任务。`,
      },
    },
    {
      id: "experiment-compare-list-identity",
      type: GUIDED_STEP_TYPES.EXPERIMENT,
      prompt: `在真实 Demo 中完成两轮实验：

1. 点击「恢复数据」，选择「使用 index key」。
2. 给第一行输入 A-note，再点击「反转顺序」。
3. 观察备注现在属于哪一个任务。

然后：

4. 选择「使用 stable id」并再次恢复数据。
5. 给第一行输入 A-note，再反转顺序。
6. 对比备注这次跟着“位置”还是“任务身份”移动。`,
      demoActionId: "compare-index-and-stable-key",
      expectedObservation: "index key 时，备注留在原数组位置并可能显示在另一个任务旁；stable task.id 时，备注会跟随 task-a / Alice 对应的业务实体移动。",
    },
    {
      id: "explain-list-identity",
      type: GUIDED_STEP_TYPES.EXPLAIN,
      prompt: `用自己的话解释：

为什么数据只是改变了顺序，index key 却可能让输入框的局部 State
“跟错任务”？

而 task.id 为什么能让 State 更稳定地跟随业务实体？`,
      response: {
        kind: GUIDED_RESPONSE_KINDS.TEXT,
        placeholder: "重点解释“数组位置”和“业务身份”的差别…",
      },
    },
    {
      id: "practice-stable-key-transfer",
      type: GUIDED_STEP_TYPES.PRACTICE,
      prompt: `一个可编辑待办列表允许：

- 在列表顶部插入新任务；
- 修改任务标题；
- 每一行都有自己的输入草稿。

哪一个值最适合作为 key，让已有行的草稿继续属于原来的待办？`,
      response: {
        kind: GUIDED_RESPONSE_KINDS.CHOICE,
        options: [
          { id: "stable-task-id", label: "数据模型中的稳定 todo.id" },
          { id: "array-index", label: "当前数组 index" },
          { id: "editable-title", label: "当前可编辑的 todo.title" },
        ],
      },
      reveal: {
        expectedOptionId: "stable-task-id",
        observation: `key 应来自稳定的数据身份。

顶部插入会改变 index；
可编辑 title 也可能变化；
稳定 id 才能在列表结构变化后继续标识同一个业务实体。`,
      },
    },
    {
      id: "review-list-key-identity",
      type: GUIDED_STEP_TYPES.REVIEW,
      prompt: `回到 Notes、Source 或 Demo，核对你的判断：

key 的核心作用是提供稳定身份线索，让 React 在列表结构变化后仍能识别
“这是哪个业务实体”，而不只是消除 warning。`,
      resources: ["notes", "source", "demo"],
    },
  ],
};

const PRESERVING_RESETTING_STATE_DEFINITION = {
  learningUnitId: "preserving-resetting-state",
  revision: 1,
  goal: "理解局部 State 与组件身份关联，并用稳定业务 key 明确表达何时保留或重置。",
  steps: [
    {
      id: "predict-contact-draft-preservation",
      type: GUIDED_STEP_TYPES.PREDICT,
      prompt: `在 Demo 上半区：

Taylor 的 Chat 中已经输入草稿「明天开会」。

现在点击 Alice。

联系人已经变成 Alice 后，textarea 中的草稿会怎样？`,
      response: {
        kind: GUIDED_RESPONSE_KINDS.CHOICE,
        options: [
          { id: "draft-preserved", label: "原草稿仍然保留，现在显示在 Alice 的 Chat 中" },
          { id: "draft-cleared", label: "切换 contact prop 后 React 会自动清空草稿" },
          { id: "separate-draft-created", label: "React 会自动为 Alice 恢复一份独立草稿" },
        ],
      },
      reveal: {
        expectedOptionId: "draft-preserved",
        observation: "这里只改变了 contact prop。\n\n父级仍在同一位置渲染同一个 Chat 组件身份，因此内部 draft State 默认会继续保留。",
      },
    },
    {
      id: "experiment-compare-contact-identity",
      type: GUIDED_STEP_TYPES.EXPERIMENT,
      prompt: `在真实 Demo 中比较上下两组 Chat：

上半区：
1. 给 Taylor 输入一段草稿。
2. 切换到 Alice。
3. 观察草稿。

下半区：
4. 给 Taylor 输入一段草稿。
5. 切换到 Alice。
6. 观察带 key={contact.id} 的 Chat 是否仍保留旧草稿。`,
      demoActionId: "compare-preserved-and-keyed-chat",
      expectedObservation: "上半区相同位置、相同组件类型且没有业务 key 变化，因此 draft 被保留；下半区 contact.id 改变了 Chat 的身份，新 Chat 从空的初始 draft 开始。",
    },
    {
      id: "explain-state-identity",
      type: GUIDED_STEP_TYPES.EXPLAIN,
      prompt: `为什么 contact prop 从 Taylor 变成 Alice，并不会自动让 React 丢弃 Chat 的局部 draft？

什么时候 key={contact.id} 表达的是合理的产品身份边界？`,
      response: {
        kind: GUIDED_RESPONSE_KINDS.TEXT,
        placeholder: "从“这是同一个组件实例，还是另一个业务实例”来解释…",
      },
    },
    {
      id: "practice-reset-form-by-entity",
      type: GUIDED_STEP_TYPES.PRACTICE,
      prompt: `一个 ProductForm 用局部 State 保存多个未提交字段。

产品从 product-A 切换到 product-B 时，产品要求：

“旧产品的所有未提交字段都应该丢弃，
新产品必须从空表单开始。”

哪种写法最直接表达“这是另一个表单实例”？`,
      response: {
        kind: GUIDED_RESPONSE_KINDS.CHOICE,
        options: [
          { id: "stable-product-key", label: "<ProductForm key={product.id} product={product} />" },
          { id: "same-component-no-key", label: "<ProductForm product={product} />" },
          { id: "random-key", label: "<ProductForm key={Math.random()} product={product} />" },
        ],
      },
      reveal: {
        expectedOptionId: "stable-product-key",
        observation: `当整个表单子树都应该随业务实体切换而重新开始时，
稳定 product.id 可以明确表达新的组件身份。

在同一位置继续渲染同一组件类型且没有 key 变化时，会继续沿用原身份；
随机 key 则会在无关 render 中也不断重建组件。`,
      },
    },
    {
      id: "review-preserve-reset-identity",
      type: GUIDED_STEP_TYPES.REVIEW,
      prompt: `回到 Notes、Source 或 Demo，核对：

你真正要决定的不是“怎么强制刷新”，而是业务上当前 UI
应该继续代表同一个实例，还是一个新的实例。`,
      resources: ["notes", "source", "demo"],
    },
  ],
};

const NOT_NEED_EFFECT_DEFINITION = {
  learningUnitId: "not-need-effect",
  revision: 1,
  goal: "学会先判断逻辑的因果来源，再决定它属于 render、Event Handler 还是 Effect。",
  steps: [
    {
      id: "predict-derived-list-without-effect",
      type: GUIDED_STEP_TYPES.PREDICT,
      prompt: `商品列表当前由 query 和 category 决定。

当用户修改搜索词时，setQuery 已经触发一次新的 render。

为了得到最新 filteredProducts，还必须再做什么？`,
      response: {
        kind: GUIDED_RESPONSE_KINDS.CHOICE,
        options: [
          { id: "derive-during-render", label: "直接在这次 render 中根据新的 query / category 重新计算" },
          { id: "sync-with-effect", label: "等 render 完成后，再由 Effect 把过滤结果写入另一份 State" },
          { id: "store-in-ref", label: "把过滤结果写进 ref，等待下一次交互读取" },
        ],
      },
      reveal: {
        expectedOptionId: "derive-during-render",
        observation: `filteredProducts 完全可以由当前 query、category 和 products 计算得到。

React 因 State 变化重新 render 时，直接重新计算即可；
再复制一份 filtered State 会增加第二份事实来源和额外同步链。`,
      },
    },
    {
      id: "experiment-no-effect-boundaries",
      type: GUIDED_STEP_TYPES.EXPERIMENT,
      prompt: `在真实 Demo 中完成三组操作：

1. 修改搜索词和分类，观察商品列表立即由当前输入重新派生。
2. 点击某个商品的「购买」，观察日志由这次点击直接产生。
3. 在留言板输入草稿，再切换 User_A / User_B，观察 key 切换身份后的草稿重置。

思考这三组行为分别为什么不需要一个额外 Effect 来“监听变化”。`,
      demoActionId: "exercise-render-event-identity-boundaries",
      expectedObservation: "过滤结果在 render 中由当前 State 派生；购买日志由明确的 click Event Handler 直接产生；用户身份切换通过 key 创建新的 CommentForm 身份并重置局部 State。",
    },
    {
      id: "explain-effect-boundary",
      type: GUIDED_STEP_TYPES.EXPLAIN,
      prompt: `用“为什么这段代码需要运行？”来解释 Demo 的三种情况：

- filteredProducts 为什么属于 render？
- 购买日志为什么属于 Event Handler？
- 什么样的需求才真正需要 Effect？`,
      response: {
        kind: GUIDED_RESPONSE_KINDS.TEXT,
        placeholder: "从“派生计算 / 用户事件 / 外部同步”的因果边界解释…",
      },
    },
    {
      id: "practice-place-logic-by-cause",
      type: GUIDED_STEP_TYPES.PRACTICE,
      prompt: `ProfileEditor 同时有三项需求：

1. 根据 firstName 和 lastName 显示 fullName；
2. 用户点击「保存」时发送 POST 请求；
3. 组件显示期间监听 window.resize，并在卸载时移除监听。

哪组职责划分最合适？`,
      response: {
        kind: GUIDED_RESPONSE_KINDS.CHOICE,
        options: [
          { id: "render-event-effect", label: "fullName：render；POST：Save Event Handler；resize listener：Effect" },
          { id: "all-effects", label: "三项全部放进 Effect" },
          { id: "state-effect-handler", label: "fullName：State + Effect；POST：Effect；resize listener：普通 render / click handler" },
        ],
      },
      reveal: {
        expectedOptionId: "render-event-effect",
        observation: `能从当前 props/state 推导的值留在 render；

明确由用户点击产生的业务因果留在对应 Event Handler；

需要在组件存在期间与浏览器外部 API 保持同步并 cleanup 的 listener
才属于 Effect。`,
      },
    },
    {
      id: "review-effect-decision-boundary",
      type: GUIDED_STEP_TYPES.REVIEW,
      prompt: `回到 Notes、Source 或 Demo，重新检查每段逻辑：

它是在计算 UI、
响应一个明确事件，
还是在与 React 外部系统保持同步？`,
      resources: ["notes", "source", "demo"],
    },
  ],
};

const LIFECYCLE_OF_REACTIVE_EFFECTS_DEFINITION = {
  learningUnitId: "lifecycle-of-reactive-effects",
  revision: 1,
  goal: "理解 Effect 是一段独立同步过程：同步目标变化时，先停止旧同步，再建立新同步。",
  steps: [
    {
      id: "predict-room-resync-order",
      type: GUIDED_STEP_TYPES.PREDICT,
      prompt: `先清空生命周期日志。

当前已经连接某个房间。
现在切换到另一个房间。

连接 Effect 最合理的生命周期顺序是什么？`,
      response: {
        kind: GUIDED_RESPONSE_KINDS.CHOICE,
        options: [
          { id: "cleanup-then-setup", label: "先 cleanup 旧房间连接，再 setup 新房间连接" },
          { id: "setup-then-cleanup", label: "先 setup 新房间，再 cleanup 旧房间" },
          { id: "setup-only", label: "只 setup 新房间，旧连接由 React 自动忽略" },
        ],
      },
      reveal: {
        expectedOptionId: "cleanup-then-setup",
        observation: `当决定同步目标的 roomId 改变时，
React 会先运行上一次 Effect 的 cleanup，
再用新的 roomId 建立下一次同步。`,
      },
    },
    {
      id: "experiment-room-effect-lifecycle",
      type: GUIDED_STEP_TYPES.EXPERIMENT,
      prompt: `在真实 Demo 中：

1. 点击「清空日志」。
2. 从当前房间切换到另一个不同房间。
3. 观察 cleanup / setup 的实际顺序。
4. 再只切换静音状态，观察是否发生重新连接。
5. 等待至少一条新消息，观察消息列表更新时是否发生重新连接。`,
      demoActionId: "observe-room-resynchronization",
      expectedObservation: `roomId 改变时会先 cleanup 旧房间，再 setup 新房间；

只改变静音状态不会重新连接；

消息通过函数式 updater 更新时，也不会因为 messages 改变而重建连接。`,
    },
    {
      id: "explain-reactive-effect-dependencies",
      type: GUIDED_STEP_TYPES.EXPLAIN,
      prompt: `为什么 roomId 必须决定连接 Effect 是否重新同步，

而 isMuted 和 messages 的变化不应该导致重新连接？

函数式 State updater 和 Effect Event 分别帮助移除了哪一种不必要的 reactive read？`,
      response: {
        kind: GUIDED_RESPONSE_KINDS.TEXT,
        placeholder: "先定义“这个 Effect 到底在同步什么外部系统”，再分析依赖…",
      },
    },
    {
      id: "practice-connection-target-dependencies",
      type: GUIDED_STEP_TYPES.PRACTICE,
      prompt: `另一个 ChatConnection Effect：

- serverUrl 是组件内可编辑的 State，roomId 是当前房间的 prop/state；两者都会随 render 变化；
- Effect 使用 serverUrl 和 roomId 建立连接；
- 每次收到消息时读取最新 theme，只决定通知颜色；
- theme 改变不应该重新连接服务器。

哪些 reactive values 应该决定连接重新同步？`,
      response: {
        kind: GUIDED_RESPONSE_KINDS.CHOICE,
        options: [
          { id: "connection-target-only", label: "serverUrl + roomId；theme 作为非响应式消息处理逻辑读取" },
          { id: "all-values", label: "serverUrl + roomId + theme 全部触发重新连接" },
          { id: "theme-only", label: "只有 theme 改变时重新连接" },
        ],
      },
      reveal: {
        expectedOptionId: "connection-target-only",
        observation: `serverUrl 和 roomId 决定“连接到哪里”，因此决定同步关系；

theme 只影响“收到消息后怎么表现”，并不改变连接目标。

如果需要在 Effect 内读取最新 theme 而不让它触发重同步，
可以把这部分非响应式逻辑拆到 Effect Event。`,
      },
    },
    {
      id: "review-reactive-effect-lifecycle",
      type: GUIDED_STEP_TYPES.REVIEW,
      prompt: `回到 Notes、Source 或 Demo，核对：

这个 Effect 究竟在同步什么外部系统？
哪些值真正决定同步目标？
cleanup 是否准确撤销了上一轮 setup？`,
      resources: ["notes", "source", "demo"],
    },
  ],
};

assertGuidedActivityDefinition(RENDERING_LISTS_KEY_DEFINITION);
assertGuidedActivityDefinition(PRESERVING_RESETTING_STATE_DEFINITION);
assertGuidedActivityDefinition(NOT_NEED_EFFECT_DEFINITION);
assertGuidedActivityDefinition(LIFECYCLE_OF_REACTIVE_EFFECTS_DEFINITION);

export const GUIDED_ACTIVITY_DEFINITIONS = deepFreeze({
  [STATE_SNAPSHOT_QUEUE_DEFINITION.learningUnitId]: STATE_SNAPSHOT_QUEUE_DEFINITION,
  [RENDERING_LISTS_KEY_DEFINITION.learningUnitId]: RENDERING_LISTS_KEY_DEFINITION,
  [PRESERVING_RESETTING_STATE_DEFINITION.learningUnitId]: PRESERVING_RESETTING_STATE_DEFINITION,
  [NOT_NEED_EFFECT_DEFINITION.learningUnitId]: NOT_NEED_EFFECT_DEFINITION,
  [LIFECYCLE_OF_REACTIVE_EFFECTS_DEFINITION.learningUnitId]: LIFECYCLE_OF_REACTIVE_EFFECTS_DEFINITION,
});

export const STATE_SNAPSHOT_QUEUE_GUIDED_ACTIVITY = GUIDED_ACTIVITY_DEFINITIONS["state-snapshot-queue"];
export const RENDERING_LISTS_KEY_GUIDED_ACTIVITY = GUIDED_ACTIVITY_DEFINITIONS["rendering-lists-key"];
export const PRESERVING_RESETTING_STATE_GUIDED_ACTIVITY = GUIDED_ACTIVITY_DEFINITIONS["preserving-resetting-state"];
export const NOT_NEED_EFFECT_GUIDED_ACTIVITY = GUIDED_ACTIVITY_DEFINITIONS["not-need-effect"];
export const LIFECYCLE_OF_REACTIVE_EFFECTS_GUIDED_ACTIVITY = GUIDED_ACTIVITY_DEFINITIONS["lifecycle-of-reactive-effects"];

function isLookupId(value) {
  return isStableId(value);
}

/**
 * Look up the sparse extension by the authoritative Learning Unit id.
 *
 * @param {unknown} learningUnitId
 * @returns {object | null}
 */
export function getGuidedActivityDefinition(learningUnitId) {
  if (!isLookupId(learningUnitId)) return null;
  return GUIDED_ACTIVITY_DEFINITIONS[learningUnitId] ?? null;
}

export function hasGuidedActivity(learningUnitId) {
  return getGuidedActivityDefinition(learningUnitId) !== null;
}

/**
 * Return a discriminated lookup result so callers do not need to infer whether
 * a missing registry entry means "no Guided activity" or an invalid definition.
 */
export function getGuidedActivity(learningUnitId) {
  const definition = getGuidedActivityDefinition(learningUnitId);
  if (definition) {
    return Object.freeze({ kind: "definition", definition });
  }
  return Object.freeze({
    kind: "none",
    learningUnitId: typeof learningUnitId === "string" ? learningUnitId : null,
  });
}
