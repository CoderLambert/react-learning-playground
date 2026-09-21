import assert from "node:assert/strict";
import test from "node:test";

import {
  SINGLE_LEARNING_FLOW_UNIT_IDS,
  getSingleLearningFlowDefinition,
} from "../src/learning-flow/learningFlowRegistry.js";
import { getConceptModelForLearningUnit } from "../src/content/conceptModels.js";
import { getGuidedActivityDefinition } from "../src/workbench/guidedActivity.js";
import { getCanonicalAssessmentQuestions } from "../src/assessment/content/canonicalQuestions.js";

const VNEXT_CODE_TRANSFER_UNIT_IDS = new Set([
  "state-snapshot-queue",
  "rendering-lists-key",
]);

test("every Single Learning Flow unit has complete lesson-owned authoring assets", () => {
  assert.ok(SINGLE_LEARNING_FLOW_UNIT_IDS.length > 0);

  for (const learningUnitId of SINGLE_LEARNING_FLOW_UNIT_IDS) {
    const flow = getSingleLearningFlowDefinition(learningUnitId);
    const conceptModel = getConceptModelForLearningUnit(learningUnitId);
    const guidedActivity = getGuidedActivityDefinition(learningUnitId);
    const canonicalQuestions = getCanonicalAssessmentQuestions(learningUnitId);

    assert.equal(flow.learningUnitId, learningUnitId);
    assert.equal(conceptModel.learningUnitId, learningUnitId);
    assert.equal(guidedActivity.learningUnitId, learningUnitId);
    assert.equal(canonicalQuestions.length, 5);
    assert.ok(
      canonicalQuestions.every((question) => question.learningUnitId === learningUnitId),
      `${learningUnitId}: canonical question learningUnitId mismatch`,
    );

    if (VNEXT_CODE_TRANSFER_UNIT_IDS.has(learningUnitId)) {
      assert.ok(conceptModel.codeEvidence?.length >= 2, `${learningUnitId}: missing Understand code evidence`);
      assert.ok(guidedActivity.steps[3].codeContext?.code, `${learningUnitId}: missing Practice code context`);
      const transferQuestions = canonicalQuestions.filter((question) => question.content?.codeContext?.code);
      assert.ok(transferQuestions.length >= 1, `${learningUnitId}: missing Verify code transfer question`);
      assert.ok(
        transferQuestions.every((question) => question.revision > 1),
        `${learningUnitId}: material transfer question changes must advance revision`,
      );
    } else {
      assert.equal(conceptModel.codeEvidence, undefined, `${learningUnitId}: VNext prototype expanded unexpectedly`);
      assert.equal(guidedActivity.steps[3].codeContext, undefined, `${learningUnitId}: VNext Practice expanded unexpectedly`);
      assert.equal(
        canonicalQuestions.some((question) => question.content?.codeContext),
        false,
        `${learningUnitId}: VNext Verify expanded unexpectedly`,
      );
    }
  }
});
