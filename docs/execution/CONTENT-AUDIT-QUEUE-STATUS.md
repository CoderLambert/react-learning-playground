# Content Audit Queue Status

## Baseline and ownership

- Repository: `CoderLambert/react-learning-playground`
- Baseline `main`: `76562aefc1dab2ac4ab780f36b96a2d30d7e7948`
- Audit branch: `automation/content-audit-queue`
- PR: `#80`, kept open and unmerged.

Specialist ownership remains reserved by the open PRs:

- PR #79 `automation/content-contract-infra`: shared MDX/content-contract infrastructure and TypeScript sample gate.
- PR #78 `automation/state-design-lessons`: state ownership/modeling lessons.
- PR #81 `automation/typescript-learning`: TypeScript-for-React Note/Demo/TSX samples.
- PR #82 `automation/runtime-lessons`: event propagation, Event-vs-Effect, state snapshot/update queue.

Parallel audit ownership is also reserved:

- Effects lane: `not-need-effect`, `lifecycle-of-reactive-effects` and later unowned Ch04–05 findings.
- Concurrency lane: `effect-event`, `transition-deferred`, attributable audit E2E stabilization and later unowned Ch06–12 findings.

This core lane does not duplicate those files.

## Progress

50 lessons have matching one-to-one advice records under `src/content/notes-advice/`. Existing advice files are updated in place when findings are resolved; no duplicate review records are created.

### Findings resolved in the latest core-lane run

1. `immutable-state.mdx` — Gate B **FAIL → PASS**.
   - Added a real isolated `mutate + set same reference` counterexample instead of warning-only copy.
   - The learner can mutate state, observe that the same-reference setter does not reliably update the DOM, then trigger an unrelated render and see the polluted state surface.
   - Added the shallow-copy boundary for arrays containing shared object elements and kept Immer positioned as an update-expression tool rather than a modeling substitute.

2. `render-commit.mdx` — Gate B **FAIL → PASS**.
   - Removed the nonexistent render-log contract.
   - Replaced ambiguous DOM reads with a `MutationObserver` that directly observes whether the Count node mutated for count vs unrelated-state updates.
   - `requestAnimationFrame` is now explicitly only a next-browser-frame observation boundary, never a React commit callback or render counter.
   - Component execution/performance evidence is delegated to React DevTools Profiler; browser layout/paint evidence to browser Performance tooling.

3. `use-reduce-with-context.mdx` — Gate B **PARTIAL → PASS**.
   - Replaced the static single-Context code-only side with a real interactive `{ tasks, dispatch }` Context implementation.
   - Single and split Context panels now both execute ADD / TOGGLE / DELETE, with Effect probes exposing which consumers receive the corresponding updates.
   - The lesson explicitly scopes the probe: development Strict Mode can add initial Effect setups; the experiment proves subscription boundaries, not universal production render counts.
   - React hooks remain unconditional in the comparison components.

## Previously resolved concrete repository issues

- Real URL/History state and `popstate` behavior in `UrlStateDemo`.
- Router notes now distinguish simulator behavior from real Router runtime behavior.
- Playwright teaching sample preserves the configured base path.
- Rendering strategy / hydration / RSC / Server Function boundaries corrected.
- Named-slot three-state contract aligned across Note/Demo/Source.
- Conditional-rendering Empty semantics reconciled.
- `useSyncExternalStore` now exposes real subscribe/unsubscribe evidence.
- `PortalThirdPartyDemo` lifecycle evidence comes from real Effect setup/cleanup.
- `use-effect-correct-usage`, `advanced-ref`, and `form-data-modeling` stale experiment claims were aligned to their real Demos.
- `render-vs-dom-update`, `profiler`, `optimistic-update`, and `context-propagation` previously-open findings are full PASS.

## Current gate state / remaining ownership

All three named Core Lane residuals are now full PASS. No additional known unowned Ch01–03 hard-gate failure remains in this status ledger.

Remaining named findings are owned by the parallel lanes rather than this branch worker:

- Effects lane: `not-need-effect`, `lifecycle-of-reactive-effects`.
- Concurrency lane: `effect-event`, `transition-deferred`, plus attributable Browser E2E stabilization.

State/reducer findings overlapping PR #78 remain reserved rather than duplicated here. Runtime, TypeScript, and shared-infrastructure files remain reserved by PRs #82/#81/#79.

## Factual baseline

React semantics are checked against current official React documentation with the repository's React 19.2 target in mind. Browser behavior uses platform semantics where applicable. The audit rule remains:

1. correctness/version scope;
2. Demo ↔ Note ↔ Source/CI contract;
3. usable mental model and production decision rule;
4. only then readability and optional polish.

## Validation

The pre-run head `3c15c8eecc68e6be3ab95b35fa456357fb6f409c` had `React Learning Verify #287` PASS and `Workbench Integration Verify #226` FAIL in Browser E2E; the concurrency lane owns diagnosis of that inherited exact-head failure.

After the executable Core Lane fixes, exact-head GitHub Actions are the acceptance source. No PASS is claimed for the new head until its workflows complete successfully.

## Next

Core Lane should re-scan current ownership on its next run. If no new unowned Ch01–03 hard-gate regression exists, it should avoid re-auditing unchanged PASS lessons and leave remaining named work to the Effects/Concurrency lanes.