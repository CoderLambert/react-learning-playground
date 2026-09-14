import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

import {
  ALL_BROWSER_SUITES,
  CORE_BROWSER_SUITES,
  DOMAIN_BROWSER_SUITES,
  getBrowserSuiteSelection,
} from "../scripts/browser-verification-plan.mjs";
import {
  browserEvidenceLines,
  browserOutputLines,
  classifyBrowserImpact,
  isDocumentationOnlyPath,
} from "../scripts/classify-browser-impact.mjs";

function assertDecision(result, expected) {
  for (const [key, value] of Object.entries(expected)) {
    assert.deepEqual(result[key], value, `unexpected ${key}`);
  }
}

test("AI, Assessment and Workbench owner-local changes select DOMAIN tier", () => {
  for (const [file, domain] of [
    ["src/ai/useAiLearningAssistant.js", "ai"],
    ["src/assessment/application/useAssessmentApplication.js", "assessment"],
    ["src/workbench/WorkbenchShell.jsx", "workbench"],
  ]) {
    const result = classifyBrowserImpact([file]);
    assertDecision(result, {
      runBrowser: true,
      tier: "DOMAIN",
      domain,
      changedFiles: [file],
      detectedDomains: [domain],
      reason: `domain-local:${domain}`,
      fallbackReason: null,
      triggeringPath: file,
    });
    assert.ok(result.executedSuites.includes("tests/e2e/app-shell.spec.js"));
    assert.deepEqual(
      result.executedSuites,
      getBrowserSuiteSelection("DOMAIN", domain).executedSuites,
    );
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
    assert.equal(result.fallbackReason, result.reason);
    assert.deepEqual(result.executedSuites, ALL_BROWSER_SUITES);
    assert.deepEqual(result.skippedSuites, []);
  }
});

test("cross-domain changes fall back to FULL even when both domains have focused suites", () => {
  const result = classifyBrowserImpact([
    "src/ai/useAiLearningAssistant.js",
    "src/assessment/application/useAssessmentApplication.js",
  ]);

  assertDecision(result, {
    runBrowser: true,
    tier: "FULL",
    domain: null,
    changedFiles: [
      "src/ai/useAiLearningAssistant.js",
      "src/assessment/application/useAssessmentApplication.js",
    ],
    detectedDomains: ["ai", "assessment"],
    reason: "cross-domain-change-set",
    fallbackReason: "cross-domain-change-set",
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
  assertDecision(classifyBrowserImpact(files), {
    runBrowser: false,
    tier: "NONE",
    domain: null,
    changedFiles: [...files].sort(),
    detectedDomains: [],
    reason: "documentation-only",
    fallbackReason: null,
    triggeringPath: null,
    executedSuites: [],
    skippedSuites: ALL_BROWSER_SUITES,
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
  assertDecision(classifyBrowserImpact([]), {
    runBrowser: true,
    tier: "FULL",
    domain: null,
    changedFiles: [],
    detectedDomains: [],
    reason: "empty-or-unknown-change-set",
    fallbackReason: "empty-or-unknown-change-set",
    triggeringPath: null,
    executedSuites: ALL_BROWSER_SUITES,
    skippedSuites: [],
  });
});

test("classification is independent of changed-file ordering and duplicate paths", () => {
  const first = classifyBrowserImpact([
    "src/assessment/application/useAssessmentApplication.js",
    "src/ai/useAiLearningAssistant.js",
  ]);
  const second = classifyBrowserImpact([
    "./src/ai/useAiLearningAssistant.js",
    "src/assessment/application/useAssessmentApplication.js",
    "src/ai/useAiLearningAssistant.js",
  ]);

  assert.deepEqual(second, first);
});

test("every browser spec has exactly one explicit core or domain suite owner", async () => {
  const discoveredSuites = (await readdir(new URL("../tests/e2e/", import.meta.url)))
    .filter((file) => file.endsWith(".spec.js"))
    .map((file) => `tests/e2e/${file}`)
    .sort();
  const declaredSuites = [
    ...CORE_BROWSER_SUITES,
    ...Object.values(DOMAIN_BROWSER_SUITES).flat(),
  ];

  assert.equal(new Set(declaredSuites).size, declaredSuites.length, "suite ownership must be unique");
  assert.deepEqual([...declaredSuites].sort(), discoveredSuites);
  assert.deepEqual(ALL_BROWSER_SUITES, discoveredSuites);
});

test("classifier CLI emits complete machine and human-readable decision evidence", () => {
  const decision = classifyBrowserImpact(["src/App.jsx"]);
  const outputLines = browserOutputLines(decision);
  const evidenceLines = browserEvidenceLines(decision);
  for (const output of [
    "run_browser=true",
    "browser_tier=FULL",
    "browser_domain=",
    "browser_detected_domains=",
    "browser_executed_suites=",
    "browser_skipped_suites=[]",
    "browser_fallback_reason=full-fallback:app-integration:full",
  ]) {
    assert.ok(outputLines.some((line) => line.startsWith(output)), output);
  }
  for (const evidence of [
    "changed_files=",
    "detected_domains=",
    "selected_tier=FULL",
    "executed_suites=",
    "skipped_suites=[]",
    "fallback_reason=full-fallback:app-integration:full",
  ]) {
    assert.ok(
      evidenceLines.some((line) => line.startsWith(`[browser-impact] ${evidence}`)),
      evidence,
    );
  }
});

test("Workbench required workflow consumes tier and domain outputs without changing check identity", async () => {
  const workflow = await readFile(
    new URL("../.github/workflows/workbench-integration-verify.yml", import.meta.url),
    "utf8",
  );
  const runner = await readFile(
    new URL("../scripts/run-browser-verification.mjs", import.meta.url),
    "utf8",
  );

  assert.match(workflow, /name: Workbench Integration Verify \/ verify/);
  assert.match(workflow, /node scripts\/classify-browser-impact\.mjs/);
  assert.match(workflow, /steps\.scope\.outputs\.run_browser == 'true'/);
  assert.match(workflow, /steps\.scope\.outputs\.browser_tier/);
  assert.match(workflow, /steps\.scope\.outputs\.browser_domain/);
  assert.match(workflow, /node scripts\/run-browser-verification\.mjs/);
  assert.match(runner, /\["run", "test:e2e"\]/);
  assert.match(runner, /getBrowserSuiteSelection/);
  assert.doesNotMatch(workflow, /pull_request:\s*\n\s*paths:/);
  assert.doesNotMatch(workflow, /continue-on-error:/);
  assert.doesNotMatch(workflow, /playwright test .*--grep-invert/);
});
