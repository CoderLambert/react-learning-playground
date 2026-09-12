import {
  AGENT_ERROR_CODES,
  AGENT_RUN_STATUSES,
  TOOL_EXECUTION_STATUSES,
  AgentError,
} from "./agentContracts.js";
import { MODEL_FINISH_REASONS, MODEL_TURN_EVENT_TYPES } from "../providers/modelClient.js";
import { sanitizePersistedMetadata } from "../storage/conversationStore.js";

function serializeToolResult(result) {
  return JSON.stringify(result.ok ? result.result : { error: result.error });
}

function serializeError(error) {
  return sanitizePersistedMetadata({
    code: error?.code ?? "UNKNOWN",
    message: error?.message ?? "agent execution failed",
    ...(error?.details === undefined ? {} : { details: error.details }),
  });
}

function terminalRunStatus(error) {
  return error?.code === AGENT_ERROR_CODES.ABORTED
    ? AGENT_RUN_STATUSES.ABORTED
    : AGENT_RUN_STATUSES.FAILED;
}

export class AgentRunner {
  constructor({ modelClient, toolRegistry, toolExecutor, auditStore = null, maxSteps = 6, clock = () => new Date() } = {}) {
    if (!modelClient?.streamTurn) throw new TypeError("model client is required");
    if (!toolRegistry?.modelDefinitions) throw new TypeError("tool registry is required");
    if (!toolExecutor?.execute) throw new TypeError("tool executor is required");
    if (auditStore && (!auditStore.createRun || !auditStore.updateRun || !auditStore.saveToolExecution)) {
      throw new TypeError("audit store does not implement the agent run port");
    }
    if (!Number.isInteger(maxSteps) || maxSteps < 1) throw new TypeError("maxSteps must be a positive integer");
    if (typeof clock !== "function") throw new TypeError("clock must be a function");
    this.modelClient = modelClient;
    this.toolRegistry = toolRegistry;
    this.toolExecutor = toolExecutor;
    this.auditStore = auditStore;
    this.maxSteps = maxSteps;
    this.clock = clock;
  }

  timestamp() {
    return this.clock().toISOString();
  }

  async startAuditRun(context, purpose) {
    if (!this.auditStore) return null;
    if (!context?.agentRunId) throw new TypeError("agentRunId is required when audit persistence is enabled");
    const timestamp = this.timestamp();
    return this.auditStore.createRun({
      id: context.agentRunId,
      agentRunId: context.agentRunId,
      conversationId: context.conversationId ?? null,
      contextSnapshotId: context.contextSnapshotId ?? null,
      learningUnitId: context.learningUnitId ?? null,
      model: context.model ?? null,
      purpose,
      status: AGENT_RUN_STATUSES.RUNNING,
      startedAt: timestamp,
      createdAt: timestamp,
    });
  }

  async finishAuditRun(context, status, error = null) {
    if (!this.auditStore || !context?.agentRunId) return;
    await this.auditStore.updateRun(context.agentRunId, {
      status,
      completedAt: this.timestamp(),
      ...(error ? { error: serializeError(error) } : {}),
    });
  }

  async executeWithAudit(call, context, signal) {
    if (!this.auditStore) return this.toolExecutor.execute(call, context, { signal });
    const timestamp = this.timestamp();
    const executionId = `${context.agentRunId}:${call.id}`;
    await this.auditStore.saveToolExecution({
      id: executionId,
      agentRunId: context.agentRunId,
      toolCallId: call.id,
      toolName: call.name,
      status: TOOL_EXECUTION_STATUSES.RUNNING,
      startedAt: timestamp,
      createdAt: timestamp,
    });
    try {
      const result = await this.toolExecutor.execute(call, context, { signal });
      const failed = !result.ok;
      await this.auditStore.saveToolExecution({
        id: executionId,
        agentRunId: context.agentRunId,
        toolCallId: call.id,
        toolName: call.name,
        status: failed
          ? result.error?.code === AGENT_ERROR_CODES.ABORTED
            ? TOOL_EXECUTION_STATUSES.ABORTED
            : TOOL_EXECUTION_STATUSES.FAILED
          : TOOL_EXECUTION_STATUSES.SUCCEEDED,
        startedAt: timestamp,
        completedAt: this.timestamp(),
        ...(failed
          ? { error: sanitizePersistedMetadata(result.error) }
          : { result: sanitizePersistedMetadata(result.result) }),
      });
      return result;
    } catch (error) {
      await this.auditStore.saveToolExecution({
        id: executionId,
        agentRunId: context.agentRunId,
        toolCallId: call.id,
        toolName: call.name,
        status: error?.code === AGENT_ERROR_CODES.ABORTED
          ? TOOL_EXECUTION_STATUSES.ABORTED
          : TOOL_EXECUTION_STATUSES.FAILED,
        startedAt: timestamp,
        completedAt: this.timestamp(),
        error: serializeError(error),
      });
      throw error;
    }
  }

  async run({ messages, context, signal, onEvent, purpose = "chat" } = {}) {
    await this.startAuditRun(context, purpose);
    try {
      const conversation = messages.map((message) => structuredClone(message));
      for (let step = 0; step < this.maxSteps; step += 1) {
        if (signal?.aborted) throw new AgentError(AGENT_ERROR_CODES.ABORTED, "agent run aborted");

        const toolCalls = [];
        let assistantText = "";
        let finishReason = MODEL_FINISH_REASONS.STOP;
        try {
          for await (const event of this.modelClient.streamTurn({
            messages: conversation,
            // Compaction is a model-only turn. The empty list is deliberate:
            // no tool schema reaches the provider, so this runner cannot enter
            // the tool executor while creating a summary.
            tools: purpose === "compaction" ? [] : this.toolRegistry.modelDefinitions(),
            purpose,
          }, { signal })) {
            onEvent?.(event);
            if (event.type === MODEL_TURN_EVENT_TYPES.TEXT_DELTA) assistantText += event.text;
            if (event.type === MODEL_TURN_EVENT_TYPES.TOOL_CALL) toolCalls.push(event.toolCall);
            if (event.type === MODEL_TURN_EVENT_TYPES.TURN_COMPLETE) finishReason = event.finishReason;
          }
        } catch (error) {
          if (signal?.aborted || error?.name === "AbortError" || error?.code === "MODEL_CLIENT_ABORTED") {
            throw new AgentError(AGENT_ERROR_CODES.ABORTED, "agent run aborted", { cause: error });
          }
          if (error instanceof AgentError) throw error;
          throw new AgentError(AGENT_ERROR_CODES.PROVIDER_FAILED, error?.message || "provider failed", { cause: error });
        }

        if (purpose === "compaction" && toolCalls.length) {
          throw new AgentError(AGENT_ERROR_CODES.TOOL_FORBIDDEN, "compaction model turn returned tool calls");
        }
        if (toolCalls.length && finishReason !== MODEL_FINISH_REASONS.TOOL_CALLS) {
          throw new AgentError(AGENT_ERROR_CODES.PROVIDER_FAILED, "model returned tool calls without tool_calls finish reason");
        }
        if (!toolCalls.length || finishReason !== MODEL_FINISH_REASONS.TOOL_CALLS) {
          if (assistantText) conversation.push({ role: "assistant", content: assistantText });
          const result = { messages: conversation, text: assistantText, steps: step + 1 };
          await this.finishAuditRun(context, AGENT_RUN_STATUSES.COMPLETED);
          return result;
        }

        conversation.push({ role: "assistant", content: assistantText, toolCalls });
        for (const call of toolCalls) {
          const result = await this.executeWithAudit(call, context, signal);
          onEvent?.({ type: "tool_result", toolResult: result });
          conversation.push({
            role: "tool",
            toolCallId: call.id,
            content: serializeToolResult(result),
          });
        }
      }

      throw new AgentError(
        AGENT_ERROR_CODES.STEP_LIMIT_EXCEEDED,
        `agent exceeded maximum tool steps: ${this.maxSteps}`,
        { details: { maxSteps: this.maxSteps } },
      );
    } catch (error) {
      await this.finishAuditRun(context, terminalRunStatus(error), error);
      throw error;
    }
  }
}
