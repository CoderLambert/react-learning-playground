export const ARCHITECTURE_DEBT_VERSION = 1;

export const ARCHITECTURE_DEBT = [
  {
    id: "ARCH-001",
    source: "src/assessment/composition/assessmentRuntime.js",
    targetOwner: "ai",
    owner: "assessment-integration",
    cleanupIssue: 184,
    removalCondition:
      "app/integration owns AI + Assessment composition and Assessment runtime no longer imports generic AI implementation",
  },
  {
    id: "ARCH-002",
    source: "src/assessment/ai/assessmentTools.js",
    targetOwner: "ai",
    owner: "assessment-integration",
    cleanupIssue: 184,
    removalCondition:
      "Assessment semantic tool capability no longer imports AI-specific ToolPolicy/agent contracts",
  },
  {
    id: "ARCH-003",
    source: "src/ai/useAiLearningAssistant.js",
    targetOwner: "workbench",
    owner: "ai-integration",
    cleanupIssue: 184,
    removalCondition:
      "AI application consumes learning material through an app-owned or curated Workbench capability instead of noteRegistry implementation",
  },
];

export function findArchitectureDebt(source, targetOwner) {
  return ARCHITECTURE_DEBT.find(
    (entry) => entry.source === source && entry.targetOwner === targetOwner,
  ) ?? null;
}
