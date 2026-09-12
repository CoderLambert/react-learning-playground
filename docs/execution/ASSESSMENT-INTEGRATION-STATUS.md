# Assessment + AI Agent Integration Status

## Branch

`auto/assessment-integration`

## Current integrated upstream work

### Assessment UI / Inspector

Integrated from `auto/assessment-ui`:

- `LearningInspector` now renders panel descriptors instead of hardcoded note/source/AI sections.
- `src/workbench/inspectorPanels.js` is the inspector panel registry and single source of truth for panel ids/labels.
- `INSPECTOR_TABS` remains as a backward-compatible alias derived from the registry.
- Contract regression test added in `tests/inspector-panel-registry.test.mjs`.

### AI provider boundary

Integrated from `auto/ai-agent-tooling`:

- provider-neutral model turn contract in `src/ai/providers/modelClient.js`.
- DeepSeek Chat Completions adapter with tool definitions, assistant tool calls, tool continuation messages, streamed tool-call argument assembly, and `tool_calls` finish reason support.
- Provider contract tests in `tests/ai-model-provider.test.mjs`.

## Upstream availability

- `auto/assessment-ui`: available and integrated.
- `auto/ai-agent-tooling`: available and integrated.
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
| Existing inspector compatibility contract | PASS upstream | Registry test integrated; full repo regression still pending CI/local executable workspace. |
| Provider-neutral model contract | PASS upstream | Provider tests integrated. |
| DeepSeek streamed tool-call parsing | PASS upstream | Provider tests integrated. |
| Assessment domain contracts | BLOCKED | Upstream branch missing. |
| Assessment repositories/service | BLOCKED | Upstream branch missing. |
| Assessment tool adapters | BLOCKED | Requires contracts/core. |
| App composition root | BLOCKED | Requires contracts/core and later Agent runner interfaces. |
| Full unit/integration/e2e suite | BLOCKED | End-to-end system not assembled yet. |
| lint/build | PENDING | Must be run once executable integration workspace/CI is available. |
| merge-ready | NO | Required core branches and end-to-end gates are missing. |

## Architecture gate

Current integrated changes preserve the intended boundaries:

- no Assessment UI → IndexedDB dependency;
- no Tool → IndexedDB dependency;
- no Provider → Assessment dependency;
- no Worker-side tool execution added;
- no model-controlled trusted Assessment scope added.

## Next integration action

On the next run:

1. re-check all four upstream branches;
2. compare new commits against the integration branch;
3. integrate only validated, contract-compatible changes;
4. once Assessment contracts/core exist, implement Assessment tool adapters as thin calls into `AssessmentService`;
5. then wire composition and add the first cross-module integration tests;
6. keep `merge-ready = NO` until every mandatory gate passes.
