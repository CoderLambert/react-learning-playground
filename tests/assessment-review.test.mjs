import assert from "node:assert/strict";
import test from "node:test";

import { createAssessmentRuntime } from "../src/assessment/composition/assessmentRuntime.js";

function question(prompt, correctOptionId = "a") {
  return {
    type: "single_choice",
    content: {
      prompt,
      options: [
        { id: "a", text: "A" },
        { id: "b", text: "B" },
      ],
      correctOptionId,
      explanation: `Explain ${prompt}`,
    },
    difficulty: "medium",
    conceptTags: ["review"],
  };
}

async function createRuntime() {
  let sequence = 0;
  return createAssessmentRuntime({
    indexedDb: undefined,
    clock: () => "2026-09-14T08:00:00.000Z",
    idFactory: (prefix) => `${prefix}-${++sequence}`,
  });
}

async function seedQuestions(runtime, learningUnitId, questions, mutationId) {
  await runtime.service.createQuestions({
    trusted: {
      learningUnitId,
      mutationId,
      actor: { type: "application" },
      provenance: { source: "assessment-review-test" },
    },
    questions,
  });
}

test("completed review is learning-unit scoped, snapshot-based, and wrong-first", async () => {
  const runtime = await createRuntime();
  assert.equal(runtime.mode, "memory");
  assert.match(runtime.storageNotice, /本次会话存储/);

  await seedQuestions(runtime, "unit-a", [question("Historical prompt A"), question("Historical prompt B")], "seed-a");
  await seedQuestions(runtime, "unit-b", [question("Other unit prompt")], "seed-b");

  const sessionA = await runtime.sessionLifecycle.start({ learningUnitId: "unit-a" });
  await runtime.service.updateQuestion({
    trusted: {
      learningUnitId: "unit-a",
      mutationId: "mutate-current-bank",
      actor: { type: "application" },
      provenance: { source: "assessment-review-test" },
    },
    questionId: sessionA.items[0].questionId,
    expectedRevision: 1,
    patch: { content: { prompt: "Current-bank prompt changed after session start" } },
  });

  await runtime.sessionLifecycle.submit({
    learningUnitId: "unit-a",
    sessionId: sessionA.id,
    questionId: sessionA.items[0].questionId,
    answer: "a",
  });
  await runtime.sessionLifecycle.submit({
    learningUnitId: "unit-a",
    sessionId: sessionA.id,
    questionId: sessionA.items[1].questionId,
    answer: "b",
  });

  const sessionB = await runtime.sessionLifecycle.start({ learningUnitId: "unit-b" });
  await runtime.sessionLifecycle.submit({
    learningUnitId: "unit-b",
    sessionId: sessionB.id,
    questionId: sessionB.items[0].questionId,
    answer: "a",
  });

  const historyA = await runtime.sessionLifecycle.listCompletedReviews({ learningUnitId: "unit-a" });
  assert.equal(historyA.length, 1);
  assert.equal(historyA[0].learningUnitId, "unit-a");
  assert.equal(historyA[0].incorrectCount, 1);
  assert.equal(historyA[0].correctCount, 1);
  assert.equal(historyA[0].items[0].correct, false, "wrong answers are ordered first");

  const historicalPrompt = historyA[0].items.find((item) => item.questionId === sessionA.items[0].questionId).snapshot.content.prompt;
  assert.equal(historicalPrompt, "Historical prompt A", "review must use the session snapshot instead of the current question revision");

  const historyB = await runtime.sessionLifecycle.listCompletedReviews({ learningUnitId: "unit-b" });
  assert.equal(historyB.length, 1);
  assert.equal(historyB[0].learningUnitId, "unit-b");
  assert.notEqual(historyB[0].sessionId, historyA[0].sessionId);

  assert.equal(await runtime.sessionLifecycle.review({ learningUnitId: "unit-b", sessionId: sessionA.id }), null, "cross-unit session review must fail closed");
});
