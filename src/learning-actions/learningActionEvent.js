export const LEARNING_ACTION_EVENT = "react-learning:learning-action";

const recentDeliveries = new WeakMap();
const DEFAULT_DEDUPE_WINDOW_MS = 300;

function normalizePrompt(value) {
  return typeof value === "string" ? value.trim() : "";
}

function createDeliveryKey(detail) {
  return [
    detail?.action ?? "",
    detail?.context?.kind ?? "",
    detail?.context?.learningUnitId ?? "",
    detail?.context?.fileName ?? "",
    detail?.context?.range?.startLine ?? "",
    detail?.context?.range?.endLine ?? "",
    normalizePrompt(detail?.prompt),
  ].join("|");
}

export function emitLearningAction(
  detail,
  target = globalThis.window,
  { now = Date.now(), dedupeWindowMs = DEFAULT_DEDUPE_WINDOW_MS } = {},
) {
  const prompt = normalizePrompt(detail?.prompt);
  if (!prompt || typeof target?.dispatchEvent !== "function") return false;

  const deliveryKey = createDeliveryKey({ ...detail, prompt });
  const previous = recentDeliveries.get(target);
  if (
    previous &&
    previous.key === deliveryKey &&
    now - previous.at >= 0 &&
    now - previous.at < dedupeWindowMs
  ) {
    return false;
  }

  recentDeliveries.set(target, { key: deliveryKey, at: now });
  target.dispatchEvent(new CustomEvent(LEARNING_ACTION_EVENT, {
    detail: Object.freeze({ ...detail, prompt }),
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
