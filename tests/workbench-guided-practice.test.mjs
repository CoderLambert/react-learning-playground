import assert from "node:assert/strict";
import test from "node:test";

import {
  areGuidedPracticeResponsesEqual,
  evaluateGuidedPracticeResponse,
  getInitialGuidedPracticeDraft,
  GUIDED_PRACTICE_KINDS,
  isGuidedPracticeResponseValidForStep,
  normalizeGuidedPracticeResponse,
} from "../src/workbench/guidedPractice.js";

const patchStep = {
  response: {
    kind: GUIDED_PRACTICE_KINDS.PATCH_CHOICE,
    options: [
      { id: "patch-good", label: "最小正确修复", patch: "- bad()\n+ good()" },
      { id: "patch-wrong", label: "错误修复", patch: "- bad()\n+ alsoBad()" },
    ],
  },
  reveal: {
    expectedOptionId: "patch-good",
    observation: "只需要替换错误责任边界。",
  },
};

const sequenceStep = {
  response: {
    kind: GUIDED_PRACTICE_KINDS.ORDERED_SEQUENCE,
    items: [
      { id: "cleanup", label: "cleanup old sync" },
      { id: "setup", label: "setup new sync" },
      { id: "change", label: "dependency changes" },
    ],
  },
  reveal: {
    expectedOrder: ["change", "cleanup", "setup"],
    observation: "依赖变化后先清理旧同步，再建立新同步。",
  },
};

test("legacy choice ids normalize into an explicit discriminated response", () => {
  assert.deepEqual(normalizeGuidedPracticeResponse("answer-a"), {
    kind: GUIDED_PRACTICE_KINDS.CHOICE,
    optionId: "answer-a",
  });
});

test("patch-choice evaluation compares stable option ids and preserves patch evidence", () => {
  const response = {
    kind: GUIDED_PRACTICE_KINDS.PATCH_CHOICE,
    optionId: "patch-wrong",
  };
  const outcome = evaluateGuidedPracticeResponse(patchStep, response);

  assert.equal(outcome.correct, false);
  assert.equal(outcome.response.optionId, "patch-wrong");
  assert.match(outcome.response.patch, /alsoBad/);
  assert.equal(outcome.expected.optionId, "patch-good");
  assert.match(outcome.expected.patch, /good/);
  assert.match(outcome.rationale, /责任边界/);
});

test("ordered-sequence requires one complete permutation of stable item ids", () => {
  const initial = getInitialGuidedPracticeDraft(sequenceStep);
  assert.deepEqual(initial.itemIds, ["cleanup", "setup", "change"]);
  assert.equal(isGuidedPracticeResponseValidForStep(sequenceStep, initial, { allowNull: false }), true);

  assert.equal(isGuidedPracticeResponseValidForStep(sequenceStep, {
    kind: GUIDED_PRACTICE_KINDS.ORDERED_SEQUENCE,
    itemIds: ["change", "cleanup"],
  }, { allowNull: false }), false);

  assert.equal(isGuidedPracticeResponseValidForStep(sequenceStep, {
    kind: GUIDED_PRACTICE_KINDS.ORDERED_SEQUENCE,
    itemIds: ["change", "cleanup", "cleanup"],
  }, { allowNull: false }), false);

  assert.equal(isGuidedPracticeResponseValidForStep(sequenceStep, {
    kind: GUIDED_PRACTICE_KINDS.ORDERED_SEQUENCE,
    itemIds: ["change", "cleanup", "unknown"],
  }, { allowNull: false }), false);
});

test("ordered-sequence correctness uses ids rather than display strings", () => {
  const response = {
    kind: GUIDED_PRACTICE_KINDS.ORDERED_SEQUENCE,
    itemIds: ["change", "cleanup", "setup"],
  };
  const outcome = evaluateGuidedPracticeResponse(sequenceStep, response);

  assert.equal(outcome.correct, true);
  assert.deepEqual(outcome.response.itemIds, ["change", "cleanup", "setup"]);
  assert.deepEqual(outcome.expected.itemIds, ["change", "cleanup", "setup"]);
  assert.equal(areGuidedPracticeResponsesEqual(response, outcome.expected), true);
});
