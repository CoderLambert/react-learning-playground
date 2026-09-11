# Real Integration Labs Status

- Base `main`: `95f6b3cdd1634fcb65a5bb9f361594c53b02710e`
- Branch: `feat/real-integration-labs`

## Architecture

- Router: isolated Vite app using React Router 8 Data Router APIs.
- Server State: isolated Vite app using TanStack Query 5 against a deterministic local Node HTTP API.
- Framework: isolated Next.js 16.3.3 App Router app using a Server Component, Client Component and Server Action.

The root Core Playground remains unchanged and these labs are intentionally not registered as core demos.

## Official fact sources

- React Router official Data Mode installation/routing/API docs.
- TanStack Query latest Important Defaults, Query Cancellation, QueryClient and Optimistic Updates docs.
- Next.js official App Router and Server Actions documentation; Next.js August 2026 security release recommends 16.3.3 Active LTS.

## Runtime vs concept

All three directories contain actual third-party runtimes. The Router loaders and Query HTTP backend use deterministic local demo data; the Next server store is intentionally process-local. These local data sources are teaching infrastructure, while routing/cache/framework behavior is provided by the installed libraries.

## Validation

Pending the branch `Real Integration Labs` GitHub Actions run. This document must not claim PASS until CI has actually executed root regression, each lab install/build, HTTP smoke and Playwright browser smoke.

## Known limits

- Query mock API is intentionally local and does not model auth/database/network infrastructure.
- Next's server store is in-memory and resets when the process restarts; it demonstrates a real Server Action boundary, not production persistence.
- The labs target one current version set rather than a cross-version compatibility matrix.
