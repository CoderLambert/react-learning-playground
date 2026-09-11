export const AI_FINISH_REASONS = Object.freeze({
  STOP: "stop",
  LENGTH: "length",
  USER_ABORT: "user_abort",
  OUTPUT_LIMIT: "output_limit",
  ERROR: "error",
});

const NORMALIZED_FINISH_REASONS = new Set(Object.values(AI_FINISH_REASONS));

const FINISH_REASON_ALIASES = new Map([
  ["end_turn", AI_FINISH_REASONS.STOP],
  ["eos", AI_FINISH_REASONS.STOP],
  ["complete", AI_FINISH_REASONS.STOP],
  ["completed", AI_FINISH_REASONS.STOP],
  ["max_tokens", AI_FINISH_REASONS.LENGTH],
  ["max_output_tokens", AI_FINISH_REASONS.LENGTH],
  ["token_limit", AI_FINISH_REASONS.LENGTH],
  ["abort", AI_FINISH_REASONS.USER_ABORT],
  ["aborted", AI_FINISH_REASONS.USER_ABORT],
  ["cancel", AI_FINISH_REASONS.USER_ABORT],
  ["canceled", AI_FINISH_REASONS.USER_ABORT],
  ["cancelled", AI_FINISH_REASONS.USER_ABORT],
  ["output-limit", AI_FINISH_REASONS.OUTPUT_LIMIT],
  ["output_limit_reached", AI_FINISH_REASONS.OUTPUT_LIMIT],
  ["failed", AI_FINISH_REASONS.ERROR],
  ["failure", AI_FINISH_REASONS.ERROR],
  ["content_filter", AI_FINISH_REASONS.ERROR],
]);

export function normalizeFinishReason(value, fallback = AI_FINISH_REASONS.STOP) {
  const normalizedFallback = NORMALIZED_FINISH_REASONS.has(fallback)
    ? fallback
    : AI_FINISH_REASONS.ERROR;
  if (typeof value !== "string" || !value.trim()) return normalizedFallback;

  const reason = value.trim().toLowerCase();
  if (NORMALIZED_FINISH_REASONS.has(reason)) return reason;
  return FINISH_REASON_ALIASES.get(reason) ?? AI_FINISH_REASONS.ERROR;
}
