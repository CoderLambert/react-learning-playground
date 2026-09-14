function clone(value) {
  return structuredClone(value);
}

function latestAttemptsByQuestion(attempts = []) {
  const byQuestion = new Map();
  for (const attempt of attempts) {
    const current = byQuestion.get(attempt.questionId);
    if (!current || String(attempt.submittedAt) >= String(current.submittedAt)) {
      byQuestion.set(attempt.questionId, attempt);
    }
  }
  return byQuestion;
}

export function createAssessmentSessionReview({ session, attempts = [] }) {
  if (!session || session.status !== "completed") return null;

  const byQuestion = latestAttemptsByQuestion(attempts);
  const items = session.items
    .map((item, index) => {
      const attempt = byQuestion.get(item.questionId);
      if (!attempt) return null;
      return {
        index,
        questionId: item.questionId,
        revision: item.revision,
        snapshot: clone(item.snapshot),
        answer: clone(attempt.answer),
        correct: attempt.correct,
        submittedAt: attempt.submittedAt,
      };
    })
    .filter(Boolean)
    .sort((left, right) => Number(left.correct) - Number(right.correct) || left.index - right.index);

  const correctCount = items.filter((item) => item.correct).length;
  return Object.freeze({
    sessionId: session.id,
    learningUnitId: session.learningUnitId,
    startedAt: session.startedAt,
    completedAt: session.completedAt,
    total: session.items.length,
    answered: items.length,
    correctCount,
    incorrectCount: items.length - correctCount,
    items: Object.freeze(items),
  });
}
