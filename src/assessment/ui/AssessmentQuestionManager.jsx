import { useMemo, useState } from "react";
import { Badge } from "../../components/ui/badge.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Card, CardContent, CardHeader } from "../../components/ui/card.jsx";
import {
  buildQuestionPatch,
  createAssessmentManagerTrustedContext,
  describeAssessmentMutationError,
  questionToDraft,
} from "./assessmentManagement.js";

const TYPE_LABELS = { single_choice: "单选题", true_false: "判断题" };
const STATUS_LABELS = { active: "启用中", retired: "已停用" };

function Field({ label, children }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-[var(--text-main)]">
      <span>{label}</span>
      {children}
    </label>
  );
}

function inputClassName() {
  return "w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-main)] outline-none focus:border-[var(--color-primary)]";
}

function QuestionEditor({ question, onSave, onCancel, saving }) {
  const [draft, setDraft] = useState(() => questionToDraft(question));
  const updateOption = (id, text) => {
    setDraft((current) => ({
      ...current,
      options: current.options.map((option) => option.id === id ? { ...option, text } : option),
    }));
  };

  const submit = (event) => {
    event.preventDefault();
    onSave?.(buildQuestionPatch(question, draft));
  };

  return (
    <form className="grid gap-4" onSubmit={submit} aria-label={`编辑题目 ${question.id}`}>
      <Field label="题干">
        <textarea className={inputClassName()} rows={3} value={draft.prompt} onChange={(event) => setDraft((current) => ({ ...current, prompt: event.target.value }))} required />
      </Field>
      <Field label="答案解释">
        <textarea className={inputClassName()} rows={4} value={draft.explanation} onChange={(event) => setDraft((current) => ({ ...current, explanation: event.target.value }))} required />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="难度">
          <select className={inputClassName()} value={draft.difficulty} onChange={(event) => setDraft((current) => ({ ...current, difficulty: event.target.value }))}>
            <option value="easy">简单</option>
            <option value="medium">中等</option>
            <option value="hard">较难</option>
          </select>
        </Field>
        <Field label="概念标签（逗号分隔）">
          <input className={inputClassName()} value={draft.conceptTagsText} onChange={(event) => setDraft((current) => ({ ...current, conceptTagsText: event.target.value }))} />
        </Field>
      </div>

      {question.type === "single_choice" && (
        <fieldset className="grid gap-3 rounded-lg border border-[var(--border-subtle)] p-3">
          <legend className="px-1 text-sm font-semibold">选项与正确答案</legend>
          {draft.options.map((option, index) => (
            <div key={option.id} className="flex items-center gap-2">
              <input
                type="radio"
                name={`correct-${question.id}`}
                checked={draft.correctOptionId === option.id}
                onChange={() => setDraft((current) => ({ ...current, correctOptionId: option.id }))}
                aria-label={`设为正确答案：选项 ${index + 1}`}
              />
              <input
                className={inputClassName()}
                value={option.text}
                onChange={(event) => updateOption(option.id, event.target.value)}
                aria-label={`选项 ${index + 1}`}
                required
              />
            </div>
          ))}
        </fieldset>
      )}

      {question.type === "true_false" && (
        <fieldset className="flex gap-5 rounded-lg border border-[var(--border-subtle)] p-3">
          <legend className="px-1 text-sm font-semibold">正确答案</legend>
          <label className="flex items-center gap-2 text-sm"><input type="radio" name={`tf-${question.id}`} checked={draft.correct === true} onChange={() => setDraft((current) => ({ ...current, correct: true }))} />正确</label>
          <label className="flex items-center gap-2 text-sm"><input type="radio" name={`tf-${question.id}`} checked={draft.correct === false} onChange={() => setDraft((current) => ({ ...current, correct: false }))} />错误</label>
        </fieldset>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>{saving ? "保存中…" : "保存修改"}</Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>取消</Button>
      </div>
    </form>
  );
}

export function AssessmentQuestionManager({ learningUnitId, questions = [], service, session = null }) {
  const [showRetired, setShowRetired] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [notice, setNotice] = useState(null);

  const visibleQuestions = useMemo(
    () => questions.filter((question) => showRetired || question.status === "active"),
    [questions, showRetired],
  );
  const activeCount = questions.filter((question) => question.status === "active").length;
  const retiredCount = questions.filter((question) => question.status === "retired").length;

  const refreshAfterError = async () => {
    if (!service || !learningUnitId) return;
    try {
      await service.listQuestions({ trusted: { learningUnitId } });
    } catch {
      // Query store refresh is performed by successful mutations; App also refreshes when unit changes.
    }
  };

  const save = async (question, patch) => {
    if (!service) return;
    setBusyId(question.id);
    setNotice(null);
    try {
      await service.updateQuestion({
        trusted: createAssessmentManagerTrustedContext(learningUnitId),
        questionId: question.id,
        expectedRevision: question.revision,
        patch,
      });
      setEditingId(null);
      setNotice({ kind: "success", message: "题目已保存。正在进行的评测仍使用开始时的题目快照。" });
    } catch (error) {
      const described = describeAssessmentMutationError(error);
      setNotice(described);
      await refreshAfterError();
    } finally {
      setBusyId(null);
    }
  };

  const retire = async (question) => {
    if (!service || question.status !== "active") return;
    setBusyId(question.id);
    setNotice(null);
    try {
      await service.retireQuestion({
        trusted: createAssessmentManagerTrustedContext(learningUnitId),
        questionId: question.id,
        expectedRevision: question.revision,
      });
      if (editingId === question.id) setEditingId(null);
      setNotice({ kind: "success", message: "题目已停用。已有评测会话仍保留创建时的快照。" });
    } catch (error) {
      const described = describeAssessmentMutationError(error);
      setNotice(described);
      await refreshAfterError();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="min-w-0 p-4 pb-0 sm:p-5 sm:pb-0" aria-labelledby="assessment-manager-title">
      <Card>
        <CardHeader className="space-y-3 border-b border-[var(--border-subtle)]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-subtle)]">题库管理</p>
              <h3 id="assessment-manager-title" className="mt-1 mb-0 text-base font-bold">当前知识点题目</h3>
            </div>
            <div className="flex gap-2 text-xs">
              <Badge variant="secondary">启用 {activeCount}</Badge>
              <Badge variant="outline">停用 {retiredCount}</Badge>
            </div>
          </div>
          <label className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <input type="checkbox" checked={showRetired} onChange={(event) => setShowRetired(event.target.checked)} />
            显示已停用题目
          </label>
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          {session?.status === "in_progress" && (
            <p role="status" className="m-0 rounded-md border border-[var(--border-color)] bg-[var(--bg-surface-secondary)] p-3 text-xs leading-5 text-[var(--text-muted)]">
              当前有进行中的评测。编辑或停用题库不会修改本轮 session 的题目快照。
            </p>
          )}
          {notice && <p role="status" data-notice-kind={notice.kind} className="m-0 text-sm text-[var(--text-muted)]">{notice.message}</p>}
          {visibleQuestions.length === 0 ? (
            <p className="m-0 text-sm text-[var(--text-muted)]">{showRetired ? "当前没有题目。" : "当前没有启用题目。"}</p>
          ) : visibleQuestions.map((question) => (
            <article key={question.id} className="rounded-lg border border-[var(--border-subtle)] p-4" data-question-status={question.status}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap gap-2">
                    <Badge variant="outline">{TYPE_LABELS[question.type] ?? question.type}</Badge>
                    <Badge variant={question.status === "active" ? "success" : "secondary"}>{STATUS_LABELS[question.status] ?? question.status}</Badge>
                    <span className="text-xs text-[var(--text-subtle)]">rev {question.revision}</span>
                  </div>
                  <p className="m-0 text-sm font-semibold leading-6 text-[var(--text-main)]">{question.content?.prompt}</p>
                </div>
                <div className="flex gap-2">
                  {question.status === "active" && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => setEditingId((id) => id === question.id ? null : question.id)} disabled={busyId === question.id}>
                        {editingId === question.id ? "收起编辑" : "编辑"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => retire(question)} disabled={busyId === question.id}>
                        停用
                      </Button>
                    </>
                  )}
                </div>
              </div>
              {question.status === "retired" && (
                <p className="mt-3 mb-0 text-xs leading-5 text-[var(--text-muted)]">当前 domain 只提供 retire 语义，没有恢复命令；因此这里仅展示历史题目，不提供伪恢复操作。</p>
              )}
              {editingId === question.id && question.status === "active" && (
                <div className="mt-4 border-t border-[var(--border-subtle)] pt-4">
                  <QuestionEditor question={question} saving={busyId === question.id} onSave={(patch) => save(question, patch)} onCancel={() => setEditingId(null)} />
                </div>
              )}
            </article>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}

export default AssessmentQuestionManager;
