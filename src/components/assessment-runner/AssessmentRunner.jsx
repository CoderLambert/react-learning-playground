import { useEffect, useMemo, useRef, useState } from "react";
import { AttemptRepository, createQuestionRevision } from "../../assessment/runner/attemptRepository.js";
import {
  createAiReviewPayload,
  createAiReviewPrompt,
  createAssessmentSummaryMarkdown,
  filterQuestions,
  summarizeAttempts,
} from "../../assessment/runner/runnerUtils.js";
import "./AssessmentRunner.css";

const confidenceLabels = {
  low: "不确定",
  medium: "基本确定",
  high: "非常确定",
};

function normalizeQuestions(questions) {
  return (questions ?? []).filter((question) => question?.id && question?.prompt);
}

export function AssessmentRunner({
  chapter,
  title = `Chapter ${chapter} Practice`,
  questions = [],
  repository = null,
  onAskAi,
  onCopySummary,
}) {
  const fallbackRepositoryRef = useRef(null);
  if (!fallbackRepositoryRef.current) fallbackRepositoryRef.current = new AttemptRepository();
  const activeRepository = repository ?? fallbackRepositoryRef.current;

  const validQuestions = useMemo(() => normalizeQuestions(questions), [questions]);
  const [attempts, setAttempts] = useState(() => activeRepository.listAttempts(chapter));
  const [filter, setFilter] = useState("all");
  const visibleQuestions = useMemo(
    () => filterQuestions({ questions: validQuestions, attempts, filter }),
    [validQuestions, attempts, filter],
  );
  const session = activeRepository.getSession(chapter);
  const initialId = session?.currentQuestionId && validQuestions.some((item) => item.id === session.currentQuestionId)
    ? session.currentQuestionId
    : validQuestions[0]?.id ?? null;
  const [currentId, setCurrentId] = useState(initialId);
  const currentIndex = Math.max(0, visibleQuestions.findIndex((question) => question.id === currentId));
  const current = visibleQuestions[currentIndex] ?? visibleQuestions[0] ?? null;
  const currentAttempt = current ? activeRepository.getAttempt({ chapter, question: current }) : null;
  const [answer, setAnswer] = useState(currentAttempt?.answer ?? "");
  const [confidence, setConfidence] = useState(currentAttempt?.confidence ?? "unset");
  const [selfAssessment, setSelfAssessment] = useState(currentAttempt?.selfAssessment ?? "unset");
  const answerRef = useRef(null);

  useEffect(() => {
    setAttempts(activeRepository.listAttempts(chapter));
    const restored = activeRepository.getSession(chapter);
    const nextId = restored?.currentQuestionId && validQuestions.some((item) => item.id === restored.currentQuestionId)
      ? restored.currentQuestionId
      : validQuestions[0]?.id ?? null;
    setCurrentId(nextId);
  }, [activeRepository, chapter, validQuestions]);

  useEffect(() => {
    if (!current) return;
    const attempt = activeRepository.getAttempt({ chapter, question: current });
    setAnswer(attempt?.answer ?? "");
    setConfidence(attempt?.confidence ?? "unset");
    setSelfAssessment(attempt?.selfAssessment ?? "unset");
    setCurrentId(current.id);
    activeRepository.saveSession({ chapter, currentQuestionId: current.id, completed: false });
  }, [activeRepository, chapter, current?.id, current?.prompt, current?.kind]);

  useEffect(() => {
    if (!current) return undefined;
    const timeout = setTimeout(() => {
      if (!answer.trim() && confidence === "unset" && selfAssessment === "unset") return;
      const existing = activeRepository.getAttempt({ chapter, question: current });
      activeRepository.saveAttempt({
        chapter,
        question: current,
        answer,
        confidence,
        selfAssessment,
        status: existing?.status === "answered" ? "answered" : "draft",
      });
      setAttempts(activeRepository.listAttempts(chapter));
    }, 350);
    return () => clearTimeout(timeout);
  }, [activeRepository, answer, chapter, confidence, current, selfAssessment]);

  const refreshAttempts = () => setAttempts(activeRepository.listAttempts(chapter));

  const moveTo = (offset) => {
    if (!visibleQuestions.length) return;
    const nextIndex = Math.min(Math.max(currentIndex + offset, 0), visibleQuestions.length - 1);
    setCurrentId(visibleQuestions[nextIndex].id);
    queueMicrotask(() => answerRef.current?.focus());
  };

  const saveCurrent = (status = "answered") => {
    if (!current) return;
    activeRepository.saveAttempt({ chapter, question: current, answer, confidence, selfAssessment, status });
    refreshAttempts();
  };

  const saveAndContinue = () => {
    saveCurrent("answered");
    if (currentIndex < visibleQuestions.length - 1) moveTo(1);
    else activeRepository.saveSession({ chapter, currentQuestionId: current?.id ?? null, completed: true });
  };

  const skipCurrent = () => {
    saveCurrent("skipped");
    if (currentIndex < visibleQuestions.length - 1) moveTo(1);
  };

  const summary = summarizeAttempts({ questions: validQuestions, attempts });

  const handleAskAi = () => {
    if (!current || !onAskAi) return;
    const attempt = activeRepository.getAttempt({ chapter, question: current }) ?? {
      answer,
      confidence,
      selfAssessment,
    };
    onAskAi({
      payload: createAiReviewPayload({ chapter, question: current, attempt }),
      prompt: createAiReviewPrompt({ chapter, question: current, attempt }),
    });
  };

  const handleCopySummary = async () => {
    const markdown = createAssessmentSummaryMarkdown({ chapter, title, questions: validQuestions, attempts });
    if (onCopySummary) return onCopySummary(markdown);
    if (!globalThis.navigator?.clipboard?.writeText) return false;
    await globalThis.navigator.clipboard.writeText(markdown);
    return true;
  };

  if (!validQuestions.length) {
    return (
      <section className="assessment-runner" aria-labelledby="assessment-runner-title">
        <h2 id="assessment-runner-title">{title}</h2>
        <p className="assessment-runner__empty">当前没有可练习的题目。</p>
      </section>
    );
  }

  return (
    <section className="assessment-runner" aria-labelledby="assessment-runner-title">
      <header className="assessment-runner__header">
        <div>
          <p className="assessment-runner__eyebrow">Practice Assessment</p>
          <h2 id="assessment-runner-title">{title}</h2>
        </div>
        <div className="assessment-runner__summary" aria-label="练习进度">
          <strong>{summary.answered}/{summary.total}</strong>
          <span>已回答</span>
        </div>
      </header>

      <div className="assessment-runner__filters" aria-label="题目筛选">
        {[["all", "全部"], ["incomplete", "未完成"], ["needs-review", "需复习"]].map(([value, label]) => (
          <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>
        ))}
      </div>

      {!current ? (
        <div className="assessment-runner__empty-filter">
          <p>{filter === "needs-review" ? "还没有标记为需复习的题目。" : "当前筛选下没有题目。"}</p>
          <button type="button" onClick={() => setFilter("all")}>查看全部</button>
        </div>
      ) : (
        <>
          <div className="assessment-runner__progress">
            <span>第 {currentIndex + 1} / {visibleQuestions.length} 题</span>
            <progress max={visibleQuestions.length} value={currentIndex + 1} />
          </div>

          <article className="assessment-runner__question" key={createQuestionRevision(current)}>
            <p className="assessment-runner__kind">{current.kind === "exercise" ? "练习" : "问题"}</p>
            <h3>{current.prompt}</h3>

            <label className="assessment-runner__answer">
              <span>我的回答</span>
              <textarea
                ref={answerRef}
                rows={8}
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="用自己的话写下理解；草稿会自动保存。"
              />
            </label>

            <fieldset className="assessment-runner__choice-row">
              <legend>我有多确定？</legend>
              {Object.entries(confidenceLabels).map(([value, label]) => (
                <label key={value}>
                  <input type="radio" name={`confidence-${current.id}`} checked={confidence === value} onChange={() => setConfidence(value)} />
                  <span>{label}</span>
                </label>
              ))}
            </fieldset>

            <fieldset className="assessment-runner__choice-row">
              <legend>我的自评</legend>
              <label><input type="radio" name={`self-${current.id}`} checked={selfAssessment === "understood"} onChange={() => setSelfAssessment("understood")} /><span>理解</span></label>
              <label><input type="radio" name={`self-${current.id}`} checked={selfAssessment === "needs-review"} onChange={() => setSelfAssessment("needs-review")} /><span>需复习</span></label>
            </fieldset>

            <div className="assessment-runner__actions">
              <button type="button" onClick={() => moveTo(-1)} disabled={currentIndex === 0}>上一题</button>
              <button type="button" onClick={skipCurrent}>跳过</button>
              {onAskAi ? <button type="button" onClick={handleAskAi}>让 AI 分析我的回答</button> : null}
              <button type="button" className="is-primary" onClick={saveAndContinue}>保存并继续</button>
            </div>
          </article>
        </>
      )}

      <footer className="assessment-runner__result">
        <h3>本次练习</h3>
        <dl>
          <div><dt>已回答</dt><dd>{summary.answered}</dd></div>
          <div><dt>已跳过</dt><dd>{summary.skipped}</dd></div>
          <div><dt>需复习</dt><dd>{summary.needsReview}</dd></div>
          <div><dt>高信心</dt><dd>{summary.confidence.high}</dd></div>
        </dl>
        <button type="button" onClick={() => void handleCopySummary()}>复制 Markdown 总结</button>
      </footer>
    </section>
  );
}

export default AssessmentRunner;
