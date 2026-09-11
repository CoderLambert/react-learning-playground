# React Learning Workbench — Final Acceptance Status

## Baseline

- Integration branch: `integration/react-learning-workbench`
- Exact integration base SHA: `fca8d002e1f6b9ec51f7343554d4dc990dd61823`
- Acceptance branch: `chore/workbench-final-acceptance`
- Exact executable validation head: `265527d9129722fcf77b1829530228e41134d7da`
- Scope classification: validation-only; no product defect was reproduced.
- Required merged lineage confirmed in integration history: PRs #29, #30, #31, #32, #33 and E2E correction #34.

## Coverage audit

### Learning units and notes

Production note coverage is **58/58**:

- Ch01–03 bulk notes: 17
- Ch04–06 bulk notes: 16
- Ch07–09 bulk notes: 11
- Ch10–12 bulk notes: 11
- Existing reference notes: 3 (`state-snapshot-queue`, `effect-event`, `rendering-strategies`)

`runtime-smoke.mdx` remains a compiler/runtime fixture and is not counted as a production learning-unit note.

Executable evidence: `tests/e2e/workbench-final-acceptance.spec.js` requires exactly 58 navigation learning units, opens every one, requires `.note-runtime-content`, and rejects both the production missing-note fallback and note runtime error state. This test passed in final workflow run `34583466400`.

### Chapter checkpoints

Existing checkpoint browser coverage passed for:

- one checkpoint at every chapter boundary
- exactly **12** checkpoints in continuous-reading mode

## Browser acceptance matrix

Final Chromium E2E: **PASS — 17/17**.

Covered by the existing suite plus `tests/e2e/workbench-final-acceptance.spec.js`:

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
- desktop acceptance at 1440x900
- mobile 390x844 full-screen inspector presentation
- keyboard/focus/modal accessibility interactions
- automated axe checks for the shell and modal
- automatic failure on page errors, console errors, or console warnings
- GitHub Pages base path `/react-learning-playground/` and `?demo=props` refresh stability

## Deterministic validation

Authoritative run: `Workbench Integration Verify` run `34583466400` against executable head `265527d9129722fcf77b1829530228e41134d7da`.

Results:

1. `npm ci` — **PASS**; 234 packages installed, 0 vulnerabilities.
2. `npm run lint` — **PASS**; 0 errors, 8 existing warnings.
3. `npm run build` — **PASS**; Vite 8.2.2, 330 modules transformed.
4. `npx playwright install --with-deps chromium` — **PASS**.
5. `CI=true npm run test:e2e` — **PASS, 17/17** in 55.9 s.
6. Production Vite preview HTTP smoke — **PASS** at `/react-learning-playground/`.

The 8 lint warnings are existing non-blocking/module-boundary warnings and were not opportunistically rewritten because they did not cause an acceptance failure.

## Defects found / fixed

- No product defect was reproduced.
- The first acceptance run failed only because the new acceptance test expected the navigation label text `Props 基础与解构` inside the Demo heading, while the actual heading is `Props 基础传递、解构与派生计算`. The assertion was narrowed to the stable semantic prefix `Props 基础`; no product code changed.
- The earlier production missing-note E2E assumption had already been corrected by PR #34 before this acceptance branch was created.

## Remaining manual debt

- Real screen-reader validation: **PENDING**. Axe, DOM semantics and keyboard tests are not substitutes for a real screen reader.
- Non-Chromium cross-browser validation: **PENDING**.

## Final disposition

**PASS for automated final acceptance on Chromium.** PR #35 is ready for review/merge into `integration/react-learning-workbench`. This task intentionally does not merge PR #35 and does not open or merge anything directly to `main`.

The status-recording commit after the validated executable head changes documentation only; executable source/tests remain the exact validated tree from `265527d9129722fcf77b1829530228e41134d7da`.
