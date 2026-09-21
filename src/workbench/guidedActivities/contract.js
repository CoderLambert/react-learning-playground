import { GUIDED_PRACTICE_KINDS } from "../guidedPractice.js";

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
