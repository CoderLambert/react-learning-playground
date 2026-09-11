import { getModelContextMetadata } from "./modelMetadata.js";
import { estimateMessagesTokens, estimateTextTokens } from "./tokenEstimator.js";

export const CONTEXT_CATEGORIES = Object.freeze([
  "system",
  "note",
  "sources",
  "summary",
  "history",
  "input",
]);

export function buildContextBudget({
  modelId,
  softBudgetTokens,
  systemPrompt = "",
  note = "",
  sources = [],
  summary = "",
  history = [],
  input = "",
  actualUsage = null,
  calibration = 1,
  modelOverrides,
} = {}) {
  const model = getModelContextMetadata(modelId, modelOverrides);
  const softBudget = Math.min(
    model.contextWindowTokens,
    positiveInteger(softBudgetTokens, model.defaultSoftBudgetTokens),
  );

  const breakdown = {
    system: estimateTextTokens(systemPrompt, { calibration }).tokens,
    note: estimateTextTokens(note, { calibration }).tokens,
    sources: normalizeSources(sources).reduce(
      (sum, source) => sum + estimateTextTokens(source.code, { calibration }).tokens,
      0,
    ),
    summary: estimateTextTokens(summary, { calibration }).tokens,
    history: estimateMessagesTokens(history, { calibration }).tokens,
    input: estimateTextTokens(input, { calibration }).tokens,
  };
  const estimatedInputTokens = Object.values(breakdown).reduce((sum, value) => sum + value, 0);
  const ratio = softBudget > 0 ? estimatedInputTokens / softBudget : 1;

  return {
    model,
    softBudgetTokens: softBudget,
    estimatedInputTokens,
    estimated: true,
    actualUsage: normalizeActualUsage(actualUsage),
    breakdown,
    usageRatio: ratio,
    warning: ratio >= model.warningRatio,
    shouldCompact: ratio >= model.compactionRatio,
    overSoftBudget: estimatedInputTokens > softBudget,
  };
}

/**
 * Assemble model input in priority order. System/current learning context is
 * never silently discarded. Summary is preferred over old history, while the
 * newest complete contiguous message tail is selected with explicit pruning
 * metadata when budget is exceeded.
 */
export function selectContextWithinBudget({
  modelId,
  softBudgetTokens,
  systemPrompt = "",
  note = "",
  sources = [],
  summary = "",
  history = [],
  input = "",
  calibration = 1,
  modelOverrides,
} = {}) {
  const model = getModelContextMetadata(modelId, modelOverrides);
  const softBudget = Math.min(
    model.contextWindowTokens,
    positiveInteger(softBudgetTokens, model.defaultSoftBudgetTokens),
  );
  const normalizedSources = normalizeSources(sources);
  const normalizedHistory = Array.isArray(history) ? history : [];
  const fixedTokens =
    estimateTextTokens(systemPrompt, { calibration }).tokens +
    estimateTextTokens(note, { calibration }).tokens +
    normalizedSources.reduce(
      (sum, source) => sum + estimateTextTokens(source.code, { calibration }).tokens,
      0,
    ) +
    estimateTextTokens(summary, { calibration }).tokens +
    estimateTextTokens(input, { calibration }).tokens;

  let remaining = Math.max(0, softBudget - fixedTokens);
  const recentHistory = [];
  for (let index = normalizedHistory.length - 1; index >= 0; index -= 1) {
    const message = normalizedHistory[index];
    const cost = estimateMessagesTokens([message], { calibration }).tokens;
    if (cost > remaining) break;
    recentHistory.unshift(message);
    remaining -= cost;
  }

  const selectedIds = new Set(recentHistory.map((message) => message?.id).filter(Boolean));
  const prunedMessages = normalizedHistory.filter((message) => {
    if (message?.id) return !selectedIds.has(message.id);
    return !recentHistory.includes(message);
  });

  const estimatedSelectedTokens =
    fixedTokens + estimateMessagesTokens(recentHistory, { calibration }).tokens;

  return {
    model,
    softBudgetTokens: softBudget,
    context: {
      systemPrompt,
      note,
      sources: normalizedSources,
      summary,
      history: recentHistory,
      input,
    },
    estimatedSelectedTokens,
    metadata: {
      currentLearningContextPreserved: true,
      fixedContextOverBudget: fixedTokens > softBudget,
      pruned: prunedMessages.length > 0,
      prunedMessageCount: prunedMessages.length,
      includedMessageCount: recentHistory.length,
      prunedMessageIds: prunedMessages.map((message) => message?.id).filter(Boolean),
    },
  };
}

function normalizeSources(sources) {
  if (!Array.isArray(sources)) return [];
  return sources.map((source, index) => ({
    name:
      typeof source?.name === "string" && source.name.trim()
        ? source.name.trim()
        : `source-${index + 1}`,
    code:
      typeof source?.numberedCode === "string"
        ? source.numberedCode
        : typeof source?.code === "string"
          ? source.code
          : "",
  }));
}

function normalizeActualUsage(usage) {
  if (!usage || typeof usage !== "object") return null;
  const inputTokens = finiteNonNegative(usage.inputTokens ?? usage.prompt_tokens);
  const outputTokens = finiteNonNegative(usage.outputTokens ?? usage.completion_tokens);
  const totalTokens = finiteNonNegative(
    usage.totalTokens ?? usage.total_tokens ?? inputTokens + outputTokens,
  );
  return { inputTokens, outputTokens, totalTokens, exact: true };
}

function finiteNonNegative(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? Math.floor(number) : 0;
}

function positiveInteger(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.floor(number) : fallback;
}
