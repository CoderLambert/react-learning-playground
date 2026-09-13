import test from "node:test";
import assert from "node:assert/strict";
import {
  createAssessmentOperationToken,
  isAssessmentOperationCurrent,
} from "../src/assessment/ui/assessmentOperationOwnership.js";

test("assessment operation ownership rejects stale learning-unit generations", () => {
  const token = createAssessmentOperationToken({
    generation: 4,
    learningUnitId: "unit-a",
    requestId: 8,
  });

  assert.equal(isAssessmentOperationCurrent(token, {
    generation: 4,
    learningUnitId: "unit-a",
    sessionId: null,
    requestId: 8,
  }), true);

  assert.equal(isAssessmentOperationCurrent(token, {
    generation: 5,
    learningUnitId: "unit-b",
    sessionId: null,
    requestId: 8,
  }), false);
});

test("assessment submit ownership rejects stale sessions and superseded requests", () => {
  const token = createAssessmentOperationToken({
    generation: 9,
    learningUnitId: "unit-a",
    sessionId: "session-a",
    requestId: 3,
  });

  assert.equal(isAssessmentOperationCurrent(token, {
    generation: 9,
    learningUnitId: "unit-a",
    sessionId: "session-b",
    requestId: 3,
  }), false);

  assert.equal(isAssessmentOperationCurrent(token, {
    generation: 9,
    learningUnitId: "unit-a",
    sessionId: "session-a",
    requestId: 4,
  }), false);
});
