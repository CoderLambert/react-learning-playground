# Audit — Performance, External Systems, Server State, Router

Branch: `audit/content-performance-data`

Base: `main` at `95f6b3cdd1634fcb65a5bb9f361594c53b02710e`

Audit date: 2026-09-11

## Scope

This audit covers Chapters 07–10 only:

- Chapter 07 — Performance model and React Compiler
- Chapter 08 — External stores and third-party systems
- Chapter 09 — Server State and request architecture
- Chapter 10 — Router and page state

Primary factual sources:

- React official Learn / Reference / React Compiler reference
- TanStack Query v5 official React documentation
- React Router current official Framework / Data / Declarative documentation

Repository reality was checked before wording changes. The runtime dependencies currently contain React, React DOM and Shiki; React Compiler, TanStack Query, React Router, Zustand, Redux Toolkit and Jotai are not installed runtime dependencies. Demos that discuss those tools therefore remain explicitly identified as concept simulations unless the code is using a React Core API directly.

## Reviewed demos

### Chapter 07 — Performance

- `RenderVsDomUpdateDemo.jsx` — reviewed, no factual edit required
- `ReferenceEqualityDemo.jsx` — reviewed, no factual edit required
- `ReactMemoDemo.jsx` — reviewed, no factual edit required
- `UseMemoDemo.jsx` — reviewed, no factual edit required
- `UseCallbackDemo.jsx` — corrected
- `ProfilerDemo.jsx` — reviewed, no factual edit required
- `ReactCompilerDemo.jsx` — corrected

### Chapter 08 — External systems

- `ExternalStoreDemo.jsx` — reviewed, no factual edit required
- `PortalThirdPartyDemo.jsx` — reviewed, no factual edit required

### Chapter 09 — Server State

- `ServerStateCacheDemo.jsx` — corrected
- `ServerStateMutationDemo.jsx` — corrected

### Chapter 10 — Router

- `UrlStateDemo.jsx` — reviewed, no factual edit required
- `NestedRoutesDemo.jsx` — reviewed, no factual edit required
- `NavigationBoundaryDemo.jsx` — corrected
- `RouteDataBoundaryDemo.jsx` — reviewed, no factual edit required

## Corrections made

### 1. `UseCallbackDemo`

The previous teaching UI read and wrote a ref during render in order to compare the current callback with the previous render. That observation mechanism conflicts with the same course's pure-render model and was already surfaced by the React-oriented lint rules.

The demo now:

- keeps the `memo` + stable/unstable callback experiment;
- uses child render counts as the observable behavior;
- explicitly states that `useCallback` is a performance optimization, not a correctness tool;
- avoids render-phase mutable ref reads/writes merely to prove identity.

### 2. `ReactCompilerDemo`

Wording was tightened against the current React Compiler reference:

- Compiler is described as build-time automatic memoization that reduces the need for manual `memo`, `useMemo` and `useCallback`, without changing React data-flow rules;
- `"use memo"` is now described precisely: most relevant for annotation mode and also able to force compilation in infer mode;
- `"use no memo"` is explicitly described as an opt-out that overrides compilation and is intended as a cautious/temporary debugging or compatibility escape hatch;
- the manual `useMemo` calculation was rewritten with an inline calculation function to avoid teaching a lint-warning-producing memoization pattern;
- the page still clearly states that React Compiler is not enabled in this repository.

### 3. `ServerStateCacheDemo`

The cache simulator was aligned more closely with TanStack Query v5 terminology and with React render purity:

- the page explicitly states that `@tanstack/react-query` is not installed and the cache is a teaching simulator;
- default cached query data is described as stale unless `staleTime` keeps it fresh;
- `invalidateQueries` wording now distinguishes invalidation/staleness from the default background refetch of active queries;
- GC, retry, focus/reconnect refetch and structural sharing remain listed as real-library behaviors not implemented by the demo;
- cache inspection no longer reads a mutable ref and calls `Date.now()` during render; an immutable UI snapshot is published from event/request transitions instead.

### 4. `ServerStateMutationDemo`

TanStack Query cancellation and optimistic-update wording was made more exact:

- a query function receives an `AbortSignal`, but the underlying network work is only actually aborted when the query function/request consumes that signal;
- unused/unmounted query promises are not automatically discarded by default when the signal is not consumed; a completed result may still populate the cache;
- pagination now references the v5 `placeholderData: keepPreviousData` / identity-function pattern and `isPlaceholderData`;
- optimistic updates now distinguish the simpler UI-variable approach from shared-cache optimistic updates using cancel/snapshot/setQueryData/rollback.

### 5. `NavigationBoundaryDemo`

Navigation guidance was updated to reflect current React Router modes:

- `Link` / `NavLink` remain the preferred Web-semantic choice for normal user navigation;
- in Data / Framework mode, redirects that are consequences of loaders/actions should generally use `redirect` rather than `useNavigate`;
- `useNavigate` is positioned for client flows that are not naturally expressed as a link or route redirect, while acknowledging Declarative-mode client flows;
- the page explicitly reiterates that React Router is not installed and the local history array is only a concept simulation.

## Reviewed and intentionally unchanged

The following claims were checked and remain acceptable:

- render/re-render is not equivalent to DOM mutation;
- default `memo` prop comparison uses `Object.is` per prop, and own state/context can still re-render a memoized component;
- `useMemo` and `useCallback` are performance optimizations rather than correctness requirements;
- Profiler `actualDuration` and `baseDuration` are comparative measurements, not portable fixed benchmarks;
- `useSyncExternalStore` requires subscribe/unsubscribe plus a stable cached snapshot when the store has not changed;
- Portals change DOM placement while retaining React-tree context and React event propagation semantics;
- third-party DOM systems belong behind ref + Effect setup/cleanup boundaries;
- Zustand / Redux Toolkit / Jotai are presented as alternative external client-state models rather than React Core or Server State caches;
- URL search state, nested routes, Outlet, index routes and pathless layout routes match current React Router concepts;
- route loaders are presented as route-boundary data loading, while TanStack Query is presented as a cache/freshness/mutation lifecycle layer that can be composed with routing.

## Concept-simulation boundaries

These demos are intentionally conceptual and do not prove installed-library runtime behavior:

- React Compiler — not configured in this repository
- TanStack Query — not installed; the cache/request demos simulate key concepts
- React Router — not installed; the routing demos simulate URL, matching, nesting, navigation and loader boundaries
- Zustand / Redux Toolkit / Jotai — discussed for architectural positioning only

Direct React Core runtime demos in this scope include `memo`, `useMemo`, `useCallback`, `Profiler`, `useSyncExternalStore` and `createPortal`.

## Registry / CodeViewer verification

No demo was renamed or moved. Existing `src/demos/index.js` imports, category assignments and `?raw` CodeViewer registrations therefore remain valid. The audit reviewed the registry before editing and did not require central-registry changes.

## Validation

Local command execution was attempted in the automation environment, but direct GitHub network access from the shell was unavailable, so a checkout could not be cloned there. No local PASS is claimed from that failed attempt.

Validation is delegated to the repository's existing pull-request-triggered `React Learning Verify` workflow, which runs:

- `npm ci`
- `npm run lint`
- `npm run build`
- Playwright Chromium installation
- `npm run test:e2e`
- production preview HTTP smoke

Exact PR CI results must be recorded after the pull request run completes. A successful workflow is required before this audit should be merged.

## Remaining questions / non-goals

- This audit does not install React Compiler, TanStack Query or React Router; doing so would turn concept labs into separate integration projects and is outside the factual-review scope.
- It does not broaden Chapter 07–10 with new APIs solely for completeness.
- Synthetic CPU workloads and in-memory network/cache simulators remain teaching devices, not performance/network benchmarks.
