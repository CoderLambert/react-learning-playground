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

- Effects lane / PR #84: `not-need-effect`, `lifecycle-of-reactive-effects` and later unowned Ch04–05 findings.
- Concurrency lane / PR #83: `effect-event`, `transition-deferred`, attributable audit E2E stabilization and later unowned Ch06–12 findings.

This core lane does not duplicate those files.

## Progress

50 lessons have matching one-to-one advice records under `src/content/notes-advice/`. Existing advice files are updated in place when findings are resolved; no duplicate review records are created.

### Core findings resolved

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

## Current gate state / ownership re-scan

All three named Core Lane residuals remain full PASS. Re-scanning current ownership found no additional dependency-ready unowned Ch01–03 hard-gate failure.

Specialist PRs remain open and mergeable where applicable, so their files stay reserved:

- PR #78 state-design lessons;
- PR #79 shared content-contract/typecheck infrastructure;
- PR #81 TypeScript lesson/samples;
- PR #82 runtime-mechanism lessons.

Parallel audit PRs are active:

- PR #84 Effects lane is open/mergeable and owns its Effect/lifecycle files.
- PR #83 Concurrency lane is open and owns `effect-event`, `transition-deferred`, and attributable audit E2E stabilization. Its stacked base has advanced since its recorded base snapshot, so reconciliation belongs to that lane rather than Core.

No Core-owned lesson was re-audited merely to create work.

## Factual baseline

React semantics are checked against current official React documentation with the repository's React 19.2 target in mind. Browser behavior uses platform semantics where applicable. The audit rule remains:

1. correctness/version scope;
2. Demo ↔ Note ↔ Source/CI contract;
3. usable mental model and production decision rule;
4. only then readability and optional polish.

## Exact-head validation

PR #80 head `f04d3b896d8e5b68707bfeff6794c92ef43eee09` produced:

- `React Learning Verify` #298: **PASS**.
- `Workbench Integration Verify` #237: **FAIL** only at Browser E2E; build passed and 37/38 Playwright tests passed.

The single failing assertion is:

- `tests/e2e/effects-cleanup.spec.js`
- test: `effects and cleanup › exercises listeners, timers, Effect Event, hooks, and third-party cleanup`
- stale expectation looks for `.demo-alert` text `连接次数：` / `已连接 general，当前主题 light` in the `useEffectEvent 非响应式逻辑` demo.

This failure is not attributable to any Core Lane file. It directly targets `effect-event`, which is reserved to Concurrency Lane / PR #83. Core therefore does not modify the E2E spec or Effect Event implementation.

The failure is also now concrete rather than unknown: CI successfully completed dependency install, build, Chromium installation, and all other 37 browser tests before this assertion failed. Preview HTTP smoke was skipped only because Browser E2E failed first.

## Next

Core Lane has no remaining safe non-overlapping content edit at this snapshot. Keep PR #80 open/unmerged and avoid churn. Resume substantive Core work only if:

- `main` or a reconciled specialist branch materially changes a Core-owned lesson;
- a new unowned Ch01–03 Gate A/B/C regression is found; or
- exact-head CI reveals a failure attributable to a Core-owned file.

The current Browser E2E blocker should be resolved by the Concurrency lane, which owns both the changed Effect Event contract and the attributable stale-test stabilization.