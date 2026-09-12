# Semantic Source Manifest

## Status

Implemented as the second source-learning layer on top of Inline Source + Learning Inspector.

The goal is to turn source navigation from file-level browsing into concept-level navigation without introducing manually maintained line ranges.

## Product decision

The learner-facing source path is now:

`lesson -> demo -> inline source -> core implementation / semantic region -> full file -> inspector -> AI citation`

Semantic navigation is progressive disclosure, not a replacement for the source file. The authoritative source text remains the registered `?raw` file.

### Learner experience

When semantic metadata exists for the active source file:

- Inline Source defaults to **核心实现**.
- The viewer exposes semantic regions such as `Reducer`, `Effect`, `Component`, `Hook`, `Event`, `Context`, `Provider`, `Ref`, and React 19 action/concurrency hooks.
- Selecting a region highlights and scrolls to the current source range.
- **完整文件** removes semantic focus and returns to ordinary file reading.
- Copying while a semantic region is selected copies the selected implementation instead of the whole file.
- “在源码面板打开” preserves the current semantic line range during handoff to Learning Inspector.
- Existing `source://...#Lx-Ly` citation focus remains authoritative and can override semantic focus.

Learning Inspector keeps full-file reading as its default because it is the deep-reading workspace; semantic regions are available there as navigation shortcuts.

## Why build-time AST instead of authored line ranges

Line numbers are output, not authoring input.

The project must not store metadata such as:

```js
{ label: "Reducer", startLine: 12, endLine: 53 }
```

Those ranges drift on formatting, comments and ordinary refactors.

Instead, Vite generates the manifest from the exact source files registered in `src/demos/index.js`. The current line range is resolved from the parser AST every time the dev server or production build starts.

## Parser architecture

Vite 8 is backed by Rolldown/Oxc. The semantic manifest plugin deliberately reuses the bundler parser through the official plugin-context `this.parse` API.

This provides first-class parsing for:

- JavaScript;
- JSX;
- TypeScript;
- TSX.

No browser parser is shipped and no second Babel/TypeScript parser dependency is added to the application.

```text
src/demos/index.js
       |
       | registry AST
       v
registered ?raw imports ---------------------+
       |                                      |
       | exact repository paths               |
       v                                      |
Rolldown/Oxc AST per source                   |
       |                                      |
       v                                      |
semantic regions + current line ranges        |
       |                                      |
       v                                      |
virtual:source-semantic-manifest <------------+
       |
       v
runtime source enrichment
       |
       +--> Inline Source
       +--> Learning Inspector
       +--> AI context
```

## Registry resolution

The manifest does not guess files by basename.

The plugin parses `src/demos/index.js` and resolves:

1. the learning-unit `id`;
2. each `files[].name` display identity;
3. the corresponding `?raw` import identifier;
4. the exact repository source path behind that import.

This preserves aliases such as a learner-facing source name that differs from the physical component filename and avoids collisions between same-named files.

The runtime lookup key is therefore:

`learningUnitId + source display name`

## Region model

A semantic region contains:

```ts
type SourceSemanticRegion = {
  id: string
  kind: string
  symbol: string
  startLine: number
  endLine: number
  hookName?: string
  parentSymbol?: string
  score: number
}
```

A file entry contains:

```ts
type SourceSemantics = {
  version: number
  path: string | null
  parser: string | null
  primaryRegionId: string | null
  primaryRegion: SourceSemanticRegion | null
  regions: SourceSemanticRegion[]
}
```

## Semantic classification

The analyzer discovers, without authored ranges:

- function/arrow-function components;
- reducers, including functions referenced by `useReducer`;
- custom hooks;
- context declarations created by `createContext`;
- provider components;
- nested event handlers;
- React hook call sites such as `useEffect`, `useReducer`, `useMemo`, `useCallback`, `useContext`, `useRef`, `useTransition`, `useDeferredValue`, `useOptimistic`, `useActionState`, `useFormStatus`, and `useSyncExternalStore`.

The manifest intentionally does not attempt full program semantics or React Compiler-level data-flow analysis. Its contract is source navigation, not static correctness proof.

## Core implementation selection

`primaryRegionId` is selected at build time from a relevance score.

The score combines:

- semantic role strength;
- whether a symbol is exported/top-level;
- relationship to the physical source filename;
- relationship between the learning-unit concept and the region kind/symbol.

Examples:

- a `state-reducer` lesson strongly prefers a reducer / `useReducer` region;
- an Effect lesson prefers an Effect region;
- a Context lesson prefers Context / Provider regions;
- `useMemo` / `useCallback` lessons prefer the corresponding hook region;
- otherwise the primary exported demo component remains a strong default.

The score is navigation policy, not educational truth. Every learner can immediately switch to another region or the full file.

## Citation precedence

Source focus has explicit precedence:

1. an incoming `source://` / AI citation range is authoritative;
2. a user-selected semantic region is authoritative after they select it;
3. Inline Source defaults to the generated primary region;
4. Inspector defaults to the full file.

Selecting a semantic region clears the previous citation focus. Opening an inline semantic region in the Inspector transfers its resolved current line range.

## AI integration

The AI context now includes compact semantic metadata for source regions that are actually present inside the included/truncated source text.

Semantic regions outside the source-text budget are removed rather than exposing line ranges the model cannot verify.

The assistant prompt treats semantic metadata only as a navigation index. It still must verify and cite the actual numbered Source text with `source://` links.

This creates one evidence chain:

`AST region -> actual source lines -> AI explanation -> source:// citation -> SourceViewer focus`

## Performance

Semantic parsing occurs at build/dev-server time, never in the browser.

Runtime cost is limited to:

- a compact virtual manifest object;
- an O(1) learning-unit/file lookup;
- the existing SourceViewer focus rendering.

Shiki highlighting remains lazy and uses the existing bounded shared cache.

## HMR

The semantic plugin watches both:

- `src/demos/index.js`;
- all registered source files.

When a registered source changes, the manifest is rebuilt and the application reloads so source text and semantic line ranges cannot become independently stale during development.

## Failure behavior

Semantic navigation is an enhancement, not a source availability dependency.

If one source cannot be parsed:

- the build emits a warning;
- the source remains available as a full file;
- that source receives an empty semantic region list;
- the rest of the manifest continues to build.

A registry-level failure is treated as a build error because the plugin can no longer establish the source-of-truth mapping safely.

## Verification gates

The semantic layer must preserve all existing source gates and additionally verify:

- the `state-reducer` lesson exposes a Reducer-oriented core implementation;
- selecting a semantic region updates source line focus;
- `完整文件` clears semantic focus;
- inline-to-inspector handoff preserves the selected semantic range;
- source citations still override semantic focus;
- TypeScript/TSX registered files do not break manifest generation;
- AI context includes only semantic ranges that fit inside included source text;
- continuous-reading mode still renders independent inline viewers;
- build, lint, content, AI and browser E2E suites pass.

## Future extension

The next logical source-learning layer is **explanation-to-symbol linking**: MDX/Note teaching claims can reference semantic region ids instead of authored line numbers. Build-time resolution would then turn stable symbol references into current `source://` line ranges.

That extension should reuse this manifest. It should not introduce a separate note-specific source map.
