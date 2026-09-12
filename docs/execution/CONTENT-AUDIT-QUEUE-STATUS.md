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

1. `use-effect-correct-usage.mdx` — Gate B **FAIL → PASS**.
   - Removed claims about a timer experiment and a watcher dependency-change experiment that the Demo does not implement.
   - The Note now asks learners to observe the two real external-system boundaries: resize listener mount/unmount and `pageTitleBadge → document.title` synchronization.
   - It explicitly distinguishes button-handler explanatory messages from real Effect lifecycle instrumentation.

2. `advanced-ref.mdx` — Gate B **FAIL → PASS**.
   - Removed the nonexistent `useEffect` vs `useLayoutEffect` side-by-side experiment.
   - The executable contract now matches the Demo: switch box width and observe layout measurement, then invoke the narrow `focus()` / `select()` imperative handle.
   - The decision rule remains: use layout effects only when work must happen before repaint; do not treat them as a generally stronger Effect.

3. `form-data-modeling.mdx` — Gate B **PARTIAL → PASS**.
   - Removed the nonexistent controlled/uncontrolled side-by-side experiment.
   - The executable experiment now observes that uncontrolled edits do not update the React output on every keystroke and that submit creates the FormData snapshot/payload.
   - Controlled-vs-uncontrolled selection remains in Boundary as a production decision rule based on whether React needs the value before submit.

These changes intentionally prefer truthful experiment scope over expanding every Demo merely to satisfy old prose.

## Previously resolved concrete repository issues

- Real URL/History state and `popstate` behavior in `UrlStateDemo`.
- Router notes now distinguish simulator behavior from real Router runtime behavior.
- Playwright teaching sample preserves the configured base path.
- Rendering strategy / hydration / RSC / Server Function boundaries corrected.
- Named-slot three-state contract aligned across Note/Demo/Source.
- Conditional-rendering Empty semantics reconciled.
- `useSyncExternalStore` now exposes real subscribe/unsubscribe evidence.
- `PortalThirdPartyDemo` lifecycle evidence comes from real Effect setup/cleanup.
- Several reducer/effect/ref demos had fake or misleading instrumentation removed or narrowed.

## Current gate state for audited lessons

Resolved to full PASS in this queue include: `multi-slots`, `conditional-rendering`, `external-store`, `use-effect-correct-usage`, `advanced-ref`, and `form-data-modeling`, in addition to the lessons already passing at first audit.

Material findings still open and safe for this queue to address, subject to rechecking ownership before each change:

- `immutable-state`: Note promises executable mutation-vs-copy comparison, but Demo has no runnable mutation counterexample.
- `render-commit`: Note promises render logs/component execution observation that the Demo does not expose; `requestAnimationFrame` is a browser-frame API, not React commit instrumentation.
- `context-propagation`: Note describes real render logs while Demo counters are manually advanced predictions.
- `use-reduce-with-context`: only the split-Context implementation is interactive; the single-Context side is static code.
- `not-need-effect`: Note promises executable Effect-derived-state vs render-derived-state comparison; bad path is static code only.
- `lifecycle-of-reactive-effects`: Demo still does not instrument real cleanup/setup order or the functional-updater dependency-removal case.
- `effect-event`: Note promises executable bad dependency list vs Effect Event comparison while Demo only runs the good version.
- `optimistic-update`: “simulate failure” is a normal business rejection, not an Action throw/Error Boundary path.
- `transition-deferred`: no direct-update control and no instrumentation proving interrupted background renders.
- `render-vs-dom-update`: MutationObserver is real DOM evidence, but `renderRequest` is not actual render instrumentation.
- `profiler`: ordinary React production builds disable Profiler instrumentation by default; production measurement needs profiling-enabled tooling/builds.

State/reducer findings that overlap PR #78 remain reserved rather than duplicated here.

## Factual baseline

React semantics are checked against current official React 19.2 documentation. Browser behavior uses platform documentation where applicable. The audit rule remains:

1. correctness/version scope;
2. Demo ↔ Note ↔ Source/CI contract;
3. usable mental model and production decision rule;
4. only then readability and optional polish.

## Validation

Earlier executable-fix heads have passed `React Learning Verify` and `Workbench Integration Verify`. The latest run changes are MDX/advice contract corrections only; exact-head GitHub Actions remain the acceptance source because this environment does not expose a local executable checkout.

## Next

Continue with the highest-value unowned Demo-contract failures before adding new audit breadth. Prefer fixing false experiment claims or real instrumentation gaps over low-value template churn, and keep exactly one advice record per note.
