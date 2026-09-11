import { normalizeFinishReason } from "./finishReason.js";

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

export const CHAT_PURPOSES = Object.freeze({
  CHAT: "chat",
  COMPACTION: "compaction",
});

export const COMPACTION_PROMPT_PREFIX = "请将下面对话压缩为结构化 JSON";

export const CHAT_LIMITS = Object.freeze({
  maxQuestionChars: 4_000,
  maxHistoryMessages: 12,
  maxHistoryMessageChars: 8_000,
  maxContextChars: 180_000,
  maxCompactionPromptChars: 120_000,
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

export function isCompactionPrompt(value) {
  return typeof value === "string" && value.trimStart().startsWith(COMPACTION_PROMPT_PREFIX);
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
  if (serialized.length > limits.maxContextChars) {
    throw new RangeError(`context exceeds ${limits.maxContextChars} serialized characters`);
  }
  return serialized;
}

export function buildCompactionRequest({ prompt, context }, limits = CHAT_LIMITS) {
  const normalizedPrompt = typeof prompt === "string" ? prompt.trim() : "";
  if (!normalizedPrompt) throw new TypeError("compaction prompt is required");
  if (normalizedPrompt.length > limits.maxCompactionPromptChars) {
    throw new RangeError(`compaction prompt exceeds ${limits.maxCompactionPromptChars} characters`);
  }
  const contextJson = serializeContext(context, limits);
  return {
    purpose: CHAT_PURPOSES.COMPACTION,
    context: JSON.parse(contextJson),
    compaction: { prompt: normalizedPrompt },
  };
}

export function buildChatRequest({ question, context, history = [] }, limits = CHAT_LIMITS) {
  const normalizedQuestion = typeof question === "string" ? question.trim() : "";
  if (!normalizedQuestion) throw new TypeError("question is required");
  if (normalizedQuestion.length > limits.maxQuestionChars) {
    throw new RangeError(`question exceeds ${limits.maxQuestionChars} characters`);
  }

  const normalizedHistory = normalizeHistory(history, limits);
  const contextJson = serializeContext(context, limits);

  return {
    purpose: CHAT_PURPOSES.CHAT,
    question: normalizedQuestion,
    context: JSON.parse(contextJson),
    history: normalizedHistory,
    client: {
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
    ...(value.type === CHAT_EVENT_TYPES.DONE
      ? { finishReason: normalizeFinishReason(value.finishReason) }
      : {}),
    ...(value.type === CHAT_EVENT_TYPES.DONE && value.usage && typeof value.usage === "object"
      ? { usage: value.usage }
      : {}),
  };
}
