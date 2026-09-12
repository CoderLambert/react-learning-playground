import {
  DEFAULT_DEEPSEEK_MODEL,
  DEEPSEEK_OPENAI_BASE_URL,
  normalizeDeepSeekModel,
} from "./deepseekBrowserSettings.js";

export const DEEPSEEK_CONNECTION_ERROR_TYPES = Object.freeze({
  CONFIGURATION: "configuration",
  AUTHENTICATION: "authentication",
  NETWORK: "network",
  CORS: "cors",
  GATEWAY: "gateway",
  UNKNOWN: "unknown",
});

function trimSlash(value) {
  return String(value ?? "").replace(/\/+$/, "");
}

export function redactSecret(value) {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) return "";
  if (text.length <= 8) return "••••••••";
  return `${text.slice(0, 3)}••••${text.slice(-4)}`;
}

export function classifyDeepSeekConnectionError(error, { connectionMode = "browser" } = {}) {
  const status = Number(error?.status ?? error?.response?.status) || null;
  const message = String(error?.message ?? error ?? "").toLowerCase();

  if (status === 401 || status === 403 || message.includes("unauthorized") || message.includes("invalid api key")) {
    return {
      type: DEEPSEEK_CONNECTION_ERROR_TYPES.AUTHENTICATION,
      title: "API Key 无效或无权限",
      guidance: "检查 Key 是否完整、是否仍有效，以及该 Key 是否有调用当前模型的权限。",
    };
  }

  if (status === 400 || status === 404 || message.includes("model") || message.includes("base url")) {
    return {
      type: DEEPSEEK_CONNECTION_ERROR_TYPES.CONFIGURATION,
      title: "模型或连接配置不可用",
      guidance: "检查模型选择与 DeepSeek OpenAI-compatible Base URL 配置。",
    };
  }

  if (connectionMode === "gateway" && (status === 502 || status === 503 || status === 504)) {
    return {
      type: DEEPSEEK_CONNECTION_ERROR_TYPES.GATEWAY,
      title: "站点 AI 网关暂不可用",
      guidance: "稍后重试，或切换到浏览器直连并使用自己的 API Key。",
    };
  }

  if (message.includes("cors") || message.includes("failed to fetch") || message.includes("load failed")) {
    return {
      type: DEEPSEEK_CONNECTION_ERROR_TYPES.CORS,
      title: "浏览器无法直连 DeepSeek",
      guidance: "这通常由网络、代理或浏览器 CORS 限制引起；可检查网络后重试。",
    };
  }

  if (message.includes("timeout") || message.includes("timed out") || message.includes("network") || message.includes("abort")) {
    return {
      type: DEEPSEEK_CONNECTION_ERROR_TYPES.NETWORK,
      title: "网络连接超时或中断",
      guidance: "检查当前网络与代理状态后重试。",
    };
  }

  return {
    type: DEEPSEEK_CONNECTION_ERROR_TYPES.UNKNOWN,
    title: "连接测试失败",
    guidance: "请检查网络、API Key 和模型配置后重试。",
  };
}

export async function testDeepSeekBrowserConnection({
  apiKey,
  model = DEFAULT_DEEPSEEK_MODEL,
  baseUrl = DEEPSEEK_OPENAI_BASE_URL,
  fetchImpl = globalThis.fetch,
  timeoutMs = 8000,
} = {}) {
  const normalizedKey = typeof apiKey === "string" ? apiKey.trim() : "";
  if (!normalizedKey) {
    const error = new Error("API Key is required");
    error.status = 400;
    throw error;
  }
  if (typeof fetchImpl !== "function") throw new TypeError("fetch is unavailable");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(new Error("connection timeout")), timeoutMs);
  try {
    const response = await fetchImpl(`${trimSlash(baseUrl)}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${normalizedKey}`,
      },
      body: JSON.stringify({
        model: normalizeDeepSeekModel(model),
        messages: [{ role: "user", content: "Reply with OK." }],
        max_tokens: 1,
        stream: false,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const error = new Error(`DeepSeek connection test failed (${response.status})`);
      error.status = response.status;
      throw error;
    }

    return {
      ok: true,
      model: normalizeDeepSeekModel(model),
      endpoint: trimSlash(baseUrl),
    };
  } finally {
    clearTimeout(timeout);
  }
}
