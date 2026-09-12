const PREFIX_PATTERN = /^[a-z][a-z0-9_-]*$/i;

export function createId(
  prefix,
  { randomUUID = globalThis.crypto?.randomUUID?.bind(globalThis.crypto) } = {},
) {
  if (typeof prefix !== "string" || !PREFIX_PATTERN.test(prefix)) {
    throw new TypeError("id prefix must contain only letters, numbers, underscores, or hyphens");
  }
  if (typeof randomUUID !== "function") {
    throw new TypeError("randomUUID implementation is required");
  }
  return `${prefix}_${randomUUID()}`;
}
