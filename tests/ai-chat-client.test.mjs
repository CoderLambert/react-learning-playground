import assert from "node:assert/strict";
import test from "node:test";

import {
  AiChatAbortError,
  CHAT_STATUS,
  ChatStreamParser,
  INITIAL_CHAT_STATE,
  buildChatRequest,
  chatReducer,
  createAiChatClient,
} from "../src/ai/index.js";

function reduce(actions) {
  return actions.reduce(chatReducer, { ...INITIAL_CHAT_STATE, messages: [] });
}

test("chatReducer accumulates one streaming assistant response without corrupting history", () => {
  const state = reduce([
    { type: "request", requestId: "r1", question: "为什么会重新渲染？" },
    { type: "start", requestId: "r1" },
    { type: "delta", requestId: "r1", text: "因为 state " },
    { type: "delta", requestId: "r1", text: "发生了变化。" },
    { type: "done", requestId: "r1", finishReason: "length", usage: { outputTokens: 8 } },
  ]);

  assert.equal(state.status, CHAT_STATUS.IDLE);
  assert.equal(state.activeRequestId, null);
  assert.equal(state.messages.length, 2);
  assert.equal(state.messages[0].role, "user");
  assert.equal(state.messages[1].content, "因为 state 发生了变化。");
  assert.equal(state.messages[1].streaming, false);
  assert.equal(state.messages[1].finishReason, "length");
  assert.deepEqual(state.messages[1].usage, { outputTokens: 8 });
});

test("chatReducer preserves previous content on error, supports cancel and reset", () => {
  const errored = reduce([
    { type: "request", requestId: "r1", question: "Q" },
    { type: "delta", requestId: "r1", text: "partial" },
    { type: "error", requestId: "r1", message: "upstream failed" },
  ]);
  assert.equal(errored.status, CHAT_STATUS.ERROR);
  assert.equal(errored.error, "upstream failed");
  assert.equal(errored.messages[1].content, "partial");
  assert.equal(errored.messages[1].finishReason, "error");

  const cancelled = [
    { type: "request", requestId: "r2", question: "Q2" },
    { type: "start", requestId: "r2" },
    { type: "cancel", requestId: "r2" },
  ].reduce(chatReducer, { ...INITIAL_CHAT_STATE, messages: [] });
  assert.equal(cancelled.status, CHAT_STATUS.CANCELLED);
  assert.equal(cancelled.messages[1].finishReason, "user_abort");

  assert.deepEqual(chatReducer(errored, { type: "reset" }), {
    ...INITIAL_CHAT_STATE,
    messages: [],
  });
});

test("ChatStreamParser handles arbitrary chunk boundaries and NDJSON/SSE data lines", () => {
  const parser = new ChatStreamParser();
  const events = [
    ...parser.push('{"type":"start","requestId":"r1"}\n{"type":"del'),
    ...parser.push('ta","text":"你"}\ndata: {"type":"delta","text":"好"}\n'),
    ...parser.push('{"type":"done","finishReason":"max_tokens"}'),
    ...parser.finish(),
  ];

  assert.deepEqual(events, [
    { type: "start", requestId: "r1" },
    { type: "delta", text: "你" },
    { type: "delta", text: "好" },
    { type: "done", finishReason: "length" },
  ]);
});

test("ChatStreamParser supplies a normalized stop reason when a gateway omits it", () => {
  const parser = new ChatStreamParser();
  assert.deepEqual(parser.push('{"type":"done"}\n'), [
    { type: "done", finishReason: "stop" },
  ]);
});

test("ChatStreamParser rejects malformed or provider-specific payloads", () => {
  const malformed = new ChatStreamParser();
  assert.throws(() => malformed.push("not-json\n"), /invalid AI stream event JSON/);

  const unsupported = new ChatStreamParser();
  assert.throws(
    () => unsupported.push('{"choices":[{"delta":{"content":"x"}}]}\n'),
    /unsupported chat event type/,
  );
});

test("buildChatRequest trims question/history and applies deterministic guards", () => {
  const history = Array.from({ length: 25 }, (_, index) => ({
    role: index % 2 === 0 ? "user" : "assistant",
    content: `m${index}`,
  }));
  const request = buildChatRequest({
    question: "  explain this  ",
    context: { learningUnit: { id: "props" } },
    history,
  });

  assert.equal(request.question, "explain this");
  assert.equal(request.history.length, 12);
  assert.equal(request.history[0].content, "m13");
  assert.equal(request.client.historyTrimmed, true);
  assert.throws(
    () => buildChatRequest({ question: "x".repeat(4_001), context: {} }),
    /question exceeds/,
  );
  assert.throws(
    () => buildChatRequest({ question: "x", context: { text: "x".repeat(180_001) } }),
    /context exceeds/,
  );
});

test("createAiChatClient posts provider-neutral request and emits normalized stream events", async () => {
  const encoder = new TextEncoder();
  const chunks = [
    '{"type":"start","requestId":"r1"}\n{"type":"delta","text":"hello"}\n',
    '{"type":"done"}\n',
  ];
  let capturedRequest;
  const fetchImpl = async (_url, options) => {
    capturedRequest = options;
    return new Response(new ReadableStream({
      start(controller) {
        for (const chunk of chunks) controller.enqueue(encoder.encode(chunk));
        controller.close();
      },
    }), { status: 200, headers: { "content-type": "application/x-ndjson" } });
  };

  const seen = [];
  const client = createAiChatClient({ endpoint: "https://assistant.example/chat", fetchImpl });
  const result = await client.stream(
    { question: "why", context: { learningUnit: { id: "props" } }, history: [] },
    { onEvent: (event) => seen.push(event) },
  );

  assert.equal(capturedRequest.method, "POST");
  assert.match(capturedRequest.headers.accept, /application\/x-ndjson/);
  assert.equal(JSON.parse(capturedRequest.body).question, "why");
  assert.deepEqual(result, seen);
  assert.deepEqual(seen.map((event) => event.type), ["start", "delta", "done"]);
});

test("createAiChatClient normalizes gateway stream errors", async () => {
  const encoder = new TextEncoder();
  const fetchImpl = async () => new Response(new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode('{"type":"error","message":"quota","code":"RATE_LIMIT"}\n'));
      controller.close();
    },
  }), { status: 200 });

  const client = createAiChatClient({ endpoint: "https://assistant.example/chat", fetchImpl });
  await assert.rejects(
    () => client.stream({ question: "why", context: {}, history: [] }),
    (error) => error.code === "RATE_LIMIT" && error.message === "quota",
  );
});

test("createAiChatClient surfaces AbortSignal cancellation separately from request errors", async () => {
  const controller = new AbortController();
  const fetchImpl = (_url, options) => new Promise((_resolve, reject) => {
    options.signal.addEventListener("abort", () => {
      const error = new Error("aborted");
      error.name = "AbortError";
      reject(error);
    }, { once: true });
  });

  const client = createAiChatClient({ endpoint: "https://assistant.example/chat", fetchImpl });
  const pending = client.stream(
    { question: "why", context: {}, history: [] },
    { signal: controller.signal },
  );
  controller.abort();

  await assert.rejects(pending, (error) => error instanceof AiChatAbortError);
});
