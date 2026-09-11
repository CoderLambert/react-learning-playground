# Browser AI Workspace V2 — Integration Status

## Scope

This document records the browser-first AI workspace integration built on `integration/browser-ai-workspace-v2`.

- Original integration base: `6ed8b88b3d46ddae1195f474466a3fd979645b48`
- Fully merged module base before cross-module wiring: `135a29de56cd14bfc201a84b7a84883d5703eb91`
- Integration branch: `feat/browser-ai-workspace-integration`
- Validated implementation head before this evidence-only documentation commit: `5552b153e427af202fd69b1748f9ab76c3ac17eb`
- Module PRs: #56 context budgeting/compaction, #57 source citations, #59 conversation persistence, #60 code-block stability

## Architecture

The implementation intentionally keeps the existing provider-neutral streaming runtime. No LangChain/LangGraph or new agent framework is introduced.

### Browser-first BYOK

- DeepSeek browser direct mode remains the preferred no-backend path when browser CORS/network policy permits it.
- Gateway mode remains a fallback.
- `DEEPSEEK_API_KEY` is never added to IndexedDB, context snapshots, compaction summaries, URLs, logs, or the project backend.
- Existing session/local-storage behavior remains explicit through `deepseekBrowserSettings`.
- Direct streaming requests ask the provider for streaming usage with `stream_options.include_usage` and normalize the final usage into the application-owned message model.

### Conversation persistence

Storage schema version: `react-learning-ai` / v1.

Stores:

- `conversations`
- `messages`
- `contextSnapshots`
- `compactions`

`ConversationRepository` owns create/list/rename/archive/delete, message durability, context-snapshot deduplication, interrupted-stream recovery, and durable compaction checkpoints. The UI exposes a compact `<details>` conversation control rather than permanently consuming another inspector column, which also keeps the narrow/mobile inspector usable.

Streaming writes are coalesced by `StreamingMessagePersister`; final completion/stop/error writes force durable state. Assistant-record creation is single-flight per request, persistence operations are serialized, and finalization waits for the queue plus final persister flush before conversation refresh. This prevents duplicate assistant rows when START/DELTA/DONE arrive before the first IndexedDB append resolves. A reload hydrates the latest conversation for the current learning unit. Conversations are scoped by `learningUnitId`, preventing a previous Demo's transcript from becoming the next Demo's model history.

## Source citation protocol

Canonical source references are application-owned URLs rather than arbitrary external links:

```md
[ComponentJsxPureRenderDemo.jsx:L120](source://ComponentJsxPureRenderDemo.jsx#L120)
[ComponentJsxPureRenderDemo.jsx:L44-L46](source://ComponentJsxPureRenderDemo.jsx#L44-L46)
```

Legacy `[File.jsx:Lx-Ly]` extraction remains supported by the citation parser. Assistant answers render extracted references as `SourceCitation` controls. Opening a valid citation:

1. opens the Learning Inspector;
2. switches to the Source tab;
3. selects the cited source file;
4. scrolls to the requested start line;
5. highlights the requested line/range.

A citation for a file not registered in the current learning unit is ignored non-fatally.

## Code-block rendering

Markstream remains the Markdown renderer. The scoped AI code-block renderer unmounts the heavy `CodeBlockNode` while collapsed rather than visually hiding it. This prevents the prior overlap/garbling regression while retaining Copy, Expand/Collapse, accessibility labels, long-line scrolling, and reduced-motion behavior.

## Context budget

`buildContextBudget()` separates:

- system prompt;
- current note;
- current sources;
- durable summary;
- recent history;
- current input.

The UI displays estimated values using `ContextMeter`; provider usage is shown separately when returned. The application soft budget is distinct from the provider model context window. Unknown models use the context module's conservative fallback metadata.

`selectContextWithinBudget()` always preserves current system + current note/source + summary + current input first, then fills the remaining budget with the newest contiguous conversation tail. Pruning is explicit metadata rather than silent deletion.

## Compaction semantics

Manual and automatic compaction use the provider-neutral `createCompactionService()` contract.

- Automatic compaction is triggered from the application soft-budget/compaction threshold, not the model hard window.
- Compaction never deletes or mutates original conversation messages.
- A durable checkpoint records `coveredThroughMessageId`, before/after estimated tokens, summary version, reason, and timestamp.
- A new compaction chains from the latest durable structured summary.
- Concurrent compaction is guarded and reuses the in-flight promise.
- Failure leaves the original history intact and produces a non-fatal notice.
- Manual compaction exposes the estimated before/after token counts to the user.

For the current integration, the injected summarizer uses the configured AI client and requests structured JSON. Invalid JSON falls back to a conservative structured summary rather than deleting history.

## Security boundary

Persisted metadata is recursively sanitized for secret-shaped keys. Context snapshots contain only learning context/model metadata; the browser API key is not passed into the repository layer. User-authored message content remains conversation data by design.

## Validation

Exact-head validation passed on implementation head `5552b153e427af202fd69b1748f9ab76c3ac17eb`:

- React Learning Verify — run `34620895789` — PASS
- Workbench State URL Verify — run `34620895904` — PASS
- Workbench Integration Verify — run `34620895773` — PASS
  - Build — PASS
  - Browser E2E — PASS (27/27 Chromium tests)
  - Preview HTTP smoke — PASS under `/react-learning-playground/`

The validation workflow covers root dependency installation/build plus focused AI/storage/context coverage, lint/build gates, Chromium E2E, and production preview smoke. Additional integrated browser coverage includes source citation jump/highlight, Context Meter visibility, persisted conversation reload with exactly one user and one assistant record, existing streaming/Stop/New Chat behavior, and the inherited Markstream code-block regression coverage.

Because this status-file update is evidence-only, its resulting commit must also receive exact-head CI before #67 is merged.

## Known limitations / manual debt

- Browser-only direct DeepSeek requests still depend on current DeepSeek CORS/network policy.
- Live-provider validation requires a user-owned credential and is not substituted by mocked deterministic CI.
- The conversation store currently uses the isolated native IndexedDB adapter from PR #59 rather than Dexie because that module intentionally avoided an unsafe lockfile edit in its original constrained environment. Repository/UI contracts are adapter-independent; replacing the store implementation with Dexie remains localized if made a hard release requirement.
- Real screen-reader validation and non-Chromium browser acceptance remain manual unless separately executed and evidenced.
