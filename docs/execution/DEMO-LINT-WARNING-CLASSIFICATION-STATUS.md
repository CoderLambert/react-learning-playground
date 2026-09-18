# Teaching Demo lint warning classification

Issue: #237
Execution base: `03512f928f8d4d29ba1c8e673a7fe56a130de998`
Scope: `src/demos/**`

## Baseline

Fresh `npm run lint` on the execution base reported 18 warnings in seven Demo
files. The remaining repository warnings are outside this Issue's scope. The
Demo audit found no accidental implementation warnings.

## Warning matrix

| File / rule | Classification | Evidence and disposition |
| --- | --- | --- |
| `EffectEventDemo.jsx` / `react(set-state-in-effect)` | `INTENTIONAL_TEACHING_EXCEPTION` | Both setup counters are state-backed visible instrumentation for the reactive-vs-Effect-Event comparison; narrow Effect-local suppressions retain the experiment. |
| `EventVsEffectDemo.jsx` / `react(set-state-in-effect)` | `INTENTIONAL_TEACHING_EXCEPTION` | The State + Effect purchase path is the deliberate anti-pattern contrasted with the direct event-handler path; narrow Effect-local suppression retains the comparison. |
| `ContextPropagationDemo.jsx` / `react(refs)` | `INTENTIONAL_TEACHING_EXCEPTION` | Three components increment render counters at function execution to make Context, `memo`, and non-consumer propagation observable; component-local suppressions retain the measurement. |
| `ImmutableStateDemo.jsx` / `react(immutability)` | `INTENTIONAL_TEACHING_EXCEPTION` | `mutateSameReference` is the explicit broken path that demonstrates why State snapshots are immutable; the mutation and only its rule are locally suppressed. |
| `RenderVsDomUpdateDemo.jsx` / `react(refs)` | `INTENTIONAL_TEACHING_EXCEPTION` | The render counter is compared with a real `MutationObserver` count to teach render-versus-DOM-update semantics; the preview component alone is suppressed. |
| `typescript-samples/react-boundaries.tsx` / `react(only-export-components)` | `INTENTIONAL_TEACHING_EXCEPTION` | `renderLoadState` is an exported discriminated-union helper intentionally colocated with the component contracts in a raw CodeViewer/typecheck sample. |
| `typescript-samples/generic-patterns.tsx` / `react(only-export-components)` | `INTENTIONAL_TEACHING_EXCEPTION` | `useHistory` is an exported generic Hook intentionally colocated with the generic component contract in a raw CodeViewer/typecheck sample. |

No lesson ID, registry order, demo behavior, or content was rewritten to make
lint green. All suppressions are rule-specific and limited to the teaching
site or sample that requires them; there is no global or path-wide disable.
