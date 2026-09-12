import { useEffect, useMemo, useRef, useState } from "react";
import { createAttemptRepository } from "./attemptRepository.js";
import {
  ANSWER_STATUS,
  buildAssessmentAiHandoff,
  buildAttemptMarkdown,
  completeAttempt,
  createAttempt,
  isAnswerCompatible,
  navigateAttempt,
  reopenAttempt,
  summarizeAttempt,
  updateAnswer,
} from "./practiceAttempt.js";

function promptId(chapter, prompt, index) {
  let hash = 0;
  for (const char of prompt) hash = (Math.imul(hash, 31) + char.charCodeAt(0)) | 0;
  return `chapter-${chapter}-practice-${index + 1}-${Math.abs(hash).toString(36)}`;
}

export function toPracticeQuestions(chapter, prompts = []) {
  return prompts.map((prompt, index) => ({ id: promptId(chapter, prompt, index), kind: "free-text", prompt }));
}

export function AssessmentRunner({ chapter, prompts, onAskAi }) {
  const questions = useMemo(() => toPracticeQuestions(chapter, prompts), [chapter, prompts]);
  const repository = useMemo(() => createAttemptRepository(), []);
  const [attempt, setAttempt] = useState(() => repository.load(chapter) ?? createAttempt({ chapter, questions, sessionId: `chapter-${chapter}-current` }));
  const [filter, setFilter] = useState("all");
  const [feedback, setFeedback] = useState("");
  const saveSequence = useRef(0);

  useEffect(() => {
    const currentSequence = ++saveSequence.current;
    queueMicrotask(() => {
      if (currentSequence !== saveSequence.current) return;
      if (!repository.save(attempt)) setFeedback("保存失败：浏览器存储不可用，请先复制答案再继续。");
    });
  }, [attempt, repository]);

  const compatibleQuestions = questions.map((question) => {
    const answer = attempt.answers[question.id];
    return isAnswerCompatible(answer, question) ? question : question;
  });
  const visibleQuestions = compatibleQuestions.filter((question) => {
    const status = attempt.answers[question.id]?.status ?? ANSWER_STATUS.DRAFT;
    if (filter === "unfinished") return status === ANSWER_STATUS.DRAFT || status === ANSWER_STATUS.SKIPPED;
    if (filter === "review") return status === ANSWER_STATUS.NEEDS_REVIEW;
    return true;
  });
  const current = compatibleQuestions.find((question) => question.id === attempt.currentQuestionId) ?? visibleQuestions[0] ?? compatibleQuestions[0];
  const currentIndex = current ? compatibleQuestions.findIndex((question) => question.id === current.id) : -1;
  const answer = current ? attempt.answers[current.id] : null;
  const summary = summarizeAttempt(attempt);

  function patchCurrent(patch) {
    if (!current) return;
    setAttempt((value) => updateAnswer(value, current, patch));
  }

  function move(offset) {
    if (!current) return;
    const next = compatibleQuestions[currentIndex + offset];
    if (next) setAttempt((value) => navigateAttempt(value, next.id));
  }

  function restart() {
    repository.clear(chapter);
    setAttempt(createAttempt({ chapter, questions, sessionId: `chapter-${chapter}-current` }));
    setFilter("all");
    setFeedback("已开始新的练习记录。");
  }

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(buildAttemptMarkdown({ chapter, questions, attempt }));
      setFeedback("Markdown Summary 已复制。");
    } catch {
      setFeedback("复制失败，请检查浏览器剪贴板权限。");
    }
  }

  if (!questions.length) {
    return <section className="demo-alert demo-alert-info" aria-label="章节练习"><strong>暂无可练习题目。</strong></section>;
  }

  if (attempt.status === "completed") {
    return (
      <section className="demo-alert demo-alert-success" data-assessment-runner={chapter} aria-labelledby={`assessment-result-${chapter}`}>
        <h3 id={`assessment-result-${chapter}`}>Practice Assessment · 完成</h3>
        <p>已回答 {summary.answered}/{summary.total}，跳过 {summary.skipped}，需复习 {summary.needsReview}。</p>
        <p>平均信心：{summary.averageConfidence == null ? "未填写" : `${summary.averageConfidence.toFixed(1)}/5`}。这里不提供自动评分。</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="button" onClick={() => setAttempt((value) => reopenAttempt(value))}>重新查看 / 回答</button>
          <button type="button" onClick={copySummary}>复制 Markdown Summary</button>
          <button type="button" onClick={restart}>重新开始</button>
        </div>
        {feedback && <p role="status">{feedback}</p>}
      </section>
    );
  }

  return (
    <section className="demo-alert demo-alert-info" data-assessment-runner={chapter} aria-labelledby={`assessment-title-${chapter}`}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h3 id={`assessment-title-${chapter}`} style={{ marginTop: 0 }}>Practice Assessment</h3>
          <p>进度 {Math.max(currentIndex + 1, 1)}/{questions.length} · 已回答 {summary.answered} · 跳过 {summary.skipped} · 需复习 {summary.needsReview}</p>
        </div>
        <label>
          筛选{" "}
          <select value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option value="all">全部</option>
            <option value="unfinished">只看未完成</option>
            <option value="review">只看需复习</option>
          </select>
        </label>
      </div>

      {!visibleQuestions.length ? (
        <p role="status">当前筛选条件下没有题目。</p>
      ) : current ? (
        <div>
          <p><strong>{current.prompt}</strong></p>
          <label htmlFor={`assessment-answer-${current.id}`}>你的回答</label>
          <textarea
            id={`assessment-answer-${current.id}`}
            rows={7}
            value={answer?.draft ?? ""}
            onChange={(event) => patchCurrent({ draft: event.target.value })}
            style={{ width: "100%", resize: "vertical" }}
            placeholder="先写下你的推理。答案会自动保存在本机浏览器。"
          />
          <fieldset style={{ marginTop: 12 }}>
            <legend>信心程度</legend>
            {[1, 2, 3, 4, 5].map((level) => (
              <label key={level} style={{ marginRight: 12 }}>
                <input type="radio" name={`confidence-${current.id}`} checked={answer?.confidence === level} onChange={() => patchCurrent({ confidence: level })} /> {level}
              </label>
            ))}
          </fieldset>
          <label style={{ display: "block", marginTop: 12 }}>
            <input type="checkbox" checked={answer?.status === ANSWER_STATUS.NEEDS_REVIEW} onChange={(event) => patchCurrent({ status: event.target.checked ? ANSWER_STATUS.NEEDS_REVIEW : ANSWER_STATUS.ANSWERED })} /> 需要复习
          </label>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
            <button type="button" onClick={() => move(-1)} disabled={currentIndex <= 0}>上一题</button>
            <button type="button" onClick={() => patchCurrent({ status: ANSWER_STATUS.SKIPPED, draft: "" })}>跳过</button>
            <button type="button" onClick={() => move(1)} disabled={currentIndex >= questions.length - 1}>保存并继续</button>
            {onAskAi && <button type="button" onClick={() => onAskAi(buildAssessmentAiHandoff({ chapter, question: current, answer }))}>让 AI 帮我继续推理</button>}
            <button type="button" onClick={() => setAttempt((value) => completeAttempt(value))}>完成练习</button>
          </div>
        </div>
      ) : null}
      {feedback && <p role="status">{feedback}</p>}
    </section>
  );
}
