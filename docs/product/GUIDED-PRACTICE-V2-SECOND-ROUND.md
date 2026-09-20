# Guided Practice V2 · Second-Round Heuristic Review

Issue: #265  
Parent Epic: #262  
Contract source: #264 / PR #282

## Evidence Boundary

This review is an expert product/design walkthrough of the five upgraded Guided activities, supported by deterministic tests and browser interaction coverage.

It is **not** an external learner study and does **not** claim measured learning gain, mastery improvement, or statistical effectiveness.

The decision here is narrower:

> Does Practice V2 structurally require a stronger transfer/diagnosis artifact than the previous conceptual choice, without adding disproportionate interaction or authoring cost?

## Scope

Only these existing Guided units are reviewed:

1. `state-snapshot-queue`
2. `rendering-lists-key`
3. `preserving-resetting-state`
4. `not-need-effect`
5. `lifecycle-of-reactive-effects`

No sixth Guided unit is added.

## V1 → V2 Comparison

| Guided unit | V1 Practice weakness | V2 artifact | Transfer/diagnosis gain | Friction / risk | Decision |
|---|---|---|---|---|---|
| State Snapshot | “结果相同但语义不同” exposes the target vocabulary and can be answered by recognition | `patch-choice`: repair a +3 handler that must compose with an updater already in the queue | Learner must distinguish snapshot replacement from functional queue composition in executable-looking code | Three patches are longer than a choice label, but the diff is bounded and no code executes | KEEP |
| Lists & Key | `todo.id` is visually obvious once the lesson has just taught “stable id” | `patch-choice`: repair `key={index}` under insert/reorder/title editing | Learner must reject both editable identity and an index+id hybrid, not merely recall “use id” | Low; three compact one-line patches | KEEP |
| Preserve / Reset | `key={product.id}` largely repeats the just-taught pattern | `patch-choice`: choose the narrow identity boundary that resets editor draft while preserving shell UI state | Learner must reason about **where** identity should change, not only which key value to use | Requires reading product-state boundaries, which is desirable task complexity | KEEP |
| You Might Not Need an Effect | Responsibility labels directly include render / Event Handler / Effect vocabulary | `patch-choice`: remove duplicated derived State while rejecting event-only synchronization and `useLayoutEffect` substitution | Learner must repair a real synchronization anti-pattern and preserve prop-driven correctness | Moderate code diff length; still bounded and deterministic | KEEP |
| Effect Lifecycle | Prompt already strongly cues cleanup → setup, while the Practice answer mostly restates dependency guidance | `ordered-sequence`: order topic change → render → commit → old cleanup → new setup | Learner must construct an operational lifecycle trace using stable event ids | Up/down controls require several clicks for five items; acceptable at this size, but do not scale this interaction to long sequences | KEEP |

## Recognition Resistance

The V2 activities reduce the specific recognition shortcuts identified in #263:

- patch option labels are deliberately neutral (`Patch A/B/C`), so correctness is not encoded in the label;
- the learner must inspect code differences;
- distractors are locally plausible and preserve part of the desired behavior;
- the ordered sequence starts in a deliberately incorrect order;
- correctness uses stable ids rather than displayed wording;
- expected response and rationale remain hidden until commit.

This does not make the activities recognition-free. A bounded deterministic task always provides candidate information. The relevant improvement is that the learner now has to apply the mental model to code or runtime ordering instead of selecting the lesson's vocabulary.

## Interaction and Authoring Cost

### Patch Choice

Observed cost is acceptable:

- three bounded alternatives remain quickly inspectable;
- no editor, package runtime, code execution, or syntax-evaluation service is required;
- Review can preserve the exact selected patch and the expected patch;
- content authors must make distractors behaviorally plausible, which is useful discipline rather than framework overhead.

Decision: **KEEP**.

### Ordered Sequence

Observed cost is acceptable only for short causal traces:

- stable-id ordering is deterministic;
- five events are still understandable;
- current up/down controls are keyboard-operable and avoid adding a drag/drop dependency;
- interaction cost grows quickly with item count.

Decision: **KEEP**, with an authoring constraint: prefer roughly 3–6 events and do not introduce drag/drop or long timelines without new evidence.

## Persistence / Historical Evidence

All five definitions move from revision 1 to revision 2 because the scored Practice artifact changed materially.

This intentionally means an in-progress or completed revision-1 lesson session is **not** reinterpreted as a revision-2 answer. The existing persistence layer reports the state as incompatible and safely resets it.

The generic schema-v1 → schema-v2 migration remains supported and tested for an unchanged choice-based activity. The incompatibility in these five lessons is therefore an activity-revision decision, not a loss of the persistence compatibility contract.

## Second-Round Unit Review

| Unit | Practice differs from Predict | Applied artifact preserved in Review | Main remaining concern |
|---|---|---|---|
| state-snapshot-queue | Yes — result prediction vs queue-safe code repair | Selected patch + expected patch + rationale | None beyond normal patch-reading load |
| rendering-lists-key | Yes — observed reorder outcome vs broken-key repair | Selected patch + expected patch + rationale | Avoid making future distractors obviously invalid |
| preserving-resetting-state | Yes — prop-change prediction vs boundary-placement repair | Selected patch + expected patch + rationale | Requires clear product-state boundary wording |
| not-need-effect | Yes — derived-value prediction vs anti-pattern repair | Selected patch + expected patch + rationale | Keep patches focused; do not turn Practice into a code-review essay |
| lifecycle-of-reactive-effects | Yes — cleanup/setup prediction vs full update lifecycle ordering | Committed item order + expected order + rationale | Sequence interaction should remain short |

## Activity Decisions

- `patch-choice`: **KEEP**
- `ordered-sequence`: **KEEP**
- scored `source-locate`: **DEFERRED / NOT NEEDED FOR THIS WAVE**
- arbitrary learner code: **DROP FROM SCOPE**
- Browser IDE / Monaco: **DROP FROM SCOPE**

## Closure Decision

**GO-EXPAND**, subject to the repository/browser verification gates for PR #283.

Meaning of this decision:

- the Practice V2 contract has enough **structural product evidence** to be reused selectively in additional high-value Guided units;
- it does **not** mean every lesson should receive Practice V2;
- it does **not** mean patch-choice should dominate all future activities;
- it does **not** establish measured learner learning gain;
- expansion should continue lesson-by-lesson, choosing an activity only where it creates a materially stronger transfer artifact than the existing interaction.

Do not start #218 or #219 from this decision.
