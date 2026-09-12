import assert from "node:assert/strict";
import test from "node:test";

import {
  copyTextToClipboard,
  formatMessageForClipboard,
} from "../src/components/ai-assistant/message-actions/messageClipboard.js";

test("formatMessageForClipboard keeps markdown and makes source citations readable", () => {
  const input = [
    "## 结论",
    "",
    "看 `state` 更新。",
    "",
    "source://StateDemo.jsx#L12-L18",
    "source://hooks/useThing.js#L7",
  ].join("\n");

  assert.equal(
    formatMessageForClipboard(input),
    [
      "## 结论",
      "",
      "看 `state` 更新。",
      "",
      "StateDemo.jsx:L12-L18",
      "hooks/useThing.js:L7",
    ].join("\n"),
  );
});

test("formatMessageForClipboard handles non-string values", () => {
  assert.equal(formatMessageForClipboard(null), "");
});

test("copyTextToClipboard delegates to Clipboard API", async () => {
  let copied = null;
  await copyTextToClipboard("hello", {
    async writeText(value) {
      copied = value;
    },
  });
  assert.equal(copied, "hello");
});

test("copyTextToClipboard rejects missing content and unsupported clipboard", async () => {
  await assert.rejects(() => copyTextToClipboard("", { writeText() {} }), /没有可复制/);
  await assert.rejects(() => copyTextToClipboard("hello", null), /不支持剪贴板/);
});
