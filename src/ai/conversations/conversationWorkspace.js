const EXPORT_VERSION = 1;
const DEFAULT_SNIPPET_LENGTH = 120;
const REDACTED = "[REDACTED]";

const SENSITIVE_KEY_PATTERN = /(api[_-]?key|authorization|access[_-]?token|refresh[_-]?token|secret|password|credential)/i;
const BEARER_PATTERN = /\bBearer\s+[A-Za-z0-9._~+\/-]+=*/gi;
const DEEPSEEK_KEY_PATTERN = /\bsk-[A-Za-z0-9_-]{12,}\b/g;

function normalizeText(value) {
  return String(value ?? "").replace(/\r\n?/g, "\n");
}

function normalizeSearchText(value) {
  return normalizeText(value).toLocaleLowerCase().replace(/\s+/g, " ").trim();
}

function sanitizeText(value) {
  return normalizeText(value)
    .replace(BEARER_PATTERN, REDACTED)
    .replace(DEEPSEEK_KEY_PATTERN, REDACTED);
}

function sanitizeValue(value, key = "") {
  if (SENSITIVE_KEY_PATTERN.test(key)) return REDACTED;
  if (typeof value === "string") return sanitizeText(value);
  if (Array.isArray(value)) return value.map((item) => sanitizeValue(item));
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value).map(([childKey, childValue]) => [
      childKey,
      sanitizeValue(childValue, childKey),
    ]),
  );
}

function sanitizeMessage(message) {
  return {
    id: message?.id ?? null,
    role: message?.role === "user" ? "user" : "assistant",
    content: sanitizeText(message?.content),
    status: message?.status ?? "complete",
    createdAt: message?.createdAt ?? null,
    updatedAt: message?.updatedAt ?? null,
    usage: sanitizeValue(message?.usage ?? null),
    metadata: sanitizeValue(message?.metadata ?? null),
  };
}

function sanitizeConversation(conversation) {
  return {
    id: conversation?.id ?? null,
    title: sanitizeText(conversation?.title || "新对话"),
    learningUnitId: conversation?.learningUnitId ?? null,
    model: sanitizeText(conversation?.model ?? ""),
    archived: Boolean(conversation?.archived),
    createdAt: conversation?.createdAt ?? null,
    updatedAt: conversation?.updatedAt ?? null,
    lastMessageAt: conversation?.lastMessageAt ?? null,
    metadata: sanitizeValue(conversation?.metadata ?? null),
  };
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString();
}

function roleLabel(role) {
  return role === "user" ? "User" : "AI";
}

function readableConversationTitle(conversation, learningUnitLabel) {
  return learningUnitLabel || conversation.learningUnitId
    ? `${conversation.title} · ${learningUnitLabel || conversation.learningUnitId}`
    : conversation.title;
}

export function createConversationExportDocument({
  conversation,
  messages = [],
  learningUnitLabel = "",
  exportedAt = new Date().toISOString(),
} = {}) {
  if (!conversation?.id) throw new Error("Conversation is required for export");
  const safeConversation = sanitizeConversation(conversation);
  const safeMessages = messages.map(sanitizeMessage);
  return {
    exportVersion: EXPORT_VERSION,
    exportedAt: formatDate(exportedAt) || new Date().toISOString(),
    learningUnit: {
      id: safeConversation.learningUnitId,
      label: sanitizeText(learningUnitLabel),
    },
    conversation: safeConversation,
    messages: safeMessages,
  };
}

export function serializeConversationAsJson(input) {
  return `${JSON.stringify(createConversationExportDocument(input), null, 2)}\n`;
}

export function serializeConversationAsMarkdown(input) {
  const document = createConversationExportDocument(input);
  const { conversation, learningUnit, messages, exportedAt } = document;
  const lines = [
    `# ${readableConversationTitle(conversation, learningUnit.label)}`,
    "",
    `- Exported: ${exportedAt}`,
    ...(learningUnit.id ? [`- Learning Unit: ${learningUnit.label || learningUnit.id}`] : []),
    ...(conversation.model ? [`- Model: ${conversation.model}`] : []),
    ...(conversation.createdAt ? [`- Created: ${conversation.createdAt}`] : []),
    "",
    "---",
    "",
  ];

  messages.forEach((message) => {
    lines.push(`## ${roleLabel(message.role)}`, "", message.content || "_(empty message)_", "");
    if (message.status && message.status !== "complete") {
      lines.push(`> Status: ${message.status}`, "");
    }
  });

  return `${lines.join("\n").trimEnd()}\n`;
}

export function serializeConversationAsReadableText(input) {
  const document = createConversationExportDocument(input);
  const header = readableConversationTitle(document.conversation, document.learningUnit.label);
  const body = document.messages
    .map((message) => `${roleLabel(message.role)}:\n${message.content || "(empty message)"}`)
    .join("\n\n");
  return `${header}\n\n${body}`.trimEnd();
}

export function createConversationFilename({ conversation, extension = "md", date = new Date() } = {}) {
  const title = normalizeText(conversation?.title || "conversation")
    .normalize("NFKC")
    .replace(/[\\/:*?"<>|]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 64)
    .replace(/\s/g, "-") || "conversation";
  const parsed = date instanceof Date ? date : new Date(date);
  const safeDate = Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  const stamp = safeDate.toISOString().slice(0, 10);
  const safeExtension = String(extension).replace(/[^a-z0-9]/gi, "").toLowerCase() || "txt";
  return `${title}-${stamp}.${safeExtension}`;
}

export function createConversationSearchDocument({ conversation, messages = [], learningUnitLabel = "" } = {}) {
  const safeConversation = sanitizeConversation(conversation);
  const safeMessages = messages.map(sanitizeMessage);
  const searchableMessages = safeMessages
    .filter((message) => message.content.trim())
    .map((message) => ({ role: message.role, content: message.content }));
  const text = [
    safeConversation.title,
    learningUnitLabel,
    safeConversation.learningUnitId,
    ...searchableMessages.map((message) => message.content),
  ].filter(Boolean).join("\n");

  return {
    conversation: safeConversation,
    learningUnitLabel: sanitizeText(learningUnitLabel),
    messages: searchableMessages,
    searchText: normalizeSearchText(text),
  };
}

function createSnippet(text, normalizedQuery, maxLength) {
  const compact = normalizeText(text).replace(/\s+/g, " ").trim();
  if (!compact) return "";
  const normalized = normalizeSearchText(compact);
  const matchIndex = normalized.indexOf(normalizedQuery);
  if (matchIndex < 0) return compact.slice(0, maxLength);

  const radius = Math.max(20, Math.floor((maxLength - normalizedQuery.length) / 2));
  const start = Math.max(0, matchIndex - radius);
  const end = Math.min(compact.length, matchIndex + normalizedQuery.length + radius);
  return `${start > 0 ? "…" : ""}${compact.slice(start, end).trim()}${end < compact.length ? "…" : ""}`;
}

export function searchConversationDocuments(documents = [], query, { maxSnippetLength = DEFAULT_SNIPPET_LENGTH } = {}) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return [];

  return documents.flatMap((document) => {
    if (!document?.conversation?.id) return [];
    const titleMatch = normalizeSearchText(document.conversation.title).includes(normalizedQuery);
    const unitMatch = normalizeSearchText(document.learningUnitLabel).includes(normalizedQuery);
    const messageMatch = document.messages?.find((message) => normalizeSearchText(message.content).includes(normalizedQuery));
    if (!titleMatch && !unitMatch && !messageMatch && !document.searchText?.includes(normalizedQuery)) return [];

    const snippetSource = messageMatch?.content || document.conversation.title || document.learningUnitLabel;
    return [{
      conversation: document.conversation,
      learningUnitLabel: document.learningUnitLabel,
      matchedRole: messageMatch?.role ?? null,
      matchKind: titleMatch ? "title" : unitMatch ? "learning-unit" : "message",
      snippet: createSnippet(snippetSource, normalizedQuery, maxSnippetLength),
    }];
  });
}

export function createLearningUnitBundle({ conversations = [], messagesByConversation = new Map(), learningUnitId, learningUnitLabel = "", exportedAt } = {}) {
  const selected = conversations.filter((conversation) => conversation.learningUnitId === learningUnitId);
  return {
    exportVersion: EXPORT_VERSION,
    exportedAt: formatDate(exportedAt) || new Date().toISOString(),
    learningUnit: { id: learningUnitId ?? null, label: sanitizeText(learningUnitLabel) },
    conversations: selected.map((conversation) => createConversationExportDocument({
      conversation,
      messages: messagesByConversation.get?.(conversation.id) ?? messagesByConversation[conversation.id] ?? [],
      learningUnitLabel,
      exportedAt,
    })),
  };
}

export function serializeLearningUnitBundleAsJson(input) {
  return `${JSON.stringify(createLearningUnitBundle(input), null, 2)}\n`;
}

export { EXPORT_VERSION };
