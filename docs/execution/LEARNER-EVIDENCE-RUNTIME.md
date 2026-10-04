# Learner Evidence V1 Runtime — #328

## Purpose

Implement the frozen `learner-evidence-v1` contract as a read-only runtime over existing Assessment and Guided owners.

No Evidence persistence is introduced.

## Architecture

```text
AssessmentRuntime.evidenceSource
        │
        ├── persisted sessions + attempts
        │
        ↓
Learner Evidence projection
        ↑
        │
Workbench evidencePublic
        │
        └── current Guided persisted snapshot + domain-owned Practice outcome
```

Public read API:

```js
const runtime = createLearnerEvidenceRuntime({
  assessmentSource,
  guidedSource,
});

const evidence = await runtime.read({ learningUnitId });
```

## Ownership

### Assessment

`AssessmentRuntime.evidenceSource` remains inside the Assessment domain.

It:

- reads repository sessions and attempts;
- validates domain records before exposing them;
- preserves all session boundaries;
- returns sessions ordered by `startedAt` / id;
- returns attempts ordered by `submittedAt` / id.

It does not expose a mutation API.

### Guided

Workbench exposes a dedicated curated seam:

```text
src/workbench/evidencePublic.js
```

The seam returns:

- current Guided definition;
- current persisted snapshot status/snapshot;
- Practice correctness calculated by the existing Guided evaluator.

The Evidence domain therefore never reimplements Guided correctness.

The generic Workbench public surface remains unchanged.

## Learning Evidence domain

`src/learning-evidence/` is a registered architecture owner with one curated public entry:

```text
src/learning-evidence/public.js
```

The domain contains:

- frozen V1 contract;
- pure Assessment/Guided projection functions;
- unified read runtime;
- source/projection errors.

The old script contract path only re-exports the production contract to preserve the #327 test/tooling seam.

## Fail-closed behavior

The runtime rejects:

- malformed Assessment provenance;
- attempt/session mismatch;
- question/revision mismatch;
- invalid/incompatible/unavailable Guided persistence;
- missing Guided definition;
- invalid projection against frozen V1.

An empty Guided persistence is not an error. It projects as:

```text
status = not_started
records = []
needsReview = false
```

## Canary coverage

Repository tests exercise:

1. real `createAssessmentRuntime(...)` using its new read-only Evidence source;
2. real Guided browser-storage persistence through the Workbench Evidence seam;
3. one unified `runtime.read({ learningUnitId: "props" })`;
4. patch-choice Guided Practice;
5. ordered-sequence Guided Practice (`render-commit`);
6. empty Guided persistence;
7. incompatible Guided persistence;
8. inconsistent Assessment provenance;
9. contract protection against invented mastery/AI authority.

## E5 validator correction

During implementation, the frozen structural validator was found to recurse into opaque source payloads such as the frozen Assessment question snapshot.

That could incorrectly treat a legitimate source-authored key named `score` or `confidence` as projection-owned authority.

The validator now treats these source payloads as opaque:

- `task.snapshot`;
- `response`;
- `context`.

The prohibition still applies to projection-owned fields.

This changes validator correctness, not the frozen Evidence semantics.

## Non-goals

#328 does not:

- add a database/table/store;
- change Assessment or Guided persistence schema;
- add UI;
- define lesson completion;
- infer misconception resolution;
- call AI;
- add mastery / score / confidence.

## Handoff

After #328 merges and required CI is green, #318 can close.

The resulting read API becomes the input boundary for:

- #319 deterministic Completion;
- #320 constrained AI Diagnosis.

Those Epics may derive new views from Evidence but may not rewrite Assessment/Guided source correctness.
