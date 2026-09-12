# Content Audit Concurrency Lane Status

## Baseline and ownership

- Repository: `CoderLambert/react-learning-playground`
- Base audit PR: #80 / `automation/content-audit-queue`
- Base audit head at lane start: `3c15c8eecc68e6be3ab95b35fa456357fb6f409c`
- Latest inspected base audit head: `f04d3b896d8e5b68707bfeff6794c92ef43eee09`
- Lane branch: `automation/content-audit-concurrency`
- Stacked PR: #83 targeting `automation/content-audit-queue`, kept open and unmerged.
- Scope: `effect-event`, `transition-deferred`, and audit-queue Browser E2E diagnosis/stabilization only.

Reserved ownership remains untouched: PR #78 state-design lessons, PR #79 shared content/package/test infrastructure, PR #81 TypeScript lesson/samples, PR #82 runtime lessons, Core Lane files (`immutable-state`, `render-commit`, `use-reduce-with-context`), and Effects Lane files (`not-need-effect`, `lifecycle-of-reactive-effects`).

Core Lane advanced PR #80 while this lane was active. This lane previously synchronized base `46bcb80c7c1c80738306bf3eee76f04d12962e7a` with a normal non-force merge commit, preserving both lanes' commits and file ownership. Later base-only progress is inspected for attribution but is not repeatedly merged merely to manufacture churn.

## Completed content fixes

### `effect-event`

Gate A/B/C: **PASS / PASS / PASS**.

- Replaced the one-sided “good implementation only” Demo with two simultaneously running real Effects driven by the same `roomId` / `theme`.
- Control path depends on `[roomId, theme]`, so changing theme produces a real cleanup/setup cycle.
- Effect Event path keeps the connection Effect dependent on `[roomId]`; its Effect Event reads the latest committed theme without making theme a reconnect condition.
- Setup counters are advanced inside Effect setup, not predicted from event handlers.
- Note states React 19.2 restrictions: Effect Events are called only from Effects/other Effect Events, are not dependency escape hatches, and their function identity is not a memoization guarantee.
- Development Strict Mode caveat is explicit; the experiment compares before/after setup deltas instead of absolute initial counts.

### `transition-deferred`

Gate A/B/C: **PASS / PASS / PASS**.

- Added a Direct / Deferred control for the same search input and expensive result subtree.
- `ExpensiveResults` is memoized so the urgent parent render can skip the expensive subtree while its deferred prop is unchanged; the later deferred render supplies the new value.
- The Demo exposes `input`, `result query`, `stale`, urgent tab, committed content, and `isPending` as observable evidence.
- Note no longer claims the Demo directly observes a discarded/interrupted render attempt. It distinguishes the official React 19.2 mechanism (background deferred rendering is interruptible) from what this particular Demo instruments.
- Clarified that the `startTransition` callback executes immediately; the marked update/render work is non-blocking rather than timer-delayed.
- Request throttling/debouncing/caching remains a separate concern.

## Browser E2E diagnosis and stabilization

Fresh exact-head evidence from base PR #80 at `f04d3b896d8e5b68707bfeff6794c92ef43eee09`:

- React Learning Verify #298: **PASS**.
- Workbench Integration Verify #237: **FAIL**.
- Build: **PASS**.
- Playwright Chromium install: **PASS**.
- Browser E2E: **FAIL**.
- Preview HTTP smoke: skipped after the E2E failure.

The uploaded Playwright artifact identifies the exact failing test:

- `tests/e2e/effects-cleanup.spec.js`
- test: `effects and cleanup >> exercises listeners, timers, Effect Event, hooks, and third-party cleanup`
- stale locator expected `.demo-alert` containing `连接次数：` and old single-panel text `已连接 general，当前主题 light`.

This is attributable to the audited `effect-event` contract: the Demo no longer exposes the old handler-era `连接次数` presentation and Lane C now intentionally renders a real two-panel comparison. Therefore the test was updated rather than the teaching Demo regressed to satisfy stale assertions.

The revised E2E now verifies the actual contract:

1. both real Effect panels connect to `general` with `light`;
2. after changing only `theme`, `[roomId, theme]` setup count increases while the Effect Event panel setup count remains unchanged;
3. after changing `roomId`, both setup counts increase;
4. both new connection callbacks observe the latest committed `dark` theme.

Counts are compared by before/after deltas rather than absolute initial values so development Strict Mode's extra setup cycle does not make the test brittle.

Fix commit on Lane C: `af77d73e3d2ab0805aa3e6de351bd6abeada098e` (`test: align Effect Event E2E with audited demo contract`).

## Ch06–12 residual scan

The audit ledger contains no additional unowned Ch06–12 hard-gate FAIL beyond the already-owned `transition-deferred`; remaining FAIL/PARTIAL entries found in the audit diff are specialist/parallel-owned (`state-reducer`, Effects lane) or the pre-fix versions of Lane C records. Unchanged PASS lessons are not re-audited simply to consume execution time.

## Factual sources

Primary factual baseline is current official React 19.2 documentation for `useEffectEvent`, `useTransition`, and `useDeferredValue`.

## Validation state

- Base PR #80 exact head `f04d3b8...` has React Learning Verify PASS but Workbench Integration Verify FAIL as described above; that failure is now precisely attributed and the stale Effect Event E2E assertion has been corrected on Lane C.
- Stacked PR #83 does not automatically trigger repository verification workflows because current workflow `pull_request.branches` filters do not include `automation/content-audit-queue` as a target branch.
- No exact-head CI PASS is claimed for Lane C after the E2E fix until these commits are validated on a workflow-triggering branch or the workflow is made available to the stacked PR.
- The Playwright artifact from #80 is accepted only as failure-attribution evidence, not as validation of the new Lane C head.

## Next

The two lane-owned content findings and the attributable stale Browser E2E assertion are closed in code. Next run should inspect whether Lane C has been reconciled onto a workflow-triggering branch and use that exact-head result as acceptance evidence. If no new unowned Ch06–12 hard-gate regression appears, avoid further content churn.
