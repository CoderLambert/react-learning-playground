import { ASSESSMENT_ERROR_CODES } from "../domain/assessmentErrors.js";
import { createId } from "../../platform/ids.js";

function clone(value) {
  return structuredClone(value);
}

export function createAssessmentManagerTrustedContext(learningUnitId) {
  if (typeof learningUnitId !== "string" || !learningUnitId.trim()) {
    throw new TypeError("learningUnitId is required");
  }
  return {
    learningUnitId: learningUnitId.trim(),
    mutationId: createId("assessment-ui"),
    actor: { type: "application" },
    provenance: { source: "assessment_manager" },
  };
}

export function questionToDraft(question) {
  if (!question || typeof question !== "object") throw new TypeError("question is required");
  return {
    prompt: question.content?.prompt ?? "",
    explanation: question.content?.explanation ?? "",
    difficulty: question.difficulty ?? "medium",
    conceptTagsText: Array.isArray(question.conceptTags) ? question.conceptTags.join(", ") : "",
    options: question.type === "single_choice"
      ? (question.content?.options ?? []).map((option) => ({ ...clone(option) }))
      : [],
    correctOptionId: question.type === "single_choice" ? question.content?.correctOptionId ?? "" : "",
    correct: question.type === "true_false" ? Boolean(question.content?.correct) : false,
  };
}

export function buildQuestionPatch(question, draft) {
  const conceptTags = String(draft.conceptTagsText ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  const content = {
    prompt: String(draft.prompt ?? "").trim(),
    explanation: String(draft.explanation ?? "").trim(),
  };

  if (question.type === "single_choice") {
    content.options = (draft.options ?? []).map((option) => ({
      id: option.id,
      text: String(option.text ?? "").trim(),
    }));
    content.correctOptionId = draft.correctOptionId;
  } else if (question.type === "true_false") {
    content.correct = Boolean(draft.correct);
  }

  return {
    content,
    difficulty: draft.difficulty || undefined,
    conceptTags,
  };
}

export function describeAssessmentMutationError(error) {
  if (error?.code === ASSESSMENT_ERROR_CODES.REVISION_CONFLICT) {
    return {
      kind: "conflict",
      message: "题目已在其他操作中更新。已刷新最新版本，请重新确认后保存。",
    };
  }
  return {
    kind: "error",
    message: error?.message || "题库操作失败",
  };
}
