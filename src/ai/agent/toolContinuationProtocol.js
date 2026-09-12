export function createToolContinuationMessage({ toolCallId, result }) {
  if (!toolCallId) throw new TypeError("toolCallId is required");
  return {
    role: "tool",
    toolCallId,
    content: JSON.stringify(result),
  };
}

export function stripToolsForCompaction(request = {}) {
  return {
    ...request,
    tools: [],
    toolChoice: undefined,
  };
}

export function assertNoToolsInCompaction(request = {}) {
  if (Array.isArray(request.tools) && request.tools.length > 0) {
    throw new Error("compaction cannot execute tools");
  }
  return request;
}
