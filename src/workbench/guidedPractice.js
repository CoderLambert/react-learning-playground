const STABLE_ID_PATTERN = /^[a-z0-9][a-z0-9-]*$/;

export const GUIDED_PRACTICE_KINDS = Object.freeze({
  CHOICE: "choice",
  PATCH_CHOICE: "patch-choice",
  ORDERED_SEQUENCE: "ordered-sequence",
});

const OPTION_KINDS = new Set([
  GUIDED_PRACTICE_KINDS.CHOICE,
  GUIDED_PRACTICE_KINDS.PATCH_CHOICE,
]);

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isStableId(value) {
  return typeof value === "string" && STABLE_ID_PATTERN.test(value);
}

function uniqueStableIds(values) {
  return Array.isArray(values)
    && values.length > 0
    && values.every(isStableId)
    && new Set(values).size === values.length;
}

export function normalizeGuidedPracticeResponse(value) {
  if (value === null || value === undefined) return null;

  if (typeof value === "string") {
    if (!isStableId(value)) return null;
    return Object.freeze({
      kind: GUIDED_PRACTICE_KINDS.CHOICE,
      optionId: value,
    });
  }

  if (!isRecord(value)) return null;

  if (OPTION_KINDS.has(value.kind) && isStableId(value.optionId)) {
    return Object.freeze({
      kind: value.kind,
      optionId: value.optionId,
    });
  }

  if (
    value.kind === GUIDED_PRACTICE_KINDS.ORDERED_SEQUENCE
    && uniqueStableIds(value.itemIds)
  ) {
    return Object.freeze({
      kind: value.kind,
      itemIds: Object.freeze([...value.itemIds]),
    });
  }

  return null;
}

export function cloneGuidedPracticeResponse(value) {
  const normalized = normalizeGuidedPracticeResponse(value);
  if (!normalized) return null;
  if (normalized.kind === GUIDED_PRACTICE_KINDS.ORDERED_SEQUENCE) {
    return {
      kind: normalized.kind,
      itemIds: [...normalized.itemIds],
    };
  }
  return {
    kind: normalized.kind,
    optionId: normalized.optionId,
  };
}

export function areGuidedPracticeResponsesEqual(left, right) {
  const normalizedLeft = normalizeGuidedPracticeResponse(left);
  const normalizedRight = normalizeGuidedPracticeResponse(right);

  if (!normalizedLeft || !normalizedRight || normalizedLeft.kind !== normalizedRight.kind) {
    return normalizedLeft === normalizedRight;
  }

  if (normalizedLeft.kind === GUIDED_PRACTICE_KINDS.ORDERED_SEQUENCE) {
    return normalizedLeft.itemIds.length === normalizedRight.itemIds.length
      && normalizedLeft.itemIds.every((itemId, index) => itemId === normalizedRight.itemIds[index]);
  }

  return normalizedLeft.optionId === normalizedRight.optionId;
}

function getPracticeOptionIds(step) {
  return new Set(step?.response?.options?.map((option) => option.id) ?? []);
}

function getPracticeItemIds(step) {
  return step?.response?.items?.map((item) => item.id) ?? [];
}

export function isGuidedPracticeResponseValidForStep(step, value, { allowNull = true } = {}) {
  if (value === null || value === undefined) return allowNull;

  const normalized = normalizeGuidedPracticeResponse(value);
  if (!normalized || normalized.kind !== step?.response?.kind) return false;

  if (OPTION_KINDS.has(normalized.kind)) {
    return getPracticeOptionIds(step).has(normalized.optionId);
  }

  if (normalized.kind === GUIDED_PRACTICE_KINDS.ORDERED_SEQUENCE) {
    const itemIds = getPracticeItemIds(step);
    if (normalized.itemIds.length !== itemIds.length) return false;
    const expectedIds = new Set(itemIds);
    return normalized.itemIds.every((itemId) => expectedIds.has(itemId));
  }

  return false;
}

export function getInitialGuidedPracticeDraft(step) {
  if (step?.response?.kind !== GUIDED_PRACTICE_KINDS.ORDERED_SEQUENCE) return null;
  return Object.freeze({
    kind: GUIDED_PRACTICE_KINDS.ORDERED_SEQUENCE,
    itemIds: Object.freeze(getPracticeItemIds(step)),
  });
}

function getOptionSummary(step, response) {
  const option = step?.response?.options?.find((candidate) => candidate.id === response.optionId);
  return Object.freeze({
    optionId: response.optionId,
    label: option?.label ?? response.optionId,
    patch: option?.patch ?? null,
  });
}

function getSequenceSummary(step, response) {
  const itemMap = new Map((step?.response?.items ?? []).map((item) => [item.id, item]));
  return Object.freeze({
    itemIds: Object.freeze([...response.itemIds]),
    items: Object.freeze(response.itemIds.map((itemId) => Object.freeze({
      itemId,
      label: itemMap.get(itemId)?.label ?? itemId,
    }))),
  });
}

export function getGuidedPracticeResponseSummary(step, value) {
  if (!isGuidedPracticeResponseValidForStep(step, value, { allowNull: false })) return null;
  const response = normalizeGuidedPracticeResponse(value);

  if (response.kind === GUIDED_PRACTICE_KINDS.ORDERED_SEQUENCE) {
    return Object.freeze({
      kind: response.kind,
      ...getSequenceSummary(step, response),
    });
  }

  return Object.freeze({
    kind: response.kind,
    ...getOptionSummary(step, response),
  });
}

export function getExpectedGuidedPracticeResponse(step) {
  const kind = step?.response?.kind;

  if (OPTION_KINDS.has(kind)) {
    return normalizeGuidedPracticeResponse({
      kind,
      optionId: step?.reveal?.expectedOptionId,
    });
  }

  if (kind === GUIDED_PRACTICE_KINDS.ORDERED_SEQUENCE) {
    return normalizeGuidedPracticeResponse({
      kind,
      itemIds: step?.reveal?.expectedOrder,
    });
  }

  return null;
}

export function evaluateGuidedPracticeResponse(step, value) {
  if (!isGuidedPracticeResponseValidForStep(step, value, { allowNull: false })) return null;

  const response = normalizeGuidedPracticeResponse(value);
  const expected = getExpectedGuidedPracticeResponse(step);
  if (!expected) return null;

  return Object.freeze({
    kind: response.kind,
    correct: areGuidedPracticeResponsesEqual(response, expected),
    response: getGuidedPracticeResponseSummary(step, response),
    expected: getGuidedPracticeResponseSummary(step, expected),
    rationale: step?.reveal?.observation ?? null,
  });
}
