export const AGENT_RUN_STATUSES = Object.freeze({
  RUNNING: "running",
  COMPLETED: "completed",
  FAILED: "failed",
  ABORTED: "aborted",
});

export const TOOL_EXECUTION_STATUSES = Object.freeze({
  PENDING: "pending",
  RUNNING: "running",
  SUCCEEDED: "succeeded",
  FAILED: "failed",
  ABORTED: "aborted",
});

export const TOOL_POLICIES = Object.freeze({ QUERY: "query", COMMAND: "command", DESTRUCTIVE: "destructive" });

export const AGENT_ERROR_CODES = Object.freeze({
  INVALID_TOOL_CALL: "INVALID_TOOL_CALL",
  TOOL_NOT_FOUND: "TOOL_NOT_FOUND",
  TOOL_ARGUMENTS_INVALID: "TOOL_ARGUMENTS_INVALID",
  TOOL_FORBIDDEN: "TOOL_FORBIDDEN",
  TOOL_EXECUTION_FAILED: "TOOL_EXECUTION_FAILED",
  STEP_LIMIT_EXCEEDED: "STEP_LIMIT_EXCEEDED",
  PROVIDER_FAILED: "PROVIDER_FAILED",
  ABORTED: "ABORTED",
});

export class AgentError extends Error {
  constructor(code, message, { details = null, cause } = {}) {
    if (!Object.values(AGENT_ERROR_CODES).includes(code)) throw new TypeError(`Unsupported agent error code: ${code}`);
    super(message || code, cause === undefined ? undefined : { cause });
    this.name = "AgentError";
    this.code = code;
    this.details = details;
  }
}

function requiredText(value, label) {
  if (typeof value !== "string" || !value.trim()) throw new TypeError(`${label} is required`);
  return value;
}

export function normalizeAgentToolCall(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new AgentError(AGENT_ERROR_CODES.INVALID_TOOL_CALL, "tool call must be an object");
  }
  if (!value.arguments || typeof value.arguments !== "object" || Array.isArray(value.arguments)) {
    throw new AgentError(AGENT_ERROR_CODES.INVALID_TOOL_CALL, "tool call arguments must be an object");
  }
  return {
    id: requiredText(value.id, "toolCall.id"),
    name: requiredText(value.name, "toolCall.name"),
    arguments: structuredClone(value.arguments),
  };
}

export function createToolExecutionContext(value = {}) {
  const actor = value.actor;
  if (!actor || typeof actor !== "object" || Array.isArray(actor)) throw new TypeError("tool execution actor is required");
  return Object.freeze({
    learningUnitId: requiredText(value.learningUnitId, "learningUnitId"),
    conversationId: requiredText(value.conversationId, "conversationId"),
    agentRunId: requiredText(value.agentRunId, "agentRunId"),
    contextSnapshotId: requiredText(value.contextSnapshotId, "contextSnapshotId"),
    mutationId: requiredText(value.mutationId, "mutationId"),
    actor: Object.freeze({ ...actor }),
  });
}

export function createToolResult({ toolCallId, toolName, ok, result, error } = {}) {
  const normalized = {
    toolCallId: requiredText(toolCallId, "toolCallId"),
    toolName: requiredText(toolName, "toolName"),
    ok: Boolean(ok),
  };
  if (normalized.ok) {
    normalized.result = result ?? null;
  } else {
    if (!error || typeof error !== "object" || Array.isArray(error)) throw new TypeError("failed tool result requires error");
    normalized.error = {
      code: requiredText(error.code, "error.code"),
      message: requiredText(error.message, "error.message"),
      ...(error.details === undefined ? {} : { details: error.details }),
    };
  }
  return normalized;
}
