# React Learning Workbench architecture

## Goal

Evolve the current React Learning Playground into a Workbench without destabilizing the existing 58 demos, 12 chapter checkpoints, focused/continuous reading modes, sidebar search, CodeViewer, GitHub Pages deployment or integration labs.

The target product model is:

```text
Navigation | Demo Workspace | Learning Inspector
                             | Notes / Source
```

Responsibility is intentionally split:

- **Navigation** — what to learn.
- **Demo Workspace** — what React does when the learner interacts with a runnable experiment.
- **Notes** — why the behavior occurs, the mental model, tradeoffs and production boundary.
- **Source** — how the experiment is implemented.

## Foundation contracts

### LearningUnit

The existing `src/demos/index.js` registry remains authoritative during migration. Workbench consumers use the compatibility mapping exported by `src/workbench/contracts.js`:

| Current registry | Workbench contract |
| --- | --- |
| `id` | `id` |
| `category` | `categoryId` |
| `label` | `title` |
| `Component` | `component` |
| `files` | `sources` |
| `description`, `badge`, optional `keywords` | searchable metadata |

Do not rewrite all registry entries merely to rename fields. The adapter exists so layout, inspector and content work can proceed independently.

### WorkbenchShell

The future shell is slot-based and owns layout only:

- `navigation`
- `content`
- `inspector`

It must not own learning content, source highlighting, MDX rendering or demo business state.

### LearningInspector

The stable state/prop concepts are:

- current `learningUnit`
- `open`
- active tab: `notes | source`
- `focusMode`
- numeric `width`
- selected `sourceFile`
- explicit callbacks for tab/open/focus/width/source-file changes

The implementation may use hooks or a reducer internally, but consumers should not depend on those internals.

### Note resolution

Notes use the convention:

```text
src/content/notes/<learning-unit-id>.mdx
```

Consumers resolve notes only through `getNoteLoader(learningUnitId)` from `src/workbench/noteRegistry.js`.

F0 returns `null` for every note because no MDX runtime is installed yet. The MDX Runtime worker will replace the implementation with lazy `import.meta.glob` resolution without changing the consumer API. Missing notes are a non-fatal state.

Manual note imports must not be added to all 58 registry entries.

### MDX teaching vocabulary

Approved initial primitives:

`Callout`, `MentalModel`, `Concept`, `Experiment`, `Observation`, `Compare`, `Timeline`, `Flow`, `Boundary`, `AntiPattern`, `CodeBlock`, `CodeDiff`, `DemoReference`, `Summary`, `FurtherReading`.

These primitives explain a Demo. They are not a second Demo runtime.

## Layout token contract

F0 defines future constants and CSS custom-property names but deliberately does not activate a new layout.

Default dimensions:

- navigation expanded: 288px
- navigation collapsed: 56px
- inspector default: 480px
- inspector minimum: 360px
- inspector maximum: min(900px, 60vw) policy
- resize handle: 8px
- keyboard resize step: 24px

Persistent-state keys use the `react-learning-workbench:` prefix.

## Module ownership

### Workbench Shell / Navigation worker

Owns:

- three-column shell/layout
- collapsible left navigation
- center workspace sizing
- shell-level responsive behavior

Does not own Notes, Source rendering or MDX compilation.

### Learning Inspector worker

Owns:

- Notes / Source tabs
- inspector open/close
- pointer and keyboard resize behavior
- accessible separator semantics
- app-level Focus Mode and Escape behavior
- inspector responsive presentation

### MDX Runtime worker

Owns:

- Vite MDX integration
- lazy note discovery/resolution
- note loading/error/missing states
- heading anchors and TOC extraction/render contract
- GFM/remark/rehype configuration as justified

`vite.config.*` changes belong here.

### MDX Teaching Components worker

Owns reusable pedagogical primitives and their scoped styling. It must not change demo behavior or create a second application shell.

### Source Inspector worker

Owns:

- CodeViewer adaptation/extraction
- shared Shiki highlighter abstraction
- multi-file source behavior
- copy behavior
- source scroll/file state integration

### Workbench State / URL worker

Owns:

- safe localStorage helpers
- persisted shell/inspector state
- URL-addressable demo selection
- invalid URL/state fallback behavior

### Content workers

Own primarily:

```text
src/content/notes/*.mdx
```

They must not redesign Workbench infrastructure. If the approved MDX vocabulary is insufficient, request an infrastructure addition rather than creating incompatible one-off component systems.

### E2E worker

Owns Workbench regression, keyboard, responsive and accessibility coverage in `tests/e2e/*`.

### Integration worker

Owns major wiring in `src/App.jsx` and conflict resolution after feature branches are ready. Content workers should not make broad App changes.

## Shared-file ownership rules

| File / area | Primary owner |
| --- | --- |
| `src/App.jsx` major wiring | Integration worker |
| `src/demos/index.js` | Avoid changes; Integration worker if necessary |
| `vite.config.*` | MDX Runtime worker |
| `package.json` / lockfile | Infrastructure worker that introduces an approved dependency |
| global Workbench layout CSS | Workbench Shell worker |
| inspector CSS | Learning Inspector worker |
| MDX component CSS | MDX Teaching Components worker |
| `src/components/CodeViewer.jsx` | Source Inspector worker |
| `src/content/notes/*.mdx` | Reference/content workers |
| `tests/e2e/*` | E2E worker |

## Parallel execution plan

After this foundation is merged, these streams may proceed in parallel against the frozen contracts:

1. Workbench Shell + Navigation
2. Learning Inspector
3. MDX Runtime
4. MDX Teaching Components
5. Source Inspector
6. Workbench State + URL

Then integrate infrastructure, implement three reference notes, freeze the MDX API, and only then fan out Chapter 01–03 / 04–06 / 07–09 / 10–12 content workers.

## Explicitly deferred from F0

F0 does not add MDX packages, note rendering, TOC UI, layout migration, sidebar collapse behavior, inspector tabs/resizing/focus mode, source migration, URL state, full-text search, or any of the 58 MDX notes.

The current application UI and runtime behavior must remain unchanged by this foundation branch.
