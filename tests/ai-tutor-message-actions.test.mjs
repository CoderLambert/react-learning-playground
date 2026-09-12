import assert from "node:assert/strict";
import test from "node:test";

import {
  ASSISTANT_FOLLOW_UP_ACTIONS,
  buildAssistantFollowUpPrompt,
  buildCitationExplainPrompt,
  buildCodeExplainPrompt,
  copyText,
  shouldOfferContinue,
} from "../src/components/ai-assistant/message-actions/aiTutorMessageActions.js";

test("exposes a compact set of high-value tutor follow-up actions", () => {
  assert.deepEqual(
    ASSISTANT_FOLLOW_UP_ACTIONS.map((action) => action.id),
    ["simplify", "counterexample", "quiz", "source"],
  );
});

test("builds explicit learning prompts without copying prior answer content", () => {
  const simplify = buildAssistantFollowUpPrompt("simplify");
  const quiz = buildAssistantFollowUpPrompt("quiz");
  const source = buildAssistantFollowUpPrompt("source");

  assert.match(simplify, /更简单/);
  assert.match(quiz, /只出一道/);
  assert.match(source, /当前学习单元/);
  assert.equal(simplify.includes("previous answer"), false);
});

test("builds bounded code explanation prompts with source metadata", () => {
  const prompt = buildCodeExplainPrompt({
    code: "const next = count + 1;",
    language: "js",
    label: "Counter.jsx",
  });

  assert.match(prompt, /当前学习单元/);
  assert.match(prompt, /Counter\.jsx/);
  assert.match(prompt, /```js/);
  assert.match(prompt, /const next = count \+ 1;/);
  assert.throws(() => buildCodeExplainPrompt({ code: "   " }), /empty code block/);
});

test("builds citation explanation prompts from canonical line ranges", () => {
  assert.match(
    buildCitationExplainPrompt({ fileName: "Counter.jsx", startLine: 10, endLine: 14 }),
    /\[Counter\.jsx:L10-L14\]/,
  );
  assert.match(
    buildCitationExplainPrompt({ fileName: "Counter.jsx", startLine: 7, endLine: 7 }),
    /\[Counter\.jsx:L7\]/,
  );
  assert.throws(
    () => buildCitationExplainPrompt({ fileName: "Counter.jsx", startLine: 8, endLine: 3 }),
    /Invalid source citation/,
  );
});

test("rejects unsupported follow-up actions instead of silently sending a wrong prompt", () => {
  assert.throws(() => buildAssistantFollowUpPrompt("unknown"), /Unsupported AI tutor follow-up action/);
});

test("offers continue only for interrupted or truncated answers", () => {
  assert.equal(shouldOfferContinue("length"), true);
  assert.equal(shouldOfferContinue("output_limit"), true);
  assert.equal(shouldOfferContinue("user_abort"), true);
  assert.equal(shouldOfferContinue("error"), true);
  assert.equal(shouldOfferContinue(null), false);
  assert.equal(shouldOfferContinue("stop"), false);
});

test("copies the original markdown text through the clipboard API", async () => {
  let copied = null;
  const markdown = "## 结论\n\n```js\nreturn nextState\n```\n\n[Demo.jsx:L10-L12]";
  const navigatorImpl = {
    clipboard: {
      async writeText(value) {
        copied = value;
      },
    },
  };

  assert.equal(await copyText(markdown, { navigatorImpl }), true);
  assert.equal(copied, markdown);
});

test("reports unsupported copy environments", async () => {
  await assert.rejects(
    () => copyText("content", { navigatorImpl: {}, documentImpl: {} }),
    /不支持复制到剪贴板/,
  );
});
