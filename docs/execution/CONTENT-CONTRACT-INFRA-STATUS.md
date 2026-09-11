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

## Completed in the first pass

- Added backward-compatible runtime aliases in `TeachingComponents.jsx` so existing notes no longer silently lose content when they use:
  - `Timeline items` instead of canonical `steps`;
  - `Compare leftItems/rightItems` instead of canonical `left/right`;
  - `Summary items` instead of canonical children;
  - `FurtherReading links` instead of canonical `items`.
- The `Compare` aliases were discovered by the new semantic check: several existing notes were passing lists through props that the runtime previously ignored.
- Kept one canonical API documented for new/edited content; compatibility aliases are explicitly temporary migration support.
- Added `tests/content-contract.test.mjs` and `npm run test:content` to detect:
  - registered learning units without a convention-based note;
  - unsupported teaching-component props;
  - self-closing Timeline/Flow/Compare/Summary/FurtherReading blocks with no renderable data;
  - `DemoReference` blocks missing `action` or `observe`;
  - accidental removal of temporary runtime aliases before note normalization finishes.
- `runtime-smoke.mdx` is intentionally excluded from the learning-unit mapping check because repository history identifies it as the MDX compiler/runtime fixture rather than a production lesson.
- Added the content-contract test to `React Learning Verify` so semantic content failures block the primary PR verification workflow.
- Replaced the old 19-step note template with flexible teaching principles built around:
  - core question;
  - predict/experiment;
  - observe/explain;
  - boundary/counterexample;
  - project decision rule.
- Documented hard quality gates for correctness, Demo↔Note alignment and mental-model completeness.

## Validation evidence

`React Learning Verify` run `34637090169` on implementation head `51fc8aba679c8645a39b8174b5a294501e1e79aa` completed successfully:

- `npm ci`: **PASS**
- AI focused tests: **PASS** (91 tests)
- `npm run test:content`: **PASS**
- `npm run lint`: **PASS**
- `npm run build`: **PASS**

`Workbench State URL Verify` also remained green on the content-contract branch while this work was being validated. The branch is intentionally still draft/unmerged.

## Remaining work

1. Mechanically normalize existing legacy MDX uses to the canonical component API without rewriting lesson meaning.
2. Once legacy usage reaches zero, change the semantic test to reject legacy aliases in notes; keep runtime aliases only for a short compatibility window, then remove them in a safe cleanup.
3. Integrate TypeScript sample validation once the TypeScript-content task has prepared intentional valid/invalid TSX samples. This task owns shared `package.json`/CI wiring to avoid parallel conflicts.
4. Continue using PR CI to catch contract-test false positives as normalization proceeds; no local PASS is claimed from this automation environment.
