import {
  MODEL_FINISH_REASONS,
  MODEL_TURN_EVENT_TYPES,
  ModelClientAbortError,
  ModelClientError,
  normalizeModelFinishReason,
  normalizeToolCall,
  normalizeModelTurnRequest,
} from "../modelClient.js";

function isAbortError(error, signal) {
  return Boolean(signal?.aborted) || error?.name === "AbortError" || error?.code === "ABORT_ERR";
}

function toProviderMessage(message) {
  if (message.role === "tool") {
    return {
      role: "tool",
      tool_call_id: message.toolCallId,
      content: message.content,
    };
  }

  if (message.role === "assistant" && message.toolCalls?.length) {
    return {
      role: "assistant",
      content: message.content || null,
      tool_calls: message.toolCalls.map((call) => ({
        id: call.id,
        type: "function",
        function: {
          name: call.name,
          arguments: JSON.stringify(call.arguments),
        },
      })),
    };
  }

  return { role: message.role, content: message.content };
}

function toProviderTool(tool) {
  return {
    type: "function",
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.inputSchema,
    },
  };
}

function toProviderToolChoice(toolChoice) {
  if (typeof toolChoice !== "object" || toolChoice === null) return toolChoice;
  if (typeof toolChoice.name === "string" && !toolChoice.type) {
    return {
      type: "function",
      function: { name: toolChoice.name },
    };
  }
  return toolChoice;
}

function createToolAccumulator() {
  const calls = new Map();
  return {
    append(deltaCalls = []) {
      for (const delta of deltaCalls) {
        const index = Number.isInteger(delta?.index) ? delta.index : 0;
        const current = calls.get(index) ?? {
          id: "",
          name: "",
          argumentsText: "",
        };
        if (typeof delta?.id === "string") current.id += delta.id;
        if (typeof delta?.function?.name === "string") current.name += delta.function.name;
        if (typeof delta?.function?.arguments === "string") {
          current.argumentsText += delta.function.arguments;
        }
        calls.set(index, current);
      }
    },
    complete() {
      return [...calls.entries()]
        .sort(([a], [b]) => a - b)
        .map(([, call]) => {
          let args;
          try {
            args = JSON.parse(call.argumentsText || "{}");
          } catch (error) {
            const invalid = new Error("DeepSeek returned invalid tool arguments JSON");
            invalid.code = "DEEPSEEK_TOOL_ARGUMENTS_INVALID";
            invalid.cause = error;
            throw invalid;
          }
          return normalizeToolCall({ id: call.id, name: call.name, arguments: args }, "DeepSeek tool call");
        });
    },
    get hasCalls() {
      return calls.size > 0;
    },
  };
}

export async function* parseDeepSeekModelStream(stream) {
  if (!stream || typeof stream.getReader !== "function") {
    throw new TypeError("DeepSeek response stream is required");
  }

  const reader = stream.getReader();
  const decoder = new TextDecoder();
  const toolAccumulator = createToolAccumulator();
  let buffer = "";
  let finishReason = null;
  let usage = null;
  let completed = false;

  yield { type: MODEL_TURN_EVENT_TYPES.TURN_START };

  try {
    while (true) {
      const { value, done } = await reader.read();
      buffer += decoder.decode(value ?? new Uint8Array(), { stream: !done }).replace(/\r\n/g, "\n");

      let boundary = buffer.indexOf("\n\n");
      while (boundary >= 0) {
        const block = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);
        for (const line of block.split("\n")) {
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (!data) continue;
          if (data === "[DONE]") {
            const toolCalls = toolAccumulator.complete();
            for (const toolCall of toolCalls) {
              yield { type: MODEL_TURN_EVENT_TYPES.TOOL_CALL, toolCall };
            }
            completed = true;
            yield {
              type: MODEL_TURN_EVENT_TYPES.TURN_COMPLETE,
              finishReason: toolAccumulator.hasCalls
                ? MODEL_FINISH_REASONS.TOOL_CALLS
                : normalizeModelFinishReason(finishReason),
              usage,
            };
            return;
          }

          let chunk;
          try {
            chunk = JSON.parse(data);
          } catch (error) {
            throw new ModelClientError("DeepSeek returned an invalid stream chunk", {
              code: "DEEPSEEK_STREAM_INVALID",
              cause: error,
            });
          }
          if (chunk?.error) {
            throw new ModelClientError(chunk.error.message || "DeepSeek stream failed", {
              code: chunk.error.code || "DEEPSEEK_STREAM_ERROR",
            });
          }
          if (chunk?.usage) usage = chunk.usage;
          const choice = Array.isArray(chunk?.choices) ? chunk.choices[0] : null;
          const delta = choice?.delta ?? {};
          if (typeof delta.content === "string" && delta.content) {
            yield { type: MODEL_TURN_EVENT_TYPES.TEXT_DELTA, text: delta.content };
          }
          if (Array.isArray(delta.tool_calls)) toolAccumulator.append(delta.tool_calls);
          if (choice?.finish_reason) finishReason = choice.finish_reason;
        }
        boundary = buffer.indexOf("\n\n");
      }

      if (done) break;
    }
  } finally {
    reader.releaseLock?.();
  }

  if (!completed && buffer.trim()) {
    const error = new Error("DeepSeek stream ended with an incomplete event");
    error.code = "DEEPSEEK_STREAM_INCOMPLETE";
    throw error;
  }

  const toolCalls = toolAccumulator.complete();
  for (const toolCall of toolCalls) {
    yield { type: MODEL_TURN_EVENT_TYPES.TOOL_CALL, toolCall };
  }
  yield {
    type: MODEL_TURN_EVENT_TYPES.TURN_COMPLETE,
    finishReason: toolAccumulator.hasCalls
      ? MODEL_FINISH_REASONS.TOOL_CALLS
      : normalizeModelFinishReason(finishReason),
    usage,
  };
}

export function createDeepSeekChatCompletionsAdapter({
  apiKey,
  model,
  baseUrl = "https://api.deepseek.com",
  maxTokens = 16 * 1024,
  fetchImpl = globalThis.fetch,
} = {}) {
  if (typeof fetchImpl !== "function") throw new TypeError("fetch implementation is required");
  const endpoint = `${String(baseUrl).replace(/\/+$/, "")}/chat/completions`;

  return {
    endpoint,
    model,
    async *streamTurn(request, { signal } = {}) {
      const normalized = normalizeModelTurnRequest(request);
      const body = {
        model,
        messages: normalized.messages.map(toProviderMessage),
        stream: true,
        stream_options: { include_usage: true },
        max_tokens: maxTokens,
        thinking: { type: "disabled" },
        ...(normalized.tools.length ? { tools: normalized.tools.map(toProviderTool) } : {}),
        ...(normalized.toolChoice !== undefined ? { tool_choice: toProviderToolChoice(normalized.toolChoice) } : {}),
      };

      let response;
      try {
        if (!String(apiKey ?? "").trim()) {
          throw new ModelClientError("DeepSeek API key is not configured", {
            code: "DEEPSEEK_API_KEY_NOT_CONFIGURED",
          });
        }
        response = await fetchImpl(endpoint, {
          method: "POST",
          headers: {
            authorization: `Bearer ${String(apiKey ?? "").trim()}`,
            "content-type": "application/json",
            accept: "text/event-stream",
          },
          body: JSON.stringify(body),
          signal,
        });
      } catch (error) {
        if (isAbortError(error, signal)) throw new ModelClientAbortError();
        if (error instanceof ModelClientError) throw error;
        throw new ModelClientError(error?.message || "Unable to reach DeepSeek", {
          code: "DEEPSEEK_NETWORK_ERROR",
          cause: error,
        });
      }

      if (!response.ok) {
        throw new ModelClientError(`DeepSeek API returned ${response.status}`, {
          code: "DEEPSEEK_HTTP_ERROR",
          status: response.status,
        });
      }
      if (!response.body) {
        throw new ModelClientError("DeepSeek API did not return a stream", {
          code: "DEEPSEEK_EMPTY_STREAM",
          status: response.status,
        });
      }

      try {
        yield* parseDeepSeekModelStream(response.body);
      } catch (error) {
        if (isAbortError(error, signal)) throw new ModelClientAbortError();
        if (error instanceof ModelClientError) throw error;
        throw new ModelClientError(error?.message || "DeepSeek stream failed", {
          code: "DEEPSEEK_STREAM_INVALID",
          cause: error,
        });
      }
    },
  };
}
