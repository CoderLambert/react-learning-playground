# Remaining Chapter 06 + Accessibility Status

Branch: `learn/remain-06-a11y`
Base: `integration/react-complete-learning`

## Source baseline

- React Core / Suspense / concurrency / `use`: React official current documentation is the primary source.
- Accessibility: W3C WAI / WAI-ARIA APG and native HTML semantics are the primary references.
- Execution rules: `docs/REACT-LEARNING-TASK-GUIDE.md`.
- Roadmap: `docs/REACT-COMPLETE-LEARNING-ROADMAP.md`.

## Chapter 06 — Suspense 与并发 UI

- [x] 06-01 `lazy` + `Suspense` + code splitting
  - Added `src/demos/LazySuspenseDemo.jsx`.
  - Added independently loaded `src/components/LazyLessonPanel.jsx`.
  - Visualizes first render → lazy loader → Suspense fallback → resolved module.
  - Explains that the lazy loader/result is cached and `lazy()` should be declared outside components.
  - Demo and both `?raw` sources registered in `src/demos/index.js`.
- [x] 06-02 Suspense Boundary / Nested Suspense
  - Added `src/demos/SuspenseBoundaryDemo.jsx`.
  - Uses stable cached Promises consumed through React `use`.
  - Visualizes outer-vs-nested fallback and progressive reveal with intentionally different resource delays.
  - Explains that Suspense only reacts to Suspense-enabled resources/code, not arbitrary fetch state.
  - Demo and `?raw` source registered.
- [x] 06-03 Error Boundary
  - Added `src/demos/ErrorBoundaryUseDemo.jsx`.
  - Implements a local class Error Boundary without adding a dependency.
  - Visualizes pending Promise → Suspense fallback and rejected Promise → Error Boundary fallback.
  - Explicitly distinguishes render-time errors from normal event-handler / asynchronous callback errors.
  - Demo and `?raw` source registered.
- [x] 06-04 `useTransition` / `startTransition`
  - Added `src/demos/TransitionDeferredDemo.jsx`.
  - Visualizes urgent selected-tab state vs non-urgent committed content and `isPending`.
  - Keeps controlled input updates urgent.
  - Demo and `?raw` source registered.
- [x] 06-05 `useDeferredValue`
  - Covered in `TransitionDeferredDemo.jsx`.
  - Visualizes input value vs deferred value and stale-result UI.
  - Explicitly distinguishes deferred rendering from debounce: no fixed delay and no automatic request suppression.
- [x] 06-06 React 19 `use`
  - Covered in `SuspenseBoundaryDemo.jsx` and `ErrorBoundaryUseDemo.jsx`.
  - Promise identity is kept stable/cached instead of creating new Promises during render.
  - Covers Promise pending/resolved/rejected routing to Suspense/Error Boundary.

### Chapter 06 content status

Content tasks: **COMPLETE**.

Mandatory executable gate is not claimed as passed in this environment:

- `npm ci`: PENDING
- `npm run lint`: PENDING
- `npm run build`: PENDING
- `npm run preview` HTTP/browser smoke: PENDING
- Focus / continuous reading / search / CodeViewer interaction / console / narrow-screen smoke: PENDING

No PASS result is fabricated.

## Chapter 11 — Accessibility slice

- [x] Native semantic HTML and accessible names
  - Added `src/demos/AccessibilityBasicsDemo.jsx`.
  - Uses native `form`, `label`, `input`, and `button` semantics.
  - Demonstrates `aria-describedby` as supplemental description instead of replacing labels.
- [x] Keyboard interaction
  - Basics demo can be completed with Tab / Shift+Tab / Enter using native controls.
  - Modal demo implements Tab / Shift+Tab containment and Escape close behavior.
- [x] Focus management
  - Added `src/demos/AccessibleModalDemo.jsx`.
  - Moves focus into the dialog, traps keyboard focus, and restores focus to the opener after close.
- [x] ARIA boundary
  - Demonstrates `role="dialog"`, `aria-modal`, `aria-labelledby`, `aria-describedby`, `role="status"`, and `role="alert"` only where native semantics alone do not express the UI state.
  - Explicitly documents that ARIA describes semantics/state and does not create missing keyboard behavior.
- [x] Loading / error / success accessible feedback
  - `AccessibilityBasicsDemo.jsx` exposes asynchronous state changes through polite/assertive live regions.
- [x] Production boundary
  - Modal demo states that full inert background handling, nested dialogs, scroll locking, and other edge cases should normally be delegated to a tested accessible dialog primitive.

### Accessibility content status

Content slice: **COMPLETE**.

Executable/browser accessibility verification remains PENDING because no runnable checkout/browser gate was available in this worker:

- keyboard smoke: PENDING
- screen-reader/manual semantics smoke: PENDING
- browser console: PENDING
- narrow-screen smoke: PENDING

## Registration audit

Registered categories:

- `async-ui` — Suspense 与并发 UI
- `accessibility` — Accessibility

Registered Demo + CodeViewer sources:

- `LazySuspenseDemo.jsx?raw`
- `LazyLessonPanel.jsx?raw`
- `SuspenseBoundaryDemo.jsx?raw`
- `ErrorBoundaryUseDemo.jsx?raw`
- `TransitionDeferredDemo.jsx?raw`
- `AccessibilityBasicsDemo.jsx?raw`
- `AccessibleModalDemo.jsx?raw`

## Next

This worker's dependency-safe content is complete. The branch should be reviewed/merged into `integration/react-complete-learning` by the final integration worker after executable CI/gate evidence is available. Until then, quality-gate status remains PENDING rather than PASS.
