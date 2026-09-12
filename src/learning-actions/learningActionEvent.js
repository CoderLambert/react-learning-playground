export const LEARNING_ACTION_EVENT = "react-learning:learning-action";

export function emitLearningAction(detail, target = globalThis.window) {
  if (!detail?.prompt || typeof target?.dispatchEvent !== "function") return false;
  target.dispatchEvent(new CustomEvent(LEARNING_ACTION_EVENT, {
    detail: Object.freeze({ ...detail }),
  }));
  return true;
}

export function subscribeLearningActions(listener, target = globalThis.window) {
  if (typeof listener !== "function" || typeof target?.addEventListener !== "function") {
    return () => {};
  }
  const handle = (event) => listener(event?.detail ?? null);
  target.addEventListener(LEARNING_ACTION_EVENT, handle);
  return () => target.removeEventListener(LEARNING_ACTION_EVENT, handle);
}
