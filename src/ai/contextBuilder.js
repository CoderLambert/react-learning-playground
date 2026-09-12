export const AI_CONTEXT_LIMITS = Object.freeze({
  maxNoteChars: 24000,
  maxSourceFiles: 8,
  maxSourceCharsPerFile: 16000,
  maxTotalSourceChars: 48000,
  maxSemanticRegionsPerFile: 12,
});

function toText(value) {
  return typeof value === "string" ? value : "";
}

function truncateText(text, maxChars) {
  if (text.length <= maxChars) {
    return { text, truncated: false, originalChars: text.length, includedChars: text.length };
  }

  return {
    text: text.slice(0, maxChars),
    truncated: true,
    originalChars: text.length,
    includedChars: maxChars,
  };
}

function normalizeSource(source, index) {
  const name = toText(source?.name).trim() || `source-${index + 1}.txt`;
  return { name, code: toText(source?.code), semantics: source?.semantics ?? null };
}

function normalizeSemanticRegion(region, includedLineCount) {
  if (!region || typeof region !== "object") return null;
  const startLine = Math.max(1, Number(region.startLine) || 1);
  const endLine = Math.max(startLine, Number(region.endLine) || startLine);
  if (startLine > includedLineCount || endLine > includedLineCount) return null;
  if (typeof region.id !== "string" || typeof region.symbol !== "string") return null;

  return {
    id: region.id,
    kind: toText(region.kind) || "helper",
    symbol: region.symbol,
    startLine,
    endLine,
    ...(typeof region.hookName === "string" ? { hookName: region.hookName } : {}),
    ...(typeof region.parentSymbol === "string" ? { parentSymbol: region.parentSymbol } : {}),
  };
}

function normalizeSourceSemantics(semantics, includedCode, maxRegions) {
  if (!semantics || typeof semantics !== "object") return null;
  const includedLineCount = includedCode ? includedCode.split("\n").length : 0;
  if (includedLineCount === 0) return null;
  const regions = Array.isArray(semantics.regions)
    ? semantics.regions
        .map((region) => normalizeSemanticRegion(region, includedLineCount))
        .filter(Boolean)
        .slice(0, Math.max(0, maxRegions))
    : [];
  if (regions.length === 0) return null;

  const requestedPrimaryId = toText(semantics.primaryRegionId);
  const primaryRegionId = regions.some((region) => region.id === requestedPrimaryId)
    ? requestedPrimaryId
    : regions[0].id;

  return {
    ...(typeof semantics.path === "string" ? { path: semantics.path } : {}),
    ...(typeof semantics.parser === "string" ? { parser: semantics.parser } : {}),
    primaryRegionId,
    regions,
  };
}

function resolveActiveSourceFile(activeSourceFile, sourceNames) {
  if (sourceNames.length === 0) return null;
  if (typeof activeSourceFile === "string" && sourceNames.includes(activeSourceFile)) {
    return activeSourceFile;
  }
  return sourceNames[0];
}

/**
 * Add stable, one-based line numbers for model-readable source context without
 * changing the original source string stored in the learning unit.
 */
export function addLineNumbers(code) {
  return toText(code)
    .split("\n")
    .map((line, index) => `${index + 1} | ${line}`)
    .join("\n");
}

/**
 * Build a source citation label suitable for AI answers.
 */
export function formatSourceCitation(fileName, startLine, endLine = startLine) {
  const safeFileName = toText(fileName).trim() || "unknown";
  const start = Math.max(1, Number.parseInt(startLine, 10) || 1);
  const end = Math.max(start, Number.parseInt(endLine, 10) || start);
  return end === start
    ? `[${safeFileName}:L${start}]`
    : `[${safeFileName}:L${start}-L${end}]`;
}

/**
 * Provider-neutral context envelope containing the current learning unit,
 * raw MDX note, registered source files and build-resolved semantic regions.
 */
export function buildAiContext({
  learningUnit,
  rawNote,
  sources,
  activeSourceFile,
  limits = AI_CONTEXT_LIMITS,
} = {}) {
  const resolvedLimits = { ...AI_CONTEXT_LIMITS, ...(limits || {}) };
  const id = toText(learningUnit?.id).trim();
  const title = toText(learningUnit?.title ?? learningUnit?.label).trim();
  const category = toText(
    learningUnit?.categoryId ?? learningUnit?.category ?? learningUnit?.registryEntry?.category,
  ).trim();

  const noteText = toText(rawNote);
  const noteResult = truncateText(noteText, Math.max(0, resolvedLimits.maxNoteChars));
  const noteFileName = id ? `${id}.mdx` : null;

  const inputSources = Array.isArray(sources)
    ? sources
    : Array.isArray(learningUnit?.sources)
      ? learningUnit.sources
      : [];

  const sourceLimit = Math.max(0, resolvedLimits.maxSourceFiles);
  const limitedSources = inputSources.slice(0, sourceLimit).map(normalizeSource);
  let remainingSourceChars = Math.max(0, resolvedLimits.maxTotalSourceChars);

  const sourceEntries = limitedSources.map((source) => {
    const perFileLimit = Math.min(
      Math.max(0, resolvedLimits.maxSourceCharsPerFile),
      remainingSourceChars,
    );
    const result = truncateText(source.code, perFileLimit);
    remainingSourceChars -= result.includedChars;
    const semantics = normalizeSourceSemantics(
      source.semantics,
      result.text,
      resolvedLimits.maxSemanticRegionsPerFile,
    );

    return {
      name: source.name,
      code: result.text,
      numberedCode: addLineNumbers(result.text),
      ...(semantics ? { semantics } : {}),
      truncation: {
        truncated: result.truncated,
        originalChars: result.originalChars,
        includedChars: result.includedChars,
      },
    };
  });

  const sourceNames = sourceEntries.map((source) => source.name);
  const resolvedActiveSourceFile = resolveActiveSourceFile(activeSourceFile, sourceNames);
  const omittedSourceFiles = Math.max(0, inputSources.length - limitedSources.length);
  const sourceCharsOriginal = limitedSources.reduce(
    (total, source) => total + source.code.length,
    0,
  );
  const sourceCharsIncluded = sourceEntries.reduce(
    (total, source) => total + source.truncation.includedChars,
    0,
  );

  return {
    version: 2,
    learningUnit: {
      id: id || null,
      title: title || null,
      category: category || null,
    },
    note: {
      available: noteText.length > 0,
      fileName: noteFileName,
      content: noteResult.text,
      truncation: {
        truncated: noteResult.truncated,
        originalChars: noteResult.originalChars,
        includedChars: noteResult.includedChars,
      },
    },
    sources: sourceEntries,
    activeSourceFile: resolvedActiveSourceFile,
    availability: {
      note: noteText.length > 0,
      sources: sourceEntries.length > 0,
    },
    truncation: {
      truncated:
        noteResult.truncated ||
        omittedSourceFiles > 0 ||
        sourceEntries.some((source) => source.truncation.truncated),
      omittedSourceFiles,
      sourceCharsOriginal,
      sourceCharsIncluded,
    },
  };
}
