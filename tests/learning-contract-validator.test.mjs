import assert from "node:assert/strict";
import test from "node:test";

import {
  findDuplicateValues,
  validateLearningContractSnapshot,
} from "../scripts/learning-contract/validator.mjs";
import { fingerprintLearningContractSnapshot } from "../scripts/learning-contract/semanticReview.mjs";
import { LEARNING_CONTRACT_SEMANTIC_REVIEW_BASELINE } from "../scripts/learning-contract/semanticReviewBaseline.mjs";
import { REPRESENTATIVE_PILOT } from "../scripts/audit-learning-contract-baseline.mjs";
import {
  buildRepositoryLearningContractAudit,
  buildRepositorySemanticFingerprints,
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

  assert.equal(audit.summary.semanticReviewedUnits, 20);
  assert.equal(audit.summary.semanticReviewPendingUnits, 0);
  assert.equal(audit.summary.reviewRequiredCount, 0);

  for (const unit of audit.units) {
    assert.deepEqual(unit.errors, [], unit.learningUnitId + " should pass deterministic V1 validation");
    assert.equal(unit.semanticReviewed, true, unit.learningUnitId + " should match the reviewed semantic fingerprint");
    assert.equal(unit.semanticReview.status, "current");
    assert.deepEqual(unit.reviewRequired, []);
  }
});

test("coverage summary distinguishes deterministic validity from semantic review coverage", async () => {
  const coverage = createCoverageSummary(await buildRepositoryLearningContractAudit());

  assert.equal(coverage.totalUnits, 20);
  assert.equal(coverage.validUnits, 20);
  assert.equal(coverage.errorCount, 0);
  assert.equal(coverage.semanticReviewedUnits, 20);
  assert.equal(coverage.semanticReviewPendingUnits, 0);
  assert.equal(coverage.practiceKinds["patch-choice"], 19);
  assert.equal(coverage.practiceKinds["ordered-sequence"], 1);
  assert.deepEqual(coverage.categories, {
    components: 7,
    "render-model": 4,
    state: 7,
    effects: 2,
  });
});


test("current first-20 semantic fingerprints match the reviewed #317 baseline", async () => {
  const fingerprints = await buildRepositorySemanticFingerprints();

  assert.equal(Object.keys(fingerprints).length, 20);
  assert.equal(
    LEARNING_CONTRACT_SEMANTIC_REVIEW_BASELINE.contractVersion,
    "learning-contract-v1",
  );
  assert.deepEqual(
    fingerprints,
    LEARNING_CONTRACT_SEMANTIC_REVIEW_BASELINE.fingerprints,
  );
});

test("representative canary remains fully current under the reviewed semantic baseline", async () => {
  const audit = await buildRepositoryLearningContractAudit();
  const canaryIds = new Set(REPRESENTATIVE_PILOT.map(({ learningUnitId }) => learningUnitId));
  const canary = audit.units.filter(({ learningUnitId }) => canaryIds.has(learningUnitId));

  assert.equal(canary.length, REPRESENTATIVE_PILOT.length);
  for (const unit of canary) {
    assert.equal(unit.semanticReview.status, "current");
    assert.deepEqual(unit.errors, []);
    assert.deepEqual(unit.reviewRequired, []);
  }
});

test("semantic fingerprints change when a frozen teaching surface changes", () => {
  const cases = [
    {
      name: "flow objective",
      mutate: (fixture) => {
        fixture.flow.objective += " changed";
      },
    },
    {
      name: "actual source evidence",
      mutate: (fixture) => {
        fixture.sourceFiles["FixtureDemo.jsx"] += "\nconst changed = true;";
        fixture.concept.codeEvidence[1].sourceRef.endLine = 5;
      },
    },
    {
      name: "Guided Practice",
      mutate: (fixture) => {
        fixture.guided.steps[3].prompt += " changed";
      },
    },
    {
      name: "canonical Verify",
      mutate: (fixture) => {
        fixture.questions[0].content.prompt += " changed";
      },
    },
  ];

  for (const { name, mutate } of cases) {
    const fixture = createGoldenLearningContractFixture();
    const before = fingerprintLearningContractSnapshot(fixture);
    mutate(fixture);
    const after = fingerprintLearningContractSnapshot(fixture);
    assert.notEqual(after, before, name + " must invalidate semantic review");
  }
});
