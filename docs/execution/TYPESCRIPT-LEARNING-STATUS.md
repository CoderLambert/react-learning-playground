# TypeScript Learning Status

Branch: `automation/typescript-learning`
Base: `main` at `76562aefc1dab2ac4ab780f36b96a2d30d7e7948`

## Goal

Strengthen the TypeScript-for-React lesson without turning the runtime Demo into a fake compiler playground. Product contract:

- Center Demo explains observable React runtime behavior and the meaning of component contracts.
- Source contains real `.tsx` examples.
- `tsc` / CI must prove compile-time examples.

## Completed in this branch

- Reworked `src/content/notes/typescript-react.mdx` around Demo / Source / CI responsibility boundaries.
- Removed the false implication that the browser Demo itself can demonstrate TypeScript diagnostics.
- Clarified `ReactNode` vs `ReactElement` and avoided treating `JSX.Element` as the default business API type.
- Clarified concrete DOM event typing via `currentTarget`.
- Clarified nullable concrete DOM refs as a real lifecycle boundary.
- Added a controlled component contract where `value` is authoritative input and `onValueChange` is the change request channel.
- Kept discriminated unions focused on making impossible state combinations hard to express.
- Kept generics focused on preserving real caller-visible input/output relationships.
- Added intentional `@ts-expect-error` compile-time assertions to the existing registered TSX sample files.
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

This task intentionally does **not** edit `package.json` or duplicate shared compiler infrastructure.

PR #79 (`automation/content-contract-infra`) now provides the real shared compiler gate:

- `tsconfig.samples.json` with `strict: true`, `noEmit: true`, React JSX, DOM libs, and `include: ["src/demos/typescript-samples/**/*.tsx"]`;
- `npm run typecheck:samples`;
- a `TypeScript sample contract` step in `React Learning Verify`.

Infrastructure implementation head `a1fbbdf8ab299aa5fc31315deb90016b88753724` passed that gate in React Learning Verify run `34645277144`.

Important limitation: PR #79 and PR #81 are separate branches. The successful #79 run validates the sample snapshot present on the infrastructure branch, **not automatically the modified TSX samples on PR #81**. PR #81 itself still does not contain or execute the shared gate. Therefore exact compiler validation of this branch's intentional valid/invalid examples remains **PENDING branch reconciliation**, not PENDING implementation of the gate itself.

Expected acceptance contract after reconciliation:

1. legal sample code compiles;
2. each `@ts-expect-error` line continues to suppress a real expected error;
3. an obsolete `@ts-expect-error` fails the typecheck so examples cannot silently drift.

## Factual baseline

Checked against current official React TypeScript guidance and React ref lifecycle documentation, plus TypeScript's official `@ts-expect-error` semantics. The repository currently uses React `19.2.x` / `@types/react` `19.2.x`; the lesson deliberately prefers `ReactNode`, `ReactElement`, concrete DOM event/ref types, and caller-visible generic relationships instead of presenting `JSX.Element` as a general business-API type.

## Validation status

- Repository/source inspection: PASS
- Shared files (`package.json`, teaching infrastructure): unchanged by this task
- Browser Demo/Note/Source contract review: PASS by inspection
- `react-boundaries.tsx` `@ts-expect-error` placement review: PASS by inspection
- `generic-patterns.tsx` generic relationship review: PASS by inspection
- PR #81 head `86f9df20cb6ac5630222716d3cddf7f33a59530d`: `React Learning Verify` PASS
- PR #81 head `86f9df20cb6ac5630222716d3cddf7f33a59530d`: `Workbench Integration Verify` PASS
- Shared `typecheck:samples` infrastructure: IMPLEMENTED and PASS on PR #79
- Exact `tsc` validation of PR #81's modified samples under that shared gate: PENDING branch reconciliation

Passing PR #81 root workflows are regression evidence for the runtime lesson, but they are not yet compiler evidence for its changed `.tsx` samples because those workflows were generated before the shared gate existed on this branch.

## Next

Wait for the content-infrastructure owner to reconcile PR #81's sample files with PR #79's compiler gate, as already tracked in PR #79 remaining work. Once an exact combined head executes `typecheck:samples`, fix only task-owned sample diagnostics if any and record the exact result here. Do not copy shared `package.json` / compiler wiring into this lesson PR merely to manufacture duplicate validation infrastructure.