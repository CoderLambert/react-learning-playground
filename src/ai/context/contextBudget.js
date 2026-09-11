import { getModelContextMetadata } from "./modelMetadata.js";
import { estimateMessagesTokens, estimateTextTokens } from "./tokenEstimator.js";

export const CONTEXT_CATEGORIES = Object.freeze([
  "system",
  "input",
  "activeSource",
  "note",
  "sources",
  "summary",
  "history",
]);

export function buildContextBudget({
  modelId,
  softBudgetTokens,
  outputReserveTokens,
  systemPrompt = "",
  note = "",
  sources = [],
  activeSourceFile = null,
  summary = "",
  history = [],
  input = "",
  actualUsage = null,
  calibration = 1,
  modelOverrides,
} = {}) {
  const limits = resolveLimits({ modelId, softBudgetTokens, outputReserveTokens, modelOverrides });
  const breakdown = contextBreakdown({
    systemPrompt,
    note,
    sources,
    activeSourceFile,
    summary,
    history,
    input,
    calibration,
  });
  const estimatedInputTokens = sumValues(breakdown);
  const normalizedActualUsage = normalizeActualUsage(actualUsage);

  // Budget decisions must describe the request we are about to send. Provider
  // usage belongs to the previous completed request and is retained only as
  // observed telemetry/calibration evidence; it must not suppress compaction
  // after the current history/input has grown.
  const budgetBasisTokens = estimatedInputTokens;
  const usageRatio = budgetBasisTokens / limits.softBudgetTokens;

  return {
    model: limits.model,
    softBudgetTokens: limits.softBudgetTokens,
    outputReserveTokens: limits.outputReserveTokens,
    maxInputTokens: limits.maxInputTokens,
    estimatedInputTokens,
    estimated: true,
    actualUsage: normalizedActualUsage,
    budgetBasisTokens,
    budgetBasis: "estimated-current-input",
    breakdown,
    usageRatio,
    contextWindowUsageRatio: budgetBasisTokens / limits.model.contextWindowTokens,
    warning: usageRatio >= limits.model.warningRatio,
    shouldCompact: usageRatio >= limits.model.compactionRatio,
    overSoftBudget: budgetBasisTokens > limits.softBudgetTokens,
    overProviderInputLimit: budgetBasisTokens > limits.maxInputTokens,
  };
}

/**
 * Assemble provider input by explicit priority:
 * system, current input, active source, note, other sources, durable summary,
 * then the newest complete contiguous history tail.
 *
 * `softBudgetTokens` is a model/context policy. `transportInputCapTokens` is a
 * separate serialization/transport constraint (for example a gateway body
 * limit). A transport cap can reduce what is sent without changing or
 * masquerading as the model's official context window.
 */
export function selectContextWithinBudget({
  modelId,
  softBudgetTokens,
  outputReserveTokens,
  transportInputCapTokens,
  systemPrompt = "",
  note = "",
  sources = [],
  activeSourceFile = null,
  summary = "",
  history = [],
  input = "",
  calibration = 1,
  modelOverrides,
} = {}) {
  const limits = resolveLimits({
    modelId,
    softBudgetTokens,
    outputReserveTokens,
    transportInputCapTokens,
    modelOverrides,
  });
  const normalizedSources = normalizeSources(sources);
  const normalizedHistory = Array.isArray(history) ? history : [];
  const activeSource = selectActiveSource(normalizedSources, activeSourceFile);
  const otherSources = normalizedSources.filter((source) => source !== activeSource);
  let remaining = limits.selectionBudgetTokens;

  const selectedSystem = fitText(systemPrompt, remaining, calibration);
  remaining -= selectedSystem.tokens;
  const selectedInput = fitText(input, remaining, calibration);
  remaining -= selectedInput.tokens;

  const selectedSources = [];
  const sourceDetails = [];
  if (activeSource) {
    const fitted = fitText(activeSource.code, remaining, calibration);
    remaining -= fitted.tokens;
    if (fitted.text) selectedSources.push({ ...activeSource, code: fitted.text });
    sourceDetails.push(sourceSelectionMetadata(activeSource, fitted, true));
  }

  const selectedNote = fitText(note, remaining, calibration);
  remaining -= selectedNote.tokens;

  for (const source of otherSources) {
    const fitted = fitText(source.code, remaining, calibration);
    remaining -= fitted.tokens;
    if (fitted.text) selectedSources.push({ ...source, code: fitted.text });
    sourceDetails.push(sourceSelectionMetadata(source, fitted, false));
  }

  const selectedSummary = fitText(summary, remaining, calibration);
  remaining -= selectedSummary.tokens;

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
  const context = {
    systemPrompt: selectedSystem.text,
    note: selectedNote.text,
    sources: selectedSources,
    summary: selectedSummary.text,
    history: recentHistory,
    input: selectedInput.text,
  };
  const breakdown = contextBreakdown({
    ...context,
    activeSourceFile: activeSource?.name ?? null,
    calibration,
  });
  const estimatedSelectedTokens = sumValues(breakdown);
  const truncatedSources = sourceDetails.some((source) => source.truncated || source.omitted);

  return {
    model: limits.model,
    softBudgetTokens: limits.softBudgetTokens,
    outputReserveTokens: limits.outputReserveTokens,
    maxInputTokens: limits.maxInputTokens,
    transportInputCapTokens: limits.transportInputCapTokens,
    selectionBudgetTokens: limits.selectionBudgetTokens,
    context,
    breakdown,
    estimatedSelectedTokens,
    metadata: {
      priority: [...CONTEXT_CATEGORIES],
      activeSourceFile: activeSource?.name ?? null,
      currentLearningContextPreserved: !selectedNote.truncated && !truncatedSources,
      fixedContextOverBudget:
        selectedSystem.truncated || selectedInput.truncated || selectedNote.truncated || truncatedSources,
      truncatedSystem: selectedSystem.truncated,
      truncatedInput: selectedInput.truncated,
      truncatedNote: selectedNote.truncated,
      truncatedSummary: selectedSummary.truncated,
      truncatedSources,
      sourceSelections: sourceDetails,
      pruned: prunedMessages.length > 0,
      prunedHistory: prunedMessages.length > 0,
      prunedMessageCount: prunedMessages.length,
      includedMessageCount: recentHistory.length,
      prunedMessageIds: prunedMessages.map((message) => message?.id).filter(Boolean),
      transportInputCapTokens: limits.transportInputCapTokens,
      constrainedByTransport: limits.transportInputCapTokens != null
        && limits.selectionBudgetTokens < limits.softBudgetTokens,
      withinBudget: estimatedSelectedTokens <= limits.selectionBudgetTokens,
      withinModelSoftBudget: estimatedSelectedTokens <= limits.softBudgetTokens,
      withinProviderInputLimit: estimatedSelectedTokens <= limits.maxInputTokens,
    },
  };
}

function resolveLimits({
  modelId,
  softBudgetTokens,
  outputReserveTokens,
  transportInputCapTokens,
  modelOverrides,
}) {
  const model = getModelContextMetadata(modelId, modelOverrides);
  const reserve = Math.min(
    Math.max(0, model.contextWindowTokens - 1),
    nonNegativeInteger(outputReserveTokens, model.defaultOutputReserveTokens),
  );
  const maxInputTokens = Math.max(1, model.contextWindowTokens - reserve);
  const softBudget = Math.min(
    maxInputTokens,
    positiveInteger(softBudgetTokens, Math.min(model.defaultSoftBudgetTokens, maxInputTokens)),
  );
  const transportCap = optionalPositiveInteger(transportInputCapTokens);
  const selectionBudgetTokens = transportCap == null
    ? Math.max(1, softBudget)
    : Math.max(1, Math.min(softBudget, transportCap));
  return {
    model,
    outputReserveTokens: reserve,
    maxInputTokens,
    softBudgetTokens: Math.max(1, softBudget),
    transportInputCapTokens: transportCap,
    selectionBudgetTokens,
  };
}

function contextBreakdown({
  systemPrompt = "",
  note = "",
  sources = [],
  activeSourceFile = null,
  summary = "",
  history = [],
  input = "",
  calibration = 1,
}) {
  const normalizedSources = normalizeSources(sources);
  const activeSource = selectActiveSource(normalizedSources, activeSourceFile);
  const otherSources = normalizedSources.filter((source) => source !== activeSource);
  return {
    system: estimateTextTokens(systemPrompt, { calibration }).tokens,
    input: estimateTextTokens(input, { calibration }).tokens,
    activeSource: activeSource
      ? estimateTextTokens(activeSource.code, { calibration }).tokens
      : 0,
    note: estimateTextTokens(note, { calibration }).tokens,
    sources: otherSources.reduce(
      (sum, source) => sum + estimateTextTokens(source.code, { calibration }).tokens,
      0,
    ),
    summary: estimateTextTokens(summary, { calibration }).tokens,
    history: estimateMessagesTokens(history, { calibration }).tokens,
  };
}

function fitText(value, availableTokens, calibration) {
  const text = typeof value === "string" ? value : "";
  const originalTokens = estimateTextTokens(text, { calibration }).tokens;
  if (originalTokens <= availableTokens) {
    return { text, tokens: originalTokens, originalTokens, truncated: false };
  }
  if (availableTokens <= 0 || !text) {
    return { text: "", tokens: 0, originalTokens, truncated: Boolean(text) };
  }

  const characters = Array.from(text);
  let low = 0;
  let high = characters.length;
  while (low < high) {
    const midpoint = Math.ceil((low + high) / 2);
    const candidate = characters.slice(0, midpoint).join("");
    if (estimateTextTokens(candidate, { calibration }).tokens <= availableTokens) low = midpoint;
    else high = midpoint - 1;
  }
  const fitted = characters.slice(0, low).join("");
  return {
    text: fitted,
    tokens: estimateTextTokens(fitted, { calibration }).tokens,
    originalTokens,
    truncated: fitted !== text,
  };
}

function sourceSelectionMetadata(source, fitted, active) {
  return {
    name: source.name,
    active,
    truncated: fitted.truncated && Boolean(fitted.text),
    omitted: Boolean(source.code) && !fitted.text,
    estimatedTokensOriginal: fitted.originalTokens,
    estimatedTokensIncluded: fitted.tokens,
  };
}

function selectActiveSource(sources, activeSourceFile) {
  if (!sources.length) return null;
  if (typeof activeSourceFile === "string" && activeSourceFile.trim()) {
    return sources.find((source) => source.name === activeSourceFile.trim()) ?? sources[0];
  }
  return sources[0];
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

function sumValues(value) {
  return Object.values(value).reduce((sum, item) => sum + item, 0);
}

function finiteNonNegative(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? Math.floor(number) : 0;
}

function positiveInteger(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.floor(number) : fallback;
}

function optionalPositiveInteger(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.floor(number) : null;
}

function nonNegativeInteger(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? Math.floor(number) : fallback;
}
