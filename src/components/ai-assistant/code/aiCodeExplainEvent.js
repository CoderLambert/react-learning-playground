export const AI_CODE_EXPLAIN_EVENT = "ai-tutor:explain-code";

export function requestAiCodeExplanation(detail, target = globalThis) {
  if (!detail?.code || typeof target?.dispatchEvent !== "function" || typeof globalThis.CustomEvent !== "function") {
    return false;
  }

  target.dispatchEvent(new CustomEvent(AI_CODE_EXPLAIN_EVENT, {
    detail: {
      code: String(detail.code),
      language: String(detail.language || "text"),
      label: String(detail.label || ""),
    },
  }));
  return true;
}
