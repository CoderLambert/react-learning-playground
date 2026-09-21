import assert from "node:assert/strict";
import test from "node:test";

import { createLearningReviewProjection } from "../src/learning-flow/learningReviewProjection.js";

test("lesson review projection stays clear without Assessment or Guided evidence", () => {
  assert.deepEqual(createLearningReviewProjection(), {
    needsReview: false,
    assessmentIncorrectCount: 0,
    guidedNeedsReview: false,
    reasons: [],
  });
});

test("Assessment incorrect attempts produce factual lesson review evidence", () => {
  const projection = createLearningReviewProjection({
    assessmentReview: {
      review: { incorrectCount: 2 },
    },
  });

  assert.equal(projection.needsReview, true);
  assert.equal(projection.assessmentIncorrectCount, 2);
  assert.equal(projection.guidedNeedsReview, false);
  assert.deepEqual(projection.reasons, [
    { kind: "assessment-incorrect", incorrectCount: 2 },
  ]);
});

test("Guided needsReview produces lesson review evidence without inventing a score", () => {
  const projection = createLearningReviewProjection({
    guidedNeedsReview: true,
  });

  assert.equal(projection.needsReview, true);
  assert.equal(projection.assessmentIncorrectCount, 0);
  assert.equal(projection.guidedNeedsReview, true);
  assert.deepEqual(projection.reasons, [
    { kind: "guided-needs-review" },
  ]);
  assert.equal("score" in projection, false);
  assert.equal("mastery" in projection, false);
});

test("Assessment and Guided evidence remain distinct when both require review", () => {
  const projection = createLearningReviewProjection({
    assessmentReview: {
      history: [{ incorrectCount: 1 }],
    },
    guidedNeedsReview: true,
  });

  assert.equal(projection.needsReview, true);
  assert.equal(projection.assessmentIncorrectCount, 1);
  assert.equal(projection.guidedNeedsReview, true);
  assert.deepEqual(projection.reasons, [
    { kind: "assessment-incorrect", incorrectCount: 1 },
    { kind: "guided-needs-review" },
  ]);
});
