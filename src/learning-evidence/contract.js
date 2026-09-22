export const LEARNER_EVIDENCE_CONTRACT_VERSION = "learner-evidence-v1";

export const LEARNER_EVIDENCE_SOURCES = Object.freeze({
  ASSESSMENT: "assessment",
  GUIDED: "guided",
});

export const LEARNER_EVIDENCE_RECORD_KINDS = Object.freeze({
  ASSESSMENT_ANSWER: "assessment-answer",
  GUIDED_PREDICTION: "guided-prediction",
  GUIDED_EXPERIMENT_ACK: "guided-experiment-acknowledgement",
  GUIDED_EXPLANATION: "guided-explanation",
  GUIDED_PRACTICE: "guided-practice",
});

export const LEARNER_EVIDENCE_OUTCOME_AUTHORITIES = Object.freeze({
  ASSESSMENT: "assessment",
  GUIDED: "guided",
});

const FORBIDDEN_KEYS = new Set([
  "mastery",
  "masteryScore",
  "score",
  "confidence",
  "aiVerdict",
  "retryCount",
  "resolved",
  "resolution",
]);

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isNonBlank(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function positiveInteger(value) {
  return Number.isInteger(value) && value >= 1;
}

function issue(code, message, path = null) {
  return Object.freeze({ code, message, path });
}

function scanForbiddenKeys(value, path, errors) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => scanForbiddenKeys(item, path + "[" + index + "]", errors));
    return;
  }
  if (!isRecord(value)) return;

  for (const [key, nested] of Object.entries(value)) {
    const nextPath = path ? path + "." + key : key;
    if (FORBIDDEN_KEYS.has(key)) {
      errors.push(issue(
        "FORBIDDEN_DERIVED_AUTHORITY",
        "Learner Evidence V1 cannot contain " + key,
        nextPath,
      ));
    }
    scanForbiddenKeys(nested, nextPath, errors);
  }
}

function validateLifecycle(slice, errors, path) {
  const lifecycle = slice.lifecycle;
  if (!isRecord(lifecycle) || !isNonBlank(lifecycle.status)) {
    errors.push(issue("SOURCE_LIFECYCLE_INVALID", "source slice requires lifecycle.status", path + ".lifecycle"));
    return;
  }

  if (slice.source === LEARNER_EVIDENCE_SOURCES.ASSESSMENT) {
    if (!["in_progress", "completed", "superseded"].includes(lifecycle.status)) {
      errors.push(issue("ASSESSMENT_STATUS_INVALID", "invalid Assessment source status", path + ".lifecycle.status"));
    }
    if (!isNonBlank(lifecycle.startedAt)) {
      errors.push(issue("ASSESSMENT_STARTED_AT_MISSING", "Assessment source requires startedAt", path + ".lifecycle.startedAt"));
    }
    if (lifecycle.status === "completed" && !isNonBlank(lifecycle.completedAt)) {
      errors.push(issue("ASSESSMENT_COMPLETED_AT_MISSING", "completed Assessment source requires completedAt", path + ".lifecycle.completedAt"));
    }
  }

  if (slice.source === LEARNER_EVIDENCE_SOURCES.GUIDED) {
    if (!["not_started", "in_progress", "completed"].includes(lifecycle.status)) {
      errors.push(issue("GUIDED_STATUS_INVALID", "invalid Guided source status", path + ".lifecycle.status"));
    }
    if (lifecycle.updatedAt !== null && !isNonBlank(lifecycle.updatedAt)) {
      errors.push(issue("GUIDED_UPDATED_AT_INVALID", "Guided updatedAt must be null or non-blank", path + ".lifecycle.updatedAt"));
    }
  }
}

function validateSourceRef(slice, errors, path) {
  const ref = slice.sourceRef;
  if (!isRecord(ref)) {
    errors.push(issue("SOURCE_REF_INVALID", "source slice requires sourceRef", path + ".sourceRef"));
    return;
  }

  if (slice.source === LEARNER_EVIDENCE_SOURCES.ASSESSMENT) {
    if (!isNonBlank(ref.sessionId)) {
      errors.push(issue("ASSESSMENT_SESSION_ID_MISSING", "Assessment sourceRef requires sessionId", path + ".sourceRef.sessionId"));
    }
  }

  if (slice.source === LEARNER_EVIDENCE_SOURCES.GUIDED) {
    if (!positiveInteger(ref.activityRevision)) {
      errors.push(issue("GUIDED_REVISION_INVALID", "Guided sourceRef requires positive activityRevision", path + ".sourceRef.activityRevision"));
    }
    if ("runId" in ref && ref.runId !== null) {
      errors.push(issue(
        "GUIDED_RUN_ID_NOT_OWNED",
        "Guided V1 does not own a historical run id",
        path + ".sourceRef.runId",
      ));
    }
  }
}

function validateOutcome(record, slice, errors, path) {
  const outcome = record.outcome;
  if (outcome == null) return;

  if (!isRecord(outcome) || outcome.kind !== "correctness" || typeof outcome.correct !== "boolean") {
    errors.push(issue("OUTCOME_INVALID", "outcome must be null or deterministic correctness", path + ".outcome"));
    return;
  }

  const expectedAuthority =
    slice.source === LEARNER_EVIDENCE_SOURCES.ASSESSMENT
      ? LEARNER_EVIDENCE_OUTCOME_AUTHORITIES.ASSESSMENT
      : record.kind === LEARNER_EVIDENCE_RECORD_KINDS.GUIDED_PRACTICE
        ? LEARNER_EVIDENCE_OUTCOME_AUTHORITIES.GUIDED
        : null;

  if (!expectedAuthority) {
    errors.push(issue("OUTCOME_NOT_OWNED", "this record kind does not own deterministic correctness", path + ".outcome"));
    return;
  }

  if (outcome.authority !== expectedAuthority) {
    errors.push(issue("OUTCOME_AUTHORITY_INVALID", "incorrect outcome authority", path + ".outcome.authority"));
  }
}

function validateRecord(record, slice, errors, path) {
  if (!isRecord(record)) {
    errors.push(issue("EVIDENCE_RECORD_INVALID", "record must be an object", path));
    return;
  }

  if (!isNonBlank(record.projectionKey)) {
    errors.push(issue("PROJECTION_KEY_INVALID", "record requires projectionKey", path + ".projectionKey"));
  }
  if (!isNonBlank(record.kind)) {
    errors.push(issue("RECORD_KIND_INVALID", "record requires kind", path + ".kind"));
  }
  if (!isRecord(record.task) || !isNonBlank(record.task.id)) {
    errors.push(issue("TASK_REF_INVALID", "record requires task.id", path + ".task"));
  }
  if (!isRecord(record.response) || !isNonBlank(record.response.kind)) {
    errors.push(issue("RESPONSE_INVALID", "record requires response.kind", path + ".response"));
  }
  if (!isRecord(record.provenance) || record.provenance.owner !== slice.source) {
    errors.push(issue("PROVENANCE_OWNER_INVALID", "record provenance must point to its source owner", path + ".provenance"));
  }
  if (record.occurredAt !== null && !isNonBlank(record.occurredAt)) {
    errors.push(issue("OCCURRED_AT_INVALID", "occurredAt must be null or non-blank", path + ".occurredAt"));
  }

  const allowedBySource = slice.source === LEARNER_EVIDENCE_SOURCES.ASSESSMENT
    ? [LEARNER_EVIDENCE_RECORD_KINDS.ASSESSMENT_ANSWER]
    : [
        LEARNER_EVIDENCE_RECORD_KINDS.GUIDED_PREDICTION,
        LEARNER_EVIDENCE_RECORD_KINDS.GUIDED_EXPERIMENT_ACK,
        LEARNER_EVIDENCE_RECORD_KINDS.GUIDED_EXPLANATION,
        LEARNER_EVIDENCE_RECORD_KINDS.GUIDED_PRACTICE,
      ];

  if (!allowedBySource.includes(record.kind)) {
    errors.push(issue("RECORD_KIND_SOURCE_MISMATCH", "record kind is not owned by this source", path + ".kind"));
  }

  if (
    record.kind === LEARNER_EVIDENCE_RECORD_KINDS.ASSESSMENT_ANSWER
    && !isNonBlank(record.occurredAt)
  ) {
    errors.push(issue("ASSESSMENT_ATTEMPT_TIME_MISSING", "Assessment answer requires submittedAt provenance", path + ".occurredAt"));
  }

  if (
    slice.source === LEARNER_EVIDENCE_SOURCES.GUIDED
    && record.occurredAt !== null
  ) {
    errors.push(issue(
      "GUIDED_RECORD_TIME_NOT_OWNED",
      "Guided V1 does not own per-step timestamps",
      path + ".occurredAt",
    ));
  }

  validateOutcome(record, slice, errors, path);
}

export function validateLearnerEvidenceProjection(projection) {
  const errors = [];

  if (!isRecord(projection)) {
    return Object.freeze({
      valid: false,
      errors: Object.freeze([issue("PROJECTION_INVALID", "projection must be an object")]),
    });
  }

  scanForbiddenKeys(projection, "", errors);

  if (projection.contractVersion !== LEARNER_EVIDENCE_CONTRACT_VERSION) {
    errors.push(issue("CONTRACT_VERSION_INVALID", "unexpected Learner Evidence contract version", "contractVersion"));
  }
  if (!isNonBlank(projection.learningUnitId)) {
    errors.push(issue("LEARNING_UNIT_ID_INVALID", "projection requires learningUnitId", "learningUnitId"));
  }
  if (!Array.isArray(projection.sources)) {
    errors.push(issue("SOURCES_INVALID", "projection.sources must be an array", "sources"));
    return Object.freeze({ valid: false, errors: Object.freeze(errors) });
  }

  const projectionKeys = new Set();

  projection.sources.forEach((slice, sourceIndex) => {
    const path = "sources[" + sourceIndex + "]";
    if (!isRecord(slice)) {
      errors.push(issue("SOURCE_SLICE_INVALID", "source slice must be an object", path));
      return;
    }
    if (!Object.values(LEARNER_EVIDENCE_SOURCES).includes(slice.source)) {
      errors.push(issue("SOURCE_INVALID", "unknown Evidence source", path + ".source"));
      return;
    }

    validateSourceRef(slice, errors, path);
    validateLifecycle(slice, errors, path);

    if (slice.source === LEARNER_EVIDENCE_SOURCES.GUIDED) {
      if (!isRecord(slice.learnerState) || typeof slice.learnerState.needsReview !== "boolean") {
        errors.push(issue(
          "GUIDED_LEARNER_STATE_INVALID",
          "Guided source requires current learnerState.needsReview",
          path + ".learnerState",
        ));
      }
    } else if ("learnerState" in slice && slice.learnerState != null) {
      errors.push(issue(
        "ASSESSMENT_LEARNER_STATE_UNOWNED",
        "Assessment source does not own Guided learnerState",
        path + ".learnerState",
      ));
    }

    if (!Array.isArray(slice.records)) {
      errors.push(issue("RECORDS_INVALID", "source slice requires records array", path + ".records"));
      return;
    }

    slice.records.forEach((record, recordIndex) => {
      const recordPath = path + ".records[" + recordIndex + "]";
      validateRecord(record, slice, errors, recordPath);

      if (isNonBlank(record?.projectionKey)) {
        if (projectionKeys.has(record.projectionKey)) {
          errors.push(issue(
            "PROJECTION_KEY_DUPLICATE",
            "projectionKey must be unique within one projection",
            recordPath + ".projectionKey",
          ));
        }
        projectionKeys.add(record.projectionKey);
      }
    });
  });

  return Object.freeze({
    valid: errors.length === 0,
    errors: Object.freeze(errors),
  });
}
