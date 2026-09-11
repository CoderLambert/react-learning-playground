export const AI_ASSISTANT_MAX_OUTPUT_CHARS = 6_000;

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
    characterCount: Math.min(limit, currentCharacters.length + acceptedCharacters.length),
    outputLimitExceeded: incomingCharacters.length > remaining,
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
      characterCount += Math.min(remaining, incomingCharacters.length);

      if (incomingCharacters.length > remaining) {
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
