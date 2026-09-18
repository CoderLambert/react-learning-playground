import {
  buildLearningActionPrompt,
  createGuidedReasoningReviewContext,
  LEARNING_ACTION_KINDS,
} from "../learning-actions/public.js";

const GUIDED_AI_DRAFT_REPLACEMENT_MESSAGE = "AI composer 中已有草稿。是否替换为这次 Guided reasoning review prompt？";

export function buildGuidedReasoningReviewPrompt(payload = {}) {
  const context = createGuidedReasoningReviewContext(payload);
  return buildLearningActionPrompt({
    action: LEARNING_ACTION_KINDS.REVIEW_REASONING,
    context,
  });
}

export function prepareGuidedAiHandoff({
  learningUnit,
  payload,
  currentDraft = "",
  confirm = globalThis.confirm,
} = {}) {
  const prompt = buildGuidedReasoningReviewPrompt({
    learningUnit,
    ...payload,
  });

  const hasExistingDraft = typeof currentDraft === "string" && currentDraft.trim().length > 0;
  const shouldReplace = !hasExistingDraft || (
    typeof confirm === "function" && confirm(GUIDED_AI_DRAFT_REPLACEMENT_MESSAGE) === true
  );

  return Object.freeze({
    accepted: shouldReplace,
    prompt: shouldReplace ? prompt : null,
    mode: "chat",
    inspectorOpen: true,
    inspectorTab: "ai",
    autoSubmit: false,
  });
}

export { GUIDED_AI_DRAFT_REPLACEMENT_MESSAGE };
