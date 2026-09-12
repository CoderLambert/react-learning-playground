/**
 * @typedef {Object} SourceSemanticRegion
 * @property {string} id Stable build-generated region id within one source file.
 * @property {string} kind Semantic role such as component, reducer, effect or event-handler.
 * @property {string} symbol Display symbol or hook name.
 * @property {number} startLine One-based current source line resolved from the build AST.
 * @property {number} endLine One-based inclusive current source line resolved from the build AST.
 * @property {string | undefined} hookName
 * @property {string | undefined} parentSymbol
 * @property {number} score Build-time relevance score used to choose the core implementation.
 */

/**
 * @typedef {Object} SourceSemantics
 * @property {number} version
 * @property {string | null} path Repository-relative authoritative source path.
 * @property {string | null} parser Build parser identifier.
 * @property {string | null} primaryRegionId
 * @property {SourceSemanticRegion | null} primaryRegion
 * @property {SourceSemanticRegion[]} regions
 */

/**
 * @typedef {Object} LearningSourceFile
 * @property {string} name Stable file identity shown across inline, inspector and AI citation surfaces.
 * @property {string} code Authoritative source text. Learning surfaces must render this instead of duplicating snippets.
 * @property {SourceSemantics | null | undefined} semantics Build-generated semantic navigation metadata.
 */

/**
 * Future normalized learning-unit shape used by Workbench consumers.
 * The existing demo registry remains authoritative during the migration.
 *
 * Current registry mapping:
 * - id -> id
 * - category -> categoryId
 * - label -> title
 * - Component -> component
 * - files -> sources
 * - description/badge/keywords -> searchable metadata
 *
 * @typedef {Object} LearningUnit
 * @property {string} id
 * @property {string} categoryId
 * @property {string} title
 * @property {import("react").ComponentType} component
 * @property {string[]} keywords
 * @property {LearningSourceFile[]} sources
 * @property {string | undefined} description
 * @property {string | undefined} badge
 * @property {object} registryEntry Original registry entry for compatibility during migration.
 */

/**
 * Create a stable Workbench-facing descriptor without mutating or rewriting the
 * existing demo registry. This compatibility adapter is intentionally small so
 * feature branches can consume a LearningUnit contract before App wiring moves.
 *
 * @param {object} demo Existing entry from src/demos/index.js.
 * @returns {LearningUnit}
 */
export function toLearningUnit(demo) {
  if (!demo?.id || !demo?.category || !demo?.label || !demo?.Component) {
    throw new TypeError("Invalid demo registry entry: id, category, label and Component are required.");
  }

  const keywords = demo.keywords ?? [demo.label, demo.id, demo.description, demo.badge].filter(Boolean);

  return {
    id: demo.id,
    categoryId: demo.category,
    title: demo.label,
    component: demo.Component,
    keywords,
    sources: demo.files ?? [],
    description: demo.description,
    badge: demo.badge,
    registryEntry: demo,
  };
}

/**
 * WorkbenchShell is a slot-based layout contract. The shell owns layout only;
 * feature state and content ownership stay with the supplying modules.
 *
 * @typedef {Object} WorkbenchShellSlots
 * @property {import("react").ReactNode} navigation
 * @property {import("react").ReactNode} content
 * @property {import("react").ReactNode} inspector
 */

/**
 * LearningInspector public state contract. The implementation branch may use a
 * reducer or hooks internally, but consumers should only depend on these fields.
 *
 * @typedef {Object} LearningInspectorState
 * @property {boolean} open
 * @property {"notes" | "source" | "ai"} activeTab
 * @property {boolean} focusMode
 * @property {number} width
 * @property {string | null} sourceFile
 */

/**
 * @typedef {Object} LearningInspectorProps
 * @property {LearningUnit} learningUnit
 * @property {LearningInspectorState} state
 * @property {(tab: "notes" | "source" | "ai") => void} onTabChange
 * @property {(open: boolean) => void} onOpenChange
 * @property {(focusMode: boolean) => void} onFocusModeChange
 * @property {(width: number) => void} onWidthChange
 * @property {(fileName: string | null) => void} onSourceFileChange
 */
