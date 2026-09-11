import {
  sanitizePersistedMetadata,
  sanitizeSensitiveText,
  stableSnapshotHash,
} from "../storage/conversationStore.js";

const ACTIVE_MESSAGE_STATUSES = new Set(["loading", "streaming"]);

function createId(prefix, cryptoImpl = globalThis.crypto) {
  if (cryptoImpl?.randomUUID) return `${prefix}_${cryptoImpl.randomUUID()}`;
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeTitle(value) {
  const title = String(value ?? "").replace(/\s+/g, " ").trim();
  return title || "新对话";
}

export function deriveConversationTitle(question, maxLength = 32) {
  const normalized = normalizeTitle(question);
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, Math.max(1, maxLength - 1)).trimEnd()}…`;
}

export class ConversationRepository {
  constructor(store, { clock = () => new Date(), cryptoImpl = globalThis.crypto } = {}) {
    this.store = store;
    this.clock = clock;
    this.cryptoImpl = cryptoImpl;
  }

  timestamp() {
    return this.clock().toISOString();
  }

  async createConversation({ title = "新对话", learningUnitId = null, model = null, metadata = null } = {}) {
    const timestamp = this.timestamp();
    const record = {
      id: createId("conv", this.cryptoImpl),
      title: normalizeTitle(title),
      learningUnitId,
      model,
      metadata: sanitizePersistedMetadata(metadata),
      archived: false,
      createdAt: timestamp,
      updatedAt: timestamp,
      lastMessageAt: null,
    };
    return this.store.createConversation(record);
  }

  async getConversation(id) {
    return this.store.getConversation(id);
  }

  async listConversations({ includeArchived = false } = {}) {
    const items = await this.store.listConversations();
    return items
      .filter((conversation) => includeArchived || !conversation.archived)
      .sort((a, b) => (b.lastMessageAt ?? b.updatedAt).localeCompare(a.lastMessageAt ?? a.updatedAt));
  }

  async renameConversation(id, title) {
    const conversation = await this.requireConversation(id);
    return this.store.putConversation({
      ...conversation,
      title: normalizeTitle(title),
      updatedAt: this.timestamp(),
    });
  }

  async archiveConversation(id, archived = true) {
    const conversation = await this.requireConversation(id);
    return this.store.putConversation({
      ...conversation,
      archived: Boolean(archived),
      updatedAt: this.timestamp(),
    });
  }

  async deleteConversation(id) {
    await this.store.deleteConversation(id);
  }

  async appendMessage({
    conversationId,
    role,
    content = "",
    status = "complete",
    usage = null,
    contextSnapshotId = null,
    metadata = null,
  }) {
    const conversation = await this.requireConversation(conversationId);
    const timestamp = this.timestamp();
    const message = {
      id: createId("msg", this.cryptoImpl),
      conversationId,
      role: role === "user" ? "user" : "assistant",
      content: sanitizeSensitiveText(content),
      status,
      usage: sanitizePersistedMetadata(usage),
      contextSnapshotId,
      metadata: sanitizePersistedMetadata(metadata),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await this.store.putMessage(message);
    const shouldDeriveTitle = conversation.title === "新对话" && message.role === "user" && message.content.trim();
    await this.store.putConversation({
      ...conversation,
      title: shouldDeriveTitle ? deriveConversationTitle(message.content) : conversation.title,
      updatedAt: timestamp,
      lastMessageAt: timestamp,
    });
    return message;
  }

  async updateMessage(id, patch) {
    const current = await this.store.getMessage(id);
    if (!current) throw new Error(`Unknown message: ${id}`);
    const allowedPatch = {
      ...(Object.hasOwn(patch, "content") ? { content: sanitizeSensitiveText(patch.content) } : {}),
      ...(Object.hasOwn(patch, "status") ? { status: patch.status } : {}),
      ...(Object.hasOwn(patch, "usage") ? { usage: sanitizePersistedMetadata(patch.usage) } : {}),
      ...(Object.hasOwn(patch, "metadata") ? { metadata: sanitizePersistedMetadata(patch.metadata) } : {}),
      ...(Object.hasOwn(patch, "contextSnapshotId") ? { contextSnapshotId: patch.contextSnapshotId } : {}),
    };
    return this.store.putMessage({ ...current, ...allowedPatch, updatedAt: this.timestamp() });
  }

  async finalizeMessage(id, { content, status = "complete", usage = null, metadata } = {}) {
    return this.updateMessage(id, {
      ...(content === undefined ? {} : { content }),
      status,
      usage,
      ...(metadata === undefined ? {} : { metadata }),
    });
  }

  async listMessages(conversationId) {
    return this.store.listMessages(conversationId);
  }

  async saveContextSnapshot({ learningUnitId = null, version = 1, context }) {
    const sanitized = sanitizePersistedMetadata(context);
    const hash = stableSnapshotHash({ learningUnitId, version, context: sanitized });
    const existing = await this.store.getContextSnapshotByHash(hash);
    if (existing) return existing;
    return this.store.putContextSnapshot({
      id: createId("ctx", this.cryptoImpl),
      hash,
      version,
      learningUnitId,
      context: sanitized,
      createdAt: this.timestamp(),
    });
  }

  async saveCompaction({
    conversationId,
    summary,
    coveredThroughMessageId,
    estimatedTokensBefore = null,
    estimatedTokensAfter = null,
    version = 1,
    reason = "manual",
    timestamp = null,
    metadata = null,
  }) {
    await this.requireConversation(conversationId);
    const checkpointTimestamp = typeof timestamp === "string" && timestamp
      ? timestamp
      : this.timestamp();
    return this.store.putCompaction({
      id: createId("cmp", this.cryptoImpl),
      conversationId,
      summary: sanitizePersistedMetadata(summary),
      coveredThroughMessageId,
      estimatedTokensBefore,
      estimatedTokensAfter,
      version,
      reason: typeof reason === "string" && reason ? reason : "manual",
      timestamp: checkpointTimestamp,
      metadata: sanitizePersistedMetadata(metadata),
      createdAt: checkpointTimestamp,
    });
  }

  async listCompactions(conversationId) {
    return this.store.listCompactions(conversationId);
  }

  async recoverInterruptedMessages() {
    const messages = await this.store.listAllMessages();
    const recovered = [];
    for (const message of messages) {
      if (!ACTIVE_MESSAGE_STATUSES.has(message.status)) continue;
      const next = await this.store.putMessage({
        ...message,
        status: "interrupted",
        updatedAt: this.timestamp(),
      });
      recovered.push(next);
    }
    return recovered;
  }

  async requireConversation(id) {
    const conversation = await this.store.getConversation(id);
    if (!conversation) throw new Error(`Unknown conversation: ${id}`);
    return conversation;
  }
}

export class StreamingMessagePersister {
  constructor(repository, messageId, { intervalMs = 500, setTimeoutImpl = setTimeout, clearTimeoutImpl = clearTimeout } = {}) {
    this.repository = repository;
    this.messageId = messageId;
    this.intervalMs = intervalMs;
    this.setTimeoutImpl = setTimeoutImpl;
    this.clearTimeoutImpl = clearTimeoutImpl;
    this.timer = null;
    this.pending = null;
    this.flushing = null;
  }

  schedule(patch) {
    this.pending = { ...(this.pending ?? {}), ...patch };
    if (this.timer) return;
    const scheduleTimeout = this.setTimeoutImpl;
    this.timer = scheduleTimeout(() => {
      this.timer = null;
      void this.flush();
    }, this.intervalMs);
  }

  async flush() {
    if (this.flushing) await this.flushing;
    if (!this.pending) return null;
    const patch = this.pending;
    this.pending = null;
    this.flushing = this.repository.updateMessage(this.messageId, patch);
    try {
      return await this.flushing;
    } finally {
      this.flushing = null;
      if (this.pending && !this.timer) this.schedule({});
    }
  }

  async finalize(patch = {}) {
    if (this.timer) {
      const clearScheduledTimeout = this.clearTimeoutImpl;
      clearScheduledTimeout(this.timer);
      this.timer = null;
    }
    this.pending = { ...(this.pending ?? {}), ...patch };
    return this.flush();
  }
}
