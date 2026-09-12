# Inline Source Experience

## Decision

Learning source code is a first-class part of the lesson flow, not an inspector-only utility.

Every demo exposes the same authoritative source set in two complementary surfaces:

1. **Inline source** — collapsed by default under the demo so the learner can reveal implementation without leaving the lesson flow.
2. **Learning Inspector source** — persistent, resizable source workspace for longer reading, citation focus and cross-file inspection.

AI/source citations remain a third navigation surface, but they resolve into the same `LearningUnit.sources` data.

## Product principles

### Keep demo and implementation in one learning context

The default path should be:

`explanation -> interactive demo -> inline implementation -> deeper inspector`

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
- `source://` citations.

Switching the inline active file in focused mode updates the same persisted source-file selection used by the inspector. “在源码面板打开” therefore hands off to the exact file the learner is already reading.

## Technical architecture

```text
src/demos/index.js (?raw source)
          |
          v
    LearningUnit.sources
          |
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

`SourceViewer` owns source-surface semantics. `CodeViewer` owns file tabs, expansion, copy behavior, syntax highlighting and focus-range rendering.

The application should not create a second source rendering implementation for inline mode.

## Rendering and performance

- Shiki is still loaded lazily through the existing highlighter path.
- Inline viewers do not request highlighting until expanded.
- Highlight results are cached in a bounded shared cache, so opening the same file inline and then in the inspector does not repeat the expensive Shiki transform.
- The cache is bounded to avoid retaining arbitrary source strings for the full application lifetime.
- `CodeViewer` validates cached HTML against the current source text, preventing stale highlighting when a component instance receives a different file with the same name.

## Responsive behavior

Desktop/tablet:

- inline disclosure lives in the main lesson column;
- inspector remains available as the deeper workspace;
- expanded inline source is capped to a useful reading height.

Narrow screens:

- header controls may wrap;
- source remains full-width in the lesson column;
- no dependency on the inspector being visible side-by-side.

A future mobile bottom-sheet can be added without changing the `LearningUnit.sources` or `SourceViewer` contracts.

## Source regions and “core implementation”

The next source-navigation layer should support semantic regions such as `Reducer`, `Event Handler`, `Effect`, `Provider`, etc. Do **not** standardize manually maintained line ranges as authored metadata: line numbers drift on ordinary edits.

Preferred future implementation:

1. generate a source manifest at build time from JS/JSX/TS/TSX ASTs;
2. address regions by symbol/export identity;
3. resolve symbol -> current line range during build;
4. let inline viewers offer semantic tabs such as `核心实现` / `完整文件`;
5. keep `source://...#Lx-Ly` as a resolved navigation format rather than the authoring source of truth.

Until that manifest exists, the product renders the authoritative full file rather than introducing fragile pseudo-symbol parsing.

## Rollout rules

New demos automatically receive inline source because the feature is wired at the lesson composition layer, not by editing every demo component.

A demo is source-ready when:

- its registry entry contains at least one `{ name, code }` source;
- the first source is the primary demo implementation;
- supporting files use stable, unique names where practical;
- source shown to learners is executable/current rather than a hand-copied teaching variant.

## Verification gates

Changes to source presentation should preserve:

- inspector source switching;
- syntax highlighting;
- source citation focus;
- copy behavior;
- inline collapsed-by-default behavior;
- inline-to-inspector active-file handoff;
- continuous-reading source disclosures;
- lint/build/content/AI contract checks.
