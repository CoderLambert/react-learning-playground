# Real Integration Labs Status

- Base `main`: `95f6b3cdd1634fcb65a5bb9f361594c53b02710e`
- Branch: `feat/real-integration-labs`
- Validated runtime commit: `356333498d4843f3dc2227783e5ae839f9135cd1`
- Validation workflow: `Real Integration Labs`
- Successful implementation run: `34567173844`

## Architecture

The labs are isolated under `integration-labs/` and are not registered as Core Playground demos. The root runtime dependency graph is unchanged.

### Router — Chapter 10

`integration-labs/router/` is an independent Vite app using React 19.2.8 and React Router 8.3.1 in real Data Router mode.

Actually running:

- `createBrowserRouter`
- `RouterProvider`
- nested route matching and `<Outlet>`
- URL params through `useParams`
- URL search state through `useSearchParams`
- route loaders receiving `request.signal`
- navigation pending state through `useNavigation`
- route-level error handling through `ErrorBoundary` / `useRouteError`

The project data itself is deliberately deterministic local demo data. React Router owns the routing/data-navigation lifecycle; React Core does not provide these routing APIs.

### TanStack Query — Chapter 09

`integration-labs/tanstack-query/` is an independent Vite app using React 19.2.8 and `@tanstack/react-query` 5.102.8 against a deterministic local Node HTTP API.

Actually running:

- `QueryClient` / `QueryClientProvider`
- query cache identity via `queryKey`
- two observers sharing the same cached/in-flight query
- `staleTime` and observable `isStale`
- invalidation/refetch through `QueryClient.invalidateQueries`
- deterministic retry (`retry: 2`) against intentional HTTP 500 responses
- query cancellation through `AbortSignal` and `cancelQueries`
- page-specific query keys with `keepPreviousData`
- optimistic cache update, server rejection, rollback, then invalidation

The Node mock API owns only deterministic data, latency and forced failures. TanStack Query owns cache/freshness, shared query lifecycle, retry orchestration, cancellation integration, invalidation and mutation lifecycle.

### Next.js App Router — Chapter 12

`integration-labs/next-app-router/` is an independent Next.js 16.3.3 App Router app using React 19.2.8.

Actually running:

- App Router production build/runtime
- `app/page.js` as a Server Component
- `NoteForm.js` as a Client Component selected by `"use client"`
- client state/events and hydration/interactivity
- `actions.js` as a real Server Function selected by `"use server"`
- Server Action submission through `<form action>` and `useActionState`
- `revalidatePath("/")` after mutation
- dynamic server rendering of `/`

The in-memory server store is teaching infrastructure and resets with the server process. It is not presented as production persistence. `"use client"` defines a client module boundary, not a claim that Client Components can only produce HTML in the browser. `"use server"` marks Server Functions, not Server Components. SSR and RSC remain distinct layers that a framework can combine.

## Official fact sources

- React Router Data Mode installation: https://reactrouter.com/start/data/installation
- React Router `createBrowserRouter`: https://reactrouter.com/api/data-routers/createBrowserRouter
- React Router `RouterProvider`: https://reactrouter.com/api/data-routers/RouterProvider
- TanStack Query Important Defaults: https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults
- TanStack Query Query Cancellation: https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation
- TanStack Query Optimistic Updates: https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates
- Next.js Server and Client Components: https://nextjs.org/docs/app/getting-started/server-and-client-components
- Next.js Updating Data / Server Actions: https://nextjs.org/docs/app/getting-started/updating-data
- Next.js August 2026 security release guidance used to select 16.3.3 Active LTS.

## Validation evidence

GitHub Actions run `34567173844` executed on `356333498d4843f3dc2227783e5ae839f9135cd1` and completed successfully.

### Root Core Playground regression

- `npm ci`: **PASS** — 122 packages installed/audited, 0 vulnerabilities.
- `npm run lint`: **PASS** — 0 errors; 22 pre-existing warnings remain. The integration labs introduce no additional lint warnings in the final validated runtime commit.
- `npm run build`: **PASS**.
- `npm run test:e2e`: **PASS** — 10/10 Chromium tests passed.

### Router lab

- dependency install: **PASS** — 21 packages installed, 0 vulnerabilities.
- `npm run build`: **PASS**.
- production-preview browser interaction smoke: **PASS**.
- smoke exercised actual loader navigation, nested child route rendering, and a 404 route error boundary.

### TanStack Query lab

- dependency install: **PASS** — 21 packages installed, 0 vulnerabilities.
- `npm run build`: **PASS**.
- local HTTP API availability: **PASS**.
- production-preview browser interaction smoke: **PASS**.
- smoke verified same-query observers share the same request identity, deterministic retry recovers after two intentional HTTP 500 responses, and an intentionally rejected mutation visibly appears optimistically and then rolls back.

### Next.js lab

- dependency install: **PASS** — 22 packages installed, 0 vulnerabilities.
- `npm run build`: **PASS** — Next.js 16.3.3 production build; `/` is reported as dynamic/server-rendered on demand.
- production `next start`: **PASS**.
- browser interaction smoke: **PASS** — submitted a real Server Action, observed returned server status, and observed the new note in the rendered UI.
- explicit Next config removes the monorepo/multiple-lockfile workspace-root ambiguity seen during the initial validation pass.

## Validation history

- Run `34566672388`: initial implementation passed root regression and all three build/basic-browser gates.
- Run `34566953179`: deliberately stricter Query smoke exposed that intentional HTTP 500 retry/rollback responses were being classified as unexpected browser console errors. The functional behavior itself was exercised, but the run correctly failed until expected-vs-unexpected diagnostics were separated.
- Run `34567173844`: final hardened interaction suite passed all gates.

## Known limits / manual debt

- The Query mock API does not model authentication, databases, distributed invalidation or real network topology.
- The Next store is process-memory only; it demonstrates a real Server Action boundary, not durable persistence.
- Browser smoke uses Chromium only.
- The root repository still has 22 pre-existing lint warnings that belong to the existing learning content and are outside this integration-lab task.
- Each lab intentionally remains a small reference app rather than duplicating the full Core Playground UI.
