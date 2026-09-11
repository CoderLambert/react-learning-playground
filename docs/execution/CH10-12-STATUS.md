# Chapter 10-12 Execution Status

Branch: `learn/ch10-12-routing-advanced`

## Source baseline

- React version: `19.2.8`
- Chapter execution rules: `docs/REACT-LEARNING-TASK-GUIDE.md`
- Learning roadmap: `docs/REACT-COMPLETE-LEARNING-ROADMAP.md`
- React Core / SSR / RSC: React official documentation is the primary source.
- Router: React Router official documentation is the primary source.

## Chapter 10 — Router 与页面状态

- [x] 10-01 URL State / Route Params / Search Params mental model
  - Added `src/demos/UrlStateDemo.jsx`.
  - Demonstrates URL as a shareable/refreshable page-state source.
  - Separates resource identity (route params) from view state (search params).
  - Demonstrates single-source-of-truth derivation instead of duplicating filters into local state + Effect synchronization.
  - Registered under `routing` category and registered `?raw` source for CodeViewer.
- [x] 10-02 Nested Routes / Layout / Outlet
  - Added `src/demos/NestedRoutesDemo.jsx`.
  - Visualizes the matched route/component chain and each parent Outlet slot.
  - Covers index routes and pathless layout routes without pretending React Router is installed in this repository.
  - Registered Demo and `NestedRoutesDemo.jsx?raw` source.
- [x] 10-03 Navigation / 404 / route boundary
  - Added `src/demos/NavigationBoundaryDemo.jsx`.
  - Visualizes push / replace / Back / Forward history semantics and an explicit Not Found boundary.
  - Distinguishes normal user navigation (`Link` / `NavLink`) from programmatic navigation use cases.
  - Registered Demo and `NavigationBoundaryDemo.jsx?raw` source.
- [x] 10-04 Router data boundary / loader mental model
  - Added `src/demos/RouteDataBoundaryDemo.jsx`.
  - Visualizes route match → params → loader → pending → loader data / nearest route error boundary.
  - Separates route-level page data responsibility from ad-hoc mount Effect fetching and notes the Router / Server-State boundary.
  - Registered Demo and `RouteDataBoundaryDemo.jsx?raw` source.

### Chapter 10 Gate

Content tasks: COMPLETE.

- `npm run lint`: PENDING
- `npm run build`: PENDING
- `npm run preview` smoke: PENDING
- Focus / continuous reading / search / CodeViewer / console / narrow-screen smoke: PENDING

Execution note: the current automation environment can modify and inspect the GitHub branch, but does not currently expose an executable checkout for this repository. Per the chapter rules, Chapter 10 remains IN PROGRESS and Chapter 11 must not begin until the real gate passes.

## Chapter 11 — TypeScript / Testing / Accessibility

- [ ] Not started — blocked by Chapter 10 executable quality gate.

## Chapter 12 — SSR / Hydration / RSC / Framework

- [ ] Not started

## Integration

Final integration is intentionally blocked until all five chapter worker branches report completion with lint/build/smoke PASS.
