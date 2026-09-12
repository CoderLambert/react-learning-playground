import { AGENT_ERROR_CODES, AgentError } from "./agentContracts.js";
import { MODEL_FINISH_REASONS, MODEL_TURN_EVENT_TYPES } from "../providers/modelClient.js";

function serializeToolResult(result) {
  return JSON.stringify(result.ok ? result.result : { error: result.error });
}

export class AgentRunner {
  constructor({ modelClient, toolRegistry, toolExecutor, maxSteps = 6 } = {}) {
    if (!modelClient?.streamTurn) throw new TypeError("model client is required");
    if (!toolRegistry?.modelDefinitions) throw new TypeError("tool registry is required");
    if (!toolExecutor?.execute) throw new TypeError("tool executor is required");
    if (!Number.isInteger(maxSteps) || maxSteps < 1) throw new TypeError("maxSteps must be a positive integer");
    this.modelClient = modelClient;
    this.toolRegistry = toolRegistry;
    this.toolExecutor = toolExecutor;
    this.maxSteps = maxSteps;
  }

  async run({ messages, context, signal, onEvent, purpose = "chat" } = {}) {
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
        return { messages: conversation, text: assistantText, steps: step + 1 };
      }

      conversation.push({ role: "assistant", content: assistantText, toolCalls });
      for (const call of toolCalls) {
        const result = await this.toolExecutor.execute(call, context, { signal });
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
  }
}
