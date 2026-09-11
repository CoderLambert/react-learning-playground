import assert from "node:assert/strict";
import test from "node:test";

import { buildGatewayRequest } from "../src/ai/chatClient.js";
import { buildChatRequest } from "../src/ai/contracts.js";
import { validateRequest } from "../worker/deepseek-assistant/src/validation.js";
import { buildMessages } from "../worker/deepseek-assistant/src/prompt.js";

const CONTEXT = {
  learningUnit: { id: "props", title: "Props", category: "components" },
  note: { name: "props.mdx", content: "Props note" },
  sources: [{ name: "PropsDemo.jsx", code: "1 | export function PropsDemo() {}" }],
  activeSourceFile: "PropsDemo.jsx",
};

const COMPACTION_PREFIX = "请将下面对话压缩为结构化 JSON，只输出 JSON，不要 Markdown。";

test("ordinary chat question still rejects more than 4000 characters", () => {
  assert.throws(
    () => buildChatRequest({ question: "x".repeat(4_001), context: CONTEXT }),
    /question exceeds 4000 characters/,
  );
});

test("long compaction material uses a dedicated payload instead of question", () => {
  const prompt = `${COMPACTION_PREFIX}\n对话: ${JSON.stringify([
    { role: "assistant", content: "中".repeat(6_000) },
  ])}`;
  assert.ok(prompt.length > 4_000);

  const outbound = buildGatewayRequest({ question: prompt, context: CONTEXT, history: [] });
  assert.equal(outbound.purpose, "compaction");
  assert.equal(Object.hasOwn(outbound, "question"), false);
  assert.equal(Object.hasOwn(outbound, "history"), false);
  assert.equal(outbound.compaction.prompt, prompt);

  const validated = validateRequest(outbound);
  assert.equal(validated.purpose, "compaction");
  assert.equal(validated.compaction.prompt, prompt);
  assert.equal(validated.history.length, 0);
});

test("worker builds compaction messages without replaying chat history", () => {
  const prompt = `${COMPACTION_PREFIX}\n对话: ${JSON.stringify([
    { role: "assistant", content: "x".repeat(6_000) },
  ])}`;
  const request = validateRequest(buildGatewayRequest({ question: prompt, context: CONTEXT }));
  const messages = buildMessages(request);

  assert.equal(messages.length, 2);
  assert.equal(messages[0].role, "system");
  assert.match(messages[0].content, /内部对话压缩/);
  assert.equal(messages[1].role, "user");
  assert.match(messages[1].content, /<compaction-request>/);
  assert.match(messages[1].content, /6000|xxxxxxxx/);
  assert.equal(messages.some((message) => message.role === "assistant"), false);
});

test("compaction payload has its own explicit upper bound", () => {
  const prompt = `${COMPACTION_PREFIX}\n${"x".repeat(120_001)}`;
  assert.throws(
    () => buildGatewayRequest({ question: prompt, context: CONTEXT }),
    /compaction prompt exceeds 120000 characters/,
  );
});
