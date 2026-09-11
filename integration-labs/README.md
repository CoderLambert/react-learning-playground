# Real React Integration Labs

These apps complement the Core Playground with real library/framework runtimes. They stay isolated so the core React demos can keep teaching concepts without pretending a third-party integration is React itself.

| Lab | Runtime | Learning map |
| --- | --- | --- |
| `router/` | React Router 8 Data Router | Chapter 10 — routing/page state |
| `tanstack-query/` | TanStack Query 5 + local HTTP mock server | Chapter 09 — Server State |
| `next-app-router/` | Next.js 16 App Router | Chapter 12 — SSR/RSC/framework |

## Run

Each directory owns its dependencies:

```bash
cd integration-labs/router && npm install && npm run dev
cd integration-labs/tanstack-query && npm install && npm run dev:all
cd integration-labs/next-app-router && npm install && npm run dev
```

These apps intentionally are not registered in `src/demos/index.js`. The existing playground demos remain concept simulators; these labs are executable integration references.
