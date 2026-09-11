const MEBI = 1024 * 1024;
const DEEPSEEK_MODEL_SOURCE = "https://api-docs.deepseek.com/quick_start/pricing/";
const DEEPSEEK_CONTEXT_WINDOW_TOKENS = MEBI;
const DEEPSEEK_MAX_OUTPUT_TOKENS = 384 * 1024;
const DEFAULT_OUTPUT_RESERVE_TOKENS = 16 * 1024;

/**
 * This is an application fallback, not a provider claim. Unknown model IDs
 * must stay visibly estimated so the UI never presents this value as official.
 */
export const DEFAULT_MODEL_CONTEXT = Object.freeze({
  modelId: "unknown",
  contextWindowTokens: 128 * 1024,
  officialMaxOutputTokens: null,
  defaultSoftBudgetTokens: 112 * 1024,
  defaultOutputReserveTokens: DEFAULT_OUTPUT_RESERVE_TOKENS,
  warningRatio: 0.7,
  compactionRatio: 0.82,
  known: false,
  official: false,
  estimated: true,
  contextWindowLabel: "128K fallback",
  source: null,
});

function officialDeepSeekModel(modelId) {
  return Object.freeze({
    modelId,
    contextWindowTokens: DEEPSEEK_CONTEXT_WINDOW_TOKENS,
    officialMaxOutputTokens: DEEPSEEK_MAX_OUTPUT_TOKENS,
    // The application does not impose a hidden 256K ceiling. The default
    // effective input budget is the official window minus the output reserve.
    defaultSoftBudgetTokens: DEEPSEEK_CONTEXT_WINDOW_TOKENS - DEFAULT_OUTPUT_RESERVE_TOKENS,
    defaultOutputReserveTokens: DEFAULT_OUTPUT_RESERVE_TOKENS,
    warningRatio: 0.7,
    compactionRatio: 0.82,
    known: true,
    official: true,
    estimated: false,
    contextWindowLabel: "1M official",
    source: DEEPSEEK_MODEL_SOURCE,
  });
}

export const MODEL_CONTEXTS = Object.freeze({
  "deepseek-v4-flash": officialDeepSeekModel("deepseek-v4-flash"),
  "deepseek-v4-pro": officialDeepSeekModel("deepseek-v4-pro"),
  "deepseek-v4-flash-vision-exp": officialDeepSeekModel("deepseek-v4-flash-vision-exp"),
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
    positiveInteger(overrides.defaultSoftBudgetTokens, Math.min(preset.defaultSoftBudgetTokens, maxInputTokens)),
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
