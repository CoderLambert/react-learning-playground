# Semantic Source Manifest

## Status

Implemented as a secondary source-navigation layer inside the Learning Inspector and as compact metadata for AI source context.

The primary learner interaction for rendered UI is now the Visual Source Locator documented in `docs/architecture/VISUAL-SOURCE-LOCATOR.md`.

The semantic manifest answers a different question: “where is the Reducer / Effect / Component / Hook implementation in this file?” It does not try to infer which rendered DOM node the learner clicked.

## Product role

Current source navigation routes are:

```text
rendered Demo element -> Visual Source Locator --+
                                                |
AI source:// citation --------------------------+--> sourceFocus -> Learning Inspector -> SourceViewer
                                                |
semantic concept / symbol ----------------------+ 
```

The authoritative source remains the exact registered `?raw` source text. Semantic metadata is navigation-only.

## Learner experience

When semantic metadata exists for the active Inspector source file:

- the source workspace exposes regions such as `Reducer`, `Effect`, `Component`, `Hook`, `Event`, `Context`, `Provider`, `Ref`, action and concurrency hooks;
- selecting a region highlights and scrolls to its current source range;
- **完整文件** clears semantic focus;
- copying while a semantic region is selected copies that implementation range;
- an external `sourceFocus` from the Visual Source Locator or an AI `source://` citation takes precedence over semantic selection.

The Inspector defaults to full-file reading because it is the single deep-reading source workspace.

## Why build-time AST instead of authored line ranges

Line numbers are output, not authoring input.

The project must not store metadata such as:

```js
{ label: "Reducer", startLine: 12, endLine: 53 }
```

Those ranges drift during formatting, comments and refactors.

Instead, Vite generates the manifest from the exact source files registered in `src/demos/index.js`. Current ranges are resolved from parser AST on each dev/build start.

## Parser architecture

The plugin is implemented in `build/sourceSemanticManifestPlugin.js` and uses the Vite/Rolldown plugin-context `this.parse` API, backed by Oxc.

Supported source languages:

- JavaScript;
- JSX;
- TypeScript;
- TSX.

No semantic parser is shipped to the browser.

```text
src/demos/index.js
       |
       | registry AST
       v
registered ?raw imports
       |
       | exact physical paths
       v
Rolldown/Oxc AST per source
       |
       v
semantic regions + current line ranges
       |
       v
virtual:source-semantic-manifest
       |
       +--> LearningUnit.sources[].semantics
       +--> Learning Inspector navigation
       +--> AI context navigation hints
       +--> Visual Source Locator physical-path resolution
```

## Registry resolution

The manifest resolves learner-facing file names through the registry rather than guessing from basenames.

That matters for aliases where the display name and physical filename differ. Each source metadata entry therefore retains its physical repository `path`, which is also used by the Visual Source Locator to map build-generated JSX locations back to the correct learner-facing source tab.

## Region model

Each region contains:

- stable generated `id` within the source file;
- semantic `kind`;
- symbol name;
- current `startLine` / `endLine`;
- optional hook and parent-symbol metadata;
- navigation score used to choose a primary region.

Recognized kinds include Component, Reducer, Effect, Custom Hook, Context, Provider, Event Handler, State, Memo, Callback, Ref, concurrency/action hooks, external-store hooks and related helpers.

## Primary region scoring

The generated primary region is a navigation heuristic, not factual truth.

Scoring considers:

- semantic role;
- exported/top-level status;
- source filename relevance;
- lesson concept relevance;
- specific lesson signals such as reducer/effect/context/memo/callback/ref/action/concurrency concepts.

A learner can always select another region or return to the complete file.

## Source-focus precedence

The source workspace follows this precedence:

1. externally supplied `sourceFocus` from Visual Source Locator or AI citation;
2. user-selected semantic region;
3. full file.

Selecting a semantic region clears the old external focus. Selecting **完整文件** clears semantic focus.

## AI integrity rule

Semantic metadata is only a navigation index. AI answers must still cite actual numbered source lines.

When source text is truncated by AI context limits, semantic regions are included only when their full range remains inside the included source text. Metadata must never point the model to evidence it cannot inspect.

## Failure behavior

Semantic analysis failure for one registered source does not make the source unreadable. That file receives empty semantic regions while full source text remains available.

Registry-level resolution failure remains fatal because unsafe file mapping would break source identity across Inspector, AI citations and Visual Source Locator.

## Verification gates

Changes to the semantic layer should preserve:

- JS/JSX/TS/TSX manifest generation;
- reducer/effect/component/hook region detection;
- Inspector semantic navigation;
- full-file fallback;
- external source-focus precedence;
- AI truncation integrity;
- physical-path identity for Visual Source Locator resolution;
- build/lint/content/AI/browser checks.
