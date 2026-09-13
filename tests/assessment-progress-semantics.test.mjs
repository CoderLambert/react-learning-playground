import test from "node:test";
import assert from "node:assert/strict";
import {
  deriveAssessmentView,
  formatAssessmentPositionLabel,
  formatAssessmentProgress,
} from "../src/assessment/ui/assessmentViewModel.js";

function createSession(count = 2) {
  return {
    id: "session-1",
    items: Array.from({ length: count }, (_, index) => ({
      questionId: `q-${index + 1}`,
      revision: 1,
      snapshot: {
        id: `q-${index + 1}`,
        type: "true_false",
        content: { prompt: `Question ${index + 1}`, correct: true, explanation: "" },
      },
    })),
  };
}

test("assessment progress is explicitly labelled as question position, not completed work", () => {
  const first = deriveAssessmentView({ session: createSession(), currentIndex: 0 });
  assert.equal(formatAssessmentProgress(first), "1 / 2");
  assert.equal(formatAssessmentPositionLabel(first), "当前第 1 题，共 2 题");
  assert.doesNotMatch(formatAssessmentPositionLabel(first), /已完成/);

  const second = deriveAssessmentView({ session: createSession(), currentIndex: 1 });
  assert.equal(formatAssessmentProgress(second), "2 / 2");
  assert.equal(formatAssessmentPositionLabel(second), "当前第 2 题，共 2 题");
  assert.doesNotMatch(formatAssessmentPositionLabel(second), /已完成/);
});

test("empty assessment position label does not imply completion", () => {
  const empty = deriveAssessmentView({ session: null });
  assert.equal(formatAssessmentPositionLabel(empty), "当前无评测题目");
});
