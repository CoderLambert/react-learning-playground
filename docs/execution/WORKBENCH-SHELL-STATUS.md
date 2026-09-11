# Workbench Shell / Navigation Status

Branch: `feat/workbench-shell`

Base integration SHA: `31ed51f0af65022a4ad140f8ee0d310e6877bd13`

## Scope

This branch implements the layout/navigation module defined by the F0 contracts. It intentionally does not perform the final `App.jsx` integration so parallel Inspector, MDX, Source, and State/URL work can proceed without broad shared-file conflicts.

## Implemented

- reusable slot-based `WorkbenchShell`
- three-column desktop grid with `minmax(0, 1fr)` center workspace
- inspector slot that can be present/absent without constraining the center workspace
- collapsible navigation width contract using the F0 CSS tokens
- reusable `WorkbenchNavigation` over raw demo entries or normalized LearningUnits
- category/title/id/description/badge/keyword search compatibility
- focused/all navigation callbacks
- collapsed navigation mode with accessible labels/tooltips
- mobile drawer shell with scrim and close callback
- responsive shell behavior for desktop/tablet/mobile
- no page-level content `max-width` in the Workbench shell, eliminating the current unused right-side workspace once the Integration worker wires it

## Integration contract

The Integration worker should:

1. normalize/pass existing demos to `WorkbenchNavigation` (raw demo entries are also accepted for migration compatibility),
2. keep existing demo/view/search state in `App.jsx` or the later State/URL layer,
3. pass navigation/content/inspector slots into `WorkbenchShell`,
4. keep the top bar inside the content slot,
5. avoid reintroducing the existing `.app-content { max-width: 1080px; margin: 0 auto; }` constraint at the Workbench-shell level; any readable-width constraint should be local to individual demo/note content.

## Explicitly not implemented

- Learning Inspector internals/tabs/resize/focus mode
- MDX runtime or notes
- SourceViewer/CodeViewer migration
- URL state or persistence helpers
- final App wiring

## Validation

Pending exact-branch CI execution after the implementation commit.
