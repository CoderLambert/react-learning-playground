const MEBI = 1024 * 1024;

export const DEFAULT_MODEL_CONTEXT = Object.freeze({
  modelId: "unknown",
  contextWindowTokens: 128 * 1024,
  defaultSoftBudgetTokens: 96 * 1024,
  warningRatio: 0.7,
  compactionRatio: 0.82,
});

export const MODEL_CONTEXTS = Object.freeze({
  "deepseek-v4-pro": Object.freeze({
    modelId: "deepseek-v4-pro",
    contextWindowTokens: MEBI,
    defaultSoftBudgetTokens: 256 * 1024,
    warningRatio: 0.7,
    compactionRatio: 0.82,
    source: "https://api-docs.deepseek.com/quick_start/pricing/",
  }),
  "deepseek-v4-flash": Object.freeze({
    modelId: "deepseek-v4-flash",
    contextWindowTokens: MEBI,
    defaultSoftBudgetTokens: 256 * 1024,
    warningRatio: 0.7,
    compactionRatio: 0.82,
    source: "https://api-docs.deepseek.com/quick_start/pricing/",
  }),
  "deepseek-v4-flash-vision-exp": Object.freeze({
    modelId: "deepseek-v4-flash-vision-exp",
    contextWindowTokens: MEBI,
    defaultSoftBudgetTokens: 256 * 1024,
    warningRatio: 0.7,
    compactionRatio: 0.82,
    source: "https://api-docs.deepseek.com/quick_start/pricing/",
  }),
});

export function getModelContextMetadata(modelId, overrides = {}) {
  const normalizedId = typeof modelId === "string" ? modelId.trim() : "";
  const preset = MODEL_CONTEXTS[normalizedId] || {
    ...DEFAULT_MODEL_CONTEXT,
    modelId: normalizedId || DEFAULT_MODEL_CONTEXT.modelId,
  };

  const contextWindowTokens = positiveInteger(
    overrides.contextWindowTokens,
    preset.contextWindowTokens,
  );
  const defaultSoftBudgetTokens = Math.min(
    contextWindowTokens,
    positiveInteger(overrides.defaultSoftBudgetTokens, preset.defaultSoftBudgetTokens),
  );

  return Object.freeze({
    ...preset,
    ...overrides,
    modelId: normalizedId || preset.modelId,
    contextWindowTokens,
    defaultSoftBudgetTokens,
    warningRatio: ratio(overrides.warningRatio, preset.warningRatio),
    compactionRatio: ratio(overrides.compactionRatio, preset.compactionRatio),
  });
}

function positiveInteger(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.floor(number) : fallback;
}

function ratio(value, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(1, Math.max(0, number));
}
