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
  CHOICE: "choice",
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

function validateChoiceResponse(response, path, errors) {
  if (!isRecord(response)) {
    errors.push(`${path} must be an object`);
    return [];
  }
  if (response.kind !== GUIDED_RESPONSE_KINDS.CHOICE) {
    errors.push(`${path}.kind must be "${GUIDED_RESPONSE_KINDS.CHOICE}"`);
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
  });

  return [...optionIds];
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
  if (step.type === GUIDED_STEP_TYPES.PREDICT || step.type === GUIDED_STEP_TYPES.PRACTICE) {
    if (!isRecord(step.response) || step.response.kind !== GUIDED_RESPONSE_KINDS.CHOICE) {
      errors.push(`${path}.response must be a choice response`);
    } else {
      optionIds = validateChoiceResponse(step.response, `${path}.response`, errors);
    }

    if (!isRecord(step.reveal)) {
      errors.push(`${path}.reveal must be an object`);
    } else {
      const hasExpectedOption = step.reveal.expectedOptionId !== undefined;
      const hasObservation = isNonBlankString(step.reveal.observation);
      if (!hasExpectedOption && !hasObservation) {
        errors.push(`${path}.reveal must declare expectedOptionId or observation`);
      }
      if (hasExpectedOption && !optionIds.includes(step.reveal.expectedOptionId)) {
        errors.push(`${path}.reveal.expectedOptionId must reference a response option`);
      }
      if (step.reveal.expectedOptionId !== undefined && !isStableId(step.reveal.expectedOptionId)) {
        errors.push(`${path}.reveal.expectedOptionId must be a stable option id`);
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

export const GUIDED_ACTIVITY_DEFINITIONS = deepFreeze({
  [STATE_SNAPSHOT_QUEUE_DEFINITION.learningUnitId]: STATE_SNAPSHOT_QUEUE_DEFINITION,
});

export const STATE_SNAPSHOT_QUEUE_GUIDED_ACTIVITY = GUIDED_ACTIVITY_DEFINITIONS["state-snapshot-queue"];

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
