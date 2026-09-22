import assert from "node:assert/strict";
import test from "node:test";

import { buildLearningContractBaselineReport } from "../scripts/audit-learning-contract-baseline.mjs";

test("Learning Contract baseline inventory derives the first 20 from authoritative authoring surfaces", async () => {
  const report = await buildLearningContractBaselineReport();

  assert.equal(report.authoringBaselineSha, "3b0d002289fdfb3d0921825f6e5d87d0f1658ef3");
  assert.equal(report.scope.authoritativeRegistry, "src/demos/index.js");
  assert.equal(report.scope.first20Count, 20);
  assert.equal(report.units.length, 20);
  assert.equal(new Set(report.scope.first20Ids).size, 20);

  assert.deepEqual(report.summary.duplicateDemoIds, []);
  assert.deepEqual(report.summary.duplicateFlowIds, []);
  assert.equal(report.summary.completeUnits, 20);
  assert.deepEqual(report.summary.incompleteUnits, []);

  for (const unit of report.units) {
    assert.equal(unit.complete, true, `${unit.id}: baseline contract incomplete`);
    assert.deepEqual(unit.missing, [], `${unit.id}: unexpected baseline gaps`);
    assert.ok(unit.codeEvidenceCount >= 2, `${unit.id}: missing Understand code evidence`);
    assert.ok(unit.misconceptionCount >= 1, `${unit.id}: missing misconception model`);
    assert.equal(unit.practiceHasCodeContext, true, `${unit.id}: missing Practice code context`);
    assert.equal(unit.verifyQuestionCount, 5, `${unit.id}: unexpected Verify question count`);
    assert.ok(unit.verifyTransferQuestionCount >= 1, `${unit.id}: missing Verify transfer`);
    assert.equal(unit.aiReviewTargetPresent, true, `${unit.id}: missing AI closure target`);
  }
});

test("representative baseline pilot covers every current Practice kind and all first-20 categories", async () => {
  const report = await buildLearningContractBaselineReport();
  const pilot = report.representativePilot;

  assert.equal(pilot.length, 5);
  assert.ok(pilot.every(({ complete }) => complete));

  for (const practiceKind of Object.keys(report.summary.practiceKinds)) {
    assert.ok(
      pilot.some((selection) => selection.practiceKind === practiceKind),
      `pilot set does not cover Practice kind: ${practiceKind}`,
    );
  }

  for (const category of Object.keys(report.summary.categories)) {
    assert.ok(
      pilot.some((selection) => selection.category === category),
      `pilot set does not cover first-20 category: ${category}`,
    );
  }

  assert.deepEqual(
    new Set(pilot.map(({ learningUnitId }) => learningUnitId)).size,
    pilot.length,
  );
});
