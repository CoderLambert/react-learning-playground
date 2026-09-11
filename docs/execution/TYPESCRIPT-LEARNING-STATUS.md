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

Until that shared gate exists, compile-time validation is **PENDING**, not claimed as PASS.

## Factual baseline

Checked against current official React TypeScript guidance and React ref lifecycle documentation, plus TypeScript's official `@ts-expect-error` semantics.

## Validation status

- Repository/source inspection: PASS
- Shared files (`package.json`, teaching infrastructure): unchanged by this task
- Browser Demo/Note/Source contract review: PASS by inspection
- `tsc` sample gate: PENDING shared infrastructure
- Root lint/build/E2E: not executed by this connector-only run; no PASS claimed

## Next

After the shared typecheck gate lands, inspect its exact CI result. If green, perform one follow-up pass for any diagnostics revealed by strict compiler settings and then keep this PR focused on the lesson/sample scope.