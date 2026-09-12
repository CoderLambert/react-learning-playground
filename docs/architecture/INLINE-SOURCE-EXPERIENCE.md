# Inline Source Experience

## Status

**Retired from lesson composition.**

The original implementation rendered a second `SourceViewer` directly below every Demo while also keeping the Learning Inspector source tab. That made source code easier to discover, but it duplicated the same reading surface and did not solve the more important learning question: “which source produced the UI element I am looking at?”

The replacement architecture is documented in `docs/architecture/VISUAL-SOURCE-LOCATOR.md`.

## Current source-learning model

The product now uses one full source workspace:

`Demo UI -> Visual Source Locator -> Learning Inspector -> SourceViewer -> CodeViewer -> Shiki`

Other navigation routes converge on the same Inspector workspace:

- `source://` AI citations;
- AST semantic regions such as Reducer / Effect / Component / Hook;
- manual source-file tabs.

The main lesson column no longer renders an Inline Source accordion.

## What remains from the original implementation

The useful shared infrastructure is preserved:

- `LearningUnit.sources` remains the authoritative source text contract;
- `SourceViewer` / `CodeViewer` remain the shared source-reading stack;
- Shiki highlighting and bounded cache remain shared;
- source-file identity remains stable across Inspector, AI context and citations;
- semantic source metadata remains enhancement-only;
- `sourceFocus` remains the common `{ fileName, startLine, endLine }` navigation contract.

## Why the interaction changed

The old flow was:

`Demo -> expand source -> inspect code -> infer which lines correspond to the UI`

The current flow is:

`Demo -> hover/click rendered element -> exact JSX range opens in Inspector`

This preserves progressive disclosure while removing the duplicate reader and making rendered UI the primary navigation affordance.

## Compatibility note

`SourceViewer` may retain internal compatibility branches for the previous inline mode while migration settles, but the application shell must not compose a second source reader in the lesson column. New work should target the Visual Source Locator plus the Inspector source workspace.
