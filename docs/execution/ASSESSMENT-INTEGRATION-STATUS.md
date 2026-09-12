# Assessment + AI Agent Integration Status

## Branch

`auto/assessment-integration`

## Current integrated upstream work

### Assessment UI / Inspector

Integrated from `auto/assessment-ui`:

- `LearningInspector` renders panel descriptors instead of hardcoded note/source/AI sections.
- `src/workbench/inspectorPanels.js` is the inspector panel registry and single source of truth for panel ids/labels.
- `INSPECTOR_TABS` remains as a backward-compatible alias derived from the registry.
- Contract regression test exists in `tests/inspector-panel-registry.test.mjs`.

### AI provider boundary

Integrated from `auto/ai-agent-tooling`:

- provider-neutral model turn contract in `src/ai/providers/modelClient.js`;
- DeepSeek Chat Completions adapter with tool definitions, assistant tool calls, tool continuation messages, streamed tool-call argument assembly, and `tool_calls` finish reason support;
- provider contract tests in `tests/ai-model-provider.test.mjs`.

### Integration architecture guard

Integration branch adds `tests/assessment-architecture-boundaries.test.mjs` to enforce the hard dependency rules while the remaining modules arrive:

- Assessment UI must not access IndexedDB or Assessment infrastructure directly;
- Assessment AI adapters must not access persistence infrastructure directly;
- model providers and the gateway worker must remain Assessment-agnostic;
- generic Agent core must not depend on Assessment implementations.

This test is deliberately independent of the missing Assessment contracts/core and can remain as a regression gate after full integration.

## Upstream availability

- `auto/assessment-ui`: available; no new work beyond the content already integrated.
- `auto/ai-agent-tooling`: available; no new work beyond the content already integrated.
- `auto/assessment-contracts-platform`: not present yet.
- `auto/assessment-core`: not present yet.

## Blocked integration work

The following work MUST NOT be implemented until stable Assessment contracts/core are available:

1. `src/assessment/ai/**` tool adapters.
2. `assessment_list_questions` / `assessment_create_questions` / `assessment_update_question` / `assessment_retire_question` handlers.
3. AssessmentService dependency injection into the composition root.
4. Trusted-scope injection (`learningUnitId`, provenance, mutationId) through Assessment tools.
5. Assessment panel registration backed by the real query/application API.
6. Full create-question → reactive UI → reload → session snapshot → update/revision E2E.
7. Duplicate tool-call/idempotency and revision-conflict E2E.
8. IndexedDB fallback integration E2E.

Implementing these before the contract/core branches exist would require inventing private interfaces and violate the architecture boundary.

## Quality gates

| Gate | Status | Notes |
| --- | --- | --- |
| Inspector registry integration | PASS | Integrated without Assessment-specific behavior. |
| Existing inspector compatibility contract | PASS upstream | Registry test integrated; full repo regression still pending executable CI/local workspace. |
| Provider-neutral model contract | PASS upstream | Provider tests integrated. |
| DeepSeek streamed tool-call parsing | PASS upstream | Provider tests integrated. |
| Architecture dependency boundaries | ADDED / EXECUTION PENDING | Static regression test added on integration branch; execution awaits CI/local workspace. |
| Assessment domain contracts | BLOCKED | Upstream branch missing. |
| Assessment repositories/service | BLOCKED | Upstream branch missing. |
| Assessment tool adapters | BLOCKED | Requires contracts/core. |
| App composition root | BLOCKED | Requires contracts/core and later Agent runner interfaces. |
| Full unit/integration/e2e suite | BLOCKED | End-to-end system not assembled yet. |
| lint/build | PENDING | No commit status/CI result is currently attached to the integration branch tip. |
| merge-ready | NO | Required core branches and end-to-end gates are missing. |

## Architecture gate

Current integrated changes preserve the intended boundaries:

- no Assessment UI → IndexedDB dependency;
- no Tool → IndexedDB dependency;
- no Provider → Assessment dependency;
- no Worker-side tool execution added;
- no model-controlled trusted Assessment scope added.

The new architecture-boundary regression test turns the first four dependency rules into executable checks instead of documentation-only conventions.

## Current integration delta

The integration branch is based on current `main` and contains the already-integrated UI/provider baseline plus the integration status document and architecture-boundary test. No upstream Assessment contract/core code has been synthesized locally.

## Next integration action

On the next run:

1. re-check all four upstream branches;
2. compare new commits against the integration branch;
3. integrate only validated, contract-compatible changes;
4. once Assessment contracts/core exist, implement Assessment tool adapters as thin calls into `AssessmentService`;
5. wire trusted execution scope in composition rather than exposing scope fields in model schemas;
6. then add cross-module integration tests before browser E2E;
7. keep `merge-ready = NO` until every mandatory gate passes.
