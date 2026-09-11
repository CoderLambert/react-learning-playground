# Remaining Chapter 12 + Final Integration Status

Branch: `learn/remain-12-integration`
Base: `integration/react-complete-learning`

## Baseline

- `integration/react-complete-learning` start HEAD: `c7428d89810ae95695e74d02e7d8326858d3670d`.
- Legacy `learn/ch10-12-routing-advanced` was 0 commits ahead / 54 commits behind integration, so this continuation branch was created from the latest integration HEAD.
- Repository had no `.github/workflows` directory on the integration baseline.
- React Core / SSR / RSC facts use current React official documentation as primary source.
- Framework behavior is kept separate and uses the corresponding framework documentation.

## Chapter 12 — SSR / Hydration / RSC / Framework

### Content implementation

- [x] 12-01 CSR / SPA / SSG / SSR rendering strategies
  - Added `src/demos/RenderingStrategiesDemo.jsx`.
  - Distinguishes where/when HTML is produced and separates React primitives from framework rendering policy.
- [x] 12-02 Server rendering streaming APIs
  - Covered in `HydrationStreamingDemo.jsx`.
  - Distinguishes Node.js `renderToPipeableStream` from Web Streams `renderToReadableStream`.
  - Visualizes shell-first streaming and later Suspense boundary reveal.
- [x] 12-03 Hydration / hydration mismatch
  - Added observable server HTML → client first render → hydrate timeline.
  - Demonstrates why non-deterministic or divergent initial output is a correctness problem rather than a normal post-hydration update.
- [x] 12-04 React Server Components mental model
  - Added `src/demos/RscBoundaryDemo.jsx`.
  - Visualizes Server Component / Client Component execution capability, browser bundle boundary, and RSC payload timeline.
  - Explicitly separates RSC from SSR.
- [x] 12-05 Server / Client boundary
  - Explains `"use client"` as a client module boundary.
  - Explicitly notes there is no `"use server"` directive for declaring Server Components.
- [x] 12-06 Server Functions / Actions boundary
  - Added `src/demos/ServerFunctionsFrameworkDemo.jsx`.
  - Explains React 19 Server Function references and when a Server Function is used as an Action.
  - Includes authorization/untrusted-input boundary.
- [x] 12-07 React Core vs framework responsibility
  - Compares React primitives with React Router Framework Mode and Next.js App Router responsibilities without attributing framework policy to React Core.
- [x] Demo registration and CodeViewer `?raw` registration
  - Added `server-react` category.
  - Registered all four Chapter 12 demos and raw sources in `src/demos/index.js`.

### Official-fact calibration

1. `react-dom/server` exposes streaming server-rendering APIs; Node.js uses `renderToPipeableStream`, while Web Streams environments use `renderToReadableStream`.
2. Hydration attaches React to server-generated HTML; the initial client render must match the server-rendered output.
3. React Server Components can run at build time or request time in an environment separate from the client app; Server Components are not shipped as component implementations to the browser and cannot use client-only interactive APIs such as state.
4. There is no directive for Server Components. `"use server"` marks Server Functions callable from client code.
5. React 19 Server Components and Server Functions have a stable user-facing model, but the underlying bundler/framework implementation APIs do not follow semver across React 19 minor versions.
6. React Router Framework Mode currently documents CSR, SSR, and static pre-rendering strategies. Next.js App Router provides its own framework-level RSC/routing/cache/Server Action integration.

## Automated quality gate

A minimal `.github/workflows/react-learning-verify.yml` has been added because the baseline repository had no equivalent workflow. It runs:

1. Node 24 setup
2. `npm ci`
3. `npm run lint`
4. `npm run build`
5. `npm run preview -- --host 127.0.0.1 --port 4173`
6. HTTP smoke against `/react-learning-playground/`

Current evidence before PR CI execution:

- `npm ci`: PENDING
- `npm run lint`: PENDING
- `npm run build`: PENDING
- preview HTTP smoke: PENDING
- interactive browser / console / narrow-screen smoke: PENDING (manual debt; not represented as PASS by HTTP smoke)

## Other work groups / final integration readiness

### A — Chapter 02 + TypeScript

- Branch: `learn/remain-02-typescript`
- Current status: NOT CONTENT-COMPLETE.
- Chapter 02 implementation exists, but Demo / `?raw` registration remains pending and the TypeScript slice is not implemented yet.
- Therefore final integration MUST NOT start yet.

### B — Chapter 04 + Testing

- PR #7: OPEN.
- Content: COMPLETE according to PR record.
- Executable gate: PENDING until CI/local evidence exists.

### C — Chapter 06 + Accessibility

- PR #8: OPEN.
- Content: COMPLETE according to PR record.
- Executable gate: PENDING until CI/local evidence exists.

### D — Chapter 08 + Chapter 09

- PR #9: OPEN.
- Content: COMPLETE according to PR record.
- Executable gate: PENDING until CI/local evidence exists.

### E — Chapter 12 + Final Integration

- Chapter 12 dependency-safe content: COMPLETE.
- Registration / CodeViewer: COMPLETE.
- Automated gate: PENDING PR workflow execution.

## Final integration rule

Do not absorb A/B/C/D into `integration/react-complete-learning` until all five groups are content-complete. Once A completes, integrate each group from the then-current integration HEAD, rebuild `src/demos/index.js` when necessary so all categories, demos and `?raw` registrations survive, and run the automated gate on the final integration tree.

Only after the final integration tree has proven lint/build/preview HTTP smoke PASS should `integration/react-complete-learning → main` be opened for final review. Browser interaction, console, accessibility-device and narrow-screen checks remain explicit manual evidence unless separately automated; they must not be silently converted to PASS.
