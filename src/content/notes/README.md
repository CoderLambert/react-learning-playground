# Workbench learning notes

This directory contains the MDX explanation layer for the React Learning Workbench.

## File naming and lookup

Use exactly one note per learning unit:

```text
src/content/notes/<learning-unit-id>.mdx
```

`src/demos/index.js` remains the metadata source of truth for learning-unit identity, title, category, description, badge, demo component and source files. Do not duplicate those fields in MDX frontmatter unless the runtime later requires it.

Notes are resolved through `getNoteLoader(learningUnitId)` from `src/workbench/noteRegistry.js`. Content changes should not add manual note imports or edit the registry merely to register MDX.

## Teaching responsibility

Keep the Workbench boundary explicit:

```text
Center Demo = experiment
MDX Note    = explanation
Source      = implementation
```

The center Demo must create an observable React behavior. The note explains why that behavior occurs, the mental model behind it, the important counterexamples and the production decision boundary. Source shows how the experiment is implemented.

A note may use lightweight MDX visualizations for otherwise invisible behavior such as an update queue, render timeline, identity relation, dependency graph, cache state or hydration boundary. It must not become a second copy of the runnable Demo.

## Content principles

Do not force every lesson into the same template. Use the structure that best fits the concept, but preserve this learning loop when it is applicable:

1. **Core question** — state the actual problem the learner should be able to answer.
2. **Predict / experiment** — ask for a prediction before the learner operates the center Demo when prediction helps expose the mental model.
3. **Observe / explain** — describe the observable result and explain the React mechanism that caused it.
4. **Boundary / counterexample** — show the most important incorrect model, exception, version boundary or misuse.
5. **Project decision rule** — finish with a practical way to decide when to use, avoid or replace the technique.

These are principles, not mandatory headings. A short concept may need only a few sections; a mechanism-heavy topic may need a timeline; an API-design topic may be better served by ownership/data-flow diagrams; a performance topic should prefer measurement and comparison.

## Demo ↔ Note contract

Every experiment described by a note must be possible to perform and observe in the corresponding Demo, Source or explicitly named validation surface. Do not write an `Experiment` that only tells the learner a conclusion the Demo cannot demonstrate.

Prefer this sequence:

```text
operation → observable difference → explanation → decision rule
```

If the lesson is compile-time rather than runtime, such as TypeScript contracts, say so explicitly and point to the real TSX/typecheck surface instead of pretending the browser Demo is a compiler playground.

## Accuracy rules

- Treat React 19.2 semantics as the repository baseline unless a lesson explicitly teaches another version.
- Distinguish public semantics from implementation details.
- Scope claims when they are development-only, Strict Mode-only, DOM-specific, browser-specific or framework-specific.
- Avoid misleading slogans such as “setState is async” when a more precise model is available.
- Prefer official React documentation as the primary factual source for React behavior.

## Approved teaching components

Use shared primitives when they improve comprehension; ordinary Markdown prose is preferred for normal explanation. Do not stack teaching cards merely to satisfy a template.

Canonical APIs:

```mdx
<Timeline steps={["..."]} />
<Flow items={["..."]} />

<Summary>
- ...
</Summary>

<FurtherReading items={[{ label: "React", href: "https://react.dev/..." }]} />

<DemoReference
  action="what the learner does"
  observe="what must be observable"
/>
```

Available primitives:

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

`Timeline items`, `Summary items` and `FurtherReading links` are temporary runtime compatibility aliases for older notes. New or edited notes must use the canonical forms above; existing notes should be normalized mechanically without rewriting their lesson meaning.

## Content quality gate

Before treating a lesson as complete, verify three hard gates:

- **Correctness** — React semantics and scope are accurate; no important misleading absolute remains.
- **Demo contract** — Note, Demo and Source tell the same story; claimed experiments are actually observable.
- **Mental model** — after the lesson, the learner can explain why the behavior occurs, when to use it and when not to use it.

Only after those gates pass should readability, example quality, engineering usefulness and visual polish be treated as refinement work.

## Content-worker ownership

Content branches should primarily edit their assigned `src/content/notes/*.mdx` and matching Demo/Source files when the experiment itself must change. They should not independently redesign the Workbench shell, Learning Inspector, MDX runtime, CodeViewer or shared global styling.
