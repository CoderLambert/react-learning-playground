function normalizeSourceRange(sourceRef) {
  if (sourceRef?.kind !== "source" || typeof sourceRef.fileName !== "string") return null;
  const startLine = Number(sourceRef.startLine);
  const endLine = Number(sourceRef.endLine ?? sourceRef.startLine);
  if (!Number.isInteger(startLine) || startLine < 1) return null;
  if (!Number.isInteger(endLine) || endLine < startLine) return null;
  return {
    fileName: sourceRef.fileName,
    startLine,
    endLine,
  };
}

/**
 * Resolve a lesson-owned source reference against the authoritative LearningUnit
 * source text. Teaching metadata owns only the range + explanation; code remains
 * owned by src/demos/index.js -> LearningUnit.sources.
 */
export function resolveLearningSourceExcerpt(learningUnit, sourceRef) {
  const range = normalizeSourceRange(sourceRef);
  if (!range || !Array.isArray(learningUnit?.sources)) return null;

  const source = learningUnit.sources.find((candidate) => candidate?.name === range.fileName);
  if (!source || typeof source.code !== "string") return null;

  const lines = source.code.split("\n");
  if (range.startLine > lines.length) return null;

  const endLine = Math.min(range.endLine, lines.length);
  return Object.freeze({
    fileName: range.fileName,
    startLine: range.startLine,
    endLine,
    code: lines.slice(range.startLine - 1, endLine).join("\n"),
  });
}
