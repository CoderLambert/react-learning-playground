# Content Contract Infrastructure Status

Branch: `automation/content-contract-infra`

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
  - `Summary items` instead of canonical children;
  - `FurtherReading links` instead of canonical `items`.
- Kept the current canonical API unchanged for new/edited content.
- Added `tests/content-contract.test.mjs` and `npm run test:content` to detect:
  - demo/note convention mismatches and orphan notes;
  - unsupported teaching-component props;
  - self-closing Timeline/Flow/Summary/FurtherReading blocks with no renderable data;
  - `DemoReference` blocks missing `action` or `observe`;
  - accidental removal of the temporary compatibility aliases before normalization finishes.
- Replaced the old 19-step note template with flexible teaching principles built around:
  - core question;
  - predict/experiment;
  - observe/explain;
  - boundary/counterexample;
  - project decision rule.
- Documented hard quality gates for correctness, Demo↔Note alignment and mental-model completeness.

## Remaining work

1. Mechanically normalize all existing legacy MDX uses to the canonical component API without rewriting lesson meaning.
2. After normalization reaches zero legacy uses, remove the aliases from the content-test allowlist, then remove runtime aliases in a later safe cleanup.
3. Integrate TypeScript sample validation once the TypeScript-content task has prepared intentional valid/invalid TSX samples. This task owns the shared `package.json`/test-script wiring to avoid parallel conflicts.
4. Validate the branch through pull-request CI (`lint`, `build`, content test and existing E2E as available) and fix any contract-test false positives.

## Validation state

Repository writes are complete for this pass. Validation is intentionally attributed only after the pull-request workflow runs; no local PASS is claimed because this automation environment does not have a network-capable checkout of the repository.
