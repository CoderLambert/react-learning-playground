# Learning Contract V1

**Status:** FROZEN on merge of #315  
**Contract id:** `learning-contract-v1`  
**Scope:** first-20 Single Learning Flow authoring surfaces  
**Baseline:** #314 / `main @ b968e8364d1883a43c2fc7c748860c3ac300453e`

This contract freezes the cross-surface invariants that already make one lesson teachable as a coherent Single Learning Flow.

It is **not**:

- a second Learning Unit registry;
- a universal lesson DSL;
- a new persistence model;
- a mastery model;
- an AI correctness/completion contract.

The authoritative Learning Unit catalog remains `src/demos/index.js`.

## 1. Identity invariant

For an in-scope Single Learning Flow lesson, one `learningUnitId` must resolve consistently across:

1. Learning Unit registry/source ownership;
2. Single Learning Flow definition;
3. concept model;
4. Guided Practice definition;
5. canonical Verify questions.

A surface may not silently invent a second identity for the same lesson.

Duplicate authoring ownership for the same `learningUnitId` is a contract error. The generalized duplicate detector belongs to #316.

## 2. Flow objective invariant

The flow definition must expose non-blank:

- `objective`;
- `coreModelTitle`;
- `mentalModel`;
- `misconceptionTitle`;
- `misconception`;
- `decisionRuleTitle`;
- `decisionRule`;
- Practice title/description;
- Verify title/description;
- stage hints for Understand / Practice / Verify;
- `aiReviewTarget`.

These fields define one lesson objective and its scope. They must not become a second copy of source files, question banks or runtime state.

## 3. Understand evidence invariant

A V1 lesson must have a lesson-owned concept model with:

- matching `learningUnitId`;
- positive version;
- a concrete mechanism map;
- at least two source-backed `codeEvidence` entries;
- unique evidence ids;
- each evidence entry has a title, explanation and `sourceRef`;
- at least one misconception definition.

Each misconception id is stable and lesson-scoped. A misconception must explain:

- what the wrong model is;
- why it is wrong;
- counter-evidence / experiment that can challenge it.

`contrastCases` are useful but remain optional in V1. The required teaching embodiment is mechanism + real code evidence, not a particular presentation card count.

## 4. Practice evidence invariant

Guided Practice stays owned by the existing Guided contract.

Required:

- matching `learningUnitId`;
- positive revision;
- the existing `predict → experiment → explain → practice → review` progression remains valid;
- Practice is deterministic and uses a currently supported Guided response kind;
- the expected response can be evaluated by the existing Guided evaluator;
- at least one alternative response evaluates as incorrect;
- first-20 VNext Practice exposes non-blank unfamiliar `codeContext`.

Current first-20 observed Practice kinds are:

- `patch-choice`;
- `ordered-sequence`.

The underlying Guided contract also supports `choice`; V1 does not remove that primitive merely because the first-20 rollout does not currently use it as the transfer Practice kind.

Learner-owned `needsReview` is raw review evidence. It is not a score and does not redefine deterministic Practice correctness.

## 5. Verify evidence invariant

For the current V1 first-20 contract:

- canonical Verify owns exactly five questions per lesson;
- every question uses the same `learningUnitId`;
- every question keeps a positive revision and deterministic `correctOptionId`;
- at least one question uses unfamiliar `content.codeContext` for transfer;
- the lesson has at least one diagnostic wrong-answer mapping;
- every `diagnosticOptionMap` entry points to:
  - an existing wrong option;
  - a misconception owned by the same lesson;
- the correct option must never map to a misconception.

This freezes the current first-20 Verify shape. A future need to change the canonical count is a versioned contract change, not an ad-hoc lesson exception.

## 6. Closure / AI boundary invariant

Core lesson closure remains deterministic.

Current boundary:

```text
verificationSession.status === "completed"
        ↓
lesson completion UI is available

Assessment incorrect evidence
+
Guided learner-owned needsReview
        ↓
lesson review projection / "需要复习"
```

The review projection consumes only deterministic/raw evidence already owned by Assessment and Guided.

`aiReviewTarget` has one role: bound optional AI handoff to the lesson's core objective.

AI does **not**:

- decide whether a canonical answer is correct;
- change Guided Practice correctness;
- change the Assessment result;
- mark the lesson complete/incomplete;
- create a mastery percentage;
- block "下一知识点".

Open-ended Ask / Explore remains optional.

## 7. Semantic alignment invariant

Structural validity is necessary but not sufficient.

For every lesson:

```text
objective
↓
mechanism + code evidence
↓
Practice transfer
↓
Verify transfer / diagnosis
↓
review / closure
```

must refer to the same core learning target.

V1 does not pretend this can be fully proven by schema. #315 freezes this invariant after a representative human/engineering pilot; #316 may automate only the deterministic portions and emit review-required warnings for semantic checks it cannot prove.

## 8. Optional authoring

Allowed without changing V1:

- additional source evidence beyond the minimum;
- additional misconception definitions;
- contrast cases;
- extra notes and official references;
- optional AI Ask / Explore affordances;
- richer demo behavior that does not create a new completion requirement.

## 9. Explicit non-goals

V1 does not introduce:

- another lesson catalog;
- another question bank;
- a universal authoring JSON document;
- lesson-specific renderer branches;
- new Practice kinds;
- Evidence persistence;
- deterministic Completion V2;
- AI Diagnosis V1;
- adaptive curriculum;
- mastery scoring.

Those belong to later Epics.

## 10. Freeze / change rule

Once #315 is merged, this contract is frozen for #316 and #317.

If implementation discovers:

- the same structural workaround on a second lesson;
- a legitimate lesson that cannot be represented;
- a required new renderer branch;
- conflict with deterministic Assessment/Guided semantics;

stop the rollout.

Do not patch lessons until green.

A material change to required invariants becomes a new candidate revision (for example `learning-contract-v2`) and must repeat representative pilot validation before freeze.
