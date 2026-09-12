import {
  normalizeCreateQuestionsCommand,
  normalizeGetQuestionQuery,
  normalizeListQuestionsQuery,
  normalizeRetireQuestionCommand,
  normalizeUpdateQuestionCommand,
} from "../application/assessmentPorts.js";
import { ASSESSMENT_ERROR_CODES, AssessmentError } from "../domain/assessmentErrors.js";

export const PERSISTED_QUESTION_STATUSES = new Set(["active", "retired"]);

export function cloneValue(value) {
  return value == null ? value : structuredClone(value);
}

export function nowIso(clock = () => new Date()) {
  const value = typeof clock === "function" ? clock() : new Date();
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) throw new TypeError("clock must return a valid date");
  return date.toISOString();
}

export function requiredRecord(value, field) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError(`${field} must be an object`);
  }
  return value;
}

export function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) {
    throw new TypeError(`${field} is required`);
  }
  return value.trim();
}

export function requiredQuestionRecord(question, learningUnitId, field = "question") {
  const record = requiredRecord(question, field);
  const id = requiredText(record.id, `${field}.id`);
  const recordLearningUnitId = requiredText(record.learningUnitId, `${field}.learningUnitId`);
  if (recordLearningUnitId !== learningUnitId) {
    throw new AssessmentError(
      ASSESSMENT_ERROR_CODES.QUESTION_NOT_FOUND,
      `${field} is outside the requested learning unit`,
      { details: { learningUnitId, questionId: id } },
    );
  }
  if (!Number.isInteger(record.revision) || record.revision < 1) {
    throw new TypeError(`${field}.revision must be a positive integer`);
  }
  if (!PERSISTED_QUESTION_STATUSES.has(record.status)) {
    throw new TypeError(`${field}.status must be active or retired`);
  }
  requiredText(record.createdAt, `${field}.createdAt`);
  requiredText(record.updatedAt, `${field}.updatedAt`);
  return record;
}

export function normalizeQuestionListQuery(input) {
  return normalizeListQuestionsQuery(input);
}

export function normalizeQuestionGetQuery(input) {
  return normalizeGetQuestionQuery(input);
}

export function normalizeCreateCommand(input) {
  return normalizeCreateQuestionsCommand(input);
}

export function normalizeUpdateCommand(input) {
  return normalizeUpdateQuestionCommand(input);
}

export function normalizeRetireCommand(input) {
  return normalizeRetireQuestionCommand(input);
}

export function normalizeSessionInput(input) {
  const envelope = requiredRecord(input, "createSession input");
  const session = requiredRecord(envelope.session, "createSession.session");
  requiredText(session.id, "createSession.session.id");
  requiredText(session.learningUnitId, "createSession.session.learningUnitId");
  return session;
}

export function normalizeSessionGetQuery(input) {
  const query = requiredRecord(input, "getSession input");
  return {
    learningUnitId: requiredText(query.learningUnitId, "getSession.learningUnitId"),
    sessionId: requiredText(query.sessionId, "getSession.sessionId"),
  };
}

export function normalizeSessionListQuery(input) {
  const query = requiredRecord(input, "listSessions input");
  const result = { learningUnitId: requiredText(query.learningUnitId, "listSessions.learningUnitId") };
  if (query.status !== undefined) {
    if (!PERSISTED_SESSION_STATUSES.has(query.status)) {
      throw new TypeError("listSessions.status must be in_progress or completed");
    }
    result.status = query.status;
  }
  return result;
}

export function normalizeAttemptInput(input) {
  const envelope = requiredRecord(input, "saveAttempt input");
  const attempt = requiredRecord(envelope.attempt, "saveAttempt.attempt");
  for (const field of ["id", "sessionId", "questionId", "submittedAt"]) {
    requiredText(attempt[field], `saveAttempt.attempt.${field}`);
  }
  return attempt;
}

export function normalizeAttemptProgressInput(input) {
  const envelope = requiredRecord(input, "saveAttemptAndProgressSession input");
  const learningUnitId = requiredText(
    envelope.learningUnitId,
    "saveAttemptAndProgressSession.learningUnitId",
  );
  const sessionId = requiredText(envelope.sessionId, "saveAttemptAndProgressSession.sessionId");
  const attempt = normalizeAttemptInput({ attempt: envelope.attempt });
  if (attempt.sessionId !== sessionId) {
    throw new TypeError("saveAttemptAndProgressSession.attempt.sessionId must match sessionId");
  }
  return {
    learningUnitId,
    sessionId,
    attempt,
    completedAt: requiredText(envelope.completedAt, "saveAttemptAndProgressSession.completedAt"),
  };
}

export function normalizeAttemptListQuery(input) {
  const query = requiredRecord(input, "listAttempts input");
  const result = { sessionId: requiredText(query.sessionId, "listAttempts.sessionId") };
  if (query.questionId !== undefined) {
    result.questionId = requiredText(query.questionId, "listAttempts.questionId");
  }
  return result;
}

export function normalizeMutationReceiptQuery(input) {
  const query = requiredRecord(input, "getMutationReceipt input");
  return { mutationId: requiredText(query.mutationId, "getMutationReceipt.mutationId") };
}

export function assertMutablePatch(patch, operation) {
  const forbiddenFields = [
    "id", "learningUnitId", "revision", "createdAt", "status",
    "conversationId", "agentRunId", "toolCallId", "contextSnapshotId", "mutationId", "model", "userId",
  ];
  for (const field of forbiddenFields) {
    if (Object.hasOwn(patch, field)) {
      throw new TypeError(`${operation}.patch.${field} cannot be changed by the repository`);
    }
  }
  return patch;
}

export function questionNotFound({ learningUnitId, questionId }) {
  return new AssessmentError(
    ASSESSMENT_ERROR_CODES.QUESTION_NOT_FOUND,
    `Question ${questionId} was not found in learning unit ${learningUnitId}`,
    { details: { learningUnitId, questionId } },
  );
}

export function revisionConflict({ learningUnitId, questionId, expectedRevision, actualRevision }) {
  return new AssessmentError(
    ASSESSMENT_ERROR_CODES.REVISION_CONFLICT,
    `Question ${questionId} revision conflict: expected ${expectedRevision}, actual ${actualRevision}`,
    {
      details: {
        learningUnitId,
        questionId,
        expectedRevision,
        actualRevision,
      },
    },
  );
}

export function storageUnavailable(message, cause) {
  return new AssessmentError(
    ASSESSMENT_ERROR_CODES.STORAGE_UNAVAILABLE,
    message || "Assessment IndexedDB is unavailable",
    { cause },
  );
}

export function makeMutationReceipt({ mutationId, operation, result, clock }) {
  return {
    mutationId,
    operation,
    result: cloneValue(result),
    createdAt: nowIso(clock),
  };
}

export function replayResult(receipt) {
  return { result: cloneValue(receipt.result), replayed: true };
}

export function committedResult(result) {
  return { result: cloneValue(result), replayed: false };
}

export function sortById(left, right) {
  return String(left.id).localeCompare(String(right.id));
}

export function sortAttempts(left, right) {
  return String(left.submittedAt).localeCompare(String(right.submittedAt))
    || sortById(left, right);
}

const PERSISTED_SESSION_STATUSES = new Set(["in_progress", "completed"]);

export function sortSessionsNewestFirst(left, right) {
  return String(right.startedAt).localeCompare(String(left.startedAt)) || sortById(right, left);
}

export function sessionNotFound({ learningUnitId, sessionId }) {
  return new AssessmentError(
    ASSESSMENT_ERROR_CODES.SESSION_NOT_FOUND,
    `Session ${sessionId} was not found in learning unit ${learningUnitId}`,
    { details: { learningUnitId, sessionId } },
  );
}

export function sessionCompleted({ sessionId }) {
  return new AssessmentError(
    ASSESSMENT_ERROR_CODES.SESSION_COMPLETED,
    `Session ${sessionId} is completed`,
    { details: { sessionId } },
  );
}
