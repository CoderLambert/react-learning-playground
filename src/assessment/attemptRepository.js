import { ATTEMPT_VERSION } from "./practiceAttempt.js";

const STORAGE_PREFIX = "react-learning-playground:assessment-attempt";

function keyFor(chapter, sessionId = "current") {
  return `${STORAGE_PREFIX}:v${ATTEMPT_VERSION}:chapter-${chapter}:${sessionId}`;
}

function safeParse(raw) {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== ATTEMPT_VERSION || typeof parsed.chapter !== "number") return null;
    if (!parsed.answers || typeof parsed.answers !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function createAttemptRepository(storage = globalThis.localStorage) {
  return {
    load(chapter, sessionId = "current") {
      if (!storage) return null;
      return safeParse(storage.getItem(keyFor(chapter, sessionId)));
    },
    save(attempt, sessionId = "current") {
      if (!storage) return false;
      try {
        storage.setItem(keyFor(attempt.chapter, sessionId), JSON.stringify(attempt));
        return true;
      } catch {
        return false;
      }
    },
    clear(chapter, sessionId = "current") {
      if (!storage) return false;
      try {
        storage.removeItem(keyFor(chapter, sessionId));
        return true;
      } catch {
        return false;
      }
    },
  };
}

export function createMemoryStorage(seed = {}) {
  const values = new Map(Object.entries(seed));
  return {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); },
    removeItem(key) { values.delete(key); },
  };
}
