import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  addLineNumbers,
  buildAiContext,
  formatSourceCitation,
} from "../src/ai/contextBuilder.js";

const learningUnit = {
  id: "props",
  title: "Props 基础传递、解构与派生计算",
  categoryId: "components",
  sources: [
    { name: "PropsDemo.jsx", code: "const answer = 42;\nexport default answer;" },
  ],
};

test("raw note registry exposes lazy raw MDX API without replacing compiled loader", async () => {
  const source = await readFile(new URL("../src/workbench/noteRegistry.js", import.meta.url), "utf8");

  assert.match(source, /const NOTE_MODULE_LOADERS = import\.meta\.glob\("\.\.\/content\/notes\/\*\.mdx"\);/);
  assert.match(source, /const NOTE_RAW_LOADERS = import\.meta\.glob\("\.\.\/content\/notes\/\*\.mdx", \{/);
  assert.match(source, /query: "\?raw"/);
  assert.match(source, /import: "default"/);
  assert.match(source, /export function getRawNoteLoader\(learningUnitId\)/);
  assert.match(source, /export async function loadRawNote\(learningUnitId\)/);
  assert.match(source, /if \(!loader\) return null;/);
  assert.match(source, /typeof loaded\?\.default === "string"/);
});

test("MDX compiler excludes raw imports so AI receives source text", async () => {
  const source = await readFile(new URL("../vite.config.js", import.meta.url), "utf8");

  assert.ok(source.includes("include: /\\.mdx(?:$|\\?)/,"));
  assert.ok(source.includes("exclude: /[?&]raw(?:&|$)/,"));
});

test("buildAiContext creates note and single-source envelope", () => {
  const context = buildAiContext({
    learningUnit,
    rawNote: "# Props\n\nProps 是组件输入。",
    activeSourceFile: "PropsDemo.jsx",
  });

  assert.deepEqual(context.learningUnit, {
    id: "props",
    title: "Props 基础传递、解构与派生计算",
    category: "components",
  });
  assert.equal(context.note.fileName, "props.mdx");
  assert.equal(context.note.available, true);
  assert.equal(context.sources.length, 1);
  assert.equal(context.sources[0].name, "PropsDemo.jsx");
  assert.equal(context.sources[0].numberedCode, "1 | const answer = 42;\n2 | export default answer;");
  assert.equal(context.activeSourceFile, "PropsDemo.jsx");
  assert.equal(context.truncation.truncated, false);
});

test("buildAiContext supports explicit multi-source input and active file", () => {
  const sources = [
    { name: "Demo.jsx", code: "export function Demo() {}" },
    { name: "helper.js", code: "export const value = 1;" },
  ];
  const context = buildAiContext({
    learningUnit,
    rawNote: "# Note",
    sources,
    activeSourceFile: "helper.js",
  });

  assert.deepEqual(context.sources.map((source) => source.name), ["Demo.jsx", "helper.js"]);
  assert.equal(context.activeSourceFile, "helper.js");

  const fallback = buildAiContext({
    learningUnit,
    rawNote: "# Note",
    sources,
    activeSourceFile: "missing.js",
  });
  assert.equal(fallback.activeSourceFile, "Demo.jsx");
});

test("missing note and source content are explicit and non-fatal", () => {
  const context = buildAiContext({ learningUnit: { id: "empty", title: "Empty" } });

  assert.equal(context.note.available, false);
  assert.equal(context.note.fileName, "empty.mdx");
  assert.equal(context.note.content, "");
  assert.deepEqual(context.sources, []);
  assert.equal(context.activeSourceFile, null);
  assert.deepEqual(context.availability, { note: false, sources: false });
});

test("line numbering and citation formatting are stable", () => {
  const original = "first\nsecond\nthird";
  assert.equal(addLineNumbers(original), "1 | first\n2 | second\n3 | third");
  assert.equal(original, "first\nsecond\nthird");
  assert.equal(formatSourceCitation("Demo.jsx", 3), "[Demo.jsx:L3]");
  assert.equal(formatSourceCitation("Demo.jsx", 3, 8), "[Demo.jsx:L3-L8]");
});

test("context limits report deterministic truncation metadata", () => {
  const context = buildAiContext({
    learningUnit: {
      id: "limited",
      title: "Limited",
      categoryId: "state",
    },
    rawNote: "1234567890",
    sources: [
      { name: "a.js", code: "abcdefgh" },
      { name: "b.js", code: "ijklmnop" },
      { name: "c.js", code: "qrstuvwx" },
    ],
    activeSourceFile: "b.js",
    limits: {
      maxNoteChars: 5,
      maxSourceFiles: 2,
      maxSourceCharsPerFile: 6,
      maxTotalSourceChars: 9,
    },
  });

  assert.equal(context.note.content, "12345");
  assert.deepEqual(context.note.truncation, {
    truncated: true,
    originalChars: 10,
    includedChars: 5,
  });
  assert.equal(context.sources[0].code, "abcdef");
  assert.equal(context.sources[1].code, "ijk");
  assert.equal(context.activeSourceFile, "b.js");
  assert.deepEqual(context.truncation, {
    truncated: true,
    omittedSourceFiles: 1,
    sourceCharsOriginal: 16,
    sourceCharsIncluded: 9,
  });
});
