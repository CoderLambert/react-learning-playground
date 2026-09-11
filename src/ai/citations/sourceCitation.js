const SOURCE_PROTOCOL_PREFIX = "source://";
const SOURCE_URL_RE = /^source:\/\/([^#?\s]+)#L([1-9]\d*)(?:-(?:L)?([1-9]\d*))?\/?$/i;
const MARKDOWN_SOURCE_LINK_RE = /\[([^\]\r\n]{0,256})\]\((source:\/\/[^)\s]+)\)/gi;
const BRACKET_SOURCE_RE = /\[([^\[\]\r\n]+):L([1-9]\d*)(?:-(?:L)?([1-9]\d*))?\]/g;
const FALLBACK_SOURCE_FILE_RE = /(?:^|[/\\])[^/\\\s][^/\\]*\.(?:[cm]?[jt]sx?|css|scss|sass|less|mdx?|json|html?|vue|svelte|py|go|rs|java|kt|kts|sql|ya?ml|toml)$/i;

function toPositiveLine(value) {
  const line = Number(value);
  return Number.isSafeInteger(line) && line > 0 ? line : null;
}

function hasUnsafeFileName(fileName) {
  return (
    !fileName ||
    fileName.length > 512 ||
    /[\u0000-\u001F\u007F]/.test(fileName) ||
    /^[a-z][a-z0-9+.-]*:\/\//i.test(fileName)
  );
}

function encodeSourceFileName(fileName) {
  return encodeURIComponent(fileName).replace(/[()]/g, (character) =>
    character === "(" ? "%28" : "%29",
  );
}

export function normalizeSourceCitation(citation) {
  if (!citation || typeof citation !== "object") return null;

  const fileName = typeof citation.fileName === "string" ? citation.fileName.trim() : "";
  const startLine = toPositiveLine(citation.startLine);
  const requestedEnd = citation.endLine == null ? startLine : toPositiveLine(citation.endLine);

  if (hasUnsafeFileName(fileName) || startLine == null || requestedEnd == null || requestedEnd < startLine) {
    return null;
  }

  return {
    fileName,
    startLine,
    endLine: requestedEnd,
    ...(citation.label ? { label: String(citation.label) } : {}),
  };
}

export function formatSourceCitationLines(startLine, endLine = startLine) {
  const start = toPositiveLine(startLine);
  const end = toPositiveLine(endLine);
  if (start == null || end == null || end < start) return "";
  return start === end ? `L${start}` : `L${start}–L${end}`;
}

export function serializeSourceCitationUrl(citation) {
  const normalized = normalizeSourceCitation(citation);
  if (!normalized) return null;

  const range = normalized.endLine === normalized.startLine
    ? `L${normalized.startLine}`
    : `L${normalized.startLine}-L${normalized.endLine}`;

  return `${SOURCE_PROTOCOL_PREFIX}${encodeSourceFileName(normalized.fileName)}#${range}`;
}

export function parseSourceCitationUrl(href) {
  if (typeof href !== "string") return null;
  const match = SOURCE_URL_RE.exec(href.trim());
  if (!match) return null;

  let fileName;
  try {
    fileName = decodeURIComponent(match[1]);
  } catch {
    return null;
  }

  return normalizeSourceCitation({
    fileName,
    startLine: match[2],
    endLine: match[3] ?? match[2],
  });
}

export function buildSourceCitationPreview(citation, sources, options = {}) {
  const normalized = normalizeSourceCitation(citation);
  if (!normalized || !Array.isArray(sources)) return "";

  const source = sources.find((item) => item?.name === normalized.fileName);
  const code = typeof source?.code === "string" ? source.code : "";
  if (!code) return "";

  const lines = code.split("\n");
  if (normalized.startLine > lines.length) return "";

  const contextLines = Number.isFinite(options.contextLines)
    ? Math.max(0, Math.floor(options.contextLines))
    : 1;
  const maxLines = Number.isFinite(options.maxLines)
    ? Math.max(1, Math.floor(options.maxLines))
    : 14;
  const startLine = Math.max(1, normalized.startLine - contextLines);
  const requestedEndLine = Math.min(lines.length, normalized.endLine + contextLines);
  const endLine = Math.min(requestedEndLine, startLine + maxLines - 1);
  const preview = lines
    .slice(startLine - 1, endLine)
    .map((line, index) => `${startLine + index} | ${line || " "}`)
    .join("\n");

  return endLine < requestedEndLine ? `${preview}\n…` : preview;
}

function escapeMarkdownLabel(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/\]/g, "\\]");
}

export function serializeSourceCitationMarkdown(citation) {
  const normalized = normalizeSourceCitation(citation);
  if (!normalized) return null;

  const href = serializeSourceCitationUrl(normalized);
  const range = normalized.endLine === normalized.startLine
    ? `L${normalized.startLine}`
    : `L${normalized.startLine}-L${normalized.endLine}`;
  const fallbackLabel = `${normalized.fileName}:${range}`;
  const label = escapeMarkdownLabel(normalized.label ?? fallbackLabel);
  return `[${label}](${href})`;
}

function isPlausibleFallbackFileName(fileName) {
  if (hasUnsafeFileName(fileName)) return false;
  return FALLBACK_SOURCE_FILE_RE.test(fileName);
}

export function parseBracketSourceCitations(text) {
  if (typeof text !== "string" || !text) return [];

  const citations = [];
  for (const match of text.matchAll(BRACKET_SOURCE_RE)) {
    const fileName = match[1].trim();
    if (!isPlausibleFallbackFileName(fileName)) continue;

    const citation = normalizeSourceCitation({
      fileName,
      startLine: match[2],
      endLine: match[3] ?? match[2],
    });
    if (!citation) continue;

    citations.push({
      ...citation,
      href: serializeSourceCitationUrl(citation),
      raw: match[0],
      index: match.index,
      length: match[0].length,
      syntax: "bracket",
    });
  }

  return citations;
}

function overlapsRange(index, length, ranges) {
  const end = index + length;
  return ranges.some((range) => index < range.end && end > range.start);
}

export function extractSourceCitations(text, options = {}) {
  if (typeof text !== "string" || !text) return [];

  const citations = [];
  const protocolRanges = [];

  for (const match of text.matchAll(MARKDOWN_SOURCE_LINK_RE)) {
    const parsed = parseSourceCitationUrl(match[2]);
    if (!parsed) continue;

    const item = {
      ...parsed,
      label: match[1] || undefined,
      href: serializeSourceCitationUrl(parsed),
      raw: match[0],
      index: match.index,
      length: match[0].length,
      syntax: "markdown",
    };
    citations.push(item);
    protocolRanges.push({ start: item.index, end: item.index + item.length });
  }

  for (const item of parseBracketSourceCitations(text)) {
    if (!overlapsRange(item.index, item.length, protocolRanges)) {
      citations.push(item);
    }
  }

  citations.sort((left, right) => left.index - right.index);

  if (!options.dedupe) return citations;

  const seen = new Set();
  return citations.filter((citation) => {
    const key = `${citation.fileName}\u0000${citation.startLine}\u0000${citation.endLine}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function isSourceCitationUrl(href) {
  return parseSourceCitationUrl(href) !== null;
}
