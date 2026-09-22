import assert from "node:assert/strict";
import test from "node:test";

import {
  findDuplicateValues,
  validateLearningContractSnapshot,
} from "../scripts/learning-contract/validator.mjs";
import {
  buildRepositoryLearningContractAudit,
  createCoverageSummary,
} from "../scripts/learning-contract/repository.mjs";
import {
  createGoldenLearningContractFixture,
  createInvalidLearningContractFixture,
} from "./fixtures/learning-contract/golden.mjs";

function codes(items) {
  return items.map(({ code }) => code);
}

test("golden Learning Contract fixture passes deterministic V1 validation", () => {
  const result = validateLearningContractSnapshot(
    createGoldenLearningContractFixture(),
    { semanticReviewed: true },
  );

  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.warnings, []);
  assert.deepEqual(result.reviewRequired, []);
});

test("unreviewed semantic alignment is review_required, not a structural failure", () => {
  const result = validateLearningContractSnapshot(createGoldenLearningContractFixture());

  assert.deepEqual(result.errors, []);
  assert.equal(result.reviewRequired.length, 1);
  assert.deepEqual(codes(result.reviewRequired), ["SEMANTIC_ALIGNMENT_REVIEW"]);
});

test("golden invalid fixtures fail for the intended contract reason", () => {
  const cases = [
    ["identity", "IDENTITY_MISMATCH"],
    ["source-range", "SOURCE_RANGE_INVALID"],
    ["practice", "GUIDED_INVALID"],
    ["verify-misconception", "VERIFY_MISCONCEPTION_UNKNOWN"],
  ];

  for (const [fixtureKind, expectedCode] of cases) {
    const result = validateLearningContractSnapshot(
      createInvalidLearningContractFixture(fixtureKind),
      { semanticReviewed: true },
    );
    assert.ok(
      codes(result.errors).includes(expectedCode),
      fixtureKind + " should fail with " + expectedCode + "; got " + codes(result.errors).join(", "),
    );
  }
});

test("optional authoring is reported as warning without failing V1", () => {
  const result = validateLearningContractSnapshot(
    createInvalidLearningContractFixture("optional-contrast"),
    { semanticReviewed: true },
  );

  assert.deepEqual(result.errors, []);
  assert.deepEqual(codes(result.warnings), ["OPTIONAL_CONTRAST_MISSING"]);
});

test("duplicate ownership helper reports stable duplicate ids", () => {
  assert.deepEqual(
    findDuplicateValues(["lesson-a", "lesson-b", "lesson-a", "lesson-c", "lesson-b"]),
    ["lesson-a", "lesson-b"],
  );
});

test("repository adapter validates the authoritative first 20 without a second registry", async () => {
  const audit = await buildRepositoryLearningContractAudit();

  assert.equal(audit.scope.authoritativeRegistry, "src/demos/index.js");
  assert.equal(audit.scope.first20Ids.length, 20);
  assert.equal(new Set(audit.scope.first20Ids).size, 20);

  assert.equal(audit.summary.totalUnits, 20);
  assert.equal(audit.summary.validUnits, 20);
  assert.equal(audit.summary.errorCount, 0);
  assert.equal(audit.global.errors.length, 0);

  assert.equal(audit.summary.semanticReviewedUnits, 5);
  assert.equal(audit.summary.semanticReviewPendingUnits, 15);
  assert.equal(audit.summary.reviewRequiredCount, 15);

  for (const unit of audit.units) {
    assert.deepEqual(unit.errors, [], unit.learningUnitId + " should pass deterministic V1 validation");
    if (unit.semanticReviewed) {
      assert.deepEqual(unit.reviewRequired, []);
    } else {
      assert.deepEqual(codes(unit.reviewRequired), ["SEMANTIC_ALIGNMENT_REVIEW"]);
    }
  }
});

test("coverage summary distinguishes deterministic validity from semantic review coverage", async () => {
  const coverage = createCoverageSummary(await buildRepositoryLearningContractAudit());

  assert.equal(coverage.totalUnits, 20);
  assert.equal(coverage.validUnits, 20);
  assert.equal(coverage.errorCount, 0);
  assert.equal(coverage.semanticReviewedUnits, 5);
  assert.equal(coverage.semanticReviewPendingUnits, 15);
  assert.equal(coverage.practiceKinds["patch-choice"], 19);
  assert.equal(coverage.practiceKinds["ordered-sequence"], 1);
  assert.deepEqual(coverage.categories, {
    components: 7,
    "render-model": 4,
    state: 7,
    effects: 2,
  });
});
