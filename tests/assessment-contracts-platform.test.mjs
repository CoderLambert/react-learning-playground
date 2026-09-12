import assert from "node:assert/strict";
import test from "node:test";

import { createFixedClock } from "../src/platform/clock.js";
import { createId } from "../src/platform/ids.js";
import { ASSESSMENT_ERROR_CODES, AssessmentError } from "../src/assessment/domain/assessmentErrors.js";
import { assertQuestionDraft, assertQuestionRecord } from "../src/assessment/domain/question.js";
import { createSessionItem, assertAssessmentSession } from "../src/assessment/domain/assessmentSession.js";
import { evaluateQuestionAnswer, assertAttempt } from "../src/assessment/domain/attempt.js";
import { assertAssessmentRepository } from "../src/assessment/application/assessmentPorts.js";
import { createToolExecutionContext, createToolResult } from "../src/ai/agent/agentContracts.js";

function createChoiceQuestion() {
  return {
    id: "q_1",
    learningUnitId: "state-reducer",
    type: "single_choice",
    content: {
      prompt: "Which is correct?",
      options: [{ id: "a", text: "A" }, { id: "b", text: "B" }],
      correctOptionId: "b",
      explanation: "Because B",
    },
    difficulty: "medium",
    conceptTags: ["useReducer"],
    evidenceRefs: [{ kind: "source", fileName: "Demo.jsx", startLine: 1, endLine: 3 }],
    status: "active",
    revision: 1,
    provenance: { source: "ai" },
    createdAt: "2026-09-12T00:00:00.000Z",
    updatedAt: "2026-09-12T00:00:00.000Z",
  };
}

test("platform ids and fixed clocks are deterministic with injected dependencies", () => {
  assert.equal(createId("q", { randomUUID: () => "abc" }), "q_abc");
  assert.equal(createFixedClock("2026-09-12T00:00:00Z").nowIso(), "2026-09-12T00:00:00.000Z");
});

test("question discriminated union validates choice and true-false invariants", () => {
  const question = createChoiceQuestion();
  assert.equal(assertQuestionRecord(question), question);
  assert.throws(
    () => assertQuestionDraft({ ...question, content: { ...question.content, correctOptionId: "missing" } }),
    (error) => error instanceof AssessmentError && error.code === ASSESSMENT_ERROR_CODES.INVALID_QUESTION,
  );
  assert.doesNotThrow(() => assertQuestionDraft({
    type: "true_false",
    content: { prompt: "True?", correct: false, explanation: "No" },
  }));
});

test("session items preserve question revision snapshots", () => {
  const question = createChoiceQuestion();
  const item = createSessionItem(question);
  question.content.prompt = "mutated after snapshot";
  assert.equal(item.snapshot.content.prompt, "Which is correct?");
  assert.doesNotThrow(() => assertAssessmentSession({
    id: "s_1",
    learningUnitId: "state-reducer",
    items: [item],
    status: "in_progress",
    startedAt: "2026-09-12T00:00:00.000Z",
    completedAt: null,
  }));
});

test("attempt evaluation uses the supplied snapshot", () => {
  const snapshot = createChoiceQuestion();
  assert.equal(evaluateQuestionAnswer(snapshot, "b"), true);
  assert.equal(evaluateQuestionAnswer(snapshot, "a"), false);
  assert.doesNotThrow(() => assertAttempt({
    id: "a_1",
    sessionId: "s_1",
    questionId: "q_1",
    questionRevision: 1,
    answer: "b",
    correct: true,
    submittedAt: "2026-09-12T00:01:00.000Z",
  }));
});

test("repository port rejects incomplete adapters", () => {
  assert.throws(() => assertAssessmentRepository({ listQuestions() {} }), /getQuestion/);
});

test("trusted tool execution scope is separate from model arguments", () => {
  const context = createToolExecutionContext({
    learningUnitId: "state-reducer",
    conversationId: "c_1",
    agentRunId: "run_1",
    contextSnapshotId: "ctx_1",
    mutationId: "run_1:call_1",
    actor: { type: "ai", model: "test-model" },
  });
  assert.equal(context.learningUnitId, "state-reducer");
  assert.deepEqual(createToolResult({
    toolCallId: "call_1",
    toolName: "assessment_create_questions",
    ok: true,
    result: { createdQuestionIds: ["q_1"] },
  }), {
    toolCallId: "call_1",
    toolName: "assessment_create_questions",
    ok: true,
    result: { createdQuestionIds: ["q_1"] },
  });
});
