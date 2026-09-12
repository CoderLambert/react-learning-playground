# Assessment + AI Agent Integration Status

## Validation candidate

- A5 validation branch: `codex/assessment-hardening-release`
- Validation tip before this status commit: `ce6c4a5`
- PR branch to update: `codex/assessment-finalization`
- PR base: `auto/assessment-integration`
- Baseline audited before hardening: `d0130d35a35392fac3ea1059a611ba85c326a93f`

The validation work did not reset, force-push, merge, or otherwise modify `main`.

## Architecture and product gates

| Gate | Result | Evidence |
| --- | --- | --- |
| Architecture Gate | PASS | Boundary tests confirm UI stays behind application/query-store boundaries; tools call `AssessmentService`; provider/worker and generic agent core remain Assessment-agnostic; domain remains React/IndexedDB/AI-independent. |
| Repository Gate | PASS | Memory and IndexedDB contract suites cover scoped queries, atomic mutation receipts/replay, revision conflicts, retire metadata, sessions, attempts, and completion mutation parity. |
| Service Gate | PASS | Service tests cover trusted scope injection, domain validation, attempt grading from snapshots, query refresh, and repository-error propagation. |
| Tool Schema Gate | PASS | Ajv-backed reusable Assessment schemas accept complete single-choice/true-false drafts and reject forged runtime fields, invalid patches, nested unknown fields, malformed discriminated content, and fewer than two choice options. |
| Runtime Validation Gate | PASS | `ToolExecutor` compiles/caches the registered `inputSchema`; invalid model arguments normalize to `TOOL_ARGUMENTS_INVALID`; provider definitions and local validation share the schema. |
| Trusted Scope Gate | PASS | Model arguments cannot set learning-unit identity, mutation identity, provenance, conversation/run/tool identity, snapshot identity, model, or other system fields; adapters inject trusted runtime context and the service validates it again. |
| Evidence Gate | PASS | Non-empty evidence fails closed without a resolver. Production composition resolves only the current LearningUnit's declared source file and rejects missing files and out-of-range source lines before persistence. |
| Question Mutation Idempotency Gate | PASS | Create/update/retire tests cover receipt replay, revision conflict, atomic receipt storage, and trusted AI provenance replacement. Retire atomically changes status, revision, `updatedAt`, and provenance. |
| Session Snapshot/Recovery Gate | PASS | Session items retain question/revision snapshots; attempts grade against snapshots; partial sessions recover the first unanswered item after reload; final attempt atomically completes the session; later question update/retire does not alter the active snapshot. |
| Agent Audit Persistence Gate | PASS | AI IndexedDB migration preserves conversation data and persists `agentRuns` plus `toolExecutions` across reopen. Runner tests cover successful, failed, aborted, multi-tool, and recovered interrupted runs; Memory remains an explicit fallback. |
| Capability Gate | PASS | Ordinary chat exposes no Assessment command tools. Explicit `assessment_authoring` mode supplies Assessment tools, exposes mode state in the UI, permits exit, and compaction always has no tools. |
| Direct Provider Contract Gate | PASS | Node contract tests cover tool schema forwarding, assistant/tool continuations, split tool calls, errors, and abort normalization. |
| Gateway Provider Contract Gate | PASS | Worker and client tests cover the same normalized tool continuations, stream assembly, cancellation, error handling, and tool-disabled compaction boundary. |
| Product E2E Gate | PASS | Mock Chromium run covers AI create, source-evidence navigation, session reload/completion/snapshot isolation, ordinary-chat capability denial, and IndexedDB Memory fallback. Invalid source-file and line-range evidence rejection is covered by Node composition/service tests. |

## Commands actually run

| Command | Result |
| --- | --- |
| `npm ci` | PASS — 265 packages added; audit reported 0 vulnerabilities. |
| `node --test tests/*.mjs worker/deepseek-assistant/test/*.test.js` | PASS — 216 passed, 0 failed. |
| `npm run lint` | PASS — exit 0; pre-existing warnings only. |
| `npm run build` | PASS — exit 0; Vite built 1,073 modules. Existing large-chunk warning only. |
| `npm exec --yes --package=wrangler@4.36.0 -- wrangler deploy --dry-run --config worker/deepseek-assistant/wrangler.jsonc` | PASS — dry-run upload plan generated. Wrangler warned that the existing top-level `secrets` config field is unexpected. |
| `VITE_AI_ASSISTANT_URL=http://127.0.0.1:4173/__ai-test__ CI=true npm run test:e2e` after a bare build | Diagnostic failure — 28/46 passed and 18 existing AI tests found the composer disabled. Vite substitutes `VITE_*` values at build time while Playwright serves `vite preview`; setting the variable only for the preview/test process cannot modify an already bare-built `dist`. This is superseded by the self-contained command below. |
| `npm run test:e2e:mock` | PASS — 46/46 Chromium tests in 28.4 s. The script builds with the mock endpoint first, then runs Playwright. It uses no production endpoint or credential. |

## Provider and CI status

- Mock tool lifecycle: `PASS` — the Chromium mock-provider path invokes tool continuation through executor, service, repository, UI, and IndexedDB.
- Provider wire contract: `PASS` — Direct and Gateway contract coverage is part of the 216-passing Node run.
- Live DeepSeek function-call smoke: `PENDING_NO_CREDENTIAL` — `DEEPSEEK_API_KEY`, `DEEPSEEK_TEST_API_KEY`, and `VITE_DEEPSEEK_API_KEY` were absent. No secret was added, no live request was fabricated, and no live-provider PASS is claimed.
- CI Gate (exact remote PR head): `NOT_AVAILABLE_WITH_REASON` — A5 performed local gates only and did not query or modify remote PR checks. The PR owner must refresh checks after integrating this status commit.

## Integrated hardening commits

- `21cdbe7` — Ajv runtime validation and Assessment tool schemas.
- `98b31c1` — Assessment provenance, evidence, retire metadata, and session lifecycle integrity.
- `c5c91a2` — persistent AI agent-run/tool-execution audit records.
- `5d50db6` — production composition, explicit capability mode, evidence resolver, and product session recovery.
- `8a8c556` / merge `a77146f` — self-contained mock E2E build-and-test command.

## Release conclusion

All local code-level gates required for this hardening are passing and there is no known P1 blocker.

```text
Tool Runtime Validation: PASS
Assessment Tool Schema: PASS
Trusted Scope: PASS
Evidence Scope Validation: PASS
Question Mutation Idempotency: PASS
Session Snapshot/Recovery: PASS
Agent Run Persistence: PASS
Direct Provider Contract: PASS
Gateway Provider Contract: PASS
Mock Chromium E2E: PASS
Live DeepSeek Smoke: PENDING_NO_CREDENTIAL
Exact-head CI: NOT_AVAILABLE_WITH_REASON
MERGE_READY=YES
```

`PENDING_NO_CREDENTIAL` is not a live-provider PASS. Do not auto-merge this PR and do not merge directly into `main`.
