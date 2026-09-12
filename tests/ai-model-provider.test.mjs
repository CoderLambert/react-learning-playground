import assert from "node:assert/strict";
import test from "node:test";

import {
  MODEL_FINISH_REASONS,
  MODEL_TURN_EVENT_TYPES,
  normalizeModelTurnRequest,
} from "../src/ai/providers/modelClient.js";
import {
  createDeepSeekChatCompletionsAdapter,
  parseDeepSeekModelStream,
} from "../src/ai/providers/deepseek/DeepSeekChatCompletionsAdapter.js";

function streamFromChunks(chunks) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(encoder.encode(chunk));
      controller.close();
    },
  });
}

test("model turn contract accepts assistant tool calls and tool continuation messages", () => {
  const request = normalizeModelTurnRequest({
    messages: [
      { role: "system", content: "Tutor" },
      { role: "user", content: "Create questions" },
      {
        role: "assistant",
        content: "",
        toolCalls: [{ id: "call_1", name: "assessment_create_questions", arguments: { count: 2 } }],
      },
      { role: "tool", toolCallId: "call_1", content: "{\"created\":2}" },
    ],
    tools: [{
      name: "assessment_create_questions",
      description: "Create assessment questions",
      inputSchema: {
        type: "object",
        properties: { count: { type: "integer" } },
        required: ["count"],
      },
    }],
  });

  assert.equal(request.messages[2].toolCalls[0].name, "assessment_create_questions");
  assert.equal(request.messages[3].role, "tool");
  assert.equal(request.messages[3].toolCallId, "call_1");
  assert.equal(request.tools[0].inputSchema.type, "object");
});

test("DeepSeek stream assembles split tool call arguments before emitting TOOL_CALL", async () => {
  const stream = streamFromChunks([
    'data: {"choices":[{"delta":{"tool_calls":[{"index":0,"id":"call_1","type":"function","function":{"name":"assessment_create_questions","arguments":"{\\"count\\":"}}]},"finish_reason":null}]}\n\n',
    'data: {"choices":[{"delta":{"tool_calls":[{"index":0,"function":{"arguments":"2}"}}]},"finish_reason":"tool_calls"}],"usage":{"prompt_tokens":10,"completion_tokens":5,"total_tokens":15}}\n\n',
    'data: [DONE]\n\n',
  ]);

  const events = [];
  for await (const event of parseDeepSeekModelStream(stream)) events.push(event);

  assert.deepEqual(events.map((event) => event.type), [
    MODEL_TURN_EVENT_TYPES.TURN_START,
    MODEL_TURN_EVENT_TYPES.TOOL_CALL,
    MODEL_TURN_EVENT_TYPES.TURN_COMPLETE,
  ]);
  assert.deepEqual(events[1].toolCall, {
    id: "call_1",
    name: "assessment_create_questions",
    arguments: { count: 2 },
  });
  assert.equal(events[2].finishReason, MODEL_FINISH_REASONS.TOOL_CALLS);
  assert.equal(events[2].usage.total_tokens, 15);
});

test("DeepSeek adapter maps provider-neutral tools and continuation messages to Chat Completions", async () => {
  const requests = [];
  const adapter = createDeepSeekChatCompletionsAdapter({
    apiKey: "sk-test",
    model: "deepseek-chat",
    fetchImpl: async (url, init) => {
      requests.push({ url, init });
      return new Response(streamFromChunks([
        'data: {"choices":[{"delta":{"content":"done"},"finish_reason":"stop"}]}\n\n',
        'data: [DONE]\n\n',
      ]), { status: 200 });
    },
  });

  const events = [];
  for await (const event of adapter.streamTurn({
    messages: [
      { role: "user", content: "Create questions" },
      {
        role: "assistant",
        content: "",
        toolCalls: [{ id: "call_1", name: "assessment_create_questions", arguments: { count: 2 } }],
      },
      { role: "tool", toolCallId: "call_1", content: "{\"created\":2}" },
    ],
    tools: [{
      name: "assessment_create_questions",
      description: "Create questions",
      inputSchema: { type: "object", properties: { count: { type: "integer" } } },
    }],
  })) events.push(event);

  assert.equal(requests.length, 1);
  const body = JSON.parse(requests[0].init.body);
  assert.equal(body.tools[0].function.name, "assessment_create_questions");
  assert.deepEqual(body.messages[1].tool_calls[0], {
    id: "call_1",
    type: "function",
    function: {
      name: "assessment_create_questions",
      arguments: "{\"count\":2}",
    },
  });
  assert.deepEqual(body.messages[2], {
    role: "tool",
    tool_call_id: "call_1",
    content: "{\"created\":2}",
  });
  assert.deepEqual(events.map((event) => event.type), [
    MODEL_TURN_EVENT_TYPES.TURN_START,
    MODEL_TURN_EVENT_TYPES.TEXT_DELTA,
    MODEL_TURN_EVENT_TYPES.TURN_COMPLETE,
  ]);
  assert.equal(events[1].text, "done");
});
