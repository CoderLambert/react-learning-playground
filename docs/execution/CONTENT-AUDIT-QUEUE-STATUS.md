# Content Audit Queue Status

## Baseline and ownership

- Repository: `CoderLambert/react-learning-playground`
- Baseline `main`: `76562aefc1dab2ac4ab780f36b96a2d30d7e7948`
- Audit branch: `automation/content-audit-queue`
- PR: `#80`, kept open and unmerged.

Specialist ownership checked before the latest batch:

- PR #79 `automation/content-contract-infra`: MDX teaching-component compatibility/canonicalization, semantic content tests, authoring guidance, shared TypeScript sample gate.
- PR #78 `automation/state-design-lessons`: controlled/uncontrolled, state structure, lifting state, preserving/resetting state.
- PR #81 `automation/typescript-learning`: TypeScript-for-React Note/Demo/TSX samples.
- PR #82 `automation/runtime-lessons`: event propagation, Event-vs-Effect, state snapshot/update queue.

This branch does not edit those actively owned lesson files. `main` remained unchanged during this run.

## Concrete residual fixes made by this queue

1. `ComponentJsxPureRenderDemo.jsx`: side-effect placement now follows causality rather than treating all network/external work as Event Handler work.
2. `PropsBasicsDemo.jsx`: props mutation wording now uses the immutable render-snapshot model rather than calling it an unpredictable side effect.
3. `StateReducerDemo.jsx`: removed `new Date()` from reducer execution; timestamps are created at the event boundary and carried by the action.
4. `UseReduceWithContextDemo.jsx`: removed `Date.now()` from reducer execution; IDs are generated before dispatch; removed absolute “dispatch-only never rerenders” claims; updated React 19 provider syntax.
5. `LifecycleOfReactiveEffectsDemo.jsx`: removed fake `[Cleanup]` / `[Setup]` entries written by the room-change handler. The UI now records a switch request and explains that the next Effect cycle will clean up/re-establish synchronization; the panel is no longer labeled as real lifecycle instrumentation.
6. `EffectEventDemo.jsx`: connection/setup count is now incremented inside the Effect setup rather than manually in the room-change handler. The Demo explicitly notes the development Strict Mode setup → cleanup → setup stress test.
7. `CustomHooksDemo.jsx`: `useOnlineSignal` now initializes from the actual browser `navigator.onLine` value (with a non-browser fallback) instead of assuming `true` until the first online/offline event.

## Audited lessons

Each item below has exactly one matching file under `src/content/notes-advice/`.

1. `component-jsx-pure-render.mdx` — A PASS / B PARTIAL / C PASS
2. `props.mdx` — A PASS / B PASS / C PASS
3. `children.mdx` — A PARTIAL / B PASS / C PASS
4. `multi-slots.mdx` — A PARTIAL / B FAIL / C PASS
5. `conditional-rendering.mdx` — A PARTIAL / B PASS / C PARTIAL
6. `rendering-lists-key.mdx` — A PASS / B PASS / C PASS
7. `prop-drilling.mdx` — A PASS / B PASS / C PASS
8. `immutable-state.mdx` — A PASS / B FAIL / C PASS
9. `render-commit.mdx` — A PASS / B FAIL / C PASS
10. `state-reducer.mdx` — A PARTIAL / B FAIL / C PASS
11. `context-propagation.mdx` — A PASS / B FAIL / C PASS
12. `use-reduce-with-context.mdx` — A PASS / B PARTIAL / C PASS
13. `use-ref.mdx` — A PASS / B PASS / C PASS
14. `use-effect-correct-usage.mdx` — A PASS / B FAIL / C PASS
15. `not-need-effect.mdx` — A PASS / B FAIL / C PASS
16. `lifecycle-of-reactive-effects.mdx` — A PASS / B PARTIAL / C PASS
17. `effect-event.mdx` — A PASS / B FAIL / C PASS
18. `custom-hooks.mdx` — A PASS / B PASS / C PASS
19. `advanced-ref.mdx` — A PASS / B FAIL / C PASS
20. `controlled-form.mdx` — A PASS / B PASS / C PASS
21. `form-data-modeling.mdx` — A PASS / B PARTIAL / C PASS
22. `form-action.mdx` — A PASS / B PASS / C PASS
23. `action-state-form-status.mdx` — A PASS / B PASS / C PASS
24. `optimistic-update.mdx` — A PASS / B PARTIAL / C PASS

## Material open findings

- `multi-slots`: Note uses `undefined/null/ReactNode`, while Source/Demo uses `undefined/false/ReactNode`.
- `conditional-rendering`: Demo contradicts itself about Empty as independently stored state vs a derivation from `items.length`.
- `immutable-state`: Note promises executable mutation-vs-copy comparison, but Demo has no runnable mutation counterexample.
- `render-commit`: Note promises render logs/component execution observation that the Demo does not expose; `requestAnimationFrame` is a browser-frame API, not React commit instrumentation.
- `state-reducer`: Note names actions not present in the Demo and asks UI observation to prove reducer purity.
- `context-propagation`: Note describes real render logs while Demo counters are manually advanced teaching predictions.
- `use-reduce-with-context`: only the split-Context implementation is interactive; the single-Context side is static code.
- `use-effect-correct-usage`: Note describes timer/dependency-change experiments not present in the Demo.
- `not-need-effect`: Note promises executable Effect-derived-state vs render-derived-state comparison; the bad path is static code only.
- `lifecycle-of-reactive-effects`: after removing fake lifecycle logs, the Demo demonstrates roomId-vs-isMuted dependency behavior but still does not instrument real cleanup/setup order or a functional-updater dependency-removal case.
- `effect-event`: setup counting is now real, but the Note promises an executable bad (`roomId + theme` dependencies) vs good Effect Event comparison while the Demo only runs the good version.
- `advanced-ref`: Note promises `useEffect` vs `useLayoutEffect` timing comparison, but Demo only implements `useLayoutEffect` measurement.
- `form-data-modeling`: Note asks for controlled-vs-uncontrolled comparison, while current Demo only executes the FormData/uncontrolled side.
- `optimistic-update`: rollback is observable, but the “simulate failure” branch is a business rejection that returns normally and leaves canonical state unchanged; it does not exercise an Action throw/Error Boundary path.

## Factual sources

Primary factual baseline is current official React documentation, including Components/Hooks purity, `useReducer`, Context, refs, Effects, Lifecycle of Reactive Effects, `useEffectEvent`, Custom Hooks, `useLayoutEffect`, `useImperativeHandle`, React 19 ref-as-prop/`forwardRef`, `<form>` Actions, `useActionState`, `useFormStatus`, and `useOptimistic`. MDN is used only for browser APIs such as `FormData`.

## Validation

Previous audit head `b2200ffd95d54a60cf3a1873a9d6d62951086615` has exact-head GitHub Actions evidence:

- `React Learning Verify` run `34645349675`: **success**
- `Workbench Integration Verify` run `34645349670`: **success**

The current batch adds three executable Demo fixes plus eleven new advice files and this status update. Those previous green runs are regression evidence only; latest-head GitHub Actions remain the acceptance source. No local lint/build result is claimed from the connector-only execution environment.

## Next

Continue in registry/navigation order from the next unaudited, unowned lesson. Reserved Runtime/State/TypeScript files remain skipped until their specialist branches are reconciled or closed. Prefer concrete correctness/Demo-contract fixes outside those scopes before adding further advice-only records.
