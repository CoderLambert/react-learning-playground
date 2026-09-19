# Issue #240 Assessment warning matrix

Execution base: `62b093cfce9e38aa7a5e1253a74bf00cc9ce40f6`

Fresh post-A1 command: `npm run lint`

## Inventory

The fresh baseline contained 20 warnings and exited successfully. Two warnings
were in the canonical Assessment runtime; the remaining 18 were teaching-demo
warnings outside this Issue's scope.

| Surface | Fresh warning | Classification | Disposition / contract evidence |
| --- | --- | --- | --- |
| `src/assessment/application/useAssessmentApplication.js:36` | `react/set-state-in-effect` | Fixed structurally | Runtime initialization now clears an error only when the asynchronous runtime attempt completes successfully. Errors are tagged with their `learningUnitsById` source and ignored after navigation to a new source, preserving initialization error behavior without a synchronous effect reset. |
| `src/assessment/application/useAssessmentReview.js:47` | `react/set-state-in-effect` | Narrow local suppression | The effect starts an external IndexedDB/memory review read. Loading state must be visible before that read, while request-id cancellation and async success/error state updates remain unchanged. |
| `src/demos/**` (18 warnings) | `react/refs`, `react/set-state-in-effect`, `react/immutability`, `react/only-export-components` | Out of scope | Teaching samples intentionally demonstrate the patterns and are not canonical Assessment runtime code. |

## Post-change classification

- Canonical Assessment warnings: `0` unexplained.
- Legacy Assessment code: not restored or reintroduced.
- Assessment application, IndexedDB/session/attempt, conflict/revision, and AI
  integration contracts: unchanged.
- Demo warnings remain outside Issue #240 scope.
