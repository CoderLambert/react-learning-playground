import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const appSource = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const practiceSource = await readFile(new URL("../src/assessment/ui/AssessmentPracticePane.jsx", import.meta.url), "utf8");

test("Assessment start is single-flight at the visible action boundary", () => {
  assert.match(appSource, /assessmentStartingRef\.current/);
  assert.match(appSource, /setAssessmentStarting\(true\)/);
  assert.match(appSource, /setAssessmentStarting\(false\)/);
  assert.match(practiceSource, /disabled=\{starting\}/);
  assert.match(practiceSource, /正在开始…/);
});

test("start failure is presented as retryable infrastructure state, not grading feedback", () => {
  assert.match(appSource, /assessmentStartError/);
  assert.match(appSource, /setAssessmentStartError\(error\?\.message \|\| "无法开始评测"\)/);
  assert.match(appSource, /setAssessmentFeedback\(null\)/);
  assert.match(practiceSource, /开始评测失败，可重试/);
  assert.match(practiceSource, /role="alert"/);
});
