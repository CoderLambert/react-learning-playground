import assert from "node:assert/strict";
import test from "node:test";

import { AgentRunner } from "../src/ai/agent/AgentRunner.js";
import { ToolExecutor } from "../src/ai/agent/ToolExecutor.js";
import { ToolPolicy } from "../src/ai/agent/ToolPolicy.js";
import { ToolRegistry } from "../src/ai/agent/ToolRegistry.js";
import {
  AGENT_ERROR_CODES,
  TOOL_POLICIES,
  createToolExecutionContext,
} from "../src/ai/agent/agentContracts.js";
import { MODEL_FINISH_REASONS, MODEL_TURN_EVENT_TYPES } from "../src/ai/providers/modelClient.js";

function context() {
  return createToolExecutionContext({
    learningUnitId: "unit-1",
    conversationId: "conversation-1",
    agentRunId: "run-1",
    contextSnapshotId: "snapshot-1",
    mutationId: "mutation-1",
    actor: { type: "ai_agent" },
  });
}

function registryWithEcho() {
  const registry = new ToolRegistry();
  registry.register({
    name: "echo",
    description: "Echo a value",
    policy: TOOL_POLICIES.QUERY,
    inputSchema: {
      type: "object",
      properties: { value: { type: "string" } },
      required: ["value"],
    },
    handler: async ({ value }, trustedContext) => ({ value, learningUnitId: trustedContext.learningUnitId }),
  });
  return registry;
}

test("tool registry exposes provider-neutral definitions without handlers", () => {
  const registry = registryWithEcho();
  const definitions = registry.modelDefinitions();
  assert.equal(definitions.length, 1);
  assert.deepEqual(definitions[0], {
    name: "echo",
    description: "Echo a value",
    inputSchema: {
      type: "object",
      properties: { value: { type: "string" } },
      required: ["value"],
    },
  });
  assert.equal("handler" in definitions[0], false);
});

test("tool executor validates arguments and preserves trusted context", async () => {
  const registry = registryWithEcho();
  const executor = new ToolExecutor({ registry, policy: new ToolPolicy() });
  const ok = await executor.execute({ id: "call-1", name: "echo", arguments: { value: "hello" } }, context());
  assert.equal(ok.ok, true);
  assert.deepEqual(ok.result, { value: "hello", learningUnitId: "unit-1" });

  const invalid = await executor.execute({ id: "call-2", name: "echo", arguments: {} }, context());
  assert.equal(invalid.ok, false);
  assert.equal(invalid.error.code, AGENT_ERROR_CODES.TOOL_ARGUMENTS_INVALID);
});

test("tool policy blocks destructive tools by default", async () => {
  const registry = new ToolRegistry();
  registry.register({
    name: "danger",
    policy: TOOL_POLICIES.DESTRUCTIVE,
    inputSchema: { type: "object" },
    handler: async () => ({ ok: true }),
  });
  const executor = new ToolExecutor({ registry, policy: new ToolPolicy() });
  const result = await executor.execute({ id: "call-1", name: "danger", arguments: {} }, context());
  assert.equal(result.ok, false);
  assert.equal(result.error.code, AGENT_ERROR_CODES.TOOL_FORBIDDEN);
});

test("agent runner executes a tool turn then continues with its result", async () => {
  const requests = [];
  const modelClient = {
    async *streamTurn(request) {
      requests.push(structuredClone(request));
      yield { type: MODEL_TURN_EVENT_TYPES.TURN_START };
      if (requests.length === 1) {
        yield { type: MODEL_TURN_EVENT_TYPES.TOOL_CALL, toolCall: { id: "call-1", name: "echo", arguments: { value: "hello" } } };
        yield { type: MODEL_TURN_EVENT_TYPES.TURN_COMPLETE, finishReason: MODEL_FINISH_REASONS.TOOL_CALLS };
      } else {
        yield { type: MODEL_TURN_EVENT_TYPES.TEXT_DELTA, text: "done" };
        yield { type: MODEL_TURN_EVENT_TYPES.TURN_COMPLETE, finishReason: MODEL_FINISH_REASONS.STOP };
      }
    },
  };
  const registry = registryWithEcho();
  const runner = new AgentRunner({
    modelClient,
    toolRegistry: registry,
    toolExecutor: new ToolExecutor({ registry, policy: new ToolPolicy() }),
  });
  const result = await runner.run({ messages: [{ role: "user", content: "go" }], context: context() });
  assert.equal(result.text, "done");
  assert.equal(result.steps, 2);
  assert.equal(requests[1].messages.at(-1).role, "tool");
  assert.match(requests[1].messages.at(-1).content, /unit-1/);
});

test("agent runner enforces max tool steps", async () => {
  const modelClient = {
    async *streamTurn() {
      yield { type: MODEL_TURN_EVENT_TYPES.TOOL_CALL, toolCall: { id: "loop", name: "echo", arguments: { value: "again" } } };
      yield { type: MODEL_TURN_EVENT_TYPES.TURN_COMPLETE, finishReason: MODEL_FINISH_REASONS.TOOL_CALLS };
    },
  };
  const registry = registryWithEcho();
  const runner = new AgentRunner({
    modelClient,
    toolRegistry: registry,
    toolExecutor: new ToolExecutor({ registry, policy: new ToolPolicy() }),
    maxSteps: 2,
  });
  await assert.rejects(
    () => runner.run({ messages: [{ role: "user", content: "loop" }], context: context() }),
    (error) => error.code === AGENT_ERROR_CODES.STEP_LIMIT_EXCEEDED,
  );
});

test("agent runner disables tools during compaction and never executes a returned tool call", async () => {
  const requests = [];
  const modelClient = {
    async *streamTurn(request) {
      requests.push(request);
      yield { type: MODEL_TURN_EVENT_TYPES.TURN_COMPLETE, finishReason: MODEL_FINISH_REASONS.STOP };
    },
  };
  const registry = registryWithEcho();
  let executions = 0;
  const executor = {
    async execute() {
      executions += 1;
      return { ok: true };
    },
  };
  const runner = new AgentRunner({
    modelClient,
    toolRegistry: registry,
    toolExecutor: executor,
  });

  await runner.run({
    purpose: "compaction",
    messages: [{ role: "user", content: "summarize" }],
    context: context(),
  });
  assert.deepEqual(requests[0].tools, []);
  assert.equal(Object.hasOwn(requests[0], "toolChoice"), false);
  assert.equal(executions, 0);

  const maliciousRunner = new AgentRunner({
    modelClient: {
      async *streamTurn() {
        yield {
          type: MODEL_TURN_EVENT_TYPES.TOOL_CALL,
          toolCall: { id: "unexpected", name: "echo", arguments: { value: "nope" } },
        };
        yield { type: MODEL_TURN_EVENT_TYPES.TURN_COMPLETE, finishReason: MODEL_FINISH_REASONS.TOOL_CALLS };
      },
    },
    toolRegistry: registry,
    toolExecutor: executor,
  });
  await assert.rejects(
    () => maliciousRunner.run({
      purpose: "compaction",
      messages: [{ role: "user", content: "summarize" }],
      context: context(),
    }),
    (error) => error.code === AGENT_ERROR_CODES.TOOL_FORBIDDEN,
  );
  assert.equal(executions, 0);
});
