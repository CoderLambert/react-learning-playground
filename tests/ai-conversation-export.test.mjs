import assert from "node:assert/strict";
import test from "node:test";

import {
  buildConversationExportFilename,
  buildConversationMarkdown,
  exportConversationMarkdown,
} from "../src/ai/conversations/exportConversation.js";

test("conversation markdown preserves complete user and assistant content", () => {
  const markdown = buildConversationMarkdown({
    messages: [
      { role: "user", content: "为什么 Context 会更新？" },
      { role: "assistant", content: "因为 Provider value 变化后，订阅该 Context 的消费者会重新读取。\n\n```jsx\nuseContext(C)\n```" },
    ],
    providerLabel: "DeepSeek",
    modelLabel: "deepseek-v4-flash",
    contextSummary: {
      note: "context-propagation.mdx",
      sources: [{ name: "ContextPropagationDemo.jsx" }],
    },
    exportedAt: new Date("2026-09-13T08:00:00.000Z"),
  });

  assert.match(markdown, /^# AI 学习会话/m);
  assert.match(markdown, /## 你\n\n为什么 Context 会更新？/);
  assert.match(markdown, /## AI 学习助手/);
  assert.match(markdown, /```jsx\nuseContext\(C\)\n```/);
  assert.match(markdown, /Provider：DeepSeek/);
  assert.match(markdown, /源码：ContextPropagationDemo\.jsx/);
});

test("export filename is portable and timestamped", () => {
  assert.equal(
    buildConversationExportFilename({
      prefix: "Context 更新/传播",
      exportedAt: new Date("2026-09-13T08:01:02.003Z"),
    }),
    "Context-更新-传播-2026-09-13T08-01-02-003Z.md",
  );
});

test("export helper downloads exactly the markdown it builds", () => {
  const clicks = [];
  const body = {
    appendChild(node) {
      clicks.push(["append", node]);
    },
  };
  const documentImpl = {
    body,
    createElement(tag) {
      assert.equal(tag, "a");
      return {
        style: {},
        click() { clicks.push(["click", this.download]); },
        remove() { clicks.push(["remove", this.download]); },
      };
    },
  };
  const urls = [];
  const URLImpl = {
    createObjectURL(blob) {
      urls.push(blob);
      return "blob:test";
    },
    revokeObjectURL(url) {
      assert.equal(url, "blob:test");
    },
  };

  const result = exportConversationMarkdown({
    messages: [{ role: "user", content: "hello" }],
    exportedAt: new Date("2026-09-13T08:00:00.000Z"),
    documentImpl,
    URLImpl,
    BlobImpl: Blob,
  });

  assert.match(result.markdown, /## 你\n\nhello/);
  assert.equal(result.fileName, "ai-learning-conversation-2026-09-13T08-00-00-000Z.md");
  assert.equal(urls.length, 1);
  assert.equal(clicks.some(([type]) => type === "click"), true);
});
