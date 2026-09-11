export const CHAT_EVENT_TYPES = Object.freeze({
  START: "start",
  DELTA: "delta",
  DONE: "done",
  ERROR: "error",
});

export const CHAT_STATUS = Object.freeze({
  IDLE: "idle",
  STREAMING: "streaming",
  ERROR: "error",
  CANCELLED: "cancelled",
});

export const CHAT_LIMITS = Object.freeze({
  maxQuestionChars: 4_000,
  maxHistoryMessages: 20,
  maxHistoryMessageChars: 12_000,
  maxContextChars: 180_000,
});

const ALLOWED_ROLES = new Set(["user", "assistant"]);
const ALLOWED_EVENT_TYPES = new Set(Object.values(CHAT_EVENT_TYPES));

function assertPlainObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError(`${label} must be an object`);
  }
  return value;
}

function truncateText(value, maxChars) {
  const text = typeof value === "string" ? value : String(value ?? "");
  if (text.length <= maxChars) return { text, truncated: false };
  return { text: text.slice(0, maxChars), truncated: true };
}

export function normalizeHistory(history = [], limits = CHAT_LIMITS) {
  if (!Array.isArray(history)) throw new TypeError("history must be an array");

  return history.slice(-limits.maxHistoryMessages).map((message, index) => {
    assertPlainObject(message, `history[${index}]`);
    if (!ALLOWED_ROLES.has(message.role)) {
      throw new TypeError(`history[${index}].role must be user or assistant`);
    }

    const { text: content, truncated } = truncateText(
      message.content,
      limits.maxHistoryMessageChars,
    );

    return {
      role: message.role,
      content,
      ...(truncated ? { truncated: true } : {}),
    };
  });
}

export function serializeContext(context, limits = CHAT_LIMITS) {
  assertPlainObject(context, "context");
  const serialized = JSON.stringify(context);
  const { text, truncated } = truncateText(serialized, limits.maxContextChars);
  return { serialized: text, truncated };
}

export function buildChatRequest({ question, context, history = [] }, limits = CHAT_LIMITS) {
  const normalizedQuestion = typeof question === "string" ? question.trim() : "";
  if (!normalizedQuestion) throw new TypeError("question is required");
  if (normalizedQuestion.length > limits.maxQuestionChars) {
    throw new RangeError(`question exceeds ${limits.maxQuestionChars} characters`);
  }

  const normalizedHistory = normalizeHistory(history, limits);
  const { serialized: contextJson, truncated: contextTruncated } = serializeContext(context, limits);

  return {
    question: normalizedQuestion,
    context: JSON.parse(contextJson),
    history: normalizedHistory,
    client: {
      contextTruncated,
      historyTrimmed: history.length > limits.maxHistoryMessages,
    },
  };
}

export function normalizeChatEvent(value) {
  assertPlainObject(value, "chat event");
  if (!ALLOWED_EVENT_TYPES.has(value.type)) {
    throw new TypeError(`unsupported chat event type: ${String(value.type)}`);
  }

  if (value.type === CHAT_EVENT_TYPES.DELTA) {
    if (typeof value.text !== "string") throw new TypeError("delta event requires text");
    return { type: value.type, text: value.text };
  }

  if (value.type === CHAT_EVENT_TYPES.ERROR) {
    return {
      type: value.type,
      message: typeof value.message === "string" && value.message.trim()
        ? value.message.trim()
        : "AI assistant request failed",
      ...(typeof value.code === "string" ? { code: value.code } : {}),
    };
  }

  return {
    type: value.type,
    ...(typeof value.requestId === "string" ? { requestId: value.requestId } : {}),
    ...(value.type === CHAT_EVENT_TYPES.DONE && value.usage && typeof value.usage === "object"
      ? { usage: value.usage }
      : {}),
  };
}
