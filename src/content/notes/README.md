# Workbench learning notes

This directory is reserved for the future MDX learning-document layer of the React Learning Workbench.

## File naming

Use exactly one file per learning unit:

```text
<learning-unit-id>.mdx
```

Example:

```text
rendering-strategies.mdx
state-snapshot-queue.mdx
```

`src/demos/index.js` remains the metadata source of truth for learning-unit identity, title, category, description, badge, demo component and source files during the migration. Do not duplicate those fields in MDX frontmatter unless a later runtime requirement makes that unavoidable.

The note lookup contract is `getNoteLoader(learningUnitId)` from `src/workbench/noteRegistry.js`. Content workers should add MDX files only; they should not add 58 manual imports or edit the demo registry for note registration.

## Teaching responsibility

The center Demo is the runnable experiment. The MDX note explains the experiment, mental model and production boundary.

MDX interactive components may visualize otherwise invisible behavior (render timelines, update queues, identity, dependency graphs, cache state, hydration boundaries and similar concepts), but they must not become a second full Demo runtime. Do not mount existing complete Demo pages inside a note.

## Recommended note structure

1. One-sentence definition
2. Mental Model
3. Why it exists
4. Mechanism
5. Timeline / data flow
6. Follow the Demo experiment
7. Observable result
8. Why the result occurs
9. Incorrect mental model
10. Correct model
11. Recommended practice
12. Anti-pattern
13. Related API / pattern comparison
14. Production boundary
15. Debugging
16. Production considerations
17. Summary
18. Review questions
19. Official references

## Approved teaching-component vocabulary

Future notes should prefer the shared MDX teaching primitives rather than arbitrary app components:

- `Callout`
- `MentalModel`
- `Concept`
- `Experiment`
- `Observation`
- `Compare`
- `Timeline`
- `Flow`
- `Boundary`
- `AntiPattern`
- `CodeBlock`
- `CodeDiff`
- `DemoReference`
- `Summary`
- `FurtherReading`

F0 defines this vocabulary only. The MDX runtime and visual implementations are intentionally deferred.

## Content-worker ownership

Content branches should primarily add or edit `src/content/notes/*.mdx`. They must not independently redesign `App.jsx`, the Workbench shell, Learning Inspector, Vite MDX configuration, CodeViewer or shared global styling.
