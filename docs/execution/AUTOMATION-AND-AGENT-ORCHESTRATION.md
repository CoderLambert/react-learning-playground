# Automation & Agent Orchestration Playbook

> Scope: ChatGPT scheduled/recurring execution and Codex parent/sub-agent orchestration for this repository.
>
> Goal: maximize useful parallelism without trading away correctness, reviewability, or merge stability.

## 1. Why this exists

This repository has already hit the failure mode that usually appears once AI-assisted work becomes highly parallel: tasks look independent at the product level, but collide in shared implementation surfaces such as `App.jsx`, registries, global styles, package metadata, shell state, or integration docs.

The primary constraint is therefore **not agent count**. It is **write-surface overlap**.

Use this document whenever work is split across scheduled tasks, Codex sub-agents, parallel branches, or integration waves.

---

## 2. Shared vocabulary

### Work item

A user-visible or engineering outcome with an explicit Definition of Done.

### Lane

A sequence of closely related work items that can be executed by one automation or one agent with minimal cross-lane write overlap.

Examples: AI workspace, assessment workflow, content audit, architecture refactor, CI/tooling.

### Wave

A set of lanes that may proceed concurrently because their contracts are already known and their write surfaces are sufficiently isolated.

### Integration surface

A file/module that combines multiple lanes and is therefore conflict-prone. Typical examples include:

- application shell / `App.jsx`
- route or demo registries
- shared state / URL synchronization
- global CSS and design tokens
- `package.json` / lockfiles
- central exports / barrel files
- shared architecture or release-status documents

### Hotspot owner

The single lane/agent responsible for writing a given integration surface during a wave.

### Hard blocker

A condition that makes further safe progress impossible, for example an unresolved dependency, ambiguous product decision, repository permission failure, incompatible contract change, or a failing test that cannot be repaired without leaving the lane's ownership boundary.

---

## 3. Planning algorithm

Before creating automations or spawning sub-agents, convert the backlog into a dependency and ownership graph.

1. List the desired outcomes, not implementation micro-steps.
2. Mark dependencies between outcomes.
3. List likely files/modules touched by each outcome.
4. Identify shared hotspots.
5. Move hotspot writes into a dedicated foundation/integration lane where practical.
6. Freeze any interfaces/contracts required by downstream lanes.
7. Group independent outcomes into parallel lanes.
8. Define lane-level acceptance gates.
9. Define merge order only where dependencies require it.

A task is not parallel-safe merely because its description is different. It is parallel-safe only if its **required writes and contracts are independent enough**.

### Prefer contract-first decomposition

When several features need the same shell, state model, component contract, or data shape:

```text
Foundation / contract
        ↓
parallel implementation lanes
        ↓
integration owner
        ↓
closure / regression audit
```

Do not let several agents independently invent competing versions of the same shared contract.

---

## 4. ChatGPT scheduled-task planning rules

For this project, treat scheduled tasks as **long-running execution lanes**, not cron-shaped micro-tasks.

### 4.1 Task-count rule

Prefer the smallest number of independent automations that can keep useful work moving. For large parallel waves, use **no more than five active project automations unless there is a specific reason to exceed that project convention**.

More automations are not automatically faster; they increase coordination and merge cost.

### 4.2 One automation = one stable ownership lane

Good automation boundaries:

- one product/engineering subsystem
- one content chapter range
- one audit domain
- one isolated refactor boundary
- one integration/closure lane

Bad automation boundaries:

- one automation per tiny ticket
- several automations all editing the application shell
- several automations that depend on each other's next scheduled run

### 4.3 Each trigger should do as much contiguous safe work as possible

A scheduled run must not intentionally perform only one small step and then idle until the next trigger.

Each run should:

1. reconcile current repository/task state;
2. skip work already completed elsewhere;
3. select the highest-priority unblocked item inside its lane;
4. execute all safe contiguous steps needed to reach a meaningful checkpoint;
5. run the lane's validation gates;
6. update branch/PR/status evidence;
7. continue to the next unblocked item in the same lane when doing so remains safe.

Stop only at a real boundary: dependency, ownership conflict, test/CI failure requiring cross-lane changes, explicit approval point, or completion.

### 4.4 Automations must be resume-aware and idempotent

Prompts should assume previous runs may already have completed part or all of the lane.

Required behavior:

- inspect current branch/PR/issues/status docs before changing code;
- do not recreate completed work;
- do not duplicate PRs for the same lane;
- tolerate the main branch moving forward;
- re-evaluate previous assumptions after upstream merges;
- record exact blockers rather than repeatedly retrying the same unsafe action.

### 4.5 Avoid dependency chains between scheduled tasks

Do not design a schedule where Automation B frequently wakes up only to discover that Automation A has not finished yet.

Instead:

- run prerequisite/foundation work first;
- activate dependent lanes only after the required contract exists; or
- give the dependent task additional independent work it can safely perform while waiting.

### 4.6 Prefer outcome-oriented prompts

A scheduled prompt should describe:

- ownership boundary;
- prioritized backlog within that boundary;
- current source-of-truth documents;
- validation requirements;
- prohibited shared-file writes;
- what counts as a hard blocker;
- required handoff/status format.

Do not encode a brittle list of terminal commands as the task definition.

### 4.7 Recommended automation lane pattern

For a maximum-parallelism wave, a typical five-lane shape is:

| Lane | Responsibility |
| --- | --- |
| A | Foundation/contracts/shared interfaces |
| B | Product/feature domain 1 |
| C | Product/feature domain 2 |
| D | Content/tests/audit domain |
| E | Integration, regression closure, merge readiness |

Not every wave needs five lanes. Use fewer when write ownership overlaps.

---

## 5. Codex parent/sub-agent orchestration rules

The parent agent is a **coordinator and integrator**, not merely another implementation worker.

### 5.1 Parent-agent responsibilities

Before dispatching sub-agents, the parent should:

1. establish the current repository baseline and target branch;
2. create the dependency graph;
3. identify write hotspots;
4. define file/module ownership per lane;
5. freeze shared contracts where required;
6. assign isolated implementation scopes;
7. reserve integration surfaces to one owner;
8. define validation and handoff requirements.

During execution, the parent should continuously reconcile discoveries from agents and change the plan if the original decomposition proves unsafe.

### 5.2 Sub-agent scope must be bounded

Each implementation sub-agent should receive a scope with:

- objective;
- owned directories/files or module boundary;
- files it may read but must not write;
- relevant contracts/interfaces;
- acceptance tests;
- expected branch/worktree;
- output/handoff format.

Avoid vague prompts such as “improve architecture” or “fix all AI issues” for parallel workers.

### 5.3 Isolate write agents

Prefer one branch or worktree per write agent/lane.

A write agent must not assume it owns files simply because they are easy to edit. Ownership is defined by the orchestration plan.

Read-only audit agents may inspect shared surfaces concurrently because they do not create merge conflicts.

### 5.4 Shared hotspots have exactly one writer per wave

During a parallel wave, designate one writer for each hotspot.

Common hotspots in this repository should be treated conservatively, especially:

- `App.jsx` or equivalent application-shell composition
- shared navigation / workbench shell
- demo/content registries
- shared URL/state synchronization
- package manifests and lockfiles
- global CSS/theme primitives
- central test fixtures/configuration

If two feature lanes both need a hotspot changed, prefer one of these patterns:

1. foundation agent changes it first and freezes the contract;
2. integration owner applies both feature hooks after feature branches are ready;
3. extract a stable extension point so downstream agents no longer touch the hotspot.

Do **not** let both agents edit the hotspot and rely on merge conflict resolution as the architecture.

### 5.5 Optimize concurrency by conflict domain, not agent count

Spawn additional implementation agents only when they add independent throughput.

A useful rule:

```text
parallelism = min(available agents, independent write domains, review capacity)
```

If five agents all need the same central file, effective safe parallelism is one.

### 5.6 Foundation agents should leave extension points, not feature implementations

A foundation lane should expose stable boundaries—components, hooks, adapters, interfaces, registries, contracts—then stop.

This is what makes later agents independent.

### 5.7 Integration should be explicit

Do not make the last feature agent accidentally become the integrator.

The integration owner is responsible for:

- combining lane outputs;
- touching reserved shared files;
- resolving contract drift;
- running repository-wide validation;
- identifying regressions caused by composition rather than lane-local code.

### 5.8 Use read-only agents aggressively for discovery

Parallel read-only sub-agents are useful for:

- architecture mapping;
- dependency analysis;
- test-gap discovery;
- content audits;
- file-hotspot identification;
- PR review;
- regression triage.

Because they do not write, they can often run concurrently even when implementation must remain serialized.

---

## 6. Task sizing rules

A good lane is large enough to amortize setup/repository-reading cost, but small enough to have clear ownership and review boundaries.

### Too small

- rename one symbol;
- add one assertion;
- fix one text typo;
- run one command;
- inspect one file and stop.

These belong inside a larger lane unless they are urgent standalone fixes.

### Too large

- “refactor the whole app”;
- “finish all product improvements”;
- “audit everything and implement every finding”.

These hide ownership conflicts and make validation ambiguous.

### Preferred unit

A lane should usually end in one of:

- a coherent PR;
- a coherent series of commits on one PR;
- an audit report with owned follow-up work;
- a foundation contract enabling the next wave.

---

## 7. Validation hierarchy

Validation is layered. Do the cheapest high-signal checks first, but do not stop there when a lane reaches merge readiness.

### Lane-local gate

Run the checks relevant to the touched area, such as focused unit/component tests, lint, type/static checks, targeted Playwright tests, or content validators.

### Repository gate

Before integration/merge readiness, run the repository-standard checks (`lint`, build, and relevant test suites/CI workflows).

### Integration gate

After combining parallel lanes, specifically validate behaviors spanning boundaries:

- navigation and shell composition;
- state/URL synchronization;
- shared registries;
- responsive layout;
- cross-feature flows;
- browser console/runtime warnings;
- merge-order assumptions.

Green lane-local tests do not prove that the integrated product is green.

---

## 8. Merge and branch discipline

Unless explicitly instructed otherwise:

- do not make opportunistic direct edits to `main`;
- create a scoped branch per lane or integration wave;
- keep unrelated changes out of the lane;
- do not merge dependent PRs out of order;
- do not rewrite another lane's branch to “help” it;
- preserve traceability between task, branch, PR, validation, and final merge commit.

When a lane becomes blocked by upstream changes, rebase/reconcile deliberately rather than silently reimplementing upstream work.

---

## 9. Failure and blocker handling

When an automation or agent cannot proceed safely, it should report the blocker precisely.

Required blocker record:

```text
STATUS: BLOCKED
LANE: <name>
CURRENT_HEAD: <sha>
BLOCKER_TYPE: dependency | ownership-conflict | test-failure | permission | product-decision | contract-drift
BLOCKER: <specific condition>
EVIDENCE: <test/CI/PR/file evidence>
SAFE_WORK_COMPLETED: <what is already done>
NEXT_UNBLOCKING_ACTION: <specific action>
```

Do not repeatedly wake up and retry the same blocked step without new evidence.

If other work inside the lane is independent of the blocker, continue that work first.

---

## 10. Standard handoff format

Every write lane/sub-agent should finish with a compact machine- and human-readable handoff:

```text
STATUS: DONE | PARTIAL | BLOCKED
LANE: <name>
BRANCH: <branch>
HEAD: <sha>
PR: <number/url or none>
OWNED_SCOPE: <modules/files>
CHANGED: <important files/modules>
VALIDATION: <commands/checks and results>
KNOWN_RISKS: <none or concise list>
BLOCKERS: <none or exact blockers>
NEXT: <integration or follow-up action>
```

This format is intentionally stable so a later scheduled run or parent agent can resume without reconstructing the entire history from chat.

---

## 11. Prompt template — scheduled execution lane

```text
Repository: CoderLambert/react-learning-playground
Lane: <lane name>

Goal:
<outcome-oriented goal>

Ownership:
- May write: <paths/modules>
- Read-only/shared: <paths/modules>
- Reserved to integration owner: <hotspots>

Execution rules:
1. Reconcile current main/branch/PR/status before changing anything.
2. Skip completed work; do not duplicate existing PRs.
3. Work through the highest-priority unblocked items in this lane.
4. Do not stop after one small task if additional contiguous safe work remains.
5. Do not modify reserved shared surfaces.
6. Run lane-local validation after meaningful checkpoints.
7. Before declaring DONE, run the required merge-readiness gates.
8. If blocked, record the exact blocker and continue any independent work in this lane.

Finish with the standard STATUS/LANE/BRANCH/HEAD/PR/VALIDATION/BLOCKERS/NEXT handoff.
```

---

## 12. Prompt template — Codex sub-agent

```text
You are a sub-agent in a parallel repository change.

Repository baseline: <sha>
Lane: <name>
Objective: <bounded objective>

Write ownership:
- <paths/modules>

Read-only / do-not-write surfaces:
- <shared paths>

Frozen contracts:
- <interfaces/data shapes/component contracts>

Acceptance:
- <tests / expected behavior>

Rules:
- Stay inside the assigned write boundary.
- Do not edit shared integration hotspots unless explicitly owned.
- Prefer adding/extending stable module APIs over reaching into another lane.
- If the task requires a contract change outside your ownership, stop that portion and report the dependency rather than silently changing the contract.
- Complete all contiguous safe work in scope, not just the first micro-step.
- Run relevant validation before handoff.

Return the standard handoff including changed files, validation, risks, and exact blockers.
```

---

## 13. Architecture-specific application to this repository

When architecture debt is itself the reason for the work, orchestration must reinforce the target architecture rather than merely reduce Git conflicts.

For example, if `App.jsx` is accumulating unrelated responsibilities, do not assign several agents slices of `App.jsx`. Instead:

1. map the responsibilities currently coupled there;
2. define extraction boundaries;
3. assign independent modules to agents;
4. reserve final shell composition to one integration owner;
5. add tests around the extracted boundaries;
6. only then allow new product work to build on those extension points.

The desired end state is not “agents learned to merge `App.jsx` more carefully”. It is “future agents rarely need to touch `App.jsx` at all”.

---

## 14. Pre-dispatch checklist

Before enabling a scheduled wave or spawning Codex sub-agents, confirm:

- [ ] outcomes are defined at lane level;
- [ ] dependencies are explicit;
- [ ] shared hotspots are identified;
- [ ] every hotspot has one writer;
- [ ] contracts needed for parallel work are frozen;
- [ ] write ownership is non-overlapping or intentionally serialized;
- [ ] each lane has meaningful validation;
- [ ] tasks are large enough to justify an automation/agent;
- [ ] scheduled runs are resume-aware and idempotent;
- [ ] integration/closure ownership is explicit;
- [ ] handoff format is specified.

If several boxes are unchecked, adding more agents or more scheduled tasks will usually reduce throughput rather than increase it.
