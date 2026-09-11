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
    maxTokens: numberEnv(env.MAX_OUTPUT_TOKENS, 2048, 128, 8192),
    timeoutMs: numberEnv(env.UPSTREAM_TIMEOUT_MS, 45_000, 5_000, 120_000),
  };
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
      messages: buildMessages(request),
      stream: true,
      stream_options: { include_usage: true },
      max_tokens: config.maxTokens,
      thinking: { type: "disabled" },
    }),
    signal: combined,
  });
}
