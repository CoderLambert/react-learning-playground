import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  LEARNING_CONTEXT_KINDS,
  createLearningActionContext,
} from "../src/learning-actions/promptBuilder.js";

const hookSource = await readFile(
  new URL("../src/ai/useAiLearningAssistant.js", import.meta.url),
  "utf8",
);

test("stale citation range from another source file fails closed", () => {
  const context = createLearningActionContext({
    kind: LEARNING_CONTEXT_KINDS.SOURCE,
    learningUnit: { id: "unit-1" },
    fileName: "Current.jsx",
    range: { fileName: "Previous.jsx", startLine: 10, endLine: 20 },
    semanticRegion: "citation",
    selectedText: "stale source text",
  });

  assert.equal(context.fileName, "Current.jsx");
  assert.equal(context.range, null);
  assert.equal(context.selectedText, "");
  assert.equal(context.semanticRegion, "full-file");
});

test("current source citation range remains intact", () => {
  const context = createLearningActionContext({
    kind: LEARNING_CONTEXT_KINDS.SOURCE,
    learningUnit: { id: "unit-1" },
    fileName: "Current.jsx",
    range: { fileName: "Current.jsx", startLine: 10, endLine: 20 },
    semanticRegion: "citation",
    selectedText: "current source text",
  });

  assert.deepEqual(context.range, { startLine: 10, endLine: 20 });
  assert.equal(context.selectedText, "current source text");
  assert.equal(context.semanticRegion, "citation");
});

test("provider settings transitions do not erase a pending learning-action prompt", () => {
  const saveStart = hookSource.indexOf("const saveConnectionSettings = useCallback");
  const clearStart = hookSource.indexOf("const clearConnectionSettings = useCallback", saveStart + 1);
  const summarizeStart = hookSource.indexOf("const summarizeMessages = useCallback", clearStart + 1);
  assert.notEqual(saveStart, -1);
  assert.notEqual(clearStart, -1);
  assert.notEqual(summarizeStart, -1);
  assert.doesNotMatch(hookSource.slice(saveStart, clearStart), /setInputValue\(\s*["']{2}\s*\)/);
  assert.doesNotMatch(hookSource.slice(clearStart, summarizeStart), /setInputValue\(\s*["']{2}\s*\)/);
});
