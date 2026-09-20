import assert from "node:assert/strict";
import test from "node:test";

import { AssessmentService } from "../src/assessment/application/AssessmentService.js";
import { getCanonicalAssessmentQuestions } from "../src/assessment/content/canonicalQuestions.js";
import { MemoryAssessmentRepository } from "../src/assessment/infrastructure/memoryAssessmentRepository.js";

function createIdFactory() {
  let sequence = 0;
  return (prefix) => `${prefix}-canonical-${++sequence}`;
}

test("Lists & Key ships three validated canonical verification questions", () => {
  const questions = getCanonicalAssessmentQuestions("rendering-lists-key");

  assert.equal(questions.length, 3);
  assert.deepEqual(
    questions.map((question) => question.id),
    [
      "canonical-rendering-lists-key-identity",
      "canonical-rendering-lists-key-reorder",
      "canonical-rendering-lists-key-selection",
    ],
  );
  assert.ok(questions.every((question) => question.provenance.source === "canonical"));
  assert.ok(questions.every((question) => question.learningUnitId === "rendering-lists-key"));
  assert.ok(questions.every((question) => question.evidenceRefs.length > 0));
  assert.deepEqual(getCanonicalAssessmentQuestions("props"), []);
});

test("canonical verification snapshots product questions without adding them to the mutable question bank", async () => {
  const repository = new MemoryAssessmentRepository();
  const service = new AssessmentService({
    repository,
    idFactory: createIdFactory(),
    evidenceResolver: {
      resolve(ref) {
        return ref?.kind === "source" ? { ok: true } : null;
      },
    },
  });
  const questions = getCanonicalAssessmentQuestions("rendering-lists-key");

  const session = await service.startSession({
    trusted: { learningUnitId: "rendering-lists-key" },
    questionRecords: questions,
  });

  assert.equal(session.items.length, 3);
  assert.deepEqual(
    session.items.map((item) => item.questionId),
    questions.map((question) => question.id),
  );
  assert.deepEqual(
    await repository.listQuestions({ learningUnitId: "rendering-lists-key" }),
    [],
  );

  const first = session.items[0].snapshot;
  const attempt = await service.submitAnswer({
    trusted: { learningUnitId: "rendering-lists-key" },
    sessionId: session.id,
    questionId: first.id,
    answer: first.content.correctOptionId,
  });

  assert.equal(attempt.correct, true);
});

test("canonical session records cannot cross learning-unit scope", async () => {
  const repository = new MemoryAssessmentRepository();
  const service = new AssessmentService({
    repository,
    idFactory: createIdFactory(),
    evidenceResolver: { resolve: () => ({ ok: true }) },
  });

  await assert.rejects(
    () => service.startSession({
      trusted: { learningUnitId: "props" },
      questionRecords: getCanonicalAssessmentQuestions("rendering-lists-key"),
    }),
    /current learning unit/,
  );
});
