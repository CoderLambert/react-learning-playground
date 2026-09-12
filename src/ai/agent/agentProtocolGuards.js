export function createAssistantToolContinuation({ text = "", toolCalls = [] } = {}) {
  if (!Array.isArray(toolCalls)) throw new TypeError("toolCalls must be an array");
  return {
    role: "assistant",
    content: typeof text === "string" ? text : "",
    ...(toolCalls.length ? { toolCalls } : {}),
  };
}

export function createToolResultContinuation({ toolCallId, content }) {
  if (!toolCallId || typeof toolCallId !== "string") {
    throw new TypeError("toolCallId is required");
  }
  return {
    role: "tool",
    toolCallId,
    content: typeof content === "string" ? content : JSON.stringify(content),
  };
}

export function assertNoToolsInCompactionPayload(payload) {
  if (!payload || typeof payload !== "object") return payload;
  if (Array.isArray(payload.tools) && payload.tools.length) {
    throw new Error("compaction payload must not contain tools");
  }
  if (payload.toolCalls) {
    throw new Error("compaction payload must not contain tool calls");
  }
  return payload;
}
