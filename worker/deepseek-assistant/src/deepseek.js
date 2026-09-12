import { buildMessages } from "./prompt.js";

function numberEnv(value, fallback, min, max) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, Math.round(parsed)));
}

export function deepSeekConfig(env) {
  return {
    base: (env.DEEPSEEK_API_BASE || "https://api.deepseek.com").replace(/\/$/, ""),
    model: env.DEEPSEEK_MODEL || "deepseek-v4-flash",
    maxTokens: numberEnv(env.MAX_OUTPUT_TOKENS, 16 * 1024, 128, 384 * 1024),
    timeoutMs: numberEnv(env.UPSTREAM_TIMEOUT_MS, 45_000, 5_000, 120_000),
  };
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

function buildProviderMessages(request) {
  return request.type === "model_turn"
    ? request.messages.map(toProviderMessage)
    : buildMessages(request);
}

export async function callDeepSeek({ env, request, fetchImpl = fetch, signal }) {
  if (!env.DEEPSEEK_API_KEY) {
    const error = new Error("DeepSeek API key is not configured");
    error.status = 503;
    throw error;
  }

  const config = deepSeekConfig(env);
  const timeout = AbortSignal.timeout(config.timeoutMs);
  const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;

  return fetchImpl(`${config.base}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify({
      model: config.model,
      messages: buildProviderMessages(request),
      stream: true,
      stream_options: { include_usage: true },
      max_tokens: config.maxTokens,
      thinking: { type: "disabled" },
      ...(request.type === "model_turn" && request.tools.length
        ? { tools: request.tools.map(toProviderTool) }
        : {}),
      ...(request.type === "model_turn" && request.toolChoice !== undefined
        ? { tool_choice: toProviderToolChoice(request.toolChoice) }
        : {}),
    }),
    signal: combined,
  });
}
