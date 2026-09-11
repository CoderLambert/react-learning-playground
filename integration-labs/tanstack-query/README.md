# TanStack Query Real Lab

This lab uses the real `@tanstack/react-query` v5 runtime with a deterministic local HTTP server.

```bash
npm install
npm run dev:all
npm run build
```

Observe real query-key cache identity, shared in-flight query observers, `staleTime`, invalidation/refetch, retries, `AbortSignal` cancellation, paginated query keys with `keepPreviousData`, and optimistic mutation rollback.

The Node mock server controls data, latency and forced failures. TanStack Query—not the server—owns query caching, freshness, retries, cancellation orchestration and mutation lifecycle.

Official references: TanStack Query Important Defaults, Query Cancellation, QueryClient and Optimistic Updates.
