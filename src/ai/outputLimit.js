export const AI_ASSISTANT_MAX_OUTPUT_CHARS = Number.POSITIVE_INFINITY;

function toUnicodeCharacters(value) {
  return Array.from(typeof value === "string" ? value : String(value ?? ""));
}

export function countUnicodeCharacters(value) {
  return toUnicodeCharacters(value).length;
}

export function appendWithinOutputLimit(
  currentContent,
  delta,
  maxCharacters = AI_ASSISTANT_MAX_OUTPUT_CHARS,
) {
  const limit = Number.isFinite(maxCharacters)
    ? Math.max(0, Math.floor(maxCharacters))
    : AI_ASSISTANT_MAX_OUTPUT_CHARS;
  const current = typeof currentContent === "string" ? currentContent : String(currentContent ?? "");
  const currentCharacters = toUnicodeCharacters(current);
  const incomingCharacters = toUnicodeCharacters(delta);
  const remaining = Math.max(0, limit - currentCharacters.length);
  const acceptedCharacters = incomingCharacters.slice(0, remaining);
  const acceptedText = acceptedCharacters.join("");

  return {
    content: `${current}${acceptedText}`,
    acceptedText,
    characterCount: Number.isFinite(limit)
      ? Math.min(limit, currentCharacters.length + acceptedCharacters.length)
      : currentCharacters.length + acceptedCharacters.length,
    outputLimitExceeded: Number.isFinite(limit) && incomingCharacters.length > remaining,
  };
}

export function createUnicodeOutputLimiter({
  maxCharacters = AI_ASSISTANT_MAX_OUTPUT_CHARS,
  onOutputLimitExceeded,
} = {}) {
  const limit = Number.isFinite(maxCharacters)
    ? Math.max(0, Math.floor(maxCharacters))
    : AI_ASSISTANT_MAX_OUTPUT_CHARS;
  let content = "";
  let characterCount = 0;
  let outputLimitExceeded = false;

  return {
    push(delta) {
      if (outputLimitExceeded) {
        return { content, acceptedText: "", characterCount, outputLimitExceeded: true };
      }

      const incomingCharacters = toUnicodeCharacters(delta);
      const remaining = Math.max(0, limit - characterCount);
      const acceptedText = incomingCharacters.slice(0, remaining).join("");
      content += acceptedText;
      characterCount += Number.isFinite(limit)
        ? Math.min(remaining, incomingCharacters.length)
        : incomingCharacters.length;

      if (Number.isFinite(limit) && incomingCharacters.length > remaining) {
        outputLimitExceeded = true;
        onOutputLimitExceeded?.();
      }

      return { content, acceptedText, characterCount, outputLimitExceeded };
    },
    snapshot() {
      return { content, characterCount, outputLimitExceeded };
    },
  };
}
