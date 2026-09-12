export const MODEL_TURN_EVENT_TYPES = Object.freeze({
  TURN_START: "turn_start",
  TEXT_DELTA: "text_delta",
  TOOL_CALL: "tool_call",
  TURN_COMPLETE: "turn_complete",
  ERROR: "error",
});

export const MODEL_FINISH_REASONS = Object.freeze({
  STOP: "stop",
  LENGTH: "length",
  TOOL_CALLS: "tool_calls",
  ERROR: "error",
});

const MODEL_ROLES = new Set(["system", "user", "assistant", "tool"]);

function assertObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError(`${label} must be an object`);
  }
  return value;
}

function normalizeText(value, label, { allowEmpty = false } = {}) {
  if (typeof value !== "string") throw new TypeError(`${label} must be a string`);
  if (!allowEmpty && !value.trim()) throw new TypeError(`${label} is required`);
  return value;
}

export function normalizeModelFinishReason(value) {
  if (value === "stop") return MODEL_FINISH_REASONS.STOP;
  if (value === "length" || value === "max_tokens") return MODEL_FINISH_REASONS.LENGTH;
  if (value === "tool_calls") return MODEL_FINISH_REASONS.TOOL_CALLS;
  if (value == null || value === "") return MODEL_FINISH_REASONS.STOP;
  return MODEL_FINISH_REASONS.ERROR;
}

export function normalizeToolCall(value, label = "tool call") {
  assertObject(value, label);
  return {
    id: normalizeText(value.id, `${label}.id`),
    name: normalizeText(value.name, `${label}.name`),
    arguments: assertObject(value.arguments, `${label}.arguments`),
  };
}

export function normalizeModelMessage(value, index = 0) {
  assertObject(value, `messages[${index}]`);
  if (!MODEL_ROLES.has(value.role)) {
    throw new TypeError(`messages[${index}].role is unsupported`);
  }

  if (value.role === "tool") {
    return {
      role: "tool",
      toolCallId: normalizeText(value.toolCallId, `messages[${index}].toolCallId`),
      content: normalizeText(value.content, `messages[${index}].content`, { allowEmpty: true }),
    };
  }

  const toolCalls = value.role === "assistant" && Array.isArray(value.toolCalls)
    ? value.toolCalls.map((call, callIndex) => normalizeToolCall(call, `messages[${index}].toolCalls[${callIndex}]`))
    : [];
  const content = value.content == null && toolCalls.length
    ? ""
    : normalizeText(value.content, `messages[${index}].content`, { allowEmpty: value.role === "assistant" });

  return {
    role: value.role,
    content,
    ...(toolCalls.length ? { toolCalls } : {}),
  };
}

export function normalizeModelMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new TypeError("messages must be a non-empty array");
  }
  return messages.map(normalizeModelMessage);
}

export function normalizeToolDefinition(value, index = 0) {
  assertObject(value, `tools[${index}]`);
  return {
    name: normalizeText(value.name, `tools[${index}].name`),
    description: typeof value.description === "string" ? value.description : "",
    inputSchema: assertObject(value.inputSchema, `tools[${index}].inputSchema`),
  };
}

export function normalizeModelTurnRequest({ messages, tools = [] } = {}) {
  if (!Array.isArray(tools)) throw new TypeError("tools must be an array");
  return {
    messages: normalizeModelMessages(messages),
    tools: tools.map(normalizeToolDefinition),
  };
}
