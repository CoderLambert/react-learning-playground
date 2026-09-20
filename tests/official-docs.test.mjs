import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  OFFICIAL_DOCS_BY_LEARNING_UNIT_ID,
  OFFICIAL_DOCS_COVERED_IDS,
  OFFICIAL_DOCS_INTENTIONALLY_UNMAPPED,
  OFFICIAL_DOCS_INTENTIONALLY_UNMAPPED_IDS,
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

test("every registered learning unit is either mapped or explicitly left unmapped", () => {
  const registered = registeredLearningUnitIds().sort();
  const covered = [...OFFICIAL_DOCS_COVERED_IDS].sort();
  const intentionallyUnmapped = [...OFFICIAL_DOCS_INTENTIONALLY_UNMAPPED_IDS].sort();
  const declared = [...new Set([...covered, ...intentionallyUnmapped])].sort();

  assert.deepEqual(declared, registered);
  assert.deepEqual(
    covered.filter((id) => intentionallyUnmapped.includes(id)),
    [],
    "a learning unit cannot be both mapped and intentionally unmapped",
  );

  for (const [learningUnitId, reason] of Object.entries(OFFICIAL_DOCS_INTENTIONALLY_UNMAPPED)) {
    assert.ok(
      typeof reason === "string" && reason.trim().length > 0,
      `${learningUnitId}: intentional unmapped entries require a reason`,
    );
  }
});

test("official docs use an authoritative-reference and safe-presentation contract", () => {
  const allowedHosts = new Set([
    "zh-hans.react.dev",
    "reactrouter.com",
    "tanstack.com",
    "www.w3.org",
    "testing-library.com",
    "vitest.dev",
    "playwright.dev",
    "www.typescriptlang.org",
    "developer.mozilla.org",
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
      assert.ok(
        item.presentation === "embed" || item.presentation === "external",
        `${learningUnitId}: invalid presentation`,
      );
      if (item.presentation === "embed") {
        assert.equal(
          item.provider,
          "React",
          `${learningUnitId}: only the already-verified React origin may be embedded by default`,
        );
      }

      const url = new URL(item.url);
      assert.equal(url.protocol, "https:", `${learningUnitId}: references must use https`);
      assert.ok(allowedHosts.has(url.hostname), `${learningUnitId}: unexpected official host ${url.hostname}`);
      assert.equal(urls.has(item.url), false, `${learningUnitId}: duplicate reference URL ${item.url}`);
      urls.add(item.url);
    }
  }
});

test("core React lessons can expose multiple embedded official readings", () => {
  const snapshot = getOfficialDocsForLearningUnit("state-snapshot-queue");

  assert.equal(snapshot.primary.provider, "React");
  assert.equal(snapshot.primary.presentation, "embed");
  assert.equal(snapshot.primary.url, "https://zh-hans.react.dev/learn/state-as-a-snapshot");
  assert.ok(
    snapshot.related.some((item) => item.url.endsWith("/queueing-a-series-of-state-updates")),
  );
});

test("ecosystem lessons use owning-project docs without assuming third-party iframe support", () => {
  const cache = getOfficialDocsForLearningUnit("server-state-cache");
  assert.equal(cache.primary.provider, "TanStack Query");
  assert.equal(cache.primary.presentation, "external");
  assert.match(cache.primary.url, /^https:\/\/tanstack\.com\/query\/latest\/docs\/framework\/react\//);

  const urlState = getOfficialDocsForLearningUnit("url-state");
  assert.equal(urlState.primary.provider, "React Router");
  assert.equal(urlState.primary.presentation, "external");

  const modal = getOfficialDocsForLearningUnit("accessible-modal");
  assert.equal(modal.primary.provider, "W3C ARIA APG");
  assert.equal(modal.primary.presentation, "external");

  const testing = getOfficialDocsForLearningUnit("testing-strategy");
  assert.equal(testing.primary.provider, "Testing Library");
  assert.ok(testing.related.some((item) => item.provider === "Playwright"));

  const typescript = getOfficialDocsForLearningUnit("typescript-react");
  assert.equal(typescript.primary.provider, "React");
  assert.ok(typescript.related.some((item) => item.provider === "TypeScript"));
});

test("web-platform concepts use the platform reference before React-related follow-ups", () => {
  const formData = getOfficialDocsForLearningUnit("form-data-modeling");
  assert.equal(formData.primary.provider, "MDN");
  assert.equal(formData.primary.match, "direct");
  assert.equal(
    formData.primary.url,
    "https://developer.mozilla.org/zh-CN/docs/Web/API/FormData",
  );
  assert.ok(formData.related.some((item) => item.provider === "React"));

  const referenceEquality = getOfficialDocsForLearningUnit("reference-equality");
  assert.equal(referenceEquality.primary.provider, "MDN");
  assert.equal(referenceEquality.primary.match, "direct");
  assert.equal(
    referenceEquality.primary.url,
    "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is",
  );
  assert.ok(referenceEquality.related.some((item) => item.provider === "React"));
});

test("framework rendering strategy is related context, not a React Core one-to-one mapping", () => {
  const rendering = getOfficialDocsForLearningUnit("rendering-strategies");

  assert.equal(rendering.primary.provider, "React Router");
  assert.equal(rendering.primary.match, "related");
  assert.ok(rendering.related.some((item) => item.title === "hydrateRoot"));
  assert.ok(rendering.related.some((item) => item.title === "renderToPipeableStream"));
});

test("conceptual extensions do not pretend to have an exact React chapter", () => {
  const multiSlots = getOfficialDocsForLearningUnit("multi-slots");
  assert.equal(multiSlots.primary.match, "related");
});

test("lesson resolver returns null for unknown learning units", () => {
  assert.equal(getOfficialDocsForLearningUnit("unknown-unit"), null);
  assert.equal(getOfficialDocsForLearningUnit(null), null);
});
