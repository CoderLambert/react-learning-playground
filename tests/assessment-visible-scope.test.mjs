import test from "node:test";
import assert from "node:assert/strict";
import { selectAssessmentQuestionsForLearningUnit } from "../src/assessment/ui/assessmentScope.js";

test("assessment visible scope fails closed when the query snapshot belongs to another learning unit", () => {
  const staleSnapshot = {
    learningUnitId: "unit-a",
    questions: [{ id: "a-1" }],
  };

  assert.deepEqual(selectAssessmentQuestionsForLearningUnit(staleSnapshot, "unit-b"), []);
  assert.deepEqual(selectAssessmentQuestionsForLearningUnit(staleSnapshot, "unit-a"), [{ id: "a-1" }]);
});

test("assessment visible scope treats missing or malformed snapshots as empty", () => {
  assert.deepEqual(selectAssessmentQuestionsForLearningUnit(null, "unit-a"), []);
  assert.deepEqual(selectAssessmentQuestionsForLearningUnit({ learningUnitId: "unit-a" }, "unit-a"), []);
});
