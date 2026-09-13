import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const paneSource = await readFile(new URL("../src/assessment/ui/AssessmentPane.jsx", import.meta.url), "utf8");
const practiceSource = await readFile(new URL("../src/assessment/ui/AssessmentPracticePane.jsx", import.meta.url), "utf8");

test("Assessment start is single-flight at the visible action boundary", () => {
  assert.match(paneSource, /if \(starting\) return;/);
  assert.match(paneSource, /setStarting\(true\)/);
  assert.match(paneSource, /setStarting\(false\)/);
  assert.match(practiceSource, /disabled=\{starting\}/);
  assert.match(practiceSource, /正在开始…/);
});

test("start failure is presented as retryable infrastructure state, not grading feedback", () => {
  assert.match(paneSource, /startError=/);
  assert.match(paneSource, /feedback=\{session \? props\.feedback : null\}/);
  assert.match(practiceSource, /开始评测失败，可重试/);
  assert.match(practiceSource, /role="alert"/);
});
