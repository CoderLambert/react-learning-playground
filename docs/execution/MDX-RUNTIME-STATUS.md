# MDX Runtime Status

Branch: `feat/mdx-runtime`

Base integration branch: `integration/react-learning-workbench`

## Scope

This stream implements the Workbench MDX note runtime only. It does not wire the runtime into `App.jsx`, implement the teaching-component visual library, migrate CodeViewer/SourceViewer, add Workbench shell/inspector behavior, introduce URL state, or author production learning notes.

## Runtime implementation

- Vite MDX compilation via `@mdx-js/rollup`.
- React MDX provider support via `@mdx-js/react`.
- GitHub-Flavored Markdown via `remark-gfm`.
- stable heading IDs via `rehype-slug`.
- lazy note discovery with `import.meta.glob("../content/notes/*.mdx")`.
- stable `getNoteLoader(learningUnitId)` contract preserved.
- missing notes resolve to `null` and remain a non-fatal migration state.
- `NoteViewer` provides loading, missing and error states without owning Inspector UI.
- `collectNoteToc` + `NoteToc` provide heading/TOC infrastructure for the future Inspector integration.
- external links rendered by the runtime receive safe new-tab attributes.

## Lazy-loading evidence

`noteRegistry.js` uses the default lazy form of `import.meta.glob`; no `eager: true` option and no manual list of note imports exists. Vite therefore represents discovered notes as dynamic import loaders. `src/content/notes/runtime-smoke.mdx` is a temporary small compilation fixture so the production build can prove an MDX note is emitted separately; it is not a reference/content lesson.

## Validation

Pending exact-head CI execution:

- `npm ci`: PENDING
- `npm run lint`: PENDING
- `npm run build`: PENDING
- Chromium E2E: PENDING
- preview HTTP smoke: PENDING

The existing app is intentionally not wired to NoteViewer yet, so existing E2E remains a regression gate rather than an Inspector/Notes UI test in this stream.
