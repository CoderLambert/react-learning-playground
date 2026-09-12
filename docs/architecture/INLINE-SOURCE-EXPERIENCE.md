# Inline Source Experience

## Decision

Learning source code is a first-class part of the lesson flow, not an inspector-only utility.

Every demo exposes the same authoritative source set in two complementary surfaces:

1. **Inline source** — collapsed by default under the demo so the learner can reveal implementation without leaving the lesson flow.
2. **Learning Inspector source** — persistent, resizable source workspace for longer reading, citation focus and cross-file inspection.

AI/source citations remain a third navigation surface, but they resolve into the same `LearningUnit.sources` data.

## Product principles

### Keep demo and implementation in one learning context

The default path is:

`explanation -> interactive demo -> inline implementation -> semantic region -> deeper inspector`

The learner should not be forced to change panels merely to answer “how is this demo implemented?”.

### Progressive disclosure

Inline source is collapsed by default. Large source files must not dominate the chapter layout or push subsequent teaching content several screens away.

When expanded, the inline viewport is height-bounded and scrollable. The inspector remains unbounded for deep reading.

### One source of truth

Source text comes from the demo registry `files` entries and is normalized as `LearningUnit.sources`.

Do not copy implementation snippets into lesson Markdown/MDX merely to support inline viewing. Duplicated teaching snippets drift from the executable demo and create a second maintenance contract.

### Consistent file identity

A source file `name` is the stable identity shared by:

- inline file tabs;
- inspector file tabs;
- AI context selection;
- `source://` citations;
- semantic source manifest lookup.

Switching the inline active file in focused mode updates the same persisted source-file selection used by the inspector. “在源码面板打开” therefore hands off to the exact file and selected source range the learner is already reading.

## Technical architecture

```text
src/demos/index.js (?raw source)
          |
          +----------------------+
          |                      |
          v                      v
    LearningUnit.sources   build-time AST manifest
          |                      |
          +----------+-----------+
                     v
                SourceViewer
                 /        \
          inline mode   inspector mode
               |             |
               +------ CodeViewer ------+
                          |
                          v
                   shared Shiki cache
```

`SourceViewer` owns source-surface and semantic-navigation behavior. `CodeViewer` owns file tabs, expansion, copy behavior, syntax highlighting and focus-range rendering.

The application does not create a second source rendering implementation for inline mode or semantic mode.

## Rendering and performance

- Shiki is still loaded lazily through the existing highlighter path.
- Inline viewers do not request highlighting until expanded.
- Highlight results are cached in a bounded shared cache, so opening the same file inline and then in the inspector does not repeat the expensive Shiki transform.
- The cache is bounded to avoid retaining arbitrary source strings for the full application lifetime.
- `CodeViewer` validates cached HTML against the current source text, preventing stale highlighting when a component instance receives a different file with the same name.
- Semantic parsing happens at build/dev-server time and adds no parser dependency to the browser bundle.

## Responsive behavior

Desktop/tablet:

- inline disclosure lives in the main lesson column;
- semantic controls remain horizontally scrollable when several regions exist;
- inspector remains available as the deeper workspace;
- expanded inline source is capped to a useful reading height.

Narrow screens:

- header controls may wrap;
- semantic controls remain touch-scrollable;
- source remains full-width in the lesson column;
- no dependency on the inspector being visible side-by-side.

A future mobile bottom-sheet can be added without changing the `LearningUnit.sources` or `SourceViewer` contracts.

## Source regions and “core implementation”

This layer is implemented by `docs/architecture/SEMANTIC-SOURCE-MANIFEST.md`.

The source viewer now supports semantic regions such as `Reducer`, `Event`, `Effect`, `Provider`, `Context`, `Component` and relevant React hooks. Line numbers remain generated output rather than authored metadata.

The implementation rules are:

1. generate a source manifest at build time from registered JS/JSX/TS/TSX source ASTs;
2. address regions by symbol/hook identity;
3. resolve symbol -> current line range during build;
4. let inline viewers default to `核心实现` and always provide `完整文件`;
5. keep `source://...#Lx-Ly` as the resolved evidence/navigation format rather than the authoring source of truth.

## Rollout rules

New demos automatically receive inline source because the feature is wired at the lesson composition layer, not by editing every demo component.

A demo is source-ready when:

- its registry entry contains at least one `{ name, code }` source;
- the first source is the primary demo implementation;
- supporting files use stable, unique names where practical;
- source shown to learners is executable/current rather than a hand-copied teaching variant.

Semantic metadata is enhancement-only: if one source cannot be semantically parsed, full-file source viewing remains available.

## Verification gates

Changes to source presentation should preserve:

- inspector source switching;
- syntax highlighting;
- source citation focus;
- semantic-region focus;
- copy behavior;
- inline collapsed-by-default behavior;
- inline-to-inspector active-file/range handoff;
- continuous-reading source disclosures;
- JS/JSX/TS/TSX source parsing coverage;
- lint/build/content/AI/browser contract checks.
