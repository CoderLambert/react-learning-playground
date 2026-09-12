import { SOURCE_SEMANTIC_MANIFEST } from "virtual:source-semantic-manifest";

const EMPTY_REGIONS = Object.freeze([]);

function normalizeRegion(region) {
  if (!region || typeof region !== "object") return null;
  const startLine = Math.max(1, Number(region.startLine) || 1);
  const endLine = Math.max(startLine, Number(region.endLine) || startLine);
  const id = typeof region.id === "string" ? region.id : null;
  const kind = typeof region.kind === "string" ? region.kind : "helper";
  const symbol = typeof region.symbol === "string" ? region.symbol : kind;
  if (!id) return null;

  return {
    id,
    kind,
    symbol,
    startLine,
    endLine,
    ...(typeof region.hookName === "string" ? { hookName: region.hookName } : {}),
    ...(typeof region.parentSymbol === "string" ? { parentSymbol: region.parentSymbol } : {}),
    score: Number(region.score) || 0,
  };
}

export function getSourceSemantics(learningUnitId, fileName) {
  if (!learningUnitId || !fileName) return null;
  const raw = SOURCE_SEMANTIC_MANIFEST?.learningUnits?.[learningUnitId]?.[fileName];
  if (!raw) return null;

  const regions = Array.isArray(raw.regions)
    ? raw.regions.map(normalizeRegion).filter(Boolean)
    : EMPTY_REGIONS;
  const primaryRegionId = typeof raw.primaryRegionId === "string" ? raw.primaryRegionId : null;
  const primaryRegion = regions.find((region) => region.id === primaryRegionId) ?? regions[0] ?? null;

  return {
    version: SOURCE_SEMANTIC_MANIFEST?.version ?? 1,
    path: typeof raw.path === "string" ? raw.path : null,
    parser: typeof raw.parser === "string" ? raw.parser : null,
    primaryRegionId: primaryRegion?.id ?? null,
    primaryRegion,
    regions,
  };
}

export function enrichLearningUnitSourceSemantics(learningUnit) {
  if (!learningUnit || !Array.isArray(learningUnit.sources)) return learningUnit;

  return {
    ...learningUnit,
    sources: learningUnit.sources.map((source) => ({
      ...source,
      semantics: getSourceSemantics(learningUnit.id, source.name),
    })),
  };
}

export function sourceRegionToFocusRange(fileName, region) {
  if (!fileName || !region) return null;
  return {
    fileName,
    startLine: Math.max(1, Number(region.startLine) || 1),
    endLine: Math.max(Number(region.endLine) || Number(region.startLine) || 1, Number(region.startLine) || 1),
  };
}
