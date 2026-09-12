import { ASSESSMENT_ERROR_CODES, AssessmentError } from "./assessmentErrors.js";
import { assertQuestionRecord } from "./question.js";

export const ASSESSMENT_SESSION_STATUSES = Object.freeze({ IN_PROGRESS: "in_progress", COMPLETED: "completed" });
const STATUS_VALUES = new Set(Object.values(ASSESSMENT_SESSION_STATUSES));

export function createSessionItem(question) {
  assertQuestionRecord(question);
  return {
    questionId: question.id,
    revision: question.revision,
    snapshot: structuredClone(question),
  };
}

export function assertAssessmentSession(session) {
  if (!session || typeof session !== "object" || Array.isArray(session)) {
    throw new AssessmentError(ASSESSMENT_ERROR_CODES.SESSION_NOT_FOUND, "assessment session must be an object");
  }
  if (typeof session.id !== "string" || !session.id.trim()) throw new TypeError("session.id is required");
  if (typeof session.learningUnitId !== "string" || !session.learningUnitId.trim()) throw new TypeError("session.learningUnitId is required");
  if (!Array.isArray(session.items) || session.items.length === 0) throw new TypeError("session.items must be non-empty");
  for (const [index, item] of session.items.entries()) {
    if (!item || typeof item !== "object" || Array.isArray(item)) throw new TypeError(`session.items[${index}] must be an object`);
    if (typeof item.questionId !== "string" || !item.questionId.trim()) throw new TypeError(`session.items[${index}].questionId is required`);
    if (!Number.isInteger(item.revision) || item.revision < 1) throw new TypeError(`session.items[${index}].revision must be positive`);
    assertQuestionRecord(item.snapshot);
    if (item.snapshot.id !== item.questionId || item.snapshot.revision !== item.revision) throw new TypeError(`session.items[${index}] snapshot identity does not match`);
  }
  if (!STATUS_VALUES.has(session.status)) throw new TypeError(`unsupported session status: ${String(session.status)}`);
  if (typeof session.startedAt !== "string" || !session.startedAt.trim()) throw new TypeError("session.startedAt is required");
  if (session.status === ASSESSMENT_SESSION_STATUSES.COMPLETED && (typeof session.completedAt !== "string" || !session.completedAt.trim())) throw new TypeError("completed session requires completedAt");
  return session;
}
