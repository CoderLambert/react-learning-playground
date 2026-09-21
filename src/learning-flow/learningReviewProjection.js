function normalizeIncorrectCount(value) {
  return Number.isInteger(value) && value > 0 ? value : 0;
}

export function createLearningReviewProjection({
  assessmentReview = null,
  guidedNeedsReview = false,
} = {}) {
  const latestAssessmentReview = assessmentReview?.review ?? assessmentReview?.history?.[0] ?? null;
  const assessmentIncorrectCount = normalizeIncorrectCount(latestAssessmentReview?.incorrectCount);
  const guided = guidedNeedsReview === true;

  const reasons = [];
  if (assessmentIncorrectCount > 0) {
    reasons.push(Object.freeze({
      kind: "assessment-incorrect",
      incorrectCount: assessmentIncorrectCount,
    }));
  }
  if (guided) {
    reasons.push(Object.freeze({ kind: "guided-needs-review" }));
  }

  return Object.freeze({
    needsReview: reasons.length > 0,
    assessmentIncorrectCount,
    guidedNeedsReview: guided,
    reasons: Object.freeze(reasons),
  });
}
