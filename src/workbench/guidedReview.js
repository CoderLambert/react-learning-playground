function getStep(definition, type) {
  return definition?.steps?.find((step) => step.type === type) ?? null;
}

function getChoice(step, optionId) {
  const option = step?.response?.options?.find((candidate) => candidate.id === optionId);
  return Object.freeze({
    optionId: optionId ?? null,
    label: option?.label ?? optionId ?? "未选择",
  });
}

/**
 * Derive the review facts from the existing Guided session state. This model
 * intentionally contains only deterministic activity outcomes and raw learner
 * responses; it does not infer correctness, mastery, or skill level.
 */
export function getGuidedReviewModel(state, definition) {
  if (!state || state.completionState !== "completed" || !definition) return null;

  const predictionStep = getStep(definition, "predict");
  const practiceStep = getStep(definition, "practice");
  const reviewStep = getStep(definition, "review");
  const practiceOutcome = Object.freeze({
    response: getChoice(practiceStep, state.practiceResponse),
    observation: practiceStep?.reveal?.observation ?? null,
  });

  return Object.freeze({
    firstPrediction: getChoice(predictionStep, state.firstPrediction),
    actualObservation: state.observation ?? null,
    explanation: state.explanation ?? "",
    practiceOutcome,
    needsReview: state.needsReview === true,
    resources: Object.freeze([...(reviewStep?.resources ?? [])]),
  });
}
