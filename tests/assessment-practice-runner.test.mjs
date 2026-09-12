import assert from "node:assert/strict";
import test from "node:test";
import {
  ANSWER_STATUS,
  buildAssessmentAiHandoff,
  buildAttemptMarkdown,
  completeAttempt,
  createAttempt,
  createQuestionRevision,
  reconcileAttemptQuestions,
  reopenAttempt,
  resetAnswer,
  summarizeAttempt,
  updateAnswer,
} from "../src/assessment/practiceAttempt.js";
import { createAttemptRepository, createMemoryStorage } from "../src/assessment/attemptRepository.js";

const questions = [
  { id: "q-state-snapshot", kind: "free-text", prompt: "为什么 state 是一次 render 的 snapshot？" },
  { id: "q-batching", kind: "free-text", prompt: "batching 与 functional updater 的关系是什么？" },
];

test("attempt transitions preserve explicit answer semantics", () => {
  let attempt = createAttempt({ chapter: 2, questions, sessionId: "session-1", now: 0 });
  assert.equal(attempt.answers[questions[0].id].status, ANSWER_STATUS.DRAFT);

  attempt = updateAnswer(attempt, questions[0], { draft: "因为 render 闭包读取固定快照", confidence: 4 }, 1);
  assert.equal(attempt.answers[questions[0].id].status, ANSWER_STATUS.ANSWERED);
  assert.equal(attempt.answers[questions[0].id].confidence, 4);

  attempt = updateAnswer(attempt, questions[1], { status: ANSWER_STATUS.SKIPPED }, 2);
  assert.equal(attempt.answers[questions[1].id].status, ANSWER_STATUS.SKIPPED);

  attempt = updateAnswer(attempt, questions[0], { status: ANSWER_STATUS.NEEDS_REVIEW }, 3);
  assert.equal(attempt.answers[questions[0].id].status, ANSWER_STATUS.NEEDS_REVIEW);

  const summary = summarizeAttempt(attempt);
  assert.deepEqual(summary, { total: 2, answered: 0, skipped: 1, needsReview: 1, draft: 0, averageConfidence: 4 });
});

test("repository restores attempt and rejects corrupt/version-mismatched payloads", () => {
  const storage = createMemoryStorage();
  const repository = createAttemptRepository(storage);
  const attempt = createAttempt({ chapter: 2, questions, sessionId: "session-2", now: 0 });
  assert.equal(repository.save(attempt), true);
  assert.deepEqual(repository.load(2), attempt);

  storage.setItem("react-learning-playground:assessment-attempt:v1:chapter-3:current", "{bad json");
  assert.equal(repository.load(3), null);
  storage.setItem("react-learning-playground:assessment-attempt:v1:chapter-4:current", JSON.stringify({ version: 99, chapter: 4, answers: {} }));
  assert.equal(repository.load(4), null);
});

test("repository rejects a payload stored under the wrong chapter key", () => {
  const storage = createMemoryStorage();
  const repository = createAttemptRepository(storage);
  const chapter3Attempt = createAttempt({ chapter: 3, questions, sessionId: "wrong-chapter", now: 0 });
  storage.setItem("react-learning-playground:assessment-attempt:v1:chapter-2:current", JSON.stringify(chapter3Attempt));
  assert.equal(repository.load(2), null);
});

test("repository read errors degrade to no restored attempt", () => {
  const repository = createAttemptRepository({
    getItem() { throw new Error("storage denied"); },
    setItem() {},
    removeItem() {},
  });
  assert.equal(repository.load(2), null);
});

test("chapter persistence stays isolated", () => {
  const storage = createMemoryStorage();
  const repository = createAttemptRepository(storage);
  let chapter2 = createAttempt({ chapter: 2, questions, sessionId: "shared", now: 0 });
  let chapter3 = createAttempt({ chapter: 3, questions, sessionId: "shared", now: 0 });
  chapter2 = updateAnswer(chapter2, questions[0], { draft: "chapter two" }, 1);
  chapter3 = updateAnswer(chapter3, questions[0], { draft: "chapter three" }, 1);
  repository.save(chapter2);
  repository.save(chapter3);
  assert.equal(repository.load(2).answers[questions[0].id].draft, "chapter two");
  assert.equal(repository.load(3).answers[questions[0].id].draft, "chapter three");
});

test("session persistence stays isolated within the same chapter", () => {
  const storage = createMemoryStorage();
  const repository = createAttemptRepository(storage);
  let first = createAttempt({ chapter: 2, questions, sessionId: "session-a", now: 0 });
  let second = createAttempt({ chapter: 2, questions, sessionId: "session-b", now: 0 });
  first = updateAnswer(first, questions[0], { draft: "first session" }, 1);
  second = updateAnswer(second, questions[0], { draft: "second session" }, 1);
  repository.save(first, "session-a");
  repository.save(second, "session-b");
  assert.equal(repository.load(2, "session-a").answers[questions[0].id].draft, "first session");
  assert.equal(repository.load(2, "session-b").answers[questions[0].id].draft, "second session");
});

test("question revision changes when prompt changes", () => {
  const before = createQuestionRevision(questions[0]);
  const after = createQuestionRevision({ ...questions[0], prompt: `${questions[0].prompt}（补充）` });
  assert.notEqual(before, after);
});

test("reconcile resets only answers whose question revision changed", () => {
  let attempt = createAttempt({ chapter: 2, questions, sessionId: "session-revision", now: 0 });
  attempt = updateAnswer(attempt, questions[0], { draft: "旧答案", confidence: 5 }, 1);
  attempt = updateAnswer(attempt, questions[1], { draft: "保留答案", confidence: 3 }, 1);
  const revised = [{ ...questions[0], prompt: `${questions[0].prompt}（新版）` }, questions[1]];
  const reconciled = reconcileAttemptQuestions(attempt, revised, 2);
  assert.equal(reconciled.answers[questions[0].id].draft, "");
  assert.equal(reconciled.answers[questions[0].id].status, ANSWER_STATUS.DRAFT);
  assert.equal(reconciled.answers[questions[1].id].draft, "保留答案");
});

test("reset answer reopens a completed attempt without touching other answers", () => {
  let attempt = createAttempt({ chapter: 2, questions, sessionId: "session-reset", now: 0 });
  attempt = updateAnswer(attempt, questions[0], { draft: "旧回答" }, 1);
  attempt = updateAnswer(attempt, questions[1], { draft: "保留回答" }, 1);
  attempt = completeAttempt(attempt, 2);
  attempt = resetAnswer(attempt, questions[0], 3);
  assert.equal(attempt.status, "reopened");
  assert.equal(attempt.completedAt, null);
  assert.equal(attempt.currentQuestionId, questions[0].id);
  assert.equal(attempt.answers[questions[0].id].draft, "");
  assert.equal(attempt.answers[questions[0].id].status, ANSWER_STATUS.DRAFT);
  assert.equal(attempt.answers[questions[1].id].draft, "保留回答");
});

test("completion and reopen keep answers without fabricating scores", () => {
  let attempt = createAttempt({ chapter: 2, questions, sessionId: "session-3", now: 0 });
  attempt = updateAnswer(attempt, questions[0], { draft: "回答", confidence: 3 }, 1);
  attempt = completeAttempt(attempt, 2);
  assert.equal(attempt.status, "completed");
  assert.equal("score" in summarizeAttempt(attempt), false);

  attempt = reopenAttempt(attempt, 3);
  assert.equal(attempt.status, "reopened");
  assert.equal(attempt.answers[questions[0].id].draft, "回答");
});

test("AI handoff asks for coaching instead of direct judgment", () => {
  const attempt = updateAnswer(
    createAttempt({ chapter: 2, questions, sessionId: "session-4", now: 0 }),
    questions[0],
    { draft: "我的推理", confidence: 2 },
    1,
  );
  const handoff = buildAssessmentAiHandoff({ chapter: 2, question: questions[0], answer: attempt.answers[questions[0].id] });
  assert.equal(handoff.kind, "assessment-question");
  assert.match(handoff.prompt, /不要直接给最终答案/);
  assert.match(handoff.prompt, /我的推理/);
});

test("Markdown summary contains real statuses and no score", () => {
  const attempt = createAttempt({ chapter: 2, questions, sessionId: "session-5", now: 0 });
  const markdown = buildAttemptMarkdown({ chapter: 2, questions, attempt });
  assert.match(markdown, /Practice Summary/);
  assert.match(markdown, /Status: draft/);
  assert.doesNotMatch(markdown, /Score:/);
});
