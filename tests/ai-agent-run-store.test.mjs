import test from "node:test";
import assert from "node:assert/strict";

import {
  AgentRunStore,
  IndexedDbAgentRunStore,
  MemoryAgentRunStore,
  createAgentRunStore,
} from "../src/ai/agent/agentRunStore.js";
import { FakeIndexedDB } from "./assessment-repository-fake-indexeddb.mjs";

function run(id = "run-1", status = "running") {
  return { id, agentRunId: id, conversationId: "conversation-1", status, startedAt: "2026-09-12T00:00:00.000Z" };
}

function execution(id = "tool-1", agentRunId = "run-1") {
  return {
    id,
    agentRunId,
    toolCallId: id,
    toolName: "echo",
    status: "succeeded",
    startedAt: "2026-09-12T00:00:01.000Z",
    completedAt: "2026-09-12T00:00:02.000Z",
  };
}

test("memory agent run store persists run records and associated tool executions", async () => {
  const store = new MemoryAgentRunStore();
  await store.createRun(run());
  await store.saveToolExecution(execution());
  assert.equal((await store.getRun("run-1")).status, "running");
  assert.equal((await store.getRunWithExecutions("run-1")).toolExecutions.length, 1);
  assert.equal((await store.resume("run-1")).run.conversationId, "conversation-1");
});

test("legacy AgentRunStore alias remains a non-durable memory fallback", async () => {
  const store = new AgentRunStore();
  await store.createRun(run());
  assert.equal(store.mode, "memory");
  assert.equal((await store.getRun("run-1")).id, "run-1");
});

test("agent audit records survive a second IndexedDB adapter connection", async () => {
  const indexedDb = new FakeIndexedDB();
  const first = await createAgentRunStore({ indexedDb, dbName: "ai-audit-reopen", fallback: false });
  await first.createRun(run());
  await first.saveToolExecution(execution());
  const reopened = await createAgentRunStore({ indexedDb, dbName: "ai-audit-reopen", fallback: false });
  const value = await reopened.getRunWithExecutions("run-1");
  assert.equal(first.mode, "indexeddb");
  assert.equal(reopened.mode, "indexeddb");
  assert.equal(value.run.id, "run-1");
  assert.deepEqual(value.toolExecutions.map((item) => item.toolCallId), ["tool-1"]);
});

test("existing AI database migrates agent audit stores without deleting conversations", async () => {
  const indexedDb = new FakeIndexedDB();
  await new Promise((resolve, reject) => {
    const request = indexedDb.open("ai-audit-migration", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("conversations", { keyPath: "id" });
    request.onsuccess = resolve;
    request.onerror = () => reject(request.error);
  });
  const store = await createAgentRunStore({ indexedDb, dbName: "ai-audit-migration", fallback: false });
  assert.ok(store instanceof IndexedDbAgentRunStore);
  await store.createRun(run());
  assert.equal((await store.getRun("run-1")).status, "running");
  assert.equal(store.db.objectStoreNames.contains("conversations"), true);
  assert.equal(store.db.objectStoreNames.contains("agentRuns"), true);
  assert.equal(store.db.objectStoreNames.contains("toolExecutions"), true);
});

test("recoverInterruptedRuns turns stale runs into an explicit terminal state", async () => {
  const store = new MemoryAgentRunStore();
  await store.createRun(run("stale"));
  await store.createRun(run("done", "completed"));
  await store.saveToolExecution({ ...execution("stale-tool", "stale"), status: "running", completedAt: undefined });
  const recovered = await store.recoverInterruptedRuns({ timestamp: "2026-09-12T01:00:00.000Z" });
  assert.deepEqual(recovered.map((item) => item.id), ["stale"]);
  assert.equal((await store.getRun("stale")).status, "interrupted");
  assert.equal((await store.getRun("stale")).completedAt, "2026-09-12T01:00:00.000Z");
  assert.equal((await store.getRun("done")).status, "completed");
  assert.equal((await store.listToolExecutions("stale"))[0].status, "aborted");
});

test("agent audit factory explicitly reports its memory fallback", async () => {
  const store = await createAgentRunStore({ indexedDb: null });
  assert.equal(store.mode, "memory");
  assert.equal(store.fallbackReason, "IndexedDB is unavailable");
});
