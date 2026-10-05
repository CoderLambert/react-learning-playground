# Learning Completion V1

**Status:** FROZEN on merge of #333  
**Contract id:** `learning-completion-v1`  
**Input:** frozen `learner-evidence-v1`  
**Baseline:** #332 / `main @ 927e55714416bac1a74e320fc83193fcbedd104b`

Completion V1 is a pure deterministic read model over Learner Evidence V1. It introduces no persistence and never owns source correctness.

## Frozen states

- `not_started`
- `in_progress`
- `needs_review`
- `complete`

There is no separate `verified` state. Verification is a required-evidence facet.

## Required evidence

Two facets are required: Guided Practice and Verify. A facet is `missing`, `in_progress`, `incorrect`, `review`, or `satisfied`.

Guided precedence:

1. not started → `not_started / start_practice`
2. in progress → `in_progress / resume_practice`
3. completed with missing/incorrect Practice evidence → `needs_review / retry_practice`
4. correct Practice plus learner-owned `needsReview` → `needs_review / review_guided`
5. correct Practice and no review flag → satisfied

Verify precedence after Guided is satisfied:

1. no non-superseded Assessment session → `in_progress / start_verify`
2. latest non-superseded session in progress → `in_progress / resume_verify`
3. latest completed session with missing/incorrect formal answer evidence → `needs_review / retry_verify`
4. latest completed session with all formal answers correct → satisfied

The latest Assessment basis is selected deterministically by `startedAt`, then `sessionId`.

## Completion and continuation

`canContinue` is true only when status is `complete`. The final action is `continue`.

`continue` is a lesson-level closure decision, not routing ownership. The navigation layer maps it to next lesson or terminal path completion.

## Retry and historical wrong evidence

A local correction that is not present in Learner Evidence V1 cannot change Completion. A later completed clean Assessment session can become the current Verify basis, while earlier wrong sessions remain preserved in Learner Evidence for provenance and later diagnosis.

Completion never invents `resolved` or deletes prior wrong evidence.

## Explainability

Every result exposes the two required-evidence states, bounded review reasons, and source basis (`source`, `sourceRef`, relevant `projectionKeys`).

Invalid Learner Evidence produces no continuable decision; evaluation fails closed.

## Authority boundaries

Completion V1 does not:

- recompute Assessment or Guided correctness;
- mutate Learner Evidence;
- create a Completion store or second lesson registry;
- derive mastery, score, confidence, or AI authority;
- inspect optional Ask/Explore to determine closure;
- reinterpret local UI correction as durable evidence.

## Representative pilot

The #333 pilot covers patch-choice, ordered-sequence, no evidence, partial Guided, incorrect Practice, Guided needsReview, missing/in-progress/wrong Verify, later clean Verify after an earlier wrong session, equivalent Evidence ordering, invalid Evidence, and AI-absent operation.

## Freeze

After #333 merges with required CI green, these states, precedence rules, continuation semantics, correction/history semantics, and authority boundaries are frozen for #334. A material semantic change requires stopping #334 and returning to a candidate-contract review.
