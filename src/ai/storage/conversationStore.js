const DB_NAME = "react-learning-ai";
// Keep AI audit records in the same AI database as conversations, but in
// separate stores. Assessment data deliberately lives in its own database.
const DB_VERSION = 2;

const SECRET_KEY_PATTERN = /^(api[-_]?key|authorization|access[-_]?token|refresh[-_]?token|secret)$/i;
export const REDACTED_SECRET = "[REDACTED]";

export function sanitizeSensitiveText(value) {
  let result = typeof value === "string" ? value : String(value ?? "");
  result = result.replace(
    /\b(authorization)\b(\s*[:=]\s*)Bearer\s+[A-Za-z0-9._~+/=-]+/giu,
    (_match, label, separator) => `${label}${separator}${REDACTED_SECRET}`,
  );
  result = result.replace(/\bBearer\s+[A-Za-z0-9._~+/=-]+/giu, `Bearer ${REDACTED_SECRET}`);
  result = result.replace(/\bsk-[A-Za-z0-9_-]{8,}\b/gu, REDACTED_SECRET);
  result = result.replace(
    /\b(api[-_ ]?key|authorization|access[-_ ]?token|refresh[-_ ]?token|auth[-_ ]?token|secret)\b(\s*[:=]\s*)(?:\[[^\]]*\]|"[^"]*"|'[^']*'|[^\s,;}\]]+)/giu,
    (_match, label, separator) => `${label}${separator}${REDACTED_SECRET}`,
  );
  result = result.replace(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/gu, REDACTED_SECRET);
  return result;
}

function nowIso(clock = Date) {
  return new clock().toISOString();
}

function cloneValue(value) {
  return value == null ? value : structuredClone(value);
}

export function sanitizePersistedMetadata(value) {
  if (typeof value === "string") return sanitizeSensitiveText(value);
  if (value == null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(sanitizePersistedMetadata);

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !SECRET_KEY_PATTERN.test(key))
      .map(([key, nested]) => [key, sanitizePersistedMetadata(nested)]),
  );
}

function stableStringify(value) {
  if (value == null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
}

export function stableSnapshotHash(value) {
  const input = stableStringify(sanitizePersistedMetadata(value));
  let hash = 0x811c9dc5;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return `fnv1a-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

function requestToPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed"));
  });
}

function transactionDone(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error("IndexedDB transaction failed"));
    transaction.onabort = () => reject(transaction.error ?? new Error("IndexedDB transaction aborted"));
  });
}

function openIndexedDb(indexedDb, name = DB_NAME) {
  return new Promise((resolve, reject) => {
    const request = indexedDb.open(name, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("conversations")) {
        const conversations = db.createObjectStore("conversations", { keyPath: "id" });
        conversations.createIndex("updatedAt", "updatedAt");
        conversations.createIndex("lastMessageAt", "lastMessageAt");
        conversations.createIndex("learningUnitId", "learningUnitId");
        conversations.createIndex("archived", "archived");
      }
      if (!db.objectStoreNames.contains("messages")) {
        const messages = db.createObjectStore("messages", { keyPath: "id" });
        messages.createIndex("conversationId", "conversationId");
        messages.createIndex("conversationCreated", ["conversationId", "createdAt"]);
        messages.createIndex("status", "status");
      }
      if (!db.objectStoreNames.contains("contextSnapshots")) {
        const snapshots = db.createObjectStore("contextSnapshots", { keyPath: "id" });
        snapshots.createIndex("hash", "hash", { unique: true });
        snapshots.createIndex("learningUnitId", "learningUnitId");
      }
      if (!db.objectStoreNames.contains("compactions")) {
        const compactions = db.createObjectStore("compactions", { keyPath: "id" });
        compactions.createIndex("conversationId", "conversationId");
        compactions.createIndex("conversationCreated", ["conversationId", "createdAt"]);
      }
      if (!db.objectStoreNames.contains("agentRuns")) {
        const runs = db.createObjectStore("agentRuns", { keyPath: "id" });
        runs.createIndex("status", "status");
        runs.createIndex("conversationId", "conversationId");
        runs.createIndex("createdAt", "createdAt");
      }
      if (!db.objectStoreNames.contains("toolExecutions")) {
        const executions = db.createObjectStore("toolExecutions", { keyPath: "id" });
        executions.createIndex("agentRunId", "agentRunId");
        executions.createIndex("toolCallId", "toolCallId");
        executions.createIndex("startedAt", "startedAt");
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Unable to open IndexedDB"));
    request.onblocked = () => reject(new Error("IndexedDB upgrade is blocked by another tab"));
  });
}

function createMemoryState() {
  return {
    conversations: new Map(),
    messages: new Map(),
    contextSnapshots: new Map(),
    compactions: new Map(),
  };
}

export class MemoryConversationStore {
  constructor({ clock = Date } = {}) {
    this.clock = clock;
    this.state = createMemoryState();
    this.mode = "memory";
  }

  async createConversation(record) {
    this.state.conversations.set(record.id, cloneValue(record));
    return cloneValue(record);
  }

  async putConversation(record) {
    this.state.conversations.set(record.id, cloneValue(record));
    return cloneValue(record);
  }

  async getConversation(id) {
    return cloneValue(this.state.conversations.get(id) ?? null);
  }

  async listConversations() {
    return [...this.state.conversations.values()].map(cloneValue);
  }

  async deleteConversation(id) {
    this.state.conversations.delete(id);
    for (const [messageId, message] of this.state.messages) {
      if (message.conversationId === id) this.state.messages.delete(messageId);
    }
    for (const [compactionId, compaction] of this.state.compactions) {
      if (compaction.conversationId === id) this.state.compactions.delete(compactionId);
    }
  }

  async putMessage(record) {
    this.state.messages.set(record.id, cloneValue(record));
    return cloneValue(record);
  }

  async getMessage(id) {
    return cloneValue(this.state.messages.get(id) ?? null);
  }

  async listMessages(conversationId) {
    return [...this.state.messages.values()]
      .filter((message) => message.conversationId === conversationId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id))
      .map(cloneValue);
  }

  async listAllMessages() {
    return [...this.state.messages.values()].map(cloneValue);
  }

  async putContextSnapshot(record) {
    const existing = [...this.state.contextSnapshots.values()].find((item) => item.hash === record.hash);
    if (existing) return cloneValue(existing);
    this.state.contextSnapshots.set(record.id, cloneValue(record));
    return cloneValue(record);
  }

  async getContextSnapshotByHash(hash) {
    return cloneValue([...this.state.contextSnapshots.values()].find((item) => item.hash === hash) ?? null);
  }

  async putCompaction(record) {
    this.state.compactions.set(record.id, cloneValue(record));
    return cloneValue(record);
  }

  async listCompactions(conversationId) {
    return [...this.state.compactions.values()]
      .filter((item) => item.conversationId === conversationId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .map(cloneValue);
  }

  close() {}
}

export class IndexedDbConversationStore {
  constructor(db) {
    this.db = db;
    this.mode = "indexeddb";
  }

  async createConversation(record) {
    await requestToPromise(this.db.transaction("conversations", "readwrite").objectStore("conversations").add(record));
    return cloneValue(record);
  }

  async putConversation(record) {
    await requestToPromise(this.db.transaction("conversations", "readwrite").objectStore("conversations").put(record));
    return cloneValue(record);
  }

  async getConversation(id) {
    return cloneValue(await requestToPromise(this.db.transaction("conversations", "readonly").objectStore("conversations").get(id)) ?? null);
  }

  async listConversations() {
    return (await requestToPromise(this.db.transaction("conversations", "readonly").objectStore("conversations").getAll())).map(cloneValue);
  }

  async deleteConversation(id) {
    const transaction = this.db.transaction(["conversations", "messages", "compactions"], "readwrite");
    transaction.objectStore("conversations").delete(id);

    for (const storeName of ["messages", "compactions"]) {
      const store = transaction.objectStore(storeName);
      const index = store.index("conversationId");
      const request = index.openKeyCursor(IDBKeyRange.only(id));
      request.onsuccess = () => {
        const cursor = request.result;
        if (!cursor) return;
        store.delete(cursor.primaryKey);
        cursor.continue();
      };
    }
    await transactionDone(transaction);
  }

  async putMessage(record) {
    await requestToPromise(this.db.transaction("messages", "readwrite").objectStore("messages").put(record));
    return cloneValue(record);
  }

  async getMessage(id) {
    return cloneValue(await requestToPromise(this.db.transaction("messages", "readonly").objectStore("messages").get(id)) ?? null);
  }

  async listMessages(conversationId) {
    const transaction = this.db.transaction("messages", "readonly");
    const request = transaction.objectStore("messages").index("conversationCreated").getAll(
      IDBKeyRange.bound([conversationId, ""], [conversationId, "\uffff"]),
    );
    return (await requestToPromise(request)).map(cloneValue);
  }

  async listAllMessages() {
    return (await requestToPromise(this.db.transaction("messages", "readonly").objectStore("messages").getAll())).map(cloneValue);
  }

  async putContextSnapshot(record) {
    const existing = await this.getContextSnapshotByHash(record.hash);
    if (existing) return existing;
    try {
      await requestToPromise(this.db.transaction("contextSnapshots", "readwrite").objectStore("contextSnapshots").add(record));
      return cloneValue(record);
    } catch (error) {
      const concurrent = await this.getContextSnapshotByHash(record.hash);
      if (concurrent) return concurrent;
      throw error;
    }
  }

  async getContextSnapshotByHash(hash) {
    return cloneValue(await requestToPromise(
      this.db.transaction("contextSnapshots", "readonly").objectStore("contextSnapshots").index("hash").get(hash),
    ) ?? null);
  }

  async putCompaction(record) {
    await requestToPromise(this.db.transaction("compactions", "readwrite").objectStore("compactions").put(record));
    return cloneValue(record);
  }

  async listCompactions(conversationId) {
    const request = this.db.transaction("compactions", "readonly")
      .objectStore("compactions")
      .index("conversationCreated")
      .getAll(IDBKeyRange.bound([conversationId, ""], [conversationId, "\uffff"]));
    return (await requestToPromise(request)).map(cloneValue);
  }

  close() {
    this.db.close();
  }
}

export async function createConversationStore({
  indexedDb = globalThis.indexedDB,
  dbName = DB_NAME,
  fallback = true,
} = {}) {
  if (!indexedDb) {
    if (!fallback) throw new Error("IndexedDB is unavailable");
    const memory = new MemoryConversationStore();
    memory.fallbackReason = "IndexedDB is unavailable";
    return memory;
  }

  try {
    return new IndexedDbConversationStore(await openIndexedDb(indexedDb, dbName));
  } catch (error) {
    if (!fallback) throw error;
    const memory = new MemoryConversationStore();
    memory.fallbackReason = error instanceof Error ? error.message : String(error);
    return memory;
  }
}

export const conversationStorageSchema = Object.freeze({
  name: DB_NAME,
  version: DB_VERSION,
  stores: Object.freeze(["conversations", "messages", "contextSnapshots", "compactions", "agentRuns", "toolExecutions"]),
});

// Exported for the agent audit adapter. It intentionally shares the AI DB
// migration path with conversation persistence rather than opening a second,
// competing database with the same name.
export { nowIso, openIndexedDb };
