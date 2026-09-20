import { cloneGuidedPracticeResponse } from "./guidedPractice.js";

export const GUIDED_FLOW_ACTIONS = Object.freeze({
  START: "start",
  EXIT: "exit",
  START_OVER: "start-over",
  RESET_SESSION: "reset-session",
  SET_PREDICTION_DRAFT: "set-prediction-draft",
  SUBMIT_PREDICTION: "submit-prediction",
  ACKNOWLEDGE_EXPERIMENT: "acknowledge-experiment",
  SET_EXPLANATION: "set-explanation",
  SUBMIT_EXPLANATION: "submit-explanation",
  SET_PRACTICE_DRAFT: "set-practice-draft",
  SUBMIT_PRACTICE: "submit-practice",
  TOGGLE_NEEDS_REVIEW: "toggle-needs-review",
  NAVIGATE: "navigate",
});

export const GUIDED_FLOW_STEP_INDEX = Object.freeze({
  PREDICT: 0,
  EXPERIMENT: 1,
  EXPLAIN: 2,
  PRACTICE: 3,
  REVIEW: 4,
});

export const GUIDED_FLOW_STEP_COUNT = Object.keys(GUIDED_FLOW_STEP_INDEX).length;

function isNonBlankString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeIdentity(value) {
  return typeof value === "string" && value.length > 0 ? value : null;
}

export function createGuidedFlowState({ learningUnitId, activityRevision }) {
  return {
    learningUnitId: normalizeIdentity(learningUnitId),
    activityRevision: Number.isInteger(activityRevision) ? activityRevision : null,
    active: false,
    stepIndex: GUIDED_FLOW_STEP_INDEX.PREDICT,
    predictionDraft: null,
    firstPrediction: null,
    experimentAcknowledged: false,
    observation: null,
    explanation: "",
    explanationSubmitted: false,
    practiceDraft: null,
    practiceResponse: null,
    needsReview: false,
    completionState: "not-started",
  };
}

export function getGuidedFlowUnlockedStep(state) {
  if (state?.practiceResponse) return GUIDED_FLOW_STEP_INDEX.REVIEW;
  if (state?.explanationSubmitted) return GUIDED_FLOW_STEP_INDEX.PRACTICE;
  if (state?.experimentAcknowledged) return GUIDED_FLOW_STEP_INDEX.EXPLAIN;
  if (state?.firstPrediction) return GUIDED_FLOW_STEP_INDEX.EXPERIMENT;
  return GUIDED_FLOW_STEP_INDEX.PREDICT;
}

function resetForCurrentActivity(state, { learningUnitId, activityRevision } = {}) {
  return createGuidedFlowState({
    learningUnitId: learningUnitId ?? state?.learningUnitId,
    activityRevision: activityRevision ?? state?.activityRevision,
  });
}

export function guidedFlowReducer(state, action) {
  if (!state) return createGuidedFlowState(action ?? {});

  switch (action?.type) {
    case GUIDED_FLOW_ACTIONS.START:
      return {
        ...state,
        active: true,
        completionState: state.completionState === "not-started" ? "in-progress" : state.completionState,
      };

    case GUIDED_FLOW_ACTIONS.EXIT:
      return { ...state, active: false };

    case GUIDED_FLOW_ACTIONS.START_OVER:
      return {
        ...resetForCurrentActivity(state),
        active: true,
        completionState: "in-progress",
      };

    case GUIDED_FLOW_ACTIONS.RESET_SESSION:
      return resetForCurrentActivity(state, action);

    case GUIDED_FLOW_ACTIONS.SET_PREDICTION_DRAFT:
      if (!state.active || state.stepIndex !== GUIDED_FLOW_STEP_INDEX.PREDICT || state.firstPrediction) return state;
      return { ...state, predictionDraft: normalizeIdentity(action.value) };

    case GUIDED_FLOW_ACTIONS.SUBMIT_PREDICTION: {
      if (
        !state.active
        || state.stepIndex !== GUIDED_FLOW_STEP_INDEX.PREDICT
        || state.firstPrediction
      ) return state;
      const value = normalizeIdentity(action.value ?? state.predictionDraft);
      if (!value) return state;
      return {
        ...state,
        predictionDraft: value,
        firstPrediction: value,
        stepIndex: GUIDED_FLOW_STEP_INDEX.EXPERIMENT,
        completionState: "in-progress",
      };
    }

    case GUIDED_FLOW_ACTIONS.ACKNOWLEDGE_EXPERIMENT:
      if (
        !state.active
        || state.stepIndex !== GUIDED_FLOW_STEP_INDEX.EXPERIMENT
        || !state.firstPrediction
      ) return state;
      return {
        ...state,
        experimentAcknowledged: true,
        observation: isNonBlankString(action.observation) ? action.observation : null,
        stepIndex: GUIDED_FLOW_STEP_INDEX.EXPLAIN,
      };

    case GUIDED_FLOW_ACTIONS.SET_EXPLANATION:
      if (
        !state.active
        || state.stepIndex !== GUIDED_FLOW_STEP_INDEX.EXPLAIN
        || state.explanationSubmitted
      ) return state;
      return { ...state, explanation: typeof action.value === "string" ? action.value : "" };

    case GUIDED_FLOW_ACTIONS.SUBMIT_EXPLANATION:
      if (
        !state.active
        || state.stepIndex !== GUIDED_FLOW_STEP_INDEX.EXPLAIN
        || state.explanationSubmitted
        || !isNonBlankString(state.explanation)
      ) return state;
      return {
        ...state,
        explanationSubmitted: true,
        stepIndex: GUIDED_FLOW_STEP_INDEX.PRACTICE,
      };

    case GUIDED_FLOW_ACTIONS.SET_PRACTICE_DRAFT: {
      if (!state.active || state.stepIndex !== GUIDED_FLOW_STEP_INDEX.PRACTICE || state.practiceResponse) return state;
      const value = cloneGuidedPracticeResponse(action.value);
      if (!value) return state;
      return { ...state, practiceDraft: value };
    }

    case GUIDED_FLOW_ACTIONS.SUBMIT_PRACTICE: {
      if (
        !state.active
        || state.stepIndex !== GUIDED_FLOW_STEP_INDEX.PRACTICE
        || state.practiceResponse
      ) return state;
      const value = cloneGuidedPracticeResponse(action.value ?? state.practiceDraft);
      if (!value) return state;
      return {
        ...state,
        practiceDraft: value,
        practiceResponse: value,
        stepIndex: GUIDED_FLOW_STEP_INDEX.REVIEW,
        completionState: "completed",
      };
    }

    case GUIDED_FLOW_ACTIONS.TOGGLE_NEEDS_REVIEW:
      if (
        !state.active
        || state.stepIndex !== GUIDED_FLOW_STEP_INDEX.REVIEW
        || state.completionState !== "completed"
      ) return state;
      return { ...state, needsReview: !state.needsReview };

    case GUIDED_FLOW_ACTIONS.NAVIGATE: {
      const target = action.stepIndex;
      if (
        !state.active
        || !Number.isInteger(target)
        || target < GUIDED_FLOW_STEP_INDEX.PREDICT
        || target >= GUIDED_FLOW_STEP_COUNT
        || target > getGuidedFlowUnlockedStep(state)
      ) return state;
      return { ...state, stepIndex: target };
    }

    default:
      return state;
  }
}
