import assert from "node:assert/strict";
import test from "node:test";
import {
  assertCompactionSafeTransportPayload,
  createToolContinuationRequest,
} from "../src/ai/agent/agentTransportContract.js";

test("creates tool continuation transport payload", () => {
  const result = createToolContinuationRequest({
    runId: "run-1",
    messages: [],
    toolCalls: [{ id: "call-1" }],
  });

  assert.equal(result.type, "tool_continuation");
  assert.equal(result.runId, "run-1");
});

test("rejects tools during compaction transport", () => {
  assert.throws(() =>
    assertCompactionSafeTransportPayload({ tools: [] }),
  );
});
