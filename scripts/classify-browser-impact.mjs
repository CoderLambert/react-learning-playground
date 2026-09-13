import { pathToFileURL } from "node:url";

const DOC_ONLY_PREFIXES = ["docs/", ".codex/"];
const DOC_ONLY_ROOT_FILES = new Set([
  "AGENTS.md",
  "README.md",
  "issue-rule.md",
]);

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

export function classifyBrowserImpact(files) {
  const normalized = files.map(normalizePath).filter(Boolean);

  if (normalized.length === 0) {
    return {
      runBrowser: true,
      reason: "empty-or-unknown-change-set",
      triggeringPath: null,
    };
  }

  const triggeringPath = normalized.find((file) => !isDocumentationOnlyPath(file));
  if (triggeringPath) {
    return {
      runBrowser: true,
      reason: "browser-or-unknown-impact",
      triggeringPath,
    };
  }

  return {
    runBrowser: false,
    reason: "documentation-only",
    triggeringPath: null,
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
  process.stderr.write(
    `[browser-impact] ${result.reason}${result.triggeringPath ? `: ${result.triggeringPath}` : ""}\n`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
