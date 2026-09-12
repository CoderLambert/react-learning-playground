# Content Audit Queue Status

## Baseline and ownership

- Repository: `CoderLambert/react-learning-playground`
- Baseline `main`: `76562aefc1dab2ac4ab780f36b96a2d30d7e7948`
- Audit branch: `automation/content-audit-queue`
- PR: `#80`, kept open and unmerged.

Specialist ownership rechecked before this batch:

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
9. `UrlStateDemo.jsx`: replaced component-local fake URL state with real browser History API state. The Demo now reads `window.location.search` via `useSyncExternalStore`, updates the actual address bar, responds to real `popstate`, preserves unknown query params, and can truthfully demonstrate refresh plus Back/Forward restoration.
10. `nested-routes.mdx`: removed claims that the local route-match simulator demonstrates browser history or real component lifecycle; experiment now targets matched route chains and Outlet boundaries that the Demo can actually show.
11. `navigation-boundary.mdx`: replaced a nonexistent slow-navigation/pending experiment with the Demo's actual push/replace/Back/Forward/404 history experiment, while keeping pending navigation as an explicit real-Router boundary.
12. `route-data-boundary.mdx`: narrowed the experiment to the Demo's real params → simulated loader → pending → data/error trace; real URL mutation, redirect, revalidation and Router instrumentation are explicitly out of scope.
13. `src/demos/testing-samples/app.spec.js`: corrected stale source text that claimed Playwright was not installed, and changed `page.goto("/")` to `page.goto("./")` so the teaching sample preserves the repository's configured GitHub Pages-style base path instead of resolving to the origin root.

## Audited lessons

Each item has exactly one matching file under `src/content/notes-advice/`.

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
37. `portal-third-party.mdx` — A PASS / B PASS / C PASS
38. `server-state-cache.mdx` — A PASS / B PASS / C PASS
39. `server-state-mutation.mdx` — A PASS / B PASS / C PASS
40. `url-state.mdx` — A PASS / B PASS / C PASS (after real History API Demo fix)
41. `nested-routes.mdx` — A PASS / B PASS / C PASS (after Note/Demo contract fix)
42. `navigation-boundary.mdx` — A PASS / B PASS / C PASS (after Note/Demo contract fix)
43. `route-data-boundary.mdx` — A PASS / B PASS / C PASS (after Note/Demo contract fix)
44. `testing-strategy.mdx` — A PASS / B PASS / C PASS (after Source sample correction)
45. `accessibility-basics.mdx` — A PASS / B PASS / C PASS
46. `accessible-modal.mdx` — A PASS / B PASS / C PASS for its explicitly limited teaching experiment

## Material open findings

- `multi-slots`: Note uses `undefined/null/ReactNode`, while Source/Demo uses `undefined/false/ReactNode`.
- `conditional-rendering`: Demo contradicts itself about Empty as stored state vs derivation from `items.length`.
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
- `external-store`: Note asks to mount/unmount a subscriber but Demo keeps both Readers mounted; instrumentation is mixed into the business snapshot.

## Latest batch review notes

- `url-state`: original Demo violated the core lesson by storing a fake `search` string in component state while the Note told learners to observe the actual address bar, refresh and browser history. It now uses the browser URL as the authoritative external store. High-frequency typing still deserves a future push-vs-replace/debounce production boundary.
- `nested-routes`: the route tree simulation is useful, but it cannot prove actual Router lifecycle preservation. The Note now asks only for matched-chain and Outlet observations the Demo can support.
- `navigation-boundary`: the prior Note was effectively a pending-navigation lesson attached to a history-stack simulator. It now teaches push/replace/history delta/404 accurately; real pending navigation remains a Data/Framework Router concern.
- `route-data-boundary`: loader mental model is sound, but the Demo is explicitly a phase simulator. The Note no longer claims it mutates real URL, executes redirect or instruments a real Data Router runtime.
- `testing-strategy`: mental model and Demo are aligned. The Playwright reference sample had become stale relative to the repository: Playwright is installed and the configured baseURL includes `/react-learning-playground/`. The sample now preserves that base path and is clearly labeled as Source reference code rather than the real `tests/e2e` suite.
- `accessibility-basics`: all hard gates pass. Keep the distinction between HTML/ARIA platform semantics and React, and consider adding placeholder-vs-label and assertive-live-region misuse as future counterexamples.
- `accessible-modal`: the focus lifecycle experiment is valid, but the teaching implementation intentionally lacks complete `inert`/background isolation, dynamic focusable handling, nested overlays and scroll locking. The Note/Demo both state this limitation, so Gate B passes only for the explicit teaching scope, not as certification of a production-ready dialog primitive.

## Factual sources

Primary React semantics continue to use current official React documentation. Router lessons use current official React Router documentation for modes, Link/NavLink/useNavigate/redirect and pending navigation. Browser history details use MDN History API / `pushState` / `popstate` references. Accessibility reviews use WAI-ARIA APG, WCAG and MDN platform semantics. Testing reviews use Testing Library / Playwright behavior contracts plus this repository's actual `package.json` and Playwright configuration. TanStack Query v5 official docs remain the source only where lessons explicitly map to Query behavior.

## Validation

Earlier executable-fix head `b2200ffd95d54a60cf3a1873a9d6d62951086615` passed both `React Learning Verify` and `Workbench Integration Verify`.

For Router pre-status head `34bce2b9857c0c669d2a6c66164a881a02fe9787`:

- React Learning Verify #244 — PASS.
- Workbench Integration Verify #183 — CANCELLED, not a test failure; no PASS is claimed for that run.

Latest pre-status head `4e848acfe267163b86094b70c9ba9f32dcc70c37` had no associated workflow run yet when inspected. The latest batch therefore has not received exact-head CI acceptance. This environment does not expose a local executable checkout, so GitHub Actions remains the acceptance source.

## Next

Skip `typescript-react` while PR #81 owns it. Continue with the next unowned Chapter 12 / framework lesson in navigation order, preferring concrete correctness or Demo-contract fixes before advice-only churn. Recheck specialist PR ownership before editing any shared or lesson-owned file.
