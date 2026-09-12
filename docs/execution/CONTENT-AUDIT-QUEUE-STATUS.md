# Content Audit Queue Status

## Baseline and ownership

- Repository: `CoderLambert/react-learning-playground`
- Baseline `main`: `76562aefc1dab2ac4ab780f36b96a2d30d7e7948`
- Audit branch: `automation/content-audit-queue`
- PR: `#80`, kept open and unmerged.

Specialist ownership rechecked before this run:

- PR #79 `automation/content-contract-infra`: shared MDX/content-contract infrastructure and TypeScript sample gate; do not duplicate.
- PR #78 `automation/state-design-lessons`: state ownership/modeling lessons; scope complete/validated but files remain reserved by the open PR.
- PR #81 `automation/typescript-learning`: TypeScript-for-React Note/Demo/TSX samples; still awaiting combined validation with PR #79.
- PR #82 `automation/runtime-lessons`: event propagation, Event-vs-Effect, state snapshot/update queue; scope complete/validated and not duplicated here.

`main` remained at the same baseline SHA when this run began.

## Concrete residual fixes made by this queue

1. `ComponentJsxPureRenderDemo.jsx`: side-effect placement follows causality rather than treating all external work as Event Handler work.
2. `PropsBasicsDemo.jsx`: props mutation wording uses the immutable render-snapshot model.
3. `StateReducerDemo.jsx`: time generation moved out of reducer execution and into the event boundary.
4. `UseReduceWithContextDemo.jsx`: ID generation moved before dispatch; absolute rerender claim removed; React 19 provider syntax updated.
5. `LifecycleOfReactiveEffectsDemo.jsx`: fake cleanup/setup lifecycle logs removed.
6. `EffectEventDemo.jsx`: setup count now comes from real Effect setup execution with Strict Mode caveat.
7. `CustomHooksDemo.jsx`: online state initializes from `navigator.onLine` instead of assuming `true`.
8. `PortalThirdPartyDemo.jsx`: lifecycle logs now come from real Effect setup/cleanup and real unmount/remount controls.
9. `UrlStateDemo.jsx`: replaced component-local fake URL state with real browser History API state; address-bar search params are the source of truth, Back/Forward uses real `popstate`, refresh restores state, and unrelated query params are preserved.
10. `nested-routes.mdx`: removed claims that a route-match simulator demonstrates browser history or real component lifecycle; experiment now targets matched route chains and Outlet boundaries.
11. `navigation-boundary.mdx`: replaced nonexistent slow-navigation/pending experiment with the Demo's real push/replace/Back/Forward/404 history experiment; pending navigation is explicitly a real-Router boundary.
12. `route-data-boundary.mdx`: narrowed the experiment to the Demo's actual params → simulated loader → pending → data/error trace; real URL mutation, redirect and revalidation are explicitly out of scope.
13. `src/demos/testing-samples/app.spec.js`: corrected stale claim that Playwright was not installed and changed `page.goto("/")` to `page.goto("./")` so the teaching sample preserves the configured GitHub Pages-style base path.
14. `rendering-strategies.mdx`: stopped asking the Demo to treat RSC as a fourth CSR/SSG/SSR choice. The experiment now uses the absence of an RSC button to reinforce that RSC is a different execution/transport axis.
15. `hydration-streaming.mdx`: explicitly labels the current client-side Demo as a streaming/mismatch phase simulator; it no longer claims to execute real `hydrateRoot` or measure true interactive readiness.
16. `ServerFunctionsFrameworkDemo.jsx` + `server-functions-framework.mdx`: replaced a no-op “call Server Function” button with an observable authorization-decision simulation and made the Note explicit that no real Framework endpoint/revalidation is exercised.
17. `multi-slots.mdx` + `MultiSlotsDemo.jsx`: unified the actual contract to `undefined` default / `false` hidden / provided node override; removed generalized “all mature libraries use this protocol” and “zero extra DOM” claims.
18. `ConditionalRenderingDemo.jsx`: reconciled Empty as an explicit UI semantic with the rule that `isEmpty` should be derived when it is already determined by successful data.
19. `ExternalStoreDemo.jsx` + `external-store.mdx`: added real Reader mount/unmount controls and subscribe/unsubscribe lifecycle evidence; separated lifecycle instrumentation from the business counter snapshot.

## Audited lessons

Each item has exactly one matching file under `src/content/notes-advice/`.

1. `component-jsx-pure-render.mdx` — A PASS / B PARTIAL / C PASS
2. `props.mdx` — A PASS / B PASS / C PASS
3. `children.mdx` — A PARTIAL / B PASS / C PASS
4. `multi-slots.mdx` — A PASS / B PASS / C PASS (resolved this run)
5. `conditional-rendering.mdx` — A PASS / B PASS / C PASS (resolved this run)
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
36. `external-store.mdx` — A PASS / B PASS / C PASS (resolved this run)
37. `portal-third-party.mdx` — A PASS / B PASS / C PASS
38. `server-state-cache.mdx` — A PASS / B PASS / C PASS
39. `server-state-mutation.mdx` — A PASS / B PASS / C PASS
40. `url-state.mdx` — A PASS / B PASS / C PASS
41. `nested-routes.mdx` — A PASS / B PASS / C PASS
42. `navigation-boundary.mdx` — A PASS / B PASS / C PASS
43. `route-data-boundary.mdx` — A PASS / B PASS / C PASS
44. `testing-strategy.mdx` — A PASS / B PASS / C PASS
45. `accessibility-basics.mdx` — A PASS / B PASS / C PASS
46. `accessible-modal.mdx` — A PASS / B PASS / C PASS for its explicitly limited teaching experiment
47. `rendering-strategies.mdx` — A PASS / B PASS / C PASS after experiment-axis correction
48. `hydration-streaming.mdx` — A PASS / B PASS / C PASS after simulator boundary correction
49. `rsc-boundary.mdx` — A PASS / B PASS / C PASS
50. `server-functions-framework.mdx` — A PASS / B PASS / C PASS after observable security simulation

## Material open findings

- `immutable-state`: Note promises executable mutation-vs-copy comparison, but Demo has no runnable mutation counterexample.
- `render-commit`: Note promises render logs/component execution observation that the Demo does not expose; `requestAnimationFrame` is a browser-frame API, not React commit instrumentation.
- `state-reducer`: Note names actions not present in the Demo and asks UI observation to prove reducer purity.
- `context-propagation`: Note describes real render logs while Demo counters are manually advanced predictions.
- `use-reduce-with-context`: only the split-Context implementation is interactive; the single-Context side is static code.
- `use-effect-correct-usage`: Note describes timer/dependency-change experiments not present in the Demo.
- `not-need-effect`: Note promises executable Effect-derived-state vs render-derived-state comparison; bad path is static code only.
- `lifecycle-of-reactive-effects`: Demo still does not instrument real cleanup/setup order or the functional-updater dependency-removal case.
- `effect-event`: Note promises executable bad dependency list vs Effect Event comparison while Demo only runs the good version.
- `advanced-ref`: Note promises `useEffect` vs `useLayoutEffect` timing comparison, but Demo only implements `useLayoutEffect` measurement.
- `form-data-modeling`: Note asks for controlled-vs-uncontrolled comparison, while Demo only executes the FormData/uncontrolled side.
- `optimistic-update`: “simulate failure” is a normal business rejection, not an Action throw/Error Boundary path.
- `transition-deferred`: no direct-update control and no instrumentation proving interrupted background renders.
- `render-vs-dom-update`: MutationObserver is real DOM evidence, but `renderRequest` is not actual render instrumentation.
- `profiler`: ordinary React production builds disable Profiler instrumentation by default; production measurement needs profiling-enabled tooling/builds.

Resolved from the previous open list this run: `multi-slots`, `conditional-rendering`, and `external-store`.

## Latest batch review notes

- Router track: URL/history, nested route, navigation and route-data experiments now distinguish real browser evidence from Router simulators.
- Testing/A11y: 3 new advice records added; Playwright Source sample corrected; accessible modal remains explicitly a teaching focus-management implementation rather than a production-ready dialog primitive.
- Rendering/Framework: RSC is kept off the CSR/SSG/SSR axis; hydration Demo is explicitly conceptual; RSC boundary semantics match React 19.2 docs; Server Function security experiment is now observable without pretending to execute a real endpoint.
- Residual fixes: named-slot sentinel mismatch, Empty-state contradiction, and external-store cleanup/instrumentation findings are closed and their existing advice records updated rather than duplicated.

## Factual sources

Primary React semantics use current official React documentation. React 19.2 docs confirm `hydrateRoot` attaches React to server-rendered HTML; Server Components have no `"use server"` marker; `"use server"` marks Server Functions; Server Function arguments are untrusted; and `useSyncExternalStore` requires stable cached snapshots and a cleanup-returning `subscribe`. Router lessons use current official React Router documentation. Browser history details use MDN History API references. Accessibility reviews use WAI-ARIA APG/WCAG/MDN. Testing reviews use Testing Library/Playwright plus this repository's actual package/config.

## Validation

Earlier executable-fix head `b2200ffd95d54a60cf3a1873a9d6d62951086615` passed both `React Learning Verify` and `Workbench Integration Verify`.

Router pre-status head `34bce2b9857c0c669d2a6c66164a881a02fe9787`:

- React Learning Verify #244 — PASS.
- Workbench Integration Verify #183 — CANCELLED, not a test failure; no PASS is claimed for that run.

Latest code/advice head before this status update: `97b71ad8c853049f96588adbce3cfd9eaa8e6fb8`. Exact-head workflows had not yet been observed at status-update time; no PASS is claimed for the latest batch until GitHub reports it. This environment does not expose a local executable checkout, so GitHub Actions remains the acceptance source.

## Next

Skip specialist-owned State/Runtime/TypeScript files. Continue resolving the remaining unowned Gate-B failures before adding low-value audit churn. Recheck ownership before each fix, and keep one matching advice record per note rather than creating duplicates.
