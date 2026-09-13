import assert from "node:assert/strict";
import test from "node:test";
import {
  createCustomQuestion,
  resolveQuestionBank,
  structureCheckpoint,
} from "../src/assessment/questionBank.js";
import {
  createAttempt,
  createQuestionRevision,
  reconcileAttemptQuestions,
  updateAnswer,
} from "../src/assessment/practiceAttempt.js";

const checkpoint = {
  questions: [{ id: "state-snapshot", text: "为什么 state 是 snapshot？" }],
  exercises: [{ id: "batching-lab", text: "验证 batching。" }],
};

function asRunnerQuestion(resolved) {
  return {
    id: resolved.id,
    revision: resolved.revision,
    kind: resolved.kind,
    prompt: resolved.text,
    source: resolved.source,
    chapter: resolved.chapter,
  };
}

test("resolved question semantic id is stable while revision follows effective text", () => {
  const builtin = structureCheckpoint(2, checkpoint)[0];
  const before = resolveQuestionBank({ chapter: 2, checkpoint, state: { version: 1, overrides: {}, custom: {}, order: {} } })[0];
  const after = resolveQuestionBank({
    chapter: 2,
    checkpoint,
    state: { version: 1, overrides: { [builtin.id]: { text: "为什么 state 是 render snapshot？" } }, custom: {}, order: {} },
  })[0];

  assert.equal(before.id, after.id);
  assert.notEqual(before.revision, after.revision);
  assert.equal(createQuestionRevision(asRunnerQuestion(after)), after.revision);
});

test("attempt reconciliation preserves same revision answers and resets changed revisions", () => {
  const before = resolveQuestionBank({ chapter: 2, checkpoint, state: { version: 1, overrides: {}, custom: {}, order: {} } })
    .map(asRunnerQuestion);
  let attempt = createAttempt({ chapter: 2, questions: before, sessionId: "integration-contract", now: 0 });
  attempt = updateAnswer(attempt, before[0], { draft: "旧回答", confidence: 4 }, 1);

  const unchanged = reconcileAttemptQuestions(attempt, before, 2);
  assert.equal(unchanged.answers[before[0].id].draft, "旧回答");

  const builtinId = before[0].id;
  const revised = resolveQuestionBank({
    chapter: 2,
    checkpoint,
    state: { version: 1, overrides: { [builtinId]: { text: "新版题干" } }, custom: {}, order: {} },
  }).map(asRunnerQuestion);
  const reconciled = reconcileAttemptQuestions(attempt, revised, 3);
  assert.equal(reconciled.answers[builtinId].draft, "");
});

test("hidden/custom/order resolver output is suitable as runner source of truth", () => {
  const builtins = structureCheckpoint(2, checkpoint);
  const custom = createCustomQuestion({ id: "custom:integration", chapter: 2, kind: "question", text: "自定义题" });
  const state = {
    version: 1,
    overrides: { [builtins[0].id]: { hidden: true } },
    custom: { [custom.id]: custom },
    order: { "2:question": [custom.id, builtins[0].id] },
  };
  const resolved = resolveQuestionBank({ chapter: 2, checkpoint, state });
  const runnable = resolved.filter((item) => !item.hidden).map(asRunnerQuestion);

  assert.equal(runnable.some((item) => item.id === builtins[0].id), false);
  assert.equal(runnable[0].id, custom.id);
  assert.equal(runnable[0].prompt, "自定义题");
});