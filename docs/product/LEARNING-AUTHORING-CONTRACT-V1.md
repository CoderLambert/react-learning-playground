# Learning Authoring Contract V1 — Candidate

Status: **FROZEN — 2026-09-22, for #313 / #316 / #317 execution**

Contract id: `learning-authoring-contract/v1`

Parent: #313  
Pilot / freeze issue: #315  
Observed baseline: `main @ b968e8364d1883a43c2fc7c748860c3ac300453e`

## Purpose

This contract defines what the existing Single Learning Flow authoring surfaces must agree on.

It is a **validation contract over existing ownership**, not:

- a second Learning Unit registry;
- a universal lesson DSL;
- a new persistence domain;
- a mastery model;
- an AI-owned correctness/completion model.

Authoritative Learning Unit identity and source ownership remain in `src/demos/index.js`.

## Existing surface ownership

| Surface | Existing owner | Contract role |
|---|---|---|
| Learning Unit identity/source | `src/demos/index.js` | authoritative unit id and source files |
| Flow composition | `learningFlowRegistry` | objective, stage copy, bounded AI review target |
| Understand | lesson-owned concept model | mechanism, contrast, misconception, source-backed code evidence |
| Practice | lesson-owned Guided definition + shared Guided runtime | deterministic task and raw learner evidence |
| Verify | canonical Assessment questions + Assessment runtime | deterministic formal correctness and misconception correction |
| Review | Assessment review + Guided `needsReview` projection | factual reason to revisit evidence |
| Explore / Ask AI | existing AI surface | optional explanation/exploration only |

## Required invariants

### C1 — Identity coherence

For a contracted lesson, all owned surfaces must resolve to the same authoritative `learningUnitId`:

```text
Learning Unit
= Flow
= Concept Model
= Guided Activity
= Canonical Verify questions
```

A duplicate owner for the same semantic surface is invalid. #316 must make duplicate ownership a deterministic ERROR.

### C2 — Understand is mechanism + real code evidence

Required:

- nonblank lesson objective;
- nonblank core mental model and decision rule;
- lesson-owned mechanism representation;
- lesson-owned contrast representation;
- at least one misconception definition;
- at least two bounded source-backed code-evidence excerpts for the VNext contract;
- evidence must resolve through the authoritative Learning Unit source ownership.

Code is learning material, not a separate fourth stage.

### C3 — Practice remains deterministic

Practice uses the existing Guided five-step runtime:

```text
Predict
→ Experiment
→ Explain
→ Practice
→ Review
```

Supported response kinds are the existing deterministic contract only:

- `choice`;
- `patch-choice`;
- `ordered-sequence`.

For current VNext lessons whose transfer depends on code, Practice requires visible `codeContext`.

Practice correctness is evaluated by the shared deterministic evaluator. Free-text explanation remains raw learner evidence and is not silently scored.

### C4 — Practice retry ownership

The current Practice contract does **not** require an in-place correction loop after one wrong Practice submission.

Current ownership is:

```text
Practice submission
→ deterministic outcome in Review
→ "重新实践"
→ START_OVER
→ new Guided run
```

The first run remains a factual session result. The retry starts a new Guided run.

Do not add lesson-specific retry reducers to satisfy this contract.

### C5 — Verify owns formal misconception correction

Current VNext Verify owns exactly five product canonical deterministic questions per lesson.

Required:

- all questions match the authoritative `learningUnitId`;
- canonical provenance remains explicit;
- evidence references remain present;
- at least one question requires unfamiliar-code transfer;
- diagnostic distractors may map to lesson-owned misconceptions;
- every diagnostic mapping must reference a real option and a real misconception;
- the correct option may never map to a misconception.

Formal correction belongs to the Assessment UI/runtime:

```text
wrong formal attempt
→ misconception-specific counter-evidence
→ learner chooses retry
→ corrected judgement
→ optional teach-back / AI check
```

The first formal error remains historical evidence; correction does not rewrite it.

### C6 — Review is factual, not mastery

The lesson-level Review projection may consume:

- incorrect count from the latest completed Assessment review;
- learner-controlled Guided `needsReview`.

It may expose factual reasons such as:

- assessment incorrect;
- guided needs review.

It must not synthesize:

- mastery percentage;
- React IQ;
- skill score;
- hidden AI correctness.

### C7 — Current closure boundary

V1 deliberately distinguishes **verification session completion** from future mastery/completion semantics.

Current deterministic boundary:

- an Assessment session may become `completed`;
- completed verification may still project `needsReview`;
- optional AI review does not alter the saved formal result;
- AI availability must not be required to finish deterministic Practice or Verify.

A richer lesson-level Completion Contract is explicitly deferred to #319.

### C8 — AI scope is bounded and optional

Each contracted lesson has a nonblank `aiReviewTarget` to bound optional reasoning review to the lesson core objective.

AI may:

- explain;
- compare;
- inspect learner reasoning;
- support optional teach-back.

AI may not:

- change Practice correctness;
- change canonical Verify correctness;
- erase incorrect attempts;
- create mastery;
- become required for deterministic completion.

Semantic quality of `aiReviewTarget` cannot be proven by schema alone; #316 should report it as semantic review territory rather than pretend a string-length check proves pedagogical quality.

## Representative pilot

The #314 capability inventory selected:

| Role | Unit |
|---|---|
| simple | `props` |
| medium / diagnostic anchor | `state-snapshot-queue` |
| complex identity | `preserving-resetting-state` |
| exceptional Practice renderer | `render-commit` |
| latest rollout / effects | `use-effect-correct-usage` |

The pilot must prove:

1. all surfaces share identity;
2. Understand has mechanism/contrast/code evidence;
3. Practice can deterministically produce an incorrect outcome;
4. whole-session Practice retry resets raw Guided evidence;
5. the new run can deterministically produce the correct outcome;
6. Verify has canonical code transfer;
7. diagnostic distractors resolve to real misconceptions;
8. wrong and correct Verify choices remain deterministic;
9. Review projection remains factual;
10. no AI call is required anywhere in the deterministic test path.

## Valid examples

Valid:

- a `patch-choice` lesson whose expected option is evaluated by stable id;
- an `ordered-sequence` lesson using one complete stable-id permutation;
- a wrong Verify option mapped to one lesson-owned misconception;
- a completed Assessment with one formal error that projects `needsReview`;
- a learner who skips optional AI and still completes deterministic Verify.

## Invalid examples

Invalid:

- a Flow id pointing to another lesson's concept model;
- duplicated flow ownership silently relying on JavaScript last-write-wins;
- free text sent to an LLM to decide canonical correctness;
- a diagnostic option referencing a nonexistent misconception;
- a Practice renderer added for one lesson when an existing deterministic kind already expresses the task;
- treating `verificationSession.status === "completed"` as proof of mastery;
- blocking lesson progression because optional AI review is unavailable.

## Optional / extension boundary

Allowed as optional, non-contract-blocking detail:

- additional source evidence beyond the minimum;
- lesson-specific wording;
- additional misconception definitions;
- different mechanism-map row counts;
- different contrast-case counts;
- optional official docs / Notes / Explore AI.

Any new Practice response kind, new correctness semantics, new completion semantics or second authoring registry requires a separate architecture decision. It must not be smuggled into a lesson migration.

## Stop-the-line rules

Before freeze, revise this candidate if:

- the same workaround is required by a second pilot lesson;
- a legitimate lesson cannot fit without custom runtime branching;
- an invariant conflicts with existing deterministic Assessment/Guided semantics;
- a proposed requirement forces unrelated lesson rewrites;
- the pilot reveals ownership ambiguity between Practice and Verify.

After a material revision, rerun all five pilots.

## Freeze evidence

Candidate validation head:

- PR #322 candidate head: `83abd36534695d0dba04e104e1549903ce913fac`;
- representative deterministic pilot: PASS;
- React Learning Verify: PASS;
- Workbench Integration Verify: PASS;
- repeated structural workaround: none;
- new product runtime branch / registry / DSL: none.

Decision: **FREEZE `learning-authoring-contract/v1` for the remainder of #313.**

From this point through #316 and #317:

- tooling may implement these invariants;
- audit findings may classify content/data/tool defects;
- the contract must not be silently widened or weakened.

If a true Contract Gap is discovered, stop rollout, explicitly reopen the contract decision, revise the contract, and rerun the representative pilot before continuing.
