# Advanced React Content Audit Status

Branch: `audit/content-advanced-framework`
Base `main`: `95f6b3cdd1634fcb65a5bb9f361594c53b02710e`

## Scope reviewed

Chapter 11–12 and cross-cutting terminology, with focus on:

- TypeScript for React contracts: Props/children, events, state unions, refs, generics
- Testing responsibilities: Vitest, Testing Library, Playwright
- Accessibility: semantic HTML, labels, live regions, modal focus and background isolation
- SSR/hydration/streaming: `hydrateRoot`, `renderToPipeableStream`, `renderToReadableStream`
- React Server Components and Server/Client module graph
- Server Functions vs Server Actions and `"use server"`
- React Core vs React Router Framework Mode vs Next.js App Router responsibilities
- repository-wide terminology consistency around Effect/event, Server State, Action/Transition, hydration, RSC and framework boundaries

Reviewed implementation/source files include:

- `src/demos/TypeScriptReactDemo.jsx`
- `src/demos/typescript-samples/react-boundaries.tsx`
- `src/demos/typescript-samples/generic-patterns.tsx`
- `src/demos/TestingStrategyDemo.jsx`
- `src/demos/AccessibilityBasicsDemo.jsx`
- `src/demos/AccessibleModalDemo.jsx`
- `src/demos/RenderingStrategiesDemo.jsx`
- `src/demos/HydrationStreamingDemo.jsx`
- `src/demos/RscBoundaryDemo.jsx`
- `src/demos/ServerFunctionsFrameworkDemo.jsx`
- `src/demos/index.js` registrations and existing `?raw` source mapping

## Evidence sources

Primary/current sources used for factual review:

- React official reference: Server Components, Server Functions, `"use server"`, `hydrateRoot`, server streaming APIs
- React Router official Framework Mode rendering-strategy documentation
- Testing Library official query priority / guiding principles
- Playwright official E2E documentation
- W3C WAI-ARIA Authoring Practices modal-dialog pattern
- repository React version and current runtime behavior

## Corrections made

### Testing terminology

`TestingStrategyDemo` no longer maps tools rigidly one-to-one to test levels.

- Clarified that Vitest is a test runner, not intrinsically “unit-only”.
- Clarified that Testing Library is a user-observable testing approach/library, not a fixed “integration-test layer”.
- Kept Playwright positioned as real-browser E2E for critical cross-system flows.
- Refined semantic-query guidance to prioritize `getByRole` with accessible name and `getByLabelText` for form controls rather than treating role/label/text as equivalent defaults.

### Modal accessibility boundary

`AccessibleModalDemo` now distinguishes the demonstrated focus mechanics from a production-complete modal.

- Kept initial focus, Tab/Shift+Tab containment, Escape and focus restoration.
- Explicitly states that a modal also requires background content to be non-interactive.
- Explicitly states that `aria-modal="true"` is semantic metadata and does not itself implement `inert`/background isolation.
- Documents missing production edges: full inert isolation, dynamic focusables, nested dialogs and scroll locking.

### Hydration and streaming

`HydrationStreamingDemo` wording was tightened to match current React docs.

- Hydration mismatch is explicitly treated as a bug rather than a synchronization mechanism.
- Notes that React does not guarantee patching every mismatched attribute/content detail.
- Adds an actual label/input association to the hydration control.
- Clarifies Node.js should prefer `renderToPipeableStream`; Web Streams environments such as Deno/edge use `renderToReadableStream`, while Node compatibility does not make the latter the recommended Node API.

### RSC / Client Component boundary

`RscBoundaryDemo` now avoids equating “Client Component” with “HTML only generated in the browser”.

- Clarifies Server Components execute in the RSC environment, which React documents as separate from the client app and traditional SSR renderer.
- Clarifies `"use client"` establishes a module-graph boundary.
- Clarifies that in frameworks combining RSC and SSR, Client Components can participate in server prerendering of initial HTML and later hydrate on the client.
- Keeps SSR and RSC as distinct layers that frameworks may compose.
- Keeps `"use server"` correctly scoped to Server Functions; there is no Server Component directive.

### Server Function / Server Action terminology

`ServerFunctionsFrameworkDemo` now follows current React terminology.

- Server Function is the general concept.
- A Server Function is a Server Action when passed to an Action prop or called from inside an Action; not all Server Functions are Server Actions.
- `"use server"` marks async Server Functions callable through framework-created server references.
- Server Function arguments remain untrusted server input and mutations require authentication/authorization/input validation.
- Direct event-driven calls should be made in a Transition; form `action` / `formAction` use Action semantics.
- React Router Framework Mode and Next.js App Router responsibilities are described as framework capabilities rather than React Core APIs.

## Findings that did not require edits

- `TypeScriptReactDemo` and its TSX samples correctly emphasize contract boundaries, inference, discriminated unions, typed refs and generics without encouraging blanket annotations or `any`.
- `AccessibilityBasicsDemo` correctly prefers native semantics and exposes loading/error/success through live-region roles.
- `RenderingStrategiesDemo` correctly separates React DOM rendering/hydration primitives from framework routing, SSG, caching and deployment policy.
- Repository wording consistently treats Event handlers as user-action causality and Effects as external synchronization; no conflicting Chapter 11–12 wording was found.
- Existing Server State material remains explicitly non-React-Core and does not conflict with the server-rendering/RSC terminology reviewed here.

## Registration / CodeViewer verification

No demo file path or source filename was renamed. Existing `src/demos/index.js` registrations and `?raw` imports for all edited demos remain valid; no registry mutation was required.

## Validation

Direct local execution was attempted but the execution container could not resolve `github.com`, so an executable checkout could not be cloned in this run. No local PASS is claimed from that attempt.

Validation must therefore be evidenced by the pull-request-triggered `React Learning Verify` workflow, which runs:

- `npm ci`
- `npm run lint`
- `npm run build`
- Playwright Chromium install
- `npm run test:e2e`
- production preview HTTP smoke

PR CI result: **PENDING at document creation time**.

## Remaining manual items

- Real screen-reader validation remains separate manual evidence; axe, DOM semantics and keyboard automation are not substitutes.
- The hand-written modal intentionally remains a teaching implementation rather than a production-complete dialog primitive.
