# Verification Contract

This document records the repository-level verification entry points used by local development, Agents, and required CI.

## Canonical deterministic verification

Use:

```bash
npm run verify:required
```

The command runs the complete deterministic `tests/**/*.test.mjs` inventory plus the DeepSeek worker Node tests, then the TypeScript sample contract, lint, and production build.

`tests/**/*.test.mjs` is an owned test root. The runner discovers the files recursively instead of maintaining a second hand-written test list. A deterministic `.test.mjs` placed elsewhere in the repository is treated as an orphan and fails the inventory contract until its ownership/entry point is made explicit.

`React Learning Verify / verify` delegates to this command so local/Agent verification and the required workflow cannot silently maintain different deterministic test inventories.

Focused scripts such as `test:ai`, `test:assessment`, and `test:content` remain useful for fast feedback, but they are not the complete required deterministic inventory.

### Lint warning policy

`npm run lint` uses the repository Oxlint configuration with warnings denied. Any unsuppressed warning in product code, tests, or Teaching Demos therefore produces a non-zero exit code and fails `verify:required`.

Intentional Teaching Demo exceptions remain local source directives rather than a growing warning-count baseline. Each Demo suppression must name concrete rule(s), include an inline rationale, and restore block suppressions with the matching `oxlint-enable`. Unused suppressions are errors, so stale exceptions cannot silently accumulate.

This policy preserves warning-level rules such as `react/only-export-components` for editor/local diagnostics while making required verification fail closed.

## Canonical browser verification

Use:

```bash
npm run verify:browser
```

It delegates to the existing mocked browser path (`test:e2e:mock`), which performs the production build with the test AI endpoint and runs Playwright. Environment provisioning such as the Chromium installation remains the responsibility of the caller/workflow.

`Workbench Integration Verify / verify` remains the authoritative PR browser gate. Its required check name is unchanged. Browser impact selection/correctness is handled separately by #187 and browser tier optimization by #182.

## Pull-request evidence semantics

For a PR required run, distinguish four values:

- `BASE_SHA`: the PR base revision used to construct the candidate;
- `HEAD_SHA`: the feature-branch head;
- `TESTED_SHA`: the revision actually checked out and tested by the workflow, normally the PR merge candidate;
- `RUN_ID`: the GitHub Actions run that produced the evidence.

`HEAD_SHA` and `TESTED_SHA` are not interchangeable.

When the base branch advances, evidence from an older candidate must not be cited as evidence for the new merge candidate. Re-read the current PR base/head and use the current required run. The React required workflow writes these values to its job summary for PR runs.

Required check identities remain:

```text
React Learning Verify / verify
Workbench Integration Verify / verify
```

Do not rename, skip, weaken, or replace these checks merely to obtain a green result.
