import assert from "node:assert/strict";
import test from "node:test";
import {
  buildAiCodeBlockModel,
  buildCodeBlockPreview,
  countCodeBlockLines,
  getCodeBlockLabel,
  normalizeCodeBlockLanguage,
  normalizeCodeBlockText,
  performCodeBlockCopy,
} from "../src/components/ai-assistant/code/aiCodeBlockModel.js";

test("builds stable metadata from a Markstream code node", () => {
  const model = buildAiCodeBlockModel({
    language: "js",
    code: "const first = 1;\nconst second = 2;",
    meta: 'title="ComponentDemo.jsx"',
  });

  assert.deepEqual(model, {
    code: "const first = 1;\nconst second = 2;",
    language: "js",
    label: "ComponentDemo.jsx",
    lineCount: 2,
    preview: "const first = 1;",
  });
});

test("normalizes empty and incomplete streaming nodes without throwing", () => {
  assert.equal(normalizeCodeBlockText(undefined), "");
  assert.equal(normalizeCodeBlockText({ raw: "const value =" }), "const value =");
  assert.equal(normalizeCodeBlockLanguage({}), "text");
  assert.equal(countCodeBlockLines(""), 0);
  assert.equal(countCodeBlockLines("const value ="), 1);
});

test("prefers explicit file labels and supports common metadata forms", () => {
  assert.equal(getCodeBlockLabel({ filename: "Demo.jsx", meta: 'title="Ignored.jsx"' }), "Demo.jsx");
  assert.equal(getCodeBlockLabel({ meta: "file=helpers.ts" }), "helpers.ts");
  assert.equal(getCodeBlockLabel({ meta: "filename='with space.tsx'" }), "with space.tsx");
});

test("collapsed preview stays single-line and bounded for long code", () => {
  const longLine = `const payload = "${"x".repeat(240)}";`;
  const preview = buildCodeBlockPreview(`\n\n${longLine}\nconst hidden = true;`);

  assert.equal(preview.includes("\n"), false);
  assert.ok(preview.length <= 96);
  assert.match(preview, /…$/);
  assert.equal(preview.includes("const hidden"), false);
});

test("copy contract writes exact code before notifying the host", async () => {
  const events = [];
  const code = "const answer = 42;";

  const copied = await performCodeBlockCopy({
    code,
    writeText: async (value) => events.push(["write", value]),
    onCopy: (value) => events.push(["notify", value]),
  });

  assert.equal(copied, true);
  assert.deepEqual(events, [
    ["write", code],
    ["notify", code],
  ]);
});

test("copy contract is a no-op for an empty code block", async () => {
  let writes = 0;
  const copied = await performCodeBlockCopy({
    code: "",
    writeText: async () => { writes += 1; },
  });

  assert.equal(copied, false);
  assert.equal(writes, 0);
});
