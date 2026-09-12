import {
  MODEL_TURN_EVENT_TYPES,
  normalizeModelFinishReason,
  normalizeModelTurnRequest,
} from "../modelClient.js";

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
          return { id: call.id, name: call.name, arguments: args };
        });
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
              finishReason: normalizeModelFinishReason(finishReason),
              usage,
            };
            return;
          }

          const chunk = JSON.parse(data);
          if (chunk?.error) {
            const error = new Error(chunk.error.message || "DeepSeek stream failed");
            error.code = chunk.error.code || "DEEPSEEK_STREAM_ERROR";
            throw error;
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
    finishReason: normalizeModelFinishReason(finishReason),
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
        ...(normalized.tools.length ? { tools: normalized.tools.map(toProviderTool) } : {}),
      };

      const response = await fetchImpl(endpoint, {
        method: "POST",
        headers: {
          authorization: `Bearer ${String(apiKey ?? "").trim()}`,
          "content-type": "application/json",
          accept: "text/event-stream",
        },
        body: JSON.stringify(body),
        signal,
      });

      if (!response.ok) {
        const error = new Error(`DeepSeek API returned ${response.status}`);
        error.code = "DEEPSEEK_HTTP_ERROR";
        error.status = response.status;
        throw error;
      }
      if (!response.body) {
        const error = new Error("DeepSeek API did not return a stream");
        error.code = "DEEPSEEK_EMPTY_STREAM";
        throw error;
      }

      yield* parseDeepSeekModelStream(response.body);
    },
  };
}
