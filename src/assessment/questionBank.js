const STORAGE_VERSION = 1;
const DEFAULT_KEY = "react-learning-playground:assessment-question-bank:v1";

function normalizeText(value) {
  return String(value ?? "").trim().replace(/\s+/g, " ");
}

function hashText(value) {
  let hash = 2166136261;
  const text = normalizeText(value);
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

export function questionFingerprint({ kind, text }) {
  return `${kind}:${hashText(text)}`;
}

export function createBuiltinQuestion({ chapter, kind, text }) {
  const normalizedKind = kind === "exercise" ? "exercise" : "question";
  const normalizedText = normalizeText(text);
  const fingerprint = questionFingerprint({ kind: normalizedKind, text: normalizedText });

  return Object.freeze({
    id: `builtin:ch${String(chapter).padStart(2, "0")}:${fingerprint}`,
    source: "builtin",
    chapter,
    kind: normalizedKind,
    text: normalizedText,
    revision: fingerprint,
    fingerprint,
  });
}

export function createCustomQuestion({ id, chapter, kind = "question", text }) {
  const normalizedKind = kind === "exercise" ? "exercise" : "question";
  const normalizedText = normalizeText(text);
  const stableId = id || `custom:${globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;

  return {
    id: stableId,
    source: "custom",
    chapter,
    kind: normalizedKind,
    text: normalizedText,
    revision: questionFingerprint({ kind: normalizedKind, text: normalizedText }),
  };
}

export function structureCheckpoint(chapter, checkpoint) {
  if (!checkpoint) return [];
  return [
    ...(checkpoint.questions || []).map((text) => createBuiltinQuestion({ chapter, kind: "question", text })),
    ...(checkpoint.exercises || []).map((text) => createBuiltinQuestion({ chapter, kind: "exercise", text })),
  ];
}

function emptyState() {
  return { version: STORAGE_VERSION, overrides: {}, custom: {}, order: {} };
}

function sanitizeState(value) {
  if (!value || value.version !== STORAGE_VERSION) return emptyState();
  return {
    version: STORAGE_VERSION,
    overrides: value.overrides && typeof value.overrides === "object" ? value.overrides : {},
    custom: value.custom && typeof value.custom === "object" ? value.custom : {},
    order: value.order && typeof value.order === "object" ? value.order : {},
  };
}

export function createQuestionBankRepository({ storage = globalThis.localStorage, key = DEFAULT_KEY } = {}) {
  function load() {
    try {
      const raw = storage?.getItem?.(key);
      return raw ? sanitizeState(JSON.parse(raw)) : emptyState();
    } catch {
      return emptyState();
    }
  }

  function save(state) {
    const next = sanitizeState(state);
    try {
      storage?.setItem?.(key, JSON.stringify(next));
      return { ok: true, state: next };
    } catch (error) {
      return { ok: false, state: next, error };
    }
  }

  function update(mutator) {
    const state = load();
    const next = mutator(structuredClone(state));
    return save(next);
  }

  return {
    key,
    load,
    save,
    clear() {
      try {
        storage?.removeItem?.(key);
        return { ok: true };
      } catch (error) {
        return { ok: false, error };
      }
    },
    setOverride(id, patch) {
      return update((state) => {
        const previous = state.overrides[id] || {};
        state.overrides[id] = { ...previous, ...patch };
        return state;
      });
    },
    clearOverride(id) {
      return update((state) => {
        delete state.overrides[id];
        return state;
      });
    },
    upsertCustom(item) {
      return update((state) => {
        state.custom[item.id] = item;
        return state;
      });
    },
    deleteCustom(id) {
      return update((state) => {
        delete state.custom[id];
        for (const ids of Object.values(state.order)) {
          const index = ids.indexOf(id);
          if (index >= 0) ids.splice(index, 1);
        }
        return state;
      });
    },
    setOrder(chapter, kind, ids) {
      return update((state) => {
        state.order[`${chapter}:${kind}`] = [...ids];
        return state;
      });
    },
  };
}

export function resolveQuestionBank({ chapter, checkpoint, state }) {
  const safeState = sanitizeState(state);
  const builtins = structureCheckpoint(chapter, checkpoint).map((item) => {
    const override = safeState.overrides[item.id] || {};
    return {
      ...item,
      text: normalizeText(override.text ?? item.text),
      hidden: Boolean(override.hidden),
      overridden: Object.keys(override).length > 0,
      originalText: item.text,
    };
  });

  const custom = Object.values(safeState.custom)
    .filter((item) => item.chapter === chapter)
    .map((item) => ({ ...item, hidden: false, overridden: false, originalText: null }));

  return ["question", "exercise"].flatMap((kind) => {
    const items = [...builtins, ...custom].filter((item) => item.kind === kind);
    const configuredOrder = safeState.order[`${chapter}:${kind}`] || [];
    const rank = new Map(configuredOrder.map((id, index) => [id, index]));
    return items.sort((a, b) => {
      const aRank = rank.has(a.id) ? rank.get(a.id) : Number.MAX_SAFE_INTEGER;
      const bRank = rank.has(b.id) ? rank.get(b.id) : Number.MAX_SAFE_INTEGER;
      return aRank - bRank;
    });
  });
}

export function migratePositionalOverrides({ chapter, checkpoint, legacy }) {
  const builtins = structureCheckpoint(chapter, checkpoint);
  const migrated = {};
  if (!legacy || typeof legacy !== "object") return migrated;

  for (const [legacyId, patch] of Object.entries(legacy)) {
    const match = /^(question|exercise):(\d+)$/.exec(legacyId);
    if (!match) continue;
    const kind = match[1];
    const index = Number(match[2]);
    const target = builtins.filter((item) => item.kind === kind)[index];
    if (target) migrated[target.id] = patch;
  }
  return migrated;
}
