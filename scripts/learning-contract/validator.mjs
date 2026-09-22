import {
  validateGuidedActivityDefinition,
} from "../../src/workbench/guidedActivity.js";
import {
  GUIDED_PRACTICE_KINDS,
  evaluateGuidedPracticeResponse,
  getExpectedGuidedPracticeResponse,
} from "../../src/workbench/guidedPractice.js";

export const LEARNING_CONTRACT_VERSION = "learning-contract-v1";

function issue(code, message, path = null) {
  return Object.freeze({ code, message, path });
}

function isNonBlank(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function positiveInteger(value) {
  return Number.isInteger(value) && value >= 1;
}

export function findDuplicateValues(values) {
  const counts = new Map();
  for (const value of values ?? []) {
    if (!isNonBlank(value)) continue;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([value]) => value)
    .sort();
}

function getPracticeStep(guided) {
  return guided?.steps?.find((step) => step.type === "practice") ?? null;
}

function getIncorrectPracticeResponse(step) {
  const expected = getExpectedGuidedPracticeResponse(step);
  if (!expected) return null;

  if (expected.kind === GUIDED_PRACTICE_KINDS.ORDERED_SEQUENCE) {
    const reversed = [...expected.itemIds].reverse();
    if (
      reversed.length > 1
      && reversed.every((itemId, index) => itemId === expected.itemIds[index])
    ) {
      [reversed[0], reversed[1]] = [reversed[1], reversed[0]];
    }
    return { kind: expected.kind, itemIds: reversed };
  }

  const alternative = step?.response?.options?.find(({ id }) => id !== expected.optionId);
  return alternative
    ? { kind: expected.kind, optionId: alternative.id }
    : null;
}

function validateFlow(snapshot, errors) {
  const id = snapshot.learningUnitId;
  const flow = snapshot.flow;
  if (!flow) {
    errors.push(issue("FLOW_MISSING", id + ": missing Single Learning Flow", "flow"));
    return;
  }
  if (flow.learningUnitId !== id) {
    errors.push(issue("IDENTITY_MISMATCH", id + ": flow learningUnitId mismatch", "flow.learningUnitId"));
  }

  const required = {
    objective: flow.objective,
    coreModelTitle: flow.coreModelTitle,
    mentalModel: flow.mentalModel,
    misconceptionTitle: flow.misconceptionTitle,
    misconception: flow.misconception,
    decisionRuleTitle: flow.decisionRuleTitle,
    decisionRule: flow.decisionRule,
    practiceTitle: flow.practiceTitle,
    practiceDescription: flow.practiceDescription,
    verifyTitle: flow.verifyTitle,
    verifyDescription: flow.verifyDescription,
    aiReviewTarget: flow.aiReviewTarget,
    "stageHints.understand": flow.stageHints?.understand,
    "stageHints.practice": flow.stageHints?.practice,
    "stageHints.verify": flow.stageHints?.verify,
  };

  for (const [path, value] of Object.entries(required)) {
    if (!isNonBlank(value)) {
      errors.push(issue("FLOW_FIELD_BLANK", id + ": blank required flow field " + path, "flow." + path));
    }
  }
}

function validateConcept(snapshot, errors, warnings) {
  const id = snapshot.learningUnitId;
  const concept = snapshot.concept;
  if (!concept) {
    errors.push(issue("CONCEPT_MISSING", id + ": missing concept model", "concept"));
    return;
  }
  if (concept.learningUnitId !== id) {
    errors.push(issue("IDENTITY_MISMATCH", id + ": concept learningUnitId mismatch", "concept.learningUnitId"));
  }
  if (!positiveInteger(concept.version)) {
    errors.push(issue("CONCEPT_VERSION_INVALID", id + ": concept version must be positive", "concept.version"));
  }
  if (!Array.isArray(concept.mechanismMap) || concept.mechanismMap.length === 0) {
    errors.push(issue("MECHANISM_MISSING", id + ": mechanismMap is required", "concept.mechanismMap"));
  }
  if (!Array.isArray(concept.contrastCases) || concept.contrastCases.length === 0) {
    warnings.push(issue(
      "OPTIONAL_CONTRAST_MISSING",
      id + ": no contrastCases; allowed by V1 but worth semantic review",
      "concept.contrastCases",
    ));
  }

  const evidence = Array.isArray(concept.codeEvidence) ? concept.codeEvidence : [];
  if (evidence.length < 2) {
    errors.push(issue("CODE_EVIDENCE_INSUFFICIENT", id + ": requires at least two source-backed codeEvidence entries", "concept.codeEvidence"));
  }
  for (const duplicateId of findDuplicateValues(evidence.map((item) => item?.id))) {
    errors.push(issue("CODE_EVIDENCE_DUPLICATE", id + ": duplicate codeEvidence id " + duplicateId, "concept.codeEvidence"));
  }

  for (const item of evidence) {
    if (!isNonBlank(item?.id) || !isNonBlank(item?.title) || !isNonBlank(item?.explanation)) {
      errors.push(issue("CODE_EVIDENCE_INVALID", id + ": codeEvidence requires id/title/explanation", "concept.codeEvidence"));
      continue;
    }
    const ref = item.sourceRef;
    if (
      ref?.kind !== "source"
      || !isNonBlank(ref.fileName)
      || !positiveInteger(ref.startLine)
      || !positiveInteger(ref.endLine)
      || ref.endLine < ref.startLine
    ) {
      errors.push(issue("SOURCE_REF_INVALID", id + "/" + item.id + ": invalid sourceRef", "concept.codeEvidence." + item.id));
      continue;
    }

    const source = snapshot.sourceFiles?.[ref.fileName];
    if (typeof source !== "string") {
      errors.push(issue("SOURCE_FILE_UNOWNED", id + "/" + item.id + ": source file is not owned by the Learning Unit: " + ref.fileName, "concept.codeEvidence." + item.id));
      continue;
    }
    const lineCount = source.split("\n").length;
    if (ref.startLine > lineCount || ref.endLine > lineCount) {
      errors.push(issue("SOURCE_RANGE_INVALID", id + "/" + item.id + ": source range exceeds " + ref.fileName + " line count", "concept.codeEvidence." + item.id));
    }
  }

  const misconceptions = Object.entries(concept.misconceptions ?? {});
  if (misconceptions.length === 0) {
    errors.push(issue("MISCONCEPTIONS_MISSING", id + ": at least one misconception is required", "concept.misconceptions"));
  }
  for (const [misconceptionId, misconception] of misconceptions) {
    if (misconception?.id !== misconceptionId) {
      errors.push(issue("MISCONCEPTION_ID_MISMATCH", id + ": misconception key/id mismatch for " + misconceptionId, "concept.misconceptions." + misconceptionId));
    }
    for (const field of ["title", "diagnosis", "counterEvidence", "experiment"]) {
      if (!isNonBlank(misconception?.[field])) {
        errors.push(issue("MISCONCEPTION_FIELD_BLANK", id + "/" + misconceptionId + ": blank misconception field " + field, "concept.misconceptions." + misconceptionId + "." + field));
      }
    }
  }
}

function validatePractice(snapshot, errors) {
  const id = snapshot.learningUnitId;
  const guided = snapshot.guided;
  if (!guided) {
    errors.push(issue("GUIDED_MISSING", id + ": missing Guided Practice definition", "guided"));
    return;
  }
  if (guided.learningUnitId !== id) {
    errors.push(issue("IDENTITY_MISMATCH", id + ": Guided learningUnitId mismatch", "guided.learningUnitId"));
  }
  if (!positiveInteger(guided.revision)) {
    errors.push(issue("GUIDED_REVISION_INVALID", id + ": Guided revision must be positive", "guided.revision"));
  }

  const result = validateGuidedActivityDefinition(guided);
  if (!result.valid) {
    errors.push(issue("GUIDED_INVALID", id + ": " + result.errors.join("; "), "guided"));
    return;
  }

  const practice = getPracticeStep(guided);
  if (!isNonBlank(practice?.codeContext?.code)) {
    errors.push(issue("PRACTICE_CODE_CONTEXT_MISSING", id + ": V1 Practice requires unfamiliar codeContext", "guided.practice.codeContext"));
  }

  const expected = getExpectedGuidedPracticeResponse(practice);
  const expectedOutcome = evaluateGuidedPracticeResponse(practice, expected);
  if (expectedOutcome?.correct !== true) {
    errors.push(issue("PRACTICE_EXPECTED_NOT_CORRECT", id + ": authored expected Practice response does not evaluate correct", "guided.practice"));
  }

  const incorrect = getIncorrectPracticeResponse(practice);
  const incorrectOutcome = evaluateGuidedPracticeResponse(practice, incorrect);
  if (incorrectOutcome?.correct !== false) {
    errors.push(issue("PRACTICE_NO_INCORRECT_ALTERNATIVE", id + ": Practice must expose a deterministic incorrect alternative", "guided.practice"));
  }
}

function validateVerify(snapshot, errors) {
  const id = snapshot.learningUnitId;
  const questions = Array.isArray(snapshot.questions) ? snapshot.questions : [];
  if (questions.length !== 5) {
    errors.push(issue("VERIFY_COUNT_INVALID", id + ": V1 requires exactly five canonical Verify questions", "questions"));
  }

  let transferCount = 0;
  let diagnosticCount = 0;
  const misconceptions = snapshot.concept?.misconceptions ?? {};

  for (const [index, question] of questions.entries()) {
    const path = "questions[" + index + "]";
    if (question?.learningUnitId !== id) {
      errors.push(issue("IDENTITY_MISMATCH", id + ": Verify question learningUnitId mismatch", path + ".learningUnitId"));
    }
    if (!positiveInteger(question?.revision)) {
      errors.push(issue("VERIFY_REVISION_INVALID", id + ": Verify question revision must be positive", path + ".revision"));
    }

    const options = question?.content?.options ?? [];
    const optionIds = new Set(options.map(({ id: optionId }) => optionId));
    const correctOptionId = question?.content?.correctOptionId;
    if (!optionIds.has(correctOptionId)) {
      errors.push(issue("VERIFY_CORRECT_OPTION_INVALID", id + ": correctOptionId does not resolve", path + ".content.correctOptionId"));
    }
    if (isNonBlank(question?.content?.codeContext?.code)) transferCount += 1;

    const mapping = question?.content?.diagnosticOptionMap ?? {};
    for (const [optionId, misconceptionId] of Object.entries(mapping)) {
      diagnosticCount += 1;
      if (!optionIds.has(optionId)) {
        errors.push(issue("VERIFY_DIAGNOSTIC_OPTION_UNKNOWN", id + ": diagnostic option does not exist: " + optionId, path + ".content.diagnosticOptionMap"));
      }
      if (optionId === correctOptionId) {
        errors.push(issue("VERIFY_CORRECT_OPTION_DIAGNOSED", id + ": correct option cannot map to a misconception", path + ".content.diagnosticOptionMap"));
      }
      if (!misconceptions?.[misconceptionId]) {
        errors.push(issue("VERIFY_MISCONCEPTION_UNKNOWN", id + ": unresolved misconception " + misconceptionId, path + ".content.diagnosticOptionMap"));
      }
    }
  }

  if (transferCount < 1) {
    errors.push(issue("VERIFY_TRANSFER_MISSING", id + ": at least one unfamiliar-code Verify question is required", "questions"));
  }
  if (diagnosticCount < 1) {
    errors.push(issue("VERIFY_DIAGNOSTIC_MISSING", id + ": at least one diagnostic wrong-answer mapping is required", "questions"));
  }
}

export function validateLearningContractSnapshot(snapshot, { semanticReviewed = false } = {}) {
  const errors = [];
  const warnings = [];
  const reviewRequired = [];

  if (!snapshot || !isNonBlank(snapshot.learningUnitId)) {
    errors.push(issue("LEARNING_UNIT_ID_INVALID", "snapshot.learningUnitId must be non-blank", "learningUnitId"));
    return Object.freeze({ errors, warnings, reviewRequired });
  }

  validateFlow(snapshot, errors);
  validateConcept(snapshot, errors, warnings);
  validatePractice(snapshot, errors);
  validateVerify(snapshot, errors);

  if (!semanticReviewed) {
    reviewRequired.push(issue(
      "SEMANTIC_ALIGNMENT_REVIEW",
      snapshot.learningUnitId + ": objective → mechanism/code → Practice → Verify → closure alignment requires review",
      null,
    ));
  }

  return Object.freeze({
    errors: Object.freeze(errors),
    warnings: Object.freeze(warnings),
    reviewRequired: Object.freeze(reviewRequired),
  });
}
