import assert from "node:assert/strict";
import test from "node:test";

import { AssessmentService } from "../src/assessment/application/AssessmentService.js";
import { getCanonicalAssessmentQuestions } from "../src/assessment/content/canonicalQuestions.js";
import { getMisconceptionForLearningUnit } from "../src/content/conceptModels.js";
import { MemoryAssessmentRepository } from "../src/assessment/infrastructure/memoryAssessmentRepository.js";

function createIdFactory() {
  let sequence = 0;
  return (prefix) => `${prefix}-canonical-${++sequence}`;
}

test("Lists & Key ships five validated canonical verification questions", () => {
  const questions = getCanonicalAssessmentQuestions("rendering-lists-key");

  assert.equal(questions.length, 5);
  assert.deepEqual(
    questions.map((question) => question.id),
    [
      "canonical-rendering-lists-key-identity",
      "canonical-rendering-lists-key-reorder",
      "canonical-rendering-lists-key-selection",
      "canonical-rendering-lists-key-stable-reorder",
      "canonical-rendering-lists-key-strategy-switch",
    ],
  );
  assert.ok(questions.every((question) => question.provenance.source === "canonical"));
  assert.ok(questions.every((question) => question.learningUnitId === "rendering-lists-key"));
  assert.ok(questions.every((question) => question.evidenceRefs.length > 0));
  assert.deepEqual(getCanonicalAssessmentQuestions("props"), []);
});

test("diagnostic distractors map to product-owned misconceptions without mapping the correct answer", () => {
  const questions = getCanonicalAssessmentQuestions("rendering-lists-key");
  const diagnosticQuestions = questions.filter((question) => question.content.diagnosticOptionMap);

  assert.ok(diagnosticQuestions.length >= 2);

  for (const question of diagnosticQuestions) {
    const mapping = question.content.diagnosticOptionMap;
    assert.equal(Object.hasOwn(mapping, question.content.correctOptionId), false);

    for (const [optionId, misconceptionId] of Object.entries(mapping)) {
      assert.ok(question.content.options.some((option) => option.id === optionId));
      assert.ok(
        getMisconceptionForLearningUnit(question.learningUnitId, misconceptionId),
        `${question.id}: missing misconception ${misconceptionId}`,
      );
    }
  }

  const reorder = questions.find((question) => question.id === "canonical-rendering-lists-key-reorder");
  assert.equal(reorder.content.diagnosticOptionMap["dom-static"], "dom-not-updated");
  assert.equal(reorder.content.diagnosticOptionMap["state-in-dom"], "state-lives-in-dom");

  const stableReorder = questions.find((question) => question.id === "canonical-rendering-lists-key-stable-reorder");
  assert.equal(stableReorder.content.diagnosticOptionMap["stable-remount"], "stable-key-remounts");
});

test("canonical verification snapshots diagnostics without adding product questions to the mutable question bank", async () => {
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

  assert.equal(session.items.length, 5);
  assert.deepEqual(
    session.items.map((item) => item.questionId),
    questions.map((question) => question.id),
  );
  assert.deepEqual(
    await repository.listQuestions({ learningUnitId: "rendering-lists-key" }),
    [],
  );

  const reorderSnapshot = session.items.find(
    (item) => item.questionId === "canonical-rendering-lists-key-reorder",
  ).snapshot;
  assert.equal(reorderSnapshot.content.diagnosticOptionMap["dom-static"], "dom-not-updated");

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
