import assert from "node:assert/strict";
import test from "node:test";

import {
  ASSESSMENT_MUTATION_OPERATIONS,
  ASSESSMENT_REPOSITORY_METHODS,
  assertAssessmentMutationReceipt,
  assertAssessmentRepository,
  normalizeAssessmentCommandResult,
  normalizeCreateQuestionsCommand,
  normalizeGetQuestionQuery,
  normalizeListQuestionsQuery,
  normalizeRetireQuestionCommand,
  normalizeUpdateQuestionCommand,
} from "../src/assessment/application/assessmentPorts.js";

function createRepositoryStub() {
  return Object.fromEntries(ASSESSMENT_REPOSITORY_METHODS.map((method) => [method, () => undefined]));
}

test("repository port accepts the complete V1 method surface", () => {
  const repository = createRepositoryStub();
  assert.equal(assertAssessmentRepository(repository), repository);
  assert.deepEqual(ASSESSMENT_MUTATION_OPERATIONS, [
    "createQuestions",
    "updateQuestion",
    "retireQuestion",
  ]);
  assert.equal(ASSESSMENT_REPOSITORY_METHODS.includes("saveMutationReceipt"), false);
});

test("repository port rejects every missing required method", () => {
  for (const missingMethod of ASSESSMENT_REPOSITORY_METHODS) {
    const repository = createRepositoryStub();
    delete repository[missingMethod];
    assert.throws(
      () => assertAssessmentRepository(repository),
      new RegExp(`assessment repository\\.${missingMethod} is required`),
    );
  }
  assert.throws(() => assertAssessmentRepository(null), /assessment repository is required/);
  assert.throws(() => assertAssessmentRepository([]), /assessment repository is required/);
});

test("question queries normalize and preserve an explicit learning-unit scope", () => {
  assert.deepEqual(
    normalizeListQuestionsQuery({ learningUnitId: "  unit-1 ", status: "active" }),
    { learningUnitId: "unit-1", status: "active" },
  );
  assert.deepEqual(
    normalizeListQuestionsQuery({ learningUnitId: "unit-1" }),
    { learningUnitId: "unit-1" },
  );
  assert.deepEqual(
    normalizeGetQuestionQuery({ learningUnitId: " unit-1 ", questionId: " q-1 " }),
    { learningUnitId: "unit-1", questionId: "q-1" },
  );

  assert.throws(
    () => normalizeListQuestionsQuery({ status: "active" }),
    /listQuestions\.learningUnitId is required/,
  );
  assert.throws(
    () => normalizeListQuestionsQuery({ learningUnitId: "unit-1", status: "unknown" }),
    /status must be active or retired/,
  );
  assert.throws(
    () => normalizeGetQuestionQuery({ learningUnitId: "unit-1" }),
    /getQuestion\.questionId is required/,
  );
});

test("question mutation commands normalize trusted scope, revision, and mutation identity", () => {
  const question = { id: "q-1", learningUnitId: "unit-1", revision: 1 };
  assert.deepEqual(
    normalizeCreateQuestionsCommand({
      learningUnitId: " unit-1 ",
      questions: [question],
      mutationId: " run-1:call-1 ",
      ignored: true,
    }),
    { learningUnitId: "unit-1", questions: [question], mutationId: "run-1:call-1" },
  );
  assert.deepEqual(
    normalizeUpdateQuestionCommand({
      learningUnitId: "unit-1",
      questionId: " q-1 ",
      expectedRevision: 3,
      patch: { content: { prompt: "Updated" } },
      mutationId: "run-1:call-2",
    }),
    {
      learningUnitId: "unit-1",
      questionId: "q-1",
      expectedRevision: 3,
      patch: { content: { prompt: "Updated" } },
      mutationId: "run-1:call-2",
    },
  );
  assert.deepEqual(
    normalizeRetireQuestionCommand({
      learningUnitId: "unit-1",
      questionId: "q-1",
      expectedRevision: 3,
      mutationId: "run-1:call-3",
    }),
    {
      learningUnitId: "unit-1",
      questionId: "q-1",
      expectedRevision: 3,
      mutationId: "run-1:call-3",
    },
  );

  assert.throws(
    () => normalizeCreateQuestionsCommand({ learningUnitId: "unit-1", questions: [], mutationId: "m-1" }),
    /questions must be a non-empty array/,
  );
  assert.throws(
    () => normalizeUpdateQuestionCommand({
      learningUnitId: "unit-1",
      questionId: "q-1",
      expectedRevision: 0,
      patch: {},
      mutationId: "m-1",
    }),
    /expectedRevision must be a positive integer/,
  );
  assert.throws(
    () => normalizeRetireQuestionCommand({
      learningUnitId: "unit-1",
      questionId: "q-1",
      expectedRevision: 1,
    }),
    /retireQuestion\.mutationId is required/,
  );
});

test("command results and mutation receipts have explicit replay semantics", () => {
  const result = { id: "q-1", revision: 2 };
  assert.deepEqual(
    normalizeAssessmentCommandResult({ result, replayed: false, ignored: true }),
    { result, replayed: false },
  );
  assert.deepEqual(
    normalizeAssessmentCommandResult({ result, replayed: true }),
    { result, replayed: true },
  );
  assert.deepEqual(
    assertAssessmentMutationReceipt({
      mutationId: "run-1:call-2",
      operation: "updateQuestion",
      result,
      createdAt: "2026-09-12T00:00:00.000Z",
    }),
    {
      mutationId: "run-1:call-2",
      operation: "updateQuestion",
      result,
      createdAt: "2026-09-12T00:00:00.000Z",
    },
  );

  assert.throws(
    () => normalizeAssessmentCommandResult({ result }),
    /replayed must be boolean/,
  );
  assert.throws(
    () => normalizeAssessmentCommandResult({ replayed: false }),
    /result is required/,
  );
  assert.throws(
    () => assertAssessmentMutationReceipt({
      mutationId: "m-1",
      operation: "deleteQuestion",
      result,
      createdAt: "2026-09-12T00:00:00.000Z",
    }),
    /operation must be one of/,
  );
  assert.throws(
    () => assertAssessmentMutationReceipt({
      mutationId: "m-1",
      operation: "createQuestions",
      createdAt: "2026-09-12T00:00:00.000Z",
    }),
    /result is required/,
  );
});
