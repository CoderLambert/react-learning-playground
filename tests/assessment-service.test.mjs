import assert from "node:assert/strict";
import test from "node:test";

import { createFixedClock } from "../src/platform/clock.js";
import { ASSESSMENT_ERROR_CODES, AssessmentError } from "../src/assessment/domain/assessmentErrors.js";
import { AssessmentService } from "../src/assessment/application/AssessmentService.js";
import { createAssessmentQueryStore } from "../src/assessment/store/AssessmentQueryStore.js";

const TIMESTAMP = "2026-09-12T00:00:00.000Z";

function choiceQuestion({ id = "q-1", learningUnitId = "unit-1", prompt = "Which answer?" } = {}) {
  return {
    id,
    learningUnitId,
    type: "single_choice",
    content: {
      prompt,
      options: [{ id: "a", text: "A" }, { id: "b", text: "B" }],
      correctOptionId: "b",
      explanation: "B is correct",
    },
    difficulty: "medium",
    conceptTags: ["assessment"],
    evidenceRefs: [],
    status: "active",
    revision: 1,
    provenance: { source: "seed" },
    createdAt: TIMESTAMP,
    updatedAt: TIMESTAMP,
  };
}

function trueFalseQuestion({ id = "q-2", learningUnitId = "unit-1" } = {}) {
  return {
    id,
    learningUnitId,
    type: "true_false",
    content: {
      prompt: "This statement is true.",
      correct: true,
      explanation: "The statement is true.",
    },
    status: "active",
    revision: 1,
    provenance: { source: "seed" },
    createdAt: TIMESTAMP,
    updatedAt: TIMESTAMP,
  };
}

function createRepository() {
  const questions = new Map();
  const sessions = new Map();
  const attempts = new Map();
  const calls = [];

  const repository = {
    calls,
    questions,
    sessions,
    attempts,
    async listQuestions(query) {
      calls.push(["listQuestions", query]);
      return [...questions.values()].filter((question) => (
        question.learningUnitId === query.learningUnitId
        && (query.status === undefined || question.status === query.status)
      )).map((question) => structuredClone(question));
    },
    async getQuestion(query) {
      calls.push(["getQuestion", query]);
      const question = questions.get(query.questionId);
      return question?.learningUnitId === query.learningUnitId ? structuredClone(question) : null;
    },
    async createQuestions(command) {
      calls.push(["createQuestions", command]);
      const result = command.questions.map((question) => {
        questions.set(question.id, structuredClone(question));
        return structuredClone(question);
      });
      return { result, replayed: false };
    },
    async updateQuestion(command) {
      calls.push(["updateQuestion", command]);
      const current = questions.get(command.questionId);
      if (!current || current.learningUnitId !== command.learningUnitId) {
        throw new AssessmentError(ASSESSMENT_ERROR_CODES.QUESTION_NOT_FOUND, "missing question");
      }
      if (current.revision !== command.expectedRevision) {
        throw new AssessmentError(ASSESSMENT_ERROR_CODES.REVISION_CONFLICT, "revision conflict");
      }
      const result = {
        ...current,
        ...structuredClone(command.patch),
        revision: current.revision + 1,
      };
      questions.set(result.id, structuredClone(result));
      return { result: structuredClone(result), replayed: false };
    },
    async retireQuestion(command) {
      calls.push(["retireQuestion", command]);
      const current = questions.get(command.questionId);
      if (!current || current.learningUnitId !== command.learningUnitId) {
        throw new AssessmentError(ASSESSMENT_ERROR_CODES.QUESTION_NOT_FOUND, "missing question");
      }
      if (current.revision !== command.expectedRevision) {
        throw new AssessmentError(ASSESSMENT_ERROR_CODES.REVISION_CONFLICT, "revision conflict");
      }
      const result = { ...current, status: "retired", revision: current.revision + 1 };
      questions.set(result.id, structuredClone(result));
      return { result: structuredClone(result), replayed: false };
    },
    async createSession({ session }) {
      sessions.set(session.id, structuredClone(session));
      return structuredClone(session);
    },
    async getSession({ learningUnitId, sessionId }) {
      const session = sessions.get(sessionId);
      return session?.learningUnitId === learningUnitId ? structuredClone(session) : null;
    },
    async saveAttempt({ attempt }) {
      attempts.set(attempt.id, structuredClone(attempt));
      return structuredClone(attempt);
    },
    async listAttempts({ sessionId, questionId }) {
      return [...attempts.values()].filter((attempt) => (
        attempt.sessionId === sessionId && (questionId === undefined || attempt.questionId === questionId)
      )).map((attempt) => structuredClone(attempt));
    },
    async getMutationReceipt() {
      return null;
    },
  };

  return repository;
}

function createHarness(options = {}) {
  const repository = options.repository ?? createRepository();
  const queryStore = options.queryStore ?? createAssessmentQueryStore();
  let id = 0;
  const service = new AssessmentService({
    repository,
    queryStore,
    clock: createFixedClock(TIMESTAMP),
    idFactory: (prefix) => `${prefix}-${++id}`,
    ...options,
  });
  return { repository, queryStore, service };
}

const trusted = {
  learningUnitId: "unit-1",
  provenance: { source: "agent", model: "trusted-model" },
  mutationId: "run-1:call-1",
};

test("createQuestions normalizes system fields and injects trusted scope/provenance", async () => {
  const { repository, queryStore, service } = createHarness();
  const modelPayload = {
    id: "model-controlled-id",
    learningUnitId: "another-unit",
    status: "retired",
    revision: 99,
    createdAt: "forged",
    updatedAt: "forged",
    provenance: { source: "forged" },
    ...choiceQuestion({ id: "model-controlled-id", learningUnitId: "another-unit" }),
  };

  const command = await service.createQuestions({ trusted, questions: [modelPayload] });
  const created = command.result[0];
  assert.equal(created.id, "question-1");
  assert.equal(created.learningUnitId, "unit-1");
  assert.equal(created.status, "active");
  assert.equal(created.revision, 1);
  assert.deepEqual(created.provenance, trusted.provenance);
  assert.equal(created.createdAt, TIMESTAMP);
  assert.equal(repository.questions.get(created.id).learningUnitId, "unit-1");
  assert.deepEqual(queryStore.getSnapshot(), { learningUnitId: "unit-1", questions: [created] });
});

test("listQuestions always applies the trusted learning-unit scope", async () => {
  const { repository, service } = createHarness();
  repository.questions.set("q-1", choiceQuestion());
  repository.questions.set("q-2", choiceQuestion({ id: "q-2", learningUnitId: "another-unit" }));

  const result = await service.listQuestions({ trusted: { learningUnitId: "unit-1" } });
  assert.deepEqual(result.map((question) => question.id), ["q-1"]);
  assert.deepEqual(repository.calls[0], ["listQuestions", { learningUnitId: "unit-1" }]);
});

test("updateQuestion rejects system-field patches and sends a runtime provenance update", async () => {
  const { repository, service } = createHarness();
  repository.questions.set("q-1", choiceQuestion());

  await assert.rejects(
    service.updateQuestion({
      trusted,
      questionId: "q-1",
      expectedRevision: 1,
      patch: { id: "forged" },
    }),
    (error) => error.code === ASSESSMENT_ERROR_CODES.INVALID_QUESTION && /system field/.test(error.message),
  );

  const command = await service.updateQuestion({
    trusted: { ...trusted, mutationId: "run-1:call-2", provenance: { source: "runtime-update" } },
    questionId: "q-1",
    expectedRevision: 1,
    patch: { content: { prompt: "Updated prompt" }, provenance: { source: "model-forged" } },
  }).catch((error) => error);
  assert.equal(command.code, ASSESSMENT_ERROR_CODES.INVALID_QUESTION);

  const successful = await service.updateQuestion({
    trusted: { ...trusted, mutationId: "run-1:call-3", provenance: { source: "runtime-update" } },
    questionId: "q-1",
    expectedRevision: 1,
    patch: { content: { prompt: "Updated prompt" } },
  });
  assert.equal(successful.result.revision, 2);
  assert.equal(successful.result.content.prompt, "Updated prompt");
  assert.equal(successful.result.content.correctOptionId, "b");
  assert.deepEqual(successful.result.provenance, { source: "runtime-update" });
  const updateCall = repository.calls.find(([method]) => method === "updateQuestion");
  assert.deepEqual(updateCall[1].patch.provenance, { source: "runtime-update" });
});

test("updateQuestion propagates the repository revision conflict", async () => {
  const { repository, service } = createHarness();
  repository.questions.set("q-1", choiceQuestion());

  await assert.rejects(
    service.updateQuestion({
      trusted,
      questionId: "q-1",
      expectedRevision: 2,
      patch: { content: { prompt: "stale" } },
    }),
    (error) => error.code === ASSESSMENT_ERROR_CODES.REVISION_CONFLICT,
  );
});

test("retireQuestion is a status mutation and refreshes the query store", async () => {
  const { repository, queryStore, service } = createHarness();
  repository.questions.set("q-1", choiceQuestion());

  const command = await service.retireQuestion({ trusted, questionId: "q-1", expectedRevision: 1 });
  assert.equal(command.result.status, "retired");
  assert.equal(repository.questions.get("q-1").status, "retired");
  assert.deepEqual(queryStore.getSnapshot(), {
    learningUnitId: "unit-1",
    questions: [repository.questions.get("q-1")],
  });
});

test("startSession stores complete question revision snapshots", async () => {
  const { repository, service } = createHarness();
  repository.questions.set("q-1", choiceQuestion());
  const session = await service.startSession({ trusted: { learningUnitId: "unit-1" }, questionIds: ["q-1"] });

  repository.questions.get("q-1").content.prompt = "new repository question";
  assert.equal(session.items[0].questionId, "q-1");
  assert.equal(session.items[0].revision, 1);
  assert.equal(session.items[0].snapshot.content.prompt, "Which answer?");
  assert.equal(repository.sessions.get(session.id).items[0].snapshot.content.prompt, "Which answer?");
});

test("submitAnswer grades against the session snapshot and persists independent attempts", async () => {
  const { repository, service } = createHarness();
  repository.questions.set("q-1", choiceQuestion());
  repository.questions.set("q-2", trueFalseQuestion());
  const session = await service.startSession({ trusted: { learningUnitId: "unit-1" } });

  const choiceAttempt = await service.submitAnswer({
    trusted: { learningUnitId: "unit-1" },
    sessionId: session.id,
    questionId: "q-1",
    answer: "b",
  });
  const booleanAttempt = await service.submitAnswer({
    trusted: { learningUnitId: "unit-1" },
    sessionId: session.id,
    questionId: "q-2",
    answer: false,
  });

  assert.equal(choiceAttempt.correct, true);
  assert.equal(choiceAttempt.questionRevision, 1);
  assert.equal(booleanAttempt.correct, false);
  assert.equal(booleanAttempt.questionRevision, 1);
  assert.equal(repository.attempts.size, 2);
});

test("evidence validator rejects references outside the trusted learning unit", async () => {
  const { service } = createHarness({
    evidenceValidator: (ref, context) => ref.fileName === `${context.learningUnitId}.jsx`,
  });
  const payload = {
    ...choiceQuestion(),
    evidenceRefs: [{ kind: "source", fileName: "another-unit.jsx", startLine: 4, endLine: 6 }],
  };

  await assert.rejects(
    service.createQuestions({ trusted, questions: [payload] }),
    (error) => error.code === ASSESSMENT_ERROR_CODES.INVALID_EVIDENCE,
  );
});

test("repository errors are not swallowed by the service", async () => {
  const error = new Error("storage failed");
  const repository = createRepository();
  repository.createQuestions = async () => { throw error; };
  const { service } = createHarness({ repository });

  await assert.rejects(
    service.createQuestions({ trusted, questions: [choiceQuestion()] }),
    (received) => received === error,
  );
});
