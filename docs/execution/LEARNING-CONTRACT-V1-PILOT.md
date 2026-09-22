# Learning Contract V1 Representative Pilot — #315

## Decision

**Result: PASS — freeze `learning-contract-v1` on merge of #315.**

No lesson content rewrite, new renderer, new registry or lesson-specific workaround was required to express the candidate contract.

Pilot set is inherited from #314:

| Role | Learning Unit | Practice path | Pilot result |
|---|---|---|---|
| Simple | `props` | patch-choice | PASS |
| Medium | `state-snapshot-queue` | patch-choice | PASS |
| Complex | `preserving-resetting-state` | patch-choice | PASS |
| Exception path | `render-commit` | ordered-sequence | PASS |
| Latest rollout | `use-effect-correct-usage` | patch-choice | PASS |

## What was reviewed

For each pilot lesson:

```text
Flow objective
→ concept mechanism
→ real source evidence
→ misconception model
→ deterministic Practice transfer
→ canonical Verify transfer
→ diagnostic misconception mapping
→ deterministic review / closure boundary
```

The pilot intentionally checks semantic alignment in addition to field presence.

## Lesson findings

### props — simple

One coherent target is maintained throughout:

```text
parent-owned source data
→ read-only Props
→ render-time derivation
→ remove duplicated derived State
→ Verify ownership/default/derivation
```

Practice repairs a copied derived value. Verify diagnostics map incorrect ownership/default/derived-State answers back to the lesson misconceptions.

No workaround required.

### state-snapshot-queue — medium

One coherent queue model is maintained throughout:

```text
current render snapshot
→ queued replace/updater requests
→ queue processing
→ next render State
```

Practice uses unfamiliar code to choose functional updater semantics. Verify diagnostic mappings cover snapshot mutation, repeated replacement, updater semantics and queue misconceptions.

Existing E2E already exercises wrong-answer remediation/retry and preserves the first formal error.

No workaround required.

### preserving-resetting-state — complex

One coherent identity model is maintained throughout:

```text
position + component type + key
→ component identity
→ State preservation/reset
→ narrow reset boundary
```

Practice repairs the identity boundary with a stable business key. Verify covers prop-change preservation, stable key reset, narrow reset boundary and a transfer case where per-entity draft persistence requires a different State ownership design.

Existing E2E exercises misconception correction and retry before continuation.

No workaround required.

### render-commit — exception path

This lesson validates the only first-20 `ordered-sequence` Practice path.

The same contract remains valid:

```text
trigger
→ render
→ commit
→ browser paint
```

Practice evidence differs in representation, not in architecture. The shared Guided evaluator deterministically validates the expected order and rejects an alternative order.

No custom renderer or contract exception required.

### use-effect-correct-usage — latest rollout

One coherent external synchronization target is maintained throughout:

```text
committed React state
→ Effect setup
→ external system
→ cleanup of the previous relation
```

Practice repairs an external listener with symmetric cleanup. Verify distinguishes external synchronization from render derivation and event-caused commands.

The Batch D browser journey covers Understand source evidence → Practice patch → unfamiliar Verify transfer → completed lesson.

No workaround required.

## Cross-pilot results

### Identity

All five lessons resolve the same `learningUnitId` across Flow, Concept, Guided and canonical Verify.

### Understand

All five have:

- concrete mechanism models;
- >= 2 source-backed code evidence entries;
- lesson-scoped misconception definitions.

### Practice

All five pass the existing Guided contract and evaluator.

Coverage includes:

- `patch-choice`;
- `ordered-sequence`.

No new Practice kind was required.

### Verify

All five have:

- exactly five canonical questions;
- deterministic answer identity;
- unfamiliar-code transfer;
- diagnostic wrong-answer mappings that resolve to lesson-owned misconceptions.

### Closure

The product boundary was inspected directly:

- lesson completion UI is gated by `verificationSession.status === "completed"`;
- lesson review projection consumes only Assessment incorrect evidence and Guided `needsReview`;
- no score/mastery is invented;
- `aiReviewTarget` is not used by `SingleLearningFlow` as completion input.

Therefore AI remains optional support rather than a completion authority.

## Stop-condition review

| Stop condition | Observed? |
|---|---|
| Same workaround needed by a second lesson | No |
| New custom renderer required | No |
| Legitimate pilot lesson cannot fit candidate contract | No |
| Conflict with Assessment/Guided deterministic semantics | No |
| Broad unrelated content rewrite required | No |

No stop condition fired.

## Freeze result

On merge of #315:

- `docs/product/LEARNING-CONTRACT-V1.md` becomes the frozen contract for #316/#317;
- #316 may automate the deterministic invariants;
- #316 must not silently strengthen or weaken the frozen semantics;
- semantic checks that cannot be proven deterministically should become warnings/review-required, not automatic content rewrites.
