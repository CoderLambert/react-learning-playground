import assert from "node:assert/strict";
import test from "node:test";

import { AssessmentService } from "../../src/assessment/application/AssessmentService.js";
import { createAssessmentToolDefinitions } from "../../src/assessment/ai/assessmentTools.js";
import { ASSESSMENT_ERROR_CODES } from "../../src/assessment/domain/assessmentErrors.js";
import { createAssessmentRuntime } from "../../src/assessment/composition/assessmentRuntime.js";
import { createIndexedDbAssessmentRepository } from "../../src/assessment/infrastructure/indexedDbAssessmentRepository.js";
import { MemoryAssessmentRepository } from "../../src/assessment/infrastructure/memoryAssessmentRepository.js";
import { createFixedClock } from "../../src/platform/clock.js";
import { ToolExecutor } from "../../src/ai/agent/ToolExecutor.js";
import { ToolPolicy } from "../../src/ai/agent/ToolPolicy.js";
import { ToolRegistry } from "../../src/ai/agent/ToolRegistry.js";
import { createToolExecutionContext } from "../../src/ai/agent/agentContracts.js";
import { FakeIndexedDB } from "../assessment-repository-fake-indexeddb.mjs";

const TIMESTAMP = "2026-09-12T00:00:00.000Z";
const UNIT = "unit-a7";

function choiceDraft(prompt = "Which input is read-only?") {
  return {
    type: "single_choice",
    content: {
      prompt,
      options: [{ id: "a", text: "Props" }, { id: "b", text: "State" }],
      correctOptionId: "a",
      explanation: "Props are read-only inputs.",
    },
    difficulty: "easy",
    conceptTags: ["assessment"],
  };
}

function trueFalseDraft() {
  return {
    type: "true_false",
    content: {
      prompt: "Props are read-only.",
      correct: true,
      explanation: "A component does not mutate its props.",
    },
    difficulty: "easy",
    conceptTags: ["assessment"],
  };
}

function createService(repository = new MemoryAssessmentRepository({ clock: () => new Date(TIMESTAMP) })) {
  let sequence = 0;
  return new AssessmentService({
    repository,
    clock: createFixedClock(TIMESTAMP),
    idFactory: (prefix) => `${prefix}-a7-${++sequence}`,
  });
}

function createToolHarness(service) {
  const registry = new ToolRegistry();
  for (const definition of createAssessmentToolDefinitions({ assessmentService: service })) {
    registry.register(definition);
  }
  return new ToolExecutor({ registry, policy: new ToolPolicy() });
}

function toolContext(runId = "run-a7") {
  return createToolExecutionContext({
    learningUnitId: UNIT,
    conversationId: `${runId}-conversation`,
    agentRunId: runId,
    contextSnapshotId: `${runId}-context`,
    mutationId: `${runId}:runtime`,
    actor: { type: "ai_agent", model: "mock-assessment-model" },
  });
}

test("A7.3 PASS: session start snapshots v1 and a later session snapshots v2", async () => {
  const repository = new MemoryAssessmentRepository({ clock: () => new Date(TIMESTAMP) });
  const service = createService(repository);
  const created = await service.createQuestions({
    trusted: { learningUnitId: UNIT, mutationId: "create-v1" },
    questions: [choiceDraft("v1 prompt")],
  });
  const question = created.result[0];
  const oldSession = await service.startSession({ trusted: { learningUnitId: UNIT }, questionIds: [question.id] });

  const updated = await service.updateQuestion({
    trusted: { learningUnitId: UNIT, mutationId: "update-v2" },
    questionId: question.id,
    expectedRevision: 1,
    patch: { content: { prompt: "v2 prompt" } },
  });
  const newSession = await service.startSession({ trusted: { learningUnitId: UNIT }, questionIds: [question.id] });

  assert.equal(oldSession.items[0].revision, 1);
  assert.equal(oldSession.items[0].snapshot.content.prompt, "v1 prompt");
  assert.equal(updated.result.revision, 2);
  assert.equal(newSession.items[0].revision, 2);
  assert.equal(newSession.items[0].snapshot.content.prompt, "v2 prompt");
});

test("A7.4 PASS: single-choice and true-false attempts grade, explain, and survive repository reload", async () => {
  const indexedDb = new FakeIndexedDB();
  const firstRepository = await createIndexedDbAssessmentRepository({ indexedDb, clock: () => new Date(TIMESTAMP) });
  const service = createService(firstRepository);
  const created = await service.createQuestions({
    trusted: { learningUnitId: UNIT, mutationId: "create-answer-set" },
    questions: [choiceDraft(), trueFalseDraft()],
  });
  const [choice, truth] = created.result;
  const session = await service.startSession({ trusted: { learningUnitId: UNIT } });

  const choiceIncorrect = await service.submitAnswer({
    trusted: { learningUnitId: UNIT }, sessionId: session.id, questionId: choice.id, answer: "b",
  });
  const choiceCorrect = await service.submitAnswer({
    trusted: { learningUnitId: UNIT }, sessionId: session.id, questionId: choice.id, answer: "a",
  });
  const truthIncorrect = await service.submitAnswer({
    trusted: { learningUnitId: UNIT }, sessionId: session.id, questionId: truth.id, answer: false,
  });
  const truthCorrect = await service.submitAnswer({
    trusted: { learningUnitId: UNIT }, sessionId: session.id, questionId: truth.id, answer: true,
  });

  assert.equal(choiceIncorrect.correct, false);
  assert.equal(choiceCorrect.correct, true);
  assert.equal(truthIncorrect.correct, false);
  assert.equal(truthCorrect.correct, true);
  assert.equal(session.items[0].snapshot.content.explanation, "Props are read-only inputs.");
  assert.equal(session.items[1].snapshot.content.explanation, "A component does not mutate its props.");

  const reloadedRepository = await createIndexedDbAssessmentRepository({ indexedDb, clock: () => new Date(TIMESTAMP) });
  const persistedAttempts = await reloadedRepository.listAttempts({ sessionId: session.id });
  assert.equal(persistedAttempts.length, 4);
  assert.deepEqual(persistedAttempts.map((attempt) => attempt.correct), [false, true, false, true]);
});

test("A7.5 PASS: duplicate mutationId replays one committed mutation", async () => {
  const repository = new MemoryAssessmentRepository({ clock: () => new Date(TIMESTAMP) });
  const service = createService(repository);
  const first = await service.createQuestions({
    trusted: { learningUnitId: UNIT, mutationId: "same-mutation" },
    questions: [choiceDraft()],
  });
  const second = await service.createQuestions({
    trusted: { learningUnitId: UNIT, mutationId: "same-mutation" },
    questions: [choiceDraft("must not be written twice")],
  });

  assert.equal(first.replayed, false);
  assert.equal(second.replayed, true);
  assert.deepEqual(second.result, first.result);
  assert.equal((await repository.listQuestions({ learningUnitId: UNIT })).length, 1);
  assert.ok(await repository.getMutationReceipt({ mutationId: "same-mutation" }));
});

test("A7.6 PASS: concurrent updates with one expectedRevision yield one success and one REVISION_CONFLICT", async () => {
  const repository = new MemoryAssessmentRepository({ clock: () => new Date(TIMESTAMP) });
  const service = createService(repository);
  const question = (await service.createQuestions({
    trusted: { learningUnitId: UNIT, mutationId: "create-concurrency" },
    questions: [choiceDraft()],
  })).result[0];

  const results = await Promise.allSettled([
    service.updateQuestion({
      trusted: { learningUnitId: UNIT, mutationId: "update-concurrency-1" },
      questionId: question.id, expectedRevision: 1, patch: { content: { prompt: "first wins" } },
    }),
    service.updateQuestion({
      trusted: { learningUnitId: UNIT, mutationId: "update-concurrency-2" },
      questionId: question.id, expectedRevision: 1, patch: { content: { prompt: "second conflicts" } },
    }),
  ]);

  assert.equal(results.filter((result) => result.status === "fulfilled").length, 1);
  assert.equal(results.filter((result) => result.status === "rejected").length, 1);
  assert.equal(results.find((result) => result.status === "rejected").reason.code, ASSESSMENT_ERROR_CODES.REVISION_CONFLICT);
  assert.equal((await repository.getQuestion({ learningUnitId: UNIT, questionId: question.id })).revision, 2);
});

test("A7.7 PASS: abort before mutation does not write; abort after commit preserves the write", async () => {
  const beforeRepository = new MemoryAssessmentRepository({ clock: () => new Date(TIMESTAMP) });
  const beforeService = createService(beforeRepository);
  const beforeExecutor = createToolHarness(beforeService);
  const beforeController = new AbortController();
  beforeController.abort("before-tool");
  const beforeResult = await beforeExecutor.execute({
    id: "abort-before-call", name: "assessment_create_questions", arguments: { questions: [choiceDraft()] },
  }, toolContext("abort-before"), { signal: beforeController.signal });

  assert.equal(beforeResult.ok, false);
  assert.equal(beforeResult.error.code, "ABORTED");
  assert.equal((await beforeRepository.listQuestions({ learningUnitId: UNIT })).length, 0);

  const afterRepository = new MemoryAssessmentRepository({ clock: () => new Date(TIMESTAMP) });
  const afterController = new AbortController();
  const originalCreate = afterRepository.createQuestions.bind(afterRepository);
  afterRepository.createQuestions = async (input) => {
    const result = await originalCreate(input);
    afterController.abort("after-commit");
    return result;
  };
  const afterService = createService(afterRepository);
  const afterExecutor = createToolHarness(afterService);
  const afterResult = await afterExecutor.execute({
    id: "abort-after-call", name: "assessment_create_questions", arguments: { questions: [choiceDraft()] },
  }, toolContext("abort-after"), { signal: afterController.signal });

  assert.equal(afterResult.ok, true);
  assert.equal((await afterRepository.listQuestions({ learningUnitId: UNIT })).length, 1);
});

test("A7.8 PASS: runtime reports memory fallback when IndexedDB is unavailable", async () => {
  const runtime = await createAssessmentRuntime({ indexedDb: undefined });
  assert.equal(runtime.mode, "memory");
  assert.equal(runtime.storageNotice, "本地持久化不可用，评测当前为本次会话存储。");
  assert.equal(runtime.toolExecutor.registry.has("assessment_create_questions"), true);
});
