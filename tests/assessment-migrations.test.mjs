import assert from "node:assert/strict";
import test from "node:test";

import {
  ASSESSMENT_DB_NAME,
  ASSESSMENT_DB_VERSION,
  ASSESSMENT_STORES,
  migrateAssessmentDb,
} from "../src/assessment/infrastructure/indexedDb/assessmentMigrations.js";

function createFakeStore(name, options) {
  const indexes = new Map();
  return {
    name,
    keyPath: options?.keyPath,
    indexes,
    indexNames: {
      contains(indexName) {
        return indexes.has(indexName);
      },
    },
    createIndex(indexName, keyPath, indexOptions) {
      indexes.set(indexName, { keyPath, options: indexOptions ?? null });
      return indexes.get(indexName);
    },
  };
}

function createFakeDb() {
  const stores = new Map();
  return {
    stores,
    objectStoreNames: {
      contains(name) {
        return stores.has(name);
      },
    },
    createObjectStore(name, options) {
      const store = createFakeStore(name, options);
      stores.set(name, store);
      return store;
    },
  };
}

test("assessment database identity is stable", () => {
  assert.equal(ASSESSMENT_DB_NAME, "react-learning-assessment");
  assert.equal(ASSESSMENT_DB_VERSION, 1);
  assert.deepEqual(Object.values(ASSESSMENT_STORES), [
    "questions",
    "sessions",
    "attempts",
    "mutationReceipts",
  ]);
});

test("v1 migration creates all assessment stores and query indexes", () => {
  const db = createFakeDb();

  migrateAssessmentDb({ db, oldVersion: 0 });

  assert.deepEqual([...db.stores.keys()], [
    ASSESSMENT_STORES.QUESTIONS,
    ASSESSMENT_STORES.SESSIONS,
    ASSESSMENT_STORES.ATTEMPTS,
    ASSESSMENT_STORES.MUTATION_RECEIPTS,
  ]);

  const questions = db.stores.get(ASSESSMENT_STORES.QUESTIONS);
  assert.equal(questions.keyPath, "id");
  assert.deepEqual(questions.indexes.get("learningUnitStatus")?.keyPath, ["learningUnitId", "status"]);

  const sessions = db.stores.get(ASSESSMENT_STORES.SESSIONS);
  assert.equal(sessions.keyPath, "id");
  assert.deepEqual(sessions.indexes.get("learningUnitStatus")?.keyPath, ["learningUnitId", "status"]);

  const attempts = db.stores.get(ASSESSMENT_STORES.ATTEMPTS);
  assert.equal(attempts.keyPath, "id");
  assert.deepEqual(attempts.indexes.get("sessionQuestion")?.keyPath, ["sessionId", "questionId"]);

  const receipts = db.stores.get(ASSESSMENT_STORES.MUTATION_RECEIPTS);
  assert.equal(receipts.keyPath, "mutationId");
  assert.equal(receipts.indexes.get("toolName")?.keyPath, "toolName");
});

test("migration is a no-op when database is already at v1", () => {
  const db = createFakeDb();
  migrateAssessmentDb({ db, oldVersion: 0 });
  const originalStores = [...db.stores.entries()];

  migrateAssessmentDb({ db, oldVersion: 1 });

  assert.deepEqual([...db.stores.entries()], originalStores);
});

test("migration rejects invalid inputs", () => {
  assert.throws(() => migrateAssessmentDb(), /db is required/);
  assert.throws(() => migrateAssessmentDb({ db: createFakeDb(), oldVersion: -1 }), /oldVersion/);
});
