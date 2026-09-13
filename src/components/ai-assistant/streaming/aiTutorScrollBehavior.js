export const DEFAULT_SCROLL_BOTTOM_THRESHOLD = 56;

export function getTranscriptDistanceToBottom({ scrollHeight, scrollTop, clientHeight } = {}) {
  const height = Number(scrollHeight) || 0;
  const top = Number(scrollTop) || 0;
  const viewport = Number(clientHeight) || 0;
  return Math.max(0, height - top - viewport);
}

export function isTranscriptNearBottom(metrics, threshold = DEFAULT_SCROLL_BOTTOM_THRESHOLD) {
  const resolvedThreshold = Number.isFinite(Number(threshold))
    ? Math.max(0, Number(threshold))
    : DEFAULT_SCROLL_BOTTOM_THRESHOLD;
  return getTranscriptDistanceToBottom(metrics) <= resolvedThreshold;
}

export function resolveAutoFollowState({
  current = true,
  userInitiated = false,
  metrics,
  threshold = DEFAULT_SCROLL_BOTTOM_THRESHOLD,
} = {}) {
  if (isTranscriptNearBottom(metrics, threshold)) return true;
  if (userInitiated) return false;
  return Boolean(current);
}

export function isTranscriptScrollKey(key) {
  return key === "ArrowUp" || key === "ArrowDown" || key === "PageUp" || key === "PageDown" || key === "Home" || key === "End" || key === " ";
}
