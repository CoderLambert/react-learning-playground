import { ASSESSMENT_STORES } from "./indexedDb/assessmentMigrations.js";
import {
  assertMutablePatch,
  cloneValue,
  committedResult,
  makeMutationReceipt,
  normalizeAttemptInput,
  normalizeAttemptListQuery,
  normalizeCreateCommand,
  normalizeMutationReceiptQuery,
  normalizeQuestionGetQuery,
  normalizeQuestionListQuery,
  normalizeRetireCommand,
  normalizeSessionGetQuery,
  normalizeSessionInput,
  normalizeSessionListQuery,
  normalizeUpdateCommand,
  normalizeAttemptProgressInput,
  nowIso,
  questionNotFound,
  requiredQuestionRecord,
  replayResult,
  revisionConflict,
  sortAttempts,
  sortById,
  sortSessionsNewestFirst,
  sessionCompleted,
  sessionNotFound,
} from "./repositorySupport.js";

function createState() {
  return {
    [ASSESSMENT_STORES.QUESTIONS]: new Map(),
    [ASSESSMENT_STORES.SESSIONS]: new Map(),
    [ASSESSMENT_STORES.ATTEMPTS]: new Map(),
    [ASSESSMENT_STORES.MUTATION_RECEIPTS]: new Map(),
  };
}

function mutationReplay(state, mutationId) {
  const receipt = state[ASSESSMENT_STORES.MUTATION_RECEIPTS].get(mutationId);
  return receipt ? replayResult(receipt) : null;
}

export class MemoryAssessmentRepository {
  constructor({ clock = () => new Date(), state } = {}) {
    this.clock = clock;
    this.state = state ?? createState();
    this.mode = "memory";
  }

  async listQuestions(input) {
    const query = normalizeQuestionListQuery(input);
    return [...this.state[ASSESSMENT_STORES.QUESTIONS].values()]
      .filter((question) => question.learningUnitId === query.learningUnitId)
      .filter((question) => query.status === undefined || question.status === query.status)
      .sort(sortById)
      .map(cloneValue);
  }

  async getQuestion(input) {
    const query = normalizeQuestionGetQuery(input);
    const question = this.state[ASSESSMENT_STORES.QUESTIONS].get(query.questionId);
    if (!question || question.learningUnitId !== query.learningUnitId) return null;
    return cloneValue(question);
  }

  async createQuestions(input) {
    const command = normalizeCreateCommand(input);
    const replay = mutationReplay(this.state, command.mutationId);
    if (replay) return replay;

    const questions = command.questions.map((question, index) => requiredQuestionRecord(
      question,
      command.learningUnitId,
      `createQuestions.questions[${index}]`,
    ));
    const questionStore = this.state[ASSESSMENT_STORES.QUESTIONS];
    const ids = new Set();
    for (const question of questions) {
      if (ids.has(question.id) || questionStore.has(question.id)) {
        throw new Error(`Question ${question.id} already exists`);
      }
      ids.add(question.id);
    }

    const result = questions.map(cloneValue);
    for (const question of result) questionStore.set(question.id, cloneValue(question));
    this.state[ASSESSMENT_STORES.MUTATION_RECEIPTS].set(
      command.mutationId,
      makeMutationReceipt({
        mutationId: command.mutationId,
        operation: "createQuestions",
        result,
        clock: this.clock,
      }),
    );
    return committedResult(result);
  }

  async updateQuestion(input) {
    const command = normalizeUpdateCommand(input);
    const replay = mutationReplay(this.state, command.mutationId);
    if (replay) return replay;
    assertMutablePatch(command.patch, "updateQuestion");

    const questionStore = this.state[ASSESSMENT_STORES.QUESTIONS];
    const current = questionStore.get(command.questionId);
    if (!current || current.learningUnitId !== command.learningUnitId) {
      throw questionNotFound(command);
    }
    if (current.revision !== command.expectedRevision) {
      throw revisionConflict({
        ...command,
        actualRevision: current.revision,
      });
    }

    const updated = {
      ...cloneValue(current),
      ...cloneValue(command.patch),
      revision: current.revision + 1,
    };
    const result = cloneValue(updated);
    questionStore.set(result.id, cloneValue(result));
    this.state[ASSESSMENT_STORES.MUTATION_RECEIPTS].set(
      command.mutationId,
      makeMutationReceipt({
        mutationId: command.mutationId,
        operation: "updateQuestion",
        result,
        clock: this.clock,
      }),
    );
    return committedResult(result);
  }

  async retireQuestion(input) {
    const command = normalizeRetireCommand(input);
    const replay = mutationReplay(this.state, command.mutationId);
    if (replay) return replay;

    const questionStore = this.state[ASSESSMENT_STORES.QUESTIONS];
    const current = questionStore.get(command.questionId);
    if (!current || current.learningUnitId !== command.learningUnitId) {
      throw questionNotFound(command);
    }
    if (current.revision !== command.expectedRevision) {
      throw revisionConflict({
        ...command,
        actualRevision: current.revision,
      });
    }

    const result = {
      ...cloneValue(current),
      status: "retired",
      revision: current.revision + 1,
      updatedAt: command.metadata.updatedAt,
      provenance: cloneValue(command.metadata.provenance),
    };
    questionStore.set(result.id, cloneValue(result));
    this.state[ASSESSMENT_STORES.MUTATION_RECEIPTS].set(
      command.mutationId,
      makeMutationReceipt({
        mutationId: command.mutationId,
        operation: "retireQuestion",
        result,
        clock: this.clock,
      }),
    );
    return committedResult(result);
  }

  async createSession(input) {
    const session = normalizeSessionInput(input);
    this.state[ASSESSMENT_STORES.SESSIONS].set(session.id, cloneValue(session));
    return cloneValue(session);
  }

  async getSession(input) {
    const query = normalizeSessionGetQuery(input);
    const session = this.state[ASSESSMENT_STORES.SESSIONS].get(query.sessionId);
    if (!session || session.learningUnitId !== query.learningUnitId) return null;
    return cloneValue(session);
  }

  async listSessions(input) {
    const query = normalizeSessionListQuery(input);
    return [...this.state[ASSESSMENT_STORES.SESSIONS].values()]
      .filter((session) => session.learningUnitId === query.learningUnitId)
      .filter((session) => query.status === undefined || session.status === query.status)
      .sort(sortSessionsNewestFirst)
      .map(cloneValue);
  }

  async saveAttempt(input) {
    const attempt = normalizeAttemptInput(input);
    this.state[ASSESSMENT_STORES.ATTEMPTS].set(attempt.id, cloneValue(attempt));
    return cloneValue(attempt);
  }

  async saveAttemptAndProgressSession(input) {
    const command = normalizeAttemptProgressInput(input);
    const sessionStore = this.state[ASSESSMENT_STORES.SESSIONS];
    const attemptStore = this.state[ASSESSMENT_STORES.ATTEMPTS];
    const current = sessionStore.get(command.sessionId);
    if (!current || current.learningUnitId !== command.learningUnitId) throw sessionNotFound(command);
    if (current.status === "completed") throw sessionCompleted(command);

    const attempt = cloneValue(command.attempt);
    attemptStore.set(attempt.id, cloneValue(attempt));
    const answeredQuestionIds = new Set(
      [...attemptStore.values()]
        .filter((candidate) => candidate.sessionId === command.sessionId)
        .map((candidate) => candidate.questionId),
    );
    const complete = current.items.every((item) => answeredQuestionIds.has(item.questionId));
    const session = complete
      ? { ...cloneValue(current), status: "completed", completedAt: command.completedAt }
      : cloneValue(current);
    sessionStore.set(session.id, cloneValue(session));
    return { attempt, session: cloneValue(session) };
  }

  async listAttempts(input) {
    const query = normalizeAttemptListQuery(input);
    return [...this.state[ASSESSMENT_STORES.ATTEMPTS].values()]
      .filter((attempt) => attempt.sessionId === query.sessionId)
      .filter((attempt) => query.questionId === undefined || attempt.questionId === query.questionId)
      .sort(sortAttempts)
      .map(cloneValue);
  }

  async getMutationReceipt(input) {
    const query = normalizeMutationReceiptQuery(input);
    return cloneValue(
      this.state[ASSESSMENT_STORES.MUTATION_RECEIPTS].get(query.mutationId) ?? null,
    );
  }

  timestamp() {
    return nowIso(this.clock);
  }

  close() {}
}
