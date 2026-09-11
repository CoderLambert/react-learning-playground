export const AI_CONTEXT_LIMITS = Object.freeze({
  maxNoteChars: 24000,
  maxSourceFiles: 8,
  maxSourceCharsPerFile: 16000,
  maxTotalSourceChars: 48000,
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
  return { name, code: toText(source?.code) };
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
 * Provider-neutral V1 context envelope. It intentionally contains only the
 * current learning unit, raw MDX note and registered source files.
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

    return {
      name: source.name,
      code: result.text,
      numberedCode: addLineNumbers(result.text),
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
    version: 1,
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
