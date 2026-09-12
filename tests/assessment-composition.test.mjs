import assert from "node:assert/strict";
import test from "node:test";

import { MODEL_FINISH_REASONS, MODEL_TURN_EVENT_TYPES } from "../src/ai/providers/modelClient.js";
import { createAssessmentRuntime } from "../src/assessment/composition/assessmentRuntime.js";
import { createLearningUnitEvidenceResolver } from "../src/assessment/composition/learningUnitEvidenceResolver.js";

const choiceDraft = (prompt, evidenceRefs = []) => ({
  type: "single_choice",
  content: {
    prompt,
    options: [{ id: "a", text: "A" }, { id: "b", text: "B" }],
    correctOptionId: "b",
    explanation: "B is correct",
  },
  difficulty: "easy",
  conceptTags: ["composition"],
  evidenceRefs,
});

test("assessment composition falls back to session-only memory and registers tools", async () => {
  const runtime = await createAssessmentRuntime({ indexedDb: undefined });

  assert.equal(runtime.mode, "memory");
  assert.match(runtime.storageNotice, /本次会话存储/);
  assert.deepEqual(runtime.registry.list().map((tool) => tool.name), [
    "assessment_list_questions",
    "assessment_create_questions",
    "assessment_update_question",
    "assessment_retire_question",
  ]);
  assert.equal(runtime.queryStore.getSnapshot(), null);
});

test("assessment composition creates a generic AgentRunner over the wired tool registry", async () => {
  const runtime = await createAssessmentRuntime({ indexedDb: undefined });
  const requests = [];
  const runner = runtime.createAgentRunner({
    async *streamTurn(request) {
      requests.push(request);
      yield { type: MODEL_TURN_EVENT_TYPES.TEXT_DELTA, text: "ready" };
      yield { type: MODEL_TURN_EVENT_TYPES.TURN_COMPLETE, finishReason: MODEL_FINISH_REASONS.STOP };
    },
  });

  const result = await runner.run({
    messages: [{ role: "user", content: "hello" }],
    context: {
      learningUnitId: "unit-1",
      conversationId: "conversation-1",
      agentRunId: "run-1",
      contextSnapshotId: "snapshot-1",
      mutationId: "run-1:runtime",
      actor: { type: "ai_agent" },
    },
  });

  assert.equal(result.text, "ready");
  assert.equal(requests[0].tools.length, 4);
  assert.equal(requests[0].tools.some((tool) => tool.name === "assessment_create_questions"), true);
});

test("production learning-unit source resolver rejects foreign files and out-of-range lines", async () => {
  const resolver = createLearningUnitEvidenceResolver({
    getLearningUnit: (id) => id === "unit-1"
      ? { id, sources: [{ name: "Demo.jsx", code: "line one\nline two\nline three" }] }
      : null,
  });

  assert.deepEqual(
    await resolver({ kind: "source", fileName: "Demo.jsx", startLine: 1, endLine: 3 }, { learningUnitId: "unit-1" }),
    { learningUnitId: "unit-1", fileName: "Demo.jsx", lineCount: 3 },
  );
  await assert.rejects(
    resolver({ kind: "source", fileName: "Other.jsx", startLine: 1, endLine: 1 }, { learningUnitId: "unit-1" }),
    { code: "INVALID_EVIDENCE" },
  );
  await assert.rejects(
    resolver({ kind: "source", fileName: "Demo.jsx", startLine: 3, endLine: 4 }, { learningUnitId: "unit-1" }),
    { code: "INVALID_EVIDENCE" },
  );
});

test("production composition fails closed before persisting invalid source evidence", async () => {
  const evidenceResolver = createLearningUnitEvidenceResolver({
    getLearningUnit: (id) => id === "unit-1"
      ? { id, sources: [{ name: "Demo.jsx", code: "one\ntwo" }] }
      : null,
  });
  const runtime = await createAssessmentRuntime({ indexedDb: undefined, evidenceResolver });
  await assert.rejects(
    runtime.service.createQuestions({
      trusted: { learningUnitId: "unit-1", mutationId: "bad-evidence" },
      questions: [choiceDraft("bad evidence", [{ kind: "source", fileName: "Demo.jsx", startLine: 1, endLine: 3 }])],
    }),
    { code: "INVALID_EVIDENCE" },
  );
  assert.deepEqual(await runtime.service.listQuestions({ trusted: { learningUnitId: "unit-1" } }), []);
});

test("composition session facade recovers the first unanswered snapshot without exposing repository access to UI", async () => {
  const runtime = await createAssessmentRuntime({ indexedDb: undefined });
  await runtime.service.createQuestions({
    trusted: { learningUnitId: "unit-1", mutationId: "seed" },
    questions: [choiceDraft("first"), choiceDraft("second")],
  });
  const session = await runtime.sessionLifecycle.start({ learningUnitId: "unit-1" });
  await runtime.sessionLifecycle.submit({
    learningUnitId: "unit-1",
    sessionId: session.id,
    questionId: session.items[0].questionId,
    answer: "a",
  });

  const recovered = await runtime.sessionLifecycle.recover({ learningUnitId: "unit-1" });
  assert.equal(recovered.session.id, session.id);
  assert.equal(recovered.currentIndex, 1);
  assert.equal(recovered.attempts.length, 1);
  assert.deepEqual(recovered.session.items, session.items);
});
