import assert from "node:assert/strict";
import test from "node:test";

import { ToolExecutor } from "../src/ai/agent/ToolExecutor.js";
import { ToolPolicy } from "../src/ai/agent/ToolPolicy.js";
import { ToolRegistry } from "../src/ai/agent/ToolRegistry.js";
import { createToolExecutionContext } from "../src/ai/agent/agentContracts.js";
import {
  ASSESSMENT_AUTHORING_INSTRUCTIONS,
  assertAssessmentAuthoringQuality,
  findAssessmentAuthoringQualityIssues,
} from "../src/assessment/ai/assessmentAuthoringQuality.js";
import {
  ASSESSMENT_TOOL_NAMES,
  createAssessmentToolDefinitions,
} from "../src/assessment/ai/assessmentTools.js";

function draft(prompt, overrides = {}) {
  const { content: contentOverrides = {}, ...questionOverrides } = overrides;
  return {
    type: "single_choice",
    content: {
      prompt,
      options: [
        { id: "a", text: "返回当前 count" },
        { id: "b", text: "返回 count + 1" },
      ],
      correctOptionId: "a",
      explanation: "函数直接返回收到的 count。",
      ...contentOverrides,
    },
    difficulty: "medium",
    conceptTags: ["pure-render"],
    evidenceRefs: [{
      kind: "source",
      fileName: "ComponentJsxPureRenderDemo.jsx",
      startLine: 14,
      endLine: 23,
    }],
    ...questionOverrides,
  };
}

function executionContext() {
  return createToolExecutionContext({
    learningUnitId: "component-jsx-pure-render",
    conversationId: "conversation-1",
    agentRunId: "run-1",
    contextSnapshotId: "snapshot-1",
    mutationId: "run-1:runtime",
    actor: { type: "ai_agent" },
  });
}

test("authoring quality rejects learner-facing source line navigation", () => {
  const prompts = [
    "根据第 170–176 行的说明，哪项结论正确？",
    "根据 170–176 行判断下面哪项成立？",
    "查看 ComponentJsxPureRenderDemo.jsxL170–L176 后选择答案。",
    "Read lines 170-176 and choose the correct answer.",
    "参考 [源码](source://ComponentJsxPureRenderDemo.jsx#L170-L176) 作答。",
    "结合 L170-L176 判断输出。",
  ];

  for (const prompt of prompts) {
    const issues = findAssessmentAuthoringQualityIssues(draft(prompt));
    assert.equal(issues[0]?.code, "SOURCE_NAVIGATION_IN_LEARNER_TEXT", prompt);
    assert.throws(
      () => assertAssessmentAuthoringQuality(draft(prompt)),
      /inline the complete code or prose needed to answer/,
      prompt,
    );
  }
});

test("authoring quality rejects implicit external-source dependency without inline evidence", () => {
  const prompts = [
    "根据当前源码判断 renderCount 的返回值。",
    "查看上述代码，哪项说法正确？",
    "ComponentJsxPureRenderDemo.jsx 中的 renderCount 返回什么？",
  ];

  for (const prompt of prompts) {
    const issues = findAssessmentAuthoringQualityIssues(draft(prompt));
    assert.equal(issues[0]?.code, "SOURCE_CONTEXT_NOT_INLINED", prompt);
  }
});

test("authoring quality accepts self-contained inline code while keeping evidenceRefs", () => {
  const question = draft([
    "ComponentJsxPureRenderDemo.jsx 中有下面这个完整函数：",
    "```jsx",
    "function renderCount(count) {",
    "  return count;",
    "}",
    "```",
    "当传入 count = 2 时，函数返回什么？",
  ].join("\n"));

  assert.deepEqual(findAssessmentAuthoringQualityIssues(question), []);
  assert.strictEqual(assertAssessmentAuthoringQuality(question), question);
  assert.equal(question.evidenceRefs[0].startLine, 14);
  assert.equal(question.evidenceRefs[0].endLine, 23);
});

test("line-like text inside an inline code block is not mistaken for learner navigation", () => {
  const question = draft([
    "下面代码中的字符串值是什么？",
    "```js",
    "const label = 'line 170';",
    "```",
  ].join("\n"));
  assert.deepEqual(findAssessmentAuthoringQualityIssues(question), []);
});

test("authoring quality also rejects source navigation hidden in choice text", () => {
  const question = draft("下面哪项对返回值的描述正确？", {
    content: {
      options: [
        { id: "a", text: "与 L14-L23 一致" },
        { id: "b", text: "始终返回 undefined" },
      ],
    },
  });
  assert.equal(findAssessmentAuthoringQualityIssues(question)[0]?.field, "content.options[0].text");
});

test("create/update command tools reject non-self-contained learner text before persistence", async () => {
  const calls = [];
  const service = {
    async listQuestions() { return []; },
    async createQuestions(input) { calls.push(["create", input]); return { result: input.questions, replayed: false }; },
    async updateQuestion(input) { calls.push(["update", input]); return { result: input.patch, replayed: false }; },
    async retireQuestion() { return { result: null, replayed: false }; },
  };
  const registry = new ToolRegistry();
  for (const definition of createAssessmentToolDefinitions({ assessmentService: service })) registry.register(definition);
  const executor = new ToolExecutor({ registry, policy: new ToolPolicy() });

  const createResult = await executor.execute({
    id: "create-bad",
    name: ASSESSMENT_TOOL_NAMES.CREATE_QUESTIONS,
    arguments: { questions: [draft("根据第 170–176 行判断结果。")] },
  }, executionContext());
  assert.equal(createResult.ok, false);
  assert.equal(createResult.error.code, "TOOL_ARGUMENTS_INVALID");

  const updateResult = await executor.execute({
    id: "update-bad",
    name: ASSESSMENT_TOOL_NAMES.UPDATE_QUESTION,
    arguments: {
      questionId: "q-1",
      expectedRevision: 1,
      patch: { content: { prompt: "查看 Component.jsx:L10-L20 后回答。" } },
    },
  }, executionContext());
  assert.equal(updateResult.ok, false);
  assert.equal(updateResult.error.code, "TOOL_ARGUMENTS_INVALID");
  assert.equal(calls.length, 0);
});

test("model-visible authoring policy requires inline evidence and post-write readback", () => {
  assert.match(ASSESSMENT_AUTHORING_INSTRUCTIONS, /题干必须自包含/);
  assert.match(ASSESSMENT_AUTHORING_INSTRUCTIONS, /必须把最小但完整的相关代码直接内联到 prompt/);
  assert.match(ASSESSMENT_AUTHORING_INSTRUCTIONS, /写入后必须再次调用 assessment_list_questions 回读完整题目/);
  assert.match(ASSESSMENT_AUTHORING_INSTRUCTIONS, /revision\/replayed 只能证明命令结果/);
});
