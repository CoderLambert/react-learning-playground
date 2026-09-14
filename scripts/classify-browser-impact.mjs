import { pathToFileURL } from "node:url";

import { getBrowserImpactOwnership } from "../architecture/ownership-manifest.mjs";

const DOC_ONLY_PREFIXES = ["docs/", ".codex/"];
const DOC_ONLY_ROOT_FILES = new Set([
  "AGENTS.md",
  "README.md",
  "issue-rule.md",
]);
const DOMAIN_BROWSER_SUITES = new Set(["ai", "assessment", "workbench"]);

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

function fullResult({ reason, triggeringPath = null }) {
  return {
    runBrowser: true,
    tier: "FULL",
    domain: null,
    reason,
    triggeringPath,
  };
}

export function classifyBrowserImpact(files) {
  const normalized = files.map(normalizePath).filter(Boolean);

  if (normalized.length === 0) {
    return fullResult({ reason: "empty-or-unknown-change-set" });
  }

  const runtimePaths = normalized.filter((file) => !isDocumentationOnlyPath(file));
  if (runtimePaths.length === 0) {
    return {
      runBrowser: false,
      tier: "NONE",
      domain: null,
      reason: "documentation-only",
      triggeringPath: null,
    };
  }

  const ownership = runtimePaths.map((file) => ({
    file,
    ...getBrowserImpactOwnership(file),
  }));

  const fullFallback = ownership.find(({ owner, browserImpact }) => (
    browserImpact !== "domain" || !DOMAIN_BROWSER_SUITES.has(owner)
  ));
  if (fullFallback) {
    return fullResult({
      reason: `full-fallback:${fullFallback.owner}:${fullFallback.browserImpact}`,
      triggeringPath: fullFallback.file,
    });
  }

  const domains = new Set(ownership.map(({ owner }) => owner));
  if (domains.size !== 1) {
    return fullResult({
      reason: "cross-domain-change-set",
      triggeringPath: runtimePaths[0],
    });
  }

  const [domain] = domains;
  return {
    runBrowser: true,
    tier: "DOMAIN",
    domain,
    reason: `domain-local:${domain}`,
    triggeringPath: runtimePaths[0],
  };
}

async function readChangedFilesFromStdin() {
  let input = "";
  for await (const chunk of process.stdin) input += chunk;
  return input.split(/\r?\n/).map(normalizePath).filter(Boolean);
}

async function main() {
  const files = await readChangedFilesFromStdin();
  const result = classifyBrowserImpact(files);
  process.stdout.write(`run_browser=${result.runBrowser}\n`);
  process.stdout.write(`browser_tier=${result.tier}\n`);
  process.stdout.write(`browser_domain=${result.domain ?? ""}\n`);
  process.stderr.write(
    `[browser-impact] ${result.tier} ${result.reason}${result.triggeringPath ? `: ${result.triggeringPath}` : ""}\n`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
