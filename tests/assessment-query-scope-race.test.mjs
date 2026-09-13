import assert from "node:assert/strict";
import test from "node:test";

import { AssessmentService } from "../src/assessment/application/AssessmentService.js";
import { MemoryAssessmentRepository } from "../src/assessment/infrastructure/index.js";
import { createAssessmentQueryStore } from "../src/assessment/store/AssessmentQueryStore.js";

const TIMESTAMP = "2026-09-13T00:00:00.000Z";

function questionDraft(prompt) {
  return {
    type: "single_choice",
    content: {
      prompt,
      options: [{ id: "a", text: "A" }, { id: "b", text: "B" }],
      correctOptionId: "a",
      explanation: "A is correct",
    },
    difficulty: "medium",
    conceptTags: ["scope"],
    evidenceRefs: [],
  };
}

function deferred() {
  let resolve;
  const promise = new Promise((done) => { resolve = done; });
  return { promise, resolve };
}

function createService({ repository, queryStore }) {
  let nextId = 0;
  return new AssessmentService({
    repository,
    queryStore,
    clock: () => TIMESTAMP,
    idFactory: (prefix) => `${prefix}-${++nextId}`,
  });
}

function trusted(learningUnitId, mutationId) {
  return {
    learningUnitId,
    mutationId,
    actor: { type: "application" },
    provenance: { source: "assessment_manager" },
  };
}

test("question mutation can seed an initially empty query store", async () => {
  const repository = new MemoryAssessmentRepository();
  const queryStore = createAssessmentQueryStore();
  const service = createService({ repository, queryStore });

  await service.createQuestions({
    trusted: trusted("unit-a", "create-a-1"),
    questions: [questionDraft("A1")],
  });

  const snapshot = queryStore.getSnapshot();
  assert.equal(snapshot.learningUnitId, "unit-a");
  assert.equal(snapshot.questions.length, 1);
  assert.equal(snapshot.questions[0].content.prompt, "A1");
});

test("an old-unit mutation refresh cannot steal a newer active query scope", async () => {
  const repository = new MemoryAssessmentRepository();
  const queryStore = createAssessmentQueryStore({ learningUnitId: "unit-a", questions: [] });
  const service = createService({ repository, queryStore });

  const realListQuestions = repository.listQuestions.bind(repository);
  const refreshStarted = deferred();
  const releaseRefresh = deferred();
  let delayNextUnitARefresh = true;
  repository.listQuestions = async (query) => {
    if (delayNextUnitARefresh && query.learningUnitId === "unit-a") {
      delayNextUnitARefresh = false;
      refreshStarted.resolve();
      await releaseRefresh.promise;
    }
    return realListQuestions(query);
  };

  const mutation = service.createQuestions({
    trusted: trusted("unit-a", "create-a-race"),
    questions: [questionDraft("late A question")],
  });

  await refreshStarted.promise;
  const unitBSnapshot = { learningUnitId: "unit-b", questions: [{ id: "b-visible" }] };
  queryStore.replaceSnapshot(unitBSnapshot);
  releaseRefresh.resolve();
  await mutation;

  assert.equal(queryStore.getSnapshot(), unitBSnapshot);
  assert.equal(queryStore.getSnapshot().learningUnitId, "unit-b");
});
