import assert from "node:assert/strict";
import test from "node:test";

import {
  ConversationRepository,
  MemoryConversationStore,
  StreamingMessagePersister,
  deriveConversationTitle,
  sanitizePersistedMetadata,
  stableSnapshotHash,
} from "../src/ai/conversations/index.js";

function createClock() {
  let tick = 0;
  return () => new Date(Date.UTC(2026, 8, 11, 0, 0, tick++));
}

function createCrypto() {
  let value = 0;
  return { randomUUID: () => `id-${++value}` };
}

function setup() {
  const store = new MemoryConversationStore();
  const repository = new ConversationRepository(store, { clock: createClock(), cryptoImpl: createCrypto() });
  return { store, repository };
}

test("conversation CRUD is ordered by recent activity and derives a local first-message title", async () => {
  const { repository } = setup();
  const first = await repository.createConversation({ learningUnitId: "jsx", model: "deepseek-chat" });
  const second = await repository.createConversation({ title: "second" });
  await repository.appendMessage({ conversationId: first.id, role: "user", content: "为什么 render 不是改 DOM？" });

  const conversations = await repository.listConversations();
  assert.equal(conversations[0].id, first.id);
  assert.equal(conversations[0].title, "为什么 render 不是改 DOM？");
  assert.equal((await repository.getConversation(second.id)).title, "second");

  await repository.renameConversation(second.id, "renamed");
  assert.equal((await repository.getConversation(second.id)).title, "renamed");
});

test("messages keep stable ordering and final streaming state", async () => {
  const { repository } = setup();
  const conversation = await repository.createConversation();
  const user = await repository.appendMessage({ conversationId: conversation.id, role: "user", content: "Q" });
  const assistant = await repository.appendMessage({ conversationId: conversation.id, role: "assistant", status: "streaming" });
  await repository.updateMessage(assistant.id, { content: "partial" });
  await repository.finalizeMessage(assistant.id, { content: "final", usage: { inputTokens: 10, outputTokens: 2 } });

  const messages = await repository.listMessages(conversation.id);
  assert.deepEqual(messages.map((message) => message.id), [user.id, assistant.id]);
  assert.equal(messages[1].content, "final");
  assert.equal(messages[1].status, "complete");
  assert.deepEqual(messages[1].usage, { inputTokens: 10, outputTokens: 2 });
});

test("context snapshots are sanitized and deduplicated by stable hash", async () => {
  const { repository } = setup();
  const context = {
    note: { name: "render.mdx", content: "note" },
    source: { name: "Demo.jsx", code: "const x = 1" },
    apiKey: "must-not-persist",
    nested: { authorization: "Bearer secret", safe: true },
  };
  const one = await repository.saveContextSnapshot({ learningUnitId: "render", context });
  const two = await repository.saveContextSnapshot({ learningUnitId: "render", context: { ...context } });

  assert.equal(one.id, two.id);
  assert.equal(one.context.apiKey, undefined);
  assert.deepEqual(one.context.nested, { safe: true });
  assert.equal(stableSnapshotHash({ a: 1, b: 2 }), stableSnapshotHash({ b: 2, a: 1 }));
});

test("archive hides a conversation by default and delete cascades messages and compactions", async () => {
  const { repository } = setup();
  const conversation = await repository.createConversation();
  await repository.appendMessage({ conversationId: conversation.id, role: "user", content: "Q" });
  await repository.saveCompaction({ conversationId: conversation.id, summary: { goal: "learn" }, coveredThroughMessageId: "m1" });

  await repository.archiveConversation(conversation.id);
  assert.equal((await repository.listConversations()).length, 0);
  assert.equal((await repository.listConversations({ includeArchived: true })).length, 1);

  await repository.deleteConversation(conversation.id);
  assert.equal((await repository.listMessages(conversation.id)).length, 0);
  assert.equal((await repository.listCompactions(conversation.id)).length, 0);
});

test("recoverInterruptedMessages marks abandoned streaming records without dropping content", async () => {
  const { repository } = setup();
  const conversation = await repository.createConversation();
  const message = await repository.appendMessage({
    conversationId: conversation.id,
    role: "assistant",
    content: "partial answer",
    status: "streaming",
  });

  const recovered = await repository.recoverInterruptedMessages();
  assert.equal(recovered.length, 1);
  assert.equal(recovered[0].id, message.id);
  assert.equal(recovered[0].status, "interrupted");
  assert.equal(recovered[0].content, "partial answer");
});

test("streaming persister coalesces token updates and performs a final durable write", async () => {
  const { repository } = setup();
  const conversation = await repository.createConversation();
  const message = await repository.appendMessage({ conversationId: conversation.id, role: "assistant", status: "streaming" });
  let scheduled;
  const persister = new StreamingMessagePersister(repository, message.id, {
    intervalMs: 500,
    setTimeoutImpl: (callback) => {
      scheduled = callback;
      return 1;
    },
    clearTimeoutImpl: () => {},
  });

  persister.schedule({ content: "a" });
  persister.schedule({ content: "ab" });
  assert.equal((await repository.listMessages(conversation.id))[0].content, "");

  await scheduled();
  assert.equal((await repository.listMessages(conversation.id))[0].content, "ab");

  persister.schedule({ content: "abc" });
  await persister.finalize({ content: "final", status: "complete" });
  const persisted = (await repository.listMessages(conversation.id))[0];
  assert.equal(persisted.content, "final");
  assert.equal(persisted.status, "complete");
});

test("secret-shaped metadata fields are discarded and message API has no API-key field", async () => {
  assert.deepEqual(
    sanitizePersistedMetadata({ safe: 1, apiKey: "x", access_token: "y", nested: { secret: "z", value: 2 } }),
    { safe: 1, nested: { value: 2 } },
  );

  const { repository } = setup();
  const conversation = await repository.createConversation({ metadata: { apiKey: "x", provider: "deepseek" } });
  const message = await repository.appendMessage({
    conversationId: conversation.id,
    role: "user",
    content: "hello",
    metadata: { authorization: "Bearer x", source: "composer" },
    apiKey: "ignored-by-contract",
  });
  assert.deepEqual((await repository.getConversation(conversation.id)).metadata, { provider: "deepseek" });
  assert.deepEqual(message.metadata, { source: "composer" });
  assert.equal(Object.hasOwn(message, "apiKey"), false);
});

test("title derivation is deterministic, whitespace-normalized, and bounded", () => {
  assert.equal(deriveConversationTitle("  hello   world  "), "hello world");
  const title = deriveConversationTitle("x".repeat(80), 12);
  assert.equal(title.length, 12);
  assert.equal(title.endsWith("…"), true);
});
