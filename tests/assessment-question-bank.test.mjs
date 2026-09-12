import test from "node:test";
import assert from "node:assert/strict";

import {
  createBuiltinQuestion,
  createCustomQuestion,
  createQuestionBankRepository,
  migratePositionalOverrides,
  resolveQuestionBank,
  structureCheckpoint,
} from "../src/assessment/questionBank.js";

function memoryStorage(seed = {}) {
  const map = new Map(Object.entries(seed));
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => map.set(key, value),
    removeItem: (key) => map.delete(key),
  };
}

const checkpoint = {
  questions: ["Render 为什么要纯净？", "key 为什么要稳定？"],
  exercises: ["实现一个稳定 key 的列表。"],
};

test("builtin semantic ids are independent from array position", () => {
  const first = structureCheckpoint(1, checkpoint);
  const reordered = structureCheckpoint(1, {
    ...checkpoint,
    questions: [...checkpoint.questions].reverse(),
  });

  for (const item of first) {
    assert.ok(reordered.some((candidate) => candidate.id === item.id));
  }
});

test("builtin questions are immutable and revision follows original fingerprint", () => {
  const item = createBuiltinQuestion({ chapter: 2, kind: "question", text: "  State snapshot  " });
  assert.equal(Object.isFrozen(item), true);
  assert.equal(item.text, "State snapshot");
  assert.equal(item.revision, item.fingerprint);
});

test("resolver applies builtin overrides without mutating builtin source", () => {
  const builtin = structureCheckpoint(1, checkpoint)[0];
  const state = {
    version: 1,
    overrides: { [builtin.id]: { text: "新的教学问题", hidden: true } },
    custom: {},
    order: {},
  };
  const [resolved] = resolveQuestionBank({ chapter: 1, checkpoint, state });

  assert.equal(resolved.text, "新的教学问题");
  assert.equal(resolved.originalText, "Render 为什么要纯净？");
  assert.equal(resolved.hidden, true);
  assert.equal(structureCheckpoint(1, checkpoint)[0].text, "Render 为什么要纯净？");
});

test("repository supports persistence, overrides, custom CRUD and corruption fallback", () => {
  const storage = memoryStorage();
  const repository = createQuestionBankRepository({ storage, key: "test" });
  const builtin = structureCheckpoint(1, checkpoint)[0];
  const custom = createCustomQuestion({ id: "custom:q1", chapter: 1, text: "自定义问题" });

  assert.equal(repository.setOverride(builtin.id, { hidden: true }).ok, true);
  assert.equal(repository.upsertCustom(custom).ok, true);
  let state = repository.load();
  assert.equal(state.overrides[builtin.id].hidden, true);
  assert.equal(state.custom[custom.id].text, "自定义问题");

  assert.equal(repository.deleteCustom(custom.id).ok, true);
  assert.equal(repository.load().custom[custom.id], undefined);

  storage.setItem("test", "not-json");
  state = repository.load();
  assert.deepEqual(state, { version: 1, overrides: {}, custom: {}, order: {} });
});

test("ordering persists independently for questions and exercises", () => {
  const storage = memoryStorage();
  const repository = createQuestionBankRepository({ storage, key: "order" });
  const custom = createCustomQuestion({ id: "custom:first", chapter: 1, text: "自定义问题" });
  repository.upsertCustom(custom);
  const builtinIds = structureCheckpoint(1, checkpoint)
    .filter((item) => item.kind === "question")
    .map((item) => item.id);
  repository.setOrder(1, "question", [custom.id, ...builtinIds]);

  const resolved = resolveQuestionBank({ chapter: 1, checkpoint, state: repository.load() });
  assert.equal(resolved.filter((item) => item.kind === "question")[0].id, custom.id);
});

test("legacy positional overrides migrate to stable builtin ids", () => {
  const migrated = migratePositionalOverrides({
    chapter: 1,
    checkpoint,
    legacy: {
      "question:1": { hidden: true },
      "exercise:0": { text: "迁移后的练习" },
      nonsense: { hidden: true },
    },
  });
  const structured = structureCheckpoint(1, checkpoint);
  const secondQuestion = structured.filter((item) => item.kind === "question")[1];
  const firstExercise = structured.filter((item) => item.kind === "exercise")[0];

  assert.deepEqual(migrated[secondQuestion.id], { hidden: true });
  assert.deepEqual(migrated[firstExercise.id], { text: "迁移后的练习" });
  assert.equal(Object.keys(migrated).length, 2);
});

test("version mismatch falls back instead of loading incompatible data", () => {
  const storage = memoryStorage({ test: JSON.stringify({ version: 99, overrides: { bad: true } }) });
  const repository = createQuestionBankRepository({ storage, key: "test" });
  assert.deepEqual(repository.load(), { version: 1, overrides: {}, custom: {}, order: {} });
});
