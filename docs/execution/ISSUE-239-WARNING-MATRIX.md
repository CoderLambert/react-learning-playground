# Issue #239 Workbench/UI warning matrix

Execution base: `03512f928f8d4d29ba1c8e673a7fe56a130de998`

Fresh baseline command: `npm run lint`

## In-scope warnings

| Surface | Fresh warning | Disposition | Contract evidence |
| --- | --- | --- | --- |
| `src/components/learning-inspector/LearningInspector.jsx:43-44` | `react/refs`: ref values were written during render. | Moved the two callback ref assignments into an effect that runs after commit. | Mobile Escape handling still reads the latest focus mode/callback from refs; focus, close, and responsive modal behavior remain effect-owned. |
| `src/workbench/useGuidedFlow.js:88` | `react/set-state-in-effect`: persistence failure status was updated after a storage write. | Kept the update and added a line-local suppression with rationale. | The write is an external-system synchronization; its failure must surface as `UNAVAILABLE` without changing Guided state or persistence format. |
| `src/components/notes/NoteViewer.jsx:65` | `react/set-state-in-effect`: selected note text was cleared when the learning unit changed. | Removed the reset effect. Selection state now carries its learning-unit identity and derives an empty selection for another unit. | Switching notes cannot leak selected text into learning-actions context; Notes rendering/loading behavior is unchanged. |
| `src/components/source-viewer/SourceViewer.jsx:149,152-153` | `react/set-state-in-effect`: semantic selection was synchronized from focus/file/mode inputs; `react-hooks/exhaustive-deps` also reported the omitted primary region. | Removed the synchronization effect. Semantic selection is derived from a context key, while explicit user selection (including “完整文件”) is retained for that context. | Citation focus still wins for the active file; inline primary-region defaults, file changes, and Source learning-actions remain intact without a dependency-sensitive effect. |

## Adjacent-surface result

The fresh baseline reported no additional warnings in `src/workbench/**` or the scoped adjacent Workbench/source UI beyond the rows above. No shared shell, global style, registry, package, workflow, persistence schema, or public contract was changed.

## Post-change result

`npm run lint` completes successfully. Its remaining warnings are outside this Issue’s scope in demo teaching samples and assessment application code; no Workbench, Learning Inspector, Notes, or Source Viewer warning remains.
