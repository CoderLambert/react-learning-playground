export const AGENT_RUN_STATUS = Object.freeze({
  RUNNING: "running",
  COMPLETED: "completed",
  FAILED: "failed",
  ABORTED: "aborted",
});

export class AgentRunStore {
  constructor() {
    this.runs = new Map();
    this.toolExecutions = new Map();
  }

  createRun(run) {
    if (!run?.id) throw new TypeError("run id is required");
    const value = { ...run, status: run.status || AGENT_RUN_STATUS.RUNNING };
    this.runs.set(run.id, structuredClone(value));
    return structuredClone(value);
  }

  updateRun(id, patch) {
    const current = this.runs.get(id);
    if (!current) return null;
    const next = { ...current, ...patch };
    this.runs.set(id, structuredClone(next));
    return structuredClone(next);
  }

  getRun(id) {
    const value = this.runs.get(id);
    return value ? structuredClone(value) : null;
  }

  saveToolExecution(execution) {
    if (!execution?.id) throw new TypeError("tool execution id is required");
    this.toolExecutions.set(execution.id, structuredClone(execution));
    return structuredClone(execution);
  }

  listToolExecutions(runId) {
    return [...this.toolExecutions.values()]
      .filter((item) => item.agentRunId === runId)
      .map((item) => structuredClone(item));
  }

  resume(runId) {
    const run = this.getRun(runId);
    if (!run) return null;
    return {
      run,
      toolExecutions: this.listToolExecutions(runId),
    };
  }
}
