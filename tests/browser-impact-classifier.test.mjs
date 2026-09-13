import assert from "node:assert/strict";
import test from "node:test";

import {
  classifyBrowserImpact,
  isDocumentationOnlyPath,
} from "../scripts/classify-browser-impact.mjs";

test("known runtime surfaces always require browser verification", () => {
  for (const file of [
    "src/learning-actions/promptBuilder.js",
    "src/source/sourceLocator.js",
    "src/platform/storage.js",
    "src/new-runtime-domain/example.js",
    "build/source-locator-manifest.mjs",
    "tests/e2e/workbench.spec.js",
    "playwright.config.js",
    "package.json",
    ".github/workflows/workbench-integration-verify.yml",
  ]) {
    assert.equal(
      classifyBrowserImpact([file]).runBrowser,
      true,
      `${file} must trigger browser verification`,
    );
  }
});

test("unknown non-documentation paths fail closed to browser verification", () => {
  const result = classifyBrowserImpact(["scripts/future-runtime-generator.mjs"]);
  assert.deepEqual(result, {
    runBrowser: true,
    reason: "browser-or-unknown-impact",
    triggeringPath: "scripts/future-runtime-generator.mjs",
  });
});

test("documentation-only changes keep the safe fast path", () => {
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
    reason: "documentation-only",
    triggeringPath: null,
  });
});

test("mixed documentation and runtime changes require browser verification", () => {
  const result = classifyBrowserImpact([
    "docs/execution/example.md",
    "src/learning-actions/index.js",
  ]);

  assert.equal(result.runBrowser, true);
  assert.equal(result.triggeringPath, "src/learning-actions/index.js");
});

test("empty or unavailable diff fails closed", () => {
  assert.deepEqual(classifyBrowserImpact([]), {
    runBrowser: true,
    reason: "empty-or-unknown-change-set",
    triggeringPath: null,
  });
});
