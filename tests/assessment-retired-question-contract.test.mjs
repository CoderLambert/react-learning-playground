import assert from "node:assert/strict";
import test from "node:test";

import { ASSESSMENT_ERROR_CODES } from "../src/assessment/domain/assessmentErrors.js";
import { MemoryAssessmentRepository } from "../src/assessment/infrastructure/memoryAssessmentRepository.js";
import { createIndexedDbAssessmentRepository } from "../src/assessment/infrastructure/indexedDbAssessmentRepository.js";
import { FakeIndexedDB } from "./assessment-repository-fake-indexeddb.mjs";

const baseQuestion = Object.freeze({
  id: "q-retired",
  learningUnitId: "unit-1",
  status: "active",
  revision: 1,
  createdAt: "2026-09-13T00:00:00.000Z",
  updatedAt: "2026-09-13T00:00:00.000Z",
  prompt: "original",
});

async function assertRetiredQuestionIsTerminal(repository) {
  await repository.createQuestions({
    learningUnitId: "unit-1",
    mutationId: "create-retired-contract",
    questions: [baseQuestion],
  });

  const retired = await repository.retireQuestion({
    learningUnitId: "unit-1",
    questionId: "q-retired",
    expectedRevision: 1,
    mutationId: "retire-once",
    metadata: {
      updatedAt: "2026-09-13T00:01:00.000Z",
      provenance: { source: "test" },
    },
  });
  assert.equal(retired.result.status, "retired");
  assert.equal(retired.result.revision, 2);

  await assert.rejects(
    repository.updateQuestion({
      learningUnitId: "unit-1",
      questionId: "q-retired",
      expectedRevision: 2,
      mutationId: "update-after-retire",
      patch: { prompt: "must not persist" },
    }),
    (error) => error?.code === ASSESSMENT_ERROR_CODES.QUESTION_RETIRED,
  );

  await assert.rejects(
    repository.retireQuestion({
      learningUnitId: "unit-1",
      questionId: "q-retired",
      expectedRevision: 2,
      mutationId: "retire-twice",
      metadata: {
        updatedAt: "2026-09-13T00:02:00.000Z",
        provenance: { source: "test" },
      },
    }),
    (error) => error?.code === ASSESSMENT_ERROR_CODES.QUESTION_RETIRED,
  );

  assert.deepEqual(
    await repository.getQuestion({ learningUnitId: "unit-1", questionId: "q-retired" }),
    retired.result,
  );
  repository.close?.();
}

test("MemoryAssessmentRepository keeps retired questions immutable", async () => {
  await assertRetiredQuestionIsTerminal(new MemoryAssessmentRepository());
});

test("IndexedDbAssessmentRepository keeps retired questions immutable transactionally", async () => {
  const repository = await createIndexedDbAssessmentRepository({ indexedDb: new FakeIndexedDB() });
  await assertRetiredQuestionIsTerminal(repository);
});
