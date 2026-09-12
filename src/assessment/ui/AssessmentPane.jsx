import { QuestionRenderer } from "./QuestionRenderer.jsx";
import { deriveAssessmentView, formatAssessmentProgress } from "./assessmentViewModel.js";

export function AssessmentPane({
  session = null,
  currentIndex = 0,
  answer = null,
  feedback = null,
  submitting = false,
  onStart,
  onAnswerChange,
  onSubmit,
  onNext,
  onOpenEvidence,
  onRequestAiQuestions,
}) {
  const view = deriveAssessmentView({ session, currentIndex, feedback });

  if (view.kind === "empty") {
    return (
      <section aria-labelledby="assessment-empty-title">
        <h3 id="assessment-empty-title">当前知识点暂无评测</h3>
        <p>可以开始已有题目，或让 AI 帮你准备一组题目。</p>
        <div>
          <button type="button" onClick={onStart} disabled={!onStart}>开始测试</button>
          <button type="button" onClick={onRequestAiQuestions} disabled={!onRequestAiQuestions}>让 AI 出题</button>
        </div>
      </section>
    );
  }

  const question = view.question;
  const hasAnswer = answer !== null && answer !== "";
  const hasFeedback = Boolean(view.feedback);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!hasAnswer || submitting || hasFeedback) return;
    onSubmit?.({ questionId: view.questionId, revision: view.revision, answer });
  };

  return (
    <section aria-labelledby="assessment-question-heading">
      <header>
        <p aria-label={`评测进度 ${formatAssessmentProgress(view)}`}>进度 {formatAssessmentProgress(view)}</p>
        <h3 id="assessment-question-heading">知识点评测</h3>
      </header>

      <form onSubmit={handleSubmit}>
        <QuestionRenderer question={question} value={answer} onChange={onAnswerChange} disabled={submitting || hasFeedback} />
        {!hasFeedback && (
          <button type="submit" disabled={!hasAnswer || submitting}>
            {submitting ? "提交中…" : "提交答案"}
          </button>
        )}
      </form>

      {hasFeedback && (
        <div role="status" aria-live="polite">
          <strong>{view.feedback.correct ? "回答正确" : "再想一想"}</strong>
          <p id={`${question.id}-explanation`}>{view.feedback.explanation ?? question.content.explanation}</p>
          {question.evidenceRefs?.length > 0 && (
            <div aria-label="答案依据">
              {question.evidenceRefs.map((evidence, index) => (
                <button type="button" key={`${evidence.kind}-${index}`} onClick={() => onOpenEvidence?.(evidence)}>
                  查看依据 {index + 1}
                </button>
              ))}
            </div>
          )}
          {!view.isLast && <button type="button" onClick={onNext}>下一题</button>}
          {view.isLast && <p>本轮评测已完成。</p>}
        </div>
      )}
    </section>
  );
}

export default AssessmentPane;
