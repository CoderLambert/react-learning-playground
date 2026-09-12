import assert from "node:assert/strict";
import test from "node:test";

import {
  createConversationExportDocument,
  createConversationFilename,
  createConversationSearchDocument,
  createLearningUnitBundle,
  searchConversationDocuments,
  serializeConversationAsJson,
  serializeConversationAsMarkdown,
  serializeConversationAsReadableText,
} from "../src/ai/conversations/conversationWorkspace.js";

const conversation = {
  id: "conv-1",
  title: "useReducer 学习",
  learningUnitId: "state-reducer",
  model: "deepseek-chat",
  archived: false,
  createdAt: "2026-09-12T10:00:00.000Z",
  updatedAt: "2026-09-12T10:02:00.000Z",
  lastMessageAt: "2026-09-12T10:02:00.000Z",
  metadata: { source: "learning" },
};

const messages = [
  {
    id: "m1",
    role: "user",
    content: "为什么 reducer 要保持纯函数？",
    status: "complete",
    createdAt: "2026-09-12T10:01:00.000Z",
  },
  {
    id: "m2",
    role: "assistant",
    content: "因为 reducer 负责根据旧状态和 action 计算新状态。\n\n```js\nreturn nextState\n```",
    status: "complete",
    createdAt: "2026-09-12T10:02:00.000Z",
    metadata: { citation: "StateReducerDemo.jsx:L42-L57", apiKey: "sk-do-not-export-123456789" },
  },
];

test("builds a stable sanitized export document", () => {
  const result = createConversationExportDocument({
    conversation,
    messages,
    learningUnitLabel: "State + Reducer",
    exportedAt: "2026-09-12T12:00:00.000Z",
  });

  assert.equal(result.exportVersion, 1);
  assert.equal(result.learningUnit.id, "state-reducer");
  assert.equal(result.messages.length, 2);
  assert.equal(result.messages[1].metadata.apiKey, "[REDACTED]");
  assert.equal(JSON.stringify(result).includes("sk-do-not-export"), false);
});

test("redacts bearer tokens and secret-looking keys from JSON export", () => {
  const unsafeMessages = [{
    role: "user",
    content: "Authorization: Bearer abc.def.ghi and sk-abcdefghijklmnop",
    metadata: { authorization: "Bearer should-not-leak", accessToken: "token-value" },
  }];
  const output = serializeConversationAsJson({ conversation, messages: unsafeMessages });

  assert.equal(output.includes("abc.def.ghi"), false);
  assert.equal(output.includes("abcdefghijklmnop"), false);
  assert.equal(output.includes("token-value"), false);
  assert.match(output, /\[REDACTED\]/);
});

test("serializes readable markdown without losing markdown code blocks", () => {
  const output = serializeConversationAsMarkdown({
    conversation,
    messages,
    learningUnitLabel: "State + Reducer",
    exportedAt: "2026-09-12T12:00:00.000Z",
  });

  assert.match(output, /^# useReducer 学习 · State \+ Reducer/m);
  assert.match(output, /## User/);
  assert.match(output, /## AI/);
  assert.match(output, /```js\nreturn nextState\n```/);
});

test("serializes a compact readable text form for clipboard copy", () => {
  const output = serializeConversationAsReadableText({ conversation, messages });
  assert.match(output, /useReducer 学习/);
  assert.match(output, /User:\n为什么 reducer/);
  assert.match(output, /AI:\n因为 reducer/);
});

test("creates filesystem-safe readable filenames", () => {
  const filename = createConversationFilename({
    conversation: { title: "useReducer: state / action?" },
    extension: "MD",
    date: new Date("2026-09-12T12:00:00.000Z"),
  });
  assert.equal(filename, "useReducer-state-action-2026-09-12.md");
});

test("searches message content and returns the matching message snippet", () => {
  const document = createConversationSearchDocument({
    conversation,
    messages,
    learningUnitLabel: "State + Reducer",
  });
  const [result] = searchConversationDocuments([document], "纯函数");

  assert.equal(result.conversation.id, "conv-1");
  assert.equal(result.matchKind, "message");
  assert.equal(result.matchedRole, "user");
  assert.match(result.snippet, /纯函数/);
});

test("searches titles and learning unit labels case-insensitively", () => {
  const document = createConversationSearchDocument({ conversation, messages, learningUnitLabel: "State + Reducer" });
  assert.equal(searchConversationDocuments([document], "USEREDUCER")[0].matchKind, "title");
  assert.equal(searchConversationDocuments([document], "reducer")[0].conversation.id, "conv-1");
});

test("returns no results for blank or unmatched search", () => {
  const document = createConversationSearchDocument({ conversation, messages });
  assert.deepEqual(searchConversationDocuments([document], ""), []);
  assert.deepEqual(searchConversationDocuments([document], "不存在的关键词"), []);
});

test("creates a single learning-unit bundle without leaking other units", () => {
  const other = { ...conversation, id: "conv-2", learningUnitId: "effects", title: "Effects" };
  const bundle = createLearningUnitBundle({
    conversations: [conversation, other],
    messagesByConversation: new Map([
      ["conv-1", messages],
      ["conv-2", [{ role: "user", content: "secret other unit" }]],
    ]),
    learningUnitId: "state-reducer",
    learningUnitLabel: "State + Reducer",
    exportedAt: "2026-09-12T12:00:00.000Z",
  });

  assert.equal(bundle.conversations.length, 1);
  assert.equal(bundle.conversations[0].conversation.id, "conv-1");
  assert.equal(JSON.stringify(bundle).includes("secret other unit"), false);
});
