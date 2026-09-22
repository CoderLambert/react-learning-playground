# Learner Evidence V1 Representative Pilot — #327

## Decision

**Candidate result: PASS. Freeze is allowed only after repository CI is green.**

The representative scenarios selected by #326 fit one read-only projection contract without new persistence, source-specific alternate schemas, or invented learner authority.

## Pilot scenarios

| Scenario | Source | Result |
|---|---|---|
| Completed Assessment with persisted correct answer | Assessment | PASS |
| Completed Assessment with persisted incorrect answer | Assessment | PASS |
| Multiple Assessment sessions for one lesson | Assessment | PASS |
| Submitted attempt inside in-progress session | Assessment | PASS |
| Completed patch-choice Guided flow | Guided / `props` | PASS |
| Completed ordered-sequence Guided flow | Guided / `render-commit` | PASS |
| Raw submitted explanation | Guided | PASS |
| Current learner `needsReview` state | Guided | PASS |
| Persisted prediction draft without submission | Guided | PASS |
| Submitted prediction before later steps | Guided | PASS |
| Forbidden mastery/retry/timestamp claims | Contract guard | PASS |

## What the Pilot proved

### Assessment attempt history survives normalization

Each Assessment session remains a separate Source Slice.

Each persisted attempt remains a separate Evidence Record with:

- attemptId;
- sessionId;
- questionId;
- questionRevision;
- raw answer;
- persisted correctness;
- submittedAt;
- frozen question snapshot.

The projection does not reduce these facts to incorrect counts or other aggregates.

### Assessment correctness is not recomputed

The Pilot projects `attempt.correct` directly.

No current question-bank evaluator is invoked to establish Evidence correctness.

This preserves the original frozen-question semantics.

### In-progress Assessment evidence is valid

A formally submitted attempt remains Evidence even while its Assessment session is `in_progress`.

Unanswered questions do not create placeholder records.

### Guided patch-choice and ordered-sequence share one envelope

`props` and `render-commit` both project as:

```text
guided-practice
→ response.value = existing discriminated Guided response
→ deterministic Guided correctness
```

Only the nested existing response kind differs.

No second Evidence schema or special renderer-specific branch is required.

### Explanation remains raw evidence

The Guided Explanation record preserves submitted free text with:

```text
outcome = null
occurredAt = null
```

No correctness, confidence, AI verdict or mastery is invented.

### needsReview remains current learner state

The boolean is kept on the Guided Source Slice.

The Pilot does not turn it into a historical toggle event.

### Drafts remain excluded

A persisted `predictionDraft` without `firstPrediction` produces zero Evidence Records.

After submission, exactly one Guided Prediction record appears.

No future-step placeholders are created.

### Guided time remains truthful

Guided records use:

```text
occurredAt = null
```

because the source owns only snapshot-level `updatedAt`.

The Contract rejects an invented per-step Guided timestamp.

## Stop-condition review

| Stop condition | Observed? |
|---|---|
| New Evidence persistence required | No |
| Raw Assessment history must be collapsed | No |
| Patch-choice and ordered-sequence need incompatible envelopes | No |
| Explanation requires invented correctness | No |
| Drafts must be promoted to submitted evidence | No |
| Assessment correctness must be recomputed | No |
| needsReview must be modeled as event history | No |
| Same workaround appears on a second scenario | No |

No stop condition fired.

## Freeze result

If #327 merges with required repository verification green:

- `docs/product/LEARNER-EVIDENCE-V1.md` becomes frozen for #328;
- `scripts/learning-evidence/contract.mjs` is the machine-checkable structural boundary;
- #328 may implement thin Assessment and Guided source adapters plus a read projection;
- #328 may not add persistence, mastery, retry/resolution history, or AI-owned facts without a new contract revision.
