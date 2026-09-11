# Content Audit Queue Status

## Baseline and ownership

- Repository: `CoderLambert/react-learning-playground`
- Baseline `main`: `76562aefc1dab2ac4ab780f36b96a2d30d7e7948`
- Audit branch: `automation/content-audit-queue`
- PR: `#80`, kept open and unmerged.

Specialist ownership rechecked before this batch:

- PR #79 `automation/content-contract-infra`: MDX teaching-component compatibility/canonicalization, semantic content tests, authoring guidance, shared TypeScript sample gate. Its open PR still owns shared infrastructure and mechanical Note normalization.
- PR #78 `automation/state-design-lessons`: controlled/uncontrolled, state structure, lifting state, preserving/resetting state. Scope is complete/validated; files remain reserved by its open PR.
- PR #81 `automation/typescript-learning`: TypeScript-for-React Note/Demo/TSX samples. It remains pending combined validation with PR #79's compiler gate.
- PR #82 `automation/runtime-lessons`: event propagation, Event-vs-Effect, state snapshot/update queue. Scope is complete/validated and is not duplicated here.

This branch does not edit those owned lesson files. `main` remained at the baseline SHA when ownership was inspected.

## Concrete residual fixes made by this queue

1. `ComponentJsxPureRenderDemo.jsx`: side-effect placement now follows causality rather than treating all network/external work as Event Handler work.
2. `PropsBasicsDemo.jsx`: props mutation wording now uses the immutable render-snapshot model rather than calling it an unpredictable side effect.
3. `StateReducerDemo.jsx`: removed `new Date()` from reducer execution; timestamps are created at the event boundary and carried by the action.
4. `UseReduceWithContextDemo.jsx`: removed `Date.now()` from reducer execution; IDs are generated before dispatch; removed absolute “dispatch-only never rerenders” claims; updated React 19 provider syntax.
5. `LifecycleOfReactiveEffectsDemo.jsx`: removed fake `[Cleanup]` / `[Setup]` entries written by the room-change handler. The UI now records a switch request rather than pretending to instrument lifecycle execution.
6. `EffectEventDemo.jsx`: connection/setup count is now incremented inside the Effect setup rather than manually in the room-change handler. The Demo explicitly notes the development Strict Mode setup → cleanup → setup stress test.
7. `CustomHooksDemo.jsx`: `useOnlineSignal` now initializes from the actual browser `navigator.onLine` value (with a non-browser fallback) instead of assuming `true` until the first online/offline event.
8. `PortalThirdPartyDemo.jsx`: replaced render-time predicted `cleanup/setup` text with logs emitted by the actual Effect setup/cleanup, added explicit mount/unmount controls, and kept lifecycle logs outside the third-party child so cleanup remains observable after unmount.

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
32. `use-memo.mdx` — A PASS / B PASS / C PASS
33. `use-callback.mdx` — A PASS / B PASS / C PASS
34. `profiler.mdx` — A PARTIAL / B PASS / C PASS
35. `react-compiler.mdx` — A PASS / B PASS / C PASS
36. `external-store.mdx` — A PASS / B FAIL / C PASS
37. `portal-third-party.mdx` — A PASS / B PASS / C PASS (after this branch's lifecycle fix)
38. `server-state-cache.mdx` — A PASS / B PASS / C PASS
39. `server-state-mutation.mdx` — A PASS / B PASS / C PASS

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
- `lifecycle-of-reactive-effects`: after removing fake lifecycle logs, the Demo demonstrates dependency behavior but still does not instrument real cleanup/setup order or the functional-updater dependency-removal case.
- `effect-event`: setup counting is real, but the Note promises an executable bad (`roomId + theme` dependencies) vs good Effect Event comparison while the Demo only runs the good version.
- `advanced-ref`: Note promises `useEffect` vs `useLayoutEffect` timing comparison, but Demo only implements `useLayoutEffect` measurement.
- `form-data-modeling`: Note asks for controlled-vs-uncontrolled comparison, while current Demo only executes the FormData/uncontrolled side.
- `optimistic-update`: rollback is observable, but the “simulate failure” branch is a business rejection that returns normally; it does not exercise an Action throw/Error Boundary path.
- `transition-deferred`: Note asks to compare direct update, Transition and deferred value, but the Demo has no direct-update control; it also claims observable background render interruption without render-attempt instrumentation.
- `render-vs-dom-update`: MutationObserver gives real target-DOM evidence, but `renderRequest` is a manually incremented experiment counter, not actual component render instrumentation.
- `profiler`: Note's generic “production build” wording is incomplete because ordinary React production builds disable Profiler instrumentation by default; profiling data needs a profiling-enabled production build or appropriate profiling tooling.
- `external-store`: Note explicitly asks to mount/unmount a subscriber and observe cleanup, but Demo keeps both Readers mounted and exposes no unsubscribe experiment. The Demo also mixes subscription-count instrumentation into its business snapshot/version.

## Latest batch review notes

- `use-memo`: hard gates pass. The lesson correctly treats memoization as an optimization and identifies expensive computation/identity consumers; advice adds that the cache is component-local, not a request/business cache, and can be discarded by React.
- `use-callback`: hard gates pass. The stable-vs-unstable callback experiment is real; advice adds that the function expression is still created during render and `useCallback` is not persistent identity storage.
- `profiler`: Demo contract and mental model pass, but correctness/version boundary is PARTIAL until production profiling wording distinguishes ordinary production builds from profiling-enabled builds. `baseDuration` should remain described as an estimate, not an observed no-memo baseline.
- `react-compiler`: hard gates pass. The Demo explicitly says this repository does not enable Compiler and only demonstrates manual memoization effects. Advice recommends verifying actual compilation rather than predicting exact compiler cache points from source shape.
- `external-store`: core `subscribe`/`getSnapshot` semantics are sound, but Gate B fails because the advertised mount/unmount cleanup experiment is missing. Advice also records the Transition/external-store consistency boundary and SSR `getServerSnapshot` requirement.
- `portal-third-party`: original lifecycle text was fake instrumentation. This branch now logs from actual Effect setup/cleanup and supports explicit unmount/remount, so Gate B passes after the fix. Portal event bubbling/React-tree ownership and accessibility caveats remain aligned.
- `server-state-cache`: hard gates pass. The Demo truthfully labels itself a concept simulator, and its v5 mapping for default stale data and invalidation of active queries is consistent with current TanStack Query docs. Force-refetch/in-flight behavior remains explicitly Demo-specific.
- `server-state-mutation`: hard gates pass. Abort + stale guard and optimistic confirm/rollback are executable. Advice adds concurrent-mutation identity and temporary-id reconciliation as production boundaries.

## Factual sources

Primary factual baseline is current official React documentation, including Components/Hooks purity, reducer/context/ref/effect semantics, React 19 Actions, Suspense/transitions, memoization, Profiler, React Compiler, `useSyncExternalStore`, Portal and Effect lifecycle. Current TanStack Query v5 official documentation is used only for the lessons that explicitly map their conceptual server-state simulators to TanStack Query behavior; MDN is used only for browser APIs such as `FormData`, `MutationObserver` and `AbortController`.

## Validation

Previous executable-fix head `b2200ffd95d54a60cf3a1873a9d6d62951086615` passed both `React Learning Verify` and `Workbench Integration Verify`. Previous audit head `ff92a95a2a4c74bb5b9a9b4c4d30cb950fac309c` has `React Learning Verify` success.

This batch contains one production Demo fix (`PortalThirdPartyDemo.jsx`) plus eight advice files and this status update. Exact-head GitHub Actions are the acceptance source for regression evidence; no local lint/build PASS is claimed from the connector-only execution environment.

## Next

Continue in navigation order from the next unaudited, unowned lesson after `server-state-mutation` (`url-state`). Reserved Runtime/State/TypeScript files remain skipped until their specialist branches are reconciled or closed. Prefer concrete correctness/Demo-contract fixes outside those scopes before adding further advice-only records.
