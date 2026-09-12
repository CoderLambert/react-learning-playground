/**
 * The V1 Assessment Repository application contract.
 *
 * Repository implementations are persistence adapters. They must not expose
 * IndexedDB details to callers, and callers must not persist mutation receipts
 * separately from the business mutation that the receipt describes.
 */

export const ASSESSMENT_REPOSITORY_METHODS = Object.freeze([
  "listQuestions",
  "getQuestion",
  "createQuestions",
  "updateQuestion",
  "retireQuestion",
  "createSession",
  "getSession",
  "saveAttempt",
  "listAttempts",
  "getMutationReceipt",
]);

export const ASSESSMENT_MUTATION_OPERATIONS = Object.freeze([
  "createQuestions",
  "updateQuestion",
  "retireQuestion",
]);

const QUESTION_STATUSES = new Set(["active", "retired"]);
const MUTATION_OPERATIONS = new Set(ASSESSMENT_MUTATION_OPERATIONS);

/**
 * @typedef {Object} AssessmentQuestionListQuery
 * @property {string} learningUnitId Required scope. Results from another
 *   learning unit must never be returned.
 * @property {"active"|"retired"} [status] Optional status filter.
 */

/**
 * @typedef {Object} AssessmentQuestionGetQuery
 * @property {string} learningUnitId Required scope.
 * @property {string} questionId Question identity within the scope.
 */

/**
 * A complete, normalized question record produced by AssessmentService.
 * The repository stores and returns this record; it does not invent business
 * fields or accept a model-controlled learningUnitId.
 *
 * @typedef {Record<string, unknown>} AssessmentQuestionRecord
 */

/**
 * @typedef {Object} AssessmentCreateQuestionsCommand
 * @property {string} learningUnitId Trusted scope for every question record.
 * @property {AssessmentQuestionRecord[]} questions Non-empty complete
 *   question records. Each record must belong to learningUnitId.
 * @property {string} mutationId Stable idempotency key for this mutation.
 */

/**
 * @typedef {Object} AssessmentUpdateQuestionCommand
 * @property {string} learningUnitId Trusted scope.
 * @property {string} questionId Question to update.
 * @property {number} expectedRevision Revision read by the caller.
 * @property {Record<string, unknown>} patch Already-normalized mutable
 *   business fields. It must not replace id, learningUnitId, revision,
 *   createdAt, or status. A trusted application timestamp may be supplied as
 *   part of the patch when the implementation needs to persist updatedAt.
 * @property {string} mutationId Stable idempotency key for this mutation.
 */

/**
 * @typedef {Object} AssessmentRetireQuestionCommand
 * @property {string} learningUnitId Trusted scope.
 * @property {string} questionId Question to retire.
 * @property {number} expectedRevision Revision read by the caller.
 * @property {string} mutationId Stable idempotency key for this mutation.
 */

/**
 * @template T
 * @typedef {Object} AssessmentCommandResult
 * @property {T} result First-commit result payload. Replays return the same
 *   payload, not a newly applied mutation.
 * @property {boolean} replayed True only when mutationId was already committed.
 */

/**
 * @typedef {Object} AssessmentMutationReceipt
 * @property {string} mutationId Idempotency key.
 * @property {"createQuestions"|"updateQuestion"|"retireQuestion"} operation
 *   Repository command that committed the mutation.
 * @property {*} result The first successful command result payload.
 * @property {string} createdAt ISO timestamp for the committed receipt.
 */

/**
 * The repository method signatures and their V1 semantics are:
 *
 * - `listQuestions({ learningUnitId, status? })` returns a Promise of an
 *   array. `learningUnitId` is required; an omitted status means all statuses.
 * - `getQuestion({ learningUnitId, questionId })` returns a Promise of a
 *   question record or null. A question in another learning unit is not
 *   visible and is treated as absent.
 * - `createQuestions({ learningUnitId, questions, mutationId })` returns a
 *   Promise of `{ result: questionRecords, replayed }`.
 * - `updateQuestion({ learningUnitId, questionId, expectedRevision, patch,
 *   mutationId })` returns a Promise of `{ result: questionRecord, replayed }`.
 *   The repository performs the revision check atomically and writes
 *   revision + 1. A mismatch is reported with `REVISION_CONFLICT`.
 * - `retireQuestion({ learningUnitId, questionId, expectedRevision,
 *   mutationId })` returns a Promise of `{ result: retiredQuestion, replayed }`.
 *   Retirement is a status update to `retired`, never physical deletion, and
 *   also advances the revision atomically.
 * - `createSession({ session })` stores and returns an assessment session in
 *   the sessions store. It does not create or alter questions.
 * - `getSession({ learningUnitId, sessionId })` returns a session or null and
 *   applies the same learning-unit scope rule.
 * - `saveAttempt({ attempt })` stores and returns an attempt in the attempts
 *   store. It does not mutate a question or session snapshot.
 * - `listAttempts({ sessionId, questionId? })` returns attempts from the
 *   attempts store, optionally filtered by question.
 * - `getMutationReceipt({ mutationId })` returns the committed receipt or
 *   null. It is read-only; there is intentionally no saveMutationReceipt API.
 *
 * For each question mutation command, the repository owns this atomic
 * protocol: read mutationReceipts; if the receipt exists, return its stored
 * result with `replayed: true`; otherwise perform the business write and write
 * the receipt in the same transaction, then return `replayed: false`. A failed
 * transaction must expose neither write. Reusing a committed mutationId must
 * not apply a second business mutation, even if a caller supplies different
 * command arguments.
 */

function requiredRecord(value, field) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError(`${field} must be an object`);
  }
  return value;
}

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) {
    throw new TypeError(`${field} is required`);
  }
  return value.trim();
}

function requiredPositiveInteger(value, field) {
  if (!Number.isInteger(value) || value < 1) {
    throw new TypeError(`${field} must be a positive integer`);
  }
  return value;
}

function normalizeQuestionScope(value, operation) {
  const input = requiredRecord(value, `${operation} input`);
  return {
    learningUnitId: requiredText(input.learningUnitId, `${operation}.learningUnitId`),
  };
}

/**
 * Normalize the scoped question-list query without changing its meaning.
 *
 * @param {AssessmentQuestionListQuery} value
 * @returns {AssessmentQuestionListQuery}
 */
export function normalizeListQuestionsQuery(value) {
  const scope = normalizeQuestionScope(value, "listQuestions");
  if (value.status !== undefined && !QUESTION_STATUSES.has(value.status)) {
    throw new TypeError("listQuestions.status must be active or retired");
  }
  return value.status === undefined ? scope : { ...scope, status: value.status };
}

/**
 * Normalize the scoped question lookup query.
 *
 * @param {AssessmentQuestionGetQuery} value
 * @returns {AssessmentQuestionGetQuery}
 */
export function normalizeGetQuestionQuery(value) {
  const scope = normalizeQuestionScope(value, "getQuestion");
  return {
    ...scope,
    questionId: requiredText(value.questionId, "getQuestion.questionId"),
  };
}

function normalizeMutationIdentity(value, operation) {
  const input = requiredRecord(value, `${operation} input`);
  return {
    ...input,
    learningUnitId: requiredText(input.learningUnitId, `${operation}.learningUnitId`),
    mutationId: requiredText(input.mutationId, `${operation}.mutationId`),
  };
}

/**
 * Normalize a create-questions command. The service supplies complete,
 * already validated records; the repository persists them atomically with the
 * mutation receipt.
 *
 * @param {AssessmentCreateQuestionsCommand} value
 * @returns {AssessmentCreateQuestionsCommand}
 */
export function normalizeCreateQuestionsCommand(value) {
  const input = normalizeMutationIdentity(value, "createQuestions");
  if (!Array.isArray(input.questions) || input.questions.length === 0) {
    throw new TypeError("createQuestions.questions must be a non-empty array");
  }
  if (input.questions.some((question) => !question || typeof question !== "object" || Array.isArray(question))) {
    throw new TypeError("createQuestions.questions must contain objects");
  }
  return {
    learningUnitId: input.learningUnitId,
    questions: input.questions,
    mutationId: input.mutationId,
  };
}

/**
 * Normalize an update command. `patch` is intentionally not interpreted here;
 * domain validation belongs to AssessmentService. The repository must still
 * preserve question identity/scope/revision and must apply the expected
 * revision check in the same transaction as the write.
 *
 * @param {AssessmentUpdateQuestionCommand} value
 * @returns {AssessmentUpdateQuestionCommand}
 */
export function normalizeUpdateQuestionCommand(value) {
  const input = normalizeMutationIdentity(value, "updateQuestion");
  return {
    learningUnitId: input.learningUnitId,
    questionId: requiredText(input.questionId, "updateQuestion.questionId"),
    expectedRevision: requiredPositiveInteger(input.expectedRevision, "updateQuestion.expectedRevision"),
    patch: requiredRecord(input.patch, "updateQuestion.patch"),
    mutationId: input.mutationId,
  };
}

/**
 * Normalize a retire command. Retire is a status mutation, not a delete.
 *
 * @param {AssessmentRetireQuestionCommand} value
 * @returns {AssessmentRetireQuestionCommand}
 */
export function normalizeRetireQuestionCommand(value) {
  const input = normalizeMutationIdentity(value, "retireQuestion");
  return {
    learningUnitId: input.learningUnitId,
    questionId: requiredText(input.questionId, "retireQuestion.questionId"),
    expectedRevision: requiredPositiveInteger(input.expectedRevision, "retireQuestion.expectedRevision"),
    mutationId: input.mutationId,
  };
}

/**
 * Normalize the envelope returned by every question mutation command.
 *
 * @template T
 * @param {AssessmentCommandResult<T>} value
 * @returns {AssessmentCommandResult<T>}
 */
export function normalizeAssessmentCommandResult(value) {
  const input = requiredRecord(value, "assessment command result");
  if (!Object.hasOwn(input, "result")) {
    throw new TypeError("assessment command result.result is required");
  }
  if (typeof input.replayed !== "boolean") {
    throw new TypeError("assessment command result.replayed must be boolean");
  }
  return { result: input.result, replayed: input.replayed };
}

/**
 * Validate the persisted receipt shape. The receipt result is the unwrapped
 * first successful command result, so a replay can reconstruct the standard
 * command envelope without writing another receipt.
 *
 * @param {AssessmentMutationReceipt} value
 * @returns {AssessmentMutationReceipt}
 */
export function assertAssessmentMutationReceipt(value) {
  const input = requiredRecord(value, "assessment mutation receipt");
  const operation = requiredText(input.operation, "mutationReceipt.operation");
  if (!MUTATION_OPERATIONS.has(operation)) {
    throw new TypeError(`mutationReceipt.operation must be one of ${ASSESSMENT_MUTATION_OPERATIONS.join(", ")}`);
  }
  if (!Object.hasOwn(input, "result")) {
    throw new TypeError("mutationReceipt.result is required");
  }
  return {
    mutationId: requiredText(input.mutationId, "mutationReceipt.mutationId"),
    operation,
    result: input.result,
    createdAt: requiredText(input.createdAt, "mutationReceipt.createdAt"),
  };
}

/**
 * Assert the method surface of a repository adapter. This intentionally checks
 * only the port surface; persistence behavior is exercised by the shared
 * repository contract suite owned by the repository implementation task.
 *
 * @param {Record<string, Function>} repository
 * @returns {Record<string, Function>}
 */
export function assertAssessmentRepository(repository) {
  if (!repository || typeof repository !== "object" || Array.isArray(repository)) {
    throw new TypeError("assessment repository is required");
  }
  for (const method of ASSESSMENT_REPOSITORY_METHODS) {
    if (typeof repository[method] !== "function") {
      throw new TypeError(`assessment repository.${method} is required`);
    }
  }
  return repository;
}

export const ASSESSMENT_QUERY_STORE_METHODS = Object.freeze(["subscribe", "getSnapshot"]);

export function assertAssessmentQueryStore(store) {
  if (!store || typeof store !== "object") {
    throw new TypeError("assessment query store is required");
  }
  for (const method of ASSESSMENT_QUERY_STORE_METHODS) {
    if (typeof store[method] !== "function") {
      throw new TypeError(`assessment query store.${method} is required`);
    }
  }
  return store;
}
