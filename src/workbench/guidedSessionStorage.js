import { systemClock } from "../platform/clock.js";
import { createGuidedFlowState } from "./guidedFlow.js";
import {
  areGuidedPracticeResponsesEqual,
  cloneGuidedPracticeResponse,
  GUIDED_PRACTICE_KINDS,
  isGuidedPracticeResponseValidForStep,
} from "./guidedPractice.js";
import { getBrowserStorage } from "./stateStorage.js";

const LEGACY_GUIDED_SESSION_SCHEMA_VERSION = 1;
export const GUIDED_SESSION_SCHEMA_VERSION = 2;
// Keep the existing key so valid v1 choice sessions can be discovered and migrated in place.
export const GUIDED_SESSION_STORAGE_PREFIX = "react-learning-workbench:guided-session:v1";

export const GUIDED_SESSION_PERSISTENCE_STATUS = Object.freeze({
  EMPTY: "empty",
  RESTORED: "restored",
  INVALID: "invalid",
  INCOMPATIBLE: "incompatible",
  UNAVAILABLE: "unavailable",
});

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isNonBlankString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isNullableString(value) {
  return value === null || typeof value === "string";
}

function isValidTimestamp(value) {
  return typeof value === "string" && Number.isFinite(Date.parse(value));
}

function getStep(definition, type) {
  return definition?.steps?.find((step) => step.type === type) ?? null;
}

function getStepIds(definition) {
  return new Set(definition?.steps?.map((step) => step.id) ?? []);
}

function getChoiceIds(step) {
  return new Set(step?.response?.options?.map((option) => option.id) ?? []);
}

function isValidChoice(value, optionIds) {
  return value === null || (typeof value === "string" && optionIds.has(value));
}

function arraysEqual(left, right) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

export function getGuidedSessionStorageKey(learningUnitId) {
  if (!isNonBlankString(learningUnitId)) return null;
  return `${GUIDED_SESSION_STORAGE_PREFIX}:${encodeURIComponent(learningUnitId)}`;
}

export function getCompletedGuidedStepIds(state, definition) {
  const completedStepIds = [];
  const predictStep = getStep(definition, "predict");
  const experimentStep = getStep(definition, "experiment");
  const explainStep = getStep(definition, "explain");
  const practiceStep = getStep(definition, "practice");
  const reviewStep = getStep(definition, "review");

  if (state?.firstPrediction) completedStepIds.push(predictStep?.id);
  if (state?.experimentAcknowledged) completedStepIds.push(experimentStep?.id);
  if (state?.explanationSubmitted) completedStepIds.push(explainStep?.id);
  if (state?.practiceResponse) completedStepIds.push(practiceStep?.id);
  if (state?.completionState === "completed") completedStepIds.push(reviewStep?.id);

  return completedStepIds.filter(Boolean);
}

function getSnapshotUpdatedAt(updatedAt) {
  if (updatedAt instanceof Date) return updatedAt.toISOString();
  if (typeof updatedAt === "string") return updatedAt;
  if (typeof updatedAt === "function") return getSnapshotUpdatedAt(updatedAt());
  return systemClock.nowIso();
}

export function serializeGuidedSessionSnapshot(
  state,
  { definition, updatedAt = systemClock.nowIso() } = {},
) {
  if (!isRecord(state)) throw new TypeError("Guided session state is required");
  if (!isRecord(definition) || !isNonBlankString(definition.learningUnitId)) {
    throw new TypeError("Guided Activity definition is required");
  }

  const currentStep = definition.steps?.[state.stepIndex];
  if (!currentStep?.id) throw new TypeError("Guided session current step is invalid");

  const snapshot = {
    schemaVersion: GUIDED_SESSION_SCHEMA_VERSION,
    learningUnitId: definition.learningUnitId,
    activityRevision: definition.revision,
    currentStepId: currentStep.id,
    predictionDraft: state.predictionDraft ?? null,
    firstPrediction: state.firstPrediction ?? null,
    experimentAcknowledged: Boolean(state.experimentAcknowledged),
    observation: state.observation ?? null,
    explanation: typeof state.explanation === "string" ? state.explanation : "",
    explanationSubmitted: Boolean(state.explanationSubmitted),
    practiceDraft: cloneGuidedPracticeResponse(state.practiceDraft),
    practiceResponse: cloneGuidedPracticeResponse(state.practiceResponse),
    needsReview: Boolean(state.needsReview),
    completedSteps: getCompletedGuidedStepIds(state, definition),
    sessionStarted: state.completionState !== "not-started",
    sessionCompleted: state.completionState === "completed",
    updatedAt: getSnapshotUpdatedAt(updatedAt),
  };

  const validation = validateGuidedSessionSnapshot(snapshot, { definition });
  if (!validation.valid) {
    throw new TypeError(`Invalid Guided session state: ${validation.errors.join("; ")}`);
  }
  return snapshot;
}

export function validateGuidedSessionSnapshot(snapshot, { definition } = {}) {
  const errors = [];
  let reason = GUIDED_SESSION_PERSISTENCE_STATUS.INVALID;

  if (!isRecord(snapshot)) {
    errors.push("snapshot must be an object");
    return { valid: false, reason, errors };
  }
  if (!isRecord(definition)) {
    errors.push("Guided Activity definition is required");
    return { valid: false, reason, errors };
  }
  if (snapshot.schemaVersion !== GUIDED_SESSION_SCHEMA_VERSION) {
    errors.push(`schemaVersion must be ${GUIDED_SESSION_SCHEMA_VERSION}`);
  }
  if (snapshot.learningUnitId !== definition.learningUnitId) {
    errors.push("learningUnitId does not match the current Learning Unit");
  }
  if (snapshot.activityRevision !== definition.revision) {
    reason = GUIDED_SESSION_PERSISTENCE_STATUS.INCOMPATIBLE;
    errors.push("activityRevision does not match the current Guided Activity");
  }

  const stepIds = getStepIds(definition);
  if (typeof snapshot.currentStepId !== "string" || !stepIds.has(snapshot.currentStepId)) {
    errors.push("currentStepId is not a current Guided step");
  }

  const predictIds = getChoiceIds(getStep(definition, "predict"));
  const practiceStep = getStep(definition, "practice");
  if (!isValidChoice(snapshot.predictionDraft, predictIds)) errors.push("predictionDraft is invalid");
  if (!isValidChoice(snapshot.firstPrediction, predictIds)) errors.push("firstPrediction is invalid");
  if (!isNullableString(snapshot.observation)) errors.push("observation must be a string or null");
  if (typeof snapshot.explanation !== "string") errors.push("explanation must be a string");
  if (
    snapshot.practiceDraft !== null
    && (!isRecord(snapshot.practiceDraft) || !isGuidedPracticeResponseValidForStep(practiceStep, snapshot.practiceDraft))
  ) {
    errors.push("practiceDraft is invalid");
  }
  if (
    snapshot.practiceResponse !== null
    && (!isRecord(snapshot.practiceResponse) || !isGuidedPracticeResponseValidForStep(practiceStep, snapshot.practiceResponse))
  ) {
    errors.push("practiceResponse is invalid");
  }
  if (snapshot.needsReview !== undefined && typeof snapshot.needsReview !== "boolean") {
    errors.push("needsReview must be boolean when present");
  }
  if (typeof snapshot.experimentAcknowledged !== "boolean") errors.push("experimentAcknowledged must be boolean");
  if (typeof snapshot.explanationSubmitted !== "boolean") errors.push("explanationSubmitted must be boolean");
  if (typeof snapshot.sessionStarted !== "boolean") errors.push("sessionStarted must be boolean");
  if (typeof snapshot.sessionCompleted !== "boolean") errors.push("sessionCompleted must be boolean");
  if (!isValidTimestamp(snapshot.updatedAt)) errors.push("updatedAt must be an ISO timestamp");

  if (!Array.isArray(snapshot.completedSteps)) {
    errors.push("completedSteps must be an array");
  } else {
    const uniqueSteps = new Set(snapshot.completedSteps);
    if (uniqueSteps.size !== snapshot.completedSteps.length) errors.push("completedSteps must not contain duplicates");
    if (snapshot.completedSteps.some((stepId) => !stepIds.has(stepId))) {
      errors.push("completedSteps contains an unknown step");
    }
  }

  const currentStepIndex = definition.steps?.findIndex((step) => step.id === snapshot.currentStepId) ?? -1;
  const predictStep = getStep(definition, "predict");
  const experimentStep = getStep(definition, "experiment");
  const explainStep = getStep(definition, "explain");
  const reviewStep = getStep(definition, "review");

  if (snapshot.firstPrediction !== null && snapshot.predictionDraft !== snapshot.firstPrediction) {
    errors.push("predictionDraft must preserve firstPrediction after submission");
  }
  if (snapshot.experimentAcknowledged && (!snapshot.firstPrediction || !isNonBlankString(snapshot.observation))) {
    errors.push("experiment acknowledgement requires a prediction and observation");
  }
  if (snapshot.explanationSubmitted && (!snapshot.experimentAcknowledged || !isNonBlankString(snapshot.explanation))) {
    errors.push("submitted explanation requires an experiment and non-blank text");
  }
  if (
    snapshot.practiceResponse !== null
    && (
      !snapshot.explanationSubmitted
      || !areGuidedPracticeResponsesEqual(snapshot.practiceDraft, snapshot.practiceResponse)
    )
  ) {
    errors.push("practice response requires the submitted deterministic response");
  }
  if (snapshot.sessionCompleted && (!snapshot.sessionStarted || !snapshot.practiceResponse || currentStepIndex !== definition.steps.length - 1)) {
    errors.push("completed session must be at the review step with a practice response");
  }
  if (!snapshot.sessionCompleted && currentStepIndex === definition.steps.length - 1) {
    errors.push("review step requires a completed session");
  }
  if (!snapshot.sessionStarted && (
    snapshot.predictionDraft
    || snapshot.firstPrediction
    || snapshot.experimentAcknowledged
    || snapshot.observation !== null
    || snapshot.explanation
    || snapshot.explanationSubmitted
    || snapshot.practiceDraft
    || snapshot.practiceResponse
  )) {
    errors.push("not-started session cannot contain learner responses");
  }
  if (!snapshot.firstPrediction && currentStepIndex > 0) errors.push("experiment cannot precede prediction");
  if (!snapshot.experimentAcknowledged && currentStepIndex > 1) errors.push("explanation cannot precede experiment");
  if (!snapshot.explanationSubmitted && currentStepIndex > 2) errors.push("practice cannot precede explanation");
  if (!snapshot.practiceResponse && currentStepIndex > 3) errors.push("review cannot precede practice");

  const expectedCompletedSteps = [
    snapshot.firstPrediction ? predictStep?.id : null,
    snapshot.experimentAcknowledged ? experimentStep?.id : null,
    snapshot.explanationSubmitted ? explainStep?.id : null,
    snapshot.practiceResponse ? practiceStep?.id : null,
    snapshot.sessionCompleted ? reviewStep?.id : null,
  ].filter(Boolean);
  if (Array.isArray(snapshot.completedSteps) && !arraysEqual(snapshot.completedSteps, expectedCompletedSteps)) {
    errors.push("completedSteps does not match the recorded session responses");
  }

  return {
    valid: errors.length === 0,
    reason,
    errors: [...new Set(errors)],
  };
}

function migrateLegacyGuidedSessionSnapshot(snapshot, { definition } = {}) {
  if (snapshot?.schemaVersion !== LEGACY_GUIDED_SESSION_SCHEMA_VERSION) {
    return { ok: true, snapshot };
  }

  const practiceStep = getStep(definition, "practice");
  if (practiceStep?.response?.kind !== GUIDED_PRACTICE_KINDS.CHOICE) {
    return {
      ok: false,
      reason: GUIDED_SESSION_PERSISTENCE_STATUS.INCOMPATIBLE,
      errors: ["v1 Guided session can only migrate into a choice Practice activity"],
    };
  }

  const migrateChoice = (value) => {
    if (value === null || value === undefined) return null;
    if (typeof value !== "string") return value;
    return {
      kind: GUIDED_PRACTICE_KINDS.CHOICE,
      optionId: value,
    };
  };

  return {
    ok: true,
    snapshot: {
      ...snapshot,
      schemaVersion: GUIDED_SESSION_SCHEMA_VERSION,
      practiceDraft: migrateChoice(snapshot.practiceDraft),
      practiceResponse: migrateChoice(snapshot.practiceResponse),
    },
  };
}

export function deserializeGuidedSessionSnapshot(raw, { definition } = {}) {
  if (raw === null || raw === undefined || raw === "") {
    return { status: GUIDED_SESSION_PERSISTENCE_STATUS.EMPTY, snapshot: null, errors: [] };
  }
  if (typeof raw !== "string") {
    return {
      status: GUIDED_SESSION_PERSISTENCE_STATUS.INVALID,
      snapshot: null,
      errors: ["snapshot storage value must be a string"],
    };
  }

  let snapshot;
  try {
    snapshot = JSON.parse(raw);
  } catch {
    return {
      status: GUIDED_SESSION_PERSISTENCE_STATUS.INVALID,
      snapshot: null,
      errors: ["snapshot is not valid JSON"],
    };
  }

  const migration = migrateLegacyGuidedSessionSnapshot(snapshot, { definition });
  if (!migration.ok) {
    return {
      status: migration.reason,
      snapshot: null,
      errors: migration.errors,
    };
  }

  const validation = validateGuidedSessionSnapshot(migration.snapshot, { definition });
  return {
    status: validation.valid
      ? GUIDED_SESSION_PERSISTENCE_STATUS.RESTORED
      : validation.reason,
    snapshot: validation.valid ? migration.snapshot : null,
    errors: validation.errors,
  };
}

export function restoreGuidedFlowState(snapshot, { definition } = {}) {
  const validation = validateGuidedSessionSnapshot(snapshot, { definition });
  if (!validation.valid) {
    throw new TypeError(`Invalid Guided session snapshot: ${validation.errors.join("; ")}`);
  }

  const currentStepIndex = definition.steps.findIndex((step) => step.id === snapshot.currentStepId);
  return {
    ...createGuidedFlowState({
      learningUnitId: definition.learningUnitId,
      activityRevision: definition.revision,
    }),
    active: false,
    stepIndex: currentStepIndex,
    predictionDraft: snapshot.predictionDraft,
    firstPrediction: snapshot.firstPrediction,
    experimentAcknowledged: snapshot.experimentAcknowledged,
    observation: snapshot.observation,
    explanation: snapshot.explanation,
    explanationSubmitted: snapshot.explanationSubmitted,
    practiceDraft: snapshot.practiceDraft,
    practiceResponse: snapshot.practiceResponse,
    needsReview: snapshot.needsReview === true,
    completionState: snapshot.sessionCompleted
      ? "completed"
      : snapshot.sessionStarted
        ? "in-progress"
        : "not-started",
  };
}

function isStorageLike(storage) {
  return storage
    && typeof storage.getItem === "function"
    && typeof storage.setItem === "function"
    && typeof storage.removeItem === "function";
}

export function createGuidedSessionPersistence({
  definition,
  storage = getBrowserStorage(),
  clock = systemClock,
} = {}) {
  const key = getGuidedSessionStorageKey(definition?.learningUnitId);

  const unavailable = () => ({
    status: GUIDED_SESSION_PERSISTENCE_STATUS.UNAVAILABLE,
    snapshot: null,
    errors: ["browser storage is unavailable"],
  });

  return Object.freeze({
    key,
    read() {
      if (!isStorageLike(storage) || !key) return unavailable();

      let raw;
      try {
        raw = storage.getItem(key);
      } catch {
        return unavailable();
      }

      const result = deserializeGuidedSessionSnapshot(raw, { definition });
      if (result.status === GUIDED_SESSION_PERSISTENCE_STATUS.EMPTY
        || result.status === GUIDED_SESSION_PERSISTENCE_STATUS.RESTORED) {
        return result;
      }

      try {
        storage.removeItem(key);
      } catch {
        // Invalid data must never prevent the in-memory Guided flow.
      }
      return result;
    },
    write(state) {
      if (!isStorageLike(storage) || !key) return { ok: false, ...unavailable() };

      try {
        const snapshot = serializeGuidedSessionSnapshot(state, {
          definition,
          updatedAt: clock?.nowIso?.() ?? systemClock.nowIso(),
        });
        storage.setItem(key, JSON.stringify(snapshot));
        return { ok: true, snapshot };
      } catch {
        return { ok: false, ...unavailable() };
      }
    },
    clear() {
      if (!isStorageLike(storage) || !key) return { ok: false, ...unavailable() };
      try {
        storage.removeItem(key);
        return { ok: true, status: "cleared" };
      } catch {
        return { ok: false, ...unavailable() };
      }
    },
  });
}
