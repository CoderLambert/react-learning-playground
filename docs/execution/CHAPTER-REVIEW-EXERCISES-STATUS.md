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

PR-triggered `React Learning Verify` run `34566975858` on commit `d1f5458e601c34749340f9d6815f872606d121b4` completed successfully before the lint-cleanup follow-up commit:

- `npm ci`: **PASS** — 122 packages installed; 0 vulnerabilities.
- `npm run lint`: **PASS** — 0 errors. The first run reported 23 warnings, including one newly introduced Fast Refresh warning in `ChapterCheckpoint.jsx`; that new warning is removed by the follow-up split into `chapterCheckpointMap.js`.
- `npm run build`: **PASS** — Vite production build completed.
- `npm run test:e2e`: **PASS** — 12 Chromium tests passed in 22.8s, including both new checkpoint tests.
- production preview smoke: **PASS** — base-path preview became healthy and returned the expected app root.

The follow-up commit must receive the same PR CI gate before merge; no PASS is inferred for the new head until that workflow completes.

## Manual debt

- Exercises intentionally have no answer key.
- Existing repository lint warnings outside this feature remain separate cleanup debt; this feature should add no new warning after the follow-up split.
- Content-review branches may later refine wording; this feature is structurally isolated so those edits can be reconciled without changing checkpoint architecture.
