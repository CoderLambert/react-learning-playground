import assert from "node:assert/strict";
import test from "node:test";

import { ToolExecutor } from "../src/ai/agent/ToolExecutor.js";
import { ToolPolicy } from "../src/ai/agent/ToolPolicy.js";
import { ToolRegistry } from "../src/ai/agent/ToolRegistry.js";
import { createToolExecutionContext } from "../src/ai/agent/agentContracts.js";
import { ASSESSMENT_ERROR_CODES, AssessmentError } from "../src/assessment/domain/assessmentErrors.js";
import {
  ASSESSMENT_TOOL_NAMES,
  createAssessmentToolDefinitions,
} from "../src/assessment/ai/assessmentTools.js";

function context(overrides = {}) {
  return createToolExecutionContext({
    learningUnitId: "unit-1",
    conversationId: "conversation-1",
    agentRunId: "run-1",
    contextSnapshotId: "snapshot-1",
    mutationId: "run-1:call-1",
    actor: { type: "ai_agent" },
    ...overrides,
  });
}

function createHarness(overrides = {}) {
  const calls = [];
  const service = {
    async listQuestions(input) {
      calls.push(["listQuestions", structuredClone(input)]);
      return [{ id: "q-1", learningUnitId: input.trusted.learningUnitId }];
    },
    async createQuestions(input) {
      calls.push(["createQuestions", structuredClone(input)]);
      return { result: input.questions, replayed: false };
    },
    async updateQuestion(input) {
      calls.push(["updateQuestion", structuredClone(input)]);
      return { result: { id: input.questionId, revision: input.expectedRevision + 1 }, replayed: false };
    },
    async retireQuestion(input) {
      calls.push(["retireQuestion", structuredClone(input)]);
      return { result: { id: input.questionId, status: "retired" }, replayed: false };
    },
    ...overrides,
  };
  const registry = new ToolRegistry();
  for (const definition of createAssessmentToolDefinitions({ assessmentService: service })) registry.register(definition);
  const executor = new ToolExecutor({ registry, policy: new ToolPolicy() });
  return { calls, service, registry, executor };
}

test("Assessment tool schemas expose business arguments only", () => {
  const { registry } = createHarness();
  assert.deepEqual(registry.modelDefinitions().map(({ name }) => name), [
    ASSESSMENT_TOOL_NAMES.LIST_QUESTIONS,
    ASSESSMENT_TOOL_NAMES.CREATE_QUESTIONS,
    ASSESSMENT_TOOL_NAMES.UPDATE_QUESTION,
    ASSESSMENT_TOOL_NAMES.RETIRE_QUESTION,
  ]);

  for (const definition of registry.modelDefinitions()) {
    const properties = Object.keys(definition.inputSchema.properties ?? {});
    assert.equal(properties.some((name) => /learningUnit|conversation|agentRun|toolCall|contextSnapshot|mutation|provenance|user|model/i.test(name)), false);
  }
});

test("create and list tools inject trusted scope and ignore forged model fields", async () => {
  const { calls, executor } = createHarness();
  const malicious = {
    learningUnitId: "another-unit",
    conversationId: "forged-conversation",
    agentRunId: "forged-run",
    mutationId: "forged-mutation",
    provenance: { source: "forged" },
    questions: [{
      type: "true_false",
      content: { prompt: "A statement", correct: true, explanation: "Explanation" },
      learningUnitId: "another-unit",
      provenance: { source: "forged" },
    }],
  };
  const created = await executor.execute({
    id: "call-1",
    name: ASSESSMENT_TOOL_NAMES.CREATE_QUESTIONS,
    arguments: malicious,
  }, context());
  assert.equal(created.ok, true);
  assert.deepEqual(calls[0][1].trusted, {
    learningUnitId: "unit-1",
    conversationId: "conversation-1",
    agentRunId: "run-1",
    contextSnapshotId: "snapshot-1",
    mutationId: "run-1:call-1",
    actor: { type: "ai_agent" },
  });
  assert.equal(calls[0][1].questions[0].learningUnitId, "another-unit");
  assert.deepEqual(calls[0][1].trusted.provenance, undefined);

  const listed = await executor.execute({
    id: "call-2",
    name: ASSESSMENT_TOOL_NAMES.LIST_QUESTIONS,
    arguments: { status: "active", learningUnitId: "another-unit", mutationId: "forged" },
  }, context());
  assert.equal(listed.ok, true);
  assert.equal(calls[1][1].trusted.learningUnitId, "unit-1");
  assert.equal(calls[1][1].status, "active");
});

test("update and retire tools pass only business args and trusted mutation identity", async () => {
  const { calls, executor } = createHarness();
  const forged = {
    questionId: "q-1",
    expectedRevision: 3,
    patch: { content: { prompt: "updated" }, learningUnitId: "another-unit", provenance: { source: "forged" } },
    learningUnitId: "another-unit",
    mutationId: "forged-mutation",
    conversationId: "forged-conversation",
  };
  const updated = await executor.execute({
    id: "call-3",
    name: ASSESSMENT_TOOL_NAMES.UPDATE_QUESTION,
    arguments: forged,
  }, context());
  assert.equal(updated.ok, true);
  assert.equal(calls[0][1].trusted.learningUnitId, "unit-1");
  assert.equal(calls[0][1].trusted.mutationId, "run-1:call-3");
  assert.equal(calls[0][1].questionId, "q-1");
  assert.deepEqual(calls[0][1].patch, forged.patch);

  const retired = await executor.execute({
    id: "call-4",
    name: ASSESSMENT_TOOL_NAMES.RETIRE_QUESTION,
    arguments: { questionId: "q-1", expectedRevision: 4, mutationId: "forged" },
  }, context());
  assert.equal(retired.ok, true);
  assert.equal(calls[1][1].trusted.learningUnitId, "unit-1");
  assert.equal(calls[1][1].trusted.mutationId, "run-1:call-4");
});

test("service errors become normalized failed tool results", async () => {
  const { executor } = createHarness({
    async retireQuestion() {
      throw new AssessmentError(ASSESSMENT_ERROR_CODES.REVISION_CONFLICT, "stale question");
    },
  });
  const result = await executor.execute({
    id: "call-5",
    name: ASSESSMENT_TOOL_NAMES.RETIRE_QUESTION,
    arguments: { questionId: "q-1", expectedRevision: 1 },
  }, context());
  assert.equal(result.ok, false);
  assert.equal(result.error.code, "TOOL_EXECUTION_FAILED");
  assert.match(result.error.message, /stale question/);
});
