# Single Learning Flow · Three-Lesson Rollout Gate

Issue: #284  
Parent Epic: #271  
Review base: `main@c1cb80df234161c28ccefb64e9a89f113af00e24`

## Evidence boundary

This is an expert product/repository review of the three migrated lesson families.

It is evidence for rollout sequencing and contract quality. It is **not** an empirical learner-outcome study and does not establish mastery or measured learning gain.

## Reviewed lessons

| Learning Unit | Primary reasoning family | Practice / Verify shape |
| --- | --- | --- |
| `rendering-lists-key` | component identity / local State | Guided Practice V2 + canonical misconception diagnostics |
| `state-snapshot-queue` | render snapshot / update queue | Guided Practice V2 + queue-mechanism diagnostics |
| `not-need-effect` | causal-source engineering judgement | Guided Practice V2 + causal-boundary diagnostics |

All three expose the same learner-facing structure:

```text
Understand
→ Practice
→ Verify
→ targeted remediation after a known misconception
→ correction retry
→ teach-back after correction
→ optional AI review
```

## 1. Runtime reuse

### Finding: shared runtime is real

`SingleLearningFlow.jsx` is lesson-agnostic for the three migrated families:

- stable `Understand / Practice / Verify` stages;
- generic render slots for Demo, Notes, Practice and Verify;
- lesson-owned titles, descriptions and stage hints;
- generic mechanism-map and contrast-case renderers;
- no Lists & Key / State Snapshot / Effect lesson identifiers or lesson-specific branches in the runtime.

The current registry is deliberately sparse and contains exactly the three enabled lesson definitions.

**Decision:** KEEP the existing runtime seam. Do not create another learning-flow abstraction before the next lesson.

## 2. Lesson-owned teaching depth

### Finding: content differences fit the current seams

The three lessons use the same contract without forcing the same teaching taxonomy:

- Lists & Key models business entity → key → component identity → local State → DOM.
- State Snapshot models render snapshot → update request → queue processing → next render State.
- You Might Not Need an Effect models render derivation / event-caused logic / external synchronization / identity reset.

This is the desired boundary: reusable orchestration, lesson-specific mechanism models.

**Decision:** KEEP lesson-owned concept models and contrast cases. Do not generalize the content taxonomy further.

## 3. Diagnostic verification

### Finding: deterministic misconception diagnosis generalizes

All three lessons can express:

- product-owned canonical questions;
- deterministic correct / incorrect evaluation;
- distractor → misconception mapping;
- targeted counter-evidence before full explanation;
- correction retry without mutating the first formal Attempt;
- teach-back after correction;
- optional AI review that does not change correctness.

The authoring cost is primarily educational content quality, not framework friction.

**Decision:** KEEP the current canonical diagnostic contract.

## 4. Review evidence semantics

### Finding: one cross-cutting gap remains

The current `SingleLearningFlow` lesson-level Needs Review banner derives only from completed Assessment review:

```text
latestReview.incorrectCount > 0
```

However, Guided Practice already persists an explicit learner-owned `needsReview` fact. Inside Practice, the learner can choose “标记为需要复习”, but that fact is not projected into the lesson-level Single Learning Flow signal when the learner returns to Understand / Verify.

This means the product currently has two review facts with different visibility:

```text
Assessment incorrect Attempt
→ visible lesson-level Needs Review

Guided needsReview
→ visible only inside Guided Review
```

That is acceptable for an initial slice because #272 required at least one concrete review signal. It is not acceptable as the stable contract for broader rollout because Product V2 explicitly defines Review as a projection from real learning evidence, including both incorrect Assessment attempts and Guided `needsReview`.

**Decision:** REVISE PLATFORM before migrating a fourth lesson.

## 5. AI boundary

Core learning remains usable without AI:

- Understand content is product-owned.
- Practice deterministic correctness is not AI-scored.
- Verify correctness is deterministic.
- remediation / retry work without AI.
- teach-back can be completed without AI.
- AI review is an optional unsent handoff.

**Decision:** KEEP.

## 6. Persistence and evidence integrity

The three slices preserve the important evidence boundaries:

- first formal Assessment Attempt remains immutable;
- correction retry is local deterministic checking and does not inflate the formal score;
- Guided raw responses remain Guided facts;
- no mastery percentage / learner level is inferred;
- no second Assessment store or Guided runtime exists.

**Decision:** KEEP.

## 7. Authoring constraints to freeze

For the next rollout wave:

1. A lesson receives Single Learning Flow only when it has a clear learning objective and observable evidence.
2. Understand should model the mechanism, not merely summarize API rules.
3. Contrast cases should separate commonly conflated mechanisms.
4. Canonical Verify should include mechanism/application questions, not only vocabulary recall.
5. Known distractors may map to misconception ids only when the diagnosis is defensible from the selected option.
6. Remediation should prefer counter-evidence / experiment before revealing the full explanation.
7. Correction retries never rewrite the original formal Attempt.
8. Teach-back remains reflection evidence, not correctness or mastery.
9. AI remains optional.
10. The flow must not create lesson-specific runtime branches merely to fit content.

## Rollout decision

### **REVISE-PLATFORM**

The shared learning-flow architecture is already reusable. The blocker is narrow and evidence-related, not a need for a new framework.

Before migrating another lesson, add one lesson-level Review projection that combines existing facts:

```text
Assessment incorrect Attempt
OR
Guided needsReview
→ lesson-level Needs Review
```

The projection must not:

- create a new persistence store;
- rewrite either source fact;
- infer mastery;
- make AI mandatory.

After that focused revision passes, proceed with a controlled next wave limited to the remaining two already-validated Guided units:

1. `preserving-resetting-state`
2. `lifecycle-of-reactive-effects`

Do not yet expand Single Learning Flow across arbitrary non-Guided units or the full course.
