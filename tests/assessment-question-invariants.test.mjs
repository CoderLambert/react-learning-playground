import assert from "node:assert/strict";
import test from "node:test";

import { ASSESSMENT_ERROR_CODES } from "../src/assessment/domain/assessmentErrors.js";
import { assertQuestionDraft } from "../src/assessment/domain/question.js";

function singleChoice() {
  return {
    type: "single_choice",
    content: {
      prompt: "Which value is immutable?",
      options: [{ id: "a", text: "Props" }, { id: "b", text: "State" }],
      correctOptionId: "a",
      explanation: "Props are inputs.",
    },
  };
}

function trueFalse() {
  return {
    type: "true_false",
    content: {
      prompt: "Props are immutable.",
      correct: true,
      explanation: "Props are inputs.",
    },
  };
}

test("single-choice canonical content rejects true-false fields", () => {
  const question = singleChoice();
  question.content.correct = true;
  assert.throws(
    () => assertQuestionDraft(question),
    (error) => error.code === ASSESSMENT_ERROR_CODES.INVALID_QUESTION && /must not contain correct/.test(error.message),
  );
});

test("true-false canonical content rejects single-choice fields", () => {
  const withOptions = trueFalse();
  withOptions.content.options = [{ id: "a", text: "A" }, { id: "b", text: "B" }];
  assert.throws(
    () => assertQuestionDraft(withOptions),
    (error) => error.code === ASSESSMENT_ERROR_CODES.INVALID_QUESTION && /must not contain single-choice fields/.test(error.message),
  );

  const withCorrectOptionId = trueFalse();
  withCorrectOptionId.content.correctOptionId = "a";
  assert.throws(
    () => assertQuestionDraft(withCorrectOptionId),
    (error) => error.code === ASSESSMENT_ERROR_CODES.INVALID_QUESTION && /must not contain single-choice fields/.test(error.message),
  );
});

test("valid canonical shapes remain accepted", () => {
  assert.equal(assertQuestionDraft(singleChoice()).type, "single_choice");
  assert.equal(assertQuestionDraft(trueFalse()).type, "true_false");
});
