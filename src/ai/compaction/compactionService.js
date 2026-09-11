import { buildContextBudget } from "../context/contextBudget.js";

export const SUMMARY_CONTRACT_VERSION = 1;

export function createEmptySummary() {
  return {
    version: SUMMARY_CONTRACT_VERSION,
    userGoal: "",
    establishedFacts: [],
    currentLearningUnit: null,
    importantSourceReferences: [],
    experiments: [],
    conclusions: [],
    unresolvedQuestions: [],
  };
}

export function normalizeStructuredSummary(value) {
  const source = value && typeof value === "object" ? value : {};
  return {
    version: SUMMARY_CONTRACT_VERSION,
    userGoal: text(source.userGoal),
    establishedFacts: textArray(source.establishedFacts),
    currentLearningUnit: source.currentLearningUnit ?? null,
    importantSourceReferences: textArray(source.importantSourceReferences),
    experiments: textArray(source.experiments ?? source.actions),
    conclusions: textArray(source.conclusions ?? source.decisions),
    unresolvedQuestions: textArray(source.unresolvedQuestions),
  };
}

export function serializeStructuredSummary(summary) {
  const value = normalizeStructuredSummary(summary);
  return [
    "## Conversation Summary",
    section("User Goal", value.userGoal),
    section("Established Facts", value.establishedFacts),
    section("Current Learning Unit", formatLearningUnit(value.currentLearningUnit)),
    section("Important Source References", value.importantSourceReferences),
    section("Experiments / Actions", value.experiments),
    section("Conclusions / Decisions", value.conclusions),
    section("Unresolved Questions", value.unresolvedQuestions),
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function shouldAutoCompact(budget, thresholdRatio) {
  if (!budget || typeof budget !== "object") return false;
  const threshold = clampRatio(thresholdRatio ?? budget.model?.compactionRatio ?? 0.82);
  return Number(budget.usageRatio) >= threshold;
}

/**
 * Provider-neutral compactor. The injected summarize callback receives the
 * previous structured summary and a message slice. Original messages are
 * never mutated or deleted.
 */
export function createCompactionService({ summarize, now = () => new Date().toISOString() } = {}) {
  if (typeof summarize !== "function") {
    throw new TypeError("createCompactionService requires a summarize callback");
  }

  let active = null;

  async function compact({
    messages = [],
    previousSummary = null,
    coveredThroughMessageId = null,
    modelId,
    softBudgetTokens,
    budgetInput = {},
    reason = "manual",
  } = {}) {
    if (active) return active;

    const originalMessages = Array.isArray(messages) ? messages : [];
    const before = buildContextBudget({
      ...budgetInput,
      modelId,
      softBudgetTokens,
      history: originalMessages,
      summary: previousSummary ? serializeStructuredSummary(previousSummary) : budgetInput.summary,
    });

    const promise = (async () => {
      const result = await summarize({
        contractVersion: SUMMARY_CONTRACT_VERSION,
        previousSummary: previousSummary
          ? normalizeStructuredSummary(previousSummary)
          : createEmptySummary(),
        messages: originalMessages.map((message) => ({ ...message })),
        reason,
      });
      const summary = normalizeStructuredSummary(result);
      const serialized = serializeStructuredSummary(summary);
      const after = buildContextBudget({
        ...budgetInput,
        modelId,
        softBudgetTokens,
        history: [],
        summary: serialized,
      });
      const lastCovered =
        coveredThroughMessageId || originalMessages.at(-1)?.id || null;

      return {
        summary,
        serializedSummary: serialized,
        checkpoint: {
          version: SUMMARY_CONTRACT_VERSION,
          coveredThroughMessageId: lastCovered,
          estimatedTokensBefore: before.estimatedInputTokens,
          estimatedTokensAfter: after.estimatedInputTokens,
          createdAt: now(),
          reason,
        },
        originalMessages,
      };
    })().finally(() => {
      active = null;
    });

    active = promise;
    return promise;
  }

  function autoCompact(input = {}) {
    const budget = input.budget || buildContextBudget(input.budgetInput || {});
    if (!shouldAutoCompact(budget, input.thresholdRatio)) {
      return Promise.resolve({ compacted: false, reason: "below-threshold" });
    }
    return compact({ ...input, reason: "automatic" }).then((result) => ({
      compacted: true,
      ...result,
    }));
  }

  return {
    compact,
    autoCompact,
    isCompacting: () => Boolean(active),
  };
}

function section(title, value) {
  if (Array.isArray(value)) {
    return `### ${title}\n${value.length ? value.map((item) => `- ${item}`).join("\n") : "- None"}`;
  }
  return `### ${title}\n${value || "None"}`;
}

function formatLearningUnit(value) {
  if (!value) return "None";
  if (typeof value === "string") return value;
  const id = text(value.id);
  const title = text(value.title ?? value.label);
  return [id, title].filter(Boolean).join(" — ") || "None";
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function textArray(value) {
  return Array.isArray(value) ? value.map(text).filter(Boolean) : [];
}

function clampRatio(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0.82;
  return Math.min(1, Math.max(0, number));
}
