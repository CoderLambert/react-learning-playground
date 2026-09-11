# TypeScript Learning Status

Branch: `automation/typescript-learning`
Base: `main` at `76562aefc1dab2ac4ab780f36b96a2d30d7e7948`

## Goal

Strengthen the TypeScript-for-React lesson without turning the runtime Demo into a fake compiler playground. Product contract:

- Center Demo explains observable React runtime behavior and the meaning of component contracts.
- Source contains real `.tsx` examples.
- `tsc` / CI must eventually prove compile-time examples.

## Completed in this branch

- Reworked `src/content/notes/typescript-react.mdx` around Demo / Source / CI responsibility boundaries.
- Removed the false implication that the browser Demo itself can demonstrate TypeScript diagnostics.
- Clarified `ReactNode` vs `ReactElement` and avoided treating `JSX.Element` as the default business API type.
- Clarified concrete DOM event typing via `currentTarget`.
- Clarified nullable concrete DOM refs as a real lifecycle boundary.
- Added a controlled component contract where `value` is authoritative input and `onValueChange` is the change request channel.
- Kept discriminated unions focused on making impossible state combinations hard to express.
- Kept generics focused on preserving real caller-visible input/output relationships.
- Added intentional `@ts-expect-error` compile-time assertions to the existing registered TSX sample files, avoiding new registry/shared-file churn.
- Reworked `TypeScriptReactDemo.jsx` so its copy explicitly states that it demonstrates runtime behavior, not compiler diagnostics.

## Static examples now covered

`react-boundaries.tsx`:

- minimal props contract
- `ReactNode` children
- `ReactElement` narrowing
- `ChangeEvent<HTMLInputElement>` and `FormEvent<HTMLFormElement>`
- `HTMLInputElement | null` ref
- discriminated union state
- controlled `value + onValueChange` contract
- intentional invalid examples guarded by `@ts-expect-error`

`generic-patterns.tsx`:

- generic `SelectList<T>` preserving `items → renderItem/onSelect`
- generic `useHistory<T>` preserving `initial/current/update/history`
- intentional generic relationship violations guarded by `@ts-expect-error`

## Shared-infrastructure dependency

This task intentionally does **not** edit `package.json` or introduce a competing `tsconfig`. The content-infrastructure owner should wire the samples into a deterministic command such as `typecheck:samples` and include it in CI. The expected contract is:

1. legal sample code compiles;
2. each `@ts-expect-error` line continues to produce a real type error;
3. an obsolete `@ts-expect-error` fails the typecheck so examples cannot silently drift.

The current `automation/content-contract-infra` branch has added `test:content`, but as of this run its `package.json` still has no `typescript` dependency and no `typecheck:samples` script. Compile-time sample validation therefore remains **PENDING** rather than silently being inferred from build success.

## Factual baseline

Checked against current official React TypeScript guidance and React ref lifecycle documentation, plus TypeScript's official `@ts-expect-error` semantics. The repository currently uses React `19.2.x` / `@types/react` `19.2.x`; the lesson deliberately prefers `ReactNode`, `ReactElement`, concrete DOM event/ref types, and caller-visible generic relationships instead of presenting `JSX.Element` as a general business-API type.

## Validation status

- Repository/source inspection: PASS
- Shared files (`package.json`, teaching infrastructure): unchanged by this task
- Browser Demo/Note/Source contract review: PASS by inspection
- `react-boundaries.tsx` `@ts-expect-error` placement review: PASS by inspection; each directive is directly attached to the expression intended to fail
- `generic-patterns.tsx` generic relationship review: PASS by inspection; the invalid `Product → User` relationships are isolated behind `@ts-expect-error`
- Exact branch-head `React Learning Verify` for `d2e3161d6dca542009a314d672ef83c39d9fb13c`: PASS
- Exact branch-head `Workbench Integration Verify` for `d2e3161d6dca542009a314d672ef83c39d9fb13c`: PASS
- `tsc` sample gate: PENDING shared infrastructure

Passing root workflows are useful regression evidence for the runtime lesson, but they are **not** evidence that the `.tsx` sample contracts compile, because those workflows do not yet run the missing sample typecheck gate.

## Next

Wait for the content-infrastructure owner to land a real sample typecheck gate on its branch. Then inspect the exact compiler diagnostics under that gate, fix only task-owned sample issues if any, update this status with exact evidence, and keep this PR focused on the lesson/sample scope.