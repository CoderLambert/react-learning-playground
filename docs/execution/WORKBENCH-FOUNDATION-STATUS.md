# Workbench Foundation Status

Branch: `feat/workbench-foundation`

Base `main` SHA: `ee4580a660d527c9c2d1be9d386ded1cae6683d8`

## Scope

F0 establishes contracts for the React Learning Workbench only. It intentionally does not change the current UI, migrate `App.jsx`, install MDX packages, move CodeViewer, add notes, or implement resize/collapse/focus behavior.

## Foundation created

- `src/workbench/constants.js`
  - navigation / inspector dimension defaults
  - keyboard resize step
  - persistent state keys
  - CSS custom-property names
  - Notes / Source tab names and default inspector state
- `src/workbench/contracts.js`
  - future `LearningUnit` mapping
  - `WorkbenchShell` slot contract
  - `LearningInspector` state/prop contract
- `src/workbench/noteRegistry.js`
  - note filename/path convention
  - stable `getNoteLoader(learningUnitId)` consumer API
  - missing-note behavior is non-fatal `null`
- `src/workbench/tokens.css`
  - future Workbench CSS variable contract only; it is not imported by F0, so current layout is unchanged
- `src/components/learning-inspector/index.js`
  - versioned inspector contract export surface
- `src/components/mdx/index.js`
  - versioned approved teaching-component vocabulary
- `src/content/notes/README.md`
  - MDX authoring and ownership rules
- `docs/architecture/REACT-LEARNING-WORKBENCH.md`
  - module boundaries and parallel-development ownership

## LearningUnit mapping decision

The current `src/demos/index.js` registry remains the metadata source of truth during migration. F0 does not rewrite all 58 entries.

Mapping:

- `id` -> `id`
- `category` -> `categoryId`
- `label` -> `title`
- `Component` -> `component`
- `files` -> `sources`
- `description`, `badge`, optional `keywords` -> searchable metadata

`toLearningUnit(demo)` provides the compatibility adapter.

## Note convention

Notes will live at:

```text
src/content/notes/<learning-unit-id>.mdx
```

Consumers use `getNoteLoader(learningUnitId)`. F0 returns `null` because the MDX runtime is explicitly deferred; the future runtime must preserve this API and implement lazy discovery rather than 58 eager/manual imports.

## MDX teaching vocabulary

Initial approved names:

- Callout
- MentalModel
- Concept
- Experiment
- Observation
- Compare
- Timeline
- Flow
- Boundary
- AntiPattern
- CodeBlock
- CodeDiff
- DemoReference
- Summary
- FurtherReading

Rule: center Demo = runnable experiment; MDX interactive component = explanation. Notes must not mount complete existing demos as a second runtime.

## Persistent-state keys

All keys use the `react-learning-workbench:` prefix:

- navigation collapsed
- inspector open
- inspector width
- inspector active tab
- active source file

## Explicitly deferred

- MDX dependencies / Vite MDX configuration
- final three-column Workbench layout
- navigation collapse behavior
- Learning Inspector visual implementation
- pointer/keyboard resize implementation
- Focus Mode
- note rendering / TOC
- CodeViewer migration / Shiki extraction
- demo URL state
- 58 MDX notes
- note full-text search

## Validation

The authoritative executable evidence for this connector-authored branch is the PR-triggered `React Learning Verify` workflow.

- `npm ci`: **PENDING**
- `npm run lint`: **PENDING**
- `npm run build`: **PENDING**
- Chromium E2E: **PENDING**
- production preview HTTP smoke: **PENDING**

No PASS is claimed until GitHub Actions executes on the branch head.
