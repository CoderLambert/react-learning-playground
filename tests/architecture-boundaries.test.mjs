import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  ARCHITECTURE_OWNERS,
  SHARED_INTEGRATION_SURFACES,
  getArchitectureOwner,
  getBrowserImpactOwnership,
  isCuratedPublicEntry,
} from "../architecture/ownership-manifest.mjs";
import { ARCHITECTURE_DEBT } from "../architecture/debt-register.mjs";
import {
  analyzeArchitecture,
  collectModuleSpecifiers,
  normalizeModuleSpecifier,
  resolveRepositoryImport,
} from "../scripts/check-architecture-boundaries.mjs";

test("import analysis handles static, export-from, dynamic imports, comments and query suffixes", () => {
  const source = `
    import thing from "./thing.js?raw";
    import "./side-effect.js";
    export { value } from './value.js#fragment';
    const lazy = import("./lazy");
    // import ignored from "./commented.js";
    /* export { ignored } from "./blocked.js"; */
  `;

  assert.deepEqual(collectModuleSpecifiers(source).sort(), [
    "./lazy",
    "./side-effect.js",
    "./thing.js?raw",
    "./value.js#fragment",
  ]);
  assert.equal(normalizeModuleSpecifier("./thing.js?raw"), "./thing.js");
  assert.equal(normalizeModuleSpecifier("./value.js#fragment"), "./value.js");

  const files = new Set([
    "src/example/thing.js",
    "src/example/lazy.jsx",
    "src/example/index.js",
  ]);
  assert.equal(resolveRepositoryImport("src/example/consumer.js", "./thing?raw", files), "src/example/thing.js");
  assert.equal(resolveRepositoryImport("src/example/consumer.js", "./lazy", files), "src/example/lazy.jsx");
});

test("ownership manifest exposes reusable owner and browser-impact taxonomy", () => {
  assert.equal(getArchitectureOwner("src/ai/chatClient.js")?.id, "ai");
  assert.equal(getArchitectureOwner("src/assessment/application/AssessmentService.js")?.id, "assessment");
  assert.equal(getArchitectureOwner("src/workbench/noteRegistry.js")?.id, "workbench");
  assert.equal(getArchitectureOwner("src/platform/browser.js")?.id, "platform");
  assert.deepEqual(getBrowserImpactOwnership("src/new-unknown-domain/file.js"), {
    owner: "unknown",
    browserImpact: "full",
  });
  assert.ok(ARCHITECTURE_OWNERS.some((owner) => owner.id === "learning-actions"));
  assert.ok(ARCHITECTURE_OWNERS.some((owner) => owner.id === "content-source"));
  assert.ok(ARCHITECTURE_OWNERS.some((owner) => owner.id === "ci"));
  assert.ok(SHARED_INTEGRATION_SURFACES.some((surface) => surface.paths.includes("src/App.jsx")));
  assert.ok(SHARED_INTEGRATION_SURFACES.some((surface) => surface.paths.includes("package.json")));
  assert.ok(SHARED_INTEGRATION_SURFACES.some((surface) => surface.paths.includes(".github/workflows/**")));
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

test("temporary architecture debt is reviewable and has removal ownership", () => {
  const ids = new Set();
  for (const entry of ARCHITECTURE_DEBT) {
    assert.ok(entry.id && !ids.has(entry.id));
    ids.add(entry.id);
    assert.match(entry.source, /^src\//);
    assert.ok(entry.targetOwner);
    assert.ok(entry.owner);
    assert.equal(Number.isInteger(entry.cleanupIssue), true);
    assert.ok(entry.removalCondition.length >= 20);
  }
});

test("repository has no unregistered peer deep import, platform reverse dependency or unregistered domain cycle", async () => {
  const result = await analyzeArchitecture();
  assert.deepEqual(result.violations, []);
  assert.deepEqual(result.staleDebt, []);
});
