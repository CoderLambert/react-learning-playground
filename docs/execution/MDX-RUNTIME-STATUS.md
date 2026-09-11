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

`noteRegistry.js` uses the default lazy form of `import.meta.glob`; there is no `eager: true` option and no manual list of note imports. Vite therefore represents discovered notes as dynamic import loaders once the runtime is wired into the Workbench.

`src/content/notes/runtime-smoke.mdx` is a small runtime compilation fixture, not a production/reference lesson. The dedicated validation run compiled it independently with Vite SSR and produced `runtime-smoke.js` (1.77 kB / 0.65 kB gzip), proving MDX + GFM + JSX compilation. The normal application bundle remained unchanged because NoteViewer is intentionally not wired into `App.jsx` in this stream; this also confirms the MDX runtime does not add an eager note payload to the current initial bundle.

## Validation

Implementation code head `02bade609fcd1640082a099d2614fd4a5b47cc31`:

- `npm ci`: **PASS** — 234 packages installed, 0 vulnerabilities.
- `npm run lint`: **PASS** — 0 warnings, 0 errors.
- `npm run build`: **PASS**.
- Chromium E2E: **PASS** — 12/12 tests.
- production preview HTTP smoke: **PASS**.
- React Learning Verify run `34576843920`: **PASS**.

MDX-specific validation on parent implementation `e5dc3814e5440cdac62be6bd2648fb9e83bf74d2`:

- lazy `import.meta.glob` contract check: **PASS**.
- `eager: true` absence check: **PASS**.
- standalone Vite SSR compilation of `runtime-smoke.mdx`: **PASS**.
- resulting smoke artifact: `runtime-smoke.js` 1.77 kB / 0.65 kB gzip.
- Chromium E2E: **PASS** — 12/12.
- preview HTTP smoke: **PASS**.
- dedicated MDX Runtime Verify run `34576615251`: **PASS**.

The temporary validation workflow removed itself after a successful run and is not part of the final feature diff.

The existing app is intentionally not wired to NoteViewer yet, so current E2E remains a regression gate rather than an Inspector/Notes UI test in this stream. Runtime wiring belongs to the integration worker.
