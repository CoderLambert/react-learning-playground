import assert from "node:assert/strict";
import test from "node:test";

import {
  SINGLE_LEARNING_FLOW_UNIT_IDS,
  getSingleLearningFlowDefinition,
} from "../src/learning-flow/learningFlowRegistry.js";
import { getConceptModelForLearningUnit } from "../src/content/conceptModels.js";
import { getGuidedActivityDefinition } from "../src/workbench/guidedActivity.js";
import { getCanonicalAssessmentQuestions } from "../src/assessment/content/canonicalQuestions.js";

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
  }
});
