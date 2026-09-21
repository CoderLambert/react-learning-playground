import { getMisconceptionForLearningUnit } from "../../../content/conceptModels.js";
import { assertQuestionRecord } from "../../domain/question.js";

const CANONICAL_CATALOG_VERSION = "2026-09-20";
const CANONICAL_TIMESTAMP = "2026-09-20T00:00:00.000Z";

function validateDiagnosticOptionMap(learningUnitId, content) {
  const mapping = content?.diagnosticOptionMap;
  if (mapping == null) return;
  if (!mapping || typeof mapping !== "object" || Array.isArray(mapping)) {
    throw new TypeError("content.diagnosticOptionMap must be an object");
  }

  const optionIds = new Set((content.options ?? []).map((option) => option.id));
  for (const [optionId, misconceptionId] of Object.entries(mapping)) {
    if (!optionIds.has(optionId)) {
      throw new TypeError(`diagnostic option ${optionId} must reference an existing answer option`);
    }
    if (optionId === content.correctOptionId) {
      throw new TypeError("the correct option must not map to a misconception");
    }
    if (!getMisconceptionForLearningUnit(learningUnitId, misconceptionId)) {
      throw new TypeError(`unknown misconception ${misconceptionId} for ${learningUnitId}`);
    }
  }
}

export function canonicalQuestion({
  id,
  learningUnitId,
  type = "single_choice",
  content,
  difficulty,
  conceptTags,
  evidenceRefs = [],
  revision = 1,
  updatedAt = CANONICAL_TIMESTAMP,
  catalogVersion = CANONICAL_CATALOG_VERSION,
}) {
  validateDiagnosticOptionMap(learningUnitId, content);
  const question = {
    id,
    learningUnitId,
    type,
    content,
    difficulty,
    conceptTags,
    evidenceRefs,
    status: "active",
    revision,
    createdAt: CANONICAL_TIMESTAMP,
    updatedAt,
    provenance: {
      source: "canonical",
      catalogVersion,
    },
  };
  assertQuestionRecord(question);
  return Object.freeze(question);
}
