import {
  AGENT_ERROR_CODES,
  AgentError,
  createToolResult,
  normalizeAgentToolCall,
} from "./agentContracts.js";

function matchesType(value, type) {
  if (type === "array") return Array.isArray(value);
  if (type === "object") return Boolean(value) && typeof value === "object" && !Array.isArray(value);
  if (type === "integer") return Number.isInteger(value);
  if (type === "number") return typeof value === "number" && Number.isFinite(value);
  return typeof value === type;
}

function validateObjectSchema(value, schema, path = "arguments") {
  if (!schema || schema.type !== "object") return;
  if (!matchesType(value, "object")) throw new TypeError(`${path} must be an object`);
  for (const key of schema.required ?? []) {
    if (!(key in value)) throw new TypeError(`${path}.${key} is required`);
  }
  for (const [key, property] of Object.entries(schema.properties ?? {})) {
    if (!(key in value) || value[key] == null || !property?.type) continue;
    if (!matchesType(value[key], property.type)) throw new TypeError(`${path}.${key} must be ${property.type}`);
    if (Array.isArray(property.enum) && !property.enum.includes(value[key])) {
      throw new TypeError(`${path}.${key} is not an allowed value`);
    }
  }
}

export class ToolExecutor {
  constructor({ registry, policy }) {
    if (!registry?.get) throw new TypeError("tool registry is required");
    if (!policy?.assertAllowed) throw new TypeError("tool policy is required");
    this.registry = registry;
    this.policy = policy;
  }

  async execute(rawCall, context, { signal } = {}) {
    const call = normalizeAgentToolCall(rawCall);
    const tool = this.registry.get(call.name);
    if (!tool) {
      return createToolResult({
        toolCallId: call.id,
        toolName: call.name,
        ok: false,
        error: { code: AGENT_ERROR_CODES.TOOL_NOT_FOUND, message: `tool not found: ${call.name}` },
      });
    }

    try {
      if (signal?.aborted) throw new AgentError(AGENT_ERROR_CODES.ABORTED, "tool execution aborted");
      this.policy.assertAllowed(tool);
      validateObjectSchema(call.arguments, tool.inputSchema);
      const executionContext = context && typeof context === "object"
        ? Object.freeze({ ...context, toolCallId: call.id })
        : context;
      const result = await tool.handler(call.arguments, executionContext, { signal, toolCallId: call.id });
      return createToolResult({ toolCallId: call.id, toolName: call.name, ok: true, result });
    } catch (error) {
      const code = error instanceof AgentError
        ? error.code
        : error instanceof TypeError
          ? AGENT_ERROR_CODES.TOOL_ARGUMENTS_INVALID
          : AGENT_ERROR_CODES.TOOL_EXECUTION_FAILED;
      return createToolResult({
        toolCallId: call.id,
        toolName: call.name,
        ok: false,
        error: { code, message: error?.message || code, details: error?.details },
      });
    }
  }
}
