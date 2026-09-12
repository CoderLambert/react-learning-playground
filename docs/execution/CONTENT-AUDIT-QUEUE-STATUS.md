# Content Audit Queue Status

## Baseline and ownership

- Repository: `CoderLambert/react-learning-playground`
- Baseline `main`: `76562aefc1dab2ac4ab780f36b96a2d30d7e7948`
- Audit branch: `automation/content-audit-queue`
- PR: `#80`, kept open and unmerged.

Specialist ownership remains reserved by the open PRs:

- PR #79 `automation/content-contract-infra`: shared MDX/content-contract infrastructure and TypeScript sample gate.
- PR #78 `automation/state-design-lessons`: state ownership/modeling lessons.
- PR #81 `automation/typescript-learning`: TypeScript-for-React Note/Demo/TSX samples.
- PR #82 `automation/runtime-lessons`: event propagation, Event-vs-Effect, state snapshot/update queue.

This queue does not duplicate those files.

## Progress

50 lessons have matching one-to-one advice records under `src/content/notes-advice/`. Existing advice files are updated in place when findings are resolved; no duplicate review records are created.

### Findings resolved in the latest run

1. `render-vs-dom-update.mdx` — Gate B **PARTIAL → PASS**.
   - Removed the handler-maintained `renderRequest` proxy.
   - `RenderedPreview` now increments instrumentation at the component-function execution point, so the displayed count reflects actual component executions rather than predicted requests.
   - The Demo and Note explicitly state that development Strict Mode may add extra component calls and that MutationObserver proves mutations only inside the observed target DOM subtree.

2. `profiler.mdx` — Gate A **PARTIAL → PASS**.
   - Corrected the production-build boundary: ordinary production React builds disable profiling instrumentation by default.
   - Production-like `<Profiler>` measurement now points to profiling-enabled production builds/tooling rather than a generic production bundle.
   - `baseDuration` is explicitly described as an estimated worst-case render cost, not a measured “memoization disabled” timing.

3. `optimistic-update.mdx` — Gate B **PARTIAL → PASS**.
   - Renamed the Demo path from generic “server failure” to “business rejection (normal return)”.
   - Note/Demo/Source now agree that this path ends the Action without updating canonical state, causing the optimistic projection to disappear.
   - True Action throw / Error Boundary handling is explicitly separated as another error path instead of being implied by the rejection simulation.

4. `context-propagation.mdx` — Gate B **FAIL → PASS**.
   - Removed button-handler-maintained render predictions.
   - Consumer, memo Consumer, and memo Non-consumer now count executions at the component-function execution point.
   - The experiment now cleanly separates parent local-state re-rendering from Context value changes, while documenting Strict Mode and whole-value identity/selector boundaries.

## Previously resolved concrete repository issues

- Real URL/History state and `popstate` behavior in `UrlStateDemo`.
- Router notes now distinguish simulator behavior from real Router runtime behavior.
- Playwright teaching sample preserves the configured base path.
- Rendering strategy / hydration / RSC / Server Function boundaries corrected.
- Named-slot three-state contract aligned across Note/Demo/Source.
- Conditional-rendering Empty semantics reconciled.
- `useSyncExternalStore` now exposes real subscribe/unsubscribe evidence.
- `PortalThirdPartyDemo` lifecycle evidence comes from real Effect setup/cleanup.
- `use-effect-correct-usage`, `advanced-ref`, and `form-data-modeling` stale experiment claims were aligned to their real Demos.
- Several reducer/effect/ref demos had fake or misleading instrumentation removed or narrowed.

## Current gate state for audited lessons

Resolved to full PASS in this queue include: `multi-slots`, `conditional-rendering`, `external-store`, `use-effect-correct-usage`, `advanced-ref`, `form-data-modeling`, `render-vs-dom-update`, `profiler`, `optimistic-update`, and `context-propagation`, in addition to lessons already passing at first audit.

Material findings still open and safe for this queue to address, subject to rechecking ownership before each change:

- `immutable-state`: Note promises executable mutation-vs-copy comparison, but Demo has no runnable mutation counterexample.
- `render-commit`: Note promises render logs/component execution observation that the Demo does not expose; `requestAnimationFrame` is a browser-frame API, not React commit instrumentation.
- `use-reduce-with-context`: only the split-Context implementation is interactive; the single-Context side is static code.
- `not-need-effect`: Note promises executable Effect-derived-state vs render-derived-state comparison; bad path is static code only.
- `lifecycle-of-reactive-effects`: Demo still does not instrument real cleanup/setup order or the functional-updater dependency-removal case.
- `effect-event`: Note promises executable bad dependency list vs Effect Event comparison while Demo only runs the good version.
- `transition-deferred`: no direct-update control and no instrumentation proving interrupted background renders.

State/reducer findings that overlap PR #78 remain reserved rather than duplicated here.

## Factual baseline

React semantics are checked against current official React 19.2 documentation. Browser behavior uses platform documentation where applicable. The audit rule remains:

1. correctness/version scope;
2. Demo ↔ Note ↔ Source/CI contract;
3. usable mental model and production decision rule;
4. only then readability and optional polish.

## Validation

Earlier executable-fix heads have passed `React Learning Verify` and `Workbench Integration Verify`. Exact-head GitHub Actions remain the acceptance source for this run because this environment does not expose a local executable checkout. No new PASS is claimed until workflows report against the current head.

## Next

Continue with the highest-value unowned Demo-contract failures before adding new audit breadth. Prefer fixing false experiment claims or real instrumentation gaps over low-value template churn, and keep exactly one advice record per note.
