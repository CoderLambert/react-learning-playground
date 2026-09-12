import {
  assertAssessmentQueryStore,
  assertAssessmentRepository,
  normalizeAssessmentCommandResult,
} from "./assessmentPorts.js";
import { ASSESSMENT_ERROR_CODES, AssessmentError } from "../domain/assessmentErrors.js";
import { assertAssessmentSession, createSessionItem } from "../domain/assessmentSession.js";
import { assertAttempt, evaluateQuestionAnswer } from "../domain/attempt.js";
import { assertEvidenceRef, assertQuestionDraft, assertQuestionRecord } from "../domain/question.js";
import { systemClock } from "../../platform/clock.js";
import { createId } from "../../platform/ids.js";
import { createAssessmentQueryStore } from "../store/AssessmentQueryStore.js";

const QUESTION_SYSTEM_FIELDS = Object.freeze([
  "id",
  "learningUnitId",
  "status",
  "revision",
  "createdAt",
  "updatedAt",
  "provenance",
]);

const UPDATE_SYSTEM_FIELDS = new Set(QUESTION_SYSTEM_FIELDS);

function clone(value) {
  return structuredClone(value);
}

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

function resolveTrustedInput(input) {
  return input.trusted
    ?? input.trustedContext
    ?? input.runtime
    ?? input.context
    ?? input;
}

function normalizeScope(input, operation) {
  const trusted = requiredRecord(resolveTrustedInput(input), `${operation}.trusted`);
  return {
    trusted,
    learningUnitId: requiredText(trusted.learningUnitId, `${operation}.learningUnitId`),
  };
}

function normalizeMutationIdentity(input, operation) {
  const scope = normalizeScope(input, operation);
  return {
    ...scope,
    mutationId: requiredText(scope.trusted.mutationId, `${operation}.mutationId`),
  };
}

function normalizeProvenance(trusted) {
  if (trusted.provenance !== undefined) {
    return clone(requiredRecord(trusted.provenance, "provenance"));
  }

  if (trusted.actor && typeof trusted.actor === "object" && !Array.isArray(trusted.actor)) {
    const provenance = { source: trusted.actor.type ?? "runtime" };
    if (typeof trusted.actor.model === "string" && trusted.actor.model.trim()) {
      provenance.model = trusted.actor.model.trim();
    }
    return provenance;
  }

  if (typeof trusted.model === "string" && trusted.model.trim()) {
    return { source: "ai", model: trusted.model.trim() };
  }

  return { source: "application" };
}

function nowIso(clock, operation) {
  const value = typeof clock.nowIso === "function"
    ? clock.nowIso()
    : typeof clock === "function"
      ? clock()
      : null;
  return requiredText(value, `${operation}.timestamp`);
}

function createEntityId(idFactory, prefix) {
  const id = idFactory(prefix);
  return requiredText(id, `${prefix} id`);
}

function commandResult(value) {
  return normalizeAssessmentCommandResult(value);
}

function questionNotFound(questionId) {
  return new AssessmentError(
    ASSESSMENT_ERROR_CODES.QUESTION_NOT_FOUND,
    `Question ${questionId} was not found in the current learning unit`,
    { details: { questionId } },
  );
}

function invalidQuestion(message, details = null) {
  return new AssessmentError(ASSESSMENT_ERROR_CODES.INVALID_QUESTION, message, { details });
}

function invalidEvidence(message, details = null, cause) {
  return new AssessmentError(ASSESSMENT_ERROR_CODES.INVALID_EVIDENCE, message, { details, cause });
}

function stripQuestionSystemFields(question) {
  const business = clone(requiredRecord(question, "question"));
  for (const field of QUESTION_SYSTEM_FIELDS) delete business[field];
  return business;
}

function assertMutablePatch(patch) {
  const input = requiredRecord(patch, "updateQuestion.patch");
  for (const field of Object.keys(input)) {
    if (UPDATE_SYSTEM_FIELDS.has(field)) {
      throw invalidQuestion(`updateQuestion.patch.${field} is a system field and cannot be changed`, { field });
    }
  }
  return clone(input);
}

function mergeQuestionPatch(question, patch, { provenance, updatedAt }) {
  const merged = {
    ...clone(question),
    ...patch,
    provenance: clone(provenance),
    updatedAt,
  };

  if (patch.content && typeof patch.content === "object" && !Array.isArray(patch.content)) {
    merged.content = { ...clone(question.content), ...clone(patch.content) };
  }

  return merged;
}

async function callEvidenceHook(hook, ref, context, field) {
  if (typeof hook === "function") {
    return hook(ref, context);
  }
  if (hook && typeof hook[field] === "function") {
    return hook[field](ref, context);
  }
  return undefined;
}

/**
 * Application service for Assessment use cases.
 *
 * The optional `trusted`/`trustedContext` input is deliberately separate from
 * model-owned question and patch data. Composition code should always pass
 * runtime scope, provenance, and mutation identity through that boundary.
 * Direct top-level trusted fields remain supported for small application and
 * Node tests, but model payload fields are never copied into persisted system
 * fields.
 */
export class AssessmentService {
  #repository;
  #queryStore;
  #clock;
  #idFactory;
  #evidenceValidator;
  #evidenceResolver;

  constructor({
    repository,
    queryStore = createAssessmentQueryStore(),
    clock = systemClock,
    idFactory,
    idGenerator,
    ids,
    evidenceValidator = null,
    evidenceResolver = null,
  } = {}) {
    this.#repository = assertAssessmentRepository(repository);
    this.#queryStore = queryStore === null ? null : assertAssessmentQueryStore(queryStore);
    this.#clock = clock;
    this.#idFactory = idFactory ?? idGenerator ?? ids?.createId ?? createId;
    this.#evidenceValidator = evidenceValidator;
    this.#evidenceResolver = evidenceResolver;

    if (typeof this.#idFactory !== "function") throw new TypeError("idFactory must be a function");
    if (typeof this.#clock !== "function" && typeof this.#clock?.nowIso !== "function") {
      throw new TypeError("clock must provide nowIso() or be a function");
    }
  }

  async listQuestions(input = {}) {
    const { learningUnitId } = normalizeScope(requiredRecord(input, "listQuestions input"), "listQuestions");
    const query = { learningUnitId };
    if (input.status !== undefined) query.status = input.status;
    const questions = await this.#repository.listQuestions(query);
    if (!Array.isArray(questions)) throw new TypeError("assessment repository.listQuestions must return an array");
    return clone(questions);
  }

  async getQuestion(input = {}) {
    const value = requiredRecord(input, "getQuestion input");
    const { learningUnitId } = normalizeScope(value, "getQuestion");
    const questionId = requiredText(value.questionId, "getQuestion.questionId");
    const question = await this.#repository.getQuestion({ learningUnitId, questionId });
    return question == null ? null : clone(question);
  }

  async createQuestions(input = {}) {
    const value = requiredRecord(input, "createQuestions input");
    const { trusted, learningUnitId, mutationId } = normalizeMutationIdentity(value, "createQuestions");
    if (!Array.isArray(value.questions) || value.questions.length === 0) {
      throw invalidQuestion("createQuestions.questions must be a non-empty array");
    }

    const provenance = normalizeProvenance(trusted);
    const timestamp = nowIso(this.#clock, "createQuestions");
    const questions = [];

    for (const [index, payload] of value.questions.entries()) {
      try {
        const business = stripQuestionSystemFields(payload);
        const question = {
          ...business,
          id: createEntityId(this.#idFactory, "question"),
          learningUnitId,
          status: "active",
          revision: 1,
          provenance: clone(provenance),
          createdAt: timestamp,
          updatedAt: timestamp,
        };
        assertQuestionDraft(question);
        await this.#validateEvidence(question, { learningUnitId, operation: "createQuestions", index });
        assertQuestionRecord(question);
        questions.push(question);
      } catch (error) {
        throw this.#normalizeValidationError(error, `createQuestions.questions[${index}]`);
      }
    }

    const result = commandResult(await this.#repository.createQuestions({
      learningUnitId,
      questions,
      mutationId,
    }));
    await this.#notifyQuestionMutation(learningUnitId);
    return result;
  }

  async updateQuestion(input = {}) {
    const value = requiredRecord(input, "updateQuestion input");
    const { trusted, learningUnitId, mutationId } = normalizeMutationIdentity(value, "updateQuestion");
    const questionId = requiredText(value.questionId, "updateQuestion.questionId");
    const expectedRevision = requiredPositiveInteger(value.expectedRevision, "updateQuestion.expectedRevision");
    const patch = assertMutablePatch(value.patch);
    const current = await this.#repository.getQuestion({ learningUnitId, questionId });
    if (current == null || current.learningUnitId !== learningUnitId) throw questionNotFound(questionId);

    const provenance = normalizeProvenance(trusted);
    const updatedAt = nowIso(this.#clock, "updateQuestion");
    const merged = mergeQuestionPatch(current, patch, { provenance, updatedAt });
    try {
      assertQuestionRecord(merged);
      await this.#validateEvidence(merged, { learningUnitId, operation: "updateQuestion", questionId });
    } catch (error) {
      throw this.#normalizeValidationError(error, "updateQuestion.patch");
    }

    const result = commandResult(await this.#repository.updateQuestion({
      learningUnitId,
      questionId,
      expectedRevision,
      patch: {
        ...patch,
        ...(patch.content ? { content: clone(merged.content) } : {}),
        provenance: clone(provenance),
        updatedAt,
      },
      mutationId,
    }));
    await this.#notifyQuestionMutation(learningUnitId);
    return result;
  }

  async retireQuestion(input = {}) {
    const value = requiredRecord(input, "retireQuestion input");
    const { learningUnitId, mutationId } = normalizeMutationIdentity(value, "retireQuestion");
    const questionId = requiredText(value.questionId, "retireQuestion.questionId");
    const expectedRevision = requiredPositiveInteger(value.expectedRevision, "retireQuestion.expectedRevision");
    const current = await this.#repository.getQuestion({ learningUnitId, questionId });
    if (current == null || current.learningUnitId !== learningUnitId) throw questionNotFound(questionId);

    const result = commandResult(await this.#repository.retireQuestion({
      learningUnitId,
      questionId,
      expectedRevision,
      mutationId,
    }));
    await this.#notifyQuestionMutation(learningUnitId);
    return result;
  }

  async startSession(input = {}) {
    const value = requiredRecord(input, "startSession input");
    const { learningUnitId } = normalizeScope(value, "startSession");
    const questions = await this.#repository.listQuestions({ learningUnitId, status: "active" });
    if (!Array.isArray(questions)) throw new TypeError("assessment repository.listQuestions must return an array");

    const activeQuestions = questions.filter((question) => (
      question?.learningUnitId === learningUnitId && question.status === "active"
    ));
    const selectedQuestions = this.#selectSessionQuestions(activeQuestions, value.questionIds);
    if (selectedQuestions.length === 0) {
      throw invalidQuestion("startSession requires at least one active question");
    }

    const items = selectedQuestions.map((question) => {
      try {
        assertQuestionRecord(question);
        return createSessionItem(question);
      } catch (error) {
        throw this.#normalizeValidationError(error, "startSession.question");
      }
    });
    const startedAt = nowIso(this.#clock, "startSession");
    const session = {
      id: createEntityId(this.#idFactory, "session"),
      learningUnitId,
      items,
      status: "in_progress",
      startedAt,
      completedAt: null,
    };
    assertAssessmentSession(session);
    const saved = await this.#repository.createSession({ session });
    return saved ?? session;
  }

  async submitAnswer(input = {}) {
    const value = requiredRecord(input, "submitAnswer input");
    const { learningUnitId } = normalizeScope(value, "submitAnswer");
    const sessionId = requiredText(value.sessionId, "submitAnswer.sessionId");
    const questionId = requiredText(value.questionId, "submitAnswer.questionId");
    const session = await this.#repository.getSession({ learningUnitId, sessionId });
    if (session == null) {
      throw new AssessmentError(ASSESSMENT_ERROR_CODES.SESSION_NOT_FOUND, `Session ${sessionId} was not found`, {
        details: { sessionId },
      });
    }
    if (session.learningUnitId !== learningUnitId) {
      throw new AssessmentError(ASSESSMENT_ERROR_CODES.SESSION_NOT_FOUND, `Session ${sessionId} was not found`, {
        details: { sessionId },
      });
    }
    assertAssessmentSession(session);
    if (session.status === "completed") {
      throw new AssessmentError(ASSESSMENT_ERROR_CODES.SESSION_COMPLETED, `Session ${sessionId} is completed`, {
        details: { sessionId },
      });
    }

    const item = session.items.find((candidate) => candidate.questionId === questionId);
    if (!item) throw questionNotFound(questionId);

    const correct = evaluateQuestionAnswer(item.snapshot, value.answer);
    const attempt = {
      id: createEntityId(this.#idFactory, "attempt"),
      sessionId,
      questionId,
      questionRevision: item.revision,
      answer: clone(value.answer),
      correct,
      submittedAt: nowIso(this.#clock, "submitAnswer"),
    };
    assertAttempt(attempt);
    const saved = await this.#repository.saveAttempt({ attempt });
    return saved ?? attempt;
  }

  #selectSessionQuestions(activeQuestions, questionIds) {
    if (questionIds === undefined) return activeQuestions;
    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      throw invalidQuestion("startSession.questionIds must be a non-empty array");
    }
    const requested = questionIds.map((questionId, index) => requiredText(questionId, `startSession.questionIds[${index}]`));
    if (new Set(requested).size !== requested.length) {
      throw invalidQuestion("startSession.questionIds must not contain duplicates");
    }

    const byId = new Map(activeQuestions.map((question) => [question.id, question]));
    return requested.map((questionId) => {
      const question = byId.get(questionId);
      if (!question) throw questionNotFound(questionId);
      return question;
    });
  }

  async #validateEvidence(question, context) {
    if (question.evidenceRefs === undefined) return;
    if (!Array.isArray(question.evidenceRefs)) {
      throw invalidEvidence("question.evidenceRefs must be an array");
    }

    for (const [index, ref] of question.evidenceRefs.entries()) {
      assertEvidenceRef(ref, index);
      const evidenceContext = { ...context, question: clone(question), index };
      try {
        const resolved = await callEvidenceHook(this.#evidenceResolver, ref, evidenceContext, "resolve");
        if (this.#evidenceResolver && (resolved === null || resolved === undefined || resolved === false)) {
          throw invalidEvidence(`evidenceRefs[${index}] could not be resolved`, { index });
        }
        const valid = await callEvidenceHook(this.#evidenceValidator, ref, evidenceContext, "validate");
        if (valid === false) throw invalidEvidence(`evidenceRefs[${index}] is not valid for this learning unit`, { index });
      } catch (error) {
        if (error instanceof AssessmentError && error.code === ASSESSMENT_ERROR_CODES.INVALID_EVIDENCE) throw error;
        throw invalidEvidence(`evidenceRefs[${index}] is not valid for this learning unit`, { index }, error);
      }
    }
  }

  #normalizeValidationError(error, field) {
    if (error instanceof AssessmentError) return error;
    if (error instanceof TypeError) return error;
    return invalidQuestion(`${field} is invalid`, { cause: error?.message });
  }

  async #notifyQuestionMutation(learningUnitId) {
    if (!this.#queryStore || typeof this.#queryStore.replaceSnapshot !== "function") return;
    const questions = await this.#repository.listQuestions({ learningUnitId });
    if (!Array.isArray(questions)) throw new TypeError("assessment repository.listQuestions must return an array");
    this.#queryStore.replaceSnapshot({ learningUnitId, questions: clone(questions) });
  }
}

export function createAssessmentService(options) {
  return new AssessmentService(options);
}
