import assert from "node:assert/strict";
import test from "node:test";

import { buildMessages, SYSTEM_PROMPT } from "../src/prompt.js";
import { parseDeepSeekChunk, normalizeDeepSeekStream } from "../src/stream.js";
import { validateRequest } from "../src/validation.js";
import { handleRequest } from "../src/index.js";

const context = {
  learningUnit: { id: "props", title: "Props", category: "components" },
  note: { name: "props.mdx", content: "# Props\n当前笔记" },
  sources: [{ name: "PropsDemo.jsx", code: "1 | export function PropsDemo() {}" }],
  activeSourceFile: "PropsDemo.jsx",
};

function requestBody(extra = {}) {
  return { question: "为什么？", context, history: [], ...extra };
}

function sse(lines) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(lines.join("\n") + "\n"));
      controller.close();
    },
  });
}

function chunkedBytes(bytes, splitAt) {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(bytes.slice(0, splitAt));
      controller.enqueue(bytes.slice(splitAt));
      controller.close();
    },
  });
}

async function readLines(stream) {
  return (await new Response(stream).text()).trim().split("\n").map(JSON.parse);
}

test("validates provider-neutral request envelope", () => {
  const result = validateRequest(requestBody());
  assert.equal(result.context.learningUnit.id, "props");
  assert.equal(result.context.sources[0].name, "PropsDemo.jsx");
  assert.throws(() => validateRequest({ question: "x", context: {} }), /learningUnit/);
});

test("prompt prioritizes project note/source and citation behavior", () => {
  const messages = buildMessages(validateRequest(requestBody()));
  assert.match(SYSTEM_PROMPT, /当前 Note 与 Source/);
  assert.match(SYSTEM_PROMPT, /教学 Demo/);
  assert.match(messages.at(-1).content, /filename="PropsDemo.jsx"/);
  assert.match(messages.at(-1).content, /1 \| export function/);
});

test("parses DeepSeek ChatCompletions SSE and normalizes app events", async () => {
  assert.deepEqual(parseDeepSeekChunk('data: {"choices":[{"delta":{"content":"你"},"finish_reason":null}]}'), {
    done: false, delta: "你", finishReason: null, usage: null,
  });
  const stream = normalizeDeepSeekStream(sse([
    'data: {"choices":[{"delta":{"content":"你好"},"finish_reason":null}],"usage":null}',
    'data: {"choices":[{"delta":{},"finish_reason":"stop"}],"usage":{"total_tokens":12}}',
    "data: [DONE]",
  ]));
  const events = await readLines(stream);
  assert.deepEqual(events.map((event) => event.type), ["start", "delta", "done"]);
  assert.equal(events[1].text, "你好");
  assert.equal(events[2].finishReason, "stop");
  assert.equal(events[2].usage.total_tokens, 12);
});

test("concurrent streams keep UTF-8 decoder state isolated", async () => {
  const encoder = new TextEncoder();
  const makePayload = (text) => encoder.encode(
    `data: ${JSON.stringify({ choices: [{ delta: { content: text }, finish_reason: null }] })}\n` +
      "data: [DONE]\n",
  );
  const first = makePayload("你");
  const second = makePayload("好");
  const firstMarker = encoder.encode("你");
  const secondMarker = encoder.encode("好");
  const findSplit = (bytes, marker) => {
    outer: for (let i = 0; i <= bytes.length - marker.length; i += 1) {
      for (let j = 0; j < marker.length; j += 1) {
        if (bytes[i + j] !== marker[j]) continue outer;
      }
      return i + 1;
    }
    throw new Error("UTF-8 marker not found");
  };

  const [firstEvents, secondEvents] = await Promise.all([
    readLines(normalizeDeepSeekStream(chunkedBytes(first, findSplit(first, firstMarker)))),
    readLines(normalizeDeepSeekStream(chunkedBytes(second, findSplit(second, secondMarker)))),
  ]);

  assert.equal(firstEvents[1].text, "你");
  assert.equal(secondEvents[1].text, "好");
});

test("cancelling normalized output cancels the locked upstream reader", async () => {
  let cancelled = false;
  const upstream = new ReadableStream({
    pull() {},
    cancel() {
      cancelled = true;
    },
  });
  const reader = normalizeDeepSeekStream(upstream).getReader();
  const first = await reader.read();
  assert.equal(JSON.parse(new TextDecoder().decode(first.value)).type, "start");
  await reader.cancel("stop");
  assert.equal(cancelled, true);
});

test("gateway enforces origin, media type and rate limit", async () => {
  const base = "https://worker.example/chat";
  const blocked = await handleRequest(new Request(base, { method: "POST", headers: { origin: "https://evil.example", "content-type": "application/json" }, body: JSON.stringify(requestBody()) }), { ALLOWED_ORIGIN: "https://coderlambert.github.io" });
  assert.equal(blocked.status, 403);

  const limited = await handleRequest(new Request(base, { method: "POST", headers: { origin: "https://coderlambert.github.io", "content-type": "application/json", "cf-connecting-ip": "203.0.113.1" }, body: JSON.stringify(requestBody()) }), {
    ALLOWED_ORIGIN: "https://coderlambert.github.io",
    AI_RATE_LIMITER: { limit: async () => ({ success: false }) },
  });
  assert.equal(limited.status, 429);
});

test("gateway enforces actual body size even without trusting content-length", async () => {
  const response = await handleRequest(new Request("https://worker.example/chat", {
    method: "POST",
    headers: { origin: "https://coderlambert.github.io", "content-type": "application/json" },
    body: "x".repeat(160_001),
  }), { ALLOWED_ORIGIN: "https://coderlambert.github.io" });
  assert.equal(response.status, 413);
  assert.match(await response.text(), /request body too large/);
});

test("gateway hides upstream body and streams normalized response", async () => {
  const req = new Request("https://worker.example/chat", {
    method: "POST",
    headers: { origin: "https://coderlambert.github.io", "content-type": "application/json" },
    body: JSON.stringify(requestBody()),
  });
  const env = { ALLOWED_ORIGIN: "https://coderlambert.github.io", DEEPSEEK_API_KEY: "test-key", DEEPSEEK_MODEL: "deepseek-v4-flash" };
  const response = await handleRequest(req, env, {
    fetchImpl: async (_url, init) => {
      assert.match(init.headers.Authorization, /^Bearer /);
      const body = JSON.parse(init.body);
      assert.equal(body.stream, true);
      assert.equal(body.max_tokens, 2048);
      return new Response(sse([
        'data: {"choices":[{"delta":{"content":"回答"},"finish_reason":null}]}',
        'data: {"choices":[{"delta":{},"finish_reason":"stop"}],"usage":{"total_tokens":7}}',
        "data: [DONE]",
      ]), { status: 200, headers: { "content-type": "text/event-stream" } });
    },
  });
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /application\/x-ndjson/);
  const events = await readLines(response.body);
  assert.equal(events[1].text, "回答");
});

test("gateway normalizes upstream failure without leaking response body", async () => {
  const req = new Request("https://worker.example/chat", {
    method: "POST",
    headers: { origin: "https://coderlambert.github.io", "content-type": "application/json" },
    body: JSON.stringify(requestBody()),
  });
  const response = await handleRequest(req, { ALLOWED_ORIGIN: "https://coderlambert.github.io", DEEPSEEK_API_KEY: "test-key" }, {
    fetchImpl: async () => new Response("provider-secret-error-detail", { status: 429 }),
  });
  assert.equal(response.status, 502);
  assert.doesNotMatch(await response.text(), /provider-secret-error-detail/);
});
