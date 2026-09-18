// Runtime-safe cross-feature façade. Keep JSX-bearing UI exports in index.js
// so Node-side contract tests can consume learning-action protocols directly.
export {
  LEARNING_ACTION_KINDS,
  LEARNING_CONTEXT_KINDS,
  buildLearningActionPrompt,
  clampLearningSelection,
  createGuidedReasoningReviewContext,
  createLearningActionContext,
  getLearningActionsForContext,
} from "./promptBuilder.js";
export {
  LEARNING_ACTION_EVENT,
  emitLearningAction,
  subscribeLearningActions,
} from "./learningActionEvent.js";
