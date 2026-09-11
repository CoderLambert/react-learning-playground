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

### Canonical Compare migration

- Mechanically migrated all three known production notes using legacy `Compare leftItems/rightItems`:
  - `not-need-effect.mdx`
  - `suspense-boundary.mdx`
  - `transition-deferred.mdx`
- While migrating, made canonical `Compare left/right` accept either renderable nodes or arrays. Arrays are rendered as lists by the teaching component, which keeps MDX concise and avoids nested JSX inside prop expressions.
- Tightened `test:content`: `leftItems/rightItems` are now rejected in note content. The runtime aliases remain temporarily available for backward compatibility, but new/edited notes cannot use them.
- The same three touched notes were also mechanically normalized from `Summary items` to children and from `FurtherReading links` to canonical `items`; lesson meaning was not changed.

## Validation evidence

Earlier baseline implementation head `51fc8aba679c8645a39b8174b5a294501e1e79aa` was validated by `React Learning Verify` run `34637090169`:

- `npm ci`: **PASS**
- AI focused tests: **PASS** (91 tests)
- `npm run test:content`: **PASS**
- `npm run lint`: **PASS**
- `npm run build`: **PASS**

The canonical Compare migration produced newer commits after that evidence. No PASS claim is made yet for the current head; latest-head PR CI is the acceptance source.

## Remaining work

1. Continue mechanical normalization of remaining legacy `Timeline items`, `Summary items`, and `FurtherReading links`, avoiding lesson files actively owned by parallel lesson tasks until those branches settle.
2. As each legacy prop class reaches zero, tighten `test:content` to reject it in notes while retaining the runtime compatibility alias for a short transition window.
3. Integrate TypeScript sample validation once the TypeScript-content branch's intentional valid/invalid TSX samples can be consumed without duplicating or conflicting with that branch. This task owns shared `package.json`/CI wiring.
4. After all legacy note usage reaches zero and dependent lesson branches are reconciled, remove temporary runtime aliases in a final safe cleanup.
