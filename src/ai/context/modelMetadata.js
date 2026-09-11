const MEBI = 1024 * 1024;
const DEEPSEEK_MODEL_SOURCE = "https://api-docs.deepseek.com/quick_start/pricing/";

/**
 * This is an application fallback, not a provider claim. Unknown model IDs
 * must stay visibly estimated so the UI never presents this value as official.
 */
export const DEFAULT_MODEL_CONTEXT = Object.freeze({
  modelId: "unknown",
  contextWindowTokens: 128 * 1024,
  officialMaxOutputTokens: null,
  defaultSoftBudgetTokens: 96 * 1024,
  defaultOutputReserveTokens: 16 * 1024,
  warningRatio: 0.7,
  compactionRatio: 0.82,
  known: false,
  official: false,
  estimated: true,
  contextWindowLabel: "128K fallback",
  source: null,
});

function officialDeepSeekModel(modelId, extra = {}) {
  return Object.freeze({
    modelId,
    contextWindowTokens: MEBI,
    officialMaxOutputTokens: 384 * 1024,
    defaultSoftBudgetTokens: 256 * 1024,
    defaultOutputReserveTokens: 16 * 1024,
    warningRatio: 0.7,
    compactionRatio: 0.82,
    known: true,
    official: true,
    estimated: false,
    contextWindowLabel: "1M official",
    source: DEEPSEEK_MODEL_SOURCE,
    ...extra,
  });
}

export const MODEL_CONTEXTS = Object.freeze({
  "deepseek-flash": officialDeepSeekModel("deepseek-flash"),
  "deepseek-v4-pro": officialDeepSeekModel("deepseek-v4-pro"),
  // DeepSeek documents these as accepted legacy aliases served by Flash.
  "deepseek-v4-flash": officialDeepSeekModel("deepseek-v4-flash", {
    aliasOf: "deepseek-flash",
  }),
  "deepseek-v4-flash-vision-exp": officialDeepSeekModel("deepseek-v4-flash-vision-exp", {
    aliasOf: "deepseek-flash",
  }),
});

/**
 * Single source of truth for context-window and context-policy metadata.
 * Runtime overrides are useful for tests and self-hosted gateways, but an
 * overridden window is deliberately marked estimated rather than official.
 */
export function getModelContextMetadata(modelId, overrides = {}) {
  const normalizedId = typeof modelId === "string" ? modelId.trim() : "";
  const preset = MODEL_CONTEXTS[normalizedId] || {
    ...DEFAULT_MODEL_CONTEXT,
    modelId: normalizedId || DEFAULT_MODEL_CONTEXT.modelId,
  };

  const hasWindowOverride = Number.isFinite(Number(overrides.contextWindowTokens))
    && Number(overrides.contextWindowTokens) > 0
    && Math.floor(Number(overrides.contextWindowTokens)) !== preset.contextWindowTokens;
  const contextWindowTokens = positiveInteger(
    overrides.contextWindowTokens,
    preset.contextWindowTokens,
  );
  const defaultOutputReserveTokens = Math.min(
    Math.max(0, contextWindowTokens - 1),
    nonNegativeInteger(overrides.defaultOutputReserveTokens, preset.defaultOutputReserveTokens),
  );
  const maxInputTokens = Math.max(1, contextWindowTokens - defaultOutputReserveTokens);
  const defaultSoftBudgetTokens = Math.min(
    maxInputTokens,
    positiveInteger(overrides.defaultSoftBudgetTokens, preset.defaultSoftBudgetTokens),
  );
  const official = hasWindowOverride ? false : preset.official;

  return Object.freeze({
    ...preset,
    ...overrides,
    modelId: normalizedId || preset.modelId,
    contextWindowTokens,
    defaultSoftBudgetTokens,
    defaultOutputReserveTokens,
    maxInputTokens,
    warningRatio: ratio(overrides.warningRatio, preset.warningRatio),
    compactionRatio: ratio(overrides.compactionRatio, preset.compactionRatio),
    known: hasWindowOverride ? false : preset.known,
    official,
    estimated: !official,
    contextWindowLabel: official ? preset.contextWindowLabel : `${contextWindowTokens} estimated`,
    source: official ? preset.source : null,
  });
}

function positiveInteger(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.floor(number) : fallback;
}

function nonNegativeInteger(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? Math.floor(number) : fallback;
}

function ratio(value, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(1, Math.max(0, number));
}
