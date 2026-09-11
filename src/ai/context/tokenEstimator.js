const DEFAULT_CALIBRATION = 1;

/**
 * Conservative, provider-neutral browser estimator. It intentionally avoids
 * pretending to be an exact tokenizer: CJK chars count as ~0.6 token and
 * other non-whitespace text as ~0.3 token, then a calibration multiplier is
 * applied. Returned values are always marked estimated.
 */
export function estimateTextTokens(text, { calibration = DEFAULT_CALIBRATION } = {}) {
  const value = typeof text === "string" ? text : "";
  let cjk = 0;
  let other = 0;

  for (const char of value) {
    if (/\p{Script=Han}|\p{Script=Hiragana}|\p{Script=Katakana}|\p{Script=Hangul}/u.test(char)) {
      cjk += 1;
    } else if (!/\s/u.test(char)) {
      other += 1;
    }
  }

  const multiplier = normalizeCalibration(calibration);
  return {
    tokens: Math.max(0, Math.ceil((cjk * 0.6 + other * 0.3) * multiplier)),
    estimated: true,
    calibration: multiplier,
    characters: value.length,
  };
}

export function estimateMessagesTokens(messages, options) {
  const list = Array.isArray(messages) ? messages : [];
  const perMessageOverhead = 4;
  const total = list.reduce((sum, message) => {
    const content = typeof message?.content === "string" ? message.content : "";
    const role = typeof message?.role === "string" ? message.role : "";
    return sum + perMessageOverhead + estimateTextTokens(role + content, options).tokens;
  }, 0);

  return { tokens: total, estimated: true };
}

/**
 * Derive a bounded multiplier from a request where both an estimate and an
 * actual provider input-token count are known. This lets the UI calibrate
 * future estimates without changing the estimator contract.
 */
export function calibrateTokenEstimate({ estimatedTokens, actualTokens, previous = 1 } = {}) {
  const estimated = Number(estimatedTokens);
  const actual = Number(actualTokens);
  if (!(estimated > 0) || !(actual > 0)) return normalizeCalibration(previous);

  const observed = actual / estimated;
  const blended = normalizeCalibration(previous) * 0.7 + observed * 0.3;
  return normalizeCalibration(blended);
}

function normalizeCalibration(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return DEFAULT_CALIBRATION;
  return Math.min(4, Math.max(0.5, number));
}
