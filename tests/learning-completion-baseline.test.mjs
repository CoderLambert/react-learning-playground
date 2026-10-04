import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { createLearningReviewProjection } from "../src/learning-flow/learningReviewProjection.js";
import {
  createGuidedFlowState,
  guidedFlowReducer,
  GUIDED_FLOW_ACTIONS,
  GUIDED_FLOW_STEP_INDEX,
} from "../src/workbench/guidedFlow.js";
import { getGuidedActivityDefinition } from "../src/workbench/guidedActivity.js";
import {
  GUIDED_PRACTICE_KINDS,
  evaluateGuidedPracticeResponse,
  getExpectedGuidedPracticeResponse,
} from "../src/workbench/guidedPractice.js";
import { projectGuidedEvidenceSlice } from "../src/learning-evidence/projection.js";

function getPracticeStep(definition) {
  return definition.steps.find((step) => step.type === "practice");
}

function getIncorrectResponse(step) {
  const expected = getExpectedGuidedPracticeResponse(step);
  if (expected.kind === GUIDED_PRACTICE_KINDS.ORDERED_SEQUENCE) {
    const itemIds = [...expected.itemIds].reverse();
    if (itemIds.every((id, index) => id === expected.itemIds[index])) {
      [itemIds[0], itemIds[1]] = [itemIds[1], itemIds[0]];
    }
    return { kind: expected.kind, itemIds };
  }
  const alternative = step.response.options.find(({ id }) => id !== expected.optionId);
  return { kind: expected.kind, optionId: alternative.id };
}

for (const learningUnitId of ["props", "render-commit"]) {
  test(`Guided lifecycle completion stays distinct from Practice correctness for ${learningUnitId}`, () => {
    const definition = getGuidedActivityDefinition(learningUnitId);
    const practice = getPracticeStep(definition);
    const incorrect = getIncorrectResponse(practice);
    const outcome = evaluateGuidedPracticeResponse(practice, incorrect);

    assert.equal(outcome.correct, false);

    const state = {
      ...createGuidedFlowState({
        learningUnitId,
        activityRevision: definition.revision,
      }),
      active: true,
      stepIndex: GUIDED_FLOW_STEP_INDEX.PRACTICE,
      firstPrediction: "baseline-prediction",
      experimentAcknowledged: true,
      explanation: "baseline explanation",
      explanationSubmitted: true,
      completionState: "in-progress",
    };

    const completed = guidedFlowReducer(state, {
      type: GUIDED_FLOW_ACTIONS.SUBMIT_PRACTICE,
      value: incorrect,
    });

    assert.equal(completed.completionState, "completed");
    assert.equal(completed.stepIndex, GUIDED_FLOW_STEP_INDEX.REVIEW);

    const evidence = projectGuidedEvidenceSlice({
      definition,
      snapshot: {
        learningUnitId,
        activityRevision: definition.revision,
        sessionStarted: true,
        sessionCompleted: true,
        practiceResponse: incorrect,
        needsReview: false,
        updatedAt: "2026-10-05T00:00:00.000Z",
      },
      practiceOutcome: outcome,
    });

    assert.equal(evidence.lifecycle.status, "completed");
    const practiceRecord = evidence.records.find((record) => record.kind === "guided-practice");
    assert.equal(practiceRecord.outcome.correct, false);
  });
}

test("lesson Review remains advisory and independent from the Verify completion gate", async () => {
  const clean = createLearningReviewProjection();
  const assessment = createLearningReviewProjection({
    assessmentReview: { review: { incorrectCount: 1 } },
  });
  const guided = createLearningReviewProjection({ guidedNeedsReview: true });

  assert.equal(clean.needsReview, false);
  assert.equal(assessment.needsReview, true);
  assert.equal(guided.needsReview, true);

  const flowSource = await readFile(
    new URL("../src/learning-flow/SingleLearningFlow.jsx", import.meta.url),
    "utf8",
  );

  assert.match(flowSource, /verificationSession\?\.status === "completed"/);
  assert.match(flowSource, /本节已验证，但还有需要复习的点/);
  assert.match(flowSource, /onClick=\{onContinue\}/);
  assert.doesNotMatch(flowSource, /disabled=\{needsReview\}/);
});

test("Single Learning Flow currently allows Guided Review to enter Verify without a correctness gate", async () => {
  const appSource = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");

  assert.match(
    appSource,
    /onContinue=\{\(\) => \{\s*onComplete\?\.\(\);\s*return true;\s*\}\}/,
  );
  assert.match(appSource, /canContinue\s*\n\s*presentation="practice"/);
  assert.match(appSource, /continueLabel="进入验证"/);
});

test("Assessment correction is local remediation and preserves the formal wrong result", async () => {
  const source = await readFile(
    new URL("../src/assessment/ui/AssessmentPracticePane.jsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /if \(!correctionActive\) \{\s*onSubmit\?\.\(/);
  assert.match(source, /const correct = evaluateQuestionAnswer\(question, displayAnswer\);/);
  assert.match(source, /第一次错误已经保留在本轮记录中/);
  assert.match(source, /这个步骤只检查心智模型，不改变本轮分数/);
});
