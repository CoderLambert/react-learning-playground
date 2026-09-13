export const ATTEMPT_VERSION = 1;

export const ANSWER_STATUS = Object.freeze({
  DRAFT: "draft",
  ANSWERED: "answered",
  SKIPPED: "skipped",
  NEEDS_REVIEW: "needs-review",
});

function nowIso(now = Date.now()) {
  return new Date(now).toISOString();
}

function createSessionId() {
  return globalThis.crypto?.randomUUID?.() ?? `assessment-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function createBlankAnswer(question, now = Date.now()) {
  return {
    questionId: question.id,
    revision: createQuestionRevision(question),
    draft: "",
    confidence: null,
    status: ANSWER_STATUS.DRAFT,
    updatedAt: nowIso(now),
  };
}

export function createQuestionRevision(question) {
  if (question?.revision) return String(question.revision);
  const source = `${question.id ?? ""}|${question.prompt ?? ""}|${question.kind ?? "free-text"}`;
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `qrev-${(hash >>> 0).toString(16)}`;
}

export function createAttempt({ chapter, questions, sessionId = createSessionId(), now = Date.now() }) {
  return {
    version: ATTEMPT_VERSION,
    id: sessionId,
    chapter,
    status: "in-progress",
    currentQuestionId: questions[0]?.id ?? null,
    createdAt: nowIso(now),
    updatedAt: nowIso(now),
    completedAt: null,
    answers: Object.fromEntries(questions.map((question) => [question.id, createBlankAnswer(question, now)])),
  };
}

export function reconcileAttemptQuestions(attempt, questions, now = Date.now()) {
  const answers = Object.fromEntries(questions.map((question) => {
    const current = attempt.answers?.[question.id];
    return [question.id, isAnswerCompatible(current, question) ? current : createBlankAnswer(question, now)];
  }));
  const currentStillExists = questions.some((question) => question.id === attempt.currentQuestionId);
  return {
    ...attempt,
    currentQuestionId: currentStillExists ? attempt.currentQuestionId : questions[0]?.id ?? null,
    answers,
    updatedAt: nowIso(now),
  };
}

export function updateAnswer(attempt, question, patch, now = Date.now()) {
  const current = isAnswerCompatible(attempt.answers[question.id], question)
    ? attempt.answers[question.id]
    : createBlankAnswer(question, now);
  const nextDraft = patch.draft ?? current.draft;
  const nextConfidence = patch.confidence === undefined ? current.confidence : patch.confidence;
  const requestedStatus = patch.status ?? current.status;
  const nextStatus = requestedStatus === ANSWER_STATUS.SKIPPED
    ? ANSWER_STATUS.SKIPPED
    : requestedStatus === ANSWER_STATUS.NEEDS_REVIEW
      ? ANSWER_STATUS.NEEDS_REVIEW
      : nextDraft.trim()
        ? ANSWER_STATUS.ANSWERED
        : ANSWER_STATUS.DRAFT;

  return {
    ...attempt,
    updatedAt: nowIso(now),
    answers: {
      ...attempt.answers,
      [question.id]: {
        ...current,
        revision: createQuestionRevision(question),
        draft: nextDraft,
        confidence: nextConfidence,
        status: nextStatus,
        updatedAt: nowIso(now),
      },
    },
  };
}

export function resetAnswer(attempt, question, now = Date.now()) {
  return {
    ...attempt,
    status: attempt.status === "completed" ? "reopened" : attempt.status,
    completedAt: attempt.status === "completed" ? null : attempt.completedAt,
    currentQuestionId: question.id,
    updatedAt: nowIso(now),
    answers: {
      ...attempt.answers,
      [question.id]: createBlankAnswer(question, now),
    },
  };
}

export function navigateAttempt(attempt, questionId, now = Date.now()) {
  return { ...attempt, currentQuestionId: questionId, updatedAt: nowIso(now) };
}

export function completeAttempt(attempt, now = Date.now()) {
  return {
    ...attempt,
    status: "completed",
    completedAt: nowIso(now),
    updatedAt: nowIso(now),
  };
}

export function reopenAttempt(attempt, now = Date.now()) {
  return {
    ...attempt,
    status: "reopened",
    completedAt: null,
    updatedAt: nowIso(now),
  };
}

export function summarizeAttempt(attempt) {
  const answers = Object.values(attempt.answers);
  const confidence = answers.filter((answer) => Number.isFinite(answer.confidence));
  return {
    total: answers.length,
    answered: answers.filter((answer) => answer.status === ANSWER_STATUS.ANSWERED).length,
    skipped: answers.filter((answer) => answer.status === ANSWER_STATUS.SKIPPED).length,
    needsReview: answers.filter((answer) => answer.status === ANSWER_STATUS.NEEDS_REVIEW).length,
    draft: answers.filter((answer) => answer.status === ANSWER_STATUS.DRAFT).length,
    averageConfidence: confidence.length
      ? confidence.reduce((sum, answer) => sum + answer.confidence, 0) / confidence.length
      : null,
  };
}

export function isAnswerCompatible(answer, question) {
  return answer?.revision === createQuestionRevision(question);
}

export function buildAssessmentAiHandoff({ chapter, question, answer }) {
  return {
    kind: "assessment-question",
    chapter,
    questionId: question.id,
    questionRevision: createQuestionRevision(question),
    prompt: [
      `我正在完成 React 学习平台 Chapter ${String(chapter).padStart(2, "0")} 的练习。`,
      `题目：${question.prompt}`,
      answer?.draft?.trim() ? `我的回答：${answer.draft.trim()}` : "我还没有形成完整回答。",
      Number.isFinite(answer?.confidence) ? `我的信心程度：${answer.confidence}/5。` : null,
      "请不要直接给最终答案。先指出我的推理中最需要验证的一点，再用追问或最小提示帮助我继续。",
    ].filter(Boolean).join("\n"),
  };
}

export function buildAttemptMarkdown({ chapter, questions, attempt }) {
  const summary = summarizeAttempt(attempt);
  const lines = [
    `# Chapter ${String(chapter).padStart(2, "0")} Practice Summary`,
    "",
    `- Answered: ${summary.answered}/${summary.total}`,
    `- Skipped: ${summary.skipped}`,
    `- Needs review: ${summary.needsReview}`,
    summary.averageConfidence == null ? "- Average confidence: n/a" : `- Average confidence: ${summary.averageConfidence.toFixed(1)}/5`,
    "",
  ];
  for (const question of questions) {
    const answer = attempt.answers[question.id];
    lines.push(`## ${question.prompt}`, "", answer?.draft?.trim() || "_(No answer)_", "", `Status: ${answer?.status ?? "draft"}`, "");
  }
  return lines.join("\n");
}