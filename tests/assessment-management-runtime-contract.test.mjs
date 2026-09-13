import assert from "node:assert/strict";
import test from "node:test";
import { AssessmentService } from "../src/assessment/application/AssessmentService.js";
import { MemoryAssessmentRepository } from "../src/assessment/infrastructure/index.js";

function createService() {
  let nextId = 0;
  const repository = new MemoryAssessmentRepository();
  const service = new AssessmentService({
    repository,
    clock: () => "2026-09-13T00:00:00.000Z",
    idFactory: (prefix) => `${prefix}_${++nextId}`,
  });
  return { service, repository };
}

function trusted(learningUnitId, mutationId) {
  return {
    learningUnitId,
    mutationId,
    actor: { type: "application" },
    provenance: { source: "assessment_manager" },
  };
}

const draft = {
  type: "single_choice",
  difficulty: "medium",
  conceptTags: ["state"],
  content: {
    prompt: "旧题干",
    explanation: "旧解释",
    options: [{ id: "a", text: "A" }, { id: "b", text: "B" }],
    correctOptionId: "a",
  },
};

test("editing the bank does not mutate an in-progress session snapshot", async () => {
  const { service, repository } = createService();
  const learningUnitId = "unit-state";
  await service.createQuestions({ trusted: trusted(learningUnitId, "create-1"), questions: [draft] });
  const [question] = await repository.listQuestions({ learningUnitId, status: "active" });
  const session = await service.startSession({ trusted: { learningUnitId } });

  await service.updateQuestion({
    trusted: trusted(learningUnitId, "update-1"),
    questionId: question.id,
    expectedRevision: question.revision,
    patch: { content: { prompt: "新题干" } },
  });

  const latest = await repository.getQuestion({ learningUnitId, questionId: question.id });
  assert.equal(latest.content.prompt, "新题干");
  assert.equal(latest.revision, 2);
  assert.equal(session.items[0].snapshot.content.prompt, "旧题干");
  assert.equal(session.items[0].revision, 1);
});

test("retiring a question keeps existing session snapshot and excludes future sessions", async () => {
  const { service, repository } = createService();
  const learningUnitId = "unit-retire";
  await service.createQuestions({ trusted: trusted(learningUnitId, "create-2"), questions: [draft] });
  const [question] = await repository.listQuestions({ learningUnitId, status: "active" });
  const existing = await service.startSession({ trusted: { learningUnitId } });

  await service.retireQuestion({
    trusted: trusted(learningUnitId, "retire-1"),
    questionId: question.id,
    expectedRevision: question.revision,
  });

  assert.equal(existing.items[0].snapshot.content.prompt, "旧题干");
  const retired = await repository.getQuestion({ learningUnitId, questionId: question.id });
  assert.equal(retired.status, "retired");
  await assert.rejects(() => service.startSession({ trusted: { learningUnitId } }), /at least one active question/);
});

test("stale expectedRevision is rejected", async () => {
  const { service, repository } = createService();
  const learningUnitId = "unit-conflict";
  await service.createQuestions({ trusted: trusted(learningUnitId, "create-3"), questions: [draft] });
  const [question] = await repository.listQuestions({ learningUnitId, status: "active" });
  await service.updateQuestion({ trusted: trusted(learningUnitId, "update-2"), questionId: question.id, expectedRevision: 1, patch: { difficulty: "hard" } });
  await assert.rejects(
    () => service.updateQuestion({ trusted: trusted(learningUnitId, "update-3"), questionId: question.id, expectedRevision: 1, patch: { difficulty: "easy" } }),
    (error) => error?.code === "REVISION_CONFLICT",
  );
});
