export const ARCHITECTURE_DEBT_VERSION = 1;

export const ARCHITECTURE_DEBT = [
  {
    id: "ARCH-003",
    source: "src/ai/useAiLearningAssistant.js",
    targetOwner: "workbench",
    targetPath: "src/workbench/noteRegistry.js",
    owner: "ai-integration",
    cleanupIssue: 193,
    removalCondition:
      "AI application consumes learning material through an app-owned or curated Workbench capability instead of noteRegistry implementation",
  },
];

export function findArchitectureDebt(source, targetOwner, targetPath) {
  return ARCHITECTURE_DEBT.find(
    (entry) =>
      entry.source === source &&
      entry.targetOwner === targetOwner &&
      entry.targetPath === targetPath,
  ) ?? null;
}
