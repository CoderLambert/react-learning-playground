import assert from "node:assert/strict";
import test from "node:test";

import {
  classifyDeepSeekConnectionError,
  redactSecret,
  testDeepSeekBrowserConnection,
} from "../src/ai/deepseekConnectionDiagnostics.js";

test("redactSecret never returns the full API key", () => {
  assert.equal(redactSecret("sk-1234567890"), "sk-••••7890");
  assert.equal(redactSecret("short"), "••••••••");
  assert.equal(redactSecret(""), "");
});

test("classifyDeepSeekConnectionError maps authentication failures", () => {
  assert.deepEqual(classifyDeepSeekConnectionError({ status: 401 }), {
    type: "authentication",
    title: "API Key 无效或无权限",
    guidance: "检查 Key 是否完整、是否仍有效，以及该 Key 是否有调用当前模型的权限。",
  });
});

test("classifyDeepSeekConnectionError maps configuration failures", () => {
  assert.equal(classifyDeepSeekConnectionError({ status: 404 }).type, "configuration");
  assert.equal(classifyDeepSeekConnectionError(new Error("model unavailable")).type, "configuration");
});

test("classifyDeepSeekConnectionError distinguishes gateway failures", () => {
  assert.equal(
    classifyDeepSeekConnectionError({ status: 503 }, { connectionMode: "gateway" }).type,
    "gateway",
  );
});

test("classifyDeepSeekConnectionError distinguishes CORS-like browser failures", () => {
  const result = classifyDeepSeekConnectionError(new TypeError("Failed to fetch"));
  assert.equal(result.type, "cors");
});

test("classifyDeepSeekConnectionError maps timeout/network and unknown failures", () => {
  assert.equal(classifyDeepSeekConnectionError(new Error("connection timeout")).type, "network");
  assert.equal(classifyDeepSeekConnectionError(new Error("something unexpected")).type, "unknown");
});

test("testDeepSeekBrowserConnection sends a minimal request without exposing key in the result", async () => {
  let request;
  const result = await testDeepSeekBrowserConnection({
    apiKey: "sk-secret-value",
    model: "deepseek-v4-flash",
    fetchImpl: async (url, init) => {
      request = { url, init };
      return { ok: true, status: 200 };
    },
  });

  assert.equal(request.url, "https://api.deepseek.com/chat/completions");
  assert.equal(request.init.headers.Authorization, "Bearer sk-secret-value");
  assert.equal(JSON.parse(request.init.body).max_tokens, 1);
  assert.equal(result.ok, true);
  assert.equal(JSON.stringify(result).includes("sk-secret-value"), false);
});

test("testDeepSeekBrowserConnection rejects missing keys before fetch", async () => {
  await assert.rejects(
    () => testDeepSeekBrowserConnection({ apiKey: "", fetchImpl: async () => ({ ok: true }) }),
    /API Key is required/,
  );
});
