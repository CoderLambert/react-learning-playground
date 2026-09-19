import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const ROOT = path.resolve(fileURLToPath(new URL("../", import.meta.url)));
const DEMO_ROOT = path.join(ROOT, "src", "demos");
const CODE_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx"]);
const LINT_CATEGORIES = new Set([
  "all",
  "correctness",
  "suspicious",
  "pedantic",
  "perf",
  "style",
  "restriction",
  "nursery",
]);

async function discoverDemoCodeFiles(directory = DEMO_ROOT) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await discoverDemoCodeFiles(entryPath)));
      continue;
    }

    if (entry.isFile() && CODE_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(entryPath);
    }
  }

  return files.sort();
}

function parseDisableDirective(line) {
  const markerIndex = line.indexOf("oxlint-disable");
  if (markerIndex === -1) return null;

  const directive = line
    .slice(markerIndex)
    .replace(/\*\/.*$/, "")
    .trim();

  return directive.match(
    /^oxlint-disable(?<mode>-next-line|-line)?\s+(?<rules>.+?)\s+--\s+(?<reason>.+)$/,
  );
}

test("required lint verification fails on every warning and stale disable directive", async () => {
  const oxlintConfig = JSON.parse(
    await readFile(path.join(ROOT, ".oxlintrc.json"), "utf8"),
  );
  const packageJson = JSON.parse(
    await readFile(path.join(ROOT, "package.json"), "utf8"),
  );

  assert.equal(
    oxlintConfig.options?.denyWarnings,
    true,
    "Oxlint warnings must produce a non-zero exit code",
  );
  assert.ok(
    ["error", "deny"].includes(oxlintConfig.options?.reportUnusedDisableDirectives),
    "unused lint suppressions must fail verification",
  );
  assert.match(packageJson.scripts.lint, /^oxlint\b/);
  assert.match(
    packageJson.scripts["verify:required"],
    /npm run lint/,
    "required verification must consume the lint guardrail",
  );
});

test("Teaching Demo lint exceptions stay rule-specific, justified, and bounded", async () => {
  const files = await discoverDemoCodeFiles();
  let exceptionCount = 0;

  for (const file of files) {
    const source = await readFile(file, "utf8");
    const lines = source.split("\n");

    for (const [index, line] of lines.entries()) {
      if (!line.includes("oxlint-disable")) continue;

      exceptionCount += 1;
      const match = parseDisableDirective(line);
      const relativeFile = path.relative(ROOT, file).split(path.sep).join("/");

      assert.ok(
        match?.groups,
        `${relativeFile}:${index + 1} must name concrete lint rule(s) and include an inline -- rationale`,
      );

      const ruleSpec = match.groups.rules.trim();
      const rules = ruleSpec.split(",").map((rule) => rule.trim()).filter(Boolean);

      assert.ok(rules.length > 0, `${relativeFile}:${index + 1} must name a lint rule`);
      for (const rule of rules) {
        assert.ok(
          !LINT_CATEGORIES.has(rule),
          `${relativeFile}:${index + 1} must suppress a concrete rule, not category "${rule}"`,
        );
      }

      assert.ok(
        match.groups.reason.trim().length >= 12,
        `${relativeFile}:${index + 1} must explain why the teaching exception is necessary`,
      );

      if (!match.groups.mode) {
        assert.ok(
          lines
            .slice(index + 1)
            .some((candidate) => candidate.includes(`oxlint-enable ${ruleSpec}`)),
          `${relativeFile}:${index + 1} block suppression must restore "${ruleSpec}" with oxlint-enable`,
        );
      }
    }
  }

  assert.ok(
    exceptionCount > 0,
    "expected the repository to retain explicit Teaching Demo lint exceptions",
  );
});
