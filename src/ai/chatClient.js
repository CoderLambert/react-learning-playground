import {
  buildChatRequest,
  buildCompactionRequest,
  CHAT_EVENT_TYPES,
  isCompactionPrompt,
} from "./contracts.js";
import { parseChatEventStream } from "./streamProtocol.js";
import {
  ModelClientAbortError,
  ModelClientError,
  normalizeModelTurnRequest,
  parseModelTurnEventStream,
} from "./providers/modelClient.js";

export class AiChatClientError extends Error {
  constructor(message, { code = "AI_CHAT_CLIENT_ERROR", status = null, cause } = {}) {
    super(message, { cause });
    this.name = "AiChatClientError";
    this.code = code;
    this.status = status;
  }
}

export class AiChatAbortError extends AiChatClientError {
  constructor(message = "AI assistant request was cancelled") {
    super(message, { code: "AI_CHAT_ABORTED" });
    this.name = "AiChatAbortError";
  }
}

export function getConfiguredAiAssistantUrl(env = import.meta.env) {
  const value = env?.VITE_AI_ASSISTANT_URL;
  return typeof value === "string" ? value.trim() : "";
}

function isAbortError(error, signal) {
  return Boolean(signal?.aborted) || error?.name === "AbortError" || error?.code === "ABORT_ERR";
}

async function readErrorMessage(response) {
  try {
    const contentType = response.headers?.get?.("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const data = await response.json();
      return data?.message || data?.error?.message || `AI gateway returned ${response.status}`;
    }
    const text = (await response.text()).trim();
    return text || `AI gateway returned ${response.status}`;
  } catch {
    return `AI gateway returned ${response.status}`;
  }
}

export function buildGatewayRequest(request) {
  if (request?.purpose === "compaction" || request?.compaction) {
    return buildCompactionRequest({
      prompt: request?.compaction?.prompt ?? request?.prompt,
      context: request?.context,
    });
  }

  // Transitional adapter for the existing compactor call site. The long
  // compaction material is no longer sent through the ordinary `question`
  // field, so the 4K user-question guard remains intact.
  if (isCompactionPrompt(request?.question)) {
    return buildCompactionRequest({ prompt: request.question, context: request.context });
  }

  return buildChatRequest(request);
}

/**
 * Build the provider-neutral gateway envelope used by AgentRunner. The
 * gateway receives messages and tool schemas only; it never receives tool
 * handlers or trusted execution context.
 */
export function buildGatewayModelTurnRequest(request = {}) {
  const normalized = normalizeModelTurnRequest(request);
  return {
    type: "model_turn",
    purpose: normalized.purpose,
    messages: normalized.messages,
    tools: normalized.tools,
    ...(normalized.toolChoice !== undefined ? { toolChoice: normalized.toolChoice } : {}),
  };
}

export function createAiChatClient({ endpoint = getConfiguredAiAssistantUrl(), fetchImpl = globalThis.fetch } = {}) {
  if (typeof fetchImpl !== "function") throw new TypeError("fetch implementation is required");

  return {
    endpoint,
    configured: Boolean(endpoint),

    async *streamTurn(request, { signal, onEvent } = {}) {
      if (!endpoint) {
        throw new ModelClientError("AI assistant gateway is not configured", {
          code: "AI_GATEWAY_NOT_CONFIGURED",
        });
      }

      const body = buildGatewayModelTurnRequest(request);
      let response;
      try {
        response = await fetchImpl(endpoint, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            accept: "application/x-ndjson, text/event-stream",
          },
          body: JSON.stringify(body),
          signal,
        });
      } catch (error) {
        if (isAbortError(error, signal)) throw new ModelClientAbortError();
        throw new ModelClientError(error?.message || "Unable to reach AI gateway", {
          code: "AI_GATEWAY_NETWORK_ERROR",
          cause: error,
        });
      }

      if (!response.ok) {
        throw new ModelClientError(await readErrorMessage(response), {
          code: "AI_GATEWAY_HTTP_ERROR",
          status: response.status,
        });
      }
      if (!response.body) {
        throw new ModelClientError("AI gateway returned no model stream", {
          code: "AI_GATEWAY_EMPTY_STREAM",
          status: response.status,
        });
      }

      let completed = false;
      try {
        for await (const event of parseModelTurnEventStream(response.body)) {
          if (event.type === "error") {
            throw new ModelClientError(event.message, {
              code: event.code || "AI_GATEWAY_STREAM_ERROR",
              status: response.status,
            });
          }
          if (event.type === "turn_complete") completed = true;
          onEvent?.(event);
          yield event;
        }
      } catch (error) {
        if (isAbortError(error, signal)) throw new ModelClientAbortError();
        if (error instanceof ModelClientError) throw error;
        throw new ModelClientError(error?.message || "Invalid AI gateway model stream", {
          code: "AI_GATEWAY_STREAM_INVALID",
          status: response.status,
          cause: error,
        });
      }
      if (!completed) {
        throw new ModelClientError("AI gateway model stream ended before completion", {
          code: "AI_GATEWAY_STREAM_INCOMPLETE",
          status: response.status,
        });
      }
    },

    async stream(request, { signal, onEvent } = {}) {
      if (!endpoint) {
        throw new AiChatClientError("AI assistant gateway is not configured", {
          code: "AI_GATEWAY_NOT_CONFIGURED",
        });
      }

      const body = buildGatewayRequest(request);
      let response;
      try {
        response = await fetchImpl(endpoint, {
          method: "POST",
          headers: { "content-type": "application/json", accept: "application/x-ndjson, text/event-stream" },
          body: JSON.stringify(body),
          signal,
        });
      } catch (error) {
        if (isAbortError(error, signal)) throw new AiChatAbortError();
        throw new AiChatClientError(error?.message || "Unable to reach AI gateway", {
          code: "AI_GATEWAY_NETWORK_ERROR",
          cause: error,
        });
      }

      if (!response.ok) {
        throw new AiChatClientError(await readErrorMessage(response), {
          code: "AI_GATEWAY_HTTP_ERROR",
          status: response.status,
        });
      }

      if (!response.body) {
        throw new AiChatClientError("AI gateway returned no stream", {
          code: "AI_GATEWAY_EMPTY_STREAM",
          status: response.status,
        });
      }

      const events = [];
      try {
        for await (const event of parseChatEventStream(response.body)) {
          events.push(event);
          onEvent?.(event);
          if (event.type === CHAT_EVENT_TYPES.ERROR) {
            throw new AiChatClientError(event.message, {
              code: event.code || "AI_GATEWAY_STREAM_ERROR",
              status: response.status,
            });
          }
        }
      } catch (error) {
        if (isAbortError(error, signal)) throw new AiChatAbortError();
        if (error instanceof AiChatClientError) throw error;
        throw new AiChatClientError(error?.message || "Invalid AI gateway stream", {
          code: "AI_GATEWAY_STREAM_INVALID",
          status: response.status,
          cause: error,
        });
      }

      return events;
    },
  };
}
