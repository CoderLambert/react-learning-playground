/**
 * Model-owned assessment business arguments. Runtime identity, scope, and
 * persistence fields deliberately do not appear in these schemas: those are
 * injected by the assessment tool adapter from the trusted execution context.
 *
 * These are standard JSON Schema values shared unchanged by provider tool
 * definitions and the local Ajv validation performed by ToolExecutor.
 */

const nonBlankStringSchema = Object.freeze({ type: "string", minLength: 1, pattern: "\\S" });

export const sourceEvidenceRefSchema = Object.freeze({
  type: "object",
  properties: {
    kind: { const: "source" },
    fileName: nonBlankStringSchema,
    startLine: { type: "integer", minimum: 1 },
    endLine: { type: "integer", minimum: 1 },
  },
  required: ["kind", "fileName", "startLine", "endLine"],
  additionalProperties: false,
});

export const singleChoiceOptionSchema = Object.freeze({
  type: "object",
  properties: {
    id: nonBlankStringSchema,
    text: nonBlankStringSchema,
  },
  required: ["id", "text"],
  additionalProperties: false,
});

export const singleChoiceContentSchema = Object.freeze({
  type: "object",
  properties: {
    prompt: nonBlankStringSchema,
    options: { type: "array", items: singleChoiceOptionSchema, minItems: 2 },
    correctOptionId: nonBlankStringSchema,
    explanation: nonBlankStringSchema,
  },
  required: ["prompt", "options", "correctOptionId", "explanation"],
  additionalProperties: false,
});

export const trueFalseContentSchema = Object.freeze({
  type: "object",
  properties: {
    prompt: nonBlankStringSchema,
    correct: { type: "boolean" },
    explanation: nonBlankStringSchema,
  },
  required: ["prompt", "correct", "explanation"],
  additionalProperties: false,
});

const commonQuestionProperties = Object.freeze({
  difficulty: { type: "string", enum: ["easy", "medium", "hard"] },
  conceptTags: { type: "array", items: nonBlankStringSchema },
  evidenceRefs: { type: "array", items: sourceEvidenceRefSchema },
});

export const singleChoiceQuestionDraftSchema = Object.freeze({
  type: "object",
  properties: {
    type: { const: "single_choice" },
    content: singleChoiceContentSchema,
    ...commonQuestionProperties,
  },
  required: ["type", "content"],
  additionalProperties: false,
});

export const trueFalseQuestionDraftSchema = Object.freeze({
  type: "object",
  properties: {
    type: { const: "true_false" },
    content: trueFalseContentSchema,
    ...commonQuestionProperties,
  },
  required: ["type", "content"],
  additionalProperties: false,
});

export const assessmentQuestionDraftSchema = Object.freeze({
  anyOf: [singleChoiceQuestionDraftSchema, trueFalseQuestionDraftSchema],
});

const singleChoiceContentPatchSchema = Object.freeze({
  type: "object",
  properties: singleChoiceContentSchema.properties,
  minProperties: 1,
  additionalProperties: false,
});

const trueFalseContentPatchSchema = Object.freeze({
  type: "object",
  properties: trueFalseContentSchema.properties,
  minProperties: 1,
  additionalProperties: false,
});

/**
 * A model may patch business fields only. Question type is immutable in V1;
 * changing a discriminant requires retiring the old question and creating a
 * new one so persisted canonical records never change shape in place.
 */
export const assessmentQuestionPatchSchema = Object.freeze({
  type: "object",
  properties: {
    content: { anyOf: [singleChoiceContentPatchSchema, trueFalseContentPatchSchema] },
    ...commonQuestionProperties,
  },
  minProperties: 1,
  additionalProperties: false,
});

export const assessmentCreateQuestionsInputSchema = Object.freeze({
  type: "object",
  properties: {
    questions: { type: "array", items: assessmentQuestionDraftSchema, minItems: 1 },
  },
  required: ["questions"],
  additionalProperties: false,
});

export const assessmentUpdateQuestionInputSchema = Object.freeze({
  type: "object",
  properties: {
    questionId: nonBlankStringSchema,
    expectedRevision: { type: "integer", minimum: 1 },
    patch: assessmentQuestionPatchSchema,
  },
  required: ["questionId", "expectedRevision", "patch"],
  additionalProperties: false,
});

export const assessmentRetireQuestionInputSchema = Object.freeze({
  type: "object",
  properties: {
    questionId: nonBlankStringSchema,
    expectedRevision: { type: "integer", minimum: 1 },
  },
  required: ["questionId", "expectedRevision"],
  additionalProperties: false,
});

export const assessmentListQuestionsInputSchema = Object.freeze({
  type: "object",
  properties: {
    status: { type: "string", enum: ["active", "retired"] },
  },
  additionalProperties: false,
});
