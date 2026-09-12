import assert from "node:assert/strict";
import test from "node:test";
import {
  assertNoToolsInCompactionPayload,
  createAssistantToolContinuation,
  createToolResultContinuation,
} from "../src/ai/agent/agentProtocolGuards.js";

test("creates assistant continuation messages with tool calls", () => {
  assert.deepEqual(createAssistantToolContinuation({
    text: "",
    toolCalls: [{ id: "1" }],
  }).role, "assistant");
});

test("creates tool result continuation messages", () => {
  assert.deepEqual(createToolResultContinuation({
    toolCallId: "1",
    content: "ok",
  }), {
    role: "tool",
    toolCallId: "1",
    content: "ok",
  });
});

test("rejects tools in compaction payload", () => {
  assert.throws(() => assertNoToolsInCompactionPayload({ tools: [{}] }));
});
