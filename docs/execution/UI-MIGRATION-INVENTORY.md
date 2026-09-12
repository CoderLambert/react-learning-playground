# UI migration inventory

**Audit scope:** `src/App.css`, `src/index.css`, `src/components/**`,
`src/assessment/ui/**`, and `src/demos/**` (with the Workbench CSS files that
own the composed application shell included where they define the audited
surface).

**Snapshot:** Wave 1 of `chore/ui-platform-shadcn-tailwind`. This is an
inventory, not a bulk-migration plan. A status says what should happen when a
surface is next changed; it does not authorize a CSS-only rewrite.

## Status meanings

| Status | Meaning |
| --- | --- |
| `MIGRATED` | The surface already composes the copy-owned primitives and/or Tailwind utilities for its presentation. Keep the pattern for follow-up work. |
| `PARTIAL` | Tailwind/shadcn exists beside surface-local CSS or older class conventions. New controls in the surface use the platform; consolidate only in the same feature change. |
| `LEGACY_STABLE` | Existing CSS is a working, deliberately scoped shell/layout. Do not convert it solely to change technology. |
| `MIGRATE_WHEN_TOUCHED` | A legacy convention is still prevalent. Any new or materially edited control should use Tailwind and, where fitting, `src/components/ui`; leave unrelated code alone. |
| `CSS_EXCEPTION` | Local CSS remains the appropriate owner because it is a third-party override, Shiki/editor presentation, print rule, complex pseudo-element behavior, or a legacy shell/layout boundary. |

## Surface inventory

| Surface | Status | Evidence / current ownership | Migration trigger and direction |
| --- | --- | --- | --- |
| Assessment | `MIGRATED` | `src/assessment/ui/AssessmentPane.jsx`, `SingleChoiceQuestion.jsx`, and `TrueFalseQuestion.jsx` use Tailwind utilities and compose `Button`, `Badge`, `Card`, and `Progress` from `src/components/ui`. Radio inputs remain native inputs, visually overlaid with `peer` utilities so label/card clicks and keyboard selection retain native semantics. | Keep assessment feature composition local. Use the shared primitives for new generic controls; do not add feature-specific rules to the primitive directory. Preserve the native-radio overlay and progressbar semantics in any assessment change. |
| `src/components/ui` primitives | `PARTIAL` | `button.jsx`, `badge.jsx`, `card.jsx`, and `progress.jsx` are copy-owned, Tailwind-presented primitives using `cn()` and existing CSS-variable tokens. Button/Card already forward refs; Badge variants are currently a local map and Progress is intentionally small. | Wave 2 hardens the existing four only: use CVA where variants exist, preserve `className` override behavior and accessibility. Do not add unused Dialog/Tabs/Select/Tooltip primitives. |
| Workbench shell | `LEGACY_STABLE` | `src/workbench/WorkbenchShell.css` (415 lines), `src/workbench/Integration.css` (304 lines), and `src/workbench/tokens.css` own the three-column grid, sticky panes, responsive/mobile transitions, persisted widths, and focus mode used by `WorkbenchShell.jsx` and `App.jsx`. | When changing a discrete toolbar/control, prefer a shared primitive + Tailwind. Retain shell grid, responsive media queries, scrolling, and layout tokens as CSS until a product requirement changes that surface. No shell-wide utility conversion. |
| Navigation | `LEGACY_STABLE` | `src/workbench/WorkbenchNavigation.jsx` is styled by the scoped `.workbench-navigation*` rules in `WorkbenchShell.css`; it contains search, collapsed navigation, active states, and the mobile scrim contract. | If adding/editing an individual action or badge, use a primitive/Tailwind where it can coexist. Keep navigation geometry, collapsed state, and responsive behavior in the owned shell CSS. |
| Learning Inspector | `CSS_EXCEPTION` | `src/components/learning-inspector/LearningInspector.jsx` plus `LearningInspector.css` (283 lines) own a resizable pane, fixed/mobile forms, tabs, and `::after` resize affordance; `Integration.css` supplies intentionally scoped scrollbar integration. | Keep resize mechanics, pseudo-elements, pane positioning, and overflow rules in CSS. New ordinary content inside a tab should use the platform; do not rewrite the inspector frame merely to remove CSS. |
| AI Assistant | `PARTIAL` | `src/components/ai-assistant/AiAssistant.jsx` and its scoped CSS family own streaming transcript/composer, conversation history, citations, context meter, settings, and custom code blocks. It imports third-party `markstream-react/index.css`, then scopes local Markdown overrides under `.ai-assistant-markdown`. | New generic buttons/badges/containers should use primitives/Tailwind as each feature is touched. Retain streaming-specific layout and the scoped Markdown/third-party override rules; do not replace the assistant as a platform-migration exercise. |
| Source Viewer and Code Viewer | `CSS_EXCEPTION` | `src/components/source-viewer/SourceViewer.jsx`/`SourceViewer.css` own source-semantic navigation and inspector/inline layouts. `src/components/CodeViewer.jsx` renders Shiki output, line focus decoration, copy controls, and legacy `.code-*` styles supplied from `src/App.css`. | Keep Shiki output, syntax/line highlight behavior, code scrolling, and source-focus styling in CSS/inline rendering where needed. A touched ordinary action may adopt `Button`; do not migrate Shiki/editor presentation into generic primitives. |
| Note Viewer and MDX teaching components | `CSS_EXCEPTION` | `src/components/notes/NoteViewer.jsx`, `NoteToc.jsx`, and the scoped note rules in `src/workbench/Integration.css` style runtime MDX content. `src/components/mdx/mdx-components.css` styles pedagogical blocks and `.mdx-shiki` code output. | Keep document typography, runtime-MDX content rules, code blocks, and Shiki styling scoped CSS. Use Tailwind for a newly introduced non-document product control; do not flatten MDX semantics into a generic component library. |
| Source Locator | `CSS_EXCEPTION` | `src/components/source-locator/DemoSourceLocator.jsx` and `DemoSourceLocator.css` use overlay positioning, `color-mix`, outlines, and visual targeting states. | Keep overlay/targeting and pseudo/visual effects as local CSS. A non-overlay control added around it can use the platform. |
| Teaching Demos | `MIGRATE_WHEN_TOUCHED` | The 58 files in `src/demos/**` repeatedly use legacy shared classes such as `.demo-*`, `.btn*`, `.badge*`, and `.form-input`; the audit finds 191 `demo-alert`, 163 `btn`, 204 `badge`, and 35 `form-input` references. These rules are global legacy presentation in `src/App.css`. Demos also deliberately use inline styles and CSS variables to make examples readable in isolation. | Preserve teaching semantics and experiment behavior. For a new demo or an edited UI region, prefer Tailwind first and use a generic primitive only when it supports the lesson. Do not mass-convert all demos or change an example solely to eliminate `.demo-*`. |
| Legacy application styles | `MIGRATE_WHEN_TOUCHED` | `src/App.css` is 927 lines and still owns legacy app/top-bar/demo/code utility classes; `src/index.css` defines the established CSS-variable token set and global browser baseline. `index.css` currently includes Tailwind components/utilities while the global reset/tokens remain CSS-owned. | Do not rewrite `App.css` wholesale. Retain CSS variables as compatibility tokens and migrate only a touched product region to the platform. Global baseline/token changes require an explicit cross-surface review. |

## Consequences for upcoming UI work

1. Product UI defaults to copy-owned primitives plus Tailwind utilities. Feature
   composition stays outside `src/components/ui`.
2. Existing CSS variables are shared compatibility tokens, not a reason to
   introduce a second component system.
3. CSS remains intentional for the exception rows above, especially
   Markstream/MDX/Shiki rendering, editor-like source interactions, overlays,
   complex pseudo-elements, and the established Workbench shell.
4. The presence of `.btn`, `.badge`, `.demo-*`, and `.form-input` describes
   existing teaching/legacy code only. They are not the default for new product
   UI.

## Deferred debt (not in this change)

- Gradually replace touched demo controls that consume the legacy global class
  vocabulary; do not compromise a lesson's visual/interaction explanation.
- Move ordinary CodeViewer and SourceViewer actions to shared primitives when
  their feature work naturally changes them, while retaining Shiki-specific
  styling.
- Consolidate AI Assistant's ordinary control styling opportunistically, after
  preserving its third-party Markdown and streaming-layout boundaries.
- Evaluate legacy `App.css` rules only by surface ownership; a line-count-driven
  or all-at-once migration is explicitly out of scope.
