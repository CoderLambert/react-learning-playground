export const CORE_BROWSER_SUITES = Object.freeze([
  "tests/e2e/app-shell.spec.js",
]);

export const DOMAIN_BROWSER_SUITES = Object.freeze({
  ai: Object.freeze([
    "tests/e2e/ai-assistant.spec.js",
    "tests/e2e/ai-compaction.spec.js",
    "tests/e2e/ai-cross-unit-history.spec.js",
    "tests/e2e/ai-gateway-compaction.spec.js",
    "tests/e2e/ai-markdown-rendering.spec.js",
    "tests/e2e/ai-product-closure.spec.js",
    "tests/e2e/ai-stream-termination.spec.js",
    "tests/e2e/closure-ai-followup.spec.js",
    "tests/e2e/conversation-rename-accessibility.spec.js",
    "tests/e2e/deepseek-browser-settings.spec.js",
    "tests/e2e/product-closure-ai.spec.js",
  ]),
  assessment: Object.freeze([
    "tests/e2e/assessment-lifecycle.spec.js",
    "tests/e2e/assessment-management.spec.js",
    "tests/e2e/product-closure-assessment.spec.js",
  ]),
  workbench: Object.freeze([
    "tests/e2e/accessibility.spec.js",
    "tests/e2e/chapter-checkpoints.spec.js",
    "tests/e2e/code-viewer.spec.js",
    "tests/e2e/effects-cleanup.spec.js",
    "tests/e2e/guided-ai-handoff.spec.js",
    "tests/e2e/guided-core-lessons.spec.js",
    "tests/e2e/guided-session-persistence.spec.js",
    "tests/e2e/learning-path-navigation.spec.js",
    "tests/e2e/responsive.spec.js",
    "tests/e2e/source-locator-ai.spec.js",
    "tests/e2e/surface-boundaries.spec.js",
    "tests/e2e/workbench-final-acceptance.spec.js",
    "tests/e2e/workbench-integration.spec.js",
  ]),
});

export const SUPPORTED_BROWSER_DOMAINS = Object.freeze(
  Object.keys(DOMAIN_BROWSER_SUITES).sort(),
);

export const ALL_BROWSER_SUITES = Object.freeze([
  ...CORE_BROWSER_SUITES,
  ...Object.values(DOMAIN_BROWSER_SUITES).flat(),
].sort());

export function getBrowserSuiteSelection(tier, domain = null) {
  if (tier === "NONE") {
    return {
      executedSuites: [],
      skippedSuites: [...ALL_BROWSER_SUITES],
    };
  }

  if (tier === "FULL") {
    return {
      executedSuites: [...ALL_BROWSER_SUITES],
      skippedSuites: [],
    };
  }

  const domainSuites = DOMAIN_BROWSER_SUITES[domain];
  if (tier !== "DOMAIN" || !domainSuites) {
    throw new Error(`Unsupported browser verification selection: ${tier}:${domain ?? "none"}`);
  }

  const executedSuites = [...CORE_BROWSER_SUITES, ...domainSuites].sort();
  const executedSuiteSet = new Set(executedSuites);
  return {
    executedSuites,
    skippedSuites: ALL_BROWSER_SUITES.filter((suite) => !executedSuiteSet.has(suite)),
  };
}
