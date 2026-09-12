import assert from "node:assert/strict";
import test from "node:test";

import { deriveAssessmentView, formatAssessmentProgress } from "../src/assessment/ui/assessmentViewModel.js";

const question = Object.freeze({
  id: "q-1",
  revision: 3,
  type: "true_false",
  content: { prompt: "React state is a snapshot?", correct: true, explanation: "Each render observes its own snapshot." },
});

const session = Object.freeze({
  id: "session-1",
  items: [
    { questionId: "q-1", revision: 3, snapshot: question },
    { questionId: "q-2", revision: 1, snapshot: { ...question, id: "q-2", revision: 1 } },
  ],
});

test("empty assessment view is stable and serializable", () => {
  const view = deriveAssessmentView();
  assert.equal(view.kind, "empty");
  assert.equal(view.question, null);
  assert.equal(formatAssessmentProgress(view), "0 / 0");
});

test("session view exposes the frozen question snapshot identity", () => {
  const view = deriveAssessmentView({ session, currentIndex: 0 });
  assert.equal(view.kind, "session");
  assert.equal(view.question, question);
  assert.equal(view.questionId, "q-1");
  assert.equal(view.revision, 3);
  assert.equal(view.isLast, false);
  assert.equal(formatAssessmentProgress(view), "1 / 2");
});

test("session view clamps index and preserves feedback", () => {
  const feedback = { correct: true, explanation: "ok" };
  const view = deriveAssessmentView({ session, currentIndex: 99, feedback });
  assert.equal(view.currentIndex, 1);
  assert.equal(view.questionId, "q-2");
  assert.equal(view.isLast, true);
  assert.equal(view.feedback, feedback);
  assert.equal(formatAssessmentProgress(view), "2 / 2");
});
