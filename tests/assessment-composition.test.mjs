import assert from "node:assert/strict";
import test from "node:test";

import { MODEL_FINISH_REASONS, MODEL_TURN_EVENT_TYPES } from "../src/ai/providers/modelClient.js";
import { createAssessmentRuntime } from "../src/assessment/composition/assessmentRuntime.js";

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
