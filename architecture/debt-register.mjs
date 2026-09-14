export const ARCHITECTURE_DEBT_VERSION = 1;

export const ARCHITECTURE_DEBT = [];

export function findArchitectureDebtIn(entries, source, targetOwner, targetPath) {
  return entries.find(
    (entry) =>
      entry.source === source &&
      entry.targetOwner === targetOwner &&
      entry.targetPath === targetPath,
  ) ?? null;
}

export function findArchitectureDebt(source, targetOwner, targetPath) {
  return findArchitectureDebtIn(ARCHITECTURE_DEBT, source, targetOwner, targetPath);
}
