# React Learning Workbench Integration Status

## Baseline

- Base branch: `integration/react-learning-workbench`
- Exact base SHA: `ac899deeedddd2a6286f76213ea412320d4603c4`
- Integration branch: `feat/workbench-integration`
- Validated implementation head: `de08b2852d108613283f18e59969053cef9ac521`
- Base includes Workbench Foundation plus merged PRs #23, #24, #25, #26, and #28.

## Wiring decisions

- `src/App.jsx` composes `WorkbenchShell` with `WorkbenchNavigation`, the existing demo workspace, and `LearningInspector`.
- Existing `src/demos/index.js` remains authoritative; no 58-entry registry rewrite was performed.
- `useDemoUrlState` owns shareable `?demo=<learning-unit-id>` state; switching to continuous/all mode leaves the last focused demo query intact.
- `usePersistedWorkbenchState` owns navigation collapsed state, inspector open state, inspector width, active inspector tab, and selected source file.
- Focus Mode stays transient application state and exits with Escape.
- Focused mode moves source viewing into the Inspector. Continuous reading retains the existing inline `CodeViewer` for each demo, preserving the long-form review workflow and raw-source registrations.
- Shell inspector column width is driven from the persisted inspector width through the existing Workbench CSS variable contract.
- `SourceViewer` / shared `CodeViewer` are lazy-loaded from the Inspector source tab instead of inflating the default application path.
- Mobile inspector presentation is full-screen while open; mobile navigation remains a drawer managed by the shell.

## Reference MDX notes

Exactly three reference notes are included:

1. `state-snapshot-queue` — State Snapshot, batching, update queue, functional updater, Trigger → Render → Commit.
2. `effect-event` — Event vs Effect responsibility boundaries and Effect Event usage.
3. `rendering-strategies` — CSR / SSG / SSR / hydration / RSC / Server-Client boundary distinctions.

The notes use the approved MDX teaching primitives and treat the center Demo as the experiment rather than embedding a duplicate Demo runtime.

## Browser coverage

Integration coverage includes:

- navigation collapse/reopen
- focused demo selection and `?demo=` persistence
- invalid demo URL canonicalization
- lazy reference-note rendering and missing-note fallback
- Notes / Source switching
- SourceViewer multi-file switching and copy feedback
- keyboard and pointer inspector resizing
- inspector collapse/reopen
- Focus Mode and Escape exit
- mobile full-screen inspector presentation
- TOC visibility for a reference note
- existing all-demo/search/chapter/demo regression coverage
- browser page-error / console-error / warning diagnostics
- axe WCAG 2 A/AA shell and modal checks

## Validation

Validated implementation head: `de08b2852d108613283f18e59969053cef9ac521`.

`Workbench Integration Verify` run `34579673794`: **PASS**

- `npm ci`: PASS — 234 packages installed, 0 vulnerabilities.
- `npm run lint`: PASS — 0 errors, 8 warnings. The warnings are inherited/module-boundary telemetry in LearningInspector, Workbench re-exports and existing state hooks; no integration error is hidden by them.
- `npm run build`: PASS — Vite 8.2.2, 275 modules transformed.
- Reference MDX remains split into lazy chunks: `effect-event` ~5.44 kB, `state-snapshot-queue` ~5.62 kB, `rendering-strategies` ~6.37 kB before gzip.
- `npx playwright install --with-deps chromium`: PASS.
- `CI=true npm run test:e2e`: PASS — **15/15 Chromium tests**.
- Production Vite preview HTTP smoke: PASS at `/react-learning-playground/`.

`Workbench State URL Verify` run `34579673797`: **PASS** on the same implementation head, including focused state/URL tests, lint, build, Chromium E2E, and storage/URL regression coverage.

This status-only evidence commit is subsequently validated by the same PR checks before the branch is considered final.

## Deferred work

- Remaining learning-unit MDX notes beyond the three reference notes.
- Real screen-reader acceptance testing.
- Non-Chromium browser coverage unless added by a later cross-browser verification stream.
