const STORAGE_VERSION = 1;
const STORAGE_KEY = "react-learning-assessment-attempts:v1";

function nowIso(now = new Date()) {
  return (now instanceof Date ? now : new Date(now)).toISOString();
}

function safeParse(raw) {
  if (!raw) return { version: STORAGE_VERSION, attempts: {}, sessions: {} };
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.version !== STORAGE_VERSION || typeof parsed.attempts !== "object" || typeof parsed.sessions !== "object") {
      return { version: STORAGE_VERSION, attempts: {}, sessions: {} };
    }
    return parsed;
  } catch {
    return { version: STORAGE_VERSION, attempts: {}, sessions: {} };
  }
}

export function createQuestionRevision(question) {
  const source = `${question?.id ?? ""}\n${question?.prompt ?? ""}\n${question?.kind ?? "question"}`;
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function attemptKey(chapter, questionId) {
  return `${chapter}:${questionId}`;
}

export class AttemptRepository {
  constructor({ storage = globalThis.localStorage, key = STORAGE_KEY } = {}) {
    this.storage = storage;
    this.key = key;
  }

  readState() {
    try {
      return safeParse(this.storage?.getItem?.(this.key));
    } catch {
      return { version: STORAGE_VERSION, attempts: {}, sessions: {} };
    }
  }

  writeState(state) {
    this.storage?.setItem?.(this.key, JSON.stringify(state));
  }

  listAttempts(chapter) {
    const state = this.readState();
    return Object.values(state.attempts).filter((attempt) => attempt.chapter === chapter);
  }

  getAttempt({ chapter, question }) {
    const attempt = this.readState().attempts[attemptKey(chapter, question.id)] ?? null;
    if (!attempt) return null;
    return attempt.questionRevision === createQuestionRevision(question) ? attempt : null;
  }

  saveAttempt({ chapter, question, answer = "", confidence = "unset", status = "answered", selfAssessment = "unset", now = new Date() }) {
    const state = this.readState();
    const key = attemptKey(chapter, question.id);
    const previous = state.attempts[key];
    const timestamp = nowIso(now);
    const attempt = {
      questionId: question.id,
      questionRevision: createQuestionRevision(question),
      chapter,
      answer: String(answer),
      confidence,
      status,
      selfAssessment,
      createdAt: previous?.createdAt ?? timestamp,
      updatedAt: timestamp,
    };
    state.attempts[key] = attempt;
    this.writeState(state);
    return attempt;
  }

  saveSession({ chapter, currentQuestionId = null, completed = false, now = new Date() }) {
    const state = this.readState();
    state.sessions[String(chapter)] = {
      chapter,
      currentQuestionId,
      completed,
      updatedAt: nowIso(now),
    };
    this.writeState(state);
    return state.sessions[String(chapter)];
  }

  getSession(chapter) {
    return this.readState().sessions[String(chapter)] ?? null;
  }

  clearChapter(chapter) {
    const state = this.readState();
    Object.entries(state.attempts).forEach(([key, attempt]) => {
      if (attempt.chapter === chapter) delete state.attempts[key];
    });
    delete state.sessions[String(chapter)];
    this.writeState(state);
  }
}

export { STORAGE_KEY as ATTEMPT_STORAGE_KEY, STORAGE_VERSION as ATTEMPT_STORAGE_VERSION };
