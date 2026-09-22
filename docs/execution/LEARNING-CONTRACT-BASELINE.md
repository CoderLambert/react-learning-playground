# Learning Contract Baseline / Inventory — #314

## Purpose

This document records the **known-good first-20 authoring baseline** immediately after #304 closed.

It is intentionally descriptive. It does not define a new lesson DSL, registry, mastery model, or AI contract.

Authoritative baseline:

- `main @ 3b0d002289fdfb3d0921825f6e5d87d0f1658ef3`
- PR #312 exact pre-merge head: `a1ac4329ca46e79a41cef53570eade437dfd01d0`
- `React Learning Verify`: PASS
- `Workbench State URL Verify`: PASS
- `Workbench Integration Verify`: PASS

The #314 branch adds only audit/reporting assets. It must not alter lesson authoring content.

## Authoritative surfaces

The inventory is derived from the existing product architecture:

- `src/demos/index.js` — authoritative Learning Unit order, labels, categories and source ownership;
- `src/learning-flow/learningFlowRegistry.js` — Single Learning Flow composition;
- `src/content/conceptModels/*` — mechanism, contrast, code evidence and misconceptions;
- `src/workbench/guidedActivities/*` — deterministic Practice authoring;
- `src/assessment/content/canonicalQuestions/*` — canonical Verify authoring.

No additional registry is introduced.

## Reproducible machine report

Run:

```bash
npm run audit:learning-baseline
```

The command emits JSON to stdout. To save a point-in-time copy:

```bash
npm run audit:learning-baseline > /tmp/learning-contract-baseline.json
```

The report derives the first 20 IDs from `src/demos/index.js` at runtime. It does not use a duplicated first-20 registry as its input.

## First-20 capability matrix

| # | Learning Unit | Category | Practice | Understand code | Verify | AI closure | Notes |
|---:|---|---|---|---|---|---|---|
| 1 | `component-jsx-pure-render` | components | patch-choice | >=2 source excerpts | 5 + code transfer | yes | component/render purity |
| 2 | `props` | components | patch-choice | >=2 source excerpts | 5 + code transfer | yes | representative simple pilot |
| 3 | `children` | components | patch-choice | >=2 source excerpts | 5 + code transfer | yes | composition boundary |
| 4 | `multi-slots` | components | patch-choice | >=2 source excerpts | 5 + code transfer | yes | three-state slot contract |
| 5 | `conditional-rendering` | components | patch-choice | >=2 source excerpts | 5 + code transfer | yes | render branching |
| 6 | `rendering-lists-key` | components | patch-choice | >=2 source excerpts | 5 + code transfer | yes | original Single Flow anchor |
| 7 | `prop-drilling` | components | patch-choice | >=2 source excerpts | 5 + code transfer | yes | props/composition/context contrast |
| 8 | `event-propagation` | render-model | patch-choice | >=2 source excerpts | 5 + code transfer | yes | propagation vs default behavior |
| 9 | `state-snapshot-queue` | render-model | patch-choice | >=2 source excerpts | 5 + code transfer | yes | representative diagnostic anchor |
| 10 | `immutable-state` | render-model | patch-choice | >=2 source excerpts | 5 + code transfer | yes | reference/copy transfer |
| 11 | `render-commit` | render-model | **ordered-sequence** | >=2 source excerpts | 5 + code transfer | yes | only non-patch Practice in first 20 |
| 12 | `state-dry` | state | patch-choice | >=2 source excerpts | 5 + code transfer | yes | derived vs duplicated State |
| 13 | `controlled-uncontrolled` | state | patch-choice | >=2 source excerpts | 5 + code transfer | yes | ownership boundary |
| 14 | `lifting-state-up` | state | patch-choice | >=2 source excerpts | 5 + code transfer | yes | nearest common owner |
| 15 | `preserving-resetting-state` | state | patch-choice | >=2 source excerpts | 5 + code transfer | yes | representative complex identity pilot |
| 16 | `state-reducer` | state | patch-choice | >=2 source excerpts | 5 + code transfer | yes | reducer transition boundary |
| 17 | `context-propagation` | state | patch-choice | >=2 source excerpts | 5 + code transfer | yes | context subscription |
| 18 | `use-reduce-with-context` | state | patch-choice | >=2 source excerpts | 5 + code transfer | yes | split State/Dispatch boundary |
| 19 | `use-ref` | effects | patch-choice | >=2 source excerpts | 5 + code transfer | yes | State vs silent mutable handle |
| 20 | `use-effect-correct-usage` | effects | patch-choice | >=2 source excerpts | 5 + code transfer | yes | latest Batch D / external sync |

### Structural observations

- All first 20 use the shared Single Learning Flow runtime.
- All first 20 have lesson-owned concept models, misconception metadata, visible Practice code context, canonical Verify and lesson-scoped AI closure targets.
- 19/20 use `patch-choice`.
- `render-commit` is the only first-20 `ordered-sequence` Practice path.
- There is no additional first-20 Practice renderer type to cover.
- Existing post-20 Single Learning Flow pilots are intentional: `not-need-effect` and `lifecycle-of-reactive-effects`.
- Unit 21+ is not part of the upcoming Learning Contract migration.

## Representative pilot set for #315

| Role | Learning Unit | Why |
|---|---|---|
| Simple | `props` | Straightforward component lesson; standard patch-choice path; multiple source files. |
| Medium | `state-snapshot-queue` | Established diagnostic anchor with snapshot/queue misconception and retry semantics. |
| Complex | `preserving-resetting-state` | Requires reasoning across Props, component identity, local State, key and reset boundary. |
| Exception path | `render-commit` | Covers the only ordered-sequence Practice path in the first 20. |
| Latest rollout | `use-effect-correct-usage` | Covers the newest Batch D authoring, effects category, external synchronization and cleanup. |

Coverage achieved by the representative set:

- categories: components / render-model / state / effects;
- Practice kinds: patch-choice / ordered-sequence;
- early pilot + mature diagnostic flow + latest rollout;
- straightforward, medium, complex and exceptional authoring shapes.

This is the fixed input set for #315. If #315 discovers the same structural workaround on a second lesson, stop and revisit the candidate contract instead of widening the workaround.

## Known baseline failures / caveats

### Engineering

No known first-20 contract failure remains at the baseline. Required deterministic and full browser verification were green before #312 merged.

During Batch D close-out, duplicate flow authoring and a duplicate partial E2E journey were found and removed before merge. The future validator requirement is tracked in #316: duplicate lesson authoring ownership must be an explicit ERROR.

### Product evidence

#298 external learner validation was waived for the first-20 rollout. This baseline therefore establishes **engineering/product-contract correctness**, not validated learning effectiveness.

Do not reinterpret the baseline as proof that every lesson is pedagogically optimal.

## Scope lock for #314

Allowed:

- inventory/reporting code;
- baseline documentation;
- tests proving that the report derives from authoritative surfaces.

Not allowed:

- lesson content rewrites;
- new Practice types;
- new renderer branches;
- Completion semantics;
- Learner Evidence persistence;
- AI Diagnosis changes;
- unit 21+ rollout.

## Handoff to #315

#315 may start when #314 is merged and its report is green.

#315 must treat this inventory as observed input, then define a **candidate** contract, pilot it on the five representative lessons, and freeze only after those pilots pass.
