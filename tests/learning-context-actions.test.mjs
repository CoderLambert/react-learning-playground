import assert from "node:assert/strict";
import test from "node:test";

import {
  buildLearningActionPrompt,
  createLearningActionDetail,
} from "../src/learning-actions/learningActions.js";

test("note action keeps selected text bounded and identifiable", () => {
  const prompt = buildLearningActionPrompt({
    kind: "note",
    action: "explain",
    learningUnitId: "state-render",
    learningUnitTitle: "State 与渲染",
    text: "  State   是组件的记忆。  ",
  });

  assert.match(prompt, /解释这段笔记/);
  assert.match(prompt, /学习单元：State 与渲染/);
  assert.match(prompt, /选中内容：/);
  assert.match(prompt, /State 是组件的记忆。/);
});

test("source action preserves file and line range without copying arbitrary source", () => {
  const prompt = buildLearningActionPrompt({
    kind: "source",
    action: "rationale",
    learningUnitId: "reducer",
    fileName: "TaskReducerDemo.jsx",
    startLine: 42,
    endLine: 57,
    symbol: "Reducer · taskReducer",
  });

  assert.match(prompt, /为什么这样写/);
  assert.match(prompt, /TaskReducerDemo\.jsx L42–L57/);
  assert.match(prompt, /Reducer · taskReducer/);
  assert.match(prompt, /不要臆造未提供的实现/);
});

test("demo quiz action asks for a question without leaking an answer", () => {
  const prompt = buildLearningActionPrompt({
    kind: "demo",
    action: "quiz",
    learningUnitId: "effect-cleanup",
  });

  assert.match(prompt, /不要立即给答案/);
  assert.match(prompt, /当前可交互 Demo/);
});

test("unsupported action fails early", () => {
  assert.throws(
    () => buildLearningActionPrompt({ kind: "note", action: "unknown" }),
    /Unsupported learning action/,
  );
});

test("action detail carries prompt and creation metadata", () => {
  const detail = createLearningActionDetail({
    kind: "demo",
    action: "explain",
    learningUnitId: "props",
  });

  assert.equal(detail.kind, "demo");
  assert.equal(detail.action, "explain");
  assert.equal(typeof detail.prompt, "string");
  assert.equal(typeof detail.createdAt, "number");
  assert.equal(Object.isFrozen(detail), true);
});
