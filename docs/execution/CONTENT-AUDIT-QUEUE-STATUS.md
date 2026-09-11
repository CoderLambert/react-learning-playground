# Content Audit Queue Status

## Baseline and ownership

- Repository: `CoderLambert/react-learning-playground`
- Baseline `main`: `76562aefc1dab2ac4ab780f36b96a2d30d7e7948`
- Audit branch: `automation/content-audit-queue`
- PR: `#80`, kept open and unmerged.

Specialist ownership checked before the latest batch:

- PR #79 `automation/content-contract-infra`: MDX teaching-component compatibility/canonicalization, semantic content tests, authoring guidance, shared TypeScript sample gate. The task is currently stopped on Runtime/TypeScript branch reconciliation, but its open PR still owns the shared infrastructure and mechanical Note normalization it changed.
- PR #78 `automation/state-design-lessons`: controlled/uncontrolled, state structure, lifting state, preserving/resetting state. Scope complete and validated; PR remains open for review.
- PR #81 `automation/typescript-learning`: TypeScript-for-React Note/Demo/TSX samples. Stopped pending combined validation with PR #79's real compiler gate.
- PR #82 `automation/runtime-lessons`: event propagation, Event-vs-Effect, state snapshot/update queue. Scope complete and validated; never duplicated here.

This branch does not edit those owned lesson files. `main` remained unchanged at the baseline SHA during this batch.

## Concrete residual fixes made by this queue

1. `ComponentJsxPureRenderDemo.jsx`: side-effect placement now follows causality rather than treating all network/external work as Event Handler work.
2. `PropsBasicsDemo.jsx`: props mutation wording now uses the immutable render-snapshot model rather than calling it an unpredictable side effect.
3. `StateReducerDemo.jsx`: removed `new Date()` from reducer execution; timestamps are created at the event boundary and carried by the action.
4. `UseReduceWithContextDemo.jsx`: removed `Date.now()` from reducer execution; IDs are generated before dispatch; removed absolute “dispatch-only never rerenders” claims; updated React 19 provider syntax.
5. `LifecycleOfReactiveEffectsDemo.jsx`: removed fake `[Cleanup]` / `[Setup]` entries written by the room-change handler. The UI now records a switch request and explains that the next Effect cycle will clean up/re-establish synchronization; the panel is no longer labeled as real lifecycle instrumentation.
6. `EffectEventDemo.jsx`: connection/setup count is now incremented inside the Effect setup rather than manually in the room-change handler. The Demo explicitly notes the development Strict Mode setup → cleanup → setup stress test.
7. `CustomHooksDemo.jsx`: `useOnlineSignal` now initializes from the actual browser `navigator.onLine` value (with a non-browser fallback) instead of assuming `true` until the first online/offline event.

## Audited lessons

Each item below has exactly one matching file under `src/content/notes-advice/`.

1. `component-jsx-pure-render.mdx` — A PASS / B PARTIAL / C PASS
2. `props.mdx` — A PASS / B PASS / C PASS
3. `children.mdx` — A PARTIAL / B PASS / C PASS
4. `multi-slots.mdx` — A PARTIAL / B FAIL / C PASS
5. `conditional-rendering.mdx` — A PARTIAL / B PASS / C PARTIAL
6. `rendering-lists-key.mdx` — A PASS / B PASS / C PASS
7. `prop-drilling.mdx` — A PASS / B PASS / C PASS
8. `immutable-state.mdx` — A PASS / B FAIL / C PASS
9. `render-commit.mdx` — A PASS / B FAIL / C PASS
10. `state-reducer.mdx` — A PARTIAL / B FAIL / C PASS
11. `context-propagation.mdx` — A PASS / B FAIL / C PASS
12. `use-reduce-with-context.mdx` — A PASS / B PARTIAL / C PASS
13. `use-ref.mdx` — A PASS / B PASS / C PASS
14. `use-effect-correct-usage.mdx` — A PASS / B FAIL / C PASS
15. `not-need-effect.mdx` — A PASS / B FAIL / C PASS
16. `lifecycle-of-reactive-effects.mdx` — A PASS / B PARTIAL / C PASS
17. `effect-event.mdx` — A PASS / B FAIL / C PASS
18. `custom-hooks.mdx` — A PASS / B PASS / C PASS
19. `advanced-ref.mdx` — A PASS / B FAIL / C PASS
20. `controlled-form.mdx` — A PASS / B PASS / C PASS
21. `form-data-modeling.mdx` — A PASS / B PARTIAL / C PASS
22. `form-action.mdx` — A PASS / B PASS / C PASS
23. `action-state-form-status.mdx` — A PASS / B PASS / C PASS
24. `optimistic-update.mdx` — A PASS / B PARTIAL / C PASS
25. `lazy-suspense.mdx` — A PASS / B PASS / C PASS
26. `suspense-boundary.mdx` — A PASS / B PASS / C PASS
27. `error-boundary-use.mdx` — A PASS / B PASS / C PASS
28. `transition-deferred.mdx` — A PASS / B FAIL / C PASS
29. `render-vs-dom-update.mdx` — A PASS / B PARTIAL / C PASS
30. `reference-equality.mdx` — A PASS / B PASS / C PASS
31. `react-memo.mdx` — A PASS / B PASS / C PASS

## Material open findings

- `multi-slots`: Note uses `undefined/null/ReactNode`, while Source/Demo uses `undefined/false/ReactNode`.
- `conditional-rendering`: Demo contradicts itself about Empty as independently stored state vs a derivation from `items.length`.
- `immutable-state`: Note promises executable mutation-vs-copy comparison, but Demo has no runnable mutation counterexample.
- `render-commit`: Note promises render logs/component execution observation that the Demo does not expose; `requestAnimationFrame` is a browser-frame API, not React commit instrumentation.
- `state-reducer`: Note names actions not present in the Demo and asks UI observation to prove reducer purity.
- `context-propagation`: Note describes real render logs while Demo counters are manually advanced teaching predictions.
- `use-reduce-with-context`: only the split-Context implementation is interactive; the single-Context side is static code.
- `use-effect-correct-usage`: Note describes timer/dependency-change experiments not present in the Demo.
- `not-need-effect`: Note promises executable Effect-derived-state vs render-derived-state comparison; the bad path is static code only.
- `lifecycle-of-reactive-effects`: after removing fake lifecycle logs, the Demo demonstrates roomId-vs-isMuted dependency behavior but still does not instrument real cleanup/setup order or a functional-updater dependency-removal case.
- `effect-event`: setup counting is now real, but the Note promises an executable bad (`roomId + theme` dependencies) vs good Effect Event comparison while the Demo only runs the good version.
- `advanced-ref`: Note promises `useEffect` vs `useLayoutEffect` timing comparison, but Demo only implements `useLayoutEffect` measurement.
- `form-data-modeling`: Note asks for controlled-vs-uncontrolled comparison, while current Demo only executes the FormData/uncontrolled side.
- `optimistic-update`: rollback is observable, but the “simulate failure” branch is a business rejection that returns normally and leaves canonical state unchanged; it does not exercise an Action throw/Error Boundary path.
- `transition-deferred`: Note asks to compare direct update, Transition and deferred value, but the Demo has no direct-update control. It also claims learners can observe background render interruption without render-attempt instrumentation. `ExpensiveResults` is not memoized, so the deferred-value performance experiment does not cleanly reproduce the official slow-child optimization shape.
- `render-vs-dom-update`: MutationObserver gives real target-DOM evidence, but `renderRequest` is a manually incremented experiment counter, not actual component render instrumentation.

## Latest batch review notes

- `lazy-suspense`: core semantics and experiment pass. The 900ms delay is an artificial teaching delay; future wording should attribute caching precisely to the same `lazy(load)` loader Promise/resolved module and optionally connect loader rejection to Error Boundary.
- `suspense-boundary`: nested vs single boundary experiment matches the Note. The module-level Map is only a teaching stable-Promise fixture and should not be presented as a production invalidation/cache solution. A useful bridge to the next lesson is the React 19.2 behavior for already-revealed content suspending during Transition/deferred updates.
- `error-boundary-use`: pending/fulfilled/rejected routing is executable. State-stored Promise plus changing `key` is a teaching recovery mechanism; production should prefer framework/cache or Server Component-provided stable Promises. `use` should not be wrapped in try/catch to intercept its Suspense control flow.
- `reference-equality`: Demo performs real cross-render `Object.is` comparisons and is well aligned. Keep the decision rule “find the identity consumer first” rather than defaulting every object/function to `useMemo`/`useCallback`.
- `react-memo`: Console counts make primitive/fresh-object/stable-object behavior directly observable. React 19.2 official docs still frame `memo` as an optimization, not a guarantee, and state that React Compiler usually reduces the need for manual `memo`; the Demo correctly says this repository does not currently enable Compiler.

## Factual sources

Primary factual baseline is current official React documentation, including Components/Hooks purity, `useReducer`, Context, refs, Effects, Lifecycle of Reactive Effects, `useEffectEvent`, Custom Hooks, `useLayoutEffect`, `useImperativeHandle`, React 19 ref-as-prop/`forwardRef`, `<form>` Actions, `useActionState`, `useFormStatus`, `useOptimistic`, `lazy`, Suspense, `use(Promise)`, Error Boundaries, `useTransition`, `useDeferredValue`, Render and Commit, and `memo`. MDN is used only for browser APIs such as `FormData` and `MutationObserver`.

## Validation

Previous audit head `ff92a95a2a4c74bb5b9a9b4c4d30cb950fac309c` contains the earlier executable Demo fixes and 24 advice records. Its `React Learning Verify` run #215 succeeded; the corresponding Workbench Integration run was still pending at the end of the previous batch.

The current batch adds seven advice files and this status update, with no production Demo/Note/source edits. Latest-head GitHub Actions remain the acceptance source for build/content regression evidence; no local lint/build result is claimed from the connector-only execution environment.

## Next

Continue in registry/navigation order from the next unaudited, unowned performance lesson (`use-memo` after the already-audited `react-memo`). Reserved Runtime/State/TypeScript files remain skipped until their specialist branches are reconciled or closed. Prefer concrete correctness/Demo-contract fixes outside those scopes before adding further advice-only records.
