# Assessment E2E ownership matrix

Issue #245 audit result at execution base `c953fa22a861cf2ae98bf4911efa03eafe527cc4`.

## Browser-suite ownership

The three Assessment browser suites have different canonical boundaries. The
interactions that appear in more than one file are setup for a different
assertion, or exercise a different mutation path.

| Behavior | Canonical browser owner | Evidence / boundary |
| --- | --- | --- |
| Question creation through the AI/tool path | `tests/e2e/assessment-lifecycle.spec.js` — `AI create persists a recoverable snapshot session and completes after reload` | Asserts the provider tool request, persisted questions, session, attempts, and tool continuation. `product-closure-assessment.spec.js` creates a question only as setup for management mutations. |
| Session start and attempt persistence | `tests/e2e/assessment-lifecycle.spec.js` — same lifecycle journey | Reads the Assessment stores before and after reload and verifies session/attempt counts and completion state. |
| Reload recovery from an in-progress session | `tests/e2e/assessment-lifecycle.spec.js` — same lifecycle journey | Reload resumes the persisted session at the next question and completes it without replacing the original session items. |
| Memory fallback when IndexedDB is unavailable | `tests/e2e/assessment-lifecycle.spec.js` — `IndexedDB unavailable keeps the assessment usable with a session-only warning` | Verifies the warning, usable in-session creation, and expected loss after reload. |
| Active-question edit and visible soft-retire | `tests/e2e/product-closure-assessment.spec.js` — `Assessment Tab edits active question and retire is a visible soft-delete` | Owns the management UI fields, success notices, retired filtering, and visible status. |
| Stale revision conflict | `tests/e2e/product-closure-assessment.spec.js` — `stale editor revision reports conflict and refreshes instead of overwriting newer data` | Owns the browser editor conflict path and proves the concurrent winner remains persisted. |
| In-progress snapshot immutability after edit/retire | `tests/e2e/product-closure-assessment.spec.js` — `editing or retiring the bank never mutates an in-progress session snapshot` | Owns the management UI mutation path. The lifecycle suite separately checks snapshot continuity after an AI/tool update and reload; this is a distinct entry point, not a duplicate journey. |
| Completed review/history from persisted attempts | `tests/e2e/assessment-management.spec.js` — `completed session review is scoped, snapshot-correct, reloadable, and wrong-first` | Seeds a completed session and attempts, then verifies historical snapshots, ordering, and review output. |
| Learning-unit isolation | `tests/e2e/assessment-management.spec.js` — same review journey | Seeds another learning unit and asserts its snapshot is absent from the current review. |
| Source evidence navigation | `tests/e2e/assessment-lifecycle.spec.js` — lifecycle journey | Follows a persisted question's evidence action into the Source tab and verifies the focused file and highlighted lines. |
| Assessment manager surface and same-tab practice composition | `tests/e2e/assessment-management.spec.js` — `assessment tab exposes the new runtime-backed question manager`; `assessment manager keeps practice UI in the same tab` | Owns manager visibility, retired-question control, empty-state handling, and same-tab composition smoke coverage. |
| Ordinary chat capability boundary | `tests/e2e/assessment-lifecycle.spec.js` — `ordinary chat never receives assessment command tools` | Adjacent lifecycle guard: Assessment tools are absent outside explicit authoring flow. |
| Legacy editable question-bank removal | `tests/e2e/product-closure-assessment.spec.js` — `chapter checkpoint no longer exposes the legacy editable localStorage question bank` | Owns the product-closure cleanup contract; it is not an Assessment lifecycle or management duplicate. |

## Adjacent canonical contract suites

These Node/integration suites provide lower-level or cross-layer evidence. They
are intentionally not additional browser owners for the rows above:

| Contract surface | Canonical supporting suite |
| --- | --- |
| Service/tool scope, question mutations, sessions, attempts, evidence, and provenance | `tests/assessment-service.test.mjs` |
| Repository command normalization, revision, and replay semantics | `tests/assessment-repository-contract.test.mjs`; `tests/assessment-repository-implementations.test.mjs` |
| Application lifecycle, recovery, snapshot immutability, conflicts, and memory fallback | `tests/integration/assessment-lifecycle.test.mjs` |
| Completed review snapshot ordering and learning-unit scope | `tests/assessment-review.test.mjs` |
| Management draft and conflict mapping | `tests/assessment-management.test.mjs` |
| Product-closure edit/retire and frozen-session contracts | `tests/product-closure-contract.test.mjs` |

## Duplicate decision

No proven duplicate browser journey was found at this head, so no test was
deleted or consolidated. In particular:

- `createQuestionViaAi` in the product-closure suite is a fixture for reaching
  edit/retire/conflict/snapshot behavior; it does not re-own AI creation,
  session recovery, grading, or evidence navigation.
- The management review test seeds IndexedDB directly so it can isolate
  completed-history and cross-learning-unit behavior; it does not duplicate
  the lifecycle provider/tool path.
- Snapshot checks cover different mutation entry points: AI/tool update in
  lifecycle and UI edit/retire in product closure.

This is a valid no-deletion outcome under Issue #245. No production code was
changed to simplify or consolidate the tests.
