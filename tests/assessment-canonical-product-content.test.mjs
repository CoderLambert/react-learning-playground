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


test("State Snapshot ships five validated diagnostic canonical questions", () => {
  const questions = getCanonicalAssessmentQuestions("state-snapshot-queue");

  assert.equal(questions.length, 5);
  assert.deepEqual(
    questions.map((question) => question.id),
    [
      "canonical-state-snapshot-current-value",
      "canonical-state-snapshot-replace-three",
      "canonical-state-snapshot-updater-three",
      "canonical-state-snapshot-replace-updater",
      "canonical-state-snapshot-final-replace",
    ],
  );
  assert.ok(questions.every((question) => question.provenance.source === "canonical"));
  assert.ok(questions.every((question) => question.learningUnitId === "state-snapshot-queue"));
  assert.ok(questions.every((question) => question.evidenceRefs.length > 0));

  const diagnosticQuestions = questions.filter((question) => question.content.diagnosticOptionMap);
  assert.ok(diagnosticQuestions.length >= 4);

  for (const question of diagnosticQuestions) {
    for (const [optionId, misconceptionId] of Object.entries(question.content.diagnosticOptionMap)) {
      assert.notEqual(optionId, question.content.correctOptionId);
      assert.ok(question.content.options.some((option) => option.id === optionId));
      assert.ok(
        getMisconceptionForLearningUnit("state-snapshot-queue", misconceptionId),
        `${question.id}: missing State Snapshot misconception ${misconceptionId}`,
      );
    }
  }
});

test("State Snapshot canonical session snapshots diagnostics without entering the mutable question bank", async () => {
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
  const questions = getCanonicalAssessmentQuestions("state-snapshot-queue");

  const session = await service.startSession({
    trusted: { learningUnitId: "state-snapshot-queue" },
    questionRecords: questions,
  });

  assert.equal(session.items.length, 5);
  assert.deepEqual(
    await repository.listQuestions({ learningUnitId: "state-snapshot-queue" }),
    [],
  );

  const replaceThree = session.items.find(
    (item) => item.questionId === "canonical-state-snapshot-replace-three",
  ).snapshot;
  assert.equal(
    replaceThree.content.diagnosticOptionMap["auto-accumulate"],
    "repeated-replace-accumulates",
  );

  const attempt = await service.submitAnswer({
    trusted: { learningUnitId: "state-snapshot-queue" },
    sessionId: session.id,
    questionId: replaceThree.id,
    answer: replaceThree.content.correctOptionId,
  });
  assert.equal(attempt.correct, true);
});

test("You Might Not Need an Effect ships five causal diagnostic canonical questions", () => {
  const questions = getCanonicalAssessmentQuestions("not-need-effect");

  assert.equal(questions.length, 5);
  assert.deepEqual(
    questions.map((question) => question.id),
    [
      "canonical-not-need-effect-derived-list",
      "canonical-not-need-effect-purchase-event",
      "canonical-not-need-effect-external-sync",
      "canonical-not-need-effect-expensive-derive",
      "canonical-not-need-effect-key-reset",
    ],
  );
  assert.ok(questions.every((question) => question.provenance.source === "canonical"));
  assert.ok(questions.every((question) => question.learningUnitId === "not-need-effect"));
  assert.ok(questions.every((question) => question.evidenceRefs.length > 0));

  const diagnosticQuestions = questions.filter((question) => question.content.diagnosticOptionMap);
  assert.ok(diagnosticQuestions.length >= 4);

  for (const question of diagnosticQuestions) {
    for (const [optionId, misconceptionId] of Object.entries(question.content.diagnosticOptionMap)) {
      assert.notEqual(optionId, question.content.correctOptionId);
      assert.ok(question.content.options.some((option) => option.id === optionId));
      assert.ok(
        getMisconceptionForLearningUnit("not-need-effect", misconceptionId),
        `${question.id}: missing Effect misconception ${misconceptionId}`,
      );
    }
  }

  const purchase = questions.find(
    (question) => question.id === "canonical-not-need-effect-purchase-event",
  );
  assert.equal(
    purchase.content.diagnosticOptionMap["effect-watch-count"],
    "state-change-needs-effect",
  );
  assert.equal(
    purchase.content.diagnosticOptionMap["effect-network-rule"],
    "side-effect-means-effect",
  );
});

test("Effect canonical session snapshots diagnostics without entering the mutable question bank", async () => {
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
  const questions = getCanonicalAssessmentQuestions("not-need-effect");

  const session = await service.startSession({
    trusted: { learningUnitId: "not-need-effect" },
    questionRecords: questions,
  });

  assert.equal(session.items.length, 5);
  assert.deepEqual(
    await repository.listQuestions({ learningUnitId: "not-need-effect" }),
    [],
  );

  const purchase = session.items.find(
    (item) => item.questionId === "canonical-not-need-effect-purchase-event",
  ).snapshot;
  assert.equal(
    purchase.content.diagnosticOptionMap["effect-watch-count"],
    "state-change-needs-effect",
  );

  const attempt = await service.submitAnswer({
    trusted: { learningUnitId: "not-need-effect" },
    sessionId: session.id,
    questionId: purchase.id,
    answer: purchase.content.correctOptionId,
  });
  assert.equal(attempt.correct, true);
});



test("Preserving / Resetting State ships five identity-boundary diagnostic questions", () => {
  const questions = getCanonicalAssessmentQuestions("preserving-resetting-state");

  assert.equal(questions.length, 5);
  assert.deepEqual(
    questions.map((question) => question.id),
    [
      "canonical-preserve-reset-props-switch",
      "canonical-preserve-reset-contact-key",
      "canonical-preserve-reset-boundary",
      "canonical-preserve-reset-stable-key-rerender",
      "canonical-preserve-reset-per-entity-drafts",
    ],
  );
  assert.ok(questions.every((question) => question.provenance.source === "canonical"));
  assert.ok(questions.every((question) => question.learningUnitId === "preserving-resetting-state"));
  assert.ok(questions.every((question) => question.evidenceRefs.length > 0));

  const diagnosticQuestions = questions.filter((question) => question.content.diagnosticOptionMap);
  assert.ok(diagnosticQuestions.length >= 4);

  for (const question of diagnosticQuestions) {
    for (const [optionId, misconceptionId] of Object.entries(question.content.diagnosticOptionMap)) {
      assert.notEqual(optionId, question.content.correctOptionId);
      assert.ok(question.content.options.some((option) => option.id === optionId));
      assert.ok(
        getMisconceptionForLearningUnit("preserving-resetting-state", misconceptionId),
        `${question.id}: missing Preserve/Reset misconception ${misconceptionId}`,
      );
    }
  }

  const boundary = questions.find(
    (question) => question.id === "canonical-preserve-reset-boundary",
  );
  assert.equal(boundary.content.diagnosticOptionMap["key-shell"], "reset-boundary-too-high");
  assert.equal(boundary.content.diagnosticOptionMap["random-editor"], "random-key-is-reset-strategy");
});

test("Preserving / Resetting canonical session snapshots diagnostics outside the mutable bank", async () => {
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
  const questions = getCanonicalAssessmentQuestions("preserving-resetting-state");

  const session = await service.startSession({
    trusted: { learningUnitId: "preserving-resetting-state" },
    questionRecords: questions,
  });

  assert.equal(session.items.length, 5);
  assert.deepEqual(
    await repository.listQuestions({ learningUnitId: "preserving-resetting-state" }),
    [],
  );

  const boundary = session.items.find(
    (item) => item.questionId === "canonical-preserve-reset-boundary",
  ).snapshot;
  assert.equal(boundary.content.diagnosticOptionMap["key-shell"], "reset-boundary-too-high");

  const attempt = await service.submitAnswer({
    trusted: { learningUnitId: "preserving-resetting-state" },
    sessionId: session.id,
    questionId: boundary.id,
    answer: boundary.content.correctOptionId,
  });
  assert.equal(attempt.correct, true);
});
