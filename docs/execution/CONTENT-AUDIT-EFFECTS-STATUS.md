# Content Audit Effects Lane Status

## Baseline and ownership

- Repository: `CoderLambert/react-learning-playground`
- Stacked base: `automation/content-audit-queue`
- Base head at lane creation: `3c15c8eecc68e6be3ab95b35fa456357fb6f409c`
- Branch: `automation/content-audit-effects`
- Stacked PR: `#84` → `automation/content-audit-queue`, kept open and unmerged.
- Scope: Effect/lifecycle and adjacent unowned Ch04 residuals only; no edits to Lane A/Lane C files or specialist PR #78/#79/#81/#82 ownership.

Specialist PRs #78/#79/#81/#82 remain open and mergeable, so their file ownership is still reserved. Concurrency PR #83 owns `effect-event`, `transition-deferred`, and attributable audit E2E stabilization.

## Completed residuals

### `not-need-effect`

Gate state: A PASS / B PASS / C PASS.

The previous Note over-promised an executable “Effect-derived State vs render-derived State” performance comparison even though the bad path existed only as static source text. The Note now scopes the experiment to the interactions the Demo really implements:

1. render-time derivation from query/category;
2. purchase behavior directly caused by an Event Handler;
3. `key={userId}` resetting local draft State when component identity changes.

The static Effect anti-pattern remains explanatory source, not fake runtime evidence.

### `lifecycle-of-reactive-effects`

Gate state: A PASS / B PASS / C PASS.

The Demo now records setup/cleanup from the actual Effect lifecycle, not from handler predictions. It also uses `setMessages(prev => ...)`, so the connection Effect does not read `messages`; incoming messages update UI without reconnecting. `isMuted` remains a latest-value read through Effect Event rather than a connection dependency. Development Strict Mode's extra setup → cleanup → setup stress test is explicitly scoped as development-only.

### `use-ref`

Gate state remains A PASS / B PASS / C PASS, with residual wording corrected.

Adjacent Ch04 scan found two concrete correctness/clarity problems that were still recorded in the existing advice:

- the Demo labeled a `setInterval` example “高精度秒表”, although browser intervals provide no high-precision timing guarantee;
- the Demo used an absolute “only operate refs in events/effects” rule and vague “Concurrent Mode” wording, omitting React's documented predictable one-time initialization exception.

This run corrected Note + Demo + advice together:

- the example is now a normal timer-handle lifecycle example, explicitly not a precision clock;
- the visible seconds remain State while the interval ID is a Ref, making the decision boundary explicit;
- render-time ref access is described as normally disallowed, with the narrow deterministic initialization exception such as `if (ref.current === null) ref.current = new Thing()`;
- the explanation is based on render purity/predictability rather than the obsolete/vague “Concurrent Mode” label;
- `useLayoutEffect` is explicitly limited to cases that truly require layout work before paint, not presented as the default companion to refs.

Primary factual source: current official React `useRef` and `Referencing Values with Refs` documentation.

## Adjacent Effect/lifecycle scan

- `use-effect-correct-usage`: A/B/C PASS; no new hard-gate finding.
- `custom-hooks`: A/B/C PASS; no new hard-gate finding.
- `advanced-ref`: A/B/C PASS; prior mismatch already closed on the audit queue.
- `effect-event`: reserved for Concurrency Lane; not edited here.

No further dependency-ready Ch04 Effect/lifecycle hard-gate failure is currently known without crossing another owner's files.

## Current base CI / attribution

PR #80 exact head `f04d3b896d8e5b68707bfeff6794c92ef43eee09` reports:

- `React Learning Verify #298`: PASS.
- `Workbench Integration Verify #237`: FAIL only in Browser E2E after Build passed.

The job log provides exact attribution: 38 browser tests ran, 37 passed, and the sole failure is `tests/e2e/effects-cleanup.spec.js` expecting old `effect-event` UI text (`连接次数：` / `已连接 general，当前主题 light`). `effect-event` and audit E2E stabilization are Concurrency Lane ownership, so this Effects lane does not modify that test or lesson.

## Effects PR validation

Validation remains conservative:

- PR #84 targets `automation/content-audit-queue`, and the repository workflows do not currently produce an exact-head run for this stacked target.
- Therefore no executable PASS is claimed for the current Effects head.
- PR #84 remains mergeable by GitHub inspection.
- The queue base has advanced three commits since this branch's merge base; those commits touch only Core Lane queue/status and `use-reduce-with-context` files, not this lane's lesson files. The branch is intentionally not force-updated or rebased.

## Next

1. Re-scan ownership and current queue head before any further content edit.
2. If no new unowned Ch04–05 hard-gate regression appears, avoid churn; the content scope is review-ready.
3. Obtain exact-head executable validation once the stacked changes enter a workflow-eligible combined tree; fix only failures attributable to this lane.
