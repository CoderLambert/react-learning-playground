# UI Platform Status

**Branch:** `chore/ui-platform-shadcn-tailwind` → `auto/assessment-integration`
**Base HEAD:** `c3743684d8f01873177e51f213d346df621523ee` (`feat: finalize Assessment AI agent integration`)
**Integration HEAD before this status-only commit:** `ac31526e36bc74f9856fab9c5ca12ada4f7abd2e`
**Scope:** Freeze the Tailwind + copy-owned shadcn primitive standard for new
and touched UI. This change deliberately does **not** perform a repository-wide
legacy-CSS bulk migration. No branch was merged, rebased, force-pushed, or
otherwise rewritten during this QA pass.

## Integrated agent commits

| Agent | Commit | Result |
| --- | --- | --- |
| A1 — UI Foundation | `f780f2a` | Tailwind foundation, `cn()`, and dependencies established. |
| A2 — UI Architecture Docs | `639c6b4` | Long-term platform policy documented. |
| A3 — UI Migration Inventory | `ed080ee` | Surface inventory and touched-surface plan recorded. |
| A4 — Shared Primitive Hardening | `c31f391` | Button, Badge, Card, and Progress hardened. |
| A5 — UI Contract Tests | `ac31526` | Platform contract coverage added. |

## Frozen UI contract

- Tailwind remains **3.4.17** with `corePlugins.preflight = false`; this is not
  a Tailwind 3 → 4 migration.
- shadcn is a **copy-owned primitive architecture**: domain-neutral source in
  `src/components/ui/**`, not a second runtime UI library.
- Tailwind utilities are the default presentation method for product UI and
  touched teaching-demo presentation. Existing CSS variables stay as
  compatibility design tokens.
- Feature composition remains in feature folders; `src/demos/**` prioritizes
  teaching semantics. Legacy CSS follows touched-surface migration only.
- Intentional CSS exceptions include third-party overrides, Shiki/editor and
  MDX rendering, print, complex pseudo-elements, and legacy shell/layout
  boundaries.

Dependencies added: `class-variance-authority@^0.7.1`, `clsx@^2.1.1`, and
`tailwind-merge@^3.6.0`. `cn(...inputs)` is `twMerge(clsx(inputs))`.

## Primitive and migration state

- `Button` and `Badge` use CVA variants; Button, Badge, and Card forward refs
  where applicable; all four primitives accept consumer `className` overrides.
- `Card` and `Progress` remain deliberately small, copy-owned primitives.
  Progress exposes native `progressbar` semantics. Presentation is Tailwind
  utilities composed with established CSS-variable tokens.
- The full surface classification and deferred work are in
  [`UI-MIGRATION-INVENTORY.md`](UI-MIGRATION-INVENTORY.md). Assessment is
  migrated; Workbench/navigation remain stable legacy shell work; the Learning
  Inspector, Shiki/source viewer, and note/MDX presentation retain purposeful
  CSS exceptions. AI Assistant is partial; teaching demos and legacy `App.css`
  migrate when materially touched.

## Assessment regression focus

The successful lifecycle E2E uses Playwright `.check()` on labels that resolve
to real native radio inputs and verifies incorrect/correct feedback, evidence
navigation, reload recovery from the stored session snapshot, and completion.
`SingleChoiceQuestion` and `TrueFalseQuestion` keep the input over the option
card inside a native `<label>`; their visual spans use `pointer-events-none`.
Consequently the card label does not intercept the input, while native click,
keyboard selection, and Playwright `.check()` semantics remain available.

The assessed flow covers submit availability via the native disabled submit
button contract, feedback states, source evidence navigation, the next-question
path, reload recovery, and final completion. No label/card interception
regression was found in source review or the passing mock E2E run.

## Verification record

All commands were run sequentially from the integration HEAD above.

| Check | Actual result |
| --- | --- |
| `npm ci` | PASS — 316 packages installed; 0 vulnerabilities. |
| `node --test tests/*.mjs worker/deepseek-assistant/test/*.test.js` | PASS — **224/224**, 0 failed, 0 skipped, 0 todo. |
| `npm run lint` | PASS — 0 errors; 30 existing warnings reported. |
| `npm run build` | PASS — Vite built 1,081 modules. Existing chunk-size warnings only. |
| `npm run test:e2e:mock` | PASS — **46/46** Playwright tests. |
| `wrangler deploy --dry-run` (Wrangler 4.36.0) | PASS — dry-run upload and bindings resolution completed. Existing config warning: unexpected top-level `secrets` field. |

## Remaining legacy debt

- Do not mass-convert `src/App.css`, the Workbench shell, or all teaching demos.
- Convert ordinary feature controls opportunistically when their owning surface
  changes, retaining documented CSS exceptions.
- Future Source/Code Viewer and AI Assistant work may adopt shared primitives
  for ordinary controls while preserving Shiki/editor, Markdown, streaming, and
  layout-specific CSS.
- Existing lint warnings, Vite chunk-size notices, and Wrangler's `secrets`
  configuration warning are outside this UI-platform scope and did not produce
  failed checks.

`UI_ARCHITECTURE_GATE=PASS`
`MERGE_READY=YES`

This readiness status does not authorize automatic merge. The intended PR title
is `chore: standardize shadcn and Tailwind UI platform` and must remain an
unmerged PR from `chore/ui-platform-shadcn-tailwind` to
`auto/assessment-integration`.
