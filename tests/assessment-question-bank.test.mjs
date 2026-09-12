import test from "node:test";
import assert from "node:assert/strict";

import {
  createBuiltinQuestion,
  createCustomQuestion,
  createQuestionBankRepository,
  migrateBuiltinIdentity,
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

const semanticCheckpoint = {
  questions: [
    { id: "render-purity", text: "Render 为什么要纯净？" },
    { id: "stable-key", text: "key 为什么要稳定？" },
  ],
  exercises: [
    { id: "stable-key-list", text: "实现一个稳定 key 的列表。" },
  ],
};

test("legacy builtin ids remain independent from array position", () => {
  const first = structureCheckpoint(1, checkpoint);
  const reordered = structureCheckpoint(1, {
    ...checkpoint,
    questions: [...checkpoint.questions].reverse(),
  });

  for (const item of first) {
    assert.ok(reordered.some((candidate) => candidate.id === item.id));
  }
});

test("explicit semantic ids survive wording changes and reordering", () => {
  const first = structureCheckpoint(1, semanticCheckpoint);
  const changed = structureCheckpoint(1, {
    questions: [
      { id: "stable-key", text: "为什么列表 key 必须长期稳定？" },
      { id: "render-purity", text: "为什么 Render 必须保持纯净？" },
    ],
    exercises: semanticCheckpoint.exercises,
  });

  assert.equal(
    first.find((item) => item.semanticId === "render-purity").id,
    changed.find((item) => item.semanticId === "render-purity").id,
  );
  assert.equal(
    first.find((item) => item.semanticId === "stable-key").id,
    changed.find((item) => item.semanticId === "stable-key").id,
  );
});

test("builtin questions are immutable and revision follows original fingerprint", () => {
  const item = createBuiltinQuestion({ chapter: 2, kind: "question", text: "  State snapshot  " });
  assert.equal(Object.isFrozen(item), true);
  assert.equal(item.text, "State snapshot");
  assert.equal(item.revision, item.fingerprint);
});

test("resolver applies builtin overrides without mutating builtin identity", () => {
  const builtin = structureCheckpoint(1, semanticCheckpoint)[0];
  const state = {
    version: 1,
    overrides: { [builtin.id]: { text: "新的教学问题", hidden: true } },
    custom: {},
    order: {},
  };
  const [resolved] = resolveQuestionBank({ chapter: 1, checkpoint: semanticCheckpoint, state });

  assert.equal(resolved.id, builtin.id);
  assert.equal(resolved.text, "新的教学问题");
  assert.equal(resolved.originalText, "Render 为什么要纯净？");
  assert.equal(resolved.hidden, true);
  assert.notEqual(resolved.revision, builtin.revision);
  assert.equal(structureCheckpoint(1, semanticCheckpoint)[0].text, "Render 为什么要纯净？");
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

test("fresh repository instance restores overrides, custom questions and ordering", () => {
  const storage = memoryStorage();
  const firstRepository = createQuestionBankRepository({ storage, key: "reload" });
  const builtin = structureCheckpoint(1, semanticCheckpoint)[0];
  const custom = createCustomQuestion({ id: "custom:reload", chapter: 1, text: "刷新后仍存在" });

  firstRepository.setOverride(builtin.id, { text: "覆盖后的题目", hidden: true });
  firstRepository.upsertCustom(custom);
  firstRepository.setOrder(1, "question", [custom.id, builtin.id]);

  const restoredRepository = createQuestionBankRepository({ storage, key: "reload" });
  const restored = restoredRepository.load();
  assert.deepEqual(restored.overrides[builtin.id], { text: "覆盖后的题目", hidden: true });
  assert.equal(restored.custom[custom.id].text, "刷新后仍存在");
  assert.deepEqual(restored.order["1:question"], [custom.id, builtin.id]);
});

test("repository reports storage write failure without pretending persistence succeeded", () => {
  const repository = createQuestionBankRepository({
    key: "denied",
    storage: {
      getItem: () => null,
      setItem: () => { throw new Error("storage denied"); },
      removeItem: () => { throw new Error("storage denied"); },
    },
  });
  const custom = createCustomQuestion({ id: "custom:denied", chapter: 1, text: "不会持久化" });

  assert.equal(repository.upsertCustom(custom).ok, false);
  assert.equal(repository.clear().ok, false);
  assert.deepEqual(repository.load(), { version: 1, overrides: {}, custom: {}, order: {} });
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

test("legacy positional overrides migrate to current builtin ids", () => {
  const migrated = migratePositionalOverrides({
    chapter: 1,
    checkpoint: semanticCheckpoint,
    legacy: {
      "question:1": { hidden: true },
      "exercise:0": { text: "迁移后的练习" },
      nonsense: { hidden: true },
    },
  });
  const structured = structureCheckpoint(1, semanticCheckpoint);
  const secondQuestion = structured.filter((item) => item.kind === "question")[1];
  const firstExercise = structured.filter((item) => item.kind === "exercise")[0];

  assert.deepEqual(migrated[secondQuestion.id], { hidden: true });
  assert.deepEqual(migrated[firstExercise.id], { text: "迁移后的练习" });
  assert.equal(Object.keys(migrated).length, 2);
});

test("unified identity migration consumes positional overrides and ordering", () => {
  const structured = structureCheckpoint(1, semanticCheckpoint);
  const secondQuestion = structured.filter((item) => item.kind === "question")[1];
  const firstExercise = structured.filter((item) => item.kind === "exercise")[0];
  const migrated = migrateBuiltinIdentity({
    chapter: 1,
    checkpoint: semanticCheckpoint,
    state: {
      version: 1,
      overrides: {
        "question:1": { hidden: true },
        "exercise:0": { text: "旧版练习覆盖" },
      },
      custom: {},
      order: {
        "1:question": ["question:1", "question:0"],
        "1:exercise": ["exercise:0"],
      },
    },
  });

  assert.deepEqual(migrated.overrides[secondQuestion.id], { hidden: true });
  assert.deepEqual(migrated.overrides[firstExercise.id], { text: "旧版练习覆盖" });
  assert.equal(migrated.overrides["question:1"], undefined);
  assert.deepEqual(
    migrated.order["1:question"],
    structured.filter((item) => item.kind === "question").map((item) => item.id).reverse(),
  );
  assert.deepEqual(migrated.order["1:exercise"], [firstExercise.id]);
});

test("legacy fingerprint identities migrate to semantic builtin ids and order", () => {
  const legacyId = structureCheckpoint(1, checkpoint)[0].id;
  const migrated = migrateBuiltinIdentity({
    chapter: 1,
    checkpoint: semanticCheckpoint,
    state: {
      version: 1,
      overrides: { [legacyId]: { hidden: true } },
      custom: {},
      order: { "1:question": [legacyId] },
    },
  });
  const semanticId = structureCheckpoint(1, semanticCheckpoint)[0].id;

  assert.deepEqual(migrated.overrides[semanticId], { hidden: true });
  assert.equal(migrated.order["1:question"][0], semanticId);
});

test("version mismatch falls back instead of loading incompatible data", () => {
  const storage = memoryStorage({ test: JSON.stringify({ version: 99, overrides: { bad: true } }) });
  const repository = createQuestionBankRepository({ storage, key: "test" });
  assert.deepEqual(repository.load(), { version: 1, overrides: {}, custom: {}, order: {} });
});
