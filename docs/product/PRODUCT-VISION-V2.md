# Product Vision V2 — Single Learning Loop

- Status: Current product direction
- Observed base: `main@247b974ece2f4927d76a1c240a276c072527b8ea`
- Scope: product model and prioritization
- Companion UX spec: `docs/product/LEARNING-EXPERIENCE-V2.md`

## 1. Why this reset exists

The repository already contains substantial learning capability:

- 58 runnable Learning Units / Demos
- 58 MDX Notes
- semantic Source inspection
- AI learning assistant
- deterministic Assessment with persisted attempts and review
- five runtime Guided Learning units
- chapter checkpoints and exercises
- official documentation references
- Real Integration Labs

The product problem is no longer lack of capability. The problem is that these capabilities are exposed as parallel learning choices. A learner must decide whether to use Demo, Notes, Source, AI, Assessment, Guided Learning, official docs, checkpoint, or a lab, and must also infer when a lesson is “done”.

The product should stop asking learners to assemble their own learning method from tools.

## 2. Product promise

> Help a developer build a correct React mental model, verify it through observable behavior, receive actionable feedback when the model is wrong, and know what to do next.

React and ecosystem official documentation remains the authority for complete definitions and reference material.

React Learning Playground owns the learning orchestration:

```text
Understand
   ↓
Practice
   ↓
Verify
   ↓
Wrong / uncertain?
   ├─ yes → Review → return to evidence
   └─ no  → next Learning Unit
```

The primary user-facing learning model is **Understand → Practice → Verify**.

Review is not a fourth mandatory lesson mode. It is generated from evidence when the learner has something worth revisiting.

## 3. Core jobs to be done

A learner should always be able to answer:

1. What am I learning now?
2. What should I do next?
3. What observable React behavior proves the concept?
4. Did my answer or decision hold up?
5. If not, what exactly should I revisit?
6. When I return later, what should I continue or review?

## 4. User-facing information architecture

The product has three primary intents:

```text
Continue Learning
Review
Browse Knowledge
```

### Continue Learning

The default product experience. It follows the ordered Learning Path and presents one Learning Unit as a coherent task.

### Review

A derived queue from real learning evidence such as:

- incorrect Assessment attempts;
- Guided `needsReview`;
- future deterministic coding/activity failures.

V2 does not require spaced repetition scheduling or a mastery engine.

### Browse Knowledge

Free exploration for users who already know what they want:

- all Learning Units;
- search;
- Notes;
- Demos;
- official references;
- Source.

“Browse everything” is valuable, but it is not the default first-time learning path.

## 5. Capability ownership

Existing capabilities remain; their product role changes.

| Capability | V2 role |
| --- | --- |
| Notes | Understand content, concise mental model and decision rules |
| Official docs | Authoritative deep reading from Understand / Review |
| Demo | Observable evidence in Understand / Practice |
| Guided Learning | Internal Practice orchestration for high-cognitive-load lessons |
| Source | Contextual evidence / debugging aid |
| AI | Optional contextual help and rubric-assisted reasoning feedback |
| Assessment | Verify through deterministic questions |
| Chapter Checkpoint | Cross-unit synthesis, not a second question bank |
| Integration Lab | Practice for framework/integration topics |
| Continuous reading | Browse/reference workflow, not the default learning journey |

Users should not need to understand these as competing “learning modes”.

## 6. Lesson stages

### Understand

Goal: build the minimum correct mental model before practice.

Typical assets:

- learning objective;
- concise mental model;
- one observable example;
- common misconception;
- engineering decision rule;
- optional official deep reading.

Notes should not compete with official docs on completeness.

### Practice

Goal: force an active decision or observable action.

Practice recipe varies by topic. Examples:

- simple Demo interaction;
- Predict → Experiment → Explain → Transfer;
- deterministic patch choice;
- source/timeline reasoning;
- Real Integration Lab.

A single global Practice template is explicitly not required.

### Verify

Goal: retrieve and apply the concept without relying on the preceding explanation.

Default verification should be available without AI.

Canonical product-authored questions are distinct from AI-generated follow-up questions.

## 7. Evidence, not fake mastery

V2 does not introduce a numeric mastery score.

The product should display factual evidence such as:

```text
Lists & Key

Practice          completed
Latest assessment 2 / 3
Needs review      component identity
Coding evidence   none
```

A learner may be marked `Needs Review` when there is concrete evidence, but a single successful action must not be presented as proof of “mastery”.

Issue #219 remains the authority for any future Skill / Evidence / Mastery domain decision and remains gated by its existing Start Gate.

## 8. AI boundary

The core learning journey must work without an AI provider.

AI may:

- compare an explanation against a rubric;
- point out covered concepts, omissions, and likely misconceptions;
- generate extra practice after canonical content;
- explain current Note / Source / official context.

AI must not become the sole correctness oracle for deterministic Assessment or future mastery claims.

## 9. Relationship to Guided Learning V2 issues

This product reset does **not** invalidate #262–#265.

It changes their product placement:

- Guided Learning is no longer presented as a peer to Notes / Assessment / official docs.
- Guided is a Practice implementation for lessons that benefit from active mental-model work.
- #263 remains valuable because practice quality still requires learner evidence.
- #264 / #265 remain blocked by their existing gates.
- This V2 must not silently bypass those gates by inventing a second Practice engine.

Likewise:

- #218 Quick Check remains DEFERRED.
- #219 Skill / Evidence / Mastery remains DEFERRED / DECISION.

## 10. Product invariants

- `src/demos/index.js` remains the authoritative Learning Unit registry.
- Existing Demo runtime remains the observable React behavior source.
- Existing Assessment deterministic correctness semantics remain intact.
- Guided raw learner responses remain raw facts; they are not rewritten into mastery.
- Official documentation remains a reference/deep-reading surface, not duplicated course prose.
- AI is optional for the core journey.
- No Browser IDE / Monaco / arbitrary package sandbox is required for V2 launch.
- Do not expand a new UX pattern to all 58 units before a vertical slice is validated.
- Required CI and persistence compatibility must not be weakened for UX convergence.

## 11. First vertical slice

The first product slice is `rendering-lists-key`.

It is intentionally selected because it already has:

- a strong observable Demo;
- official React references;
- Guided Learning;
- semantic Source;
- a clear mental-model misconception;
- deterministic verification opportunities.

The slice should prove that a learner can complete:

```text
Understand
→ Practice
→ Verify
→ receive targeted feedback
→ enter Review when needed
→ continue
```

without needing to understand the internal tool architecture.

## 12. Rollout gates

Do not migrate the full course from design intent alone.

### Gate A — Vertical slice usability

Confirm that a learner can identify the next action and complete the loop without product coaching.

### Gate B — Feedback usefulness

Incorrect verification must identify a specific concept/evidence target rather than merely say “wrong”.

### Gate C — Return value

A returning learner must be able to see what to continue or review.

Only after these are credible should the pattern be extended first to `state-snapshot-queue` and `not-need-effect`, then to broader lesson families.

## 13. Non-goals for the first wave

- redesign all 58 Learning Units;
- introduce mastery percentages;
- implement spaced repetition;
- create a second question store;
- create a second Guided engine;
- replace official docs with copied content;
- introduce a full online IDE;
- turn AI into mandatory infrastructure;
- rebuild Assessment persistence;
- mass-delete existing Workbench capabilities.

## 14. Success test

The V2 direction is useful only if a learner no longer needs an explanation of the product itself.

For the vertical slice, a target learner should be able to answer through use:

- “What do I do first?”
- “What happens next?”
- “Was I right?”
- “What did I misunderstand?”
- “Where do I go to fix it?”
- “What should I do when I come back?”
