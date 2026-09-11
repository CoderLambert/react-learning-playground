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

The next navigation item is `event-propagation.mdx`, but it remains owned by the runtime-mechanism PR and is intentionally skipped. The queue should resume at the next unowned lesson after all reserved runtime/state files are skipped.

## Sources used for factual review

Primary references were current official React documentation for:

- Components and Hooks must be pure / immutable props and state;
- Passing Props to a Component;
- Rendering Lists;
- Preserving and Resetting State;
- `useContext` / `createContext` React 19 provider semantics.

## Validation

This branch currently contains two JSX prose/correctness wording fixes plus advice/status documentation. No local checkout/runtime is exposed through the GitHub connector, so local lint/build is not claimed. Exact-head GitHub workflow evidence is the validation source; future runs must inspect the newest head before reporting PASS.