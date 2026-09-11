# React Core + Concurrency Content Audit Status

Base: `main` @ `95f6b3cdd1634fcb65a5bb9f361594c53b02710e`

Branch: `audit/content-core-concurrency`

## Scope

Factual and wording audit for Chapters 01–06:

- Chapter 01 — component model, JSX, props, composition, conditional rendering, lists/key, prop drilling
- Chapter 02 — events, state snapshot/update queue, immutable state, render/commit
- Chapter 03 — state shape/ownership, controlled/uncontrolled, lifting state, preserve/reset, reducer/context
- Chapter 04 — refs, Effects, Effect lifecycle/dependencies, Event vs Effect, `useEffectEvent`, Custom Hooks, `useLayoutEffect`, `useImperativeHandle`, React 19 ref-as-prop
- Chapter 05 — controlled forms, FormData, `<form action>` / `formAction`, `useActionState`, `useFormStatus`, `useOptimistic`
- Chapter 06 — `lazy`, Suspense/nested boundaries, Error Boundaries, React 19 `use`, `useTransition` / `startTransition`, `useDeferredValue`

The registry and `?raw` CodeViewer registrations were checked against the assigned categories. No registry restructuring was needed.

## Primary fact sources

Current React official documentation was used as the primary source, including:

- https://react.dev/reference/react/useEffect
- https://react.dev/reference/react/useEffectEvent
- https://react.dev/reference/react/useLayoutEffect
- https://react.dev/reference/react/useImperativeHandle
- https://react.dev/reference/react/forwardRef
- https://react.dev/reference/react/lazy
- https://react.dev/reference/react/Suspense
- https://react.dev/reference/react/use
- https://react.dev/reference/react/useTransition
- https://react.dev/reference/react/startTransition
- https://react.dev/reference/react/useDeferredValue
- https://react.dev/reference/react/useActionState
- https://react.dev/reference/react/useOptimistic
- https://react.dev/reference/react-dom/hooks/useFormStatus
- https://react.dev/reference/react-dom/components/form

## Corrections made

### Chapter 02 — render purity

`StateSnapshotQueueDemo.jsx`

- Removed render-time mutation of a ref used only to count renders.
- Kept the actual teaching target: state snapshot, replacement updates, functional updater queue, and stale async closure.
- Clarified that updater functions are processed as a queue where later updaters receive the previous updater result.

`RenderCommitDemo.jsx`

- Removed render-time ref reads/writes used to count render/commit activity; that instrumentation contradicted the demo's own purity rule and current React lint guidance.
- Reframed the experiment around observable DOM after commit without mutating refs during render.
- Tightened wording: render computes the next UI description; commit applies necessary host changes; browser paint is separately scheduled by the browser.
- Added an explicit warning not to violate purity merely to instrument render counts; use React DevTools Profiler for that purpose.

### Chapter 04 — Effects and Escape Hatches

`UseEffectCorrectUsageDemo.jsx`

- Corrected the over-broad claim that every Effect must return cleanup. Cleanup is required when setup establishes synchronization that needs stopping, undoing, or releasing; it is not a ritual for every Effect.
- Stabilized the parent log callback with `useCallback`, avoiding unnecessary listener re-subscription caused only by callback identity changes.
- Corrected the StrictMode explanation to the official Effect stress-test model: an extra development-only `setup → cleanup → setup` cycle, rather than presenting it as a literal production-style mount/unmount/remount lifecycle.
- Preserved the existing E2E-visible `Setup 建立` / `Cleanup 清理` wording used by browser validation.

`LifecycleOfReactiveEffectsDemo.jsx`

- Replaced the old “mirror latest state into a ref as the perfect/standard solution” framing with React 19.2 `useEffectEvent` for non-reactive Effect logic.
- Kept `roomId` as the true reactive dependency because it determines the external connection identity.
- Made `isMuted` non-reactive to the connection while still reading its latest committed value from the Effect Event.
- Added the official boundary: Effect Events are not an escape hatch for removing real dependencies and are not ordinary event handlers.

## Reviewed and retained

The following high-risk areas were checked and their current core claims were retained because they match current React documentation:

- `lazy`: loader and resolved module caching; nearest Suspense fallback while loading.
- Suspense: only Suspense-enabled sources activate a boundary; nested boundaries model reveal/loading sequences rather than arbitrary fetch loading.
- `use(Promise)`: pending Promise suspends; rejection propagates to the nearest Error Boundary; avoid creating a fresh uncached Promise during each render.
- Error Boundaries: render/lifecycle/lazy/use errors can be isolated; ordinary event-handler and arbitrary async callback errors are not automatically caught by a nearby boundary.
- `<form action>` / `formAction`: function actions receive `FormData`, run in a Transition, can integrate with pending/error/optimistic APIs, and successful function actions reset uncontrolled fields.
- `useActionState`: previous state is the first reducer-action argument; when used as a form Action, submitted `FormData` is the next argument; known business errors can be returned as state while unknown errors can be thrown.
- `useFormStatus`: tracks a parent form; a component calling the Hook must be inside that form rather than the same component expecting to observe a form it renders itself.
- `useOptimistic`: optimistic state is temporary while an Action is in progress and converges back to the canonical value after the Action.
- Transition/Deferred: Transition updates are non-blocking/interruptible and cannot control text inputs; `useDeferredValue` is not debounce and does not by itself reduce network requests.
- React 19 ref-as-prop: function components can receive `ref` as a prop; `forwardRef` is no longer necessary for new React 19 function components and is planned for future deprecation.

## Scope boundaries / unresolved items

- This pass intentionally does not redesign the learning UI or add new APIs.
- The existing React 19.2 `useEffectEvent` examples assume the repository's installed React version (`19.2.x`), which matches the current package configuration.
- Real screen-reader validation is outside this content audit and remains a separate manual quality item.
- Cross-browser behavior is outside this factual-content audit; existing E2E currently targets Chromium.

## Validation

PR #15 triggered `React Learning Verify` run `34566777339` on audit head `b7451d654a30ad70a6781111f78c6eaddbd55232`.

Executed by GitHub Actions:

- `npm ci`: **PASS**
- `npm run lint`: **PASS**
- `npm run build`: **PASS**
- Playwright Chromium installation: **PASS**
- `npm run test:e2e`: **PASS**
- production-preview HTTP smoke: **PASS**
- workflow job `verify`: **PASS**

No local command PASS is claimed; the evidence above comes from the actual pull-request CI execution. This status-only follow-up commit does not change runtime source, but the PR should still remain unmerged until GitHub finishes the workflow triggered for the final PR head.
