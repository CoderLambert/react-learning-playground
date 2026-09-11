# Content Audit Queue Status

## Baseline

- Repository: `CoderLambert/react-learning-playground`
- Baseline `main`: `76562aefc1dab2ac4ab780f36b96a2d30d7e7948`
- Audit branch: `automation/content-audit-queue`
- PR: `#80` (`automation/content-audit-queue` -> `main`), kept open and unmerged.

## Parallel ownership observed

Current open specialist PRs were re-inspected before this batch:

- `#79` / `automation/content-contract-infra`: MDX teaching-component compatibility, canonical prop normalization, semantic content tests, authoring guidance, shared package/typecheck scripts.
- `#78` / `automation/state-design-lessons`: state ownership/modeling lessons including controlled/uncontrolled, state structure, lifting state, preserving/resetting state.
- `#81` / `automation/typescript-learning`: TypeScript-for-React Note/Demo/TSX samples.
- `#82` / `automation/runtime-lessons`: event propagation, Event-vs-Effect, state snapshot/update queue.

This audit branch does not edit their actively owned lesson files. For general notes that the infrastructure branch may mechanically normalize, this branch writes review records only unless there is a concrete correctness defect in a non-shared Demo/source file.

## Run 1

### Residual issue fixed

`src/demos/ComponentJsxPureRenderDemo.jsx` previously grouped network requests and other side effects under Event Handler guidance too broadly. The wording now follows causality instead of API category:

- explicit user-triggered work → usually Event Handler;
- synchronization required by the currently rendered UI → consider Effect;
- data fetching → also respect framework/data-layer responsibilities.

The core invariant remains: side effects do not run during render.

### Lesson audited

- Note: `src/content/notes/component-jsx-pure-render.mdx`
- Advice: `src/content/notes-advice/component-jsx-pure-render.mdx`
- Gate A Correctness: PASS after the Demo wording correction.
- Gate B Demo Contract: PARTIAL — the Note's `DemoReference.observe` overstates what the current simulated Demo can directly observe about real render/commit execution.
- Gate C Mental Model: PASS.

Recommended next content edit: narrow the DemoReference observation claim and add the official React `local mutation` purity boundary. The Note itself was intentionally not edited because the content-contract task is concurrently normalizing MDX note APIs.

## Run 2

### Residual issue fixed

`src/demos/PropsBasicsDemo.jsx` described direct props mutation as potentially causing “unpredictable side effects”. That mixed two separate React concepts: render side effects and immutable render inputs. The text now follows the React 19.2 rule more precisely: props are read-only snapshots for the current render; mutating them breaks local reasoning and can produce inconsistent output.

### Lessons audited in navigation order

1. `props.mdx` -> `notes-advice/props.mdx`
   - Gate A: PASS after Demo wording correction.
   - Gate B: PASS.
   - Gate C: PASS.
   - Main recommendation: explicitly distinguish “props may differ across renders” from “current render receives an immutable snapshot”; clarify callback props as ordinary function props shaped by state ownership.

2. `children.mdx` -> `notes-advice/children.mdx`
   - Gate A: PARTIAL.
   - Gate B: PASS.
   - Gate C: PASS.
   - Concrete issue recorded: the Demo contains unrelated, over-broad React 19 / Compiler marketing text and slightly overstates container-owned accessibility responsibilities. No edit was made to the note because the infrastructure task may mechanically normalize it.

3. `multi-slots.mdx` -> `notes-advice/multi-slots.mdx`
   - Gate A: PARTIAL.
   - Gate B: FAIL.
   - Gate C: PASS.
   - Concrete contract mismatch: Note asks learners to observe `undefined / null / ReactNode`, while the actual `ProductionModal`/`Pannel` source and Demo define `undefined / false / ReactNode`. The lesson must choose one hide sentinel and make Note/Demo/Source agree. The current “widely adopted industrial tri-state standard” framing is also too broad for a project-specific API convention.

4. `conditional-rendering.mdx` -> `notes-advice/conditional-rendering.mdx`
   - Gate A: PARTIAL.
   - Gate B: PASS.
   - Gate C: PARTIAL.
   - Concrete contradiction: the Demo says Empty must be an independent business state and should not be represented as success with an empty array, but later correctly says `isEmpty` should be derived from `items.length` when possible. Advice separates UI semantics from storage/state modeling and notes that loading/data can also coexist during refetch.

5. `rendering-lists-key.mdx` -> `notes-advice/rendering-lists-key.mdx`
   - Gate A: PASS.
   - Gate B: PASS.
   - Gate C: PASS.
   - Main recommendation: add the high-value boundary that `key` is not passed to the child as a prop, and keep reconciliation wording at the documented identity-model level rather than promising internal implementation details.

6. `prop-drilling.mdx` -> `notes-advice/prop-drilling.mdx`
   - Gate A: PASS.
   - Gate B: PASS.
   - Gate C: PASS.
   - React 19.2 note: `<SomeContext value={...}>` is the current provider form; `.Provider` still works but is the pre-React-19 form. Context consumers update when the provided value changes according to `Object.is`; avoid saying the entire provider subtree inherently rerenders because of Context.

7. `immutable-state.mdx` -> `notes-advice/immutable-state.mdx`
   - Gate A: PASS.
   - Gate B: FAIL.
   - Gate C: PASS.
   - The Note promises an executable mutation-vs-copy comparison, while the Demo only provides correct immutable operations plus a warning string. Either add an isolated mutation counterexample or narrow the Experiment to observable reference changes that the Demo actually implements.

8. `render-commit.mdx` -> `notes-advice/render-commit.mdx`
   - Gate A: PASS with wording caution.
   - Gate B: FAIL.
   - Gate C: PASS.
   - The Note says learners can observe render logs/component execution, but the Demo has no render log or execution counter. `requestAnimationFrame` is also a browser frame API, not a React commit callback, so the current wording should not imply direct commit instrumentation.

Reserved lessons were skipped rather than duplicated: `event-propagation.mdx` and `state-snapshot-queue.mdx` belong to PR #82; state ownership lessons belong to PR #78. The queue should continue from the next unowned navigation item.

## Run 3

### Residual issues fixed

1. `src/demos/StateReducerDemo.jsx`
   - The reducer previously called `new Date().toLocaleTimeString()` while claiming to be pure.
   - Timestamp creation now happens in the event-handler boundary and is carried by the action, so the same `(state, action)` produces the same next state.
   - The selection guidance was tightened: complex object shape alone is not a reason to use `useReducer`; shared transition rules, auditability and testability are better signals.
   - Marketing-like “architecture/state-machine” wording was reduced where the Demo does not model an explicit finite-state machine.

2. `src/demos/UseReduceWithContextDemo.jsx`
   - The reducer previously called `Date.now()` to generate task IDs. ID creation now happens before dispatch and is passed in the action.
   - Removed absolute claims that dispatch-only consumers “never” re-render. Splitting State/Dispatch Context narrows Context subscriptions; it does not suppress renders from every other source.
   - Updated provider syntax to React 19 `<Context value={...}>` form and reframed the lesson around subscription boundaries instead of “performance magic”.

These corrections follow the official React requirements that reducers be pure, `dispatch` have stable identity, Context consumers receive updated values when the provided value changes, and `memo`/subscription boundaries are optimizations rather than global render guarantees.

### Lessons audited in navigation order

9. `state-reducer.mdx` -> `notes-advice/state-reducer.mdx`
   - Gate A: PARTIAL after Demo purity fix.
   - Gate B: FAIL.
   - Gate C: PASS.
   - Note names `add/update/remove` actions that do not exist in the Demo (`INCREMENT/DECREMENT/SET_STEP/RESET/UNDO`). It also asks the learner to prove reducer purity from UI observation, which the Demo cannot establish.

10. `context-propagation.mdx` -> `notes-advice/context-propagation.mdx`
   - Gate A: PASS.
   - Gate B: FAIL.
   - Gate C: PASS.
   - Note says to inspect real render logs, but Demo `renderCounts` are manually advanced teaching predictions rather than instrumentation. The reliable observable phenomenon is fresh Context value propagation, including through a memoized consumer.

11. `use-reduce-with-context.mdx` -> `notes-advice/use-reduce-with-context.mdx`
   - Gate A: PASS after Demo fixes.
   - Gate B: PARTIAL.
   - Gate C: PASS.
   - The interactive Demo only executes the split-Context version; the “single Context vs dual Context” side is currently a static code card, so the Note overstates the executable comparison. Advice recommends either adding a real single-Context control or narrowing the Experiment.

## Sources used for factual review

Primary references were current official React documentation for:

- Components and Hooks must be pure / immutable props and state;
- Passing Props to a Component;
- Rendering Lists;
- Preserving and Resetting State;
- Updating Objects in State;
- Updating Arrays in State;
- `useReducer` and Extracting State Logic into a Reducer;
- Scaling Up with Reducer and Context;
- `useContext` / `createContext` React 19 provider semantics;
- `memo` Context behavior;
- Render and Commit / purity guidance.

## Validation

Previous audit head `52ebaf8fd21c245d4e440633e89e8c1c0e4add59` has exact-head GitHub Actions evidence:

- `React Learning Verify` run `34640431132`: **success**
- `Workbench Integration Verify` run `34640431137`: **success**

Run 3 adds two executable Demo fixes plus three advice files, so those previous green runs are regression evidence only, not acceptance evidence for the new head. No local checkout/runtime is exposed through the GitHub connector; local lint/build is not claimed. Exact-head workflows on the latest PR head remain the acceptance source.