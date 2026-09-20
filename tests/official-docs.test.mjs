import assert from "node:assert/strict";
import test from "node:test";

import {
  OFFICIAL_DOCS_BY_LEARNING_UNIT_ID,
  OFFICIAL_DOCS_PILOT_IDS,
  getOfficialDocsForLearningUnit,
} from "../src/content/officialDocs.js";

test("official docs pilot covers the first component chapter", () => {
  assert.deepEqual(
    OFFICIAL_DOCS_PILOT_IDS,
    [
      "component-jsx-pure-render",
      "props",
      "children",
      "multi-slots",
      "conditional-rendering",
      "rendering-lists-key",
      "prop-drilling",
    ],
  );
});

test("official docs mappings point to the Simplified Chinese React Learn site", () => {
  for (const doc of Object.values(OFFICIAL_DOCS_BY_LEARNING_UNIT_ID)) {
    assert.match(doc.url, /^https:\/\/zh-hans\.react\.dev\/learn(?:\/|$)/);
    assert.ok(doc.title.length > 0);
    assert.ok(doc.description.length > 0);
    assert.ok(doc.match === "direct" || doc.match === "related");
  }
});

test("lesson resolver returns exact and related mappings without guessing unknown lessons", () => {
  assert.equal(
    getOfficialDocsForLearningUnit("component-jsx-pure-render")?.url,
    "https://zh-hans.react.dev/learn/your-first-component",
  );
  assert.match(
    getOfficialDocsForLearningUnit("rendering-lists-key")?.url ?? "",
    /rendering-lists#keeping-list-items-in-order-with-key$/,
  );
  assert.equal(getOfficialDocsForLearningUnit("multi-slots")?.match, "related");
  assert.equal(getOfficialDocsForLearningUnit("unknown-unit"), null);
  assert.equal(getOfficialDocsForLearningUnit(null), null);
});
