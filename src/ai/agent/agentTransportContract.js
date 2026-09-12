export const AGENT_TRANSPORT_EVENTS = Object.freeze({
  TURN_START: "turn_start",
  TEXT_DELTA: "text_delta",
  TOOL_CALL: "tool_call",
  TOOL_RESULT: "tool_result",
  TURN_COMPLETE: "turn_complete",
  ERROR: "error",
});

function assertObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError(`${label} must be an object`);
  }
  return value;
}

export function createToolContinuationRequest({ runId, messages, toolCalls }) {
  assertObject({ runId, messages, toolCalls }, "tool continuation request");
  if (!Array.isArray(messages)) throw new TypeError("messages must be an array");
  if (!Array.isArray(toolCalls)) throw new TypeError("toolCalls must be an array");

  return {
    type: "tool_continuation",
    runId,
    messages,
    toolCalls,
  };
}

export function assertCompactionSafeTransportPayload(payload) {
  assertObject(payload, "transport payload");

  if (payload.tools || payload.toolCalls || payload.toolChoice) {
    throw new Error("compaction payload cannot contain tool execution fields");
  }

  return payload;
}
