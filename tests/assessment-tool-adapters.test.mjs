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

function singleChoiceDraft() {
  return {
    type: "single_choice",
    content: {
      prompt: "Which value is immutable?",
      options: [{ id: "a", text: "Props" }, { id: "b", text: "State" }],
      correctOptionId: "a",
      explanation: "Props are inputs.",
    },
    difficulty: "easy",
    conceptTags: ["props"],
    evidenceRefs: [{ kind: "source", fileName: "Props.jsx", startLine: 1, endLine: 3 }],
  };
}

function trueFalseDraft() {
  return {
    type: "true_false",
    content: {
      prompt: "Props are read-only.",
      correct: true,
      explanation: "Components do not mutate their props.",
    },
    difficulty: "medium",
    conceptTags: ["props"],
    evidenceRefs: [],
  };
}

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

  const createTool = registry.get(ASSESSMENT_TOOL_NAMES.CREATE_QUESTIONS);
  const providerDefinition = registry.modelDefinitions().find(({ name }) => name === createTool.name);
  assert.strictEqual(providerDefinition.inputSchema, createTool.inputSchema);
});

test("create and list tools inject trusted scope after valid model arguments", async () => {
  const { calls, executor } = createHarness();
  const created = await executor.execute({
    id: "call-1",
    name: ASSESSMENT_TOOL_NAMES.CREATE_QUESTIONS,
    arguments: { questions: [singleChoiceDraft(), trueFalseDraft()] },
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
  assert.deepEqual(calls[0][1].questions, [singleChoiceDraft(), trueFalseDraft()]);
  assert.deepEqual(calls[0][1].trusted.provenance, undefined);

  const listed = await executor.execute({
    id: "call-2",
    name: ASSESSMENT_TOOL_NAMES.LIST_QUESTIONS,
    arguments: { status: "active" },
  }, context());
  assert.equal(listed.ok, true);
  assert.equal(calls[1][1].trusted.learningUnitId, "unit-1");
  assert.equal(calls[1][1].status, "active");
});

test("update and retire tools pass only business args and trusted mutation identity", async () => {
  const { calls, executor } = createHarness();
  const valid = {
    questionId: "q-1",
    expectedRevision: 3,
    patch: { content: { prompt: "updated" } },
  };
  const updated = await executor.execute({
    id: "call-3",
    name: ASSESSMENT_TOOL_NAMES.UPDATE_QUESTION,
    arguments: valid,
  }, context());
  assert.equal(updated.ok, true);
  assert.equal(calls[0][1].trusted.learningUnitId, "unit-1");
  assert.equal(calls[0][1].trusted.mutationId, "run-1:call-3");
  assert.equal(calls[0][1].questionId, "q-1");
  assert.deepEqual(calls[0][1].patch, valid.patch);

  const retired = await executor.execute({
    id: "call-4",
    name: ASSESSMENT_TOOL_NAMES.RETIRE_QUESTION,
    arguments: { questionId: "q-1", expectedRevision: 4 },
  }, context());
  assert.equal(retired.ok, true);
  assert.equal(calls[1][1].trusted.learningUnitId, "unit-1");
  assert.equal(calls[1][1].trusted.mutationId, "run-1:call-4");
});

test("runtime schema rejects model-forged trusted fields at every depth", async () => {
  const { executor, calls } = createHarness();
  const topLevel = await executor.execute({
    id: "forged-top-level",
    name: ASSESSMENT_TOOL_NAMES.CREATE_QUESTIONS,
    arguments: { questions: [singleChoiceDraft()], learningUnitId: "forged", mutationId: "forged" },
  }, context());
  assert.equal(topLevel.ok, false);
  assert.equal(topLevel.error.code, "TOOL_ARGUMENTS_INVALID");

  const nested = singleChoiceDraft();
  nested.provenance = { source: "forged" };
  const nestedResult = await executor.execute({
    id: "forged-nested",
    name: ASSESSMENT_TOOL_NAMES.CREATE_QUESTIONS,
    arguments: { questions: [nested] },
  }, context());
  assert.equal(nestedResult.ok, false);
  assert.equal(nestedResult.error.code, "TOOL_ARGUMENTS_INVALID");

  const patch = await executor.execute({
    id: "forged-patch",
    name: ASSESSMENT_TOOL_NAMES.UPDATE_QUESTION,
    arguments: {
      questionId: "q-1",
      expectedRevision: 1,
      patch: { provenance: { source: "forged" } },
    },
  }, context());
  assert.equal(patch.ok, false);
  assert.equal(patch.error.code, "TOOL_ARGUMENTS_INVALID");
  assert.equal(calls.length, 0);
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
