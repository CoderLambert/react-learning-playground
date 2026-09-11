import { CHAT_STATUS } from "./contracts";

export const INITIAL_CHAT_STATE = Object.freeze({
  messages: [],
  status: CHAT_STATUS.IDLE,
  error: null,
  activeRequestId: null,
});

function updateAssistantMessage(messages, requestId, updater) {
  return messages.map((message) => {
    if (message.role !== "assistant" || message.requestId !== requestId) return message;
    return updater(message);
  });
}

export function chatReducer(state, action) {
  switch (action.type) {
    case "request": {
      const requestId = action.requestId;
      if (!requestId) throw new TypeError("request action requires requestId");
      const question = String(action.question ?? "").trim();
      if (!question) throw new TypeError("request action requires question");

      return {
        ...state,
        messages: [
          ...state.messages,
          { id: `${requestId}:user`, role: "user", content: question, requestId },
        ],
        status: CHAT_STATUS.STREAMING,
        error: null,
        activeRequestId: requestId,
      };
    }

    case "start": {
      if (state.activeRequestId !== action.requestId) return state;
      const alreadyExists = state.messages.some(
        (message) => message.role === "assistant" && message.requestId === action.requestId,
      );
      if (alreadyExists) return state;

      return {
        ...state,
        messages: [
          ...state.messages,
          {
            id: `${action.requestId}:assistant`,
            role: "assistant",
            content: "",
            requestId: action.requestId,
            streaming: true,
          },
        ],
      };
    }

    case "delta": {
      if (state.activeRequestId !== action.requestId) return state;
      const text = typeof action.text === "string" ? action.text : "";
      if (!text) return state;

      const hasAssistant = state.messages.some(
        (message) => message.role === "assistant" && message.requestId === action.requestId,
      );
      const messages = hasAssistant
        ? state.messages
        : [
            ...state.messages,
            {
              id: `${action.requestId}:assistant`,
              role: "assistant",
              content: "",
              requestId: action.requestId,
              streaming: true,
            },
          ];

      return {
        ...state,
        messages: updateAssistantMessage(messages, action.requestId, (message) => ({
          ...message,
          content: `${message.content}${text}`,
        })),
      };
    }

    case "done": {
      if (state.activeRequestId !== action.requestId) return state;
      return {
        ...state,
        messages: updateAssistantMessage(state.messages, action.requestId, (message) => ({
          ...message,
          streaming: false,
          ...(action.usage ? { usage: action.usage } : {}),
        })),
        status: CHAT_STATUS.IDLE,
        error: null,
        activeRequestId: null,
      };
    }

    case "error": {
      if (state.activeRequestId !== action.requestId) return state;
      return {
        ...state,
        messages: updateAssistantMessage(state.messages, action.requestId, (message) => ({
          ...message,
          streaming: false,
        })),
        status: CHAT_STATUS.ERROR,
        error: action.message || "AI assistant request failed",
        activeRequestId: null,
      };
    }

    case "cancel": {
      if (state.activeRequestId !== action.requestId) return state;
      return {
        ...state,
        messages: updateAssistantMessage(state.messages, action.requestId, (message) => ({
          ...message,
          streaming: false,
          cancelled: true,
        })),
        status: CHAT_STATUS.CANCELLED,
        error: null,
        activeRequestId: null,
      };
    }

    case "reset":
      return { ...INITIAL_CHAT_STATE, messages: [] };

    default:
      return state;
  }
}
