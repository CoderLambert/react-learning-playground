import assert from "node:assert/strict";
import test from "node:test";

import {
  buildConversationExportFilename,
  buildConversationJson,
  buildConversationMarkdown,
  copyConversationMarkdown,
  exportConversationJson,
  exportConversationMarkdown,
} from "../src/ai/conversations/exportConversation.js";

const fixedDate = new Date("2026-09-13T08:00:00.000Z");

const sample = {
  messages: [
    { role: "user", content: "为什么 Context 会更新？" },
    {
      role: "assistant",
      content: "因为 Provider value 变化后，订阅该 Context 的消费者会重新读取。\n\n```jsx\nuseContext(C)\n```",
      metadata: { finishReason: "stop" },
    },
  ],
  providerLabel: "DeepSeek",
  modelLabel: "deepseek-v4-flash",
  contextSummary: {
    note: "context-propagation.mdx",
    activeSourceFile: "ContextPropagationDemo.jsx",
    sources: [{ name: "ContextPropagationDemo.jsx" }],
  },
  exportedAt: fixedDate,
};

function createDownloadEnvironment() {
  const clicks = [];
  const blobs = [];
  const documentImpl = {
    body: {
      appendChild(node) {
        clicks.push(["append", node]);
      },
    },
    createElement(tag) {
      assert.equal(tag, "a");
      return {
        style: {},
        click() { clicks.push(["click", this.download]); },
        remove() { clicks.push(["remove", this.download]); },
      };
    },
  };
  const URLImpl = {
    createObjectURL(blob) {
      blobs.push(blob);
      return "blob:test";
    },
    revokeObjectURL(url) {
      assert.equal(url, "blob:test");
    },
  };
  return { clicks, blobs, documentImpl, URLImpl };
}

test("conversation markdown preserves complete user and assistant content", () => {
  const markdown = buildConversationMarkdown(sample);

  assert.match(markdown, /^# AI 学习会话/m);
  assert.match(markdown, /## 你\n\n为什么 Context 会更新？/);
  assert.match(markdown, /## AI 学习助手/);
  assert.match(markdown, /```jsx\nuseContext\(C\)\n```/);
  assert.match(markdown, /Provider：DeepSeek/);
  assert.match(markdown, /源码：ContextPropagationDemo\.jsx/);
});

test("conversation json is structured, complete, and records finish reason", () => {
  const payload = JSON.parse(buildConversationJson(sample));

  assert.equal(payload.schemaVersion, 1);
  assert.equal(payload.exportedAt, fixedDate.toISOString());
  assert.equal(payload.provider, "DeepSeek");
  assert.equal(payload.model, "deepseek-v4-flash");
  assert.equal(payload.context.activeSourceFile, "ContextPropagationDemo.jsx");
  assert.deepEqual(payload.context.sources, ["ContextPropagationDemo.jsx"]);
  assert.equal(payload.messages.length, 2);
  assert.equal(payload.messages[1].finishReason, "stop");
  assert.match(payload.messages[1].content, /useContext\(C\)/);
});

test("export filename is portable and supports markdown and json extensions", () => {
  assert.equal(
    buildConversationExportFilename({
      prefix: "Context 更新/传播",
      exportedAt: new Date("2026-09-13T08:01:02.003Z"),
    }),
    "Context-更新-传播-2026-09-13T08-01-02-003Z.md",
  );
  assert.equal(
    buildConversationExportFilename({
      prefix: "Context 更新/传播",
      exportedAt: new Date("2026-09-13T08:01:02.003Z"),
      extension: "json",
    }),
    "Context-更新-传播-2026-09-13T08-01-02-003Z.json",
  );
});

test("markdown and json export helpers download exactly one file each", () => {
  for (const [exporter, extension] of [
    [exportConversationMarkdown, ".md"],
    [exportConversationJson, ".json"],
  ]) {
    const environment = createDownloadEnvironment();
    const result = exporter({
      ...sample,
      documentImpl: environment.documentImpl,
      URLImpl: environment.URLImpl,
      BlobImpl: Blob,
    });

    assert.equal(result.fileName.endsWith(extension), true);
    assert.equal(environment.blobs.length, 1);
    assert.equal(environment.clicks.some(([type]) => type === "click"), true);
  }
});

test("copy conversation writes the complete markdown to clipboard", async () => {
  const writes = [];
  const markdown = await copyConversationMarkdown({
    ...sample,
    clipboard: {
      async writeText(value) {
        writes.push(value);
      },
    },
  });

  assert.equal(writes.length, 1);
  assert.equal(writes[0], markdown);
  assert.match(markdown, /为什么 Context 会更新？/);
  assert.match(markdown, /AI 学习助手/);
});
