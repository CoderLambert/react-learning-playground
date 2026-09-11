# Remaining Chapter 08-09 Status

Branch: `learn/remain-08-09`
Base: `integration/react-complete-learning`

## Source baseline

- React Core facts: current React official documentation.
- Server State facts: TanStack Query official documentation as the primary representative library.
- Old branch `learn/ch07-09-performance-data` was 0 commits ahead and 47 behind integration, so this continuation branch was created from current integration to avoid replaying already-integrated Chapter 07 history.

## Chapter 08 — 外部 Store 与第三方系统

- [x] `useSyncExternalStore` subscribe / getSnapshot / Object.is / unsubscribe mental model.
- [x] External source vs React-owned state boundary.
- [x] Portal: DOM tree placement vs React tree semantics and event propagation.
- [x] Third-party DOM library lifecycle: ref + Effect setup/cleanup.
- [x] Zustand / Redux Toolkit / Jotai positioning without adding unnecessary runtime dependencies.
- [x] Demo registration + CodeViewer `?raw` registration.

Implemented demos:

- `src/demos/ExternalStoreDemo.jsx`
- `src/demos/PortalThirdPartyDemo.jsx`

## Chapter 09 — Server State 与请求架构

- [x] Client state vs server state ownership.
- [x] Query identity / cache / fresh vs stale / refetch / invalidation.
- [x] In-flight request dedupe conceptual simulator.
- [x] Race condition guard + AbortController cancellation.
- [x] Pagination / query key identity.
- [x] Optimistic mutation → confirm / rollback.
- [x] Explicitly marks local implementations as teaching simulators rather than claiming TanStack Query is installed.
- [x] Demo registration + CodeViewer `?raw` registration.

Implemented demos:

- `src/demos/ServerStateCacheDemo.jsx`
- `src/demos/ServerStateMutationDemo.jsx`

## Fact calibration notes

- React `useSyncExternalStore`: `subscribe` returns unsubscribe; `getSnapshot` must remain referentially stable while the store has not changed; React compares snapshots with `Object.is`.
- React `createPortal`: changes physical DOM placement only; context and event bubbling continue according to the React tree.
- Third-party DOM systems belong in Effect setup/cleanup rather than render.
- TanStack Query concepts represented here: query key identity, stale/fresh state, invalidation/refetch, mutation, optimistic update, and cancellation through `AbortSignal`. The repository does not claim to execute TanStack Query runtime behavior.

## Quality gate

Content implementation: COMPLETE

- `npm ci`: PENDING
- `npm run lint`: PENDING
- `npm run build`: PENDING
- `npm run preview` HTTP/browser smoke: PENDING
- Console / focused mode / continuous mode / search / CodeViewer / narrow-screen manual smoke: PENDING

The current execution environment can modify and inspect GitHub repository content but does not expose an executable checkout in this run. No PASS result is fabricated. Final integration worker is expected to execute deterministic CI/local gates before any final `main` merge.
