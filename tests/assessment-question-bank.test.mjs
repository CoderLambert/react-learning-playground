import assert from "node:assert/strict";
import test from "node:test";

import { CHECKPOINTS, getAllBuiltinItems } from "../src/assessment/questions/checkpoints.js";
import {
  QUESTION_BANK_STORAGE_KEY,
  createQuestionBankRepository,
  getQuestionFingerprint,
} from "../src/assessment/questions/questionBankRepository.js";

function createMemoryStorage(seed = {}) {
  const data = new Map(Object.entries(seed));
  return {
    getItem(key) { return data.has(key) ? data.get(key) : null; },
    setItem(key, value) { data.set(key, String(value)); },
    removeItem(key) { data.delete(key); },
  };
}

test("builtin checkpoint contract keeps 12 chapters, 65 questions and 36 exercises", () => {
  assert.equal(Object.keys(CHECKPOINTS).length, 12);
  const items = getAllBuiltinItems();
  assert.equal(items.filter((item) => item.kind === "question").length, 65);
  assert.equal(items.filter((item) => item.kind === "exercise").length, 36);
});

test("builtin item ids are stable-shaped and unique", () => {
  const items = getAllBuiltinItems();
  const ids = items.map((item) => item.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(CHECKPOINTS[1].questions[0].id, "ch01-q01");
  assert.equal(CHECKPOINTS[12].exercises[2].id, "ch12-e03");
  assert.ok(items.every((item) => item.origin === "builtin"));
});

test("builtin checkpoint data is immutable", () => {
  assert.equal(Object.isFrozen(CHECKPOINTS), true);
  assert.equal(Object.isFrozen(CHECKPOINTS[1]), true);
  assert.equal(Object.isFrozen(CHECKPOINTS[1].questions), true);
  assert.equal(Object.isFrozen(CHECKPOINTS[1].questions[0]), true);
});

test("repository resolves prompt override without mutating builtin", () => {
  const storage = createMemoryStorage();
  const repository = createQuestionBankRepository(storage);
  const original = CHECKPOINTS[3].questions[0].prompt;

  repository.setBuiltinPrompt("ch03-q01", "我自己的 State 判断题");
  const resolved = repository.resolveChapter(3);

  assert.equal(resolved.questions[0].prompt, "我自己的 State 判断题");
  assert.equal(resolved.questions[0].customized, true);
  assert.equal(CHECKPOINTS[3].questions[0].prompt, original);
});

test("repository hides and restores builtin questions", () => {
  const repository = createQuestionBankRepository(createMemoryStorage());
  repository.setBuiltinHidden("ch02-q02", true);
  assert.equal(repository.resolveChapter(2).questions[1].hidden, true);

  repository.restoreBuiltin("ch02-q02");
  const restored = repository.resolveChapter(2).questions[1];
  assert.equal(restored.hidden, false);
  assert.equal(restored.customized, false);
});

test("custom questions survive repository reload and can be updated/deleted", () => {
  const storage = createMemoryStorage();
  const repository = createQuestionBankRepository(storage);
  const created = repository.addCustom({ chapter: 4, kind: "question", prompt: "为什么 cleanup 必须对称？" });

  const reloaded = createQuestionBankRepository(storage);
  assert.ok(reloaded.resolveChapter(4).questions.some((item) => item.id === created.id));

  reloaded.updateCustom(created.id, { prompt: "cleanup 为什么必须与 setup 对称？" });
  assert.equal(reloaded.resolveChapter(4).questions.find((item) => item.id === created.id).prompt, "cleanup 为什么必须与 setup 对称？");

  reloaded.deleteCustom(created.id);
  assert.equal(reloaded.resolveChapter(4).questions.some((item) => item.id === created.id), false);
});

test("duplicate creates a user-owned copy and custom items can be reordered", () => {
  const repository = createQuestionBankRepository(createMemoryStorage());
  const duplicate = repository.duplicate(CHECKPOINTS[3].questions[0]);
  const second = repository.addCustom({ chapter: 3, kind: "question", prompt: "第二个自定义问题" });

  let custom = repository.resolveChapter(3).questions.filter((item) => item.origin === "user");
  assert.equal(custom[0].id, duplicate.id);
  assert.equal(custom[0].prompt, CHECKPOINTS[3].questions[0].prompt);
  assert.equal(custom[1].id, second.id);

  repository.moveCustom(second.id, "up");
  custom = repository.resolveChapter(3).questions.filter((item) => item.origin === "user");
  assert.equal(custom[0].id, second.id);
  assert.equal(custom[1].id, duplicate.id);
});

test("corrupted or future-version storage fails safe to builtin content", () => {
  const corrupted = createQuestionBankRepository(createMemoryStorage({ [QUESTION_BANK_STORAGE_KEY]: "not-json" }));
  assert.equal(corrupted.resolveChapter(1).questions.length, 5);

  const future = createQuestionBankRepository(createMemoryStorage({
    [QUESTION_BANK_STORAGE_KEY]: JSON.stringify({ version: 99, overrides: { "ch01-q01": { hidden: true } }, customQuestions: [] }),
  }));
  assert.equal(future.resolveChapter(1).questions[0].hidden, false);
});

test("resolved fingerprint is deterministic and changes with effective prompt", () => {
  const repository = createQuestionBankRepository(createMemoryStorage());
  const before = repository.resolveChapter(5).questions[0].revision;
  assert.equal(before, getQuestionFingerprint(repository.resolveChapter(5).questions[0]));

  repository.setBuiltinPrompt("ch05-q01", "修改后的表单状态问题");
  const after = repository.resolveChapter(5).questions[0].revision;
  assert.notEqual(before, after);
});
