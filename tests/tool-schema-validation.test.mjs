import assert from "node:assert/strict";
import test from "node:test";

import { ToolExecutor } from "../src/ai/agent/ToolExecutor.js";
import { ToolPolicy } from "../src/ai/agent/ToolPolicy.js";
import { ToolRegistry } from "../src/ai/agent/ToolRegistry.js";
import { TOOL_POLICIES, createToolExecutionContext } from "../src/ai/agent/agentContracts.js";
import {
  ASSESSMENT_TOOL_NAMES,
  createAssessmentToolDefinitions,
} from "../src/assessment/ai/assessmentTools.js";

function context() {
  return createToolExecutionContext({
    learningUnitId: "unit-1",
    conversationId: "conversation-1",
    agentRunId: "run-1",
    contextSnapshotId: "snapshot-1",
    mutationId: "run-1:runtime",
    actor: { type: "ai_agent" },
  });
}

function draft(type = "single_choice") {
  if (type === "true_false") {
    return {
      type,
      content: { prompt: "Props are immutable.", correct: true, explanation: "They are inputs." },
      difficulty: "medium",
      conceptTags: ["props"],
      evidenceRefs: [{ kind: "source", fileName: "Props.jsx", startLine: 1, endLine: 4 }],
    };
  }
  return {
    type,
    content: {
      prompt: "Which is immutable?",
      options: [{ id: "a", text: "Props" }, { id: "b", text: "State" }],
      correctOptionId: "a",
      explanation: "Props are inputs.",
    },
    difficulty: "easy",
    conceptTags: ["props"],
    evidenceRefs: [{ kind: "source", fileName: "Props.jsx", startLine: 1, endLine: 4 }],
  };
}

function assessmentHarness() {
  const received = [];
  const service = {
    listQuestions: async (input) => input,
    createQuestions: async (input) => { received.push(input); return input; },
    updateQuestion: async (input) => { received.push(input); return input; },
    retireQuestion: async (input) => { received.push(input); return input; },
  };
  const registry = new ToolRegistry();
  for (const tool of createAssessmentToolDefinitions({ assessmentService: service })) registry.register(tool);
  return { executor: new ToolExecutor({ registry, policy: new ToolPolicy() }), received };
}

async function executeCreate(executor, questions) {
  return executor.execute({
    id: "call-1",
    name: ASSESSMENT_TOOL_NAMES.CREATE_QUESTIONS,
    arguments: { questions },
  }, context());
}

test("Ajv validation accepts complete single-choice and true-false question drafts", async () => {
  const { executor, received } = assessmentHarness();
  const result = await executeCreate(executor, [draft(), draft("true_false")]);
  assert.equal(result.ok, true);
  assert.equal(received.length, 1);
});

test("Ajv validation enforces nested additionalProperties and question shapes", async () => {
  const { executor } = assessmentHarness();
  const unknownOptionProperty = draft();
  unknownOptionProperty.content.options[0].trusted = "forged";
  const invalidContent = draft();
  invalidContent.content.correct = true;
  const tooFewOptions = draft();
  tooFewOptions.content.options = [tooFewOptions.content.options[0]];
  const nonBooleanTruth = draft("true_false");
  nonBooleanTruth.content.correct = "true";

  for (const payload of [unknownOptionProperty, invalidContent, tooFewOptions, nonBooleanTruth]) {
    const result = await executeCreate(executor, [payload]);
    assert.equal(result.ok, false);
    assert.equal(result.error.code, "TOOL_ARGUMENTS_INVALID");
  }
});

test("Ajv validation enforces string, revision, immutable type, and patch constraints", async () => {
  const { executor } = assessmentHarness();
  const blankPrompt = draft();
  blankPrompt.content.prompt = "   ";
  const malformedUpdate = {
    id: "update-1",
    name: ASSESSMENT_TOOL_NAMES.UPDATE_QUESTION,
    arguments: {
      questionId: "q-1",
      expectedRevision: 0,
      patch: { content: { prompt: "updated", unknown: true } },
    },
  };
  const typeMutation = {
    id: "update-type",
    name: ASSESSMENT_TOOL_NAMES.UPDATE_QUESTION,
    arguments: {
      questionId: "q-1",
      expectedRevision: 1,
      patch: { type: "true_false" },
    },
  };

  const invalidQuestion = await executeCreate(executor, [blankPrompt]);
  assert.equal(invalidQuestion.error.code, "TOOL_ARGUMENTS_INVALID");
  const invalidUpdate = await executor.execute(malformedUpdate, context());
  assert.equal(invalidUpdate.error.code, "TOOL_ARGUMENTS_INVALID");
  const invalidTypeMutation = await executor.execute(typeMutation, context());
  assert.equal(invalidTypeMutation.error.code, "TOOL_ARGUMENTS_INVALID");
});

test("compiled schemas are cached per registered schema", async () => {
  let compilations = 0;
  const schemaValidator = {
    compile(_schema) {
      compilations += 1;
      const validate = (value) => typeof value?.value === "string";
      validate.errors = [];
      return validate;
    },
  };
  const registry = new ToolRegistry();
  registry.register({
    name: "cached",
    policy: TOOL_POLICIES.QUERY,
    inputSchema: { type: "object", properties: { value: { type: "string" } }, required: ["value"] },
    handler: async () => "ok",
  });
  const executor = new ToolExecutor({ registry, policy: new ToolPolicy(), schemaValidator });
  await executor.execute({ id: "cache-1", name: "cached", arguments: { value: "a" } }, context());
  await executor.execute({ id: "cache-2", name: "cached", arguments: { value: "b" } }, context());
  assert.equal(compilations, 1);
});
