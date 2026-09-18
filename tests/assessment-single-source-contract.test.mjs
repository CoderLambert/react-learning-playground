import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readSource = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("chapter checkpoint no longer exposes an editable localStorage question bank", async () => {
  const source = await readSource("src/assessment/QuestionBankManager.jsx");

  assert.match(source, /章节学习检查（只读）/);
  assert.match(source, /Assessment 面板/);
  assert.match(source, /data-legacy-checkpoint-readonly/);

  assert.doesNotMatch(source, /createQuestionBankRepository/);
  assert.doesNotMatch(source, /repository\.(load|save|setOverride|upsertCustom|deleteCustom|setOrder)/);
  assert.doesNotMatch(source, /AssessmentRunner/);
  assert.doesNotMatch(source, />新增</);
  assert.doesNotMatch(source, />编辑</);
  assert.doesNotMatch(source, />删除</);
});

const RETIRED_ASSESSMENT_MODULES = [
  "src/assessment/AssessmentRunner.jsx",
  "src/assessment/practiceAttempt.js",
  "src/assessment/attemptRepository.js",
  "src/assessment/questionBank.js",
];

test("legacy chapter checkpoint content remains available as read-only study prompts", async () => {
  const source = await readSource("src/components/ChapterCheckpoint.jsx");
  const compatibilityRenderer = await readSource("src/assessment/QuestionBankManager.jsx");

  assert.match(source, /学习检查/);
  assert.match(source, /questions:/);
  assert.match(source, /exercises:/);
  assert.match(compatibilityRenderer, /checkpoint\?\.questions/);
  assert.match(compatibilityRenderer, /checkpoint\?\.exercises/);
});

test("retired runner, question-bank, and attempt-persistence modules stay absent", () => {
  for (const modulePath of RETIRED_ASSESSMENT_MODULES) {
    assert.equal(existsSync(new URL(`../${modulePath}`, import.meta.url)), false, modulePath);
  }
});

test("worker documentation no longer claims a browser 6000-character output cap", async () => {
  const source = await readSource("worker/deepseek-assistant/README.md");

  assert.doesNotMatch(source, /enforces the product limit of 6000 Unicode characters/);
  assert.match(source, /does not apply a separate 6000-character truncation limit/);
});
