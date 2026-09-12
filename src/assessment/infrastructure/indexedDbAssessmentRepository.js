import { requestToPromise, transactionDone } from "../../platform/storage/indexedDb.js";
import { ASSESSMENT_DB_NAME, ASSESSMENT_DB_VERSION, ASSESSMENT_STORES, openAssessmentDb } from "./indexedDb/assessmentMigrations.js";
import {
  assertMutablePatch,
  cloneValue,
  committedResult,
  makeMutationReceipt,
  normalizeAttemptInput,
  normalizeAttemptListQuery,
  normalizeCreateCommand,
  normalizeMutationReceiptQuery,
  normalizeQuestionGetQuery,
  normalizeQuestionListQuery,
  normalizeRetireCommand,
  normalizeSessionGetQuery,
  normalizeSessionInput,
  normalizeSessionListQuery,
  normalizeUpdateCommand,
  normalizeAttemptProgressInput,
  questionNotFound,
  requiredQuestionRecord,
  replayResult,
  revisionConflict,
  sortAttempts,
  sortById,
  sortSessionsNewestFirst,
  sessionCompleted,
  sessionNotFound,
  storageUnavailable,
} from "./repositorySupport.js";

const QUESTION_STORES = [ASSESSMENT_STORES.QUESTIONS, ASSESSMENT_STORES.MUTATION_RECEIPTS];

function getObjectStore(transaction, name) {
  return transaction.objectStore(name);
}

function cloneRequestResult(value) {
  return cloneValue(value ?? null);
}

export class IndexedDbAssessmentRepository {
  constructor(db, { clock = () => new Date() } = {}) {
    if (!db || typeof db.transaction !== "function") {
      throw storageUnavailable("Assessment IndexedDB database is unavailable");
    }
    this.db = db;
    this.clock = clock;
    this.mode = "indexeddb";
  }

  async readStore(storeName, operation) {
    const transaction = this.db.transaction(storeName, "readonly");
    const done = transactionDone(transaction);
    try {
      const value = await requestToPromise(operation(getObjectStore(transaction, storeName)));
      await done;
      return value;
    } catch (error) {
      await done.catch(() => {});
      throw error;
    }
  }

  async writeStore(storeName, operation) {
    const transaction = this.db.transaction(storeName, "readwrite");
    const done = transactionDone(transaction);
    try {
      const value = await requestToPromise(operation(getObjectStore(transaction, storeName)));
      await done;
      return value;
    } catch (error) {
      transaction.abort?.();
      await done.catch(() => {});
      throw error;
    }
  }

  async listQuestions(input) {
    const query = normalizeQuestionListQuery(input);
    const questions = await this.readStore(ASSESSMENT_STORES.QUESTIONS, (store) => store.getAll());
    return questions
      .filter((question) => question.learningUnitId === query.learningUnitId)
      .filter((question) => query.status === undefined || question.status === query.status)
      .sort(sortById)
      .map(cloneValue);
  }

  async getQuestion(input) {
    const query = normalizeQuestionGetQuery(input);
    const question = await this.readStore(
      ASSESSMENT_STORES.QUESTIONS,
      (store) => store.get(query.questionId),
    );
    if (!question || question.learningUnitId !== query.learningUnitId) return null;
    return cloneRequestResult(question);
  }

  async runQuestionMutation(operation, command, execute) {
    const transaction = this.db.transaction(QUESTION_STORES, "readwrite");
    const done = transactionDone(transaction);
    try {
      const receipts = getObjectStore(transaction, ASSESSMENT_STORES.MUTATION_RECEIPTS);
      const receipt = await requestToPromise(receipts.get(command.mutationId));
      if (receipt) {
        await done;
        return replayResult(receipt);
      }

      const result = await execute(transaction);
      const nextReceipt = makeMutationReceipt({
        mutationId: command.mutationId,
        operation,
        result,
        clock: this.clock,
      });
      await requestToPromise(receipts.put(nextReceipt));
      await done;
      return committedResult(result);
    } catch (error) {
      transaction.abort?.();
      await done.catch(() => {});
      throw error;
    }
  }

  async createQuestions(input) {
    const command = normalizeCreateCommand(input);
    return this.runQuestionMutation("createQuestions", command, async (transaction) => {
      const store = getObjectStore(transaction, ASSESSMENT_STORES.QUESTIONS);
      const questions = command.questions.map((question, index) => requiredQuestionRecord(
        question,
        command.learningUnitId,
        `createQuestions.questions[${index}]`,
      ));
      const ids = new Set();
      for (const question of questions) {
        if (ids.has(question.id)) throw new Error(`Question ${question.id} already exists`);
        ids.add(question.id);
        const existing = await requestToPromise(store.get(question.id));
        if (existing) throw new Error(`Question ${question.id} already exists`);
      }
      for (const question of questions) {
        await requestToPromise(store.add(cloneValue(question)));
      }
      return questions.map(cloneValue);
    });
  }

  async updateQuestion(input) {
    const command = normalizeUpdateCommand(input);
    return this.runQuestionMutation("updateQuestion", command, async (transaction) => {
      assertMutablePatch(command.patch, "updateQuestion");
      const store = getObjectStore(transaction, ASSESSMENT_STORES.QUESTIONS);
      const current = await requestToPromise(store.get(command.questionId));
      if (!current || current.learningUnitId !== command.learningUnitId) {
        throw questionNotFound(command);
      }
      if (current.revision !== command.expectedRevision) {
        throw revisionConflict({
          ...command,
          actualRevision: current.revision,
        });
      }
      const result = {
        ...cloneValue(current),
        ...cloneValue(command.patch),
        revision: current.revision + 1,
      };
      await requestToPromise(store.put(result));
      return result;
    });
  }

  async retireQuestion(input) {
    const command = normalizeRetireCommand(input);
    return this.runQuestionMutation("retireQuestion", command, async (transaction) => {
      const store = getObjectStore(transaction, ASSESSMENT_STORES.QUESTIONS);
      const current = await requestToPromise(store.get(command.questionId));
      if (!current || current.learningUnitId !== command.learningUnitId) {
        throw questionNotFound(command);
      }
      if (current.revision !== command.expectedRevision) {
        throw revisionConflict({
          ...command,
          actualRevision: current.revision,
        });
      }
      const result = {
        ...cloneValue(current),
        status: "retired",
        revision: current.revision + 1,
        updatedAt: command.metadata.updatedAt,
        provenance: cloneValue(command.metadata.provenance),
      };
      await requestToPromise(store.put(result));
      return result;
    });
  }

  async createSession(input) {
    const session = normalizeSessionInput(input);
    await this.writeStore(
      ASSESSMENT_STORES.SESSIONS,
      (store) => store.put(cloneValue(session)),
    );
    return cloneValue(session);
  }

  async getSession(input) {
    const query = normalizeSessionGetQuery(input);
    const session = await this.readStore(
      ASSESSMENT_STORES.SESSIONS,
      (store) => store.get(query.sessionId),
    );
    if (!session || session.learningUnitId !== query.learningUnitId) return null;
    return cloneRequestResult(session);
  }

  async listSessions(input) {
    const query = normalizeSessionListQuery(input);
    const sessions = await this.readStore(ASSESSMENT_STORES.SESSIONS, (store) => store.getAll());
    return sessions
      .filter((session) => session.learningUnitId === query.learningUnitId)
      .filter((session) => query.status === undefined || session.status === query.status)
      .sort(sortSessionsNewestFirst)
      .map(cloneValue);
  }

  async saveAttempt(input) {
    const attempt = normalizeAttemptInput(input);
    await this.writeStore(
      ASSESSMENT_STORES.ATTEMPTS,
      (store) => store.put(cloneValue(attempt)),
    );
    return cloneValue(attempt);
  }

  async saveAttemptAndProgressSession(input) {
    const command = normalizeAttemptProgressInput(input);
    const transaction = this.db.transaction(
      [ASSESSMENT_STORES.SESSIONS, ASSESSMENT_STORES.ATTEMPTS],
      "readwrite",
    );
    const done = transactionDone(transaction);
    try {
      const sessionStore = getObjectStore(transaction, ASSESSMENT_STORES.SESSIONS);
      const attemptStore = getObjectStore(transaction, ASSESSMENT_STORES.ATTEMPTS);
      const current = await requestToPromise(sessionStore.get(command.sessionId));
      if (!current || current.learningUnitId !== command.learningUnitId) throw sessionNotFound(command);
      if (current.status === "completed") throw sessionCompleted(command);

      const attempt = cloneValue(command.attempt);
      await requestToPromise(attemptStore.put(attempt));
      const attempts = await requestToPromise(attemptStore.getAll());
      const answeredQuestionIds = new Set(
        attempts
          .filter((candidate) => candidate.sessionId === command.sessionId)
          .map((candidate) => candidate.questionId),
      );
      const complete = current.items.every((item) => answeredQuestionIds.has(item.questionId));
      const session = complete
        ? { ...cloneValue(current), status: "completed", completedAt: command.completedAt }
        : cloneValue(current);
      if (complete) await requestToPromise(sessionStore.put(session));
      await done;
      return { attempt: cloneValue(attempt), session: cloneValue(session) };
    } catch (error) {
      transaction.abort?.();
      await done.catch(() => {});
      throw error;
    }
  }

  async listAttempts(input) {
    const query = normalizeAttemptListQuery(input);
    const attempts = await this.readStore(ASSESSMENT_STORES.ATTEMPTS, (store) => store.getAll());
    return attempts
      .filter((attempt) => attempt.sessionId === query.sessionId)
      .filter((attempt) => query.questionId === undefined || attempt.questionId === query.questionId)
      .sort(sortAttempts)
      .map(cloneValue);
  }

  async getMutationReceipt(input) {
    const query = normalizeMutationReceiptQuery(input);
    return cloneRequestResult(await this.readStore(
      ASSESSMENT_STORES.MUTATION_RECEIPTS,
      (store) => store.get(query.mutationId),
    ));
  }

  close() {
    this.db.close?.();
  }
}

export async function createIndexedDbAssessmentRepository({
  indexedDb = globalThis.indexedDB,
  dbName = ASSESSMENT_DB_NAME,
  version = ASSESSMENT_DB_VERSION,
  clock = () => new Date(),
} = {}) {
  if (!indexedDb || typeof indexedDb.open !== "function") {
    throw storageUnavailable("Assessment IndexedDB is unavailable");
  }
  try {
    const db = await openAssessmentDb(indexedDb, { name: dbName, version });
    return new IndexedDbAssessmentRepository(db, { clock });
  } catch (error) {
    if (error?.code === "STORAGE_UNAVAILABLE") throw error;
    throw storageUnavailable("Unable to open Assessment IndexedDB", error);
  }
}

export const createAssessmentRepository = createIndexedDbAssessmentRepository;
