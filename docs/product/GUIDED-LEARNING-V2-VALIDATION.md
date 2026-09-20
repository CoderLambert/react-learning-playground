# Guided Learning V2 · Learner Validation Protocol

Issue: #263  
Parent Epic: #262

## Purpose

This document standardizes the first learner-validation round for the five existing runtime Guided Learning units.

The goal is **not** to prove statistical learning gains and **not** to evaluate implementation correctness. The goal is to identify recurring product failures in the current learning loop:

```text
Predict → Experiment → Explain → Practice → Review
```

The key product question is:

> Does the current Guided experience expose an incorrect React mental model, provide evidence that challenges it, and help the learner transfer the corrected model to a different situation?

Do not interpret completion as mastery.

---

## Validation Set

Only these existing Guided units are in scope:

1. `state-snapshot-queue`
2. `rendering-lists-key`
3. `preserving-resetting-state`
4. `not-need-effect`
5. `lifecycle-of-reactive-effects`

Do not add a sixth Guided unit during this validation round.

---

## Target Learner

Prefer learners who:

- are comfortable with JavaScript;
- have written some React code;
- recognize common APIs such as `useState` and `useEffect`;
- may still have unstable React mental models.

Avoid using only:

- complete React beginners, who may mostly expose prerequisite gaps;
- highly experienced React specialists, who may make the activities look easier than they are for the target audience.

Target sample for the first round: **3–5 learners**.

Each learner should complete at least **2 Guided units**, while the full sample must cover all 5 units.

---

## Moderator Rules

The moderator should preserve the learner's reasoning instead of teaching during the task.

### Before the session

Say only enough to establish the task:

> 请把它当成一次 React 学习练习。按界面完成即可。过程中尽量说出你现在在想什么；如果不确定，也直接说出来。

Do not explain:

- the intended mental model;
- the correct prediction;
- what evidence they should notice;
- why a Practice answer is correct;
- how the product team expects Guided Learning to work.

### During the session

Prefer neutral prompts:

- “你现在在想什么？”
- “你预期接下来会发生什么？”
- “刚才这个结果和你的预期一样吗？”
- “你觉得这里哪个现象最重要？”
- “你为什么选这个答案？”
- “如果没有这些选项，你会怎么处理这个问题？”

Avoid leading prompts:

- “是不是因为 snapshot？”
- “你注意到 key 了吗？”
- “Effect 其实不需要，对吧？”
- “这里应该用 functional updater 吧？”

If the learner is blocked, first record the block. Only then provide the minimum hint required to continue, and record that a hint was needed.

---

## Session Flow

### 1. Entry

Observe:

- Does the learner understand what Guided Learning is?
- Do they understand that it is optional?
- Do they know what action starts the flow?
- Does the goal statement tell them what they are about to learn?

Record confusion before explaining anything.

### 2. Predict

Observe:

- Does the learner make a real prediction or guess from wording?
- How confident are they?
- What reasoning or mental model produced the answer?
- Does the question expose a meaningful misconception?

A wrong answer with useful reasoning can be stronger learning evidence than a correct guess.

### 3. Experiment

Observe:

- Does the learner know what to click or manipulate?
- Do they know what output/log/state should be watched?
- Is the important evidence perceptually obvious?
- Does the runtime evidence conflict with the original prediction?
- Does the learner notice the conflict without moderator explanation?

Record separately:

- the evidence the Demo actually presented;
- the evidence the learner actually noticed.

### 4. Explain

Observe:

- Can the learner explain the behavior without copying visible wording?
- Which mental model or vocabulary do they use?
- Do they replace one misconception with another?

Example:

```text
Observation:
Three setCount(count + 1) calls produce 1.

Learner explanation:
"setState is asynchronous."

Interpretation:
The visible result was noticed, but the queue/snapshot mental model may still be missing.
```

Do not automatically label an explanation correct because it sounds plausible.

### 5. Practice

Observe:

- Does the new situation require transfer, or can the learner recognize a familiar keyword?
- Can they justify the selected answer before seeing feedback?
- Would they still know what to do if the answer choices disappeared?
- Is Practice meaningfully different from Predict?

This is the most important place to detect a potential need for Practice V2.

### 6. Review

Observe:

- Can the learner state what they originally misunderstood?
- Do they return to Demo, Notes, or Source?
- Do those resources answer the learner's actual uncertainty?
- Is `Needs Review` meaningful to them?
- Do they know what they would review later?

### 7. AI

If the learner uses AI, record:

- which stage triggered the request;
- what question they asked;
- whether the AI helped them reason or simply supplied an answer;
- whether they attempted the task again after receiving AI help.

AI usage is evidence about the product experience. It is not deterministic correctness evidence.

### 8. Continue

Observe:

- Does the learner want to continue?
- Do they understand what the next lesson represents?
- If they stop, why?

Do not treat “Continue clicked” as proof that the lesson was effective.

---

## Per-Learner Evidence Template

Create one copy for each learner × Guided-unit session.

```md
### Session ID

Anonymous session id:
Date:
Learning Unit:

#### Learner Context

React experience:
Relevant prior knowledge:
Moderator notes:

#### Entry

Understood Guided purpose:
Observed confusion:

#### Predict

Selected response:
Confidence:
Reasoning:
Potential misconception:

#### Experiment

Actions taken:
Expected evidence:
Evidence actually noticed:
Needed moderator hint:
Prediction conflict noticed:

#### Explain

Explanation summary:
Key phrasing / paraphrase:
Mental model inferred:
Remaining misconception / uncertainty:

#### Practice

Selected response:
Reasoning before feedback:
Could solve without options?:
Recognition vs transfer:
Observed friction:

#### Review

Resources opened:
Could identify original misconception?:
Needs Review used:
Review behavior:

#### AI

Used AI:
Trigger:
Question intent:
Reasoning support vs answer substitution:
Retried after AI:

#### Continue

Continued:
Reason:

#### Product Interpretation

Primary issue category:
- content
- activity-model
- demo-evidence
- review
- navigation-ux
- none

Observed problem:
Severity:
Confidence:
Possible follow-up:
```

Do not store unnecessary personal identifiers.

---

## Problem Matrix

After all sessions, consolidate repeated observations here.

| Problem | Units affected | Learners affected | Category | Evidence pattern | Severity | Confidence | Candidate response |
|---|---|---:|---|---|---|---|---|
| _Fill from real sessions_ | | | | | | | |

Use the categories:

- **content** — wording, explanation, examples, lesson framing;
- **activity-model** — the learner behavior being requested is too shallow or inappropriate;
- **demo-evidence** — runtime evidence exists but is hard to notice or interpret;
- **review** — post-attempt evidence does not help the learner reconcile their model;
- **navigation-ux** — entry, progress, continuation, or control semantics are unclear.

Do not create an architecture problem category unless repository evidence shows an actual architecture constraint.

---

## Guided Unit Summary

For each unit, produce a short summary only after real sessions exist.

| Guided Unit | Predict quality | Experiment evidence | Explain quality | Practice transfer | Review value | Main problem |
|---|---|---|---|---|---|---|
| state-snapshot-queue | TBD | TBD | TBD | TBD | TBD | TBD |
| rendering-lists-key | TBD | TBD | TBD | TBD | TBD | TBD |
| preserving-resetting-state | TBD | TBD | TBD | TBD | TBD | TBD |
| not-need-effect | TBD | TBD | TBD | TBD | TBD | TBD |
| lifecycle-of-reactive-effects | TBD | TBD | TBD | TBD | TBD | TBD |

---

## Practice Transfer Decision

After the sample is complete, classify the current Practice behavior as one of:

### YES — Transfer gap is recurring

Use when multiple sessions show that learners can select the Practice answer through recognition while still failing to diagnose or apply the mental model in a different code/runtime situation.

This is evidence for considering #264.

### MIXED — Some lessons need deeper activity, others do not

Use when the problem is lesson-specific.

Do not automatically build a general activity framework. First identify the smallest reusable behavior supported by evidence.

### NO — Current Practice is sufficient for the observed target learners

Use when learners repeatedly demonstrate reasoning and transfer without a more complex activity model.

Do not implement Practice V2 merely because it was previously proposed.

---

## Final #263 Decision

#263 must end with exactly one product decision.

### GO

Choose only when the evidence shows a recurring diagnosis/transfer gap that cannot be addressed adequately through content wording or clearer Demo evidence alone.

Record:

- recurring failure mode;
- affected units;
- required learner behavior;
- smallest activity capability needed by #264.

Do not prescribe a full architecture.

### REVISE-FIRST

Choose when the main failures are caused by:

- unclear prompts;
- weak Demo evidence presentation;
- confusing review wording;
- navigation/interaction friction.

Fix those issues before creating a new activity contract.

### NO-GO

Choose when current Guided Practice is already producing adequate reasoning and transfer for the observed target learners.

Keep #264 blocked.

---

## #264 Input Contract

Only if the final decision is `GO`, provide this minimal handoff:

```md
### Evidence-backed Practice V2 requirements

Recurring learner failure:
Affected Guided units:
Current Practice weakness:
Required learner behavior:
Why content-only revision is insufficient:
Deterministic correctness requirement:
Evidence that must be preserved in Review:
Constraints / non-goals:
```

Candidate implementations such as `patch-choice`, `source-locate`, or `timeline` remain hypotheses until this section is populated from real evidence.

---

## Guardrails

During #263:

- do not modify runtime Guided behavior merely to make validation easier;
- do not implement #264;
- do not open #218 based only on moderator intuition;
- do not open #219 or infer mastery;
- do not report invented learner sessions;
- do not replace real learner evidence with AI simulation;
- do not optimize for completion rate alone.

The output of this validation is a **decision-quality evidence set**, not a success metric dashboard.
