# AI source citation protocol

AI answers should emit source references as normal Markdown links whose destination uses the application-owned `source://` scheme.

Canonical forms:

```md
[ComponentJsxPureRenderDemo.jsx:L120](source://ComponentJsxPureRenderDemo.jsx#L120)
[ComponentJsxPureRenderDemo.jsx:L44-L46](source://ComponentJsxPureRenderDemo.jsx#L44-L46)
[src/components/My Demo.jsx:L8-L12](source://src%2Fcomponents%2FMy%20Demo.jsx#L8-L12)
```

The URL payload is deliberately small and deterministic:

- `source://<encodeURIComponent(fileName)>#L<start>` for one line.
- `source://<encodeURIComponent(fileName)>#L<start>-L<end>` for a range.
- The visible Markdown label is optional presentation metadata; navigation always comes from the URL payload.
- External `http:`, `https:`, or other URL schemes are never treated as source citations.

`src/ai/citations/sourceCitation.js` is the protocol authority. It serializes/parses canonical URLs, extracts protocol links from mixed prose, and conservatively recognizes the legacy fallback form `[File.jsx:L10-L20]` for common source/text file extensions. Protocol links are preferred because filenames containing spaces, paths, or special characters can be encoded without ambiguity.

`SourceCitation` is controlled. Integration supplies `onOpen({ fileName, startLine, endLine })`; the Workbench integration layer is responsible for opening the Source tab, selecting the file, scrolling to the range, and highlighting it. Optional `preview` text/lines are exposed on hover and keyboard focus without changing navigation semantics.
