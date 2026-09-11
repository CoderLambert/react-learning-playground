# React Learning Workbench — Final Acceptance Status

## Baseline

- Integration branch: `integration/react-learning-workbench`
- Exact integration base SHA: `fca8d002e1f6b9ec51f7343554d4dc990dd61823`
- Acceptance branch: `chore/workbench-final-acceptance`
- Scope classification at start: validation-only. No product defect was reproduced before acceptance execution.
- Required merged lineage confirmed in the integration history: PRs #29, #30, #31, #32, #33 and E2E correction #34.

## Coverage audit

### Learning units and notes

The final integration tree contains the complete Workbench registry plus the production note set assembled by the four chapter-note PRs and the three reference notes.

Expected production coverage:

- Ch01–03 bulk notes: 17
- Ch04–06 bulk notes: 16
- Ch07–09 bulk notes: 11
- Ch10–12 bulk notes: 11
- Existing reference notes: 3 (`state-snapshot-queue`, `effect-event`, `rendering-strategies`)
- Total production notes: **58/58**

`runtime-smoke.mdx` remains a compiler/runtime fixture and is not counted as a production learning-unit note.

A dedicated final-acceptance Playwright test now requires exactly 58 navigation learning units and opens every one of them, requiring `.note-runtime-content` to render and rejecting both the production missing-note fallback and note runtime error state.

### Chapter checkpoints

The existing checkpoint browser suite requires one checkpoint for every chapter boundary and exactly **12** checkpoints in continuous-reading mode. This remains part of the full final E2E run.

## Browser acceptance matrix

The existing suite plus `tests/e2e/workbench-final-acceptance.spec.js` covers:

- 58-demo navigation and runtime stability
- 58/58 production note loading with no missing-note fallback
- 12 chapter checkpoints
- navigation collapse/reopen and search
- focused/all modes
- valid demo URL restore and invalid-id canonicalization
- Notes / Source switching
- note TOC availability
- Source multi-file switching and copy feedback
- inspector keyboard resize and pointer resize when a stable bounding box is available
- inspector collapse/reopen
- Focus Mode and Escape exit
- persisted Workbench state across refresh
- desktop Workbench interaction at 1440x900 in the final acceptance coverage test
- mobile 390x844 full-screen inspector presentation
- keyboard/focus/modal accessibility interactions
- automated axe checks already present in the accessibility suite
- automatic browser diagnostics fail the suite on page errors, console errors, or console warnings
- GitHub Pages base path `/react-learning-playground/` and `?demo=props` refresh stability

## Deterministic validation

Final executable evidence is provided by the PR-triggered `Workbench Integration Verify` workflow on the exact acceptance branch head. It runs:

1. `npm ci`
2. `npm run lint`
3. `npm run build`
4. `npx playwright install --with-deps chromium`
5. `CI=true npm run test:e2e`
6. production Vite preview HTTP smoke at `/react-learning-playground/`

Results are **PENDING** until the exact-head workflow completes. No PASS is claimed in advance.

## Defects found / fixed

- None reproduced at branch creation time.
- The earlier missing-note E2E assumption was already corrected by PR #34 before this acceptance branch was created; final acceptance explicitly verifies that all 58 production demos now have notes.

## Remaining manual debt

- Real screen-reader validation: **PENDING**. Axe, DOM semantics and keyboard tests are not substitutes for a real screen reader.
- Non-Chromium cross-browser validation: **PENDING** unless separately executed.

## Final disposition

Pending exact-head CI and browser evidence. This branch must not be merged into `integration/react-learning-workbench` until the final workflow is green. It must not be merged or opened directly against `main` as part of this acceptance task.
