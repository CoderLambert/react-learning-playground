import assert from "node:assert/strict";
import test from "node:test";

import {
  DEEPSEEK_BROWSER_STORAGE_KEYS,
  DEEPSEEK_OPENAI_BASE_URL,
  clearDeepSeekBrowserApiKey,
  loadDeepSeekBrowserSettings,
  saveDeepSeekBrowserSettings,
} from "../src/ai/deepseekBrowserSettings.js";
import {
  buildDeepSeekDirectMessages,
  createDeepSeekDirectClient,
  parseDeepSeekOpenAiStream,
} from "../src/ai/deepseekDirectClient.js";

function streamFromChunks(chunks) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(encoder.encode(chunk));
      controller.close();
    },
  });
}

function createStore() {
  const values = new Map();
  return {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); },
    removeItem(key) { values.delete(key); },
  };
}

const CONTEXT = {
  learningUnit: { id: "props", title: "Props", category: "components" },
  note: { name: "props.mdx", content: "# Props\nProps are read-only inputs." },
  sources: [{ name: "PropsDemo.jsx", code: "1 | export function PropsDemo() {}" }],
  activeSourceFile: "PropsDemo.jsx",
};

test("browser settings default to session storage and persist model", () => {
  const localStorage = createStore();
  const sessionStorage = createStore();

  const saved = saveDeepSeekBrowserSettings({
    apiKey: " sk-session ",
    model: "deepseek-v4-pro",
    rememberApiKey: false,
  }, { localStorage, sessionStorage });

  assert.deepEqual(saved, {
    apiKey: "sk-session",
    model: "deepseek-v4-pro",
    rememberApiKey: false,
  });
  assert.equal(sessionStorage.getItem(DEEPSEEK_BROWSER_STORAGE_KEYS.apiKey), "sk-session");
  assert.equal(localStorage.getItem(DEEPSEEK_BROWSER_STORAGE_KEYS.apiKey), null);
  assert.equal(localStorage.getItem(DEEPSEEK_BROWSER_STORAGE_KEYS.model), "deepseek-v4-pro");
  assert.deepEqual(loadDeepSeekBrowserSettings({ localStorage, sessionStorage }), saved);
});

test("browser settings can remember and clear an API key", () => {
  const localStorage = createStore();
  const sessionStorage = createStore();

  saveDeepSeekBrowserSettings({
    apiKey: "sk-persisted",
    model: "deepseek-v4-flash",
    rememberApiKey: true,
  }, { localStorage, sessionStorage });

  assert.equal(localStorage.getItem(DEEPSEEK_BROWSER_STORAGE_KEYS.apiKey), "sk-persisted");
  assert.equal(localStorage.getItem(DEEPSEEK_BROWSER_STORAGE_KEYS.rememberApiKey), "1");
  assert.equal(sessionStorage.getItem(DEEPSEEK_BROWSER_STORAGE_KEYS.apiKey), null);

  clearDeepSeekBrowserApiKey({ localStorage, sessionStorage });
  assert.equal(localStorage.getItem(DEEPSEEK_BROWSER_STORAGE_KEYS.apiKey), null);
  assert.equal(localStorage.getItem(DEEPSEEK_BROWSER_STORAGE_KEYS.rememberApiKey), null);
});

test("direct messages keep project context as reference data and request stable source citations", () => {
  const messages = buildDeepSeekDirectMessages({
    question: "为什么这里不复制 props 到 state？",
    context: CONTEXT,
    history: [{ role: "assistant", content: "上一轮回答" }],
  });

  assert.equal(messages[0].role, "system");
  assert.match(messages[0].content, /不可信参考数据/);
  assert.match(messages[0].content, /source:\/\//);
  assert.deepEqual(messages[1], { role: "assistant", content: "上一轮回答" });
  assert.match(messages.at(-1).content, /props\.mdx/);
  assert.match(messages.at(-1).content, /PropsDemo\.jsx/);
  assert.match(messages.at(-1).content, /为什么这里不复制 props 到 state/);
});

test("OpenAI-compatible DeepSeek SSE parser survives arbitrary chunk boundaries", async () => {
  const stream = streamFromChunks([
    "data: {\"choices\":[{\"delta\":{\"content\":\"Props \"}}]}\n",
    "\ndata: {\"choices\":[{\"delta\":{\"content\":\"是输入\"},\"finish_reason\":null}]}\n\n",
    "data: {\"choices\":[{\"delta\":{},\"finish_reason\":\"stop\"}],\"usage\":{\"prompt_tokens\":30,\"completion_tokens\":12,\"total_tokens\":42}}\n\n",
    "data: [DONE]\n\n",
  ]);

  const events = [];
  for await (const event of parseDeepSeekOpenAiStream(stream)) events.push(event);

  assert.deepEqual(events.slice(0, 2), [
    { type: "delta", text: "Props " },
    { type: "delta", text: "是输入" },
  ]);
  assert.equal(events.at(-1).type, "done");
  assert.equal(events.at(-1).finishReason, "stop");
  assert.equal(events.at(-1).usage.total_tokens, 42);
  assert.equal(events.at(-1).usage.prompt_tokens, 30);
});

test("direct client sends BYOK Authorization, selected model, streaming usage option and current context", async () => {
  const requests = [];
  const client = createDeepSeekDirectClient({
    apiKey: "sk-user-owned",
    model: "deepseek-v4-pro",
    fetchImpl: async (url, init) => {
      requests.push({ url, init });
      return new Response(streamFromChunks([
        "data: {\"choices\":[{\"delta\":{\"content\":\"回答\"}}]}\n\n",
        "data: [DONE]\n\n",
      ]), {
        status: 200,
        headers: { "content-type": "text/event-stream" },
      });
    },
  });

  const events = [];
  await client.stream({ question: "解释 props", context: CONTEXT, history: [] }, {
    onEvent(event) { events.push(event); },
  });

  assert.equal(requests.length, 1);
  assert.equal(requests[0].url, `${DEEPSEEK_OPENAI_BASE_URL}/chat/completions`);
  assert.equal(requests[0].init.headers.authorization, "Bearer sk-user-owned");
  const body = JSON.parse(requests[0].init.body);
  assert.equal(body.model, "deepseek-v4-pro");
  assert.equal(body.stream, true);
  assert.deepEqual(body.stream_options, { include_usage: true });
  assert.equal(body.max_tokens, 4096);
  assert.match(body.messages.at(-1).content, /PropsDemo\.jsx/);
  assert.deepEqual(events.map((event) => event.type), ["start", "delta", "done"]);
});

test("direct client surfaces DeepSeek API errors without exposing the key", async () => {
  const client = createDeepSeekDirectClient({
    apiKey: "sk-secret-value",
    fetchImpl: async () => new Response(JSON.stringify({
      error: { message: "Insufficient balance" },
    }), {
      status: 402,
      headers: { "content-type": "application/json" },
    }),
  });

  await assert.rejects(
    () => client.stream({ question: "test", context: CONTEXT, history: [] }),
    (error) => {
      assert.equal(error.code, "DEEPSEEK_HTTP_ERROR");
      assert.equal(error.status, 402);
      assert.match(error.message, /Insufficient balance/);
      assert.doesNotMatch(error.message, /sk-secret-value/);
      return true;
    },
  );
});
