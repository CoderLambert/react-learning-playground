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

export function buildConversationExportFilename({
  prefix = "ai-learning-conversation",
  exportedAt = new Date(),
} = {}) {
  const date = asDate(exportedAt);
  const stamp = date.toISOString().replace(/[:.]/g, "-");
  const safePrefix = String(prefix || "ai-learning-conversation")
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "ai-learning-conversation";
  return `${safePrefix}-${stamp}.md`;
}

export function downloadMarkdown({
  markdown,
  fileName,
  documentImpl = globalThis.document,
  URLImpl = globalThis.URL,
  BlobImpl = globalThis.Blob,
} = {}) {
  if (!documentImpl?.createElement || !documentImpl?.body || !URLImpl?.createObjectURL || !BlobImpl) {
    throw new Error("当前环境不支持会话导出");
  }

  const blob = new BlobImpl([String(markdown ?? "")], { type: "text/markdown;charset=utf-8" });
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
  });
  downloadMarkdown({
    markdown,
    fileName,
    documentImpl: options.documentImpl,
    URLImpl: options.URLImpl,
    BlobImpl: options.BlobImpl,
  });
  return { markdown, fileName };
}
