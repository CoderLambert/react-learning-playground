import { ASSESSMENT_ERROR_CODES, AssessmentError } from "./assessmentErrors.js";
import { QUESTION_TYPES, assertQuestionRecord } from "./question.js";

export function evaluateQuestionAnswer(questionSnapshot, answer) {
  assertQuestionRecord(questionSnapshot);
  if (questionSnapshot.type === QUESTION_TYPES.SINGLE_CHOICE) {
    if (typeof answer !== "string" || !answer.trim()) {
      throw new AssessmentError(ASSESSMENT_ERROR_CODES.INVALID_QUESTION, "single-choice answer must be an option id");
    }
    return answer === questionSnapshot.content.correctOptionId;
  }
  if (typeof answer !== "boolean") {
    throw new AssessmentError(ASSESSMENT_ERROR_CODES.INVALID_QUESTION, "true-false answer must be boolean");
  }
  return answer === questionSnapshot.content.correct;
}

export function assertAttempt(attempt) {
  if (!attempt || typeof attempt !== "object" || Array.isArray(attempt)) throw new TypeError("attempt must be an object");
  for (const field of ["id", "sessionId", "questionId", "submittedAt"]) {
    if (typeof attempt[field] !== "string" || !attempt[field].trim()) throw new TypeError(`attempt.${field} is required`);
  }
  if (!Number.isInteger(attempt.questionRevision) || attempt.questionRevision < 1) throw new TypeError("attempt.questionRevision must be positive");
  if (typeof attempt.correct !== "boolean") throw new TypeError("attempt.correct must be boolean");
  if (typeof attempt.answer !== "string" && typeof attempt.answer !== "boolean") throw new TypeError("attempt.answer must be string or boolean");
  return attempt;
}
