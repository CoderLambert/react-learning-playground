# Learning Contract Migration Governance

This document defines the standard migration lifecycle for cross-lesson changes in react-learning-playground.

It exists to prevent two failure modes:

1. repeating the same product/learning-design decision lesson by lesson;
2. scaling an incorrect contract or migration assumption across many lessons.

## Lifecycle

```text
Baseline
→ Inventory
→ Contract Candidate
→ Representative Pilot
→ Freeze
→ Shared Tooling
→ Canary
→ Atomic Batches
→ Full Audit
→ Compatibility Cleanup
→ New Known-Good Baseline
```

Do not reorder these stages merely to increase short-term throughput.

## 1. Definition of Ready

A batch migration may start only when all required items are true:

- [ ] current `main` / last-known-good SHA recorded;
- [ ] authoritative scope comes from existing repository ownership, not a duplicate lesson list;
- [ ] inventory/capability matrix is current;
- [ ] contract candidate has been exercised against simple / medium / complex / exception paths;
- [ ] contract revision is frozen for the migration;
- [ ] shared renderer/runtime support is merged before lesson batches;
- [ ] deterministic validator exists for machine-provable invariants;
- [ ] golden valid/invalid fixtures pass;
- [ ] semantic review policy is defined;
- [ ] rollback target is known;
- [ ] stop-the-line conditions are recorded;
- [ ] migration scope and out-of-scope surfaces are explicit.

If one item is missing, the full rollout is not Ready.

## 2. Atomic batch rule

A batch must leave `main` deployable.

Do not merge a batch where:

- lesson data is migrated but the shared runtime arrives later;
- a lesson is labeled as a new contract version while required surfaces remain on the old contract;
- the batch relies on an unmerged follow-up to restore tests or browser behavior.

Prefer a smaller independently green batch over a larger partially valid batch.

## 3. Stop-the-line rules

Stop rollout immediately when any of these occurs:

- the same structural workaround is needed on a second lesson;
- a legitimate lesson cannot be represented by the frozen contract;
- a new lesson-specific renderer is required only to preserve the migration;
- the migration changes deterministic Assessment/Guided semantics unexpectedly;
- the validator produces a systemic false positive/false negative;
- duplicate authoring ownership is detected;
- a semantic fingerprint is stale and the change has not been reviewed;
- shared runtime regression appears;
- browser journey breaks on a representative capability path.

Do not continue migrating the remaining lessons while a systemic issue is unresolved.

## 4. Failure classification

Every failed audit is classified before code is changed:

| Class | Meaning | Default action |
|---|---|---|
| E1 | lesson-local content / semantic defect | scoped lesson fix after confirming contract is correct |
| E2 | contract gap | stop; reopen candidate design and representative pilot |
| E3 | shared infrastructure gap | stop; fix shared layer before continuing batches |
| E4 | data/reference defect | repair the authoritative reference/data and rerun validation |
| E5 | validator/tooling defect | fix tooling; do not rewrite lessons to satisfy a broken validator |

A lesson-specific workaround is not an acceptable substitute for classifying the failure.

## 5. Change-risk classes

Use these classes when reviewing a migration diff:

### R0 — mechanical

Examples:

- field move/rename;
- generated formatting;
- schema version marker.

Required review:

- deterministic migration / validator;
- diff inspection.

### R1 — presentation

Examples:

- labels;
- non-semantic layout;
- code-block presentation.

Required review:

- deterministic checks;
- capability-based UI sample if rendering changed.

### R2 — behavior

Examples:

- Practice evaluator;
- retry behavior;
- stage/runtime interaction.

Required review:

- targeted behavioral tests;
- representative browser path.

### R3 — pedagogical semantics

Examples:

- objective;
- mental model;
- mechanism;
- code evidence;
- Practice transfer;
- Verify question/distractor;
- misconception definition.

Required review:

- semantic review;
- semantic fingerprint update only after review;
- deterministic tests must still pass.

### R4 — completion / AI learning authority

Examples:

- lesson completion rules;
- what evidence can block progression;
- AI diagnosis/intervention affecting the core flow.

Required review:

- explicit contract;
- deterministic fallback;
- E2E;
- AI eval where AI behavior is involved;
- separate Epic/change variable whenever possible.

## 6. Semantic-delta policy

A lesson is semantically reviewed only while its recorded fingerprint matches the current authoring.

The fingerprint covers the teaching surfaces frozen by Learning Contract V1.

When the fingerprint changes:

```text
previous review
→ STALE
→ REVIEW_REQUIRED
→ human/engineering semantic review
→ baseline fingerprint update
```

Never update the fingerprint merely to make CI green.

The review must confirm the objective → mechanism/code → Practice → Verify → closure chain remains coherent.

## 7. Rollback / last-known-good rule

Before each canary or batch:

- record the current `main` SHA;
- keep the change isolated in a bounded branch/PR;
- do not stack unrelated product changes on the same migration branch.

If a systemic regression is discovered after merge:

1. stop further rollout;
2. revert to or branch from the last-known-good state when that is safer than forward-fixing;
3. classify the defect;
4. repair Contract/tooling/shared infrastructure;
5. rerun the required representative gate before resuming.

Do not keep building new batches on top of a known-invalid migration state.

## 8. Compatibility rule

A temporary adapter may exist only when it enables safe atomic migration.

Requirements:

- explicit old/new contract versions;
- one normalized runtime boundary;
- no product runtime dependency on migration scripts;
- deletion condition defined at adapter introduction.

Delete temporary compatibility code only after:

- all in-scope lessons are migrated;
- full audit is green;
- required CI has passed on the all-migrated state.

Do not leave a permanent dual authoring model after the migration is complete.

## 9. Parallel work rule

Shared contract/runtime/tooling changes are serialized.

Lesson data batches may run in parallel only after:

- contract is frozen;
- shared infrastructure is merged;
- files/ownership do not overlap materially;
- each batch can pass independently.

Multiple agents should not independently modify the contract, shared renderer or completion semantics during a lesson rollout.

## 10. Definition of Done

A migration Epic closes only when:

- [ ] all in-scope lessons have deterministic audit results;
- [ ] semantic review coverage is complete for high-risk changes;
- [ ] no stale semantic fingerprint remains;
- [ ] no undocumented workaround remains;
- [ ] no unresolved E2/E3/E5 systemic defect remains;
- [ ] structural and referential validation passes;
- [ ] behavioral tests pass;
- [ ] representative capability E2E passes;
- [ ] full required CI passes;
- [ ] out-of-scope lessons were not unintentionally migrated;
- [ ] temporary compatibility cleanup is complete or explicitly tracked;
- [ ] repository documentation reflects the final contract;
- [ ] new known-good `main` SHA is recorded.

## 11. Scope-lock rule

During a migration, newly discovered ideas default to follow-up work unless they are blockers.

Do not mix:

- lesson migration;
- a new Practice type;
- Completion redesign;
- Learner Evidence persistence;
- AI Diagnosis;
- unrelated UI cleanup;

into one batch merely because the files are already open.

One Epic should change one primary architectural variable whenever possible.

## 12. Standard command gate

For Learning Contract V1 migrations:

```bash
npm run lessons:validate
npm run lessons:coverage
npm run verify:required
```

Use browser verification according to the risk class and repository CI policy.

`ERROR` blocks the migration.

`REVIEW_REQUIRED` blocks claiming semantic review coverage, but intentionally does not pretend to be a deterministic schema error.

## 13. Core operating principle

```text
decide once
→ prove on representative cases
→ freeze
→ encode deterministic rules
→ canary
→ scale
→ review only exceptions
```

The goal is not "one huge batch".

The goal is to stop paying the same design and review cost for every lesson while still preventing one bad assumption from being multiplied across the curriculum.
