# Remaining Chapter 02 + TypeScript Execution Status

Branch: `learn/remain-02-typescript`
Base: `integration/react-complete-learning`

## Baseline

- `learn/ch01-02-ui-render` had no unique commits and was 55 commits behind integration when this continuation branch was created.
- Continuation branch was created from the latest integration tree to avoid replaying already merged Chapter 01 history.
- React Core facts are calibrated against current React official Learn/Reference docs.

## Chapter 02 — 事件、State 与渲染模型

### Content implementation

- [x] 02-01 Event Handler / propagation implementation
  - Added `src/demos/EventPropagationDemo.jsx`.
  - Covers passing vs calling handlers, capture/bubble, `stopPropagation`, `preventDefault`, and Event-vs-Effect responsibility.
- [x] 02-02 useState + component memory implementation
- [x] 02-03 State as Snapshot implementation
- [x] 02-04 Update Queue / batching / functional updater implementation
  - 02-02 ~ 02-04 are combined in `src/demos/StateSnapshotQueueDemo.jsx` so the snapshot and queue timeline is observable in one experiment.
  - Includes direct replacement updates, three functional updaters, and delayed stale-snapshot observation.
- [x] 02-05 Object / Array immutable update implementation
  - Added `src/demos/ImmutableStateDemo.jsx`.
  - Covers nested copying, append/remove/replace-style mapping, copy-before-reverse, and reference identity.
- [x] 02-06 Trigger → Render → Commit implementation
  - Added `src/demos/RenderCommitDemo.jsx`.
  - Separates trigger/render/commit/browser paint and shows render can occur while a displayed DOM value remains unchanged.

### Registration / CodeViewer

- [ ] Register Chapter 02 category/entries in `src/demos/index.js`.
- [ ] Register all four `?raw` source modules for CodeViewer.

Chapter 02 is therefore **CONTENT_IMPLEMENTED / REGISTRATION_PENDING**, not complete yet.

### Chapter 02 gate

- `npm ci`: PENDING (no executable checkout in this run)
- `npm run lint`: PENDING
- `npm run build`: PENDING
- `npm run preview` HTTP/browser smoke: PENDING
- Console / narrow-screen interactive smoke: PENDING

No gate result is marked PASS without real execution evidence.

## Chapter 11 — TypeScript for React slice

- [ ] Props / children typing
- [ ] Event typing
- [ ] State / discriminated union typing
- [ ] Ref typing
- [ ] Generic component / generic custom Hook typing
- [ ] Runnable JSX explainer + raw TypeScript source examples
- [ ] Demo / `?raw` registration

## Next

1. Safely rebuild `src/demos/index.js` from the current integration-derived registry and add the four Chapter 02 demos + raw sources without dropping any existing entries.
2. Implement the TypeScript-for-React learning slice.
3. Run any executable validation available; otherwise keep gate evidence explicitly PENDING.
4. Open/update a PR to `integration/react-complete-learning` once the content slice is coherently reviewable.
