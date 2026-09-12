import test from "node:test";
import assert from "node:assert/strict";
import { AgentRunStore } from "../src/ai/agent/agentRunStore.js";

test("agent run store persists and resumes tool executions", () => {
  const store = new AgentRunStore();
  store.createRun({ id: "run-1", agentRunId: "run-1" });
  store.saveToolExecution({ id: "tool-1", agentRunId: "run-1", status: "completed" });

  assert.equal(store.getRun("run-1").status, "running");
  assert.equal(store.resume("run-1").toolExecutions.length, 1);
});
