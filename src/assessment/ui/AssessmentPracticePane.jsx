import { useState } from "react";
import { getMisconceptionForLearningUnit } from "../../content/conceptModels.js";
import { HighlightedCode } from "../../components/HighlightedCode.jsx";
import { Badge } from "../../components/ui/badge.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Card, CardContent, CardHeader } from "../../components/ui/card.jsx";
import { Progress } from "../../components/ui/progress.jsx";
import { evaluateQuestionAnswer } from "../domain/attempt.js";
import MarkdownRender from "markstream-react";
import "markstream-react/index.css";
import { QuestionRenderer } from "./QuestionRenderer.jsx";
import {
  deriveAssessmentView,
  formatAssessmentPositionLabel,
  formatAssessmentProgress,
} from "./assessmentViewModel.js";

const TYPE_LABELS = Object.freeze({ single_choice: "单选题", true_false: "判断题" });
const DIFFICULTY_LABELS = Object.freeze({ easy: "简单", medium: "中等", hard: "较难" });
const DIFFICULTY_VARIANTS = Object.freeze({ easy: "success", medium: "warning", hard: "destructive" });

const EMPTY_CORRECTION = Object.freeze({
  questionId: null,
  active: false,
  answer: "",
  feedback: null,
});

function QuestionCodeContext({ codeContext }) {
  if (!codeContext?.code) return null;

  return (
    <div
      className="overflow-hidden rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface-secondary)]"
      data-assessment-code-context
    >
      {codeContext.label && (
        <div className="border-b border-[var(--border-subtle)] px-3 py-2 text-xs font-bold text-[var(--text-muted)]">
          {codeContext.label}
        </div>
      )}
      <HighlightedCode
        code={codeContext.code}
        language={codeContext.language ?? "jsx"}
        className="assessment-code-context__code"
      />
    </div>
  );
}

function EvidenceButton({ evidence, index, onOpen }) {
  const lineLabel = evidence?.kind === "source"
    ? `L${evidence.startLine}${evidence.endLine !== evidence.startLine ? `–${evidence.endLine}` : ""}`
    : null;
  const label = evidence?.kind === "source"
    ? `${evidence.fileName} · ${lineLabel}`
    : `查看依据 ${index + 1}`;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onOpen?.(evidence)}
      aria-label={`查看依据 ${index + 1}`}
      className="max-w-full justify-start"
    >
      <span aria-hidden="true">↗</span>
      <span className="truncate">{label}</span>
    </Button>
  );
}

function MisconceptionRemediation({
  misconception,
  question,
  explanation,
  showFeedbackExplanation,
  onRetry,
}) {
  if (!misconception) return null;

  return (
    <div
      className="mt-3 space-y-3 rounded-lg border border-[var(--color-warning-border,var(--border-color))] bg-[var(--color-warning-light,var(--bg-surface-secondary))] p-3"
      data-assessment-misconception={misconception.id}
    >
      <div>
        <span className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--color-warning-text,var(--text-muted))]">
          先验证这个推理点
        </span>
        <h4 className="mt-1 mb-0 text-sm font-bold text-[var(--text-main)]">
          {misconception.title}
        </h4>
      </div>

      <p className="m-0 text-sm leading-6 text-[var(--text-muted)]">
        {misconception.diagnosis}
      </p>

      <div className="rounded-md bg-[var(--bg-surface)] p-3">
        <strong className="text-xs font-bold text-[var(--text-main)]">反证线索</strong>
        <p className="mt-1 mb-0 text-sm leading-6 text-[var(--text-muted)]">
          {misconception.counterEvidence}
        </p>
      </div>

      <div className="rounded-md bg-[var(--bg-surface)] p-3">
        <strong className="text-xs font-bold text-[var(--text-main)]">先做这个实验</strong>
        <p className="mt-1 mb-0 text-sm leading-6 text-[var(--text-muted)]">
          {misconception.experiment}
        </p>
      </div>

      <Button type="button" onClick={onRetry} className="w-full sm:w-auto">
        重新选择
      </Button>

      {showFeedbackExplanation && (
        <details className="text-sm">
          <summary className="cursor-pointer font-bold text-[var(--text-main)]">
            实验后再看完整解释
          </summary>
          <div id={`${question.id}-explanation`} className="mt-2 leading-6 text-[var(--text-main)]">
            <MarkdownRender content={explanation} final htmlPolicy="escape" />
          </div>
        </details>
      )}
    </div>
  );
}

export function AssessmentPracticePane({
  session = null,
  currentIndex = 0,
  answer = null,
  feedback = null,
  showFeedbackExplanation = true,
  showAiQuestionAction = true,
  startError = null,
  starting = false,
  submitError = null,
  submitting = false,
  onStart,
  onAnswerChange,
  onSubmit,
  onNext,
  onOpenEvidence,
  onRequestAiQuestions,
  onRequestExplanationReview,
}) {
  const [correction, setCorrection] = useState(EMPTY_CORRECTION);
  const [teachBackByQuestion, setTeachBackByQuestion] = useState({});
  const view = deriveAssessmentView({ session, currentIndex, feedback });

  if (view.kind === "empty") {
    const canStart = typeof onStart === "function";
    return (
      <section className="min-w-0 p-4 sm:p-5" aria-labelledby="assessment-empty-title">
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-secondary)]">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-light)] text-base font-bold text-[var(--color-primary)]">
                {canStart ? "✓" : "?"}
              </div>
              <div className="min-w-0">
                <p className="m-0 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-subtle)]">
                  知识点评测
                </p>
                <h3 id="assessment-empty-title" className="mt-1 mb-0 text-base font-bold text-[var(--text-main)]">
                  {canStart ? "准备好检查理解了吗？" : "当前知识点暂无评测"}
                </h3>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-5">
            <p className="m-0 text-sm leading-6 text-[var(--text-muted)]">
              {canStart
                ? "开始后会记录本轮答题进度；题目使用创建会话时的快照，不受后续题库修改影响。"
                : "可以让 AI 根据当前知识点、笔记和源码准备一组可直接作答的评测题。"}
            </p>

            {startError && (
              <div
                role="alert"
                className="rounded-xl border border-[var(--color-danger-border)] bg-[var(--color-danger-light)] p-4 text-sm leading-6 text-[var(--color-danger-text)]"
              >
                <strong className="font-bold">开始评测失败，可重试</strong>
                <p className="mt-1 mb-0">{startError}</p>
              </div>
            )}

            <div className="flex flex-col gap-2 sm:flex-row">
              {canStart && (
                <Button
                  onClick={onStart}
                  disabled={starting}
                  aria-busy={starting || undefined}
                  className="w-full sm:flex-1"
                >
                  {starting ? "正在开始…" : "开始测试"}
                </Button>
              )}
              {showAiQuestionAction && (
                <Button
                  variant={canStart ? "outline" : "default"}
                  onClick={onRequestAiQuestions}
                  disabled={!onRequestAiQuestions || starting}
                  className="w-full sm:flex-1"
                >
                  {canStart ? "让 AI 补充题目" : "让 AI 帮我出题"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  const question = view.question;
  const activeCorrection = correction.questionId === question.id ? correction : EMPTY_CORRECTION;
  const correctionActive = activeCorrection.active;
  const displayAnswer = correctionActive ? activeCorrection.answer : answer;
  const displayFeedback = correctionActive ? activeCorrection.feedback : view.feedback;
  const diagnosticMisconceptionId = displayFeedback && !displayFeedback.correct
    ? question.content?.diagnosticOptionMap?.[String(displayAnswer)]
    : null;
  const diagnosticMisconception = getMisconceptionForLearningUnit(
    question.learningUnitId,
    diagnosticMisconceptionId,
  );
  const hasAnswer = displayAnswer !== null && displayAnswer !== "";
  const hasFeedback = Boolean(displayFeedback);
  const progressValue = view.total ? Math.round((view.position / view.total) * 100) : 0;
  const positionLabel = formatAssessmentPositionLabel(view);
  const conceptTags = Array.isArray(question.conceptTags) ? question.conceptTags.slice(0, 3) : [];
  const explanation = view.feedback?.explanation ?? question.content.explanation ?? "";

  const beginCorrection = () => {
    setCorrection({
      questionId: question.id,
      active: true,
      answer: "",
      feedback: null,
    });
  };

  const handleAnswerChange = (nextAnswer) => {
    if (!correctionActive) {
      onAnswerChange?.(nextAnswer);
      return;
    }
    setCorrection((current) => ({
      questionId: question.id,
      active: true,
      answer: nextAnswer,
      feedback: null,
      retryCount: (current.questionId === question.id ? current.retryCount : 0) ?? 0,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!hasAnswer || submitting || hasFeedback) return;

    if (!correctionActive) {
      onSubmit?.({
        questionId: view.questionId,
        revision: view.revision,
        answer: displayAnswer,
      });
      return;
    }

    const correct = evaluateQuestionAnswer(question, displayAnswer);
    setCorrection((current) => ({
      questionId: question.id,
      active: true,
      answer: displayAnswer,
      feedback: { correct },
      retryCount: ((current.questionId === question.id ? current.retryCount : 0) ?? 0) + 1,
    }));
  };

  const correctionSucceeded = correctionActive && Boolean(activeCorrection.feedback?.correct);
  const teachBack = teachBackByQuestion[question.id] ?? "";
  const teachBackReady = teachBack.trim().length >= 8;
  const statusCorrect = correctionActive
    ? Boolean(displayFeedback?.correct)
    : Boolean(view.feedback?.correct);
  const statusTitle = correctionSucceeded
    ? "已纠正"
    : statusCorrect
      ? "回答正确"
      : "再想一想";

  return (
    <section className="min-w-0 p-4 sm:p-5" aria-labelledby="assessment-question-heading">
      <Card className="overflow-hidden">
        <CardHeader className="space-y-3 border-b border-[var(--border-subtle)]">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-subtle)]">
                知识点评测
              </p>
              <h3 id="assessment-question-heading" className="mt-1 mb-0 text-base font-bold text-[var(--text-main)]">
                检查你的理解
              </h3>
            </div>
            <span
              className="shrink-0 rounded-full bg-[var(--bg-surface-secondary)] px-2.5 py-1 text-xs font-semibold tabular-nums text-[var(--text-muted)]"
              aria-label={`评测进度 ${formatAssessmentProgress(view)}`}
            >
              {formatAssessmentProgress(view)}
            </span>
          </div>
          <Progress value={progressValue} aria-label={positionLabel} />
        </CardHeader>

        <CardContent className="space-y-5 pt-5">
          <div className="flex flex-wrap gap-2" aria-label="题目信息">
            <Badge variant="outline">{TYPE_LABELS[question.type] ?? question.type}</Badge>
            {question.difficulty && (
              <Badge variant={DIFFICULTY_VARIANTS[question.difficulty] ?? "secondary"}>
                {DIFFICULTY_LABELS[question.difficulty] ?? question.difficulty}
              </Badge>
            )}
            {conceptTags.map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>

          {submitError && !correctionActive && (
            <div
              role="alert"
              className="rounded-xl border border-[var(--color-danger-border)] bg-[var(--color-danger-light)] p-4 text-sm leading-6 text-[var(--color-danger-text)]"
            >
              <strong className="font-bold">提交失败，可重试</strong>
              <p className="mt-1 mb-0">{submitError}</p>
            </div>
          )}

          {correctionActive && !hasFeedback && (
            <div
              role="status"
              className="rounded-lg border border-[var(--color-primary)]/30 bg-[var(--color-primary-light)] p-3 text-sm leading-6 text-[var(--text-main)]"
            >
              <strong>重新判断一次</strong>
              <p className="mt-1 mb-0 text-[var(--text-muted)]">
                第一次错误已经保留在本轮记录中。这里不会覆盖它，也不会提前显示正确答案。
              </p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <QuestionCodeContext codeContext={question.content?.codeContext} />
            <QuestionRenderer
              question={question}
              value={displayAnswer}
              feedback={displayFeedback}
              revealCorrectAnswer={!diagnosticMisconception}
              onChange={handleAnswerChange}
              disabled={submitting || hasFeedback}
            />
            {!hasFeedback && (
              <Button type="submit" disabled={!hasAnswer || submitting} className="w-full">
                {correctionActive ? "再次验证" : submitting ? "提交中…" : "提交答案"}
              </Button>
            )}
          </form>

          {hasFeedback && (
            <div
              role="status"
              aria-live="polite"
              data-assessment-correction={correctionActive ? (displayFeedback.correct ? "corrected" : "retry-wrong") : undefined}
              className={statusCorrect
                ? "rounded-xl border border-[var(--color-success-border)] bg-[var(--color-success-light)] p-4"
                : "rounded-xl border border-[var(--color-danger-border)] bg-[var(--color-danger-light)] p-4"}
            >
              <div className="flex items-start gap-3">
                <span
                  className={statusCorrect
                    ? "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-success)] text-sm font-bold text-white shadow-sm"
                    : "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-danger)] text-sm font-bold text-white shadow-sm"}
                  aria-hidden="true"
                >
                  {statusCorrect ? "✓" : "✕"}
                </span>

                <div className="min-w-0 flex-1">
                  <strong className={statusCorrect
                    ? "text-sm font-bold text-[var(--color-success-text)]"
                    : "text-sm font-bold text-[var(--color-danger-text)]"}
                  >
                    {statusTitle}
                  </strong>

                  {correctionSucceeded && (
                    <div className="mt-2 space-y-3 text-sm leading-6 text-[var(--text-main)]">
                      <p className="m-0">
                        你已经根据反证重新判断正确。第一次错误仍保留在复习记录中，用来提醒这个知识点曾出现过误区。
                      </p>

                      <div
                        className="space-y-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] p-3"
                        data-assessment-teach-back={question.id}
                      >
                        <div>
                          <strong className="text-sm font-bold text-[var(--text-main)]">
                            用自己的话再解释一次
                          </strong>
                          <p className="mt-1 mb-0 text-xs leading-5 text-[var(--text-muted)]">
                            用 1–2 句话说明：为什么你第一次的判断不成立，正确的机制是什么。这个步骤只检查心智模型，不改变本轮分数。
                          </p>
                        </div>

                        <textarea
                          className="form-input min-h-[96px] w-full resize-y"
                          aria-label="用自己的话再解释一次"
                          value={teachBack}
                          onChange={(event) => {
                            const nextValue = event.target.value;
                            setTeachBackByQuestion((current) => ({
                              ...current,
                              [question.id]: nextValue,
                            }));
                          }}
                          placeholder="例如：reorder 时 Props 会更新，但 local State 是否保留取决于 React 是否继续匹配到同一个组件身份……"
                          rows={4}
                        />

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <span className="text-xs text-[var(--text-muted)]">
                            {teachBackReady
                              ? "已写下解释。可以继续下一题，或让 AI 检查是否仍有概念混淆。"
                              : "写下你的解释后即可选择让 AI 检查；不使用 AI 也可以直接继续。"}
                          </span>
                          {onRequestExplanationReview && (
                            <Button
                              type="button"
                              variant="outline"
                              disabled={!teachBackReady}
                              onClick={() => onRequestExplanationReview({
                                question,
                                learnerResponse: teachBack.trim(),
                              })}
                              className="shrink-0"
                            >
                              让 AI 检查这段解释
                            </Button>
                          )}
                        </div>
                      </div>

                      {showFeedbackExplanation && (
                        <details>
                          <summary className="cursor-pointer font-bold">查看完整解释</summary>
                          <div id={`${question.id}-explanation`} className="mt-2">
                            <MarkdownRender content={explanation} final htmlPolicy="escape" />
                          </div>
                        </details>
                      )}
                    </div>
                  )}

                  {showFeedbackExplanation && !diagnosticMisconception && !correctionSucceeded && (
                    <div id={`${question.id}-explanation`} className="mt-2 text-sm leading-6 text-[var(--text-main)]">
                      <MarkdownRender content={explanation} final htmlPolicy="escape" />
                    </div>
                  )}

                  <MisconceptionRemediation
                    misconception={diagnosticMisconception}
                    question={question}
                    explanation={explanation}
                    showFeedbackExplanation={showFeedbackExplanation}
                    onRetry={beginCorrection}
                  />
                </div>
              </div>

              {question.evidenceRefs?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2 border-t border-black/5 pt-3" aria-label="答案依据">
                  {question.evidenceRefs.map((evidence, index) => (
                    <EvidenceButton
                      key={`${evidence.kind}-${evidence.fileName ?? evidence.sectionId ?? index}-${index}`}
                      evidence={evidence}
                      index={index}
                      onOpen={onOpenEvidence}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {hasFeedback && !view.isLast && (
            <Button onClick={onNext} className="w-full">
              下一题 <span aria-hidden="true">→</span>
            </Button>
          )}

          {hasFeedback && view.isLast && (
            <div className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface-secondary)] p-4 text-center">
              <p className="m-0 text-sm font-bold text-[var(--text-main)]">本轮评测已完成</p>
              <p className="mt-1 mb-0 text-xs leading-5 text-[var(--text-muted)]">
                已完成 {view.total} / {view.total} 道题，本轮正式结果已保存。
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

export default AssessmentPracticePane;
