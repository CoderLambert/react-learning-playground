# Remaining Chapter 02 + TypeScript Execution Status

Branch: `learn/remain-02-typescript`
Base: `integration/react-complete-learning`

## Baseline

- `learn/ch01-02-ui-render` had no unique commits and was 55 commits behind integration when this continuation branch was created.
- Continuation branch was created from the latest integration tree to avoid replaying already merged Chapter 01 history.
- React Core facts are calibrated against current React official Learn/Reference docs.
- TypeScript guidance follows the current React TypeScript documentation and repository React 19.2.x types.

## Chapter 02 — 事件、State 与渲染模型

### Content implementation

- [x] 02-01 Event Handler / propagation
  - `src/demos/EventPropagationDemo.jsx`
  - Handler passing vs calling, capture/bubble, `stopPropagation`, `preventDefault`, Event-vs-Effect responsibility.
- [x] 02-02 `useState` + component memory
- [x] 02-03 State as Snapshot
- [x] 02-04 Update Queue / batching / functional updater
  - 02-02 ~ 02-04 are combined in `StateSnapshotQueueDemo.jsx` so snapshot and queue timing are observable in one experiment.
  - Includes direct replacement updates, three functional updaters, batching and delayed stale-snapshot observation.
- [x] 02-05 Object / Array immutable update
  - `ImmutableStateDemo.jsx`
  - Nested copy, append/remove/replace-style mapping, copy-before-reverse, and reference identity.
- [x] 02-06 Trigger → Render → Commit
  - `RenderCommitDemo.jsx`
  - Separates trigger/render/commit/browser paint and demonstrates render does not imply a visible DOM mutation.

### Registration / CodeViewer

- [x] Added `render-model` category to `src/demos/index.js`.
- [x] Registered all four Chapter 02 demos.
- [x] Registered all four `?raw` sources for CodeViewer.

Chapter 02 content/registration status: **COMPLETE**.

## Chapter 11 — TypeScript for React slice

- [x] Props contract typing
- [x] `children` typing with `ReactNode` boundary and `ReactElement` distinction explained in the lab
- [x] Event typing with concrete element-aware event types
- [x] State typing and discriminated-union state model
- [x] Ref typing with nullable concrete DOM target
- [x] Generic component typing
- [x] Generic custom Hook typing
- [x] Runnable JSX explainer: `src/demos/TypeScriptReactDemo.jsx`
- [x] Raw TSX source: `src/demos/typescript-samples/react-boundaries.tsx`
- [x] Raw TSX source: `src/demos/typescript-samples/generic-patterns.tsx`
- [x] Added `typescript` category and Demo / `?raw` registrations

### TypeScript mental model

- Type the **boundary/relationship**, not every local variable.
- Let inference handle obvious local values.
- Prefer concrete event/ref element types over `any`.
- Use discriminated unions when they prevent contradictory UI state.
- Use generics only when an input/output relationship must be preserved for the caller.
- The project remains JavaScript-first at runtime; raw TSX examples avoid an unnecessary whole-project migration.

## Deterministic quality gate

A minimal branch-local GitHub Actions workflow was added because the integration baseline has no equivalent workflow. It runs Node 24, `npm ci`, `npm run lint`, `npm run build`, starts Vite preview, and performs an HTTP smoke request against `/react-learning-playground/`.

Current evidence before PR workflow completion:

- `npm ci`: PENDING
- `npm run lint`: PENDING
- `npm run build`: PENDING
- preview HTTP smoke: PENDING
- browser interaction / console / narrow-screen smoke: PENDING manual evidence

No PASS is claimed without actual execution evidence.

## Completion

Dependency-safe content, Demo registration and CodeViewer registration are **CONTENT_COMPLETE**. The branch is ready for PR verification against `integration/react-complete-learning`; deterministic gate results must be updated from the actual GitHub Actions run.
