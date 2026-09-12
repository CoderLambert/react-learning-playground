import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative, resolve, sep } from "node:path";
import test from "node:test";

const ROOT = resolve(import.meta.dirname, "..");
const SOURCE_EXTENSIONS = new Set([".js", ".jsx", ".mjs", ".ts", ".tsx"]);

function sourceFiles(relativeRoot) {
  const absoluteRoot = resolve(ROOT, relativeRoot);
  if (!existsSync(absoluteRoot)) return [];

  const result = [];
  const visit = (directory) => {
    for (const name of readdirSync(directory)) {
      const path = join(directory, name);
      const stat = statSync(path);
      if (stat.isDirectory()) {
        visit(path);
      } else if (SOURCE_EXTENSIONS.has(extname(path))) {
        result.push(path);
      }
    }
  };

  visit(absoluteRoot);
  return result;
}

function projectPath(path) {
  return relative(ROOT, path).split(sep).join("/");
}

function assertNoMatches({ roots, patterns, reason }) {
  const violations = [];
  for (const root of roots) {
    for (const path of sourceFiles(root)) {
      const content = readFileSync(path, "utf8");
      for (const pattern of patterns) {
        if (pattern.test(content)) {
          violations.push(`${projectPath(path)} matched ${pattern}`);
        }
        pattern.lastIndex = 0;
      }
    }
  }

  assert.deepEqual(violations, [], `${reason}\n${violations.join("\n")}`);
}

test("Assessment UI stays behind application/query-store boundaries", () => {
  assertNoMatches({
    roots: ["src/assessment/ui"],
    patterns: [
      /\bindexedDB\b/,
      /\bIDB(?:Database|Transaction|ObjectStore|Request)\b/,
      /from\s+["'][^"']*assessment\/infrastructure\//,
    ],
    reason: "Assessment UI must not access IndexedDB or Assessment infrastructure directly.",
  });
});

test("Assessment AI adapters stay behind AssessmentService", () => {
  assertNoMatches({
    roots: ["src/assessment/ai"],
    patterns: [
      /\bindexedDB\b/,
      /\bIDB(?:Database|Transaction|ObjectStore|Request)\b/,
      /from\s+["'][^"']*assessment\/infrastructure\//,
    ],
    reason: "Assessment Tool adapters must call the application service, not persistence infrastructure.",
  });
});

test("provider and worker layers do not depend on Assessment", () => {
  assertNoMatches({
    roots: ["src/ai/providers", "worker/deepseek-assistant"],
    patterns: [
      /from\s+["'][^"']*assessment(?:\/|["'])/,
      /import\s*\([^)]*assessment/,
    ],
    reason: "Model providers and the gateway worker must remain Assessment-agnostic.",
  });
});

test("generic Agent core does not depend on Assessment implementations", () => {
  assertNoMatches({
    roots: ["src/ai/agent"],
    patterns: [
      /from\s+["'][^"']*assessment(?:\/|["'])/,
      /import\s*\([^)]*assessment/,
    ],
    reason: "Agent core must discover business capabilities through generic Tool contracts only.",
  });
});
