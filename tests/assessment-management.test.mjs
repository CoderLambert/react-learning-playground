import assert from "node:assert/strict";
import test from "node:test";
import {
  buildQuestionPatch,
  describeAssessmentMutationError,
  questionToDraft,
} from "../src/assessment/ui/assessmentManagement.js";

const singleChoice = {
  id: "q1",
  type: "single_choice",
  difficulty: "medium",
  conceptTags: ["state", "snapshot"],
  content: {
    prompt: "旧题干",
    explanation: "旧解释",
    options: [{ id: "a", text: "A" }, { id: "b", text: "B" }],
    correctOptionId: "a",
  },
};

test("single-choice manager draft preserves stable option ids and editable fields", () => {
  const draft = questionToDraft(singleChoice);
  draft.prompt = "新题干";
  draft.options[1].text = "新 B";
  draft.correctOptionId = "b";
  draft.conceptTagsText = "state, render";
  const patch = buildQuestionPatch(singleChoice, draft);

  assert.deepEqual(patch, {
    content: {
      prompt: "新题干",
      explanation: "旧解释",
      options: [{ id: "a", text: "A" }, { id: "b", text: "新 B" }],
      correctOptionId: "b",
    },
    difficulty: "medium",
    conceptTags: ["state", "render"],
  });
});

test("true-false manager builds boolean answer patch", () => {
  const question = {
    id: "q2",
    type: "true_false",
    content: { prompt: "P", explanation: "E", correct: true },
  };
  const draft = questionToDraft(question);
  draft.correct = false;
  const patch = buildQuestionPatch(question, draft);
  assert.equal(patch.content.correct, false);
  assert.equal(Object.hasOwn(patch.content, "options"), false);
});

test("revision conflict maps to refresh-and-retry guidance", () => {
  assert.deepEqual(describeAssessmentMutationError({ code: "REVISION_CONFLICT" }), {
    kind: "conflict",
    message: "题目已在其他操作中更新。已刷新最新版本，请重新确认后保存。",
  });
});

test("management patch never writes system fields or status", () => {
  const patch = buildQuestionPatch(singleChoice, questionToDraft(singleChoice));
  for (const field of ["id", "learningUnitId", "revision", "status", "provenance", "updatedAt"]) {
    assert.equal(Object.hasOwn(patch, field), false);
  }
});
