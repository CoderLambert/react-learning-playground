# Automation & Agent Orchestration Playbook

> Scope: ChatGPT scheduled/recurring execution and Codex parent/sub-agent orchestration for this repository.
>
> Goal: increase useful throughput without trading away correctness, reviewability, or merge stability.

This document does **not** define a second task contract. For Issue-backed work, `issue-rule.md` is the canonical source for Problem, Target, Invariants, Execution Scope, Acceptance Criteria, Validation, Dependencies, and Scope Drift. This playbook only defines how that contract is dispatched, parallelized, resumed, integrated, and handed off.

Core principle:

> **Orchestration must constrain coordination risk without freezing implementation. Parallelism is justified only when its expected throughput gain exceeds coordination, review, and integration cost.**

---

## 1. Source-of-truth hierarchy

For Issue-backed work, consume information in this order:

```text
repository / architecture rules
        ↓
latest Issue normative contract
        ↓
latest recorded [DECISION] / Scope Drift revision
        ↓
Working Direction / historical background
```

The Issue normative contract is primarily:

- Target;
- Invariants;
- Execution Scope;
- Acceptance Criteria;
- Validation;
- Dependencies.

`Working Direction` is advisory. A sub-agent must not silently turn it into a frozen implementation requirement.

When implementation evidence invalidates an Issue assumption, follow `issue-rule.md` Scope Drift Protocol. The orchestrator must not preserve a known-wrong plan merely to keep the original lane graph intact.

For ad-hoc work that has no Issue, create only the lightweight equivalent needed to execute safely: outcome, invariants if any, expected/sensitive scope, validation, and real blockers. Do not create process artifacts only to satisfy this document.

---

## 2. Shared vocabulary

### Work item

A user-visible or engineering outcome with an explicit completion condition. An Issue may contain one work item or a small coherent set sharing ownership and acceptance.

### Lane

A durable ownership boundary used by one automation or one implementation agent. A lane should contain related work that can advance without repeatedly crossing another lane's write or contract ownership.

### Wave

A set of lanes that may proceed concurrently under a known execution base and current contract revision.

### Conflict domain

Parallel safety is not determined only by file overlap. Treat all of these as conflict domains:

- **file ownership** — same files or directories;
- **contract ownership** — component APIs, service interfaces, tool schemas, public exports;
- **state ownership** — shared state machines, URL state, persistence semantics, lifecycle ownership;
- **data/schema ownership** — persisted shapes, events, payloads, migrations;
- **integration ownership** — application shell, registries, composition roots, workflows, global configuration.

> **Zero Git conflict does not imply parallel safety.** Two lanes that edit different files can still be unsafe if they independently change the same semantic contract.

### Integration surface / hotspot

A shared or high-risk surface where multiple domains compose. Typical examples in this repository include:

- application shell / `App.jsx`;
- route, demo, or content registries;
- shared URL/state synchronization;
- package manifest / lockfile;
- global CSS or theme primitives;
- shared workflow/test configuration;
- public or persisted contracts.

### Integration owner

The single writer responsible for an integration hotspot during a wave.

---

## 3. Dispatch Gate — decide whether multi-agent work is worth it

Do not start with “how many agents can we use?”. Start with “does delegation increase verified throughput?”.

Use this gate before spawning sub-agents or creating scheduled lanes.

### Mode A — Single writer

Default when:

- the task is small or owner-local;
- most changes share one state/contract boundary;
- implementation requires frequent decisions across the same files;
- isolation is unavailable;
- integration cost would exceed parallel gain.

A single writer may still use read-only explorers/reviewers.

### Mode B — Parallel read

Preferred low-risk concurrency for:

- architecture mapping;
- evidence collection;
- dependency analysis;
- code-path tracing;
- test-gap discovery;
- PR review;
- regression triage;
- framework/API verification.

Read-only agents can inspect the same surfaces because they do not create merge conflicts or competing implementations.

### Mode C — Isolated parallel write

Use only when all are true:

- there are at least two genuinely independent write/contract domains;
- each writer has an explicit ownership boundary;
- writers have real branch/worktree/filesystem isolation;
- shared hotspots have one owner;
- current contracts needed between lanes are known;
- each lane has independent acceptance/validation evidence;
- an integration path exists.

If the agents share one mutable workspace, logical file ownership alone is not enough. Default to a single writer unless the execution environment provides actual isolation.

### Practical dispatch rule

```text
if work is small or tightly coupled:
    single writer
elif independent questions exist:
    parallel read agents + single writer
elif independent write domains exist and are actually isolated:
    isolated parallel writers + integration owner
else:
    single writer + parallel reviewers
```

A useful capacity bound is:

```text
effective_parallelism = min(
  independent work domains,
  execution capacity,
  review capacity,
  integration capacity
)
```

Do not spawn another agent merely because capacity is available.

---

## 4. Planning algorithm

Before a multi-lane wave:

1. Read `AGENTS.md`, `issue-rule.md`, and the latest Issue/decision state.
2. Refresh current `main`, relevant PRs, and hard dependencies.
3. Establish the **Execution Base**; do not reuse a stale Observed Base as the branch base.
4. Extract Target, Invariants, Scope, Acceptance Criteria, Validation, and Dependencies from the Issue.
5. Identify conflict domains, not only likely changed files.
6. Identify Expected owner-local surfaces and Sensitive/shared surfaces.
7. Assign exactly one writer to each shared hotspot.
8. Establish only the cross-lane contracts necessary for safe parallel work.
9. Select Single Writer, Parallel Read, or Isolated Parallel Write mode.
10. Define lane-local validation and the later integration gate.
11. Define the integration owner and merge/reconciliation order only where dependency requires it.

Do **not** build or manually maintain a full permanent task DAG. Per `issue-rule.md`, use real hard dependencies, ownership, sensitive surfaces, and current contract evidence to infer safe concurrency.

### Contract-first without over-freezing

When multiple lanes depend on the same seam, establish the minimum stable contract needed for the current wave:

```text
foundation / seam
        ↓
parallel owner-local work
        ↓
integration owner
        ↓
regression / closure
```

“Stable for the wave” does not mean immutable forever. If evidence proves the seam is wrong, apply Scope Drift, update the Issue/decision record, invalidate affected lane assumptions, and re-plan.

---

## 5. Scope risk levels map directly to orchestration behavior

Use the same risk model as `issue-rule.md` instead of inventing a separate ownership vocabulary.

### Level A — Expected / owner-local

Examples:

- implementation details inside the assigned domain;
- internal file additions;
- local refactors that preserve contracts;
- focused test additions.

Behavior:

- writer proceeds autonomously;
- no coordination ceremony required;
- Working Direction may change if Target/Invariants/AC remain satisfied.

### Level B — Sensitive / shared / cross-domain

Examples:

- another domain's seam;
- `App.jsx` or equivalent composition root;
- global CSS / registry / workflow / package metadata;
- shared contract used by another active lane.

Behavior:

1. stop expanding that portion of the change;
2. collect evidence;
3. re-check other active lanes/PRs for conflict;
4. update the Issue scope/dependencies or record `[DECISION]` where appropriate;
5. assign or confirm the hotspot/integration owner;
6. continue only after the parallelism assumption is still safe.

### Level C — Core contract / outcome change

Examples:

- persistence migration;
- public contract change;
- required CI semantics change;
- product outcome change;
- a newly discovered independent prerequisite.

Behavior:

- formally revise the Issue contract or split a new Issue;
- re-evaluate READY/BLOCKED state;
- invalidate stale lane plans;
- do not bury the change in a PR diff.

This is normal adaptive planning, not an orchestration failure.

---

## 6. ChatGPT scheduled-task planning

Treat scheduled tasks as **durable execution lanes**, not cron-shaped micro-tasks.

### 6.1 Lane count

Prefer the smallest number of independent automations that keeps useful work moving. For large project waves, the project convention remains **no more than five active project automations unless there is a specific reason to exceed it**.

This is a coordination ceiling, not a utilization target. Two independent lanes are better than five overlapping lanes.

### 6.2 One automation = one stable ownership lane

Good boundaries:

- one product/engineering subsystem;
- one content chapter range;
- one audit domain;
- one isolated architecture extraction;
- one integration/closure lane.

Avoid:

- one automation per tiny ticket;
- multiple automations writing the same shell/registry/config;
- chains where a task repeatedly wakes only to wait for another scheduled run.

### 6.3 Each trigger should reach a coherent checkpoint

Do not intentionally stop after one micro-step when more safe work exists in the same ownership/acceptance boundary.

But also do not maximize code volume merely to consume a run.

A run should:

1. reconcile latest Issue/main/PR/dependency state;
2. skip already completed work;
3. select the highest-priority unblocked item in its lane;
4. advance through contiguous safe work;
5. stop at a **coherent review/validation checkpoint**;
6. run the appropriate validation;
7. update PR/status evidence;
8. continue only if the next work remains in the same safe risk/acceptance boundary.

Meaningful stop conditions include:

- lane completion;
- hard dependency;
- Level B/C Scope Drift;
- ownership conflict;
- required product/architecture decision;
- failure whose repair requires leaving the lane;
- crossing into a distinct review/rollback unit.

### 6.4 Resume-aware and idempotent

Every run should assume previous runs or humans may have changed repository state.

Required behavior:

- re-read latest Issue contract and relevant `[DECISION]` records;
- refresh Execution Base/main and PR state;
- avoid duplicate work and duplicate PRs;
- detect already-completed AC;
- re-evaluate assumptions after upstream merges;
- do not repeatedly retry the same blocker without new evidence.

---

## 7. Codex parent/sub-agent orchestration

The parent agent is the **contract consumer, coordinator, writer/integrator by default, and final synthesizer**.

### 7.1 Parent responsibilities

Before delegation, the parent should:

- consume the latest Issue normative contract;
- run the Dispatch Gate;
- establish Execution Base;
- identify conflict domains and hotspots;
- choose the minimum useful agent set;
- define what each sub-agent must answer or own;
- preserve a single interpretation of Invariants/AC/Validation;
- own Scope Drift decisions and integration.

A sub-agent does not get to redefine the Issue contract independently.

### 7.2 Prefer specialized read-only sub-agents

Use project custom agents under `.codex/agents/` for high-value read-only parallel work. This repository provides focused roles for Issue/codebase exploration and review.

Read-only delegation is preferred because it provides parallel evidence without creating competing mutations.

### 7.3 Write delegation is conditional

Do not treat “worker agent exists” as permission to parallelize writes.

Parallel writers require actual isolation and independent semantic ownership. If these conditions are not met, keep one writer and use sub-agents for read/review work.

### 7.4 Sub-agent work orders derive from the Issue

A sub-agent task should include only what it needs from the current Issue contract:

```text
Issue / Work item:
Execution Base:
Objective / question:
Relevant Target:
Relevant Invariants:
Expected scope:
Sensitive/shared surfaces:
Relevant Acceptance Criteria:
Relevant Validation:
Hard dependencies:
Output required:
```

Do not duplicate the entire Issue if a bounded subset is sufficient.

### 7.5 Semantic contract conflicts must be escalated

If an agent discovers that its proposed work would change another lane's API/state/schema/invariant, it must report the dependency rather than quietly implementing its own version.

The parent then decides whether to:

- adjust the current lane;
- revise the Issue contract;
- establish a foundation seam;
- serialize work;
- split a new Issue;
- assign the integration owner.

---

## 8. Optional execution ledger — only when coordination complexity justifies it

Do **not** require a ledger for a single Issue with one writer.

Use one lightweight execution ledger when there are recurring automations or multiple concurrent implementation lanes and reconstructing state from chat/PRs is becoming costly.

Acceptable source-of-truth locations include a designated coordination Issue/comment or a current-wave document. Pick **one**, not several.

Minimum useful data:

```yaml
wave: <name>
execution_base: <sha/ref>
contract_revision: <issue updated-at / decision ref>
lanes:
  <lane>:
    state: ready | active | blocked | integrating | done
    owner: <automation/agent>
    branch: <branch>
    head: <sha>
    hard_dependencies: []
    sensitive_surfaces: []
```

Do not manually encode every possible `can parallel with` relationship. Derive it from current scope, conflict domains, and hard dependencies.

---

## 9. Task sizing and checkpoint rules

A lane is large enough when it amortizes repository/context setup, but small enough to preserve a clear owner, acceptance boundary, and rollback/review unit.

Split based on **Outcome + Ownership + Independent Acceptance**, consistent with `issue-rule.md` — not LOC or file count.

Too small:

- run one command;
- fix one typo;
- add one assertion when it belongs to an active lane.

Too large:

- “refactor the whole app”;
- “finish all product improvements”;
- “audit everything and implement every finding”.

A good checkpoint usually ends in one of:

- a coherent PR or reviewable commit series;
- an independently accepted domain outcome;
- a foundation seam enabling another lane;
- an audit/decision with bounded follow-up;
- an integration candidate with evidence.

---

## 10. Risk-based validation

Acceptance and Validation remain separate. Agents must verify AC explicitly; green commands are evidence, not automatic proof of AC.

Do the cheapest high-signal validation first and escalate according to changed risk surface.

| Change class | Expected validation |
| --- | --- |
| docs/policy only | document consistency, links/references if applicable; required CI remains authoritative |
| owner-local implementation | focused tests + relevant lint/static checks |
| domain contract/state change | focused tests + affected consumers + relevant repository regression |
| integration/shared hotspot | repository regression + cross-boundary/browser checks as applicable |
| integration/release candidate | canonical required CI + applicable E2E/integration evidence |

Avoid running full E2E independently in every parallel worker when one integration owner/CI can provide authoritative composition evidence.

Recommended hierarchy:

```text
sub-agent / local investigation
        → focused evidence
lane writer
        → domain verification
integration owner
        → cross-boundary verification
CI
        → authoritative merge gate
```

Never weaken required CI, delete tests, inflate timeouts, or add retries merely to produce green evidence.

---

## 11. Merge and branch discipline

Unless explicitly instructed otherwise:

- do not opportunistically edit `main`;
- use a scoped branch per writer/lane or integration wave;
- keep unrelated changes out of the lane;
- do not merge dependent PRs out of order;
- do not rewrite another lane's branch to “help” it;
- refresh stale execution bases deliberately;
- preserve traceability from Issue → execution base → branch/PR → tested candidate → merge.

When a parallel assumption becomes invalid, serialize or re-plan instead of relying on conflict resolution.

---

## 12. Blocker and handoff evidence

### Blocker record

```text
STATUS: BLOCKED
ISSUE: <number or none>
LANE: <name>
EXECUTION_BASE: <sha/ref>
CURRENT_HEAD: <sha>
BLOCKER_TYPE: dependency | ownership-conflict | test-failure | permission | product-decision | contract-drift
BLOCKER: <specific condition>
EVIDENCE: <test/CI/PR/file evidence>
SAFE_WORK_COMPLETED: <what is already done>
NEXT_UNBLOCKING_ACTION: <specific action>
```

If independent safe work remains inside the lane, complete it before declaring the lane blocked.

### Standard handoff

```text
STATUS: DONE | PARTIAL | BLOCKED
ISSUE: <number or none>
LANE: <name>
EXECUTION_BASE: <sha/ref>
CONTRACT_REVISION: <issue updated-at / decision ref / none>
BRANCH: <branch>
HEAD: <sha>
PR: <number/url or none>
OWNED_SCOPE: <modules/files>
SENSITIVE_SURFACES_TOUCHED: <none or list>
CHANGED: <important files/modules>
AC_STATUS: <complete / partial + concise evidence>
VALIDATION: <commands/checks and results>
KNOWN_RISKS: <none or concise list>
BLOCKERS: <none or exact blockers>
NEXT: <integration or follow-up action>
```

Use `BASE_SHA / HEAD_SHA / TESTED_SHA / RUN_ID` where the repository's merge-candidate evidence contract applies. Do not conflate feature head with the actual tested merge candidate.

---

## 13. Prompt template — scheduled execution lane

```text
Repository: CoderLambert/react-learning-playground
Issue(s): <numbers or none>
Lane: <lane>

Before execution:
- Read AGENTS.md and issue-rule.md.
- Reconcile the latest Issue normative contract, main, PRs, dependencies, and concurrent work.
- Establish the current Execution Base.

Contract subset for this lane:
- Target: <relevant target>
- Invariants: <relevant invariants>
- Expected scope: <owner-local scope>
- Sensitive/shared: <surfaces requiring Scope Drift/coordination>
- Acceptance Criteria: <relevant AC>
- Validation: <focused/domain/repository/CI as applicable>
- Hard dependencies: <real blockers>

Execution:
1. Skip work already complete.
2. Advance the highest-priority unblocked work to a coherent checkpoint.
3. Owner-local implementation choices remain autonomous.
4. If work enters Sensitive/shared or changes a core contract/outcome, apply issue-rule.md Scope Drift Protocol before expanding.
5. Do not duplicate another lane's writes or create a competing shared contract.
6. Run risk-appropriate validation.
7. Continue only while the next work remains inside the same safe ownership/acceptance boundary.

Finish with the standard handoff.
```

---

## 14. Prompt template — Codex sub-agent

```text
You are a bounded sub-agent. The Issue contract is authoritative; your task is to gather evidence or execute only the explicitly assigned isolated scope.

Issue / work item: <id>
Execution Base: <sha/ref>
Objective / question: <bounded objective>
Relevant Target: <subset>
Relevant Invariants: <subset>
Expected scope: <subset>
Sensitive/shared surfaces: <subset>
Relevant Acceptance Criteria: <subset>
Relevant Validation: <subset>
Hard dependencies: <subset>

Rules:
- Do not reinterpret Working Direction as an immutable requirement.
- Stay inside the assigned role/scope.
- If evidence invalidates an Issue assumption, report it explicitly.
- If work requires Sensitive/shared or core-contract expansion, stop that portion and report Scope Drift evidence instead of silently expanding.
- Do not create a competing API/state/schema contract owned by another lane.
- Return concise evidence that the parent can integrate into the Issue/PR decision.
```

---

## 15. Architecture-specific application to this repository

When architecture debt is the reason for the work, orchestration must reinforce the desired module boundary rather than merely reduce Git conflicts.

For `App.jsx`-style coupling:

1. map coupled responsibilities using read-only exploration;
2. identify domain/state/contract ownership;
3. establish minimal extraction seams;
4. assign independent owner-local modules only after those seams exist;
5. reserve final shell composition to one writer;
6. validate the extracted boundaries and integration behavior;
7. let future product work depend on the new extension points rather than returning orchestration to `App.jsx`.

The success metric is not “agents learned to merge the hotspot more carefully”; it is “future work needs the hotspot less often”.

---

## 16. Pre-dispatch checklist

Before enabling a scheduled wave or spawning multiple Codex agents, confirm only what is material:

- [ ] latest Issue contract / task outcome is understood;
- [ ] Execution Base is current;
- [ ] READY/hard-dependency state supports starting;
- [ ] Dispatch Gate says delegation provides real value;
- [ ] conflict domains and Sensitive/shared surfaces are known;
- [ ] each shared hotspot has one writer;
- [ ] parallel writers, if any, have actual isolation;
- [ ] cross-lane contracts are minimal and explicit;
- [ ] lane acceptance/validation is meaningful;
- [ ] integration ownership is explicit when needed;
- [ ] Scope Drift can update the plan instead of being hidden;
- [ ] recurring/multi-lane work has enough state evidence to resume safely.

If these are obvious for a small owner-local task, do not manufacture ceremony. Use one writer and proceed.