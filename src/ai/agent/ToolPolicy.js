import { AGENT_ERROR_CODES, AgentError, TOOL_POLICIES } from "./agentContracts.js";

export class ToolPolicy {
  constructor({ allowCommands = true, allowDestructive = false } = {}) {
    this.allowCommands = Boolean(allowCommands);
    this.allowDestructive = Boolean(allowDestructive);
  }

  assertAllowed(tool) {
    if (!tool || typeof tool !== "object") {
      throw new AgentError(AGENT_ERROR_CODES.TOOL_FORBIDDEN, "tool metadata is required");
    }
    if (tool.policy === TOOL_POLICIES.QUERY) return;
    if (tool.policy === TOOL_POLICIES.COMMAND && this.allowCommands) return;
    if (tool.policy === TOOL_POLICIES.DESTRUCTIVE && this.allowDestructive) return;
    throw new AgentError(
      AGENT_ERROR_CODES.TOOL_FORBIDDEN,
      `tool policy is not allowed: ${tool.policy}`,
      { details: { toolName: tool.name, policy: tool.policy } },
    );
  }
}
