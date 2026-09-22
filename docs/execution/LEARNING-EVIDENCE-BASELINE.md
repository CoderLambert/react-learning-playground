# Learner Evidence Baseline / Source Ownership — #326

**Baseline:** `main @ 50fe9549becf3c793d56afef848724e914500fd9`  
**Purpose:** inventory facts the product already owns before defining Learner Evidence V1.

This document is descriptive. It does not introduce an Evidence store, mastery model, completion rule, or AI-owned fact.

## 1. Core rule

Learner Evidence V1 must be a **read projection over existing owners**.

```text
Assessment persistence / domain
           │
           ├── authoritative facts
           │
Guided session persistence / domain
           │
           ├── authoritative facts
           │
           ↓
future normalized Evidence projection
```

The projection may normalize and order facts. It may not silently create facts that the source does not own.

## 2. Assessment fact ownership

| Fact | Authoritative owner | Persisted? | Evidence meaning | Notes |
|---|---|---:|---|---|
| `session.id` | Assessment session | yes | Assessment run identity | stable provenance |
| `session.learningUnitId` | Assessment session | yes | lesson scope | authoritative lesson identity for that run |
| `session.status` | Assessment session | yes | in-progress / completed / superseded | deterministic domain state |
| `startedAt / completedAt` | Assessment session | yes | session timing | completion timestamp only exists for completed session |
| `session.items[]` | Assessment session | yes | frozen question set used by the run | not a pointer to the mutable current bank |
| `item.questionId` | frozen session item | yes | task identity | stable inside session |
| `item.revision` | frozen session item | yes | authored question revision used | must match snapshot revision |
| `item.snapshot` | frozen session item | yes | exact question content used | strongest question provenance |
| `attempt.id` | Assessment attempt | yes | formal response identity | must not be dropped by Evidence V1 |
| `attempt.sessionId` | Assessment attempt | yes | source session provenance | ties attempt to frozen question set |
| `attempt.questionId` | Assessment attempt | yes | source task | one formal persisted attempt per question in a session |
| `attempt.questionRevision` | Assessment attempt | yes | question revision answered | derived from frozen session item at submit time |
| `attempt.answer` | Assessment attempt | yes | raw submitted answer | string or boolean |
| `attempt.correct` | Assessment attempt | yes | formal deterministic correctness | calculated by Assessment from the frozen question snapshot at submit time |
| `attempt.submittedAt` | Assessment attempt | yes | response ordering/time | authoritative timestamp |

### Assessment correctness boundary

`attempt.correct` is already authoritative.

Future Evidence code must **not** re-evaluate the answer against the current question bank.

The current Assessment flow computes correctness from:

```text
session item.snapshot
+ submitted answer
→ evaluateQuestionAnswer(...)
→ attempt.correct
```

The attempt then persists that result.

## 3. Assessment derived views that are not source history

### `createAssessmentSessionReview`

The review model is useful UI projection, but it is not sufficient as the Evidence source.

It:

- only exists for completed sessions;
- derives counts;
- sorts incorrect items before correct items;
- exposes question snapshot / answer / correctness;
- does not expose the original `attempt.id`;
- chooses the latest attempt by question defensively.

Therefore Evidence V1 should read **session + raw attempts** from the Assessment owner and may derive a review summary afterward.

Do not normalize Evidence from `AssessmentReviewPanel` or the lightweight lesson `learningReviewProjection`.

### Formal retry limitation

The current repository rejects a duplicate formal attempt for the same question within one Assessment session.

Therefore the persisted Assessment source does **not** own a multi-attempt retry chain for one question in one session.

UI remediation / re-selection after a wrong answer must not be projected as a persisted formal retry unless a later source contract explicitly owns it.

Cross-session history exists through multiple completed sessions, but interpreting a later session as “resolution of an earlier misconception” would be a separate derived rule, not a raw source fact.

## 4. Guided fact ownership

Guided uses the existing browser-storage snapshot as the only persistence source.

| Fact | Owner | Persisted? | Evidence meaning | Notes |
|---|---|---:|---|---|
| `learningUnitId` | Guided session snapshot | yes | lesson scope | must match current definition |
| `activityRevision` | Guided snapshot | yes | authoring revision | incompatible revisions fail closed |
| `currentStepId` | Guided snapshot | yes | current session position | navigation state, not proof by itself |
| `firstPrediction` | Guided session | yes | first committed prediction | learner-submitted evidence |
| `experimentAcknowledged` | Guided session | yes | experiment step acknowledged | boolean source fact |
| `observation` | Guided session | yes | recorded activity observation | currently sourced from the authored expected observation after learner acknowledgement |
| `explanation` | Guided session | yes | learner free-text explanation | raw evidence; intentionally unscored |
| `explanationSubmitted` | Guided session | yes | explanation commitment | distinguishes committed text from an editable draft |
| `practiceResponse` | Guided session | yes | committed transfer response | discriminated patch-choice / ordered-sequence / legacy choice shape |
| `needsReview` | learner-owned Guided state | yes | learner says this lesson needs review | not correctness, not mastery |
| `completedSteps` | Guided snapshot | yes | completed workflow steps | derived from committed session facts when serialized |
| `sessionStarted` | Guided snapshot | yes | current Guided run started | source lifecycle fact |
| `sessionCompleted` | Guided snapshot | yes | current Guided run reached review | not the same as lesson completion |
| `updatedAt` | Guided persistence | yes | snapshot update time | useful provenance |

## 5. Guided derived facts

### Practice correctness

Guided does not persist a second correctness record.

It persists `practiceResponse`.

The current owner derives correctness through the existing deterministic evaluator:

```text
authored Practice step
+ practiceResponse
→ evaluateGuidedPracticeResponse(...)
→ practiceOutcome.correct
```

Evidence V1 may expose this derived result, but provenance must show that correctness comes from the Guided evaluator and current compatible activity revision.

Do not invent a second evaluator.

### Explanation

`explanation` is intentionally raw learner reasoning.

Current product behavior explicitly says it is not automatically scored.

Evidence V1 must preserve it as learner-authored evidence without adding:

- `correct`;
- confidence;
- mastery;
- AI verdict.

### needsReview

`needsReview` is learner-owned raw evidence.

It means:

> the learner marked this Guided run / lesson as needing review.

It does not mean:

> the system proved the learner is wrong.

## 6. Persisted fields that are not submitted Evidence

Guided persistence also stores:

- `predictionDraft`;
- `practiceDraft`.

They exist so page reload does not destroy in-progress interaction.

They are not committed learner evidence until the corresponding submission fact exists.

Candidate Evidence V1 should therefore exclude them from submitted Evidence by default.

If future UI needs draft telemetry, that must be a separate explicit contract.

## 7. Guided history limitation

The current Guided persistence is one lesson-scoped snapshot, not a historical event ledger.

`startOver` clears the persisted snapshot and starts a new run.

Therefore the current product does **not** own:

- all historical Guided runs;
- historical Practice retry attempts;
- a persisted “misconception resolved” event.

Evidence V1 must not fabricate those histories.

This is a deliberate reason to keep V1 as a projection rather than introducing persistence just to satisfy a richer theoretical schema.

## 8. Existing lesson Review projection

#286 created the current lightweight lesson Review projection:

```text
Assessment incorrect count > 0
OR
Guided needsReview === true
→ lesson Needs Review
```

That projection is intentionally small and remains valid for UI closure.

It is **not** the new Learner Evidence model because it discards most source provenance and raw learner facts.

#318 should build a richer read projection without replacing #286 or changing its semantics unnecessarily.

## 9. Facts that must not become authoritative Evidence

| Candidate | Why not authoritative |
|---|---|
| Assessment UI `answer` draft | transient controller/UI input before formal submit |
| Assessment `feedback` presentation | UI projection, not source history |
| Guided `predictionDraft` | persisted interaction draft, not committed prediction |
| Guided `practiceDraft` | persisted interaction draft, not committed Practice response |
| AI explanation / critique | optional derived assistance, not correctness |
| `aiReviewTarget` | authoring scope, not learner fact |
| lesson Review banner | derived UI signal |
| “mastery %” / React IQ | not owned anywhere |
| inferred misconception resolution | not currently persisted as a source fact |
| inferred retry count | not generally available from current source owners |

## 10. Representative Evidence scenarios for #327

### E-A1 — completed Assessment, mixed correctness

Source:

- one completed session;
- frozen question snapshots/revisions;
- one correct formal attempt;
- one incorrect formal attempt.

Must preserve:

- session provenance;
- both raw attempts;
- raw answers;
- persisted correctness;
- submission ordering/timestamps;
- question snapshot/revision provenance.

### E-A2 — completed Assessment history

Two completed sessions for one Learning Unit.

Must preserve each session boundary.

Candidate V1 may present a flattened ordered view, but must not imply that a later correct session automatically “resolved” an earlier incorrect one.

### E-A3 — in-progress Assessment

Session exists but not all questions have formal attempts.

Candidate must define whether submitted attempts are visible as Evidence while session remains in progress.

It must not turn current answer drafts into submitted Evidence.

### E-G1 — completed Guided patch-choice

Representative lesson: `props`.

Must preserve:

- first prediction;
- acknowledged observation;
- free-text explanation;
- committed patch-choice response;
- deterministic Practice outcome;
- needsReview;
- activity revision / lesson provenance.

### E-G2 — completed Guided ordered-sequence

Representative lesson: `render-commit`.

Same Evidence contract must work without a source-specific special record shape.

### E-G3 — Guided explanation remains unscored

A submitted free-text explanation exists.

Projection must expose raw text and submission state while leaving correctness unknown/not-applicable.

### E-G4 — learner-owned needsReview

Same completed Guided evidence with `needsReview = true`.

Projection must preserve the learner-owned mark separately from deterministic correctness.

### E-G5 — incomplete/persisted Guided session

Prediction and/or explanation may exist while Practice has not been submitted.

Candidate must distinguish committed Evidence from drafts and from future steps that do not exist yet.

## 11. Candidate-contract implications

#327 should prefer a small number of normalized concepts.

Likely useful dimensions:

- source: Assessment / Guided;
- learningUnitId;
- session/run provenance;
- task/step identity;
- evidence kind;
- committed response;
- deterministic result when the source owns one;
- occurred/submitted/updated timestamp when actually available;
- source revision/snapshot provenance.

Do **not** freeze these exact field names in #326.

The schema still needs representative pilot validation.

## 12. Explicit non-goals

#326 does not:

- add an Evidence table/store;
- migrate IndexedDB;
- change Guided localStorage schema;
- change Assessment attempts;
- change Guided correctness;
- define deterministic lesson completion;
- diagnose misconceptions;
- call AI;
- create mastery, confidence or recommendation scores.

## 13. Handoff to #327

The most important design constraint is:

> normalize what the product owns; do not design a richer history and then create persistence merely to fill the schema.

The candidate Evidence contract should be shaped by these real source limits.
