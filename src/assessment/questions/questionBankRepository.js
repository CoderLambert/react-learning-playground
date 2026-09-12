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
  return window.localStorage;
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
    if (!storage) return state;
    const normalized = normalizeState(state);
    storage.setItem(QUESTION_BANK_STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  };

  const update = (recipe) => {
    const next = recipe(read());
    return write(next);
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
        return {
          ...item,
          prompt: override?.prompt?.trim() || item.prompt,
          hidden: Boolean(override?.hidden),
          customized: Boolean(override?.prompt),
          revision: `${item.id}:${override?.prompt?.trim() || item.prompt}`,
        };
      };
      const custom = state.customQuestions
        .filter((item) => item.chapter === chapter)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((item) => ({ ...item, hidden: false, customized: true, revision: `${item.id}:${item.prompt}` }));

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
    addCustom({ chapter, kind, prompt }) {
      const createdAt = Date.now();
      const id = `custom-ch${String(chapter).padStart(2, "0")}-${createdAt.toString(36)}`;
      const item = {
        id,
        chapter,
        kind: kind === "exercise" ? "exercise" : "question",
        prompt: prompt.trim(),
        origin: "user",
        order: createdAt,
      };
      update((state) => ({ ...state, customQuestions: [...state.customQuestions, item] }));
      return item;
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
