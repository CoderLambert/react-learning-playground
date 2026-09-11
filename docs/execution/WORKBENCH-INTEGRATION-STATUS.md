# React Learning Workbench Integration Status

## Baseline

- Base branch: `integration/react-learning-workbench`
- Exact base SHA: `ac899deeedddd2a6286f76213ea412320d4603c4`
- Integration branch: `feat/workbench-integration`
- Base includes Workbench Foundation plus merged PRs #23, #24, #25, #26, and #28.

## Wiring decisions

- `src/App.jsx` now composes `WorkbenchShell` with `WorkbenchNavigation`, the existing demo workspace, and `LearningInspector`.
- Existing `src/demos/index.js` remains authoritative; no 58-entry registry rewrite was performed.
- `useDemoUrlState` owns shareable `?demo=<learning-unit-id>` state; switching to continuous/all mode leaves the last focused demo query intact.
- `usePersistedWorkbenchState` owns navigation collapsed state, inspector open state, inspector width, active inspector tab, and selected source file.
- Focus Mode stays transient application state and exits with Escape.
- Focused mode moves source viewing into the Inspector. Continuous reading retains the existing inline `CodeViewer` for each demo, preserving the long-form review workflow and raw-source registrations.
- Shell inspector column width is driven from the persisted inspector width through the existing Workbench CSS variable contract.
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

## Validation

Final validation is executed by `.github/workflows/workbench-integration-verify.yml` on the exact pull-request head and runs:

- `npm ci`
- `npm run lint`
- `npm run build`
- `npx playwright install --with-deps chromium`
- `CI=true npm run test:e2e`
- production Vite preview HTTP smoke at `/react-learning-playground/`

Final run evidence is recorded below after the exact-head run completes.

## Deferred work

- Remaining learning-unit MDX notes beyond the three reference notes.
- Real screen-reader acceptance testing.
- Non-Chromium browser coverage unless added by a later cross-browser verification stream.
