import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  ARCHITECTURE_OWNERS,
  FEATURE_COMPONENT_OWNERSHIP,
  SHARED_INTEGRATION_SURFACES,
  getFeatureComponentOwnership,
  getArchitectureOwner,
  getBrowserImpactOwnership,
  isCuratedPublicEntry,
} from "../architecture/ownership-manifest.mjs";
import {
  ARCHITECTURE_DEBT,
  findArchitectureDebt,
  findArchitectureDebtIn,
} from "../architecture/debt-register.mjs";
import {
  analyzeArchitecture,
  collectModuleSpecifiers,
  normalizeModuleSpecifier,
  resolveRepositoryImport,
} from "../scripts/check-architecture-boundaries.mjs";

test("import analysis handles multiline static, export-from, dynamic imports, comments and query suffixes", () => {
  const source = `
    import thing from "./thing.js?raw";
    import "./side-effect.js";
    import {
      alpha,
      beta,
    } from "./multiline-import.js";
    export {
      gamma,
      delta,
    } from './multiline-export.js';
    export { value } from './value.js#fragment';
    const lazy = import("./lazy");
    // import ignored from "./commented.js";
    /* export { ignored } from "./blocked.js"; */
  `;

  assert.deepEqual(collectModuleSpecifiers(source).sort(), [
    "./lazy",
    "./multiline-export.js",
    "./multiline-import.js",
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
  assert.equal(getArchitectureOwner("src/app/aiAssessmentIntegration.js")?.id, "app-integration");
  assert.equal(getArchitectureOwner("src/ai/chatClient.js")?.id, "ai");
  assert.equal(getArchitectureOwner("src/assessment/application/AssessmentService.js")?.id, "assessment");
  assert.equal(getArchitectureOwner("src/workbench/noteRegistry.js")?.id, "workbench");
  assert.equal(getArchitectureOwner("src/platform/browser.js")?.id, "platform");
  assert.equal(getArchitectureOwner("src/components/ai-assistant/AiAssistant.jsx")?.id, "ai");
  assert.equal(getArchitectureOwner("src/components/learning-inspector/LearningInspector.jsx")?.id, "workbench");
  assert.equal(getArchitectureOwner("src/components/source-viewer/SourceViewer.jsx")?.id, "content-source");
  assert.equal(getArchitectureOwner("src/components/ui/button.jsx"), null);
  assert.deepEqual(getBrowserImpactOwnership("src/new-unknown-domain/file.js"), {
    owner: "unknown",
    browserImpact: "full",
  });
  assert.ok(ARCHITECTURE_OWNERS.some((owner) => owner.id === "learning-actions"));
  assert.ok(ARCHITECTURE_OWNERS.some((owner) => owner.id === "content-source"));
  assert.ok(ARCHITECTURE_OWNERS.some((owner) => owner.id === "ci"));
  assert.ok(SHARED_INTEGRATION_SURFACES.some((surface) => surface.paths.includes("src/App.jsx")));
  assert.ok(SHARED_INTEGRATION_SURFACES.some((surface) => surface.paths.includes("src/app/**")));
  assert.ok(SHARED_INTEGRATION_SURFACES.some((surface) => surface.paths.includes("package.json")));
  assert.ok(SHARED_INTEGRATION_SURFACES.some((surface) => surface.paths.includes(".github/workflows/**")));
});

test("feature component ownership is an exact, deterministic repository matrix", () => {
  assert.deepEqual(
    FEATURE_COMPONENT_OWNERSHIP.map(({ path, owner }) => [path, owner]),
    [
      ["src/components/ai-assistant/**", "ai"],
      ["src/components/learning-inspector/**", "workbench"],
      ["src/components/notes/**", "workbench"],
      ["src/components/source-viewer/**", "content-source"],
      ["src/components/source-locator/**", "content-source"],
      ["src/components/mdx/**", "content-source"],
      ["src/components/ChapterCheckpoint.jsx", "workbench"],
      ["src/components/chapterCheckpointMap.js", "workbench"],
      ["src/components/CodeViewer.jsx", "content-source"],
    ],
  );
  assert.deepEqual(getFeatureComponentOwnership("./src/components/ai-assistant/AiAssistant.jsx"), {
    path: "src/components/ai-assistant/**",
    owner: "ai",
  });
  assert.equal(getFeatureComponentOwnership("src/components/UserCard.jsx"), null);
  assert.equal(getFeatureComponentOwnership("src/components/ui/button.jsx"), null);
});

test("Learning Actions exposes the confirmed cross-feature public seam", async () => {
  assert.equal(isCuratedPublicEntry("learning-actions", "src/learning-actions/index.js"), true);
  assert.equal(isCuratedPublicEntry("learning-actions", "src/learning-actions/public.js"), true);
  const source = await readFile(new URL("../src/learning-actions/index.js", import.meta.url), "utf8");
  const runtimeSource = await readFile(new URL("../src/learning-actions/public.js", import.meta.url), "utf8");
  assert.match(source, /subscribeLearningActions/);
  assert.match(source, /buildLearningActionPrompt/);
  assert.doesNotMatch(source, /export\s+\*\s+from/);
  assert.match(runtimeSource, /subscribeLearningActions/);
  assert.doesNotMatch(runtimeSource, /\.jsx/);
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

test("temporary architecture debt is reviewable, exact and has removal ownership", () => {
  const ids = new Set();
  for (const entry of ARCHITECTURE_DEBT) {
    assert.ok(entry.id && !ids.has(entry.id));
    ids.add(entry.id);
    assert.match(entry.source, /^src\//);
    assert.ok(entry.targetOwner);
    assert.match(entry.targetPath, /^src\//);
    assert.equal(getArchitectureOwner(entry.targetPath)?.id, entry.targetOwner);
    assert.ok(entry.owner);
    assert.equal(Number.isInteger(entry.cleanupIssue), true);
    assert.ok(entry.removalCondition.length >= 20);
  }
});

test("architecture debt matches only the explicitly registered crossing", () => {
  const entries = [
    {
      id: "TEST-DEBT",
      source: "src/example/consumer.js",
      targetOwner: "workbench",
      targetPath: "src/workbench/noteRegistry.js",
    },
  ];

  assert.equal(
    findArchitectureDebtIn(
      entries,
      "src/example/consumer.js",
      "workbench",
      "src/workbench/noteRegistry.js",
    )?.id,
    "TEST-DEBT",
  );
  assert.equal(
    findArchitectureDebtIn(
      entries,
      "src/example/consumer.js",
      "workbench",
      "src/workbench/workbenchState.js",
    ),
    null,
  );
  assert.equal(
    findArchitectureDebt(
      "src/ai/useAiLearningAssistant.js",
      "workbench",
      "src/workbench/noteRegistry.js",
    ),
    null,
  );
});

test("owned component fixtures reject peer internals but accept curated public entries", async () => {
  const result = await analyzeArchitecture(
    new URL("./fixtures/architecture-boundaries", import.meta.url).pathname,
  );

  assert.deepEqual(result.violations, [
    {
      type: "peer-domain-deep-import",
      sourcePath: "src/components/ai-assistant/peer-deep-import.js",
      targetPath: "src/assessment/application/AssessmentService.js",
      sourceOwner: "ai",
      targetOwner: "assessment",
    },
  ]);
  assert.deepEqual(result.staleDebt, []);
});

test("repository has no unregistered peer deep import, platform reverse dependency or unregistered domain cycle", async () => {
  const result = await analyzeArchitecture();
  assert.deepEqual(result.violations, []);
  assert.deepEqual(result.staleDebt, []);
});
