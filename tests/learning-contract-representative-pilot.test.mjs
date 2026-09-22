import assert from "node:assert/strict";
import test from "node:test";

import { REPRESENTATIVE_PILOT } from "../scripts/audit-learning-contract-baseline.mjs";
import {
  getSingleLearningFlowDefinition,
} from "../src/learning-flow/learningFlowRegistry.js";
import {
  getConceptModelForLearningUnit,
  getMisconceptionForLearningUnit,
} from "../src/content/conceptModels.js";
import { getGuidedActivityDefinition } from "../src/workbench/guidedActivity.js";
import {
  GUIDED_FLOW_ACTIONS,
  createGuidedFlowState,
  guidedFlowReducer,
} from "../src/workbench/guidedFlow.js";
import {
  GUIDED_PRACTICE_KINDS,
  evaluateGuidedPracticeResponse,
  getExpectedGuidedPracticeResponse,
} from "../src/workbench/guidedPractice.js";
import { getGuidedReviewModel } from "../src/workbench/guidedReview.js";
import { getCanonicalAssessmentQuestions } from "../src/assessment/content/canonicalQuestions.js";
import { evaluateQuestionAnswer } from "../src/assessment/domain/attempt.js";
import { createLearningReviewProjection } from "../src/learning-flow/learningReviewProjection.js";

const PILOT_IDS = REPRESENTATIVE_PILOT.map(({ learningUnitId }) => learningUnitId);
const SUPPORTED_PRACTICE_KINDS = new Set(Object.values(GUIDED_PRACTICE_KINDS));

function practiceStep(definition) {
  return definition.steps.find((step) => step.type === "practice");
}

function wrongPracticeResponse(step) {
  const expected = getExpectedGuidedPracticeResponse(step);
  assert.ok(expected, `${step.id}: missing expected Practice response`);

  if (expected.kind === GUIDED_PRACTICE_KINDS.ORDERED_SEQUENCE) {
    assert.ok(expected.itemIds.length >= 2, `${step.id}: ordered sequence needs at least two items`);
    return {
      kind: expected.kind,
      itemIds: [...expected.itemIds.slice(1), expected.itemIds[0]],
    };
  }

  const wrongOption = step.response.options.find(({ id }) => id !== expected.optionId);
  assert.ok(wrongOption, `${step.id}: no incorrect Practice option available`);
  return { kind: expected.kind, optionId: wrongOption.id };
}

function driveGuidedToReview(definition, response, initialState = null) {
  let state = initialState ?? createGuidedFlowState({
    learningUnitId: definition.learningUnitId,
    activityRevision: definition.revision,
  });

  const prediction = definition.steps.find((step) => step.type === "predict");
  assert.ok(prediction?.response?.options?.length > 0);

  for (const action of [
    { type: GUIDED_FLOW_ACTIONS.START },
    { type: GUIDED_FLOW_ACTIONS.SET_PREDICTION_DRAFT, value: prediction.response.options[0].id },
    { type: GUIDED_FLOW_ACTIONS.SUBMIT_PREDICTION },
    {
      type: GUIDED_FLOW_ACTIONS.ACKNOWLEDGE_EXPERIMENT,
      observation: definition.steps.find((step) => step.type === "experiment")?.expectedObservation,
    },
    { type: GUIDED_FLOW_ACTIONS.SET_EXPLANATION, value: "pilot explanation" },
    { type: GUIDED_FLOW_ACTIONS.SUBMIT_EXPLANATION },
    { type: GUIDED_FLOW_ACTIONS.SET_PRACTICE_DRAFT, value: response },
    { type: GUIDED_FLOW_ACTIONS.SUBMIT_PRACTICE },
  ]) {
    state = guidedFlowReducer(state, action);
  }

  return state;
}

test("candidate contract resolves one lesson identity across all representative authoring surfaces", () => {
  assert.equal(PILOT_IDS.length, 5);
  assert.equal(new Set(PILOT_IDS).size, PILOT_IDS.length);

  for (const learningUnitId of PILOT_IDS) {
    const flow = getSingleLearningFlowDefinition(learningUnitId);
    const concept = getConceptModelForLearningUnit(learningUnitId);
    const guided = getGuidedActivityDefinition(learningUnitId);
    const questions = getCanonicalAssessmentQuestions(learningUnitId);

    assert.ok(flow, `${learningUnitId}: missing Single Learning Flow`);
    assert.equal(flow.learningUnitId, learningUnitId);
    assert.equal(flow.conceptModel?.learningUnitId, learningUnitId);
    assert.equal(concept?.learningUnitId, learningUnitId);
    assert.equal(guided?.learningUnitId, learningUnitId);
    assert.ok(questions.every((question) => question.learningUnitId === learningUnitId));

    for (const field of ["objective", "coreModelTitle", "mentalModel", "decisionRule", "aiReviewTarget"]) {
      assert.equal(typeof flow[field], "string", `${learningUnitId}: missing ${field}`);
      assert.ok(flow[field].trim(), `${learningUnitId}: blank ${field}`);
    }

    assert.ok(concept.codeEvidence?.length >= 2, `${learningUnitId}: missing Understand code evidence`);
    assert.ok(concept.mechanismMap?.length > 0, `${learningUnitId}: missing mechanism map`);
    assert.ok(concept.contrastCases?.length > 0, `${learningUnitId}: missing contrast cases`);
    assert.ok(Object.keys(concept.misconceptions ?? {}).length > 0, `${learningUnitId}: missing misconceptions`);
  }
});

test("candidate contract preserves deterministic Practice outcome and whole-session retry across every pilot", () => {
  for (const learningUnitId of PILOT_IDS) {
    const guided = getGuidedActivityDefinition(learningUnitId);
    const step = practiceStep(guided);

    assert.ok(step, `${learningUnitId}: missing Practice step`);
    assert.ok(SUPPORTED_PRACTICE_KINDS.has(step.response.kind), `${learningUnitId}: unsupported Practice kind`);
    assert.ok(step.codeContext?.code?.trim(), `${learningUnitId}: missing Practice code context`);

    const wrong = wrongPracticeResponse(step);
    const wrongOutcome = evaluateGuidedPracticeResponse(step, wrong);
    assert.equal(wrongOutcome?.correct, false, `${learningUnitId}: wrong Practice fixture was not wrong`);

    const wrongState = driveGuidedToReview(guided, wrong);
    const wrongReview = getGuidedReviewModel(wrongState, guided);
    assert.equal(wrongState.completionState, "completed");
    assert.equal(wrongReview?.practiceOutcome?.correct, false);

    const retryState = guidedFlowReducer(wrongState, { type: GUIDED_FLOW_ACTIONS.START_OVER });
    assert.equal(retryState.active, true);
    assert.equal(retryState.completionState, "in-progress");
    assert.equal(retryState.practiceResponse, null);
    assert.equal(retryState.firstPrediction, null);

    const expected = getExpectedGuidedPracticeResponse(step);
    const correctOutcome = evaluateGuidedPracticeResponse(step, expected);
    assert.equal(correctOutcome?.correct, true, `${learningUnitId}: expected Practice response is not correct`);

    const correctedState = driveGuidedToReview(guided, expected, retryState);
    const correctedReview = getGuidedReviewModel(correctedState, guided);
    assert.equal(correctedReview?.practiceOutcome?.correct, true);
    assert.equal("mastery" in correctedReview, false);
  }
});

test("candidate contract gives every pilot deterministic Verify transfer and resolvable misconception correction", () => {
  for (const learningUnitId of PILOT_IDS) {
    const questions = getCanonicalAssessmentQuestions(learningUnitId);

    assert.equal(questions.length, 5, `${learningUnitId}: Verify must own five canonical questions`);
    assert.ok(
      questions.some((question) => question.content?.codeContext?.code?.trim()),
      `${learningUnitId}: missing unfamiliar-code Verify transfer`,
    );

    for (const question of questions) {
      assert.equal(question.provenance?.source, "canonical");
      assert.ok(question.evidenceRefs?.length > 0, `${question.id}: missing evidence refs`);

      const diagnosticMap = question.content?.diagnosticOptionMap ?? {};
      for (const [optionId, misconceptionId] of Object.entries(diagnosticMap)) {
        assert.notEqual(optionId, question.content.correctOptionId);
        assert.ok(question.content.options.some((option) => option.id === optionId));
        assert.ok(
          getMisconceptionForLearningUnit(learningUnitId, misconceptionId),
          `${question.id}: unresolved misconception ${misconceptionId}`,
        );
      }
    }

    const diagnosticQuestion = questions.find(
      (question) => Object.keys(question.content?.diagnosticOptionMap ?? {}).length > 0,
    );
    assert.ok(diagnosticQuestion, `${learningUnitId}: no diagnostic Verify question`);

    const wrongOptionId = Object.keys(diagnosticQuestion.content.diagnosticOptionMap)[0];
    assert.equal(evaluateQuestionAnswer(diagnosticQuestion, wrongOptionId), false);
    assert.equal(
      evaluateQuestionAnswer(diagnosticQuestion, diagnosticQuestion.content.correctOptionId),
      true,
    );
  }
});

test("candidate contract keeps review/verification closure factual and AI-optional", () => {
  for (const learningUnitId of PILOT_IDS) {
    const flow = getSingleLearningFlowDefinition(learningUnitId);

    assert.ok(flow.aiReviewTarget.trim(), `${learningUnitId}: AI review scope target missing`);

    const clear = createLearningReviewProjection({
      assessmentReview: { review: { incorrectCount: 0 } },
      guidedNeedsReview: false,
    });
    assert.equal(clear.needsReview, false);

    const assessmentNeedsReview = createLearningReviewProjection({
      assessmentReview: { review: { incorrectCount: 1 } },
      guidedNeedsReview: false,
    });
    assert.equal(assessmentNeedsReview.needsReview, true);
    assert.equal(assessmentNeedsReview.assessmentIncorrectCount, 1);

    const guidedNeedsReview = createLearningReviewProjection({
      assessmentReview: { review: { incorrectCount: 0 } },
      guidedNeedsReview: true,
    });
    assert.equal(guidedNeedsReview.needsReview, true);
    assert.equal(guidedNeedsReview.guidedNeedsReview, true);

    for (const projection of [clear, assessmentNeedsReview, guidedNeedsReview]) {
      assert.equal("mastery" in projection, false);
      assert.equal("score" in projection, false);
    }
  }
});
