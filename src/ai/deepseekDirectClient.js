import { AiChatAbortError, AiChatClientError } from "./chatClient.js";
import { CHAT_EVENT_TYPES } from "./contracts.js";
import {
  DEEPSEEK_OPENAI_BASE_URL,
  DEFAULT_DEEPSEEK_MODEL,
  normalizeDeepSeekModel,
} from "./deepseekBrowserSettings.js";
import { AI_LEARNING_ASSISTANT_SYSTEM_PROMPT } from "./assistantSystemPrompt.js";
import { normalizeFinishReason } from "./finishReason.js";
import { createDeepSeekChatCompletionsAdapter } from "./providers/deepseek/DeepSeekChatCompletionsAdapter.js";

// Provider token allowance, deliberately distinct from the 6000-character UI cap.
// DeepSeek currently supports a much larger official maximum output; 16K gives
// mixed Chinese/code answers enough room before the browser's character guard.
const DEFAULT_MAX_TOKENS = 16 * 1024;

function isAbortError(error, signal) {
  return Boolean(signal?.aborted) || error?.name === "AbortError" || error?.code === "ABORT_ERR";
}

function normalizeBaseUrl(baseUrl) {
  const normalized = typeof baseUrl === "string" ? baseUrl.trim().replace(/\/+$/, "") : "";
  return normalized || DEEPSEEK_OPENAI_BASE_URL;
}

function normalizeHistory(history = []) {
  if (!Array.isArray(history)) return [];
  return history
    .filter((message) => (
      (message?.role === "user" || message?.role === "assistant") &&
      typeof message?.content === "string" &&
      message.content.trim()
    ))
    .map((message) => ({ role: message.role, content: message.content.trim() }));
}

export function buildDeepSeekDirectMessages({ question, context, history = [] }) {
  const normalizedQuestion = typeof question === "string" ? question.trim() : "";
  if (!normalizedQuestion) throw new TypeError("AI question is required");
  if (!context?.learningUnit?.id) throw new TypeError("AI learning context is required");

  const user = [
    "<learning_material>",
    JSON.stringify(context, null, 2),
    "</learning_material>",
    "",
    "<question>",
    normalizedQuestion,
    "</question>",
  ].join("\n");

  return [
    { role: "system", content: AI_LEARNING_ASSISTANT_SYSTEM_PROMPT },
    ...normalizeHistory(history),
    { role: "user", content: user },
  ];
}

async function readApiError(response) {
  try {
    const text = (await response.text()).trim();
    if (!text) return `DeepSeek API returned ${response.status}`;
    try {
      const data = JSON.parse(text);
      return data?.error?.message || data?.message || `DeepSeek API returned ${response.status}`;
    } catch {
      return text;
    }
  } catch {
    return `DeepSeek API returned ${response.status}`;
  }
}

export async function* parseDeepSeekOpenAiStream(stream) {
  if (!stream || typeof stream.getReader !== "function") {
    throw new TypeError("DeepSeek response stream is required");
  }

  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let finishReason = null;
  let usage = null;
  let completed = false;

  try {
    while (true) {
      const { value, done } = await reader.read();
      buffer += decoder.decode(value ?? new Uint8Array(), { stream: !done });
      buffer = buffer.replace(/\r\n/g, "\n");

      let boundary = buffer.indexOf("\n\n");
      while (boundary >= 0) {
        const block = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);

        const dataLines = block
          .split("\n")
          .filter((line) => line.startsWith("data:"))
          .map((line) => line.slice(5).trim());

        for (const data of dataLines) {
          if (!data) continue;
          if (data === "[DONE]") {
            completed = true;
            yield {
              type: CHAT_EVENT_TYPES.DONE,
              finishReason: normalizeFinishReason(finishReason),
              usage,
            };
            return;
          }

          let chunk;
          try {
            chunk = JSON.parse(data);
          } catch (error) {
            throw new AiChatClientError("DeepSeek returned an invalid stream chunk", {
              code: "DEEPSEEK_STREAM_INVALID",
              cause: error,
            });
          }

          if (chunk?.error) {
            throw new AiChatClientError(chunk.error.message || "DeepSeek stream failed", {
              code: chunk.error.code || "DEEPSEEK_STREAM_ERROR",
            });
          }

          if (chunk?.usage) usage = chunk.usage;
          const choice = Array.isArray(chunk?.choices) ? chunk.choices[0] : null;
          const text = typeof choice?.delta?.content === "string" ? choice.delta.content : "";
          if (text) yield { type: CHAT_EVENT_TYPES.DELTA, text };
          if (choice?.finish_reason) finishReason = normalizeFinishReason(choice.finish_reason);
        }

        boundary = buffer.indexOf("\n\n");
      }

      if (done) break;
    }
  } finally {
    reader.releaseLock?.();
  }

  if (!completed) {
    if (buffer.trim()) {
      throw new AiChatClientError("DeepSeek stream ended with an incomplete event", {
        code: "DEEPSEEK_STREAM_INCOMPLETE",
      });
    }
    yield {
      type: CHAT_EVENT_TYPES.DONE,
      finishReason: normalizeFinishReason(finishReason),
      usage,
    };
  }
}

export function createDeepSeekDirectClient({
  apiKey = "",
  model = DEFAULT_DEEPSEEK_MODEL,
  baseUrl = DEEPSEEK_OPENAI_BASE_URL,
  maxTokens = DEFAULT_MAX_TOKENS,
  fetchImpl = globalThis.fetch,
} = {}) {
  if (typeof fetchImpl !== "function") throw new TypeError("fetch implementation is required");

  const normalizedKey = typeof apiKey === "string" ? apiKey.trim() : "";
  const normalizedModel = normalizeDeepSeekModel(model);
  const endpoint = `${normalizeBaseUrl(baseUrl)}/chat/completions`;
  const modelClient = createDeepSeekChatCompletionsAdapter({
    apiKey: normalizedKey,
    model: normalizedModel,
    baseUrl: normalizeBaseUrl(baseUrl),
    maxTokens,
    fetchImpl,
  });

  return {
    endpoint,
    model: normalizedModel,
    configured: Boolean(normalizedKey),

    /**
     * Provider-neutral AgentRunner entry point. The legacy stream() method
     * below remains the browser chat compatibility surface.
     */
    async *streamTurn(request, options = {}) {
      yield* modelClient.streamTurn(request, options);
    },

    async stream(request, { signal, onEvent } = {}) {
      if (!normalizedKey) {
        throw new AiChatClientError("请先配置自己的 DeepSeek API Key", {
          code: "DEEPSEEK_API_KEY_NOT_CONFIGURED",
        });
      }

      const messages = buildDeepSeekDirectMessages(request);
      let response;
      try {
        response = await fetchImpl(endpoint, {
          method: "POST",
          headers: {
            authorization: `Bearer ${normalizedKey}`,
            "content-type": "application/json",
            accept: "text/event-stream",
          },
          body: JSON.stringify({
            model: normalizedModel,
            messages,
            stream: true,
            stream_options: { include_usage: true },
            max_tokens: Number.isFinite(maxTokens) ? Math.max(1, Math.floor(maxTokens)) : DEFAULT_MAX_TOKENS,
          }),
          signal,
        });
      } catch (error) {
        if (isAbortError(error, signal)) throw new AiChatAbortError();
        const message = error instanceof TypeError
          ? "无法从浏览器直接连接 DeepSeek API，请检查网络或浏览器跨域限制。"
          : error?.message || "无法连接 DeepSeek API";
        throw new AiChatClientError(message, {
          code: "DEEPSEEK_NETWORK_ERROR",
          cause: error,
        });
      }

      if (!response.ok) {
        throw new AiChatClientError(await readApiError(response), {
          code: "DEEPSEEK_HTTP_ERROR",
          status: response.status,
        });
      }
      if (!response.body) {
        throw new AiChatClientError("DeepSeek API 没有返回流式响应", {
          code: "DEEPSEEK_EMPTY_STREAM",
          status: response.status,
        });
      }

      const events = [];
      const startEvent = { type: CHAT_EVENT_TYPES.START };
      events.push(startEvent);
      onEvent?.(startEvent);

      try {
        for await (const event of parseDeepSeekOpenAiStream(response.body)) {
          events.push(event);
          onEvent?.(event);
        }
      } catch (error) {
        if (isAbortError(error, signal)) throw new AiChatAbortError();
        if (error instanceof AiChatClientError) throw error;
        throw new AiChatClientError(error?.message || "DeepSeek 流式响应解析失败", {
          code: "DEEPSEEK_STREAM_INVALID",
          status: response.status,
          cause: error,
        });
      }

      return events;
    },
  };
}
