# Repository Agent Instructions

These instructions apply to the whole repository.

Canonical references:

- `issue-rule.md` — Issue creation, revision, execution scope, acceptance, validation, and closure.
- `docs/execution/AUTOMATION-AND-AGENT-ORCHESTRATION.md` — scheduled-task, Codex parent/sub-agent, concurrency, integration, and handoff rules.

**Before creating, materially rewriting, or executing a GitHub Issue, read `issue-rule.md`.**
For multi-agent, scheduled, or parallel work, also read the orchestration playbook.

## Repository rules

1. **Issue = adaptive execution contract.**
   Target and Invariants define the result/risk boundary. Working Direction is provisional and may change when implementation evidence proves a better approach.

2. **Do not silently expand risk.**
   Owner-local implementation details may change autonomously. Before entering Sensitive/shared/cross-domain surfaces or changing a core contract/outcome, apply the Scope Drift Protocol in `issue-rule.md`.

3. **Open does not mean READY.**
   Before autonomous implementation, refresh the latest Issue, `main`, relevant PRs/dependencies, Execution Base, Target, Invariants, Acceptance Criteria, Validation, and shared-risk surfaces.

4. **Acceptance is not Validation.**
   Explicitly verify Acceptance Criteria. Tests/lint/build/E2E/CI are evidence and must not be weakened merely to produce green results.

5. **Choose the minimum useful orchestration.**
   Small or tightly coupled work uses one writer. Prefer parallel read-only exploration/review. Parallel writes require independent semantic ownership and actual branch/worktree/filesystem isolation.

6. **Parallel safety includes semantic conflicts.**
   Check file, API/contract, state, schema, and integration ownership. Zero Git conflict does not imply parallel safety.

7. **One writer per shared hotspot per wave.**
   Treat `App.jsx`/composition roots, registries, URL/state synchronization, global styles, package/lockfiles, workflows, shared test/config, and stable public/persistence contracts conservatively.

8. **Do not use merge-conflict resolution as architecture.**
   When multiple lanes repeatedly need the same hotspot, establish an extension seam, serialize the work, or reserve composition to an integration owner.

9. **Do not freeze a known-wrong plan.**
   If evidence invalidates the Issue or lane assumptions, revise the Issue/[DECISION], dependencies, scope, or lane plan before continuing the affected work.

10. **Complete coherent work, not arbitrary volume.**
    Do not stop at a micro-step when contiguous safe work remains, but do not cross a distinct risk/review/rollback boundary merely to consume an automation run.

11. **Validation follows risk.**
    Sub-agents gather focused evidence; lane writers run domain validation; integration owners validate cross-boundary behavior; required CI is the authoritative merge gate where applicable.

12. **Preserve traceability.**
    Unless explicitly instructed otherwise, use scoped branches/PRs rather than opportunistic direct edits to `main`, and keep Issue → Execution Base → branch/PR → tested candidate → merge evidence coherent.

## Issue execution preflight

```text
1. Read AGENTS.md + issue-rule.md
2. Refresh latest Issue / decisions / main / PRs / dependencies
3. Confirm READY state and current Execution Base
4. Confirm Target / Invariants / AC / Validation
5. Identify Expected and Sensitive/shared conflict domains
6. Choose single writer / parallel read / isolated parallel write
7. Implement owner-local work autonomously
8. Apply Scope Drift Protocol before meaningful risk expansion
9. Validate focused → domain/repository → integration/required CI as applicable
10. Record concise handoff/closure evidence
```

Do not turn this preflight into bureaucracy. For small owner-local work, the correct orchestration is usually one writer with focused validation.

## Standard handoff

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
AC_STATUS: <complete / partial + evidence>
VALIDATION: <checks and results>
KNOWN_RISKS: <none or concise list>
BLOCKERS: <none or exact blockers>
NEXT: <integration or follow-up action>
```

Use `BASE_SHA / HEAD_SHA / TESTED_SHA / RUN_ID` when the repository's merge-candidate evidence contract applies.