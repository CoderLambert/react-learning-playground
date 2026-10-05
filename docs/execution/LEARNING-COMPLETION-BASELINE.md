# Learning Completion Baseline / Closure Ownership — #332

**Baseline:** `main @ 49df03e3557f0b789aee77dbe23ca84d610cd166`  
**Input:** frozen `learner-evidence-v1` from #327 / #328  
**Scope:** descriptive only; no runtime semantics, persistence, correctness or AI-authority changes.

## 1. Baseline finding

The product currently has several independent facts that are all close to “completion”, but they are not equivalent:

```text
Guided lifecycle
+ Guided Practice correctness
+ Guided needsReview
+ Assessment lifecycle
+ persisted Assessment correctness
+ local correction UI
+ lesson Review projection
+ path navigation
        ↓
current UI behavior
```

There is no canonical lesson-level `Evidence -> state + nextAction` mapping yet. That is the E2 Contract gap for #333.

## 2. Ownership matrix

| Fact / signal | Owner | Durable? | Current meaning | Classification |
|---|---|---:|---|---|
| Assessment `session.status` | Assessment | yes | `completed` exposes lesson completion UI | lifecycle / current gate |
| Assessment `attempt.correct` | Assessment attempt | yes | completed Review counts wrong answers | deterministic correctness |
| local “再次验证 / 已纠正” | Assessment UI | no | remediation after a formal wrong answer | presentation only |
| local teach-back text | Assessment UI | no | optional self-explanation / optional AI check | presentation only |
| Guided `sessionStarted/sessionCompleted` | Guided snapshot | yes | workflow position / Review reached | lifecycle, not correctness |
| Guided `practiceResponse` | Guided session | yes | committed transfer response | submitted evidence |
| Guided Practice `outcome.correct` | existing Guided evaluator | derived | deterministic Practice result | correctness evidence |
| Guided `needsReview` | learner-owned Guided state | yes | lesson Review reason | review evidence, not correctness |
| `learningReviewProjection.needsReview` | derived lesson view | no separate store | Assessment wrong count or Guided needsReview | review signal |
| Single Learning Flow stage | UI state | no lesson fact | Understand / Practice / Verify | presentation/navigation |
| Verify `session.status === "completed"` | Assessment consumed by flow | yes | renders lesson completion card | current closure-card gate |
| `nextId` | learning path | derived | actual next-unit navigation capability | navigation |
| AI conversation/review | AI assistant | separate | optional help | no correctness/completion authority |

### Ownership conclusions

1. Guided “completed” means the workflow reached Review with a committed Practice response. The reducer does not require that response to be correct.
2. Verify “completed” means the Assessment session finished. A completed session may contain persisted wrong attempts.
3. Review is advisory today. `needsReview` does not disable “下一知识点”.
4. A local successful correction does not replace the persisted formal wrong attempt and does not create a durable resolution Evidence record.
5. Navigation capability is separate from lesson closure.
6. AI is outside the closure authority boundary.

## 3. Current closure behavior

### B1 — no evidence

- Guided is `not_started`; Review is clean.
- No completion card exists because Verify is not completed.
- The learner can start Practice, but stage navigation can also enter Verify directly.
- Understand → Practice → Verify is therefore not a hard evidence gate today.

### B2 — Guided started but incomplete

- Guided lifecycle is `in_progress`.
- Committed prediction / observation / explanation may exist; no Practice response means no Practice correctness evidence.
- Reload resumes persisted Guided state.
- No lesson-level Completion state is derived from this partial progress.

### B3 — Guided complete / correct Practice

- Guided `sessionCompleted = true`.
- Practice outcome is deterministically `correct: true`.
- “进入验证” is enabled in the Single Learning Flow.
- Current lesson closure does not explicitly consume this correctness fact.

### B4 — Guided complete / incorrect Practice

- Guided `sessionCompleted = true` even when Practice outcome is `correct: false`.
- Retry is available, but “进入验证” is also available.
- Lesson Review does not automatically become true from Guided Practice incorrectness; it only consumes Assessment wrong-count and learner-owned Guided `needsReview`.

This is the strongest current E2 gap: lifecycle completion, correctness, review and progression are separate, but no frozen Completion rule maps them.

### B5 — Guided needsReview

- `needsReview` persists and projects into lesson Review.
- The UI offers “回到理解 / 回顾证据”.
- It does not block Verify or the final next-lesson action.

### B6 — Verify incomplete

- Assessment session is not completed, so lesson completion UI is absent.
- Formal submitted attempts remain authoritative.
- Known misconception remediation can occur inside the question UI.
- Lesson stage navigation remains separately available.

### B7 — Verify complete / all correct

- Assessment session is completed and all formal attempts are correct.
- With Guided needsReview false, Review is clean.
- UI shows “本节验证完成” and offers “下一知识点”.

This is the cleanest current closure path.

### B8 — Verify complete / formal wrong answer later corrected locally

- The formal wrong attempt remains persisted.
- The completed review still counts it as incorrect.
- “再次验证” calls the deterministic question evaluator locally and stores correction state only in the component.
- Teach-back is also local and explicitly does not change the formal result.
- UI may show “已纠正”, but lesson Review remains true from the original wrong evidence.
- Because Verify is completed, the completion card still appears and “下一知识点” remains available.

Do not reinterpret this as a durable “misconception resolved” event: frozen Evidence V1 does not own one.

### B9 — after reload

- Assessment sessions and formal attempts reload from the Assessment owner.
- Guided lifecycle, committed Practice and needsReview reload from the Guided snapshot.
- local correction / teach-back UI state does not persist.
- The original formal wrong attempt therefore remains the durable review evidence after reload.

### B10 — AI never opened

The core path remains deterministic and usable:

```text
Understand -> Practice -> Verify -> feedback/review -> navigation
```

AI state is not read by the current closure gate or Review projection.

## 4. Current semantic conflations

### “completed” has multiple meanings

- Guided completed = workflow reached Review.
- Assessment completed = formal Verify session ended.
- lesson completion card = currently exposed from Assessment completion.

None alone means “all required evidence is correct and no review remains”.

### “verified” is not “clean”

A completed Verify can contain wrong attempts. The UI already distinguishes clean verification from “已验证，但还有需要复习的点”, but both branches still allow next-lesson navigation.

### “needs review” is not “blocked”

Review is advisory today. #333 must explicitly decide whether that is intended Completion semantics instead of inheriting it accidentally.

### “corrected” is not durable resolution

The local correction loop preserves the first formal error. #333 cannot derive source-level resolution from local UI state.

## 5. Current deterministic next actions

| Situation | Current action(s) | Missing canonical mapping? |
|---|---|---|
| no Guided evidence | start Practice | yes; stage nav can bypass |
| Guided in progress | resume current Practice step | lesson-level mapping missing |
| Guided Review | retry, mark review, inspect resources, enter Verify | yes |
| Guided Practice incorrect | retry **or** enter Verify | **yes** |
| Verify wrong / known misconception | counter-evidence -> local retry; optional teach-back/AI | durable resolution not owned |
| Verify incomplete | answer / next question | mostly explicit |
| Verify complete / clean | next lesson | explicit |
| Verify complete + Review | review evidence **or** next lesson | **yes: no canonical priority** |
| no `nextId` | handler returns false | **yes: terminal nextAction is not explicit** |

## 6. Gap classification

### E1 Content

No content rewrite is required. Representative lessons already passed semantic alignment.

### E2 Contract — primary gap

No frozen lesson-level contract currently defines:

- required evidence for closure;
- how Guided incorrectness affects state/nextAction;
- how Assessment wrong evidence affects verified vs complete;
- how learner-owned needsReview affects state/nextAction;
- how later Assessment sessions relate to earlier wrong sessions;
- how local correction is represented without fabricating resolution;
- one canonical nextAction per state;
- terminal-path behavior.

#333 owns these semantics.

### E3 Infrastructure

No infrastructure gap is proven. Existing Assessment, Guided and Evidence V1 seams are sufficient to pilot a pure Completion derivation.

### E4 Data/reference

Same-session Assessment correction is not a second persisted formal attempt or durable resolution event. This is a real source limitation and must not be hidden by invented Completion facts.

### E5 Tooling

Required-test discovery already covers deterministic `tests/**/*.test.mjs`. #332 adds focused regression coverage only; no production tooling change is required.

## 7. Representative scenarios for #333

| Scenario | Representative path | Boundary |
|---|---|---|
| C1 clean patch-choice | `props` | Guided correct + Verify all correct + no Review |
| C2 clean ordered-sequence | `render-commit` | same candidate works for non-patch Practice |
| C3 Guided incorrect | `props` | workflow complete while deterministic Practice outcome is false |
| C4 learner-owned review | `props` | otherwise-correct evidence with needsReview true |
| C5 persisted Verify misconception | `state-snapshot-queue` | formal wrong remains after local correction succeeds |
| C6 reload | any pilot | same durable evidence derives same result after reload |
| C7 AI absent | any pilot | state/nextAction remains deterministic |
| C8 terminal path | final path unit | explicit terminal nextAction, not inert next-button behavior |

The set covers both current first-20 Practice kinds and a corrected-misconception path.

## 8. Handoff constraints for #333

The candidate must:

- consume frozen `learner-evidence-v1`;
- remain a pure deterministic derivation;
- reuse source-owned correctness instead of recomputing it;
- preserve original incorrect evidence;
- keep local correction non-authoritative unless a later evidence contract explicitly changes;
- keep AI/network outside correctness and Completion;
- avoid a Completion store unless a pilot proves a hard requirement;
- expose explicit reasons and deterministic `nextAction`;
- distinguish lifecycle, correctness, review, closure and routing capability;
- support patch-choice and ordered-sequence without lesson-specific exceptions.

## 9. Exit decision

#332 result: **PASS for candidate-contract work**.

No E1 rewrite, E3 infrastructure change or E4 persistence expansion is required before #333. The next task should solve the E2 mapping explicitly rather than treating today's UI conflations as the future contract.
