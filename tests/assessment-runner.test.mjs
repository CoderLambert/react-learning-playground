import assert from "node:assert/strict";
import test from "node:test";

import {
  AttemptRepository,
  createQuestionRevision,
} from "../src/assessment/runner/attemptRepository.js";
import {
  createAiReviewPayload,
  createAiReviewPrompt,
  createAssessmentSummaryMarkdown,
  filterQuestions,
  summarizeAttempts,
} from "../src/assessment/runner/runnerUtils.js";

function createMemoryStorage(seed = {}) {
  const data = new Map(Object.entries(seed));
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: (key) => data.delete(key),
  };
}

const questions = [
  { id: "q1", chapter: 3, kind: "question", prompt: "什么是 derived state？", origin: "builtin" },
  { id: "q2", chapter: 3, kind: "question", prompt: "什么时候应该提升状态？", origin: "builtin" },
  { id: "q3", chapter: 3, kind: "exercise", prompt: "重构重复 state", origin: "builtin" },
];

test("persists attempts and resumes only the current question revision", () => {
  const storage = createMemoryStorage();
  const repository = new AttemptRepository({ storage });
  const attempt = repository.saveAttempt({
    chapter: 3,
    question: questions[0],
    answer: "可以从已有状态计算出的值不应重复存储",
    confidence: "high",
    selfAssessment: "understood",
    now: new Date("2026-09-13T00:00:00.000Z"),
  });

  assert.equal(repository.getAttempt({ chapter: 3, question: questions[0] }).answer, attempt.answer);
  assert.equal(repository.listAttempts(3).length, 1);

  const edited = { ...questions[0], prompt: "请重新解释 derived state" };
  assert.notEqual(createQuestionRevision(edited), attempt.questionRevision);
  assert.equal(repository.getAttempt({ chapter: 3, question: edited }), null);
});

test("stores chapter sessions independently", () => {
  const repository = new AttemptRepository({ storage: createMemoryStorage() });
  repository.saveSession({ chapter: 3, currentQuestionId: "q2" });
  repository.saveSession({ chapter: 4, currentQuestionId: "effects-q1" });

  assert.equal(repository.getSession(3).currentQuestionId, "q2");
  assert.equal(repository.getSession(4).currentQuestionId, "effects-q1");
});

test("falls back safely when storage contains corrupted data", () => {
  const repository = new AttemptRepository({ storage: createMemoryStorage({
    "react-learning-assessment-attempts:v1": "{broken-json",
  }) });
  assert.deepEqual(repository.listAttempts(3), []);
  assert.equal(repository.getSession(3), null);
});

test("summarizes only attempts for current question revisions", () => {
  const repository = new AttemptRepository({ storage: createMemoryStorage() });
  repository.saveAttempt({ chapter: 3, question: questions[0], answer: "answer", confidence: "high", selfAssessment: "needs-review", status: "answered" });
  repository.saveAttempt({ chapter: 3, question: questions[1], status: "skipped", confidence: "low" });
  const attempts = repository.listAttempts(3);
  const summary = summarizeAttempts({ questions, attempts });

  assert.equal(summary.total, 3);
  assert.equal(summary.answered, 1);
  assert.equal(summary.skipped, 1);
  assert.equal(summary.needsReview, 1);
  assert.equal(summary.confidence.high, 1);
  assert.equal(summary.confidence.low, 1);
});

test("filters incomplete and needs-review questions", () => {
  const repository = new AttemptRepository({ storage: createMemoryStorage() });
  repository.saveAttempt({ chapter: 3, question: questions[0], answer: "done", status: "answered", selfAssessment: "needs-review" });
  const attempts = repository.listAttempts(3);

  assert.deepEqual(filterQuestions({ questions, attempts, filter: "needs-review" }).map((item) => item.id), ["q1"]);
  assert.deepEqual(filterQuestions({ questions, attempts, filter: "incomplete" }).map((item) => item.id), ["q2", "q3"]);
});

test("builds an explainable AI handoff without fake scoring", () => {
  const attempt = {
    answer: "derived state 是复制 state",
    confidence: "medium",
    selfAssessment: "needs-review",
  };
  const payload = createAiReviewPayload({ chapter: 3, question: questions[0], attempt });
  const prompt = createAiReviewPrompt({ chapter: 3, question: questions[0], attempt });

  assert.equal(payload.type, "assessment-answer-review");
  assert.match(prompt, /覆盖了哪些关键点/);
  assert.match(prompt, /遗漏/);
  assert.match(prompt, /概念误区/);
  assert.match(prompt, /不要给出虚假的百分制分数/);
});

test("creates a portable markdown practice summary", () => {
  const repository = new AttemptRepository({ storage: createMemoryStorage() });
  repository.saveAttempt({ chapter: 3, question: questions[0], answer: "我的答案", confidence: "high", selfAssessment: "understood", status: "answered" });
  const markdown = createAssessmentSummaryMarkdown({
    chapter: 3,
    title: "Chapter 03 Practice",
    questions,
    attempts: repository.listAttempts(3),
  });

  assert.match(markdown, /^# Chapter 03 Practice/m);
  assert.match(markdown, /Answered: 1/);
  assert.match(markdown, /我的答案/);
  assert.match(markdown, /Self assessment: understood/);
});
