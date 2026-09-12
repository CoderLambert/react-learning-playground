import assert from "node:assert/strict";
import test from "node:test";

import {
  ModelClientAbortError,
  ModelClientError,
  MODEL_FINISH_REASONS,
  MODEL_TURN_EVENT_TYPES,
} from "../src/ai/providers/modelClient.js";
import { createAiChatClient } from "../src/ai/chatClient.js";
import { createDeepSeekDirectClient } from "../src/ai/deepseekDirectClient.js";

function streamFromChunks(chunks) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(encoder.encode(chunk));
      controller.close();
    },
  });
}

async function collect(iterable) {
  const events = [];
  for await (const event of iterable) events.push(event);
  return events;
}

const MODEL_REQUEST = {
  messages: [{ role: "user", content: "find the answer" }],
  tools: [{
    name: "lookup",
    description: "Look something up",
    inputSchema: {
      type: "object",
      properties: { query: { type: "string" } },
      required: ["query"],
    },
  }],
};

test("Direct ModelClient exposes plain text and multiple split tool calls", async () => {
  let captured;
  const firstToolStart = {
    choices: [{
      delta: {
        tool_calls: [{
          index: 0,
          id: "call-1",
          type: "function",
          function: { name: "lookup", arguments: '{"query":"first' },
        }],
      },
      finish_reason: null,
    }],
  };
  const secondToolPart = {
    choices: [{
      delta: {
        tool_calls: [
          { index: 0, function: { arguments: '"}' } },
          {
            index: 1,
            id: "call-2",
            type: "function",
            function: { name: "lookup", arguments: '{"query":"second"}' },
          },
        ],
      },
      finish_reason: "tool_calls",
    }],
    usage: { total_tokens: 8 },
  };
  const client = createDeepSeekDirectClient({
    apiKey: "sk-test",
    model: "deepseek-v4-flash",
    fetchImpl: async (_url, init) => {
      captured = JSON.parse(init.body);
      return new Response(streamFromChunks([
        'data: {"choices":[{"delta":{"content":"working"},"finish_reason":null}]}\n\n',
        "data: " + JSON.stringify(firstToolStart) + "\n\n",
        "data: " + JSON.stringify(secondToolPart) + "\n\n",
        "data: [DONE]\n\n",
      ]), { status: 200 });
    },
  });

  const events = await collect(client.streamTurn(MODEL_REQUEST));
  assert.equal(captured.stream, true);
  assert.equal(captured.tools[0].function.name, "lookup");
  assert.deepEqual(events.map((event) => event.type), [
    MODEL_TURN_EVENT_TYPES.TURN_START,
    MODEL_TURN_EVENT_TYPES.TEXT_DELTA,
    MODEL_TURN_EVENT_TYPES.TOOL_CALL,
    MODEL_TURN_EVENT_TYPES.TOOL_CALL,
    MODEL_TURN_EVENT_TYPES.TURN_COMPLETE,
  ]);
  assert.deepEqual(events.slice(2, 4).map((event) => event.toolCall), [
    { id: "call-1", name: "lookup", arguments: { query: "first" } },
    { id: "call-2", name: "lookup", arguments: { query: "second" } },
  ]);
  assert.equal(events.at(-1).finishReason, MODEL_FINISH_REASONS.TOOL_CALLS);
});

test("Gateway ModelClient sends assistant/tool continuation messages and parses normalized events", async () => {
  let captured;
  const client = createAiChatClient({
    endpoint: "https://gateway.example/chat",
    fetchImpl: async (_url, init) => {
      captured = JSON.parse(init.body);
      return new Response(streamFromChunks([
        '{"type":"turn_start"}\n',
        '{"type":"text_delta","text":"done"}\n',
        '{"type":"turn_complete","finishReason":"stop","usage":{"totalTokens":4}}\n',
      ]), { status: 200 });
    },
  });

  const events = await collect(client.streamTurn({
    messages: [
      { role: "user", content: "find the answer" },
      {
        role: "assistant",
        content: "",
        toolCalls: [{ id: "call-1", name: "lookup", arguments: { query: "first" } }],
      },
      { role: "tool", toolCallId: "call-1", content: "{\"answer\":\"42\"}" },
    ],
    tools: MODEL_REQUEST.tools,
  }));

  assert.equal(captured.type, "model_turn");
  assert.equal(captured.messages[1].toolCalls[0].id, "call-1");
  assert.equal(captured.messages[2].toolCallId, "call-1");
  assert.equal(captured.tools[0].name, "lookup");
  assert.deepEqual(events.map((event) => event.type), [
    MODEL_TURN_EVENT_TYPES.TURN_START,
    MODEL_TURN_EVENT_TYPES.TEXT_DELTA,
    MODEL_TURN_EVENT_TYPES.TURN_COMPLETE,
  ]);
  assert.equal(events.at(-1).usage.totalTokens, 4);
});

test("compaction ModelClient explicitly disables tools and omits toolChoice", async () => {
  let captured;
  const client = createAiChatClient({
    endpoint: "https://gateway.example/chat",
    fetchImpl: async (_url, init) => {
      captured = JSON.parse(init.body);
      return new Response('{"type":"turn_complete","finishReason":"stop"}\n', { status: 200 });
    },
  });

  await collect(client.streamTurn({
    purpose: "compaction",
    messages: [{ role: "user", content: "summarize" }],
    tools: [],
  }));
  assert.deepEqual(captured.tools, []);
  assert.equal(Object.hasOwn(captured, "toolChoice"), false);
});

test("Direct and Gateway ModelClients normalize provider errors and aborts", async () => {
  const direct = createDeepSeekDirectClient({
    apiKey: "sk-test",
    fetchImpl: async () => new Response(streamFromChunks([
      'data: {"error":{"message":"provider unavailable","code":"UPSTREAM_DOWN"}}\n\n',
    ]), { status: 200 }),
  });
  await assert.rejects(
    () => collect(direct.streamTurn({ messages: [{ role: "user", content: "hello" }] })),
    (error) => error instanceof ModelClientError && error.code === "UPSTREAM_DOWN",
  );

  const gateway = createAiChatClient({
    endpoint: "https://gateway.example/chat",
    fetchImpl: async () => new Response('{"type":"error","code":"UPSTREAM_STREAM_ERROR","message":"upstream stream failed"}\n', { status: 200 }),
  });
  await assert.rejects(
    () => collect(gateway.streamTurn({ messages: [{ role: "user", content: "hello" }] })),
    (error) => error instanceof ModelClientError && error.code === "UPSTREAM_STREAM_ERROR",
  );

  const controller = new AbortController();
  const pending = createDeepSeekDirectClient({
    apiKey: "sk-test",
    fetchImpl: async (_url, init) => new Promise((_resolve, reject) => {
      init.signal.addEventListener("abort", () => {
        const error = new Error("aborted");
        error.name = "AbortError";
        reject(error);
      }, { once: true });
    }),
  });
  const request = collect(pending.streamTurn({
    messages: [{ role: "user", content: "hello" }],
  }, { signal: controller.signal }));
  controller.abort();
  await assert.rejects(request, (error) => error instanceof ModelClientAbortError);
});
