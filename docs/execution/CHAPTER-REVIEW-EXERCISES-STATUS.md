# Chapter Review Exercises Status

Base `main` SHA: `95f6b3cdd1634fcb65a5bb9f361594c53b02710e`

Branch: `feat/chapter-review-exercises`

## Design

The review layer uses a reusable `ChapterCheckpoint` component plus a small chapter-end mapping utility. It does not add a new navigation category or duplicate twelve large Demo components.

A checkpoint is rendered immediately after the existing CodeViewer for the final Demo of each chapter. Continuous-reading mode renders the same checkpoint at the corresponding chapter boundary.

Each chapter contains 5–6 mental-model/boundary questions and 3 exercises. No solutions or answer keys are included.

## Chapter checkpoint locations

| Chapter | Existing chapter-end Demo | Questions | Exercises |
| --- | --- | ---: | ---: |
| 01 | `prop-drilling` | 5 | 3 |
| 02 | `render-commit` | 5 | 3 |
| 03 | `use-reduce-with-context` | 5 | 3 |
| 04 | `advanced-ref` | 5 | 3 |
| 05 | `optimistic-update` | 5 | 3 |
| 06 | `transition-deferred` | 6 | 3 |
| 07 | `react-compiler` | 5 | 3 |
| 08 | `portal-third-party` | 5 | 3 |
| 09 | `server-state-mutation` | 6 | 3 |
| 10 | `route-data-boundary` | 6 | 3 |
| 11 | `typescript-react` | 6 | 3 |
| 12 | `server-functions-framework` | 6 | 3 |

Total: 65 questions, 36 exercises.

## Files

- `src/components/ChapterCheckpoint.jsx` — chapter content and reusable UI.
- `src/components/chapterCheckpointMap.js` — maps existing chapter-end Demo IDs to chapters.
- `src/App.jsx` — injects checkpoints in focused and continuous-reading modes.
- `tests/e2e/chapter-checkpoints.spec.js` — verifies all twelve chapter boundaries and continuous mode.

`src/demos/index.js` is unchanged because no new Demo/category is introduced. Existing navigation count, category structure, and `?raw` registrations remain intact.

## Validation

PR-triggered `React Learning Verify` run `34567160110` validated executable commit `e5d4da5393b90831b76c49d3f841323c8b680236` after the Fast Refresh cleanup:

- `npm ci`: **PASS** — 122 packages installed; audit reported 0 vulnerabilities.
- `npm run lint`: **PASS** — 0 errors and 22 pre-existing repository warnings. The checkpoint feature adds no new lint warning.
- `npm run build`: **PASS** — Vite production build completed successfully.
- `npm run test:e2e`: **PASS** — 12 Chromium tests passed in 22.1s, including both chapter-checkpoint tests.
- production preview smoke: **PASS** — `/react-learning-playground/` became healthy and returned the expected app root.

The final status-only documentation commit changes no executable source; the PR's final-head CI remains the merge gate.

## Manual debt

- Exercises intentionally have no answer key.
- Existing repository lint warnings outside this feature remain separate cleanup debt.
- Content-review branches may later refine wording; this feature is structurally isolated so those edits can be reconciled without changing checkpoint architecture.
