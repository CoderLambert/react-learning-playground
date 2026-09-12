import { Badge } from "../../components/ui/badge.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Card, CardContent, CardHeader } from "../../components/ui/card.jsx";
import { Progress } from "../../components/ui/progress.jsx";
import MarkdownRender from "markstream-react";
import "markstream-react/index.css";
import { QuestionRenderer } from "./QuestionRenderer.jsx";
import { deriveAssessmentView, formatAssessmentProgress } from "./assessmentViewModel.js";

const TYPE_LABELS = Object.freeze({
  single_choice: "单选题",
  true_false: "判断题",
});

const DIFFICULTY_LABELS = Object.freeze({
  easy: "简单",
  medium: "中等",
  hard: "较难",
});

const DIFFICULTY_VARIANTS = Object.freeze({
  easy: "success",
  medium: "warning",
  hard: "destructive",
});

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
                <p className="m-0 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-subtle)]">知识点评测</p>
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
            <div className="flex flex-col gap-2 sm:flex-row">
              {canStart && (
                <Button onClick={onStart} className="w-full sm:flex-1">
                  开始测试
                </Button>
              )}
              <Button
                variant={canStart ? "outline" : "default"}
                onClick={onRequestAiQuestions}
                disabled={!onRequestAiQuestions}
                className="w-full sm:flex-1"
              >
                {canStart ? "让 AI 补充题目" : "让 AI 帮我出题"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  const question = view.question;
  const hasAnswer = answer !== null && answer !== "";
  const hasFeedback = Boolean(view.feedback);
  const progressValue = view.total ? Math.round((view.position / view.total) * 100) : 0;
  const conceptTags = Array.isArray(question.conceptTags) ? question.conceptTags.slice(0, 3) : [];

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!hasAnswer || submitting || hasFeedback) return;
    onSubmit?.({ questionId: view.questionId, revision: view.revision, answer });
  };

  return (
    <section className="min-w-0 p-4 sm:p-5" aria-labelledby="assessment-question-heading">
      <Card className="overflow-hidden">
        <CardHeader className="space-y-3 border-b border-[var(--border-subtle)]">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-subtle)]">知识点评测</p>
              <h3 id="assessment-question-heading" className="mt-1 mb-0 text-base font-bold text-[var(--text-main)]">检查你的理解</h3>
            </div>
            <span className="shrink-0 rounded-full bg-[var(--bg-surface-secondary)] px-2.5 py-1 text-xs font-semibold tabular-nums text-[var(--text-muted)]" aria-label={`评测进度 ${formatAssessmentProgress(view)}`}>
              {formatAssessmentProgress(view)}
            </span>
          </div>
          <Progress value={progressValue} aria-label={`已完成 ${progressValue}%`} />
        </CardHeader>

        <CardContent className="space-y-5 pt-5">
          <div className="flex flex-wrap gap-2" aria-label="题目信息">
            <Badge variant="outline">{TYPE_LABELS[question.type] ?? question.type}</Badge>
            {question.difficulty && (
              <Badge variant={DIFFICULTY_VARIANTS[question.difficulty] ?? "secondary"}>
                {DIFFICULTY_LABELS[question.difficulty] ?? question.difficulty}
              </Badge>
            )}
            {conceptTags.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <QuestionRenderer
              question={question}
              value={answer}
              feedback={view.feedback}
              onChange={onAnswerChange}
              disabled={submitting || hasFeedback}
            />
            {!hasFeedback && (
              <Button type="submit" disabled={!hasAnswer || submitting} className="w-full">
                {submitting ? "提交中…" : "提交答案"}
              </Button>
            )}
          </form>

          {hasFeedback && (
            <div
              role="status"
              aria-live="polite"
              className={view.feedback.correct
                ? "rounded-xl border border-[var(--color-success-border)] bg-[var(--color-success-light)] p-4"
                : "rounded-xl border border-[var(--color-danger-border)] bg-[var(--color-danger-light)] p-4"}
            >
              <div className="flex items-start gap-3">
                <span
                  className={view.feedback.correct
                    ? "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-success)] text-sm font-bold text-white shadow-sm"
                    : "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-danger)] text-sm font-bold text-white shadow-sm"}
                  aria-hidden="true"
                >
                  {view.feedback.correct ? "✓" : "✕"}
                </span>
                <div className="min-w-0 flex-1">
                  <strong className={view.feedback.correct ? "text-sm font-bold text-[var(--color-success-text)]" : "text-sm font-bold text-[var(--color-danger-text)]"}>
                    {view.feedback.correct ? "回答正确" : "再想一想"}
                  </strong>
                  <div id={`${question.id}-explanation`} className="mt-2 text-sm leading-6 text-[var(--text-main)]">
                    <MarkdownRender
                      content={view.feedback.explanation ?? question.content.explanation ?? ""}
                      final
                      htmlPolicy="escape"
                    />
                  </div>
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
              <p className="mt-1 mb-0 text-xs leading-5 text-[var(--text-muted)]">已完成 {view.total} / {view.total} 道题，本轮结果已保存。</p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

export default AssessmentPane;
