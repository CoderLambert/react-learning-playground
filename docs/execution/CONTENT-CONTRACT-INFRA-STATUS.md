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

- Added backward-compatible runtime aliases in `TeachingComponents.jsx` so existing notes no longer silently lose content when they use legacy `Timeline items`, `Compare leftItems/rightItems`, `Summary items`, or `FurtherReading links` props.
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
- Added the content-contract test to `React Learning Verify`.
- Replaced the old rigid note template with flexible teaching principles centered on core question → predict/experiment → observe/explain → boundary/counterexample → project decision rule.
- Documented hard quality gates for correctness, Demo↔Note alignment, and mental-model completeness.

### Canonical prop migration

- Mechanically migrated production `Compare leftItems/rightItems` usages to canonical `left/right`.
- Mechanically normalized unowned notes from legacy `Timeline items` to `steps`, `Summary items` to children, and `FurtherReading links` to `items` where present.
- `test:content` now rejects legacy `Compare` and `Timeline` props globally.
- `Summary items` and `FurtherReading links` are rejected globally except for the explicit temporary `event-vs-effect.mdx` compatibility entry.
- Runtime PR #82's owned `event-vs-effect.mdx` has now been re-inspected and confirmed to already use canonical `<Summary>...</Summary>` and `<FurtherReading items={...} />`; the exception remains only because that branch has not been reconciled into PR #79/main yet.
- Runtime aliases remain temporarily available in `TeachingComponents.jsx` so parallel lesson branches are not broken before reconciliation.

### TypeScript sample compiler gate

- Added `tsconfig.samples.json` scoped to `src/demos/typescript-samples/**/*.tsx` with strict/noEmit React TSX settings.
- Added `npm run typecheck:samples`.
- Added a `TypeScript sample contract` step to `React Learning Verify`.
- Re-inspected TypeScript PR #81 status: its changed TSX samples contain the intended valid/invalid examples, but the branch still lacks PR #79's shared compiler wiring. Therefore PR #79's green compiler run does not prove PR #81's different sample snapshot.
- A connector-only run cannot safely manufacture this proof without copying TypeScript-owned files into the infrastructure branch. That would violate task ownership, so exact combined validation remains a real cross-branch dependency rather than an infrastructure implementation gap.

## Validation evidence

Current PR #79 head before this status-only update, `b7f1d71f20274cafe518aa622cc5a6b1934651c7`, has complete exact-head GitHub validation:

- `React Learning Verify` run `34654385384` (#217): **PASS**
- `Workbench State URL Verify` run `34654385381` (#85): **PASS**
- `Workbench Integration Verify` run `34654385385` (#156): **PASS**

This confirms the filename/parity checks, empty-prop checks, content-contract suite, TypeScript sample gate for the infrastructure branch snapshot, lint, build, and Workbench integration are green on that head.

## Remaining work / blockers

1. **Runtime reconciliation blocker:** PR #82 owns `event-vs-effect.mdx`. Its branch is already canonical, so no lesson change is needed here. Once that branch is reconciled into the shared baseline, remove the one-file compatibility exception from `test:content`.
2. **TypeScript reconciliation blocker:** PR #81 owns the modified TSX samples. Exact compiler proof requires a combined head containing PR #81's sample snapshot plus PR #79's `typecheck:samples` wiring. Any resulting sample diagnostic belongs on the TypeScript branch; this task must not duplicate those sample files merely to create a synthetic green run.
3. After both branch-owned usages are reconciled and no production note depends on legacy props, remove temporary runtime aliases in `TeachingComponents.jsx` and tighten the alias assertion.
4. Keep PR #79 draft and unmerged until those reconciliation dependencies are resolved and the resulting exact-head CI is green.

No additional safe in-scope implementation remains on this branch without crossing another task's ownership boundary.