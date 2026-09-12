# Visual Source Locator

## Status

Implemented as the primary source-navigation entry for executable demos.

The source-learning flow is now:

`Demo UI -> visual locator -> Learning Inspector source -> semantic navigation / AI citation`

The previous page-level Inline Source surface is removed from lesson composition. The Learning Inspector is the single full source-reading workspace.

## Product goal

A learner should be able to answer “where is this thing implemented?” from the rendered UI itself.

The locator therefore maps a concrete rendered DOM element back to the JSX source range that produced it. This is intentionally different from semantic source navigation:

- visual locator: `rendered element -> JSX source range`;
- semantic manifest: `concept/symbol -> implementation range`;
- AI citation: `explanation claim -> evidence range`.

All three routes converge on the same Inspector `SourceViewer` and the same `sourceFocus` contract.

## Interaction model

The top workbench toolbar exposes `⌖ 定位源码`.

When locator mode is active:

1. hovering a locatable Demo element draws an overlay without changing layout;
2. the overlay label shows DOM tag, source file and source line range;
3. clicking prevents the Demo action for that click;
4. the Inspector opens the source tab, selects the correct file, scrolls to the range and highlights it;
5. locator mode exits after a successful location;
6. `Escape` exits without locating.

`Alt / Option + Click` performs the same location directly without toggling locator mode.

Normal Demo interaction is unchanged while locator mode is inactive.

## Build-time instrumentation

`build/jsxSourceLocatorBabelPlugin.js` is registered through `@vitejs/plugin-react`.

Only files already registered as `?raw` learning sources in `src/demos/index.js` are instrumented. For intrinsic DOM JSX elements the Babel transform injects an opaque navigation attribute whose value is derived from the original source location:

```jsx
<button data-source-loc="src/demos/ImmutableStateDemo.jsx|75|75">
  ...
</button>
```

The source location comes from Babel AST `loc` before generated attributes are inserted. No authored line numbers are maintained.

The raw source imported through `?raw` remains the original teaching source. The runtime attribute is a build product, not a second source-of-truth snippet.

## Runtime resolution

`DemoSourceLocator` wraps only the executable Demo surface.

For a hovered/clicked DOM node it:

1. walks toward the Demo wrapper;
2. prefers the nearest interactive control (`button`, `a`, `input`, etc.) over decorative descendants;
3. parses the build-generated locator descriptor;
4. resolves physical source path to the current `LearningUnit.sources` entry through `source.semantics.path`;
5. falls back to basename matching for ordinary non-aliased sources;
6. emits `{ learningUnitId, fileName, startLine, endLine }` to the workbench.

The existing semantic manifest remains useful here because it already carries the physical registered source path for each learner-facing file name, including aliases such as a display name that differs from its physical filename.

## Focused and continuous reading

In focused mode the clicked element belongs to the active learning unit and can open source immediately.

In continuous-reading mode every Demo wrapper owns its own `LearningUnit`. If the user locates an element from a different lesson, the app first switches the selected learning-unit context, then applies the pending source target after the normal lesson-change reset runs. Continuous-reading mode itself remains active.

## Why not React Fiber inspection

The implementation deliberately avoids `_reactRootContainer`, `__reactFiber$...` or other React private internals.

Those structures are not public contracts and can change across React releases, production builds and compiler modes. Build-time JSX metadata is deterministic, framework-version independent at runtime and testable from rendered DOM.

## Why not authored source markers

Demo authors do not write `data-source-line`, locator IDs, or source ranges by hand.

Manual markers would drift during formatting and refactors and would create a maintenance burden across the full lesson set. Instrumentation is derived from current source on every build.

## Source workspace ownership

There is one full code reader:

```text
Demo UI
  |
  v
Visual Source Locator ----+
                          |
AI source:// citation ----+----> sourceFocus
                          |          |
AST semantic navigation --+          v
                              Learning Inspector
                                      |
                                  SourceViewer
                                      |
                                  CodeViewer
                                      |
                                    Shiki
```

The main lesson column no longer renders a second `SourceViewer` instance below every Demo.

## Failure behavior

- If an element has no locator metadata, it behaves normally when locator mode is off and is ignored by the locator when on.
- If a physical source path cannot be resolved to the current learning unit, the candidate is ignored and ancestor candidates are considered.
- If a source file has semantic-analysis failure, basename matching still covers normal file names; the complete source workspace remains available manually.
- Source locator metadata never changes executable state or source evidence used by AI.

## Verification gates

The feature is considered valid when:

- ordinary Demo clicks work unchanged with locator mode off;
- locator mode hover displays an overlay;
- locator click prevents the Demo action for that click;
- the correct learning unit, source file and JSX range open in the Inspector;
- `Alt / Option + Click` performs the same direct location;
- aliased supporting source files resolve through physical semantic paths;
- continuous-reading cross-lesson location switches Inspector context correctly;
- page-level Inline Source is absent;
- Inspector file switching, Shiki highlighting, copy, semantic navigation and `source://` citations continue to work;
- registered JS/JSX/TS/TSX source compilation, lint and browser verification remain green.
