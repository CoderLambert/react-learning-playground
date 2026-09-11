const DEFAULT_LANGUAGE = "text";
const PREVIEW_LIMIT = 96;
const DEFAULT_CODE_FONT_SIZE = 12;
const MIN_RENDERABLE_LINE_HEIGHT = 12;
const MAX_UNIT_LESS_LINE_HEIGHT = 3;

export function normalizeCodeBlockText(node) {
  if (typeof node?.code === "string") return node.code;
  if (typeof node?.raw === "string") return node.raw;
  return "";
}

export function normalizeCodeBlockLanguage(node) {
  const language = typeof node?.language === "string" ? node.language.trim() : "";
  return language || DEFAULT_LANGUAGE;
}

export function normalizeCodeBlockOptions(options) {
  if (!options || typeof options !== "object" || Array.isArray(options)) return options;

  const normalized = { ...options };
  const fontSize = Number(normalized.fontSize);
  const lineHeight = Number(normalized.lineHeight);

  // Markstream's codeBlockOptions.lineHeight is a pixel metric. Call sites can
  // easily pass a normal CSS unitless ratio (for example 1.6), which Markstream
  // then interprets as 1.6px and visually stacks every code line on top of the
  // next one. Treat only small positive values as CSS-style ratios; real pixel
  // values (for example 18 or 20) pass through unchanged.
  if (
    Number.isFinite(lineHeight) &&
    lineHeight > 0 &&
    lineHeight <= MAX_UNIT_LESS_LINE_HEIGHT
  ) {
    const resolvedFontSize = Number.isFinite(fontSize) && fontSize > 0
      ? fontSize
      : DEFAULT_CODE_FONT_SIZE;
    normalized.lineHeight = Math.max(
      MIN_RENDERABLE_LINE_HEIGHT,
      resolvedFontSize * lineHeight,
    );
  }

  return normalized;
}

function parseMetaLabel(meta) {
  if (typeof meta !== "string") return "";

  const quoted = meta.match(/(?:title|filename|file)=(?:"([^"]+)"|'([^']+)')/i);
  if (quoted) return (quoted[1] ?? quoted[2] ?? "").trim();

  const bare = meta.match(/(?:title|filename|file)=([^\s]+)/i);
  return bare?.[1]?.trim() ?? "";
}

export function getCodeBlockLabel(node) {
  const direct = [node?.title, node?.filename, node?.fileName, node?.name]
    .find((value) => typeof value === "string" && value.trim());

  return direct?.trim() || parseMetaLabel(node?.meta);
}

export function countCodeBlockLines(code) {
  if (!code) return 0;
  return code.split(/\r?\n/).length;
}

export function buildCodeBlockPreview(code, limit = PREVIEW_LIMIT) {
  if (!code) return "";

  const firstMeaningfulLine = code
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(Boolean) ?? "";

  if (firstMeaningfulLine.length <= limit) return firstMeaningfulLine;
  return `${firstMeaningfulLine.slice(0, Math.max(0, limit - 1))}…`;
}

export async function performCodeBlockCopy({ code, writeText, onCopy }) {
  if (!code) return false;
  if (typeof writeText !== "function") {
    throw new TypeError("writeText must be a function");
  }

  await writeText(code);
  onCopy?.(code);
  return true;
}

export function buildAiCodeBlockModel(node) {
  const code = normalizeCodeBlockText(node);

  return {
    code,
    language: normalizeCodeBlockLanguage(node),
    label: getCodeBlockLabel(node),
    lineCount: countCodeBlockLines(code),
    preview: buildCodeBlockPreview(code),
  };
}
