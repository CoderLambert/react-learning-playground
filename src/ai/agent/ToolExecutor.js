import Ajv from "ajv";

import {
  AGENT_ERROR_CODES,
  AgentError,
  createToolResult,
  normalizeAgentToolCall,
} from "./agentContracts.js";

function createSchemaValidationError(errors) {
  const error = new TypeError("tool arguments do not match the input schema");
  error.details = errors?.map(({ instancePath, keyword, message, params }) => ({
    instancePath,
    keyword,
    message,
    params,
  })) ?? [];
  return error;
}

export class ToolExecutor {
  #ajv;
  #validators = new WeakMap();

  constructor({ registry, policy, schemaValidator } = {}) {
    if (!registry?.get) throw new TypeError("tool registry is required");
    if (!policy?.assertAllowed) throw new TypeError("tool policy is required");
    this.registry = registry;
    this.policy = policy;
    this.#ajv = schemaValidator ?? new Ajv({ allErrors: true, strict: true });
    if (!this.#ajv || typeof this.#ajv.compile !== "function") {
      throw new TypeError("schemaValidator must provide compile()");
    }
  }

  #validateArguments(value, schema) {
    let validate = this.#validators.get(schema);
    if (!validate) {
      validate = this.#ajv.compile(schema);
      this.#validators.set(schema, validate);
    }
    if (!validate(value)) throw createSchemaValidationError(validate.errors);
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
      this.#validateArguments(call.arguments, tool.inputSchema);
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
