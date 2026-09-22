# Learner Evidence V1

**Status:** FROZEN by #327 / PR #330  
**Contract id:** `learner-evidence-v1`  
**Source baseline:** #326 / `main @ 93f325c1f0803ec86da5c75e19bfb097a5a36bea`  
**Production contract module:** `src/learning-evidence/contract.js`

Learner Evidence V1 is a **read-only normalized projection** over facts already owned by Assessment and Guided.

It does not introduce persistence.

## 1. Product purpose

The projection answers:

> What committed evidence does the product already have for this Learning Unit, and where did each fact come from?

It does not answer:

> How much has the learner mastered?

It is intended to become shared input for later deterministic Completion (#319) and constrained AI Diagnosis (#320), without letting either redefine source correctness.

## 2. Projection shape

Conceptually:

```ts
interface LearnerEvidenceProjectionV1 {
  contractVersion: "learner-evidence-v1"
  learningUnitId: string
  sources: EvidenceSourceSliceV1[]
}
```

The projection is lesson-scoped.

There is deliberately **no global learner score** and no second Learning Unit registry.

## 3. Source Slice

A Source Slice represents one source-owned evidence context.

```ts
interface EvidenceSourceSliceV1 {
  source: "assessment" | "guided"
  sourceRef: object
  lifecycle: object
  learnerState?: object
  records: EvidenceRecordV1[]
}
```

The common envelope is normalized, but source capabilities remain truthful.

### Assessment slice

One Assessment source slice represents one persisted Assessment session.

```ts
{
  source: "assessment",
  sourceRef: {
    sessionId: string
  },
  lifecycle: {
    status: "in_progress" | "completed" | "superseded",
    startedAt: string,
    completedAt: string | null
  },
  records: [...]
}
```

Multiple Assessment sessions for the same Learning Unit become multiple slices.

V1 does not flatten away the session boundary.

### Guided slice

The current Guided persistence owns one lesson-scoped snapshot, not a historical run ledger.

```ts
{
  source: "guided",
  sourceRef: {
    activityRevision: number
  },
  lifecycle: {
    status: "not_started" | "in_progress" | "completed",
    updatedAt: string | null
  },
  learnerState: {
    needsReview: boolean
  },
  records: [...]
}
```

There is intentionally no authoritative Guided `runId`.

A generated projection key may identify a record inside one read model, but it must not be interpreted as a persisted historical event id.

## 4. Evidence Record

Only **committed/submitted** evidence becomes a record.

```ts
interface EvidenceRecordV1 {
  projectionKey: string
  kind: EvidenceRecordKind
  task: object
  response: object
  outcome: CorrectnessOutcome | null
  occurredAt: string | null
  provenance: object
}
```

`projectionKey` is a read-model identity only.

Source provenance remains authoritative.

## 5. Record kinds

V1 supports:

```text
assessment-answer
guided-prediction
guided-experiment-acknowledgement
guided-explanation
guided-practice
```

It does not define generic retry/resolution events because the current source owners do not persist those histories.

## 6. Assessment Answer

Assessment Answer is the strongest formal evidence record.

Example shape:

```ts
{
  projectionKey: "assessment:attempt:<attemptId>",
  kind: "assessment-answer",

  task: {
    id: questionId,
    revision: questionRevision,
    snapshot: frozenQuestionSnapshot
  },

  response: {
    kind: "answer",
    value: submittedAnswer
  },

  outcome: {
    kind: "correctness",
    correct: boolean,
    authority: "assessment"
  },

  occurredAt: submittedAt,

  provenance: {
    owner: "assessment",
    sessionId,
    attemptId,
    questionId,
    questionRevision
  }
}
```

### Critical rule

`outcome.correct` is copied from persisted `attempt.correct`.

Evidence V1 must not re-run the current question bank evaluator.

The frozen question snapshot remains available under task provenance so later diagnosis can inspect the actual task the learner answered.

## 7. Guided Prediction

```ts
{
  kind: "guided-prediction",
  task: {
    id: predictStep.id,
    type: "predict",
    revision: activityRevision
  },
  response: {
    kind: "choice",
    optionId: firstPrediction
  },
  outcome: null,
  occurredAt: null,
  provenance: {
    owner: "guided",
    activityRevision,
    stepId: predictStep.id
  }
}
```

V1 does not invent prediction correctness.

The current Guided owner preserves the first prediction but does not expose it as a formal correctness fact.

## 8. Guided Experiment acknowledgement

The learner action is the acknowledgement.

The stored observation text is authored experiment context, not free-form learner-authored observation.

```ts
{
  kind: "guided-experiment-acknowledgement",
  response: {
    kind: "acknowledgement",
    acknowledged: true
  },
  context: {
    observation: storedObservation
  },
  outcome: null,
  occurredAt: null
}
```

The optional context does not change authorship.

## 9. Guided Explanation

```ts
{
  kind: "guided-explanation",
  response: {
    kind: "text",
    text: submittedExplanation
  },
  outcome: null,
  occurredAt: null
}
```

The explanation is raw learner reasoning.

V1 prohibits adding:

- correctness;
- AI verdict;
- confidence;
- mastery.

## 10. Guided Practice

```ts
{
  kind: "guided-practice",

  task: {
    id: practiceStep.id,
    type: "practice",
    revision: activityRevision
  },

  response: {
    kind: "guided-practice",
    value: persistedPracticeResponse
  },

  outcome: {
    kind: "correctness",
    correct: boolean,
    authority: "guided"
  },

  occurredAt: null,

  provenance: {
    owner: "guided",
    activityRevision,
    stepId: practiceStep.id
  }
}
```

The correctness outcome must come from the existing Guided deterministic evaluator.

V1 must not create another evaluator.

The same record shape supports:

- `patch-choice`;
- `ordered-sequence`;
- legacy `choice` if a future in-scope lesson uses the existing primitive.

## 11. Guided needsReview

`needsReview` stays in the Guided Source Slice:

```ts
learnerState: {
  needsReview: boolean
}
```

It is intentionally not modeled as a historical event.

Why:

- current persistence owns only the latest boolean;
- `false` cannot distinguish “never marked” from “marked then unmarked”;
- V1 must not fabricate toggle history.

## 12. Draft exclusion

The following persisted Guided fields are excluded from Evidence Records:

- `predictionDraft`;
- `practiceDraft`.

They are recovery state, not committed evidence.

Assessment answer drafts are likewise excluded.

Submitted formal attempts remain visible even when the Assessment session is still in progress.

## 13. Time and ordering

V1 does not pretend all evidence has a comparable event timestamp.

### Assessment

Formal attempts own `submittedAt`, so:

```ts
occurredAt = attempt.submittedAt
```

### Guided

The current persisted snapshot owns only snapshot-level `updatedAt`, not per-step timestamps.

Therefore:

```ts
occurredAt = null
```

for Guided records.

The Guided source slice may expose `lifecycle.updatedAt`.

### No fake global timeline

Consumers must not infer chronological order across Assessment and Guided records when one side has no event timestamp.

V1 may return records in deterministic presentation order, but array order is not authoritative time.

## 14. Incomplete sources

Incomplete source state is valid.

### In-progress Assessment

Submitted attempts are valid Evidence even before the session is completed.

Unanswered questions produce no answer record.

Current answer drafts are excluded.

### In-progress Guided

Only already committed steps produce records.

Example:

```text
prediction submitted
experiment not yet acknowledged
```

produces one Guided Prediction record.

Future steps produce no placeholder records.

## 15. Retry and resolution

V1 intentionally has no:

- `retryCount`;
- `resolved`;
- `resolution`;
- `misconceptionResolved`.

The current product does not own a reliable general-purpose history for these facts.

Assessment owns multiple sessions, but V1 does not infer that a later correct session resolved an earlier misconception.

Guided owns only the current snapshot.

These may become later **derived models** if the product eventually owns sufficient source history.

## 16. Aggregates

V1 core projection does not require aggregates.

Consumers may derive:

- number of Assessment answers;
- incorrect count;
- whether Guided Practice is correct;
- whether learner marked needsReview.

Those are views over records/state, not new authority.

If later stored in a projection object, they must be explicitly marked derived.

## 17. Forbidden authority

The frozen V1 contract rejects fields that imply unsupported authority, including:

- `mastery`;
- `masteryScore`;
- `score`;
- `confidence`;
- `aiVerdict`;
- `retryCount`;
- `resolved`;
- `resolution`.

AI may consume Evidence later, but AI output is not Learner Evidence V1.

## 18. Provenance rule

Every Evidence Record must be traceable to its authoritative source.

Assessment provenance includes at minimum:

- sessionId;
- attemptId;
- questionId;
- questionRevision.

Guided provenance includes at minimum:

- activityRevision;
- stepId.

The normalized projection may add presentation-friendly keys, but those keys never replace source provenance.

## 19. Read-only rule

Learner Evidence V1 defines no mutation API.

Consumers cannot write:

- Evidence Records;
- correctness;
- source lifecycle;
- needsReview;

through the projection.

Changes must continue through the authoritative Assessment or Guided owner.

## 20. Stop conditions

Do not freeze this contract if the representative pilot shows that:

- raw Assessment attempts have to be collapsed into aggregates;
- Guided patch-choice and ordered-sequence require incompatible record envelopes;
- explanation needs invented correctness;
- drafts have to be promoted to submitted evidence;
- Assessment correctness has to be recomputed;
- Guided needsReview has to be treated as historical event;
- a new persistence store is required.

## 21. V1 non-goals

V1 does not implement:

- deterministic lesson completion;
- misconception diagnosis;
- AI intervention;
- spaced review;
- cross-lesson learner model;
- Evidence event persistence;
- telemetry warehouse;
- learner mastery.

Those remain later layers over source facts.

## 22. Freeze rule

If #327 merges with all representative Pilot scenarios green, this document becomes the frozen Evidence V1 contract for #328.

#328 may implement adapters/projection runtime.

#328 must not silently strengthen the contract by adding invented source history or authority.

A material change requires a new candidate contract and representative pilot.
