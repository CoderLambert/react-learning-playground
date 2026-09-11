import { buildContextBudget } from "../context/contextBudget.js";
import {
  REDACTED_SECRET,
  sanitizeSensitiveText,
} from "../storage/conversationStore.js";

export const SUMMARY_CONTRACT_VERSION = 1;
export { REDACTED_SECRET };

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
    userGoal: sanitizeCompactionText(text(source.userGoal)),
    establishedFacts: sanitizedTextArray(source.establishedFacts),
    currentLearningUnit: sanitizeLearningUnit(source.currentLearningUnit),
    importantSourceReferences: sanitizedTextArray(source.importantSourceReferences),
    experiments: sanitizedTextArray(source.experiments ?? source.actions),
    conclusions: sanitizedTextArray(source.conclusions ?? source.decisions),
    unresolvedQuestions: sanitizedTextArray(source.unresolvedQuestions),
  };
}

/**
 * Redact credential-shaped content before it is sent to a summarizer or
 * returned for persistence. This complements key-name filtering in storage:
 * secrets embedded in message/summary strings must not enter a checkpoint.
 */
export function sanitizeCompactionText(value) {
  return sanitizeSensitiveText(typeof value === "string" ? value : "");
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

  function compact({
    conversationId = null,
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
    const sanitizedMessages = originalMessages.map((message) => ({
      ...message,
      content: sanitizeCompactionText(message?.content),
      // Compaction needs conversational meaning, not arbitrary persisted
      // metadata which may contain provider/auth details.
      metadata: undefined,
      usage: undefined,
    }));
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
        messages: sanitizedMessages,
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
      const lastCovered = coveredThroughMessageId || originalMessages.at(-1)?.id || null;
      const timestamp = now();

      return {
        summary,
        serializedSummary: serialized,
        checkpoint: {
          conversationId,
          version: SUMMARY_CONTRACT_VERSION,
          coveredThroughMessageId: lastCovered,
          estimatedTokensBefore: before.estimatedInputTokens,
          estimatedTokensAfter: after.estimatedInputTokens,
          timestamp,
          // Retained for the existing repository schema.
          createdAt: timestamp,
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

function sanitizedTextArray(value) {
  return textArray(value).map(sanitizeCompactionText).filter(Boolean);
}

function sanitizeLearningUnit(value) {
  if (!value) return null;
  if (typeof value === "string") return sanitizeCompactionText(value.trim());
  if (typeof value !== "object") return null;
  return {
    ...(typeof value.id === "string" ? { id: sanitizeCompactionText(value.id.trim()) } : {}),
    ...(typeof (value.title ?? value.label) === "string"
      ? { title: sanitizeCompactionText((value.title ?? value.label).trim()) }
      : {}),
  };
}

function clampRatio(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0.82;
  return Math.min(1, Math.max(0, number));
}
