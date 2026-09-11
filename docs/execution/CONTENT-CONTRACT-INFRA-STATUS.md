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
  - unsupported teaching-component props;
  - empty self-closing Timeline/Flow/Compare/Summary/FurtherReading blocks;
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
- The repository has now reached zero accepted Note usage of `Timeline items`; `test:content` rejects `items` on `<Timeline>` while the runtime compatibility alias remains temporarily available for branch reconciliation.

### TypeScript sample compiler gate

- Added `tsconfig.samples.json` scoped only to `src/demos/typescript-samples/**/*.tsx` with strict/noEmit React TSX settings.
- Added `npm run typecheck:samples` using an exact `typescript@7.0.2` compiler invocation, so no package-lock churn or competing lesson-file edit is required.
- Added `TypeScript sample contract` to `React Learning Verify` after content-contract checks and before lint/build.
- This resolves the shared-infrastructure gap recorded by `automation/typescript-learning`: once that branch is reconciled with this infrastructure, its legal examples and `@ts-expect-error` assertions are checked by a real TypeScript compiler rather than inferred from Vite build success.

## Validation evidence

Implementation head `9291dadb890d9c83cd60788e418f3a2ec8af0be8` was validated by `React Learning Verify` run `34645124188`:

- `npm ci`: **PASS**
- AI focused tests: **PASS**
- `npm run test:content`: **PASS**
- `npm run typecheck:samples`: **PASS**
- `npm run lint`: **PASS**
- `npm run build`: **PASS**

The same implementation head also has `Workbench State URL Verify` run `34645124170`: **PASS**. `Workbench Integration Verify` run `34645124203` was still pending when this status entry was written; do not claim it as PASS until its conclusion is successful.

## Remaining work

1. Continue mechanical normalization of remaining legacy `Summary items` and `FurtherReading links`, avoiding lesson files actively owned by parallel lesson tasks until those branches settle.
2. Once each remaining legacy prop class reaches zero, tighten `test:content` to reject it in notes while retaining runtime compatibility aliases only long enough for parallel-branch reconciliation.
3. Reconcile the TypeScript lesson branch with this shared gate and inspect the exact compiler result for its intentional `@ts-expect-error` examples; fix sample content only in the TypeScript-owned branch if diagnostics expose a real sample issue.
4. After all legacy Note usage reaches zero and dependent lesson branches are reconciled, remove temporary runtime aliases in a final safe cleanup.
