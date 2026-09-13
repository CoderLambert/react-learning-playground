export function selectAssessmentQuestionsForLearningUnit(snapshot, learningUnitId) {
  if (!learningUnitId || snapshot?.learningUnitId !== learningUnitId) return [];
  return Array.isArray(snapshot.questions) ? snapshot.questions : [];
}
