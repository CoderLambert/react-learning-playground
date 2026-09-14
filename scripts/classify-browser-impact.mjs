import { appendFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

import { getBrowserImpactOwnership } from "../architecture/ownership-manifest.mjs";
import {
  getBrowserSuiteSelection,
  SUPPORTED_BROWSER_DOMAINS,
} from "./browser-verification-plan.mjs";

const DOC_ONLY_PREFIXES = ["docs/", ".codex/"];
const DOC_ONLY_ROOT_FILES = new Set([
  "AGENTS.md",
  "README.md",
  "issue-rule.md",
]);
const DOMAIN_BROWSER_SUITES = new Set(SUPPORTED_BROWSER_DOMAINS);

function normalizePath(file) {
  return String(file ?? "")
    .trim()
    .replaceAll("\\", "/")
    .replace(/^\.\//, "");
}

export function isDocumentationOnlyPath(file) {
  const normalized = normalizePath(file);
  if (!normalized) return true;
  if (DOC_ONLY_ROOT_FILES.has(normalized)) return true;
  if (DOC_ONLY_PREFIXES.some((prefix) => normalized.startsWith(prefix))) return true;
  return normalized.endsWith(".md") && !normalized.startsWith("src/");
}

function resultWithSuites(result) {
  return {
    ...result,
    ...getBrowserSuiteSelection(result.tier, result.domain),
  };
}

function fullResult({ changedFiles, detectedDomains, reason, triggeringPath = null }) {
  return resultWithSuites({
    runBrowser: true,
    tier: "FULL",
    domain: null,
    changedFiles,
    detectedDomains,
    reason,
    fallbackReason: reason,
    triggeringPath,
  });
}

export function classifyBrowserImpact(files) {
  const normalized = [...new Set(files.map(normalizePath).filter(Boolean))].sort();

  if (normalized.length === 0) {
    return fullResult({
      changedFiles: [],
      detectedDomains: [],
      reason: "empty-or-unknown-change-set",
    });
  }

  const runtimePaths = normalized.filter((file) => !isDocumentationOnlyPath(file));
  if (runtimePaths.length === 0) {
    return resultWithSuites({
      runBrowser: false,
      tier: "NONE",
      domain: null,
      changedFiles: normalized,
      detectedDomains: [],
      reason: "documentation-only",
      fallbackReason: null,
      triggeringPath: null,
    });
  }

  const ownership = runtimePaths.map((file) => ({
    file,
    ...getBrowserImpactOwnership(file),
  }));
  const detectedDomains = [...new Set(ownership.map(({ owner }) => owner))].sort();

  const fullFallback = ownership.find(({ owner, browserImpact }) => (
    browserImpact !== "domain" || !DOMAIN_BROWSER_SUITES.has(owner)
  ));
  if (fullFallback) {
    return fullResult({
      changedFiles: normalized,
      detectedDomains,
      reason: `full-fallback:${fullFallback.owner}:${fullFallback.browserImpact}`,
      triggeringPath: fullFallback.file,
    });
  }

  const domains = new Set(ownership.map(({ owner }) => owner));
  if (domains.size !== 1) {
    return fullResult({
      changedFiles: normalized,
      detectedDomains,
      reason: "cross-domain-change-set",
      triggeringPath: runtimePaths[0],
    });
  }

  const [domain] = domains;
  return resultWithSuites({
    runBrowser: true,
    tier: "DOMAIN",
    domain,
    changedFiles: normalized,
    detectedDomains,
    reason: `domain-local:${domain}`,
    fallbackReason: null,
    triggeringPath: runtimePaths[0],
  });
}

export function browserEvidenceLines(result) {
  return [
    `[browser-impact] changed_files=${JSON.stringify(result.changedFiles)}`,
    `[browser-impact] detected_domains=${JSON.stringify(result.detectedDomains)}`,
    `[browser-impact] selected_tier=${result.tier}`,
    `[browser-impact] executed_suites=${JSON.stringify(result.executedSuites)}`,
    `[browser-impact] skipped_suites=${JSON.stringify(result.skippedSuites)}`,
    `[browser-impact] fallback_reason=${result.fallbackReason ?? "none"}`,
  ];
}

export function browserOutputLines(result) {
  return [
    `run_browser=${result.runBrowser}`,
    `browser_tier=${result.tier}`,
    `browser_domain=${result.domain ?? ""}`,
    `browser_detected_domains=${JSON.stringify(result.detectedDomains)}`,
    `browser_executed_suites=${JSON.stringify(result.executedSuites)}`,
    `browser_skipped_suites=${JSON.stringify(result.skippedSuites)}`,
    `browser_fallback_reason=${result.fallbackReason ?? ""}`,
  ];
}

function evidenceSummary(result) {
  const displayList = (values) => (
    values.length > 0
      ? values.map((value) => `\`${value}\``).join("<br>")
      : "None"
  );
  return [
    "### Browser verification decision",
    "",
    "| Evidence | Value |",
    "| --- | --- |",
    `| Changed files | ${displayList(result.changedFiles)} |`,
    `| Detected domain(s) | ${displayList(result.detectedDomains)} |`,
    `| Selected tier | \`${result.tier}\` |`,
    `| Executed suites | ${displayList(result.executedSuites)} |`,
    `| Skipped suites | ${displayList(result.skippedSuites)} |`,
    `| Fallback reason | ${result.fallbackReason ? `\`${result.fallbackReason}\`` : "None"} |`,
    "",
  ].join("\n");
}

async function readChangedFilesFromStdin() {
  let input = "";
  for await (const chunk of process.stdin) input += chunk;
  return input.split(/\r?\n/).map(normalizePath).filter(Boolean);
}

async function main() {
  const files = await readChangedFilesFromStdin();
  const result = classifyBrowserImpact(files);
  process.stdout.write(`${browserOutputLines(result).join("\n")}\n`);
  process.stderr.write(`${browserEvidenceLines(result).join("\n")}\n`);
  if (process.env.GITHUB_STEP_SUMMARY) {
    await appendFile(process.env.GITHUB_STEP_SUMMARY, evidenceSummary(result));
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
