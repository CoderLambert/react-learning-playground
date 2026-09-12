import { sanitizePersistedMetadata, openIndexedDb } from "../storage/conversationStore.js";
import { AGENT_RUN_STATUSES, TOOL_EXECUTION_STATUSES } from "./agentContracts.js";

function clone(value) {
  return value == null ? value : structuredClone(value);
}

function requiredText(value, label) {
  if (typeof value !== "string" || !value.trim()) throw new TypeError(`${label} is required`);
  return value;
}

function requestToPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed"));
  });
}

function normalizeRun(run) {
  if (!run || typeof run !== "object" || Array.isArray(run)) throw new TypeError("run is required");
  const id = requiredText(run.id, "run id");
  return {
    ...sanitizePersistedMetadata(run),
    id,
    agentRunId: requiredText(run.agentRunId ?? id, "agentRunId"),
    status: run.status ?? AGENT_RUN_STATUSES.RUNNING,
  };
}

function normalizeExecution(execution) {
  if (!execution || typeof execution !== "object" || Array.isArray(execution)) throw new TypeError("tool execution is required");
  return {
    ...sanitizePersistedMetadata(execution),
    id: requiredText(execution.id, "tool execution id"),
    agentRunId: requiredText(execution.agentRunId, "tool execution agentRunId"),
    toolCallId: requiredText(execution.toolCallId, "tool execution toolCallId"),
    toolName: requiredText(execution.toolName, "tool execution toolName"),
    status: execution.status ?? TOOL_EXECUTION_STATUSES.RUNNING,
  };
}

function interruptedPatch(timestamp) {
  return {
    status: AGENT_RUN_STATUSES.INTERRUPTED,
    completedAt: timestamp,
    error: { code: "INTERRUPTED", message: "Agent run was interrupted before completion" },
  };
}

function interruptedExecutionPatch(timestamp) {
  return {
    status: TOOL_EXECUTION_STATUSES.ABORTED,
    completedAt: timestamp,
    error: { code: "INTERRUPTED", message: "Tool execution was interrupted before completion" },
  };
}

/** In-memory fallback for the agent audit port; it is intentionally not durable. */
export class MemoryAgentRunStore {
  constructor() {
    this.runs = new Map();
    this.toolExecutions = new Map();
    this.mode = "memory";
  }

  async createRun(run) {
    const value = normalizeRun(run);
    this.runs.set(value.id, clone(value));
    return clone(value);
  }

  async updateRun(id, patch) {
    const current = this.runs.get(id);
    if (!current) return null;
    const next = normalizeRun({ ...current, ...sanitizePersistedMetadata(patch), id });
    this.runs.set(id, clone(next));
    return clone(next);
  }

  async getRun(id) {
    return clone(this.runs.get(id) ?? null);
  }

  async saveToolExecution(execution) {
    const value = normalizeExecution(execution);
    this.toolExecutions.set(value.id, clone(value));
    return clone(value);
  }

  async listToolExecutions(agentRunId) {
    return [...this.toolExecutions.values()]
      .filter((item) => item.agentRunId === agentRunId)
      .sort((a, b) => (a.startedAt ?? "").localeCompare(b.startedAt ?? "") || a.id.localeCompare(b.id))
      .map(clone);
  }

  async getRunWithExecutions(agentRunId) {
    const run = await this.getRun(agentRunId);
    if (!run) return null;
    return { run, toolExecutions: await this.listToolExecutions(agentRunId) };
  }

  async resume(agentRunId) {
    return this.getRunWithExecutions(agentRunId);
  }

  async recoverInterruptedRuns({ timestamp = new Date().toISOString() } = {}) {
    const recovered = [];
    for (const run of this.runs.values()) {
      if (run.status !== AGENT_RUN_STATUSES.RUNNING) continue;
      for (const execution of this.toolExecutions.values()) {
        if (execution.agentRunId === run.id && execution.status === TOOL_EXECUTION_STATUSES.RUNNING) {
          await this.saveToolExecution({ ...execution, ...interruptedExecutionPatch(timestamp) });
        }
      }
      recovered.push(await this.updateRun(run.id, interruptedPatch(timestamp)));
    }
    return recovered;
  }

  close() {}
}

/** Durable implementation backed by the react-learning-ai IndexedDB. */
export class IndexedDbAgentRunStore {
  constructor(db) {
    if (!db?.transaction) throw new TypeError("IndexedDB database is required");
    this.db = db;
    this.mode = "indexeddb";
  }

  async createRun(run) {
    const value = normalizeRun(run);
    await requestToPromise(this.db.transaction("agentRuns", "readwrite").objectStore("agentRuns").add(value));
    return clone(value);
  }

  async updateRun(id, patch) {
    const current = await this.getRun(id);
    if (!current) return null;
    const next = normalizeRun({ ...current, ...sanitizePersistedMetadata(patch), id });
    await requestToPromise(this.db.transaction("agentRuns", "readwrite").objectStore("agentRuns").put(next));
    return clone(next);
  }

  async getRun(id) {
    return clone(await requestToPromise(this.db.transaction("agentRuns", "readonly").objectStore("agentRuns").get(id)) ?? null);
  }

  async saveToolExecution(execution) {
    const value = normalizeExecution(execution);
    await requestToPromise(this.db.transaction("toolExecutions", "readwrite").objectStore("toolExecutions").put(value));
    return clone(value);
  }

  async listToolExecutions(agentRunId) {
    const records = await requestToPromise(this.db.transaction("toolExecutions", "readonly").objectStore("toolExecutions").getAll());
    return records
      .filter((item) => item.agentRunId === agentRunId)
      .sort((a, b) => (a.startedAt ?? "").localeCompare(b.startedAt ?? "") || a.id.localeCompare(b.id))
      .map(clone);
  }

  async getRunWithExecutions(agentRunId) {
    const run = await this.getRun(agentRunId);
    if (!run) return null;
    return { run, toolExecutions: await this.listToolExecutions(agentRunId) };
  }

  async resume(agentRunId) {
    return this.getRunWithExecutions(agentRunId);
  }

  async recoverInterruptedRuns({ timestamp = new Date().toISOString() } = {}) {
    const runs = await requestToPromise(this.db.transaction("agentRuns", "readonly").objectStore("agentRuns").getAll());
    const recovered = [];
    for (const run of runs) {
      if (run.status !== AGENT_RUN_STATUSES.RUNNING) continue;
      const executions = await this.listToolExecutions(run.id);
      for (const execution of executions) {
        if (execution.status === TOOL_EXECUTION_STATUSES.RUNNING) {
          await this.saveToolExecution({ ...execution, ...interruptedExecutionPatch(timestamp) });
        }
      }
      recovered.push(await this.updateRun(run.id, interruptedPatch(timestamp)));
    }
    return recovered;
  }

  close() {
    this.db.close();
  }
}

export async function createAgentRunStore({
  indexedDb = globalThis.indexedDB,
  dbName = "react-learning-ai",
  fallback = true,
} = {}) {
  if (!indexedDb) {
    if (!fallback) throw new Error("IndexedDB is unavailable");
    const memory = new MemoryAgentRunStore();
    memory.fallbackReason = "IndexedDB is unavailable";
    return memory;
  }
  try {
    return new IndexedDbAgentRunStore(await openIndexedDb(indexedDb, dbName));
  } catch (error) {
    if (!fallback) throw error;
    const memory = new MemoryAgentRunStore();
    memory.fallbackReason = error instanceof Error ? error.message : String(error);
    return memory;
  }
}

// Compatibility alias for old callers. New composition should choose an
// explicit MemoryAgentRunStore or createAgentRunStore instead.
export class AgentRunStore extends MemoryAgentRunStore {}

export const AGENT_RUN_STATUS = AGENT_RUN_STATUSES;
