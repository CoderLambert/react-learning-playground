import { TOOL_POLICIES } from "../../ai/agent/agentContracts.js";
import {
  assessmentCreateQuestionsInputSchema,
  assessmentListQuestionsInputSchema,
  assessmentRetireQuestionInputSchema,
  assessmentUpdateQuestionInputSchema,
} from "./assessmentToolSchemas.js";

export const ASSESSMENT_TOOL_NAMES = Object.freeze({
  LIST_QUESTIONS: "assessment_list_questions",
  CREATE_QUESTIONS: "assessment_create_questions",
  UPDATE_QUESTION: "assessment_update_question",
  RETIRE_QUESTION: "assessment_retire_question",
});

const TRUSTED_CONTEXT_FIELDS = Object.freeze([
  "learningUnitId",
  "conversationId",
  "agentRunId",
  "contextSnapshotId",
  "mutationId",
]);

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new TypeError(`${field} is required`);
  return value.trim();
}

function assertArguments(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError("tool arguments must be an object");
  }
  return value;
}

function assertTrustedContext(context) {
  if (!context || typeof context !== "object" || Array.isArray(context)) {
    throw new TypeError("tool execution context is required");
  }
  for (const field of TRUSTED_CONTEXT_FIELDS) requiredText(context[field], `context.${field}`);
  if (!context.actor || typeof context.actor !== "object" || Array.isArray(context.actor)) {
    throw new TypeError("context.actor is required");
  }
  return context;
}

function trustedServiceInput(context, execution = null) {
  const trusted = {};
  for (const field of TRUSTED_CONTEXT_FIELDS) trusted[field] = requiredText(context[field], `context.${field}`);
  const toolCallId = execution?.toolCallId ?? context.toolCallId;
  if (toolCallId) trusted.mutationId = `${trusted.agentRunId}:${requiredText(toolCallId, "toolCallId")}`;
  trusted.actor = structuredClone(context.actor);
  if (typeof context.model === "string" && context.model.trim()) trusted.model = context.model.trim();
  if (context.provenance && typeof context.provenance === "object" && !Array.isArray(context.provenance)) {
    trusted.provenance = structuredClone(context.provenance);
  }
  return trusted;
}

function assertAssessmentService(service) {
  if (!service || typeof service !== "object") throw new TypeError("assessment service is required");
  for (const method of [
    "listQuestions",
    "createQuestions",
    "updateQuestion",
    "retireQuestion",
  ]) {
    if (typeof service[method] !== "function") {
      throw new TypeError(`assessment service.${method} is required`);
    }
  }
  return service;
}

/**
 * Create the Assessment-specific tool definitions for the generic agent
 * runtime. The model owns only business arguments; all scope and mutation
 * identity are copied from the trusted ToolExecutionContext.
 */
export function createAssessmentToolDefinitions({ assessmentService } = {}) {
  const service = assertAssessmentService(assessmentService);

  return [
    {
      name: ASSESSMENT_TOOL_NAMES.LIST_QUESTIONS,
      description: "List assessment questions in the current learning unit.",
      policy: TOOL_POLICIES.QUERY,
      inputSchema: assessmentListQuestionsInputSchema,
      handler: async (argumentsValue, context, execution) => {
        const args = assertArguments(argumentsValue);
        const trusted = trustedServiceInput(assertTrustedContext(context), execution);
        return service.listQuestions({ trusted, ...(args.status === undefined ? {} : { status: args.status }) });
      },
    },
    {
      name: ASSESSMENT_TOOL_NAMES.CREATE_QUESTIONS,
      description: "Create assessment questions in the current learning unit.",
      policy: TOOL_POLICIES.COMMAND,
      inputSchema: assessmentCreateQuestionsInputSchema,
      handler: async (argumentsValue, context, execution) => {
        const args = assertArguments(argumentsValue);
        const trusted = trustedServiceInput(assertTrustedContext(context), execution);
        return service.createQuestions({ trusted, questions: args.questions });
      },
    },
    {
      name: ASSESSMENT_TOOL_NAMES.UPDATE_QUESTION,
      description: "Update mutable business fields on an assessment question.",
      policy: TOOL_POLICIES.COMMAND,
      inputSchema: assessmentUpdateQuestionInputSchema,
      handler: async (argumentsValue, context, execution) => {
        const args = assertArguments(argumentsValue);
        const trusted = trustedServiceInput(assertTrustedContext(context), execution);
        return service.updateQuestion({
          trusted,
          questionId: args.questionId,
          expectedRevision: args.expectedRevision,
          patch: args.patch,
        });
      },
    },
    {
      name: ASSESSMENT_TOOL_NAMES.RETIRE_QUESTION,
      description: "Retire an assessment question without deleting it.",
      policy: TOOL_POLICIES.COMMAND,
      inputSchema: assessmentRetireQuestionInputSchema,
      handler: async (argumentsValue, context, execution) => {
        const args = assertArguments(argumentsValue);
        const trusted = trustedServiceInput(assertTrustedContext(context), execution);
        return service.retireQuestion({
          trusted,
          questionId: args.questionId,
          expectedRevision: args.expectedRevision,
        });
      },
    },
  ];
}

export const createAssessmentTools = createAssessmentToolDefinitions;
