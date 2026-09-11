import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  extractSourceCitations,
  formatSourceCitationLines,
  isSourceCitationUrl,
  parseBracketSourceCitations,
  parseSourceCitationUrl,
  serializeSourceCitationMarkdown,
  serializeSourceCitationUrl,
} from "../src/ai/citations/sourceCitation.js";
import {
  SourceCitation,
  createSourceCitationOpenPayload,
} from "../src/components/ai-assistant/citations/SourceCitation.js";

test("serializes and parses a single-line source citation", () => {
  const href = serializeSourceCitationUrl({
    fileName: "ComponentJsxPureRenderDemo.jsx",
    startLine: 120,
  });

  assert.equal(href, "source://ComponentJsxPureRenderDemo.jsx#L120");
  assert.deepEqual(parseSourceCitationUrl(href), {
    fileName: "ComponentJsxPureRenderDemo.jsx",
    startLine: 120,
    endLine: 120,
  });
});

test("serializes and parses a source line range", () => {
  const href = serializeSourceCitationUrl({
    fileName: "ComponentJsxPureRenderDemo.jsx",
    startLine: 44,
    endLine: 46,
  });

  assert.equal(href, "source://ComponentJsxPureRenderDemo.jsx#L44-L46");
  assert.equal(formatSourceCitationLines(44, 46), "L44–L46");
  assert.deepEqual(parseSourceCitationUrl(href), {
    fileName: "ComponentJsxPureRenderDemo.jsx",
    startLine: 44,
    endLine: 46,
  });
});

test("round-trips encoded paths, spaces, unicode, and special characters", () => {
  const fileName = "src/学习 demos/Render #1?.tsx";
  const href = serializeSourceCitationUrl({ fileName, startLine: 8, endLine: 12 });

  assert.equal(href, "source://src%2F%E5%AD%A6%E4%B9%A0%20demos%2FRender%20%231%3F.tsx#L8-L12");
  assert.deepEqual(parseSourceCitationUrl(href), {
    fileName,
    startLine: 8,
    endLine: 12,
  });
});

test("rejects malformed protocol URLs and arbitrary external URLs", () => {
  assert.equal(parseSourceCitationUrl("https://example.com/File.jsx#L1"), null);
  assert.equal(parseSourceCitationUrl("source://File.jsx#L0"), null);
  assert.equal(parseSourceCitationUrl("source://File.jsx#L9-L4"), null);
  assert.equal(parseSourceCitationUrl("source://%E0%A4%A#L1"), null);
  assert.equal(isSourceCitationUrl("javascript://File.jsx#L1"), false);
});

test("parses conservative legacy bracket citations from mixed prose", () => {
  const text = "见 [ComponentJsxPureRenderDemo.jsx:L120]，以及 [src/hooks/useThing.ts:L9-L12]。忽略 [chapter:L3] 和 [https://x.dev/a.js:L1]。";
  const citations = parseBracketSourceCitations(text);

  assert.deepEqual(
    citations.map(({ fileName, startLine, endLine }) => ({ fileName, startLine, endLine })),
    [
      { fileName: "ComponentJsxPureRenderDemo.jsx", startLine: 120, endLine: 120 },
      { fileName: "src/hooks/useThing.ts", startLine: 9, endLine: 12 },
    ],
  );
});

test("extracts canonical Markdown protocol links without double-counting their labels", () => {
  const markdown = serializeSourceCitationMarkdown({
    fileName: "src/components/Demo.jsx",
    startLine: 10,
    endLine: 20,
    label: "Demo render path",
  });
  const text = `解释见 ${markdown}，旧格式仍支持 [Other.ts:L2]。`;
  const citations = extractSourceCitations(text);

  assert.equal(citations.length, 2);
  assert.equal(citations[0].syntax, "markdown");
  assert.equal(citations[0].label, "Demo render path");
  assert.equal(citations[1].syntax, "bracket");
});

test("preserves duplicate occurrences by default and can deduplicate semantically", () => {
  const text = "[Demo.jsx:L3] 与 [Demo.jsx:L3]";
  assert.equal(extractSourceCitations(text).length, 2);
  assert.equal(extractSourceCitations(text, { dedupe: true }).length, 1);
});

test("SourceCitation renders compact accessible file and range UI with preview", () => {
  const html = renderToStaticMarkup(
    createElement(SourceCitation, {
      fileName: "ComponentJsxPureRenderDemo.jsx",
      startLine: 44,
      endLine: 46,
      preview: ["44 const value = compute();", "45 return value;"],
    }),
  );

  assert.match(html, /ai-source-citation/);
  assert.match(html, /ComponentJsxPureRenderDemo\.jsx/);
  assert.match(html, /L44–L46/);
  assert.match(html, /aria-label="打开源码 ComponentJsxPureRenderDemo\.jsx L44–L46"/);
  assert.match(html, /role="tooltip"/);
  assert.match(html, /44 const value = compute\(\);/);
});

test("SourceCitation open payload is stable and contains only navigation fields", () => {
  assert.deepEqual(
    createSourceCitationOpenPayload({
      fileName: "Demo.jsx",
      startLine: 7,
      endLine: 9,
      label: "render",
    }),
    { fileName: "Demo.jsx", startLine: 7, endLine: 9 },
  );
});
