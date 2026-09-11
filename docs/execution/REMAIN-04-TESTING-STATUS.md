# Remaining Chapter 04 + Testing Status

Branch: `learn/remain-04-testing`
Base at creation: `integration/react-complete-learning@c7428d89810ae95695e74d02e7d8326858d3670d`

## Chapter 04 — Ref、Effect 与 Escape Hatches

Existing integrated baseline:

- [x] 04-01 `useRef`
- [x] 04-02 Effect mental model + cleanup
- [x] 04-03 You Might Not Need an Effect
- [x] 04-04 Effect lifecycle / dependencies

Implemented in this continuation branch:

- [x] 04-05 Event vs Effect
  - Added `EventVsEffectDemo.jsx`.
  - Visualizes user-event causality vs state-driven external synchronization.
  - Shows why `isBuying state -> Effect -> mutation` is an unnecessary indirection.
  - Demo registered and `?raw` CodeViewer source registered.
- [x] 04-06 `useEffectEvent`
  - Added `EffectEventDemo.jsx`.
  - Separates reactive `roomId` connection dependency from non-reactive latest `theme` read.
  - Explicitly states Effect Event must not be used to hide real dependencies.
  - Demo registered and `?raw` source registered.
- [x] 04-07 Custom Hooks
  - Added `CustomHooksDemo.jsx`.
  - Demonstrates reused stateful logic with two independent `useCounter` calls.
  - Demonstrates encapsulated browser subscription + cleanup with `useOnlineSignal`.
  - Demo registered and `?raw` source registered.
- [x] 04-08 `useLayoutEffect` / `useImperativeHandle` / React 19 ref-as-prop
  - Added `AdvancedRefDemo.jsx`.
  - Visualizes layout measurement before paint and a restricted imperative handle.
  - Documents React 19 direct `ref` prop and historical `forwardRef` boundary.
  - Demo registered and `?raw` source registered.

### Chapter 04 content status

`CONTENT_COMPLETE`

### Chapter 04 executable gate

Deterministic verification was executed by GitHub Actions workflow `React Learning Verify` on branch head `dd5052fd20251bac454d4d121ff33946025593eb`, run `34561160806`.

- `npm ci`: PASS
- `npm run lint`: PASS
- `npm run build`: PASS
- `npm run preview` HTTP smoke at `/react-learning-playground/`: PASS
- cleanup/manual browser interaction smoke: PENDING / manual evidence

The HTTP smoke does not claim interactive browser, console, or narrow-screen validation.

## Chapter 11 — Testing slice

- [x] Testing mental model and test pyramid/portfolio
- [x] Vitest responsibility: fast deterministic unit logic
- [x] React Testing Library responsibility: user-observable component behavior
- [x] User-centric queries: role / label / text
- [x] Async UI: click -> pending -> observable success
- [x] Mock boundary guidance
- [x] Playwright responsibility: real-browser critical-path E2E
- [x] Added `TestingStrategyDemo.jsx`
- [x] Added raw reference sample `testing-samples/behavior.test.jsx`
- [x] Added raw reference sample `testing-samples/app.spec.js`
- [x] Demo and all raw sources registered in CodeViewer

The repository intentionally does **not** add Vitest / Testing Library / Playwright dependencies in this slice. The sample test files are CodeViewer reference sources only; they are not claimed as executed tests. This avoids adding a test toolchain merely for documentation while preserving accurate tool boundaries.

### Testing executable gate

- Runtime demo install/lint/build/preview HTTP smoke: PASS via GitHub Actions run `34561160806`
- Vitest/RTL sample execution: NOT CONFIGURED / NOT CLAIMED
- Playwright sample execution: NOT CONFIGURED / NOT CLAIMED
- real-browser E2E/manual interaction validation: PENDING

## Source calibration

- React version in repository: `19.2.8`.
- React official current documentation is the primary source for Effect Events, Custom Hooks, layout effects, imperative handles and ref-as-prop.
- Testing Library, Vitest and Playwright official documentation define the testing-tool boundaries.

## Current disposition

- Chapter 04 content: COMPLETE
- Chapter 11 Testing slice content: COMPLETE
- deterministic runtime gate: PASS
- manual browser/console/narrow-screen cleanup smoke: PENDING
- PR #7 remains open for final integration; no duplicate code changes should be made unless a regression is found.
