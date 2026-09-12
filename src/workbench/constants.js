import { INSPECTOR_PANEL_IDS } from "./inspectorPanels.js";

export const WORKBENCH_DIMENSIONS = Object.freeze({
  navigationExpandedWidth: 288,
  navigationCollapsedWidth: 56,
  inspectorDefaultWidth: 480,
  inspectorMinWidth: 360,
  inspectorMaxWidth: 900,
  inspectorMaxViewportRatio: 0.6,
  resizeHandleWidth: 8,
  keyboardResizeStep: 24,
});

export const WORKBENCH_STORAGE_KEYS = Object.freeze({
  navigationCollapsed: "react-learning-workbench:navigation-collapsed",
  inspectorOpen: "react-learning-workbench:inspector-open",
  inspectorWidth: "react-learning-workbench:inspector-width",
  inspectorTab: "react-learning-workbench:inspector-tab",
  sourceFile: "react-learning-workbench:source-file",
});

export const WORKBENCH_CSS_VARS = Object.freeze({
  navigationWidth: "--workbench-nav-width",
  navigationCollapsedWidth: "--workbench-nav-collapsed-width",
  inspectorWidth: "--workbench-inspector-width",
  inspectorMinWidth: "--workbench-inspector-min-width",
  inspectorMaxWidth: "--workbench-inspector-max-width",
  inspectorMaxViewportWidth: "--workbench-inspector-max-viewport-width",
  resizeHandleWidth: "--workbench-resize-handle-width",
});

// Backward-compatible alias for existing workbench state/storage consumers.
// The registry is now the single source of truth for inspector panel ids.
export const INSPECTOR_TABS = INSPECTOR_PANEL_IDS;

export const DEFAULT_INSPECTOR_STATE = Object.freeze({
  open: true,
  activeTab: "notes",
  focusMode: false,
  width: WORKBENCH_DIMENSIONS.inspectorDefaultWidth,
  sourceFile: null,
});
