# Repository Agent Instructions

These instructions apply to the whole repository.

The detailed orchestration reference is:

- `docs/execution/AUTOMATION-AND-AGENT-ORCHESTRATION.md`

Use that document when planning ChatGPT scheduled tasks, Codex parent/sub-agent work, parallel branches, or integration waves.

## Core rules

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
