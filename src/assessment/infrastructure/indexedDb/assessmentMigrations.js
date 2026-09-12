import { openIndexedDb } from "../../../platform/storage/indexedDb.js";

export const ASSESSMENT_DB_NAME = "react-learning-assessment";
export const ASSESSMENT_DB_VERSION = 1;

export const ASSESSMENT_STORES = Object.freeze({
  QUESTIONS: "questions",
  SESSIONS: "sessions",
  ATTEMPTS: "attempts",
  MUTATION_RECEIPTS: "mutationReceipts",
});

function createIndexIfMissing(store, name, keyPath, options) {
  if (!store.indexNames.contains(name)) {
    store.createIndex(name, keyPath, options);
  }
}

function ensureStore(db, name, options, configure) {
  const store = db.objectStoreNames.contains(name)
    ? null
    : db.createObjectStore(name, options);

  if (store) configure?.(store);
  return store;
}

export function migrateAssessmentDb({ db, oldVersion = 0 } = {}) {
  if (!db) throw new TypeError("db is required");
  if (!Number.isInteger(oldVersion) || oldVersion < 0) {
    throw new TypeError("oldVersion must be a non-negative integer");
  }

  if (oldVersion < 1) {
    ensureStore(db, ASSESSMENT_STORES.QUESTIONS, { keyPath: "id" }, (store) => {
      createIndexIfMissing(store, "learningUnitId", "learningUnitId");
      createIndexIfMissing(store, "learningUnitStatus", ["learningUnitId", "status"]);
      createIndexIfMissing(store, "updatedAt", "updatedAt");
    });

    ensureStore(db, ASSESSMENT_STORES.SESSIONS, { keyPath: "id" }, (store) => {
      createIndexIfMissing(store, "learningUnitId", "learningUnitId");
      createIndexIfMissing(store, "learningUnitStatus", ["learningUnitId", "status"]);
      createIndexIfMissing(store, "startedAt", "startedAt");
    });

    ensureStore(db, ASSESSMENT_STORES.ATTEMPTS, { keyPath: "id" }, (store) => {
      createIndexIfMissing(store, "sessionId", "sessionId");
      createIndexIfMissing(store, "questionId", "questionId");
      createIndexIfMissing(store, "sessionQuestion", ["sessionId", "questionId"]);
      createIndexIfMissing(store, "submittedAt", "submittedAt");
    });

    ensureStore(db, ASSESSMENT_STORES.MUTATION_RECEIPTS, { keyPath: "mutationId" }, (store) => {
      createIndexIfMissing(store, "toolName", "toolName");
      createIndexIfMissing(store, "createdAt", "createdAt");
    });
  }
}

export function openAssessmentDb(
  indexedDb,
  { name = ASSESSMENT_DB_NAME, version = ASSESSMENT_DB_VERSION } = {},
) {
  return openIndexedDb({
    indexedDb,
    name,
    version,
    migrate: ({ db, oldVersion }) => migrateAssessmentDb({ db, oldVersion }),
  });
}
