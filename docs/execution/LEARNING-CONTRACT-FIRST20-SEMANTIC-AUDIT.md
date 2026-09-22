# First-20 Learning Contract Semantic Audit — #317

**Contract:** `learning-contract-v1`  
**Tooling baseline:** `main @ 61caa5ecebc44b4d7f60b2b210c0d45fcda9e887`  
**Result:** PASS

This audit reviews semantic alignment in addition to the deterministic validation shipped by #316.

The review question for every lesson is:

```text
objective
→ mechanism + real code evidence
→ Practice transfer
→ Verify transfer / diagnosis
→ deterministic review / closure
```

All five stages must teach or test the same core target.

## Canary result

The representative canary inherited from #314/#315 remains the capability coverage set:

| Role | Learning Unit | Practice path | Result |
|---|---|---|---|
| Simple | `props` | patch-choice | PASS |
| Medium | `state-snapshot-queue` | patch-choice | PASS |
| Complex | `preserving-resetting-state` | patch-choice | PASS |
| Exception path | `render-commit` | ordered-sequence | PASS |
| Latest rollout | `use-effect-correct-usage` | patch-choice | PASS |

The frozen V1 contract and #316 validator passed this set without a custom renderer, lesson-specific contract exception, or deterministic-semantics change.

## Full first-20 semantic matrix

| # | Learning Unit | Core semantic chain | Practice transfer | Verify focus | Result |
|---:|---|---|---|---|---|
| 1 | `component-jsx-pure-render` | inputs → pure component calculation → JSX description → commit | remove render-time external mutation | purity, JSX description, mutation boundary, render ≠ DOM commit | PASS |
| 2 | `props` | parent-owned source → read-only Props → render-time derivation | remove copied derived State | ownership, defaults, derivation | PASS |
| 3 | `children` | caller-owned structure → children → reusable shell | move business content out of the container | children meaning, composition boundary, stable semantic props | PASS |
| 4 | `multi-slots` | undefined → default / node → override / false → hide | repair falsy-collapse slot logic | explicit three-state API semantics | PASS |
| 5 | `conditional-rendering` | business state → branch priority → JSX | remove derived `isEmpty` State/Effect | status modeling, early return, derived condition, `&&` caveat | PASS |
| 6 | `rendering-lists-key` | stable key → component identity → local State ownership | use stable business identity for reorderable rows | identity, reorder, State preservation/reset | PASS |
| 7 | `prop-drilling` | ownership + real consumers → Props / Composition / Context | remove meaningless intermediary business dependency through composition | dependency visibility, composition, Context threshold | PASS |
| 8 | `event-propagation` | capture → target → bubble; browser default is separate | preserve navigation while stopping parent click propagation | propagation vs default behavior, handler passing | PASS |
| 9 | `state-snapshot-queue` | current snapshot → queued replace/updater requests → queue processing → next render | use updater semantics on unfamiliar code | snapshot, replace/updater, queue semantics | PASS |
| 10 | `immutable-state` | read old snapshot → copy changed path → submit next value | copy the nested changed object rather than mutate a shared item | shallow copy, reference identity, old-snapshot integrity | PASS |
| 11 | `render-commit` | trigger → render → commit → browser paint | order the update chain | render/commit/paint separation | PASS |
| 12 | `state-dry` | independent facts → derive the rest → smaller valid state space | remove duplicated derived State + sync Effect | derived values, duplicate entities, mutually exclusive status | PASS |
| 13 | `controlled-uncontrolled` | authority → controlled value or internal State; intent → onChange | remove controlled-prop mirror State | authority, `defaultValue`, intent vs decision | PASS |
| 14 | `lifting-state-up` | one shared fact → nearest common owner → props down / callbacks up | lift duplicated sibling `selectedId` | single source of truth, nearest owner, callback intent | PASS |
| 15 | `preserving-resetting-state` | position + type + key → identity → preserve/reset State | repair reset boundary with stable business key | preservation, reset, narrow identity boundary | PASS |
| 16 | `state-reducer` | event input → Action → pure reducer → next State | move nondeterministic time capture to event/action boundary | reducer purity, dispatch semantics, reducer threshold | PASS |
| 17 | `context-propagation` | Provider value → useContext subscription → fresh consumer render | narrow a consumer's Context subscription boundary | Context subscription, memo boundary, no field selector | PASS |
| 18 | `use-reduce-with-context` | reducer transitions + Context distribution → intentional subscription boundaries | move dispatch-only consumer to Dispatch Context | reducer vs Context responsibility, State/Dispatch split | PASS |
| 19 | `use-ref` | visible UI fact → State / silent mutable handle → Ref / DOM node after commit | move visible click count from Ref to State | State vs Ref, rerender semantics, DOM ref timing | PASS |
| 20 | `use-effect-correct-usage` | commit → Effect setup → external system → symmetric cleanup | add matching external-listener cleanup | external synchronization, cleanup, event command vs Effect | PASS |

## Audit classification

No finding required lesson modification.

| Class | Meaning | Findings |
|---|---|---:|
| E1 | lesson-local content error / semantic mismatch | 0 |
| E2 | frozen Contract gap | 0 |
| E3 | shared infrastructure gap | 0 |
| E4 | data/reference defect | 0 |
| E5 | validator/tooling defect | 0 in final #317 audit |

A prior #316 CI failure caused by an unused import was classified and fixed as E5 before #316 merged; it did not require content changes.

## Closure boundary

The semantic review also retains the frozen #315 boundary:

- canonical Assessment correctness remains deterministic;
- Guided Practice correctness remains deterministic;
- completed Verify session exposes lesson completion UI;
- Assessment incorrect evidence and learner-owned Guided `needsReview` produce review state;
- optional AI is scoped by `aiReviewTarget` but does not own correctness or completion;
- no mastery percentage is introduced.

## Review invalidation

A one-time PASS is not permanent evidence.

#317 adds semantic fingerprints over:

- Flow objective/scope authoring;
- Concept mechanism, misconceptions and code evidence;
- the actual source excerpts referenced by Understand;
- Guided authoring;
- canonical Verify authoring.

If the fingerprint changes, the stored review no longer matches the lesson and the validator must return that unit to `REVIEW_REQUIRED`.

This is intentionally conservative: a non-semantic authoring edit may occasionally trigger another review, but a semantic teaching change must never remain silently marked as reviewed.
