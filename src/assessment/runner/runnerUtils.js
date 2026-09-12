import { createQuestionRevision } from "./attemptRepository.js";

export const CONFIDENCE_OPTIONS = ["unset", "low", "medium", "high"];
export const SELF_ASSESSMENT_OPTIONS = ["unset", "understood", "needs-review"];

export function summarizeAttempts({ questions = [], attempts = [] } = {}) {
  const currentById = new Map(questions.map((question) => [question.id, createQuestionRevision(question)]));
  const valid = attempts.filter((attempt) => currentById.get(attempt.questionId) === attempt.questionRevision);
  const summary = {
    total: questions.length,
    answered: 0,
    skipped: 0,
    needsReview: 0,
    confidence: { low: 0, medium: 0, high: 0, unset: 0 },
  };

  valid.forEach((attempt) => {
    if (attempt.status === "skipped") summary.skipped += 1;
    else if (attempt.status === "answered") summary.answered += 1;
    if (attempt.selfAssessment === "needs-review") summary.needsReview += 1;
    summary.confidence[attempt.confidence] = (summary.confidence[attempt.confidence] ?? 0) + 1;
  });
  return summary;
}

export function filterQuestions({ questions = [], attempts = [], filter = "all" } = {}) {
  if (filter === "all") return questions;
  const attemptById = new Map(attempts.map((attempt) => [attempt.questionId, attempt]));
  if (filter === "incomplete") {
    return questions.filter((question) => {
      const attempt = attemptById.get(question.id);
      return !attempt || attempt.questionRevision !== createQuestionRevision(question) || !["answered", "skipped"].includes(attempt.status);
    });
  }
  if (filter === "needs-review") {
    return questions.filter((question) => {
      const attempt = attemptById.get(question.id);
      return attempt?.questionRevision === createQuestionRevision(question) && attempt.selfAssessment === "needs-review";
    });
  }
  return questions;
}

export function createAiReviewPayload({ chapter, question, attempt }) {
  return {
    type: "assessment-answer-review",
    chapter,
    question: {
      id: question.id,
      prompt: question.prompt,
      kind: question.kind,
    },
    answer: attempt?.answer ?? "",
    confidence: attempt?.confidence ?? "unset",
    selfAssessment: attempt?.selfAssessment ?? "unset",
  };
}

export function createAiReviewPrompt(input) {
  const payload = createAiReviewPayload(input);
  return [
    `我正在复习 Chapter ${payload.chapter}。`,
    "",
    `题目：${payload.question.prompt}`,
    "",
    `我的回答：${payload.answer || "（未填写）"}`,
    `我的确定程度：${payload.confidence}`,
    `我的自评：${payload.selfAssessment}`,
    "",
    "请结合当前课程笔记、Demo 和源码分析这个回答：",
    "1. 我已经覆盖了哪些关键点；",
    "2. 还遗漏了哪些重要点；",
    "3. 是否存在概念误区；",
    "4. 下一步最值得复习什么。",
    "不要给出虚假的百分制分数；如果证据不足，请明确说明。",
  ].join("\n");
}

export function createAssessmentSummaryMarkdown({ chapter, title = `Chapter ${chapter} Practice`, questions = [], attempts = [] } = {}) {
  const attemptById = new Map(attempts.map((attempt) => [attempt.questionId, attempt]));
  const summary = summarizeAttempts({ questions, attempts });
  const lines = [
    `# ${title}`,
    "",
    `- Total: ${summary.total}`,
    `- Answered: ${summary.answered}`,
    `- Skipped: ${summary.skipped}`,
    `- Needs review: ${summary.needsReview}`,
    `- Confidence: high ${summary.confidence.high}, medium ${summary.confidence.medium}, low ${summary.confidence.low}`,
    "",
  ];
  questions.forEach((question, index) => {
    const attempt = attemptById.get(question.id);
    if (!attempt || attempt.questionRevision !== createQuestionRevision(question)) return;
    lines.push(`## ${index + 1}. ${question.prompt}`, "");
    lines.push(`- Status: ${attempt.status}`);
    lines.push(`- Confidence: ${attempt.confidence}`);
    lines.push(`- Self assessment: ${attempt.selfAssessment}`);
    lines.push("", attempt.answer || "_(no answer)_", "");
  });
  return `${lines.join("\n").trimEnd()}\n`;
}
