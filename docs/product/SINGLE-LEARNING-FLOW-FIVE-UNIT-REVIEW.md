# Single Learning Flow · Five-Unit Cross-Lesson Review

Issue: #295  
Parent Epic: #271  
Review base: `main@8a383ec5737bc62300723bd791a89246496efe92`

## Evidence boundary

This review is based on:

- repository structure;
- deterministic content contracts;
- browser interaction coverage;
- expert product / learning-design walkthrough of the five migrated lessons.

It is **not** an empirical learner study.

The review can support decisions about product structure, authoring safety and rollout sequencing. It does **not** establish:

- measured learning gain;
- mastery;
- retention;
- learner level;
- recommendation accuracy;
- statistical superiority over the previous experience.

## Reviewed set

| Learning Unit | Primary reasoning family | Practice V2 |
| --- | --- | --- |
| `rendering-lists-key` | entity ↔ component identity ↔ local State | patch-choice |
| `state-snapshot-queue` | render snapshot ↔ update queue | patch-choice |
| `preserving-resetting-state` | identity boundary / preserve vs reset | patch-choice |
| `not-need-effect` | causal source / logic placement | patch-choice |
| `lifecycle-of-reactive-effects` | external synchronization lifecycle | ordered-sequence |

All five use the same user-facing loop:

```text
Understand
→ Practice
→ Verify
→ targeted remediation for known misconceptions
→ correction retry
→ teach-back
→ optional AI review
→ Review signal from existing evidence
```

## 1. Shared runtime

### Finding: the runtime has generalized without becoming generic content

`src/learning-flow/SingleLearningFlow.jsx` is currently about 286 lines and contains **no hard-coded id for any of the five migrated lessons**.

It owns the stable product structure:

- Understand / Practice / Verify stage navigation;
- generic Demo / Notes / Practice / Verify render slots;
- generic mechanism-map and contrast-case presentation;
- lesson-level Review projection;
- navigation back to learning evidence.

Lesson-specific reasoning remains outside the runtime.

The five lessons now cover materially different mental models:

- identity matching;
- update queue calculation;
- reset-boundary placement;
- causal-source engineering judgement;
- Effect synchronization lifecycle.

The runtime did not require a lesson-specific branch for any of them.

**Decision: FREEZE / KEEP.**

Do not add a new learning-flow abstraction before there is concrete evidence the current runtime cannot express a new high-value lesson.

## 2. Understand content model

### Finding: shared presentation does not require a shared teaching taxonomy

The five concept models reuse a small presentation contract:

- mechanism map;
- contrast cases;
- misconception catalog;
- deterministic counter-evidence / experiment references.

They do **not** force the same conceptual dimensions.

Examples:

- Lists & Key separates business entity, key, Props, component identity, local State and DOM.
- State Snapshot separates current snapshot, update request, replace/updater semantics, queue processing and next render.
- Preserve / Reset separates business identity, tree slot, component type, key and reset boundary.
- You Might Not Need an Effect separates render derivation, event-caused logic, external synchronization and identity reset.
- Effect Lifecycle separates render/commit, synchronization target, cleanup/setup, functional updater, Effect Event and Strict Mode development behavior.

This is the correct reuse boundary: common learning interaction, lesson-owned mental model.

**Decision: KEEP.**

Do not invent a universal React concept graph or force every lesson into the same mechanism dimensions.

## 3. Practice V2

### Finding: two deterministic activity kinds remain sufficient for this validated set

The final five-unit set uses:

- 4 × `patch-choice`
- 1 × `ordered-sequence`

No new activity kind was required during the Single Learning Flow rollout.

The pattern is important:

- activity type is selected from the learning objective;
- type diversity is not a product goal;
- arbitrary learner code execution is still unnecessary;
- Browser IDE / Monaco remains out of scope.

The bounded activities are not “recognition-free”, but they require inspection of code / runtime order and application of the mental model rather than selecting lesson vocabulary.

**Decision: KEEP.**

Do not create new activity types merely to make the product look richer.

## 4. Verify and misconception diagnosis

### Finding: deterministic diagnostic verification now has broad mechanism coverage

The five migrated units each ship exactly five product-owned canonical questions:

```text
5 lessons × 5 canonical questions = 25 deterministic Verify items
```

Across the set, questions cover:

- mechanism explanation;
- transfer to a new scenario;
- boundary decisions;
- causal ordering;
- incorrect but plausible engineering alternatives.

Known distractors map to misconception ids only when the selected option supports a defensible diagnosis.

The correction flow remains shared:

```text
formal wrong Attempt
→ counter-evidence / experiment
→ retry
→ corrected
→ teach-back
```

The original formal Attempt is not overwritten by the correction retry.

**Decision: KEEP.**

Do not turn correction retries into a second score or mutate the first formal attempt.

## 5. Review semantics

### Finding: the five-unit loop now has one factual lesson-level Review projection

The lesson-level signal consumes existing evidence:

```text
Assessment incorrect Attempt
OR
Guided needsReview
→ Needs Review
```

The projection does not create:

- mastery percentage;
- React IQ;
- learner level;
- hidden recommendation score;
- a second Review persistence store.

Assessment incorrect attempts remain deterministic formal evidence. Guided `needsReview` remains learner-controlled raw evidence.

**Decision: KEEP.**

#218 Quick Check and #219 Skill / Evidence / Mastery must not be activated merely because the five-unit rollout is complete.

## 6. Learner-facing consistency

### Finding: structural consistency is strong; empirical usability remains unknown

Repository/browser evidence now verifies that the five lesson families can all complete the same product journey, including:

- Understand;
- existing Guided Practice V2;
- deterministic Verify;
- known-misconception remediation;
- retry;
- teach-back;
- Needs Review.

The latest Effect Lifecycle rollout completed with 98 / 98 browser tests passing.

However, automated browser evidence cannot establish:

- whether learners understand why the stages exist;
- whether the amount of explanation is appropriate;
- whether remediation actually changes the learner's mental model;
- whether teach-back feels valuable or repetitive;
- whether Practice → Verify pacing is too long;
- whether users prefer this experience to the previous multi-surface workflow.

**Decision: VALIDATE-WITH-LEARNERS before broad rollout.**

This is now the largest product uncertainty.

## 7. Authoring scalability

### Finding: runtime scalability is good; authoring-file scalability is not

Current approximate source sizes after the five-unit rollout:

| Surface | Lines | Role |
| --- | ---: | --- |
| `SingleLearningFlow.jsx` | 286 | shared runtime |
| `learningFlowRegistry.js` | 127 | five flow definitions |
| `conceptModels.js` | 842 | five concept models + misconceptions |
| `canonicalQuestions.js` | 696 | five × canonical Verify sets |
| `guidedActivity.js` | 981 | five Guided definitions |

The problem is not execution performance. It is ownership and change isolation.

If broader rollout continues by appending every lesson into these shared files:

- unrelated lesson work will collide in the same files;
- review diffs will become harder to reason about;
- merge conflict probability will increase;
- authors will need to navigate large cross-lesson files;
- lesson-level rollback / ownership becomes less obvious.

This is precisely the wrong point to create a more abstract “universal lesson schema”. The contracts already work.

The safer move is **physical modularization while preserving the existing contracts**.

Recommended direction:

```text
content/
  conceptModels/
    rendering-lists-key.js
    state-snapshot-queue.js
    ...

assessment/content/
  canonicalQuestions/
    rendering-lists-key.js
    state-snapshot-queue.js
    ...

workbench/
  guidedActivities/
    rendering-lists-key.js
    state-snapshot-queue.js
    ...
```

Each domain should keep its current registry/index and ownership boundary.

Add a cross-surface deterministic contract that ensures every Single Learning Flow unit has the required lesson-owned assets, but do not create a second Learning Unit registry.

**Decision: REVISE-AUTHORING before broader expansion.**

This should be behavior-preserving refactoring, not another product framework.

## 8. Broader rollout decision

### Decision: **REVISE-AUTHORING + VALIDATE-WITH-LEARNERS**

Do **not** start a sixth lesson yet.

The five-unit evidence says:

- the shared runtime works;
- deterministic Practice/Verify contracts work;
- the product can express several different React reasoning families;
- Review semantics are coherent;
- no additional framework abstraction is justified.

But it does **not** yet say:

- learners benefit enough to justify migrating dozens of lessons;
- five-question Verify density is appropriate in real usage;
- correction/teach-back pacing is acceptable;
- users need a Quick Check;
- a mastery / recommendation model is warranted.

## Next phase

Run two independent tracks.

### Track A — behavior-preserving authoring modularization

Goal:

- split the three lesson-content monoliths into lesson-owned modules;
- keep the existing runtime/data contracts unchanged;
- preserve all current deterministic/browser behavior;
- add coverage contracts so a Single Learning Flow definition cannot silently miss concept / Guided / canonical Verify assets.

This can proceed without changing the learner experience.

### Track B — real learner validation

Use the existing five-unit product as the stable validation sample.

Validate at minimum:

- can a learner explain the mental model after correction?
- does Practice make the subsequent Verify easier to reason about?
- are remediation and teach-back perceived as useful?
- where do learners abandon or feel repetition?
- do users understand why Review appears?
- do learners actually have a “where should I start?” problem that would justify #218?

Prefer a small number of observed sessions with qualitative evidence before adding telemetry infrastructure or a scoring domain.

## Explicit non-decisions

This review does **not** approve:

- mass migration of the remaining course;
- #218 Quick Check implementation;
- #219 Skill / Evidence / Mastery implementation;
- Browser IDE / Monaco;
- arbitrary-code deterministic scoring;
- AI scoring;
- a new learning-flow framework.

## Exit criteria for broader selective rollout

Reconsider `GO-SELECTIVE-EXPAND` only after:

1. authoring surfaces are modularized without changing behavior;
2. the five-unit experience has real learner feedback;
3. the review identifies no critical common UX issue;
4. expansion candidates are selected because their learning objective benefits from the flow, not because coverage metrics need to increase.

When those conditions hold, expand in a small batch and review again rather than migrating all remaining units at once.
