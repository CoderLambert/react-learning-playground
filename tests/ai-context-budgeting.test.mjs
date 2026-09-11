import assert from "node:assert/strict";
import test from "node:test";

import {
  REDACTED_SECRET,
  createCompactionService,
  normalizeStructuredSummary,
  sanitizeCompactionText,
  shouldAutoCompact,
} from "../src/ai/compaction/compactionService.js";
import { buildContextBudget, selectContextWithinBudget } from "../src/ai/context/contextBudget.js";
import { getModelContextMetadata } from "../src/ai/context/modelMetadata.js";
import { calibrateTokenEstimate, estimateTextTokens } from "../src/ai/context/tokenEstimator.js";

test("token estimator is explicitly approximate and calibratable", () => {
  const estimate = estimateTextTokens("React 状态快照");
  assert.equal(estimate.estimated, true);
  assert.ok(estimate.tokens > 0);
  const calibrated = calibrateTokenEstimate({ estimatedTokens: 100, actualTokens: 150 });
  assert.ok(calibrated > 1 && calibrated < 1.5);
});

test("DeepSeek official presets use the current 1M window and unknown models are estimated", () => {
  assert.equal(getModelContextMetadata("deepseek-flash").contextWindowTokens, 1_048_576);
  assert.equal(getModelContextMetadata("deepseek-v4-pro").contextWindowTokens, 1_048_576);
  assert.equal(getModelContextMetadata("deepseek-v4-flash").contextWindowTokens, 1_048_576);
  assert.equal(getModelContextMetadata("deepseek-v4-flash").aliasOf, "deepseek-flash");
  assert.equal(getModelContextMetadata("deepseek-v4-pro").official, true);
  assert.equal(getModelContextMetadata("deepseek-v4-pro").officialMaxOutputTokens, 393_216);
  const unknown = getModelContextMetadata("future-model");
  assert.equal(unknown.contextWindowTokens, 131_072);
  assert.equal(unknown.known, false);
  assert.equal(unknown.official, false);
  assert.equal(unknown.estimated, true);
  assert.match(unknown.contextWindowLabel, /estimated|fallback/i);
});

test("runtime window overrides cannot masquerade as official metadata", () => {
  const metadata = getModelContextMetadata("deepseek-v4-pro", { contextWindowTokens: 32_000 });
  assert.equal(metadata.contextWindowTokens, 32_000);
  assert.equal(metadata.official, false);
  assert.equal(metadata.estimated, true);
});

test("budget arithmetic exposes breakdown, actual usage, warning and compaction states", () => {
  const budget = buildContextBudget({
    modelId: "future-model",
    softBudgetTokens: 100,
    systemPrompt: "system ".repeat(20),
    note: "note ".repeat(20),
    sources: [{ name: "A.jsx", code: "const a = 1;" }],
    summary: "summary",
    history: [{ id: "m1", role: "user", content: "hello" }],
    input: "question",
    actualUsage: { prompt_tokens: 91, completion_tokens: 9, total_tokens: 100 },
    modelOverrides: { warningRatio: 0.1, compactionRatio: 0.2 },
  });
  assert.equal(Object.values(budget.breakdown).reduce((a, b) => a + b, 0), budget.estimatedInputTokens);
  assert.equal(budget.actualUsage.inputTokens, 91);
  assert.equal(budget.actualUsage.outputTokens, 9);
  assert.equal(budget.actualUsage.totalTokens, 100);
  assert.equal(budget.actualUsage.exact, true);
  assert.equal(budget.warning, true);
  assert.equal(budget.shouldCompact, true);
  assert.equal(budget.budgetBasis, "actual-input");
});

test("actual provider input usage can trigger compaction when fixture text is small", () => {
  const budget = buildContextBudget({
    modelId: "deepseek-v4-pro",
    systemPrompt: "small fixture",
    actualUsage: { prompt_tokens: 220_000, completion_tokens: 100, total_tokens: 220_100 },
  });
  assert.equal(budget.estimatedInputTokens < 100, true);
  assert.equal(budget.budgetBasisTokens, 220_000);
  assert.equal(budget.shouldCompact, true);
});

test("selection preserves affordable current note/source and keeps the newest message tail", () => {
  const history = [
    { id: "old", role: "user", content: "x".repeat(300) },
    { id: "mid", role: "assistant", content: "short" },
    { id: "new", role: "user", content: "latest" },
  ];
  const result = selectContextWithinBudget({
    modelId: "future-model",
    softBudgetTokens: 90,
    systemPrompt: "system",
    note: "critical note",
    sources: [{ name: "Demo.jsx", numberedCode: "1 | const demo = true;" }],
    summary: "durable summary",
    history,
    input: "question",
  });
  assert.equal(result.metadata.currentLearningContextPreserved, true);
  assert.equal(result.context.note, "critical note");
  assert.equal(result.context.sources[0].code, "1 | const demo = true;");
  assert.equal(result.context.history.at(-1)?.id, "new");
  assert.ok(result.metadata.prunedMessageIds.includes("old"));
  assert.equal(result.metadata.prunedHistory, true);
  assert.equal(result.metadata.withinProviderInputLimit, true);
});

test("oversized fixed context is pruned explicitly and cannot exceed provider input budget", () => {
  const result = selectContextWithinBudget({
    modelId: "future-model",
    softBudgetTokens: 20,
    outputReserveTokens: 5,
    modelOverrides: { contextWindowTokens: 25, defaultSoftBudgetTokens: 20 },
    note: "笔记".repeat(100),
    sources: [{ name: "A.jsx", code: "source".repeat(100) }],
    history: [{ id: "old", role: "user", content: "history" }],
  });
  assert.equal(result.metadata.fixedContextOverBudget, true);
  assert.equal(result.metadata.truncatedSources, true);
  assert.equal(result.metadata.truncatedNote, true);
  assert.equal(result.metadata.prunedHistory, true);
  assert.equal(result.context.sources.length, 1);
  assert.ok(result.context.sources[0].code.length > 0);
  assert.equal(result.context.note, "");
  assert.equal(result.estimatedSelectedTokens <= 20, true);
  assert.equal(result.estimatedSelectedTokens <= result.maxInputTokens, true);
});

test("active source is selected before note and other sources", () => {
  const result = selectContextWithinBudget({
    modelId: "test",
    softBudgetTokens: 24,
    modelOverrides: {
      contextWindowTokens: 40,
      defaultSoftBudgetTokens: 24,
      defaultOutputReserveTokens: 8,
    },
    activeSourceFile: "active.jsx",
    note: "笔记".repeat(100),
    sources: [
      { name: "other.js", code: "other".repeat(100) },
      { name: "active.jsx", code: "active".repeat(100) },
    ],
  });
  assert.equal(result.context.sources[0].name, "active.jsx");
  assert.ok(result.context.sources[0].code.length > 0);
  assert.equal(result.context.note, "");
  assert.equal(result.metadata.sourceSelections[0].active, true);
  assert.equal(result.metadata.sourceSelections[1].omitted, true);
  assert.deepEqual(result.metadata.priority, [
    "system",
    "input",
    "activeSource",
    "note",
    "sources",
    "summary",
    "history",
  ]);
});

test("structured summary normalizes the stable compaction contract", () => {
  const summary = normalizeStructuredSummary({
    userGoal: " Learn ",
    establishedFacts: ["A", ""],
    currentLearningUnit: { id: "state" },
    importantSourceReferences: ["[Demo.jsx:L1]"],
    actions: ["ran demo"],
    decisions: ["keep browser history"],
    unresolvedQuestions: ["why"],
  });
  assert.deepEqual(summary.establishedFacts, ["A"]);
  assert.deepEqual(summary.experiments, ["ran demo"]);
  assert.deepEqual(summary.conclusions, ["keep browser history"]);
});

test("compaction summaries and summarizer input redact credential-shaped text", async () => {
  assert.equal(sanitizeCompactionText("Authorization: Bearer top.secret-token"), `Authorization: ${REDACTED_SECRET}`);
  assert.equal(sanitizeCompactionText("key sk-1234567890abcdef"), `key ${REDACTED_SECRET}`);

  let summarizedMessages;
  const service = createCompactionService({
    summarize: async ({ messages }) => {
      summarizedMessages = messages;
      return {
        userGoal: "API key: sk-1234567890abcdef",
        establishedFacts: ["Authorization=Bearer abc.def.ghi"],
      };
    },
  });
  const result = await service.compact({
    messages: [{ id: "m1", content: "use sk-1234567890abcdef", metadata: { apiKey: "raw" } }],
  });
  assert.equal(summarizedMessages[0].content.includes("sk-1234567890abcdef"), false);
  assert.equal(summarizedMessages[0].metadata, undefined);
  assert.equal(JSON.stringify(result.summary).includes("sk-1234567890abcdef"), false);
  assert.match(result.summary.userGoal, /\[REDACTED\]/);
});

test("manual compaction preserves original messages and returns a checkpoint", async () => {
  const messages = [{ id: "m1", role: "user", content: "hello" }];
  const service = createCompactionService({
    summarize: async () => ({ userGoal: "learn", establishedFacts: ["fact"] }),
    now: () => "2026-09-11T00:00:00.000Z",
  });
  const result = await service.compact({
    conversationId: "conversation-1",
    messages,
    modelId: "future-model",
  });
  assert.equal(result.checkpoint.conversationId, "conversation-1");
  assert.equal(result.checkpoint.coveredThroughMessageId, "m1");
  assert.equal(result.checkpoint.timestamp, "2026-09-11T00:00:00.000Z");
  assert.equal(result.checkpoint.createdAt, "2026-09-11T00:00:00.000Z");
  assert.equal(result.checkpoint.reason, "manual");
  assert.equal(messages.length, 1);
  assert.equal(result.originalMessages, messages);
});

test("auto compaction obeys threshold and supports summary chaining", async () => {
  let calls = 0;
  const service = createCompactionService({
    summarize: async ({ previousSummary }) => {
      calls += 1;
      return { ...previousSummary, conclusions: [...previousSummary.conclusions, `v${calls}`] };
    },
  });
  const low = await service.autoCompact({ budget: { usageRatio: 0.1, model: { compactionRatio: 0.8 } } });
  assert.equal(low.compacted, false);
  assert.equal(shouldAutoCompact({ usageRatio: 0.9, model: { compactionRatio: 0.8 } }), true);
  const first = await service.compact({ messages: [{ id: "1", content: "a" }] });
  const second = await service.compact({ messages: [{ id: "2", content: "b" }], previousSummary: first.summary });
  assert.deepEqual(second.summary.conclusions, ["v1", "v2"]);
});

test("compaction is concurrency-safe and failure is non-destructive", async () => {
  let resolve;
  const pending = new Promise((done) => { resolve = done; });
  const messages = [{ id: "m1", content: "original" }];
  const service = createCompactionService({ summarize: async () => pending });
  const first = service.compact({ messages });
  const second = service.compact({ messages });
  assert.equal(first, second);
  assert.equal(service.isCompacting(), true);
  resolve({ userGoal: "done" });
  await first;
  assert.equal(service.isCompacting(), false);
  assert.equal(messages[0].content, "original");

  const failing = createCompactionService({ summarize: async () => { throw new Error("boom"); } });
  await assert.rejects(() => failing.compact({ messages }), /boom/);
  assert.equal(messages[0].content, "original");
});
