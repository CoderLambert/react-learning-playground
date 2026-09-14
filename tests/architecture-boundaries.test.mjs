import assert from "node:assert/strict";
import test from "node:test";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  ARCHITECTURE_OWNERS,
  getArchitectureOwner,
  getBrowserImpactOwnership,
  isCuratedPublicEntry,
} from "../architecture/ownership-manifest.mjs";
import { ARCHITECTURE_DEBT } from "../architecture/debt-register.mjs";

const ROOT = path.resolve(fileURLToPath(new URL("../", import.meta.url)));

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute));
    else if (entry.isFile()) files.push(absolute);
  }
  return files;
}

function toPosix(file) {
  return path.relative(ROOT, file).split(path.sep).join("/");
}

function parseImports(source) {
  const imports = [];
  const patterns = [
    /(?:import|export)\s+(?:[^"']*?\s+from\s+)?["']([^"']+)["']/g,
    /import\s*\(\s*["']([^"']+)["']\s*\)/g,
  ];
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) imports.push(match[1]);
  }
  return imports;
}

function normalizeImport(sourceFile, specifier) {
  if (!specifier.startsWith(".")) return null;
  const clean = specifier.split(/[?#]/)[0];
  return path.posix.normalize(path.posix.join(path.posix.dirname(sourceFile), clean));
}

test("ownership manifest exposes reusable owner and browser-impact taxonomy", () => {
  assert.ok(ARCHITECTURE_OWNERS.some((owner) => owner.id === "assessment"));
  assert.equal(getArchitectureOwner("src/assessment/application/AssessmentService.js")?.id, "assessment");
  assert.deepEqual(getBrowserImpactOwnership("src/assessment/domain/question.js"), {
    owner: "assessment",
    browserImpact: "domain",
  });
  assert.deepEqual(getBrowserImpactOwnership("unknown/runtime.js"), {
    owner: "unknown",
    browserImpact: "full",
  });
});

test("AI, Assessment and Workbench expose curated public entries rather than mega-barrels", async () => {
  for (const [owner, file] of [
    ["ai", "src/ai/public.js"],
    ["assessment", "src/assessment/public.js"],
    ["workbench", "src/workbench/public.js"],
  ]) {
    assert.equal(isCuratedPublicEntry(owner, file), true);
    const source = await readFile(new URL(`../${file}`, import.meta.url), "utf8");
    assert.doesNotMatch(source, /export\s+\*\s+from/);
    assert.match(source, /export\s+\{/);
  }
});

test("AI and Assessment composition is owned by app/integration", async () => {
  const [runtimeSource, capabilitySource, integrationSource, appSource] = await Promise.all([
    readFile(new URL("../src/assessment/composition/assessmentRuntime.js", import.meta.url), "utf8"),
    readFile(new URL("../src/assessment/ai/assessmentTools.js", import.meta.url), "utf8"),
    readFile(new URL("../src/app/aiAssessmentIntegration.js", import.meta.url), "utf8"),
    readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(runtimeSource, /\.\.\/\.\.\/ai\//);
  assert.doesNotMatch(capabilitySource, /\.\.\/\.\.\/ai\//);
  assert.doesNotMatch(runtimeSource, /createAgentRunner/);
  assert.match(integrationSource, /from "\.\.\/ai\/public\.js"/);
  assert.match(integrationSource, /mapAssessmentCapabilityToAiTool/);
  assert.match(appSource, /createAiAssessmentIntegration/);
  assert.match(appSource, /assessmentCapabilities: assessmentView\.integrationCapabilities/);
  assert.doesNotMatch(appSource, /assessmentCapabilities: assessmentRuntime\.capabilities/);
});

test("temporary architecture debt is reviewable and has removal ownership", () => {
  const ids = new Set();
  for (const entry of ARCHITECTURE_DEBT) {
    assert.ok(entry.id && !ids.has(entry.id));
    ids.add(entry.id);
    assert.match(entry.source, /^src\//);
    assert.ok(entry.targetOwner);
    assert.ok(entry.owner);
    assert.equal(Number.isInteger(entry.cleanupIssue), true);
    assert.ok(entry.removalCondition);
  }
});

test("repository has no unregistered peer deep import, platform reverse dependency or unregistered domain cycle", async () => {
  const sourceFiles = (await walk(path.join(ROOT, "src"))).filter((file) => /\.[cm]?[jt]sx?$/.test(file));
  const registeredDebt = new Set(ARCHITECTURE_DEBT.map((entry) => `${entry.source}->${entry.targetOwner}`));
  const graph = new Map();

  for (const absolute of sourceFiles) {
    const sourceFile = toPosix(absolute);
    const sourceOwner = getArchitectureOwner(sourceFile);
    if (!sourceOwner) continue;
    const source = await readFile(absolute, "utf8");

    for (const specifier of parseImports(source)) {
      const targetFile = normalizeImport(sourceFile, specifier);
      if (!targetFile) continue;
      const targetOwner = getArchitectureOwner(targetFile);
      if (!targetOwner || targetOwner.id === sourceOwner.id) continue;

      const debtKey = `${sourceFile}->${targetOwner.id}`;
      if (registeredDebt.has(debtKey)) continue;

      if (sourceOwner.id === "platform") {
        assert.fail(`platform reverse dependency: ${sourceFile} -> ${targetFile}`);
      }

      if (sourceOwner.kind === "domain" && targetOwner.kind === "domain") {
        assert.equal(
          isCuratedPublicEntry(targetOwner.id, targetFile),
          true,
          `${sourceFile} deep-imports peer ${targetOwner.id}: ${targetFile}`,
        );
      }

      if (!graph.has(sourceOwner.id)) graph.set(sourceOwner.id, new Set());
      graph.get(sourceOwner.id).add(targetOwner.id);
    }
  }

  const visiting = new Set();
  const visited = new Set();
  function visit(owner) {
    if (visiting.has(owner)) assert.fail(`unregistered architecture cycle through ${owner}`);
    if (visited.has(owner)) return;
    visiting.add(owner);
    for (const next of graph.get(owner) ?? []) visit(next);
    visiting.delete(owner);
    visited.add(owner);
  }
  for (const owner of graph.keys()) visit(owner);
});
