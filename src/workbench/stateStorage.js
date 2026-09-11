import {
  DEFAULT_INSPECTOR_STATE,
  INSPECTOR_TABS,
  WORKBENCH_DIMENSIONS,
  WORKBENCH_STORAGE_KEYS,
} from "./constants";

export const DEFAULT_PERSISTED_WORKBENCH_STATE = Object.freeze({
  navigationCollapsed: false,
  inspectorOpen: DEFAULT_INSPECTOR_STATE.open,
  inspectorWidth: DEFAULT_INSPECTOR_STATE.width,
  inspectorTab: DEFAULT_INSPECTOR_STATE.activeTab,
  sourceFile: DEFAULT_INSPECTOR_STATE.sourceFile,
});

export function getBrowserStorage() {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function clampInspectorWidth(value, viewportWidth) {
  const parsed = Number(value);
  const fallback = WORKBENCH_DIMENSIONS.inspectorDefaultWidth;
  const normalized = Number.isFinite(parsed) ? parsed : fallback;

  const viewportMax = Number.isFinite(viewportWidth) && viewportWidth > 0
    ? Math.floor(viewportWidth * WORKBENCH_DIMENSIONS.inspectorMaxViewportRatio)
    : WORKBENCH_DIMENSIONS.inspectorMaxWidth;

  const effectiveMax = Math.max(
    WORKBENCH_DIMENSIONS.inspectorMinWidth,
    Math.min(WORKBENCH_DIMENSIONS.inspectorMaxWidth, viewportMax),
  );

  return Math.min(
    effectiveMax,
    Math.max(WORKBENCH_DIMENSIONS.inspectorMinWidth, Math.round(normalized)),
  );
}

function readStorageValue(storage, key) {
  if (!storage) return null;

  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorageValue(storage, key, value) {
  if (!storage) return false;

  try {
    if (value === null || value === undefined || value === "") {
      storage.removeItem(key);
    } else {
      storage.setItem(key, String(value));
    }
    return true;
  } catch {
    return false;
  }
}

function parseBoolean(value, fallback) {
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

function parseInspectorTab(value) {
  return INSPECTOR_TABS.includes(value)
    ? value
    : DEFAULT_PERSISTED_WORKBENCH_STATE.inspectorTab;
}

function parseSourceFile(value) {
  return typeof value === "string" && value.trim() ? value : null;
}

export function readPersistedWorkbenchState({
  storage = getBrowserStorage(),
  viewportWidth,
} = {}) {
  return {
    navigationCollapsed: parseBoolean(
      readStorageValue(storage, WORKBENCH_STORAGE_KEYS.navigationCollapsed),
      DEFAULT_PERSISTED_WORKBENCH_STATE.navigationCollapsed,
    ),
    inspectorOpen: parseBoolean(
      readStorageValue(storage, WORKBENCH_STORAGE_KEYS.inspectorOpen),
      DEFAULT_PERSISTED_WORKBENCH_STATE.inspectorOpen,
    ),
    inspectorWidth: clampInspectorWidth(
      readStorageValue(storage, WORKBENCH_STORAGE_KEYS.inspectorWidth),
      viewportWidth,
    ),
    inspectorTab: parseInspectorTab(
      readStorageValue(storage, WORKBENCH_STORAGE_KEYS.inspectorTab),
    ),
    sourceFile: parseSourceFile(
      readStorageValue(storage, WORKBENCH_STORAGE_KEYS.sourceFile),
    ),
  };
}

export function persistWorkbenchState(state, {
  storage = getBrowserStorage(),
  viewportWidth,
} = {}) {
  if (!state || typeof state !== "object") return false;

  const normalized = {
    navigationCollapsed: Boolean(state.navigationCollapsed),
    inspectorOpen: state.inspectorOpen !== false,
    inspectorWidth: clampInspectorWidth(state.inspectorWidth, viewportWidth),
    inspectorTab: parseInspectorTab(state.inspectorTab),
    sourceFile: parseSourceFile(state.sourceFile),
  };

  const results = [
    writeStorageValue(storage, WORKBENCH_STORAGE_KEYS.navigationCollapsed, normalized.navigationCollapsed),
    writeStorageValue(storage, WORKBENCH_STORAGE_KEYS.inspectorOpen, normalized.inspectorOpen),
    writeStorageValue(storage, WORKBENCH_STORAGE_KEYS.inspectorWidth, normalized.inspectorWidth),
    writeStorageValue(storage, WORKBENCH_STORAGE_KEYS.inspectorTab, normalized.inspectorTab),
    writeStorageValue(storage, WORKBENCH_STORAGE_KEYS.sourceFile, normalized.sourceFile),
  ];

  return results.every(Boolean);
}

export function clearPersistedWorkbenchState({ storage = getBrowserStorage() } = {}) {
  if (!storage) return false;

  try {
    Object.values(WORKBENCH_STORAGE_KEYS).forEach((key) => storage.removeItem(key));
    return true;
  } catch {
    return false;
  }
}
