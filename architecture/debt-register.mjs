export const ARCHITECTURE_DEBT_VERSION = 1;

export const ARCHITECTURE_DEBT = [];

export function findArchitectureDebt(source, targetOwner, targetPath) {
  return ARCHITECTURE_DEBT.find(
    (entry) =>
      entry.source === source &&
      entry.targetOwner === targetOwner &&
      entry.targetPath === targetPath,
  ) ?? null;
}
