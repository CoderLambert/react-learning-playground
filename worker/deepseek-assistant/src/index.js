import { jsonError, readJsonBody, validateRequest } from "./validation.js";
import { callDeepSeek } from "./deepseek.js";
import { normalizeDeepSeekStream } from "./stream.js";

function cors(origin, allowedOrigin) {
  const allowed = origin && origin === allowedOrigin;
  return {
    allowed,
    headers: allowed ? {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
      Vary: "Origin",
    } : {},
  };
}

function json(body, status, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...headers },
  });
}

export async function handleRequest(request, env, deps = {}) {
  const origin = request.headers.get("origin") || "";
  const corsState = cors(origin, env.ALLOWED_ORIGIN);

  if (request.method === "OPTIONS") {
    return corsState.allowed ? new Response(null, { status: 204, headers: corsState.headers }) : new Response(null, { status: 403 });
  }
  if (request.method !== "POST") return json({ error: "method not allowed" }, 405, corsState.headers);
  if (!corsState.allowed) return json({ error: "origin not allowed" }, 403);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return json({ error: "content-type must be application/json" }, 415, corsState.headers);
  }

  try {
    const actor = request.headers.get("cf-connecting-ip") || "anonymous";
    if (env.AI_RATE_LIMITER) {
      const { success } = await env.AI_RATE_LIMITER.limit({ key: `chat:${actor}` });
      if (!success) return json({ error: "rate limit exceeded" }, 429, corsState.headers);
    }

    const payload = await readJsonBody(request);
    const validated = validateRequest(payload);
    const upstream = await callDeepSeek({
      env,
      request: validated,
      fetchImpl: deps.fetchImpl || fetch,
      signal: request.signal,
    });

    if (!upstream.ok) {
      return json({ error: "upstream model request failed", upstreamStatus: upstream.status }, 502, corsState.headers);
    }

    return new Response(normalizeDeepSeekStream(upstream.body), {
      status: 200,
      headers: {
        ...corsState.headers,
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    if (error?.name === "TimeoutError" || error?.name === "AbortError") {
      return json({ error: "upstream request timed out or was cancelled" }, 504, corsState.headers);
    }
    const normalized = jsonError(error);
    return json(normalized.body, normalized.status, corsState.headers);
  }
}

export default {
  fetch(request, env) {
    return handleRequest(request, env);
  },
};
