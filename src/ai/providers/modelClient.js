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

export const MODEL_TURN_PURPOSES = Object.freeze({
  CHAT: "chat",
  COMPACTION: "compaction",
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
  if (value == null || value === "") return MODEL_FINISH_REASONS.STOP;
  const reason = typeof value === "string" ? value.trim().toLowerCase() : value;
  if (reason === "stop" || reason === "end_turn" || reason === "eos" || reason === "complete") {
    return MODEL_FINISH_REASONS.STOP;
  }
  if (reason === "length" || reason === "max_tokens" || reason === "max_output_tokens" || reason === "token_limit") {
    return MODEL_FINISH_REASONS.LENGTH;
  }
  if (reason === "tool_calls" || reason === "function_call" || reason === "tool_call") {
    return MODEL_FINISH_REASONS.TOOL_CALLS;
  }
  if (reason === "error" || reason === "failed" || reason === "failure" || reason === "content_filter") {
    return MODEL_FINISH_REASONS.ERROR;
  }
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

export function normalizeModelTurnRequest({
  messages,
  tools = [],
  purpose = MODEL_TURN_PURPOSES.CHAT,
  toolChoice,
} = {}) {
  if (!Object.values(MODEL_TURN_PURPOSES).includes(purpose)) {
    throw new TypeError(`unsupported model turn purpose: ${purpose}`);
  }
  if (!Array.isArray(tools)) throw new TypeError("tools must be an array");
  const normalizedTools = tools.map(normalizeToolDefinition);
  if (purpose === MODEL_TURN_PURPOSES.COMPACTION && normalizedTools.length) {
    throw new TypeError("compaction model turn must disable tools");
  }
  const normalizedMessages = normalizeModelMessages(messages);
  if (purpose === MODEL_TURN_PURPOSES.COMPACTION && normalizedMessages.some((message) => (
    message.role === "tool" || message.toolCalls?.length
  ))) {
    throw new TypeError("compaction model turn cannot execute or continue tools");
  }

  const result = {
    purpose,
    messages: normalizedMessages,
    tools: normalizedTools,
  };
  if (toolChoice !== undefined && toolChoice !== null) {
    if (purpose === MODEL_TURN_PURPOSES.COMPACTION) {
      throw new TypeError("compaction model turn must omit toolChoice");
    }
    if (typeof toolChoice !== "string" && (!toolChoice || typeof toolChoice !== "object" || Array.isArray(toolChoice))) {
      throw new TypeError("toolChoice must be a string or object");
    }
    if (typeof toolChoice === "string" && !["auto", "none", "required"].includes(toolChoice)) {
      throw new TypeError("toolChoice is unsupported");
    }
    result.toolChoice = typeof toolChoice === "string"
      ? toolChoice
      : structuredClone(toolChoice);
  }
  return result;
}

export function normalizeModelTurnEvent(value) {
  assertObject(value, "model turn event");
  if (!Object.values(MODEL_TURN_EVENT_TYPES).includes(value.type)) {
    throw new TypeError(`unsupported model turn event type: ${String(value.type)}`);
  }

  if (value.type === MODEL_TURN_EVENT_TYPES.TEXT_DELTA) {
    if (typeof value.text !== "string") throw new TypeError("text_delta event requires text");
    return { type: value.type, text: value.text };
  }

  if (value.type === MODEL_TURN_EVENT_TYPES.TOOL_CALL) {
    return { type: value.type, toolCall: normalizeToolCall(value.toolCall, "event.toolCall") };
  }

  if (value.type === MODEL_TURN_EVENT_TYPES.ERROR) {
    return {
      type: value.type,
      message: normalizeText(value.message, "error.message"),
      ...(typeof value.code === "string" && value.code.trim() ? { code: value.code.trim() } : {}),
    };
  }

  return {
    type: value.type,
    ...(typeof value.requestId === "string" ? { requestId: value.requestId } : {}),
    ...(value.type === MODEL_TURN_EVENT_TYPES.TURN_COMPLETE
      ? { finishReason: normalizeModelFinishReason(value.finishReason) }
      : {}),
    ...(value.type === MODEL_TURN_EVENT_TYPES.TURN_COMPLETE && value.usage && typeof value.usage === "object"
      ? { usage: structuredClone(value.usage) }
      : {}),
  };
}

function parseModelTurnRecord(record) {
  const trimmed = record.trim();
  if (!trimmed || trimmed.startsWith(":")) return null;
  const payload = trimmed.startsWith("data:") ? trimmed.slice(5).trim() : trimmed;
  if (!payload || payload === "[DONE]") return null;

  let parsed;
  try {
    parsed = JSON.parse(payload);
  } catch (error) {
    throw new SyntaxError(`invalid model turn event JSON: ${error.message}`);
  }
  return normalizeModelTurnEvent(parsed);
}

export class ModelTurnStreamParser {
  #buffer = "";
  #decoder = new TextDecoder();

  push(chunk) {
    this.#buffer += typeof chunk === "string"
      ? chunk
      : this.#decoder.decode(chunk, { stream: true });
    const lines = this.#buffer.replace(/\r\n/g, "\n").split("\n");
    this.#buffer = lines.pop() ?? "";
    return lines.map(parseModelTurnRecord).filter(Boolean);
  }

  finish() {
    this.#buffer += this.#decoder.decode();
    const tail = this.#buffer.trim();
    this.#buffer = "";
    if (!tail) return [];
    const event = parseModelTurnRecord(tail);
    return event ? [event] : [];
  }
}

export async function* parseModelTurnEventStream(readableStream) {
  if (!readableStream?.getReader) throw new TypeError("model turn response body is not a readable stream");

  const reader = readableStream.getReader();
  const parser = new ModelTurnStreamParser();
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      for (const event of parser.push(value)) yield event;
    }
    for (const event of parser.finish()) yield event;
  } finally {
    reader.releaseLock?.();
  }
}

export class ModelClientError extends Error {
  constructor(message, { code = "MODEL_CLIENT_ERROR", status = null, cause } = {}) {
    super(message, cause === undefined ? undefined : { cause });
    this.name = "ModelClientError";
    this.code = code;
    this.status = status;
  }
}

export class ModelClientAbortError extends ModelClientError {
  constructor(message = "model turn request was cancelled") {
    super(message, { code: "MODEL_CLIENT_ABORTED" });
    this.name = "ModelClientAbortError";
  }
}

export function assertModelClient(value) {
  if (!value || typeof value.streamTurn !== "function") {
    throw new TypeError("model client with streamTurn() is required");
  }
  return value;
}
