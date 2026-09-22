import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { REPRESENTATIVE_PILOT } from "../scripts/audit-learning-contract-baseline.mjs";
import { getSingleLearningFlowDefinition } from "../src/learning-flow/learningFlowRegistry.js";
import {
  getConceptModelForLearningUnit,
  getMisconceptionForLearningUnit,
} from "../src/content/conceptModels.js";
import {
  getGuidedActivityDefinition,
  validateGuidedActivityDefinition,
} from "../src/workbench/guidedActivity.js";
import {
  GUIDED_PRACTICE_KINDS,
  evaluateGuidedPracticeResponse,
  getExpectedGuidedPracticeResponse,
} from "../src/workbench/guidedPractice.js";
import { getCanonicalAssessmentQuestions } from "../src/assessment/content/canonicalQuestions.js";
import { createLearningReviewProjection } from "../src/learning-flow/learningReviewProjection.js";

const PILOT_IDS = REPRESENTATIVE_PILOT.map(({ learningUnitId }) => learningUnitId);
const EXPECTED_PILOT_IDS = [
  "props",
  "state-snapshot-queue",
  "preserving-resetting-state",
  "render-commit",
  "use-effect-correct-usage",
];

function isNonBlank(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function getPracticeStep(definition) {
  return definition.steps.find((step) => step.type === "practice");
}

function getIncorrectPracticeResponse(step) {
  const expected = getExpectedGuidedPracticeResponse(step);
  if (!expected) return null;

  if (expected.kind === GUIDED_PRACTICE_KINDS.ORDERED_SEQUENCE) {
    const reversed = [...expected.itemIds].reverse();
    if (reversed.every((itemId, index) => itemId === expected.itemIds[index])) {
      [reversed[0], reversed[1]] = [reversed[1], reversed[0]];
    }
    return { kind: expected.kind, itemIds: reversed };
  }

  const alternative = step.response.options.find(({ id }) => id !== expected.optionId);
  return alternative
    ? { kind: expected.kind, optionId: alternative.id }
    : null;
}

test("Learning Contract V1 pilot set remains exactly the #314 representative coverage set", () => {
  assert.deepEqual(PILOT_IDS, EXPECTED_PILOT_IDS);
  assert.equal(new Set(PILOT_IDS).size, PILOT_IDS.length);
});

for (const learningUnitId of PILOT_IDS) {
  test(`Learning Contract V1 pilot closes the authoring loop for ${learningUnitId}`, () => {
    const flow = getSingleLearningFlowDefinition(learningUnitId);
    const concept = getConceptModelForLearningUnit(learningUnitId);
    const guided = getGuidedActivityDefinition(learningUnitId);
    const questions = getCanonicalAssessmentQuestions(learningUnitId);

    assert.ok(flow);
    assert.ok(concept);
    assert.ok(guided);

    // One identity across every authoring surface.
    assert.equal(flow.learningUnitId, learningUnitId);
    assert.equal(concept.learningUnitId, learningUnitId);
    assert.equal(guided.learningUnitId, learningUnitId);
    assert.ok(questions.every((question) => question.learningUnitId === learningUnitId));

    // Objective and scope are explicit.
    for (const [field, value] of Object.entries({
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
      understandHint: flow.stageHints?.understand,
      practiceHint: flow.stageHints?.practice,
      verifyHint: flow.stageHints?.verify,
    })) {
      assert.ok(isNonBlank(value), `${learningUnitId}: blank flow field ${field}`);
    }

    // Understand has mechanism + real code embodiment + misconceptions.
    assert.ok(Number.isInteger(concept.version) && concept.version >= 1);
    assert.ok(Array.isArray(concept.mechanismMap) && concept.mechanismMap.length > 0);
    assert.ok(Array.isArray(concept.codeEvidence) && concept.codeEvidence.length >= 2);
    assert.equal(
      new Set(concept.codeEvidence.map(({ id }) => id)).size,
      concept.codeEvidence.length,
      `${learningUnitId}: duplicate codeEvidence id`,
    );

    for (const evidence of concept.codeEvidence) {
      assert.ok(isNonBlank(evidence.id));
      assert.ok(isNonBlank(evidence.title));
      assert.ok(isNonBlank(evidence.explanation));
      assert.equal(evidence.sourceRef?.kind, "source");
      assert.ok(isNonBlank(evidence.sourceRef?.fileName));
      assert.ok(Number.isInteger(evidence.sourceRef?.startLine) && evidence.sourceRef.startLine >= 1);
      assert.ok(Number.isInteger(evidence.sourceRef?.endLine) && evidence.sourceRef.endLine >= evidence.sourceRef.startLine);
    }

    const misconceptionEntries = Object.entries(concept.misconceptions ?? {});
    assert.ok(misconceptionEntries.length > 0);
    for (const [misconceptionId, misconception] of misconceptionEntries) {
      assert.equal(misconception.id, misconceptionId);
      assert.ok(isNonBlank(misconception.title));
      assert.ok(isNonBlank(misconception.diagnosis));
      assert.ok(isNonBlank(misconception.counterEvidence));
      assert.ok(isNonBlank(misconception.experiment));
    }

    // Practice is already deterministic under the shared Guided contract.
    assert.deepEqual(validateGuidedActivityDefinition(guided), { valid: true, errors: [] });
    assert.deepEqual(
      guided.steps.map(({ type }) => type),
      ["predict", "experiment", "explain", "practice", "review"],
    );

    const practice = getPracticeStep(guided);
    assert.ok(isNonBlank(practice?.codeContext?.code), `${learningUnitId}: missing Practice code transfer`);

    const expectedPractice = getExpectedGuidedPracticeResponse(practice);
    const correctOutcome = evaluateGuidedPracticeResponse(practice, expectedPractice);
    assert.equal(correctOutcome?.correct, true, `${learningUnitId}: expected Practice response must evaluate true`);

    const incorrectPractice = getIncorrectPracticeResponse(practice);
    const incorrectOutcome = evaluateGuidedPracticeResponse(practice, incorrectPractice);
    assert.equal(incorrectOutcome?.correct, false, `${learningUnitId}: Practice must expose an incorrect deterministic alternative`);

    // Verify owns a stable deterministic set plus unfamiliar-code transfer and misconception links.
    assert.equal(questions.length, 5);
    assert.ok(questions.every(({ revision }) => Number.isInteger(revision) && revision >= 1));
    assert.ok(
      questions.some((question) => isNonBlank(question.content?.codeContext?.code)),
      `${learningUnitId}: Verify needs unfamiliar-code transfer`,
    );

    let diagnosticMappingCount = 0;
    for (const question of questions) {
      const optionIds = new Set(question.content.options.map(({ id }) => id));
      const mapping = question.content.diagnosticOptionMap ?? {};
      for (const [optionId, misconceptionId] of Object.entries(mapping)) {
        diagnosticMappingCount += 1;
        assert.ok(optionIds.has(optionId));
        assert.notEqual(optionId, question.content.correctOptionId);
        assert.ok(
          getMisconceptionForLearningUnit(learningUnitId, misconceptionId),
          `${learningUnitId}: unresolved Verify misconception ${misconceptionId}`,
        );
      }
    }
    assert.ok(diagnosticMappingCount > 0, `${learningUnitId}: no diagnostic Verify mapping`);
  });
}

test("Learning Contract V1 keeps review and closure evidence deterministic and AI-independent", async () => {
  assert.deepEqual(createLearningReviewProjection(), {
    needsReview: false,
    assessmentIncorrectCount: 0,
    guidedNeedsReview: false,
    reasons: [],
  });

  const assessmentReview = createLearningReviewProjection({
    assessmentReview: { review: { incorrectCount: 1 } },
  });
  assert.equal(assessmentReview.needsReview, true);
  assert.equal(assessmentReview.assessmentIncorrectCount, 1);

  const guidedReview = createLearningReviewProjection({ guidedNeedsReview: true });
  assert.equal(guidedReview.needsReview, true);
  assert.equal(guidedReview.guidedNeedsReview, true);

  for (const projection of [assessmentReview, guidedReview]) {
    assert.equal("score" in projection, false);
    assert.equal("mastery" in projection, false);
    assert.equal("ai" in projection, false);
  }

  const flowSource = await readFile(
    new URL("../src/learning-flow/SingleLearningFlow.jsx", import.meta.url),
    "utf8",
  );

  assert.match(flowSource, /verificationSession\?\.status === "completed"/);
  assert.match(flowSource, /createLearningReviewProjection\(\{\s*assessmentReview,\s*guidedNeedsReview,/);
  assert.equal(flowSource.includes("aiReviewTarget"), false);
});
