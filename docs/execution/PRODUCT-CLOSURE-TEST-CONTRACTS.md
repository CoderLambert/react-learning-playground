# Product Closure Test Contracts

This branch contains tests only. It is intentionally based on `main` so the integration branch can cherry-pick the contracts independently of the product implementations.

## Contract groups

- `tests/product-closure-contract.test.mjs`
  - Assessment optimistic revision conflict.
  - Soft-delete (`retire`) semantics.
  - In-progress session snapshot isolation.
  - Conversation Markdown/JSON serialization contract once the export helper is present.
  - Legacy editable ChapterCheckpoint question-bank removal once the single-source cleanup is present.
- `tests/e2e/product-closure-ai.spec.js`
  - Long AI answers scroll inside the transcript while the composer remains visible.
  - Message copy/follow-up controls remain reachable at the bottom of a long response.
  - Current-conversation copy, Markdown export and JSON export are exposed through accessible controls.
- `tests/e2e/product-closure-assessment.spec.js`
  - Edit fields for the new Assessment question manager.
  - Retire/soft-delete and retired-question visibility.
  - Stale revision conflict refresh rather than overwrite.
  - In-progress session snapshot isolation after edit/retire.
  - Legacy editable localStorage question-bank UI is absent.

## Integration expectations

On this branch alone, the Assessment domain Node contracts run against functionality already present on `main`. The export-helper and legacy-question-bank source contracts use conditional Node-test skips until their corresponding feature branches are merged.

The Playwright specs are intentionally not executed in this branch. `product-closure-ai.spec.js` requires the AI product-closure implementation. The management and legacy-removal cases in `product-closure-assessment.spec.js` require the Assessment management UI and single-source cleanup implementations respectively.

After integrating the product branches, run the normal Node contract suite first, then the full Playwright suite locally. Do not weaken selectors to implementation CSS classes unless no semantic role/label contract exists.
