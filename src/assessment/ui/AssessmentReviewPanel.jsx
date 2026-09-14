import { Badge } from "../../components/ui/badge.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Card, CardContent, CardHeader } from "../../components/ui/card.jsx";
import MarkdownRender from "markstream-react";

function formatAnswer(snapshot, answer) {
  if (snapshot?.type === "single_choice") {
    return snapshot.content?.options?.find((option) => option.id === answer)?.text ?? String(answer ?? "未作答");
  }
  if (snapshot?.type === "true_false") {
    if (answer === true) return "正确";
    if (answer === false) return "错误";
  }
  return String(answer ?? "未作答");
}

function formatCorrectAnswer(snapshot) {
  if (snapshot?.type === "single_choice") {
    return snapshot.content?.options?.find((option) => option.id === snapshot.content?.correctOptionId)?.text ?? "";
  }
  if (snapshot?.type === "true_false") return snapshot.content?.correct ? "正确" : "错误";
  return "";
}

function EvidenceButton({ evidence, index, onOpen }) {
  const label = evidence?.kind === "source"
    ? `${evidence.fileName} · L${evidence.startLine}${evidence.endLine !== evidence.startLine ? `–${evidence.endLine}` : ""}`
    : `查看依据 ${index + 1}`;
  return <Button variant="outline" size="sm" onClick={() => onOpen?.(evidence)}>{label}</Button>;
}

export function AssessmentReviewPanel({ history = [], review = null, loading = false, error = null, storageNotice = null, onSelectSession, onOpenEvidence }) {
  if (!loading && !error && history.length === 0) return null;

  return (
    <section className="min-w-0 px-4 pb-5 sm:px-5" aria-labelledby="assessment-review-title">
      <Card>
        <CardHeader className="space-y-2 border-b border-[var(--border-subtle)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-subtle)]">Session Review</p>
              <h3 id="assessment-review-title" className="mt-1 mb-0 text-base font-bold text-[var(--text-main)]">评测回顾</h3>
            </div>
            {review && <Badge variant={review.incorrectCount > 0 ? "warning" : "success"}>{review.correctCount} / {review.total} 正确</Badge>}
          </div>
          {storageNotice && <p className="m-0 text-xs leading-5 text-[var(--text-muted)]">{storageNotice} 历史回顾仅限当前浏览器会话。</p>}
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          {loading && <p role="status" className="m-0 text-sm text-[var(--text-muted)]">正在加载历史评测…</p>}
          {error && <div role="alert" className="rounded-lg border border-[var(--color-danger-border)] bg-[var(--color-danger-light)] p-3 text-sm text-[var(--color-danger-text)]">{error}</div>}

          {history.length > 0 && (
            <div className="space-y-2">
              <p className="m-0 text-xs font-semibold text-[var(--text-subtle)]">当前知识点的已完成评测</p>
              <div className="flex flex-wrap gap-2" aria-label="历史评测 Session">
                {history.map((entry, index) => (
                  <Button
                    key={entry.sessionId}
                    variant={review?.sessionId === entry.sessionId ? "default" : "outline"}
                    size="sm"
                    onClick={() => onSelectSession?.(entry.sessionId)}
                  >
                    第 {history.length - index} 次 · {entry.correctCount}/{entry.total}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {review && (
            <div className="space-y-3">
              {review.incorrectCount > 0 && <p className="m-0 text-sm font-semibold text-[var(--color-danger-text)]">先看错题：共 {review.incorrectCount} 道需要回顾。</p>}
              {review.incorrectCount === 0 && <p className="m-0 text-sm font-semibold text-[var(--color-success-text)]">本轮全部答对，可继续查看历史答案与依据。</p>}
              <div className="space-y-3">
                {review.items.map((item) => {
                  const question = item.snapshot;
                  const correctAnswer = formatCorrectAnswer(question);
                  return (
                    <article key={`${review.sessionId}-${item.questionId}`} className="rounded-xl border border-[var(--border-color)] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <p className="m-0 text-sm font-semibold leading-6 text-[var(--text-main)]">{question.content?.prompt}</p>
                        <Badge variant={item.correct ? "success" : "destructive"}>{item.correct ? "正确" : "错误"}</Badge>
                      </div>
                      <dl className="mt-3 grid gap-2 text-sm">
                        <div><dt className="inline font-semibold text-[var(--text-subtle)]">你的答案：</dt><dd className="inline text-[var(--text-main)]">{formatAnswer(question, item.answer)}</dd></div>
                        {!item.correct && correctAnswer && <div><dt className="inline font-semibold text-[var(--text-subtle)]">正确答案：</dt><dd className="inline text-[var(--text-main)]">{correctAnswer}</dd></div>}
                      </dl>
                      {question.content?.explanation && <div className="mt-3 text-sm leading-6 text-[var(--text-main)]"><MarkdownRender content={question.content.explanation} final htmlPolicy="escape" /></div>}
                      {question.evidenceRefs?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2 border-t border-[var(--border-subtle)] pt-3" aria-label="回顾依据">
                          {question.evidenceRefs.map((evidence, index) => <EvidenceButton key={`${item.questionId}-${index}`} evidence={evidence} index={index} onOpen={onOpenEvidence} />)}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

export default AssessmentReviewPanel;
