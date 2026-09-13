import {
  AgentRunner,
  ToolExecutor,
  ToolPolicy,
  ToolRegistry,
  TOOL_POLICIES,
  assertModelClient,
} from "../ai/public.js";

const ASSESSMENT_ACCESS_TO_AI_POLICY = Object.freeze({
  query: TOOL_POLICIES.QUERY,
  command: TOOL_POLICIES.COMMAND,
});

function assertAssessmentCapability(capability) {
  if (!capability || typeof capability !== "object" || Array.isArray(capability)) {
    throw new TypeError("assessment capability must be an object");
  }
  if (typeof capability.name !== "string" || !capability.name.trim()) {
    throw new TypeError("assessment capability.name is required");
  }
  if (!ASSESSMENT_ACCESS_TO_AI_POLICY[capability.access]) {
    throw new TypeError(`unsupported assessment capability access: ${capability.access}`);
  }
  if (typeof capability.execute !== "function") {
    throw new TypeError(`assessment capability ${capability.name} requires execute`);
  }
  return capability;
}

export function mapAssessmentCapabilityToAiTool(capability) {
  const normalized = assertAssessmentCapability(capability);
  return {
    name: normalized.name,
    description: normalized.description,
    policy: ASSESSMENT_ACCESS_TO_AI_POLICY[normalized.access],
    inputSchema: normalized.inputSchema,
    handler: normalized.execute,
  };
}

/**
 * App-owned composition seam between Assessment semantic capabilities and the
 * generic AI agent runtime. Neither peer domain constructs the other's runtime.
 */
export function createAiAssessmentIntegration({ assessmentCapabilities = [] } = {}) {
  if (!Array.isArray(assessmentCapabilities)) {
    throw new TypeError("assessmentCapabilities must be an array");
  }

  const registry = new ToolRegistry();
  for (const capability of assessmentCapabilities) {
    registry.register(mapAssessmentCapabilityToAiTool(capability));
  }
  const toolExecutor = new ToolExecutor({ registry, policy: new ToolPolicy() });

  return Object.freeze({
    createAgentRunner(modelClient, options = {}) {
      return new AgentRunner({
        modelClient: assertModelClient(modelClient),
        toolRegistry: registry,
        toolExecutor,
        ...options,
      });
    },
  });
}
