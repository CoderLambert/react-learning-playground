import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  classifyBrowserImpact,
  isDocumentationOnlyPath,
} from "../scripts/classify-browser-impact.mjs";

test("AI, Assessment and Workbench owner-local changes select DOMAIN tier", () => {
  for (const [file, domain] of [
    ["src/ai/useAiLearningAssistant.js", "ai"],
    ["src/assessment/application/useAssessmentApplication.js", "assessment"],
    ["src/workbench/WorkbenchShell.jsx", "workbench"],
  ]) {
    assert.deepEqual(classifyBrowserImpact([file]), {
      runBrowser: true,
      tier: "DOMAIN",
      domain,
      reason: `domain-local:${domain}`,
      triggeringPath: file,
    });
  }
});

test("shared, high-risk, unmapped domain and unknown runtime surfaces fail closed to FULL", () => {
  for (const file of [
    "src/App.jsx",
    "src/platform/storage.js",
    "src/learning-actions/promptBuilder.js",
    "src/source/sourceLocator.js",
    "src/new-runtime-domain/example.js",
    "build/source-locator-manifest.mjs",
    "tests/e2e/workbench-integration.spec.js",
    "playwright.config.js",
    "package.json",
    ".github/workflows/workbench-integration-verify.yml",
  ]) {
    const result = classifyBrowserImpact([file]);
    assert.equal(result.runBrowser, true, `${file} must trigger browser verification`);
    assert.equal(result.tier, "FULL", `${file} must conservatively use FULL`);
    assert.equal(result.domain, null);
  }
});

test("cross-domain changes fall back to FULL even when both domains have focused suites", () => {
  const result = classifyBrowserImpact([
    "src/ai/useAiLearningAssistant.js",
    "src/assessment/application/useAssessmentApplication.js",
  ]);

  assert.deepEqual(result, {
    runBrowser: true,
    tier: "FULL",
    domain: null,
    reason: "cross-domain-change-set",
    triggeringPath: "src/ai/useAiLearningAssistant.js",
  });
});

test("documentation-only changes keep the safe NONE fast path", () => {
  const files = [
    "README.md",
    "AGENTS.md",
    "issue-rule.md",
    "docs/execution/example.md",
    ".codex/agents/reviewer.md",
  ];

  assert.equal(files.every(isDocumentationOnlyPath), true);
  assert.deepEqual(classifyBrowserImpact(files), {
    runBrowser: false,
    tier: "NONE",
    domain: null,
    reason: "documentation-only",
    triggeringPath: null,
  });
});

test("documentation mixed with one mapped domain preserves DOMAIN tier", () => {
  const result = classifyBrowserImpact([
    "docs/execution/example.md",
    "src/assessment/application/assessmentController.js",
  ]);

  assert.equal(result.runBrowser, true);
  assert.equal(result.tier, "DOMAIN");
  assert.equal(result.domain, "assessment");
});

test("empty or unavailable diff fails closed to FULL", () => {
  assert.deepEqual(classifyBrowserImpact([]), {
    runBrowser: true,
    tier: "FULL",
    domain: null,
    reason: "empty-or-unknown-change-set",
    triggeringPath: null,
  });
});

test("Workbench required workflow consumes tier and domain outputs without changing check identity", async () => {
  const workflow = await readFile(
    new URL("../.github/workflows/workbench-integration-verify.yml", import.meta.url),
    "utf8",
  );

  assert.match(workflow, /name: Workbench Integration Verify \/ verify/);
  assert.match(workflow, /node scripts\/classify-browser-impact\.mjs/);
  assert.match(workflow, /steps\.scope\.outputs\.run_browser == 'true'/);
  assert.match(workflow, /steps\.scope\.outputs\.browser_tier/);
  assert.match(workflow, /steps\.scope\.outputs\.browser_domain/);
  assert.match(workflow, /tests\/e2e\/app-shell\.spec\.js/);
  assert.match(workflow, /npm run test:e2e/);
  assert.doesNotMatch(workflow, /pull_request:\s*\n\s*paths:/);
});
