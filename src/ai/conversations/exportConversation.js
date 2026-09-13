const ROLE_LABELS = Object.freeze({
  user: "你",
  assistant: "AI 学习助手",
});

function asDate(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  const date = new Date(value ?? Date.now());
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function normalizeMessages(messages) {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter((message) => message && (message.role === "user" || message.role === "assistant"))
    .map((message) => ({
      role: message.role,
      content: typeof message.content === "string" ? message.content.trim() : "",
      finishReason: message.finishReason ?? message.metadata?.finishReason ?? null,
    }))
    .filter((message) => message.content);
}

function normalizeContextLabels(contextSummary) {
  if (!contextSummary || typeof contextSummary !== "object") return [];
  const labels = [];
  if (contextSummary.note) labels.push(`笔记：${contextSummary.note}`);
  const sources = Array.isArray(contextSummary.sources) ? contextSummary.sources : [];
  for (const source of sources) {
    const label = typeof source === "string" ? source : source?.name ?? source?.label;
    if (label) labels.push(`源码：${label}`);
  }
  return labels;
}

function normalizeContextSummary(contextSummary) {
  if (!contextSummary || typeof contextSummary !== "object") return null;
  return {
    note: contextSummary.note ?? null,
    activeSourceFile: contextSummary.activeSourceFile ?? null,
    sources: (Array.isArray(contextSummary.sources) ? contextSummary.sources : [])
      .map((source) => typeof source === "string" ? source : source?.name ?? source?.label)
      .filter(Boolean),
  };
}

export function buildConversationMarkdown({
  messages = [],
  title = "AI 学习会话",
  contextSummary = null,
  providerLabel = null,
  modelLabel = null,
  exportedAt = new Date(),
} = {}) {
  const normalizedMessages = normalizeMessages(messages);
  const date = asDate(exportedAt);
  const metadata = [
    `导出时间：${date.toISOString()}`,
    providerLabel ? `Provider：${providerLabel}` : null,
    modelLabel ? `模型：${modelLabel}` : null,
    ...normalizeContextLabels(contextSummary),
  ].filter(Boolean);

  const sections = [
    `# ${String(title || "AI 学习会话").trim() || "AI 学习会话"}`,
    "",
    ...metadata.map((line) => `- ${line}`),
  ];

  for (const message of normalizedMessages) {
    sections.push(
      "",
      `## ${ROLE_LABELS[message.role]}`,
      "",
      message.content,
    );
  }

  return `${sections.join("\n").trim()}\n`;
}

export function buildConversationJson({
  messages = [],
  title = "AI 学习会话",
  contextSummary = null,
  providerLabel = null,
  modelLabel = null,
  exportedAt = new Date(),
} = {}) {
  const date = asDate(exportedAt);
  return JSON.stringify({
    schemaVersion: 1,
    title: String(title || "AI 学习会话").trim() || "AI 学习会话",
    exportedAt: date.toISOString(),
    provider: providerLabel || null,
    model: modelLabel || null,
    context: normalizeContextSummary(contextSummary),
    messages: normalizeMessages(messages),
  }, null, 2) + "\n";
}

export function buildConversationExportFilename({
  prefix = "ai-learning-conversation",
  exportedAt = new Date(),
  extension = "md",
} = {}) {
  const date = asDate(exportedAt);
  const stamp = date.toISOString().replace(/[:.]/g, "-");
  const safePrefix = String(prefix || "ai-learning-conversation")
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "ai-learning-conversation";
  const safeExtension = extension === "json" ? "json" : "md";
  return `${safePrefix}-${stamp}.${safeExtension}`;
}

export function downloadText({
  content,
  fileName,
  mimeType = "text/plain;charset=utf-8",
  documentImpl = globalThis.document,
  URLImpl = globalThis.URL,
  BlobImpl = globalThis.Blob,
} = {}) {
  if (!documentImpl?.createElement || !documentImpl?.body || !URLImpl?.createObjectURL || !BlobImpl) {
    throw new Error("当前环境不支持会话导出");
  }

  const blob = new BlobImpl([String(content ?? "")], { type: mimeType });
  const url = URLImpl.createObjectURL(blob);
  const anchor = documentImpl.createElement("a");
  anchor.href = url;
  anchor.download = fileName || buildConversationExportFilename();
  anchor.style.display = "none";
  documentImpl.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URLImpl.revokeObjectURL?.(url);
}

export function exportConversationMarkdown(options = {}) {
  const exportedAt = options.exportedAt ?? new Date();
  const markdown = buildConversationMarkdown({ ...options, exportedAt });
  const fileName = buildConversationExportFilename({
    prefix: options.filePrefix,
    exportedAt,
    extension: "md",
  });
  downloadText({
    content: markdown,
    fileName,
    mimeType: "text/markdown;charset=utf-8",
    documentImpl: options.documentImpl,
    URLImpl: options.URLImpl,
    BlobImpl: options.BlobImpl,
  });
  return { markdown, fileName };
}

export function exportConversationJson(options = {}) {
  const exportedAt = options.exportedAt ?? new Date();
  const json = buildConversationJson({ ...options, exportedAt });
  const fileName = buildConversationExportFilename({
    prefix: options.filePrefix,
    exportedAt,
    extension: "json",
  });
  downloadText({
    content: json,
    fileName,
    mimeType: "application/json;charset=utf-8",
    documentImpl: options.documentImpl,
    URLImpl: options.URLImpl,
    BlobImpl: options.BlobImpl,
  });
  return { json, fileName };
}

export async function copyConversationMarkdown(options = {}) {
  const clipboard = options.clipboard ?? globalThis.navigator?.clipboard;
  if (!clipboard?.writeText) throw new Error("当前环境不支持复制会话");
  const markdown = buildConversationMarkdown(options);
  await clipboard.writeText(markdown);
  return markdown;
}
