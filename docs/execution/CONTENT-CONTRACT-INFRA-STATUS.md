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
  - accidental removal of temporary runtime aliases before note normalization finishes.
- `runtime-smoke.mdx` is intentionally excluded from the learning-unit mapping check because repository history identifies it as the MDX compiler/runtime fixture rather than a production lesson.
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

Previous PR head `4f8e1ea5b73ff3b2a1b7f560dabd75678db68f73` has complete exact-head GitHub validation:

- `React Learning Verify` run `34645386038` (#197): **PASS**
- `Workbench State URL Verify` run `34645386162` (#81): **PASS**
- `Workbench Integration Verify` run `34645386175` (#136): **PASS**

That head includes the real TypeScript sample gate and the canonical-prop migration. The newer content-contract commit `1149a3be63e3601b4fc862ecc511d351ad15785a` additionally rejects duplicate demo ids and literal-empty teaching props. Latest-head CI is the acceptance source for that stricter check; no PASS claim is made until GitHub reports it.

## Remaining work

1. Reconcile Runtime PR #82 so `event-vs-effect.mdx` supplies its already-canonical Summary/FurtherReading form, then remove the one-file compatibility exception from `test:content`.
2. Reconcile TypeScript PR #81 with this shared compiler gate and inspect its intentional `@ts-expect-error` examples under real `tsc`; any sample diagnostic fix belongs on the TypeScript-owned branch.
3. After the remaining branch-owned note usage is reconciled and no production note relies on compatibility props, remove the temporary runtime aliases in `TeachingComponents.jsx` and tighten the runtime-alias assertion accordingly.
4. Keep PR #79 draft and unmerged until the above branch-reconciliation dependencies are resolved and latest-head validation is green.
