export const ARCHITECTURE_DEBT_VERSION = 1;

export const ARCHITECTURE_DEBT = [
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
