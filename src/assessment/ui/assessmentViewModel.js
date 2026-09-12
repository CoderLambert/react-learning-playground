export function deriveAssessmentView({ session, currentIndex = 0, feedback = null } = {}) {
  if (!session?.items?.length) {
    return Object.freeze({ kind: "empty", total: 0, currentIndex: 0, question: null, isLast: false, feedback: null });
  }

  const index = Math.min(Math.max(Number.isInteger(currentIndex) ? currentIndex : 0, 0), session.items.length - 1);
  const item = session.items[index];
  return Object.freeze({
    kind: "session",
    total: session.items.length,
    currentIndex: index,
    position: index + 1,
    question: item.snapshot,
    questionId: item.questionId,
    revision: item.revision,
    isLast: index === session.items.length - 1,
    feedback,
  });
}

export function formatAssessmentProgress(view) {
  return view?.kind === "session" ? `${view.position} / ${view.total}` : "0 / 0";
}
