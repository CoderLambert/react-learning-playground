import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  OFFICIAL_DOCS_BY_LEARNING_UNIT_ID,
  OFFICIAL_DOCS_COVERED_IDS,
  OFFICIAL_DOCS_PILOT_IDS,
  getOfficialDocsForLearningUnit,
} from "../src/content/officialDocs.js";

const REGISTRY_FILE = new URL("../src/demos/index.js", import.meta.url);

function registeredLearningUnitIds() {
  const registry = readFileSync(REGISTRY_FILE, "utf8");
  const demosStart = registry.indexOf("export const demos = [");
  assert.notEqual(demosStart, -1, "src/demos/index.js must export the demos registry");
  return [...registry.slice(demosStart).matchAll(/\bid:\s*"([a-z0-9-]+)"/g)].map((match) => match[1]);
}

function lessonReferences(entry) {
  return [entry.primary, ...(entry.related ?? [])];
}

test("official docs cover every registered learning unit without inventing extra ids", () => {
  const registered = registeredLearningUnitIds().sort();
  const covered = [...OFFICIAL_DOCS_COVERED_IDS].sort();

  assert.equal(registered.length, 58);
  assert.deepEqual(covered, registered);
  assert.deepEqual(OFFICIAL_DOCS_PILOT_IDS, OFFICIAL_DOCS_COVERED_IDS);
});

test("official docs use a primary + related authoritative-reference contract", () => {
  const allowedHosts = new Set([
    "zh-hans.react.dev",
    "reactrouter.com",
    "tanstack.com",
    "www.w3.org",
    "testing-library.com",
    "vitest.dev",
    "playwright.dev",
    "www.typescriptlang.org",
  ]);

  for (const [learningUnitId, entry] of Object.entries(OFFICIAL_DOCS_BY_LEARNING_UNIT_ID)) {
    assert.ok(entry.primary, `${learningUnitId}: primary reference is required`);
    assert.ok(Array.isArray(entry.related), `${learningUnitId}: related references must be an array`);

    const references = lessonReferences(entry);
    const urls = new Set();

    for (const item of references) {
      assert.ok(item.provider.length > 0, `${learningUnitId}: provider is required`);
      assert.ok(item.title.length > 0, `${learningUnitId}: title is required`);
      assert.ok(item.description.length > 0, `${learningUnitId}: description is required`);
      assert.ok(item.match === "direct" || item.match === "related", `${learningUnitId}: invalid match`);

      const url = new URL(item.url);
      assert.equal(url.protocol, "https:", `${learningUnitId}: references must use https`);
      assert.ok(allowedHosts.has(url.hostname), `${learningUnitId}: unexpected official host ${url.hostname}`);
      assert.equal(urls.has(item.url), false, `${learningUnitId}: duplicate reference URL ${item.url}`);
      urls.add(item.url);
    }
  }
});

test("core React lessons can expose multiple official readings for one learning unit", () => {
  const snapshot = getOfficialDocsForLearningUnit("state-snapshot-queue");

  assert.equal(snapshot.primary.provider, "React");
  assert.equal(snapshot.primary.url, "https://zh-hans.react.dev/learn/state-as-a-snapshot");
  assert.ok(
    snapshot.related.some((item) => item.url.endsWith("/queueing-a-series-of-state-updates")),
  );
});

test("ecosystem lessons use the owning project's official documentation", () => {
  assert.equal(getOfficialDocsForLearningUnit("server-state-cache").primary.provider, "TanStack Query");
  assert.match(
    getOfficialDocsForLearningUnit("server-state-cache").primary.url,
    /^https:\/\/tanstack\.com\/query\/latest\/docs\/framework\/react\//,
  );

  assert.equal(getOfficialDocsForLearningUnit("url-state").primary.provider, "React Router");
  assert.match(
    getOfficialDocsForLearningUnit("url-state").primary.url,
    /^https:\/\/reactrouter\.com\//,
  );

  assert.equal(getOfficialDocsForLearningUnit("accessible-modal").primary.provider, "W3C ARIA APG");
  assert.match(
    getOfficialDocsForLearningUnit("accessible-modal").primary.url,
    /^https:\/\/www\.w3\.org\/WAI\//,
  );

  assert.equal(getOfficialDocsForLearningUnit("testing-strategy").primary.provider, "Testing Library");
  assert.ok(
    getOfficialDocsForLearningUnit("testing-strategy").related.some((item) => item.provider === "Playwright"),
  );

  assert.equal(getOfficialDocsForLearningUnit("typescript-react").primary.provider, "React");
  assert.ok(
    getOfficialDocsForLearningUnit("typescript-react").related.some((item) => item.provider === "TypeScript"),
  );
});

test("conceptual lessons are marked related instead of pretending an exact official page exists", () => {
  const referenceEquality = getOfficialDocsForLearningUnit("reference-equality");
  const multiSlots = getOfficialDocsForLearningUnit("multi-slots");

  assert.equal(referenceEquality.primary.match, "related");
  assert.equal(multiSlots.primary.match, "related");
});

test("lesson resolver returns null for unknown learning units", () => {
  assert.equal(getOfficialDocsForLearningUnit("unknown-unit"), null);
  assert.equal(getOfficialDocsForLearningUnit(null), null);
});
