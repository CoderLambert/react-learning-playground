# Learning Experience V2 — Understand → Practice → Verify

- Status: Current UX direction
- Product source: `docs/product/PRODUCT-VISION-V2.md`
- Initial validation unit: `rendering-lists-key`

## 1. UX principle

The learner sees a lesson, not a collection of tools.

The stable user-facing stage vocabulary is:

```text
① Understand
② Practice
③ Verify
```

Internal systems may remain separate domains. The UI orchestrates them into one task.

## 2. Default Learning Unit layout

Desktop concept:

```text
┌──────────────────────────────────────────────────────────────┐
│ Chapter 01 · 5/7                         Lists & Key          │
│ [① Understand ✓] ─ [② Practice ●] ─ [③ Verify ○]           │
├────────────────────────────────────────────┬─────────────────┤
│                                            │ Context help    │
│            Current learning task           │                 │
│                                            │ Source          │
│                                            │ Ask AI          │
│                                            │                 │
└────────────────────────────────────────────┴─────────────────┘
```

The center workspace owns the current stage.

The Inspector becomes contextual help, not another learning-mode selector.

Initial target:

```text
Inspector
Source | AI
```

Notes and Assessment should move into their corresponding center stages before their Inspector tabs are removed. Do not hide them before equivalent learner access exists.

## 3. Stage 1 — Understand

The center stage should answer five questions with minimal content:

1. What should I be able to explain after this lesson?
2. What mental model matters?
3. What observable behavior demonstrates it?
4. What is the common misconception?
5. What engineering rule follows?

Suggested structure:

```text
Objective
Mental Model
Worked Example / Demo
Common Misconception
Decision Rule
Deep Reading
```

### Official documentation

Official docs are not a permanent top-level mode.

They are a contextual action such as:

```text
Want the complete definition?
[React official · Rendering Lists]
```

When opened, the current center official-doc reader can still be used and should return to the same lesson context.

### Notes

MDX Notes remain content assets. V2 does not require rewriting all Notes.

For the vertical slice, curate the visible Understand content so the learner gets the important mental model before optional long-form reading.

## 4. Stage 2 — Practice

“Guided Learning” is an internal capability name.

The learner sees “Practice”.

For high-cognitive-load lessons, the existing Guided runtime can supply:

```text
Predict
→ Experiment
→ Explain
→ Transfer
→ Review evidence
```

The labels presented to learners may be localized/natural language; persistence and Guided contracts should not be renamed merely for UI wording.

### Practice is recipe-based

Different lessons may use different recipes:

| Lesson type | Practice recipe |
| --- | --- |
| basic concept | interact with Demo + one application task |
| mental model | Predict → Experiment → Explain → Transfer |
| API | Demo + parameter/behavior change |
| integration/framework | Real Integration Lab |
| compile-time/type | source/type reasoning, not fake browser compilation |

Do not force every Learning Unit into the five-step Guided runtime.

## 5. Stage 3 — Verify

Verification is learner-facing Assessment practice, not question-bank management.

Expected experience:

```text
Verify · 1 / 3

Question...

[answer]

[Submit]

Incorrect
Why
Relevant mental model
[Review Demo] [Review evidence] [Official explanation]
```

### Canonical questions

The product should ship reviewed canonical questions for a V2-enabled Learning Unit.

AI-generated questions are optional follow-up practice.

```text
Canonical product questions
        +
Optional AI-generated questions
```

The learner should never have to author their own initial assessment.

### Deterministic correctness

V2 keeps the current Assessment domain's deterministic semantics for objective questions.

Free-text explanation feedback should not be forced into `Attempt.correct` until a separate contract justifies that semantic change.

## 6. Explanation feedback

Existing Guided Explain is the preferred seam for first-wave free-text reasoning.

A rubric may define:

- expected concepts;
- missing concepts;
- common misconceptions;
- recommended evidence.

Base mode can show a self-review rubric.

Optional AI mode can compare the learner's text to the rubric and return structured feedback.

Example:

```text
Covered
✓ index represents position

Missing
• key participates in component identity
• local state may remain attached to the reused identity

Review
→ stable-id vs index Demo
→ React: Preserving and Resetting State
```

This is reasoning feedback, not a numeric mastery score.

## 7. Review

Review is derived from evidence.

First-wave signals:

- incorrect Assessment attempt;
- Guided `needsReview`.

Future deterministic challenge failures may also contribute.

The first Review Queue should be a read projection over existing stores rather than a new persistence domain.

Example:

```text
Needs Review · 2

Component Identity
Latest assessment: 2 / 3
[Review lesson] [Retry verification]

Effect Boundary
Marked during Practice
[Review lesson]
```

No spaced-repetition scheduling is required in the first wave.

## 8. Learning evidence presentation

Prefer facts over inferred scores.

Good:

```text
Practice completed
Assessment 2 / 3
Needs review: component identity
```

Avoid:

```text
Mastery 73%
React IQ 840
Advanced
```

## 9. Navigation

Default learning navigation should emphasize:

- Continue Learning;
- current chapter;
- current unit;
- next action;
- Needs Review count.

Other chapters may stay collapsed by default.

The existing search and complete unit inventory remain available in Browse Knowledge.

The current “全部功能完整总览” should not be the primary learning CTA in V2.

## 10. Chapter Checkpoint role

Chapter Checkpoint becomes synthesis rather than a parallel bank of 65 standalone review prompts.

Existing content is an asset pool. During later migration, prompts may be classified into:

- unit canonical Assessment;
- explanation rubric;
- Demo experiment;
- design task;
- coding challenge;
- chapter synthesis.

The final chapter checkpoint should retain only cross-unit questions/tasks that genuinely require synthesis.

Do not migrate all checkpoint content in the first vertical slice.

## 11. Source behavior

Source remains a contextual Inspector surface.

For a task that needs code evidence, actions should deep-link to the existing semantic Source view and primary region.

Preferred interaction:

```text
[View core implementation]
→ Inspector / Source
→ primary semantic region
```

Do not add a second full SourceViewer under every Demo by default.

## 12. AI behavior

AI is a contextual assistant.

It may receive the current lesson/stage/evidence context.

It should not appear as a mandatory stage.

Examples:

- “Explain this source region.”
- “Compare my explanation to the rubric.”
- “Give me another practice question based on this mistake.”

Core Understand / Practice / Verify must remain usable without AI.

## 13. Vertical slice — rendering-lists-key

### Objective

After the lesson, the learner should be able to explain:

> Why can index keys make local component state attach to the wrong data after insert/delete/reorder, and why is this an identity problem rather than merely a rendering-performance problem?

### Understand

Use existing assets to present:

- stable key as identity evidence;
- position/index versus business entity;
- reorder example;
- common misconception: “key is mainly a performance optimization”;
- React official references.

### Practice

Reuse the existing Guided activity.

User-facing wording should frame it as Practice, not a separate product mode.

The learner should:

- predict behavior;
- operate the real Demo;
- explain the result;
- answer a transfer case;
- inspect evidence when uncertain.

### Verify

Ship a small reviewed canonical set, initially 2–3 objective questions.

Questions should cover different aspects rather than paraphrase the same fact:

- identity role of key;
- index key behavior under reorder/insert;
- stable key selection.

Each explanation should point back to specific lesson evidence.

### Review

An incorrect attempt or explicit Guided `needsReview` should make this unit appear in the first Review Queue projection.

## 14. Vertical slice acceptance criteria

A learner can:

- identify Understand / Practice / Verify without product instruction;
- always see a clear current/next action;
- complete Practice using existing Demo behavior;
- start verification without asking AI to create questions;
- receive immediate deterministic feedback for canonical questions;
- jump from incorrect feedback to relevant evidence;
- see the unit in Review when a concrete review signal exists;
- return to the lesson without losing existing Guided/Assessment persistence semantics.

The slice must not require:

- a new mastery domain;
- a new Assessment store;
- Browser IDE infrastructure;
- expanding Guided to new lessons;
- changing #263–#265 gates.

## 15. Migration rule

Do not remove an existing user-access path until its V2 replacement is usable.

Recommended convergence order:

1. add stage orchestrator to the vertical slice;
2. add canonical verification;
3. add Review projection;
4. route existing Notes / Guided / Assessment through the stages;
5. only then simplify redundant top-level tabs/controls;
6. usability-check the slice;
7. decide whether to scale.

## 16. First-wave product questions

The vertical slice should answer these before course-wide migration:

- Does the stage model reduce confusion?
- Is “Practice” clearer than exposing Guided as a separate mode?
- Can canonical verification stand alone without AI?
- Does wrong-answer feedback route learners back to useful evidence?
- Does Review provide a reason to return?
- Which current Inspector controls remain necessary after orchestration?
