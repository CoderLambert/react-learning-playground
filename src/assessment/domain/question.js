import { ASSESSMENT_ERROR_CODES, AssessmentError } from "./assessmentErrors.js";

export const QUESTION_TYPES = Object.freeze({ SINGLE_CHOICE: "single_choice", TRUE_FALSE: "true_false" });
export const QUESTION_STATUSES = Object.freeze({ ACTIVE: "active", RETIRED: "retired" });
export const QUESTION_DIFFICULTIES = Object.freeze({ EASY: "easy", MEDIUM: "medium", HARD: "hard" });

const TYPE_VALUES = new Set(Object.values(QUESTION_TYPES));
const STATUS_VALUES = new Set(Object.values(QUESTION_STATUSES));
const DIFFICULTY_VALUES = new Set(Object.values(QUESTION_DIFFICULTIES));

function invalidQuestion(message, details = null) {
  throw new AssessmentError(ASSESSMENT_ERROR_CODES.INVALID_QUESTION, message, { details });
}
function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) invalidQuestion(`${field} is required`);
  return value;
}
function validateOptions(options) {
  if (!Array.isArray(options) || options.length < 2) invalidQuestion("single-choice question requires at least two options");
  const ids = new Set();
  for (const [index, option] of options.entries()) {
    if (!option || typeof option !== "object" || Array.isArray(option)) invalidQuestion(`content.options[${index}] must be an object`);
    const id = requiredText(option.id, `content.options[${index}].id`);
    requiredText(option.text, `content.options[${index}].text`);
    if (ids.has(id)) invalidQuestion(`duplicate option id: ${id}`);
    ids.add(id);
  }
  return ids;
}

export function assertEvidenceRef(ref, index = 0) {
  if (!ref || typeof ref !== "object" || Array.isArray(ref)) {
    throw new AssessmentError(ASSESSMENT_ERROR_CODES.INVALID_EVIDENCE, `evidenceRefs[${index}] must be an object`);
  }
  if (ref.kind === "source") {
    if (typeof ref.fileName !== "string" || !ref.fileName.trim()) throw new AssessmentError(ASSESSMENT_ERROR_CODES.INVALID_EVIDENCE, "source evidence fileName is required");
    if (!Number.isInteger(ref.startLine) || ref.startLine < 1 || !Number.isInteger(ref.endLine) || ref.endLine < ref.startLine) throw new AssessmentError(ASSESSMENT_ERROR_CODES.INVALID_EVIDENCE, "source evidence line range is invalid");
    return ref;
  }
  if (ref.kind === "note") {
    if (typeof ref.sectionId !== "string" || !ref.sectionId.trim()) throw new AssessmentError(ASSESSMENT_ERROR_CODES.INVALID_EVIDENCE, "note evidence sectionId is required");
    return ref;
  }
  throw new AssessmentError(ASSESSMENT_ERROR_CODES.INVALID_EVIDENCE, `unsupported evidence kind: ${String(ref.kind)}`);
}

export function assertQuestionDraft(question) {
  if (!question || typeof question !== "object" || Array.isArray(question)) invalidQuestion("question must be an object");
  if (!TYPE_VALUES.has(question.type)) invalidQuestion(`unsupported question type: ${String(question.type)}`);
  if (!question.content || typeof question.content !== "object" || Array.isArray(question.content)) invalidQuestion("content must be an object");
  requiredText(question.content.prompt, "content.prompt");
  requiredText(question.content.explanation, "content.explanation");

  if (question.type === QUESTION_TYPES.SINGLE_CHOICE) {
    const optionIds = validateOptions(question.content.options);
    const correctOptionId = requiredText(question.content.correctOptionId, "content.correctOptionId");
    if (!optionIds.has(correctOptionId)) invalidQuestion("correctOptionId must reference an existing option");
  } else if (typeof question.content.correct !== "boolean") {
    invalidQuestion("true-false question content.correct must be boolean");
  }

  if (question.difficulty != null && !DIFFICULTY_VALUES.has(question.difficulty)) invalidQuestion(`unsupported difficulty: ${String(question.difficulty)}`);
  if (question.conceptTags != null && (!Array.isArray(question.conceptTags) || question.conceptTags.some((tag) => typeof tag !== "string" || !tag.trim()))) invalidQuestion("conceptTags must contain non-empty strings");
  if (question.evidenceRefs != null) {
    if (!Array.isArray(question.evidenceRefs)) invalidQuestion("evidenceRefs must be an array");
    question.evidenceRefs.forEach(assertEvidenceRef);
  }
  return question;
}

export function assertQuestionRecord(question) {
  assertQuestionDraft(question);
  requiredText(question.id, "id");
  requiredText(question.learningUnitId, "learningUnitId");
  if (!STATUS_VALUES.has(question.status)) invalidQuestion(`unsupported status: ${String(question.status)}`);
  if (!Number.isInteger(question.revision) || question.revision < 1) invalidQuestion("revision must be a positive integer");
  requiredText(question.createdAt, "createdAt");
  requiredText(question.updatedAt, "updatedAt");
  if (!question.provenance || typeof question.provenance !== "object" || Array.isArray(question.provenance)) invalidQuestion("provenance must be an object");
  return question;
}
