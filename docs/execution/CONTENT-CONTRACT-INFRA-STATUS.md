# Content Contract Infrastructure Status

Branch: `automation/content-contract-infra`

PR: `#79` (`chore: harden MDX content contracts`, draft)

## Goal

Make learning-content failures visible and keep the Workbench contract explicit:

```text
Center Demo = experiment
MDX Note    = explanation
Source      = implementation
```

## Completed

### Baseline content contract

- Added backward-compatible runtime aliases in `TeachingComponents.jsx` so existing notes no longer silently lose content when they use:
  - `Timeline items` instead of canonical `steps`;
  - `Compare leftItems/rightItems` instead of canonical `left/right`;
  - `Summary items` instead of canonical children;
  - `FurtherReading links` instead of canonical `items`.
- The `Compare` aliases were discovered by the semantic check: several existing notes were passing lists through props that the runtime previously ignored.
- Added `tests/content-contract.test.mjs` and `npm run test:content` to detect:
  - registered learning units without a convention-based note;
  - duplicate registered learning-unit ids;
  - unsupported teaching-component props;
  - empty self-closing Timeline/Flow/Compare/Summary/FurtherReading blocks;
  - statically detectable literal-empty teaching props such as `steps={[]}`, `items={[]}`, or empty `DemoReference action/observe` strings;
  - `DemoReference` blocks missing `action` or `observe`;
  - invalid MDX filenames that Vite can compile but the raw-note registry would silently filter out;
  - orphan production notes by requiring a one-to-one mapping between production MDX note ids and registered learning-unit ids, with `runtime-smoke.mdx` as the sole explicit fixture exception;
  - accidental removal of temporary runtime aliases before note normalization finishes.
- The filename/parity contract closes a real Note/Source-context gap: compiled note loading uses `import.meta.glob`, while the raw-note virtual registry only exposes ids matching `[a-z0-9-]`. A malformed filename must now fail CI instead of producing a note that can render but cannot be loaded as raw context.
- Added the content-contract test to `React Learning Verify` so semantic content failures block the primary PR verification workflow.
- Replaced the old 19-step note template with flexible teaching principles built around core question → predict/experiment → observe/explain → boundary/counterexample → project decision rule.
- Documented hard quality gates for correctness, Demo↔Note alignment and mental-model completeness.

### Canonical prop migration

- Mechanically migrated all known production `Compare leftItems/rightItems` usages to canonical `left/right`:
  - `not-need-effect.mdx`
  - `suspense-boundary.mdx`
  - `transition-deferred.mdx`
- Canonical `Compare left/right` accepts either renderable nodes or arrays. Arrays are rendered as lists by the teaching component, keeping MDX parser-friendly without nested JSX prop expressions.
- `test:content` now rejects legacy `leftItems/rightItems` in notes.
- Mechanically normalized these additional unowned notes without changing lesson meaning:
  - `form-action.mdx`
  - `advanced-ref.mdx`
  - `lazy-suspense.mdx`
  - `optimistic-update.mdx`
  - `use-effect-correct-usage.mdx`
  - `use-ref.mdx`
  - `custom-hooks.mdx`
  - `controlled-form.mdx`
  - `error-boundary-use.mdx`
  - `form-data-modeling.mdx`
  - `action-state-form-status.mdx`
  - `lifecycle-of-reactive-effects.mdx`
- For those files, legacy `Timeline items` became `steps`, `Summary items` became child list content, and `FurtherReading links` became `items` where present.
- Note-level `Timeline items` is now rejected globally.
- Note-level `Summary items` and `FurtherReading links` are also rejected globally except for one explicit temporary compatibility entry: `event-vs-effect.mdx`. That lesson is owned by Runtime PR #82, whose branch already uses canonical `<Summary>...</Summary>` and `<FurtherReading items={...} />`; the exception exists only until branch reconciliation.
- Runtime aliases remain temporarily available in `TeachingComponents.jsx` so parallel lesson branches are not broken while their canonical note changes are reconciled.

### TypeScript sample compiler gate

- Added `tsconfig.samples.json` scoped only to `src/demos/typescript-samples/**/*.tsx` with strict/noEmit React TSX settings.
- Added `npm run typecheck:samples` using an exact compiler invocation, avoiding competing edits to TypeScript-owned sample files.
- Added `TypeScript sample contract` to `React Learning Verify` after content-contract checks and before lint/build.
- This resolves the shared-infrastructure gap recorded by `automation/typescript-learning`: once that branch is reconciled with this infrastructure, its legal examples and `@ts-expect-error` assertions are checked by a real TypeScript compiler rather than inferred from Vite build success.

## Validation evidence

PR head `d9c286438de80c7cfa5aa4ad04acaf7053400485` has complete exact-head GitHub validation:

- `React Learning Verify` run `34649827088` (#200): **PASS**
- `Workbench State URL Verify` run `34649827096` (#83): **PASS**
- `Workbench Integration Verify` run `34649827092` (#139): **PASS**

The newer commit `9fa5861ae6ed00c9d80e0722a6961768fc900b3b` adds raw/compiled note-registry filename and one-to-one parity checks. Latest-head CI is the acceptance source for that stricter contract; no PASS claim is made until GitHub reports it.

## Remaining work

1. Reconcile Runtime PR #82 so `event-vs-effect.mdx` supplies its already-canonical Summary/FurtherReading form, then remove the one-file compatibility exception from `test:content`.
2. Reconcile TypeScript PR #81 with this shared compiler gate and inspect its intentional `@ts-expect-error` examples under real `tsc`; any sample diagnostic fix belongs on the TypeScript-owned branch.
3. After the remaining branch-owned note usage is reconciled and no production note relies on compatibility props, remove the temporary runtime aliases in `TeachingComponents.jsx` and tighten the runtime-alias assertion accordingly.
4. Keep PR #79 draft and unmerged until the above branch-reconciliation dependencies are resolved and latest-head validation is green.
