import { validateLearnerEvidenceProjection } from "../learning-evidence/contract.js";

export const LEARNING_COMPLETION_CONTRACT_VERSION = "learning-completion-v1";

export const LEARNING_COMPLETION_STATUS = Object.freeze({
  NOT_STARTED: "not_started",
  IN_PROGRESS: "in_progress",
  NEEDS_REVIEW: "needs_review",
  COMPLETE: "complete",
});

export const LEARNING_COMPLETION_NEXT_ACTION = Object.freeze({
  START_PRACTICE: "start_practice",
  RESUME_PRACTICE: "resume_practice",
  RETRY_PRACTICE: "retry_practice",
  REVIEW_GUIDED: "review_guided",
  START_VERIFY: "start_verify",
  RESUME_VERIFY: "resume_verify",
  RETRY_VERIFY: "retry_verify",
  CONTINUE: "continue",
});

export const LEARNING_COMPLETION_EVIDENCE_STATE = Object.freeze({
  MISSING: "missing",
  IN_PROGRESS: "in_progress",
  INCORRECT: "incorrect",
  REVIEW: "review",
  SATISFIED: "satisfied",
});

export class LearningCompletionContractError extends Error {
  constructor(code, message, details = null) {
    super(message);
    this.name = "LearningCompletionContractError";
    this.code = code;
    this.details = details;
  }
}

function fail(code, message, details = null) {
  throw new LearningCompletionContractError(code, message, details);
}

function stableCompare(left, right, key) {
  return String(left?.[key] ?? "").localeCompare(String(right?.[key] ?? ""));
}

function sourceBasis(slice, records = []) {
  if (!slice) return null;
  return Object.freeze({
    source: slice.source,
    sourceRef: Object.freeze({ ...slice.sourceRef }),
    projectionKeys: Object.freeze(
      records.map((record) => record.projectionKey).filter(Boolean).sort(),
    ),
  });
}

function deriveGuided(projection) {
  const guidedSlices = projection.sources.filter(({ source }) => source === "guided");
  if (guidedSlices.length !== 1) {
    fail(
      "GUIDED_SOURCE_CARDINALITY_INVALID",
      "Completion V1 requires exactly one Guided source slice",
      { count: guidedSlices.length },
    );
  }

  const guided = guidedSlices[0];
  const practiceRecords = guided.records.filter(({ kind }) => kind === "guided-practice");
  const practice = practiceRecords.at(-1) ?? null;

  if (guided.lifecycle.status === "not_started") {
    return {
      state: LEARNING_COMPLETION_EVIDENCE_STATE.MISSING,
      reason: "guided-not-started",
      basis: sourceBasis(guided),
    };
  }

  if (guided.lifecycle.status === "in_progress") {
    return {
      state: LEARNING_COMPLETION_EVIDENCE_STATE.IN_PROGRESS,
      reason: "guided-in-progress",
      basis: sourceBasis(guided, practiceRecords),
    };
  }

  if (guided.lifecycle.status !== "completed") {
    fail("GUIDED_STATUS_UNSUPPORTED", "Unsupported Guided lifecycle status");
  }

  if (!practice || practice.outcome?.kind !== "correctness") {
    return {
      state: LEARNING_COMPLETION_EVIDENCE_STATE.INCORRECT,
      reason: "guided-practice-missing-or-unowned",
      basis: sourceBasis(guided, practiceRecords),
    };
  }

  if (practice.outcome.correct !== true) {
    return {
      state: LEARNING_COMPLETION_EVIDENCE_STATE.INCORRECT,
      reason: "guided-practice-incorrect",
      basis: sourceBasis(guided, [practice]),
    };
  }

  if (guided.learnerState?.needsReview === true) {
    return {
      state: LEARNING_COMPLETION_EVIDENCE_STATE.REVIEW,
      reason: "guided-needs-review",
      basis: sourceBasis(guided, [practice]),
    };
  }

  return {
    state: LEARNING_COMPLETION_EVIDENCE_STATE.SATISFIED,
    reason: null,
    basis: sourceBasis(guided, [practice]),
  };
}

function deriveVerify(projection) {
  const assessment = projection.sources
    .filter(({ source, lifecycle }) => (
      source === "assessment" && lifecycle.status !== "superseded"
    ))
    .sort((left, right) => (
      stableCompare(left.lifecycle, right.lifecycle, "startedAt")
      || stableCompare(left.sourceRef, right.sourceRef, "sessionId")
    ));

  const current = assessment.at(-1) ?? null;

  if (!current) {
    return {
      state: LEARNING_COMPLETION_EVIDENCE_STATE.MISSING,
      reason: "verify-not-started",
      basis: null,
    };
  }

  const answers = current.records.filter(({ kind }) => kind === "assessment-answer");

  if (current.lifecycle.status === "in_progress") {
    return {
      state: LEARNING_COMPLETION_EVIDENCE_STATE.IN_PROGRESS,
      reason: "verify-in-progress",
      basis: sourceBasis(current, answers),
    };
  }

  if (current.lifecycle.status !== "completed") {
    fail("ASSESSMENT_STATUS_UNSUPPORTED", "Unsupported Assessment lifecycle status");
  }

  if (answers.length === 0) {
    return {
      state: LEARNING_COMPLETION_EVIDENCE_STATE.INCORRECT,
      reason: "verify-completed-without-answer-evidence",
      basis: sourceBasis(current),
    };
  }

  if (answers.some(({ outcome }) => outcome?.kind !== "correctness" || outcome.correct !== true)) {
    return {
      state: LEARNING_COMPLETION_EVIDENCE_STATE.INCORRECT,
      reason: "verify-has-incorrect-answer",
      basis: sourceBasis(current, answers),
    };
  }

  return {
    state: LEARNING_COMPLETION_EVIDENCE_STATE.SATISFIED,
    reason: null,
    basis: sourceBasis(current, answers),
  };
}

function buildDecision(projection, guided, verify, status, nextAction, reviewReasons = []) {
  return Object.freeze({
    contractVersion: LEARNING_COMPLETION_CONTRACT_VERSION,
    learningUnitId: projection.learningUnitId,
    status,
    nextAction,
    canContinue: status === LEARNING_COMPLETION_STATUS.COMPLETE,
    requiredEvidence: Object.freeze({
      guidedPractice: guided.state,
      verify: verify.state,
    }),
    reviewReasons: Object.freeze([...reviewReasons]),
    basis: Object.freeze(
      [guided.basis, verify.basis].filter(Boolean),
    ),
  });
}

export function evaluateLearningCompletionCandidate(projection) {
  const validation = validateLearnerEvidenceProjection(projection);
  if (!validation.valid) {
    fail(
      "LEARNER_EVIDENCE_INVALID",
      "Completion V1 fails closed on invalid Learner Evidence",
      validation.errors,
    );
  }

  const guided = deriveGuided(projection);
  const verify = deriveVerify(projection);

  if (guided.state === LEARNING_COMPLETION_EVIDENCE_STATE.MISSING) {
    return buildDecision(
      projection,
      guided,
      verify,
      LEARNING_COMPLETION_STATUS.NOT_STARTED,
      LEARNING_COMPLETION_NEXT_ACTION.START_PRACTICE,
    );
  }

  if (guided.state === LEARNING_COMPLETION_EVIDENCE_STATE.IN_PROGRESS) {
    return buildDecision(
      projection,
      guided,
      verify,
      LEARNING_COMPLETION_STATUS.IN_PROGRESS,
      LEARNING_COMPLETION_NEXT_ACTION.RESUME_PRACTICE,
    );
  }

  if (guided.state === LEARNING_COMPLETION_EVIDENCE_STATE.INCORRECT) {
    return buildDecision(
      projection,
      guided,
      verify,
      LEARNING_COMPLETION_STATUS.NEEDS_REVIEW,
      LEARNING_COMPLETION_NEXT_ACTION.RETRY_PRACTICE,
      [guided.reason],
    );
  }

  if (guided.state === LEARNING_COMPLETION_EVIDENCE_STATE.REVIEW) {
    return buildDecision(
      projection,
      guided,
      verify,
      LEARNING_COMPLETION_STATUS.NEEDS_REVIEW,
      LEARNING_COMPLETION_NEXT_ACTION.REVIEW_GUIDED,
      [guided.reason],
    );
  }

  if (verify.state === LEARNING_COMPLETION_EVIDENCE_STATE.MISSING) {
    return buildDecision(
      projection,
      guided,
      verify,
      LEARNING_COMPLETION_STATUS.IN_PROGRESS,
      LEARNING_COMPLETION_NEXT_ACTION.START_VERIFY,
    );
  }

  if (verify.state === LEARNING_COMPLETION_EVIDENCE_STATE.IN_PROGRESS) {
    return buildDecision(
      projection,
      guided,
      verify,
      LEARNING_COMPLETION_STATUS.IN_PROGRESS,
      LEARNING_COMPLETION_NEXT_ACTION.RESUME_VERIFY,
    );
  }

  if (verify.state === LEARNING_COMPLETION_EVIDENCE_STATE.INCORRECT) {
    return buildDecision(
      projection,
      guided,
      verify,
      LEARNING_COMPLETION_STATUS.NEEDS_REVIEW,
      LEARNING_COMPLETION_NEXT_ACTION.RETRY_VERIFY,
      [verify.reason],
    );
  }

  return buildDecision(
    projection,
    guided,
    verify,
    LEARNING_COMPLETION_STATUS.COMPLETE,
    LEARNING_COMPLETION_NEXT_ACTION.CONTINUE,
  );
}

export const evaluateLearningCompletion = evaluateLearningCompletionCandidate;
