const DEFAULT_LANGUAGE = "text";
const PREVIEW_LIMIT = 96;

export function normalizeCodeBlockText(node) {
  if (typeof node?.code === "string") return node.code;
  if (typeof node?.raw === "string") return node.raw;
  return "";
}

export function normalizeCodeBlockLanguage(node) {
  const language = typeof node?.language === "string" ? node.language.trim() : "";
  return language || DEFAULT_LANGUAGE;
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
