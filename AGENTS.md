# Repository Agent Instructions

These instructions apply to the whole repository.

Canonical collaboration references:

- `issue-rule.md` — Issue creation, revision, execution-scope, acceptance, validation, and closure rules.
- `docs/execution/AUTOMATION-AND-AGENT-ORCHESTRATION.md` — scheduled-task, parent/sub-agent, concurrency, integration, and handoff rules.

**Before creating, materially rewriting, or executing a GitHub Issue, read `issue-rule.md`.**
Use it as the default reference for all future Issue submissions and updates.

Use the orchestration document when planning ChatGPT scheduled tasks, Codex parent/sub-agent work, parallel branches, or integration waves.

## Issue contract rules

1. **Issues constrain risk, not implementation freedom.**
   Treat an Issue as the current best-known execution contract, not a frozen implementation specification.

2. **Keep outcome, invariants, and implementation direction distinct.**
   Outcome/Target defines the desired end state. Invariants define the small set of boundaries that must not be silently broken. Working Direction is provisional and may be corrected by implementation evidence.

3. **Do not silently expand shared or cross-domain scope.**
   Owner-local implementation changes may proceed autonomously. If work expands into shared hotspots, another domain, persistence/public contracts, required CI, or other sensitive surfaces, apply the Scope Drift Protocol in `issue-rule.md` before continuing the expansion.

4. **Correct stale Issues instead of obeying known-wrong assumptions.**
   When code evidence invalidates an Issue assumption, update the Issue/decision record or split a dependency Issue. Do not force an obsolete design merely because it was written first.

5. **Acceptance Criteria may be refined with evidence, but not weakened for convenience.**
   Never remove correctness requirements simply because implementation is difficult or tests fail.

6. **Open does not automatically mean ready.**
   Before autonomous implementation, confirm that Target, key Invariants, hard dependencies, risk surfaces, Acceptance Criteria, and Validation are sufficiently clear.

7. **Separate Acceptance from Validation.**
   Acceptance Criteria describe the required result. Tests, lint, build, E2E, and required checks belong to the validation contract and provide evidence; green tests alone do not prove every Acceptance Criterion is satisfied.

8. **Refresh execution state before acting.**
   Re-read the latest Issue, current `main`, relevant open/merged PRs, dependencies, and concurrent work. Do not treat an old audit SHA as the automatic branch base.

## Core orchestration rules

1. **Optimize for independent write domains, not maximum agent count.**
   Two tasks are parallel-safe only when their required writes and contracts are sufficiently independent.

2. **One writer per shared hotspot per wave.**
   Treat application-shell composition (`App.jsx` or equivalent), shared registries, URL/state synchronization, global styles, package manifests/lockfiles, central exports, and shared test/config files as conflict-prone integration surfaces.

3. **Prefer contract-first decomposition.**
   If several lanes need the same component API, state model, data shape, shell extension point, or registry contract, establish/freeze that contract before downstream parallel implementation.

4. **Do not use merge-conflict resolution as the architecture.**
   If multiple lanes repeatedly need the same file, extract a stable boundary or reserve final composition to one integration owner.

5. **Keep write agents isolated.**
   Use a scoped branch/worktree and explicit file/module ownership for each implementation lane. Read-only audit agents may inspect shared surfaces concurrently.

6. **The parent Codex agent coordinates before it implements.**
   Establish baseline, dependency graph, hotspots, ownership, contracts, validation, and integration owner before spawning write sub-agents.

7. **Sub-agent scopes must be bounded.**
   Every sub-agent task should specify objective, owned write surface, read-only/shared surfaces, frozen contracts, acceptance checks, and handoff requirements.

8. **Complete contiguous safe work.**
   Do not intentionally stop after a micro-step when additional unblocked work remains inside the same ownership boundary.

9. **Scheduled tasks must be resume-aware and idempotent.**
   Reconcile current repository/PR/status state on every run, skip completed work, avoid duplicate PRs, and re-evaluate assumptions after upstream changes.

10. **For project automations, prefer a small number of durable lanes.**
    For large waves, the project convention is no more than five active automations unless there is a specific reason to exceed it. Fewer is better when ownership overlaps.

11. **Validate locally before integration, then validate the composition.**
    Lane-local green checks do not prove the integrated product is green. Run repository and cross-boundary regression gates after combining lanes.

12. **Do not opportunistically edit `main` unless explicitly instructed.**
    Preserve task → branch → PR → validation → merge traceability.

## Issue execution preflight

Before implementing an Issue:

```text
1. Read AGENTS.md and issue-rule.md
2. Fetch the latest Issue body/comments and relevant PR state
3. Confirm Target, Invariants, Acceptance Criteria, and Validation
4. Confirm hard dependencies and current execution base
5. Identify expected write surfaces and sensitive/shared surfaces
6. Check concurrent tasks for hotspot overlap
7. Run a focused baseline when useful
8. Implement while the current contract remains valid
9. If evidence invalidates scope/design assumptions, apply Scope Drift Protocol
10. Validate focused → repository/regression → required CI as applicable
11. Record concise handoff/closure evidence
```

Do not turn this preflight into bureaucracy: owner-local implementation details should remain autonomous unless they cross a meaningful risk boundary.

## Required handoff

Write agents and recurring execution lanes should end with:

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

If blocked, include concrete evidence and the exact unblocking action. Continue other independent work in the same lane when safe.
