import { getBuiltinCheckpoint } from "./checkpoints.js";

export const QUESTION_BANK_STORAGE_KEY = "react-learning-assessment-question-bank:v1";
const STORAGE_VERSION = 1;

const EMPTY_STATE = Object.freeze({
  version: STORAGE_VERSION,
  overrides: {},
  customQuestions: [],
});

function cloneEmptyState() {
  return { version: STORAGE_VERSION, overrides: {}, customQuestions: [] };
}

function normalizeState(value) {
  if (!value || value.version !== STORAGE_VERSION || typeof value.overrides !== "object" || !Array.isArray(value.customQuestions)) {
    return cloneEmptyState();
  }
  return {
    version: STORAGE_VERSION,
    overrides: value.overrides ?? {},
    customQuestions: value.customQuestions.filter((item) => item && typeof item.id === "string" && typeof item.prompt === "string"),
  };
}

function getDefaultStorage() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function getQuestionFingerprint(item) {
  const source = `${item.id}|${item.kind}|${item.prompt}`;
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `qv1-${(hash >>> 0).toString(36)}`;
}

function createCustomId(chapter) {
  const time = Date.now().toString(36);
  const entropy = Math.random().toString(36).slice(2, 7);
  return `custom-ch${String(chapter).padStart(2, "0")}-${time}-${entropy}`;
}

export function createQuestionBankRepository(storage = getDefaultStorage()) {
  const read = () => {
    if (!storage) return cloneEmptyState();
    try {
      const raw = storage.getItem(QUESTION_BANK_STORAGE_KEY);
      if (!raw) return cloneEmptyState();
      return normalizeState(JSON.parse(raw));
    } catch {
      return cloneEmptyState();
    }
  };

  const write = (state) => {
    if (!storage) return normalizeState(state);
    const normalized = normalizeState(state);
    storage.setItem(QUESTION_BANK_STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  };

  const update = (recipe) => {
    const next = recipe(read());
    return write(next);
  };

  const addCustom = ({ chapter, kind, prompt }) => {
    const createdAt = Date.now();
    const item = {
      id: createCustomId(chapter),
      chapter,
      kind: kind === "exercise" ? "exercise" : "question",
      prompt: prompt.trim(),
      origin: "user",
      order: createdAt,
    };
    update((state) => ({ ...state, customQuestions: [...state.customQuestions, item] }));
    return item;
  };

  return {
    read,
    write,
    resolveChapter(chapter) {
      const builtin = getBuiltinCheckpoint(chapter);
      if (!builtin) return null;
      const state = read();
      const applyOverride = (item) => {
        const override = state.overrides[item.id];
        const resolved = {
          ...item,
          prompt: override?.prompt?.trim() || item.prompt,
          hidden: Boolean(override?.hidden),
          customized: Boolean(override?.prompt),
        };
        return { ...resolved, revision: getQuestionFingerprint(resolved) };
      };
      const custom = state.customQuestions
        .filter((item) => item.chapter === chapter)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((item) => ({ ...item, hidden: false, customized: true, revision: getQuestionFingerprint(item) }));

      return {
        ...builtin,
        questions: [...builtin.questions.map(applyOverride), ...custom.filter((item) => item.kind === "question")],
        exercises: [...builtin.exercises.map(applyOverride), ...custom.filter((item) => item.kind === "exercise")],
      };
    },
    setBuiltinPrompt(questionId, prompt) {
      return update((state) => ({
        ...state,
        overrides: {
          ...state.overrides,
          [questionId]: { ...state.overrides[questionId], prompt: prompt.trim() },
        },
      }));
    },
    setBuiltinHidden(questionId, hidden) {
      return update((state) => ({
        ...state,
        overrides: {
          ...state.overrides,
          [questionId]: { ...state.overrides[questionId], hidden: Boolean(hidden) },
        },
      }));
    },
    restoreBuiltin(questionId) {
      return update((state) => {
        const overrides = { ...state.overrides };
        delete overrides[questionId];
        return { ...state, overrides };
      });
    },
    addCustom,
    duplicate(item) {
      return addCustom({ chapter: item.chapter, kind: item.kind, prompt: item.prompt });
    },
    updateCustom(questionId, patch) {
      return update((state) => ({
        ...state,
        customQuestions: state.customQuestions.map((item) => item.id === questionId ? {
          ...item,
          ...(typeof patch.prompt === "string" ? { prompt: patch.prompt.trim() } : {}),
          ...(patch.kind ? { kind: patch.kind === "exercise" ? "exercise" : "question" } : {}),
          ...(typeof patch.order === "number" ? { order: patch.order } : {}),
        } : item),
      }));
    },
    moveCustom(questionId, direction) {
      return update((state) => {
        const target = state.customQuestions.find((item) => item.id === questionId);
        if (!target) return state;
        const siblings = state.customQuestions
          .filter((item) => item.chapter === target.chapter && item.kind === target.kind)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        const index = siblings.findIndex((item) => item.id === questionId);
        const nextIndex = direction === "up" ? index - 1 : index + 1;
        if (index < 0 || nextIndex < 0 || nextIndex >= siblings.length) return state;
        const neighbor = siblings[nextIndex];
        const targetOrder = target.order ?? index;
        const neighborOrder = neighbor.order ?? nextIndex;
        return {
          ...state,
          customQuestions: state.customQuestions.map((item) => {
            if (item.id === target.id) return { ...item, order: neighborOrder };
            if (item.id === neighbor.id) return { ...item, order: targetOrder };
            return item;
          }),
        };
      });
    },
    deleteCustom(questionId) {
      return update((state) => ({
        ...state,
        customQuestions: state.customQuestions.filter((item) => item.id !== questionId),
      }));
    },
    resetAll() {
      return write(EMPTY_STATE);
    },
  };
}
