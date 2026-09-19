# AI E2E Assertion Ownership Matrix

Issue #244 consolidates overlapping closure-era browser coverage without treating a
smaller test count as success. Each behavior below has one canonical owner; a
journey may still exercise several behaviors when that keeps the assertions in the
same domain and avoids repeated setup.

## Canonical ownership

| Behavior / assertion contract | Canonical suite | Evidence retained |
| --- | --- | --- |
| Final long render (#227) | `tests/e2e/product-closure-ai.spec.js` | `data-finish-reason="stop"`, no `aria-busy="true"`, visible `第 180 段` |
| Long-answer layout and reachability | `tests/e2e/product-closure-ai.spec.js` | Transcript is the vertical scroller, panel overflow is hidden, composer stays inside the panel, copy/follow-up actions remain reachable |
| Current-conversation copy and Markdown/JSON export | `tests/e2e/product-closure-ai.spec.js` | Accessible controls, clipboard content, downloaded filenames, and downloaded Markdown/JSON message content |
| Export popover keyboard behavior | `tests/e2e/product-closure-ai.spec.js` | Escape closes the popover and restores focus to the trigger |
| Stream incremental rendering / single-flight submits | `tests/e2e/ai-stream-termination.spec.js` | Incremental deltas, one assistant message, duplicate submit suppression |
| Stream termination and retry-visible terminal states | `tests/e2e/ai-stream-termination.spec.js` and `tests/e2e/ai-assistant.spec.js` | Provider length, user abort, stream error, normalized error retry, stop/New Chat |
| Large output persistence and reload | `tests/e2e/ai-stream-termination.spec.js` | More than 6000 Unicode characters, IndexedDB status/finish reason, restored answer |
| Conversation create/reload/unit isolation | `tests/e2e/ai-assistant.spec.js` | History count, reload restoration, new-chat isolation, context-bound requests |
| Cross-unit history selection and archived visibility | `tests/e2e/ai-cross-unit-history.spec.js` | Cross-unit navigation/restoration and archived rows not selectable |
| Conversation rename/archive/restore/delete | `tests/e2e/ai-assistant.spec.js` | Normal mutations, confirmation, delete cleanup, and history count |
| Mutation persistence failure recovery | `tests/e2e/ai-assistant.spec.js` | Rename/archive/restore/delete failures remain visible and each operation can be retried |
| History delete focus and Escape recovery | `tests/e2e/ai-assistant.spec.js` | Confirmation receives focus, Escape restores delete focus, successful delete restores list focus |
| Failed-turn retry ownership and invalidation | `tests/e2e/ai-assistant.spec.js` | Retry after failure and invalidation after conversation or learning-unit changes |
| Error announcement ownership | `tests/e2e/ai-assistant.spec.js` | One alert, no duplicate live-status announcement, retry recovery |
| Source citation navigation | `tests/e2e/ai-assistant.spec.js` | Source tab, requested range, and highlighted lines |
| Narrow citation preview containment | `tests/e2e/ai-assistant.spec.js` | Viewport bounds and no transcript horizontal overflow |
| DeepSeek settings and stale connection feedback | `tests/e2e/deepseek-browser-settings.spec.js` | Config persistence/clear and stale request feedback discarded after credential change |
| Source locator composer handoff | `tests/e2e/source-locator-ai.spec.js` | Exact file/range/material prefill without auto-submit |
| Markdown/code-block rendering | `tests/e2e/ai-markdown-rendering.spec.js` | Markstream semantics, collapse/expand, incomplete fences |
| Compaction persistence and prompt ownership | `tests/e2e/ai-compaction.spec.js` and `tests/e2e/ai-gateway-compaction.spec.js` | Durable summaries, full history retention, gateway payload boundaries |

## Closure-era dispositions

| Former suite / journey | Disposition | Reason |
| --- | --- | --- |
| `ai-product-closure.spec.js` long-answer layout | Removed after migration | Duplicate journey of `product-closure-ai.spec.js`; exact panel/transcript overflow assertions moved to the canonical owner, alongside #227 final-render assertions |
| `ai-product-closure.spec.js` export | Removed after migration | Duplicate journey; downloaded Markdown/JSON content checks moved to the canonical accessible export journey |
| `closure-ai-followup.spec.js` DeepSeek stale feedback | Removed after migration | Settings-domain assertion moved to `deepseek-browser-settings.spec.js` |
| `closure-ai-followup.spec.js` delete confirmation/focus | Removed after migration | History-domain keyboard assertions folded into the canonical history mutation journey |
| `closure-ai-followup.spec.js` mutation persistence failures | Removed after migration | Full failure/retry matrix moved to `ai-assistant.spec.js` |
| `closure-ai-followup.spec.js` failed-turn live announcement | Removed after migration | Singular alert/no duplicate live-status assertions folded into the canonical normalized-error retry journey |
| `closure-ai-followup.spec.js` narrow citation preview | Removed after migration | Citation containment assertions moved to the canonical AI assistant suite |

No production AI files, persistence contracts, browser configuration, or required
CI definitions are changed by this audit. The required browser suite inventory in
`scripts/browser-verification-plan.mjs` is updated only to remove the two deleted
spec paths; the AI domain tier and all remaining canonical suites are unchanged.
