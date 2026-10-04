import {
  LEARNER_EVIDENCE_CONTRACT_VERSION,
  LEARNER_EVIDENCE_RECORD_KINDS,
  LEARNER_EVIDENCE_SOURCES,
  validateLearnerEvidenceProjection,
} from "./contract.js";

export class LearnerEvidenceProjectionError extends Error {
  constructor(code, message, details = null) {
    super(message);
    this.name = "LearnerEvidenceProjectionError";
    this.code = code;
    this.details = details;
  }
}

function fail(code, message, details) {
  throw new LearnerEvidenceProjectionError(code, message, details);
}

function cloneValue(value) {
  return value === undefined ? undefined : structuredClone(value);
}

function stableCompare(left, right, timeField, idField = "id") {
  return String(left?.[timeField] ?? "").localeCompare(String(right?.[timeField] ?? ""))
    || String(left?.[idField] ?? "").localeCompare(String(right?.[idField] ?? ""));
}

export function projectAssessmentEvidenceSlice({ session, attempts }) {
  if (!session || typeof session !== "object" || !Array.isArray(session.items)) {
    fail("ASSESSMENT_SESSION_INVALID", "Assessment evidence requires a valid session");
  }
  if (!Array.isArray(attempts)) {
    fail("ASSESSMENT_ATTEMPTS_INVALID", "Assessment evidence requires attempts array");
  }

  const orderedAttempts = [...attempts].sort((left, right) => (
    stableCompare(left, right, "submittedAt")
  ));

  const records = orderedAttempts.map((attempt) => {
    if (attempt.sessionId !== session.id) {
      fail(
        "ASSESSMENT_ATTEMPT_SESSION_MISMATCH",
        "Assessment attempt does not belong to source session",
        { sessionId: session.id, attemptId: attempt.id },
      );
    }
    if (typeof attempt.correct !== "boolean") {
      fail(
        "ASSESSMENT_CORRECTNESS_INVALID",
        "Assessment attempt correctness must be persisted boolean",
        { attemptId: attempt.id },
      );
    }

    const item = session.items.find(({ questionId }) => questionId === attempt.questionId);
    if (!item) {
      fail(
        "ASSESSMENT_QUESTION_PROVENANCE_MISSING",
        "Assessment attempt has no frozen question item in its session",
        { sessionId: session.id, attemptId: attempt.id, questionId: attempt.questionId },
      );
    }
    if (item.revision !== attempt.questionRevision) {
      fail(
        "ASSESSMENT_REVISION_MISMATCH",
        "Assessment attempt revision does not match frozen session item",
        { attemptId: attempt.id, questionId: attempt.questionId },
      );
    }

    return {
      projectionKey: "assessment:attempt:" + attempt.id,
      kind: LEARNER_EVIDENCE_RECORD_KINDS.ASSESSMENT_ANSWER,
      task: {
        id: attempt.questionId,
        revision: attempt.questionRevision,
        snapshot: cloneValue(item.snapshot),
      },
      response: {
        kind: "answer",
        value: cloneValue(attempt.answer),
      },
      outcome: {
        kind: "correctness",
        correct: attempt.correct,
        authority: LEARNER_EVIDENCE_SOURCES.ASSESSMENT,
      },
      occurredAt: attempt.submittedAt,
      provenance: {
        owner: LEARNER_EVIDENCE_SOURCES.ASSESSMENT,
        sessionId: session.id,
        attemptId: attempt.id,
        questionId: attempt.questionId,
        questionRevision: attempt.questionRevision,
      },
    };
  });

  return {
    source: LEARNER_EVIDENCE_SOURCES.ASSESSMENT,
    sourceRef: { sessionId: session.id },
    lifecycle: {
      status: session.status,
      startedAt: session.startedAt,
      completedAt: session.completedAt,
    },
    records,
  };
}

function guidedTask(step, revision) {
  return {
    id: step.id,
    type: step.type,
    revision,
  };
}

function guidedProvenance(step, revision) {
  return {
    owner: LEARNER_EVIDENCE_SOURCES.GUIDED,
    activityRevision: revision,
    stepId: step.id,
  };
}

export function projectGuidedEvidenceSlice({ definition, snapshot, practiceOutcome = null }) {
  if (!definition || typeof definition !== "object" || !definition.learningUnitId) {
    fail("GUIDED_DEFINITION_INVALID", "Guided evidence requires an activity definition");
  }

  const revision = definition.revision;
  const byType = new Map(definition.steps.map((step) => [step.type, step]));
  const predict = byType.get("predict");
  const experiment = byType.get("experiment");
  const explain = byType.get("explain");
  const practice = byType.get("practice");

  if (!snapshot) {
    return {
      source: LEARNER_EVIDENCE_SOURCES.GUIDED,
      sourceRef: { activityRevision: revision },
      lifecycle: {
        status: "not_started",
        updatedAt: null,
      },
      learnerState: {
        needsReview: false,
      },
      records: [],
    };
  }

  if (snapshot.learningUnitId !== definition.learningUnitId) {
    fail("GUIDED_IDENTITY_MISMATCH", "Guided snapshot learningUnitId does not match definition");
  }
  if (snapshot.activityRevision !== revision) {
    fail("GUIDED_REVISION_MISMATCH", "Guided snapshot revision does not match definition");
  }

  const records = [];
  const projectionKey = (step) => (
    "guided:"
    + definition.learningUnitId
    + ":r"
    + revision
    + ":"
    + step.id
  );

  if (snapshot.firstPrediction) {
    records.push({
      projectionKey: projectionKey(predict),
      kind: LEARNER_EVIDENCE_RECORD_KINDS.GUIDED_PREDICTION,
      task: guidedTask(predict, revision),
      response: {
        kind: "choice",
        optionId: snapshot.firstPrediction,
      },
      outcome: null,
      occurredAt: null,
      provenance: guidedProvenance(predict, revision),
    });
  }

  if (snapshot.experimentAcknowledged) {
    records.push({
      projectionKey: projectionKey(experiment),
      kind: LEARNER_EVIDENCE_RECORD_KINDS.GUIDED_EXPERIMENT_ACK,
      task: guidedTask(experiment, revision),
      response: {
        kind: "acknowledgement",
        acknowledged: true,
      },
      context: {
        observation: snapshot.observation,
      },
      outcome: null,
      occurredAt: null,
      provenance: guidedProvenance(experiment, revision),
    });
  }

  if (snapshot.explanationSubmitted) {
    records.push({
      projectionKey: projectionKey(explain),
      kind: LEARNER_EVIDENCE_RECORD_KINDS.GUIDED_EXPLANATION,
      task: guidedTask(explain, revision),
      response: {
        kind: "text",
        text: snapshot.explanation,
      },
      outcome: null,
      occurredAt: null,
      provenance: guidedProvenance(explain, revision),
    });
  }

  if (snapshot.practiceResponse) {
    if (!practiceOutcome || typeof practiceOutcome.correct !== "boolean") {
      fail(
        "GUIDED_PRACTICE_OUTCOME_MISSING",
        "Guided source must provide domain-owned deterministic Practice outcome",
      );
    }
    records.push({
      projectionKey: projectionKey(practice),
      kind: LEARNER_EVIDENCE_RECORD_KINDS.GUIDED_PRACTICE,
      task: guidedTask(practice, revision),
      response: {
        kind: "guided-practice",
        value: cloneValue(snapshot.practiceResponse),
      },
      outcome: {
        kind: "correctness",
        correct: practiceOutcome.correct,
        authority: LEARNER_EVIDENCE_SOURCES.GUIDED,
      },
      occurredAt: null,
      provenance: guidedProvenance(practice, revision),
    });
  }

  return {
    source: LEARNER_EVIDENCE_SOURCES.GUIDED,
    sourceRef: { activityRevision: revision },
    lifecycle: {
      status: snapshot.sessionCompleted
        ? "completed"
        : snapshot.sessionStarted
          ? "in_progress"
          : "not_started",
      updatedAt: snapshot.updatedAt,
    },
    learnerState: {
      needsReview: snapshot.needsReview === true,
    },
    records,
  };
}

export function createLearnerEvidenceProjection({
  learningUnitId,
  assessmentSources = [],
  guidedSource = null,
}) {
  if (typeof learningUnitId !== "string" || learningUnitId.trim() === "") {
    fail("LEARNING_UNIT_ID_INVALID", "Learner Evidence requires learningUnitId");
  }
  if (!Array.isArray(assessmentSources)) {
    fail("ASSESSMENT_SOURCES_INVALID", "assessmentSources must be an array");
  }

  const orderedAssessment = [...assessmentSources].sort((left, right) => (
    stableCompare(left?.session, right?.session, "startedAt")
  ));

  for (const source of orderedAssessment) {
    if (source?.session?.learningUnitId !== learningUnitId) {
      fail(
        "ASSESSMENT_IDENTITY_MISMATCH",
        "Assessment source does not belong to requested Learning Unit",
      );
    }
  }

  if (guidedSource?.definition?.learningUnitId !== undefined
    && guidedSource.definition.learningUnitId !== learningUnitId) {
    fail(
      "GUIDED_IDENTITY_MISMATCH",
      "Guided source does not belong to requested Learning Unit",
    );
  }

  const sources = orderedAssessment.map(projectAssessmentEvidenceSlice);
  if (guidedSource) sources.push(projectGuidedEvidenceSlice(guidedSource));

  const projection = {
    contractVersion: LEARNER_EVIDENCE_CONTRACT_VERSION,
    learningUnitId,
    sources,
  };

  const validation = validateLearnerEvidenceProjection(projection);
  if (!validation.valid) {
    fail(
      "PROJECTION_CONTRACT_INVALID",
      "Projected Learner Evidence violates frozen V1 contract",
      validation.errors,
    );
  }

  return projection;
}
