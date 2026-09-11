# Chapter Review Exercises Status

Base `main` SHA: `95f6b3cdd1634fcb65a5bb9f361594c53b02710e`

Branch: `feat/chapter-review-exercises`

## Design

The review layer is implemented with one reusable `ChapterCheckpoint` component and a data-driven chapter map. It does not add a new navigation category or duplicate twelve large Demo components.

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

- `src/components/ChapterCheckpoint.jsx` — chapter data, chapter-end mapping, reusable UI.
- `src/App.jsx` — injects checkpoints in focused and continuous-reading modes.
- `tests/e2e/chapter-checkpoints.spec.js` — verifies all twelve chapter boundaries and continuous mode.

`src/demos/index.js` does not require changes because no new Demo/category is introduced. Existing navigation count, category structure, and `?raw` registrations remain intact.

## Validation

Validation must be recorded from actual execution after this branch is pushed/opened as a PR:

- `npm ci`: PENDING
- `npm run lint`: PENDING
- `npm run build`: PENDING
- `npm run test:e2e`: PENDING

The PR-triggered `React Learning Verify` workflow is the authoritative CI evidence for this branch. This document must be updated if validation fails or exposes additional debt.

## Manual debt

- The exercises intentionally have no answer key.
- Content-review branches may later refine wording; this feature is structurally isolated so those edits can be reconciled without changing the checkpoint architecture.
