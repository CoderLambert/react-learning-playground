import { useCallback, useEffect, useMemo, useState } from "react";
import { INSPECTOR_TABS } from "./constants";
import {
  clearPersistedWorkbenchState,
  getBrowserStorage,
  getEffectiveInspectorWidth,
  normalizePreferredInspectorWidth,
  persistWorkbenchState,
  readPersistedWorkbenchState,
} from "./stateStorage";

function getViewportWidth() {
  return typeof window !== "undefined" ? window.innerWidth : undefined;
}

export function usePersistedWorkbenchState({
  storage = getBrowserStorage(),
  viewportWidth = getViewportWidth(),
} = {}) {
  const initialState = useMemo(
    () => readPersistedWorkbenchState({ storage }),
    [storage],
  );
  // This state is the user's durable desktop preference. Viewport changes only
  // derive a render width below; they never write a viewport-clamped value back.
  const [preferredState, setPreferredState] = useState(initialState);
  const resolvedState = useMemo(() => {
    const inspectorWidth = getEffectiveInspectorWidth(preferredState.inspectorWidth, viewportWidth);
    return inspectorWidth === preferredState.inspectorWidth
      ? preferredState
      : { ...preferredState, inspectorWidth };
  }, [preferredState, viewportWidth]);

  useEffect(() => {
    persistWorkbenchState(preferredState, { storage });
  }, [preferredState, storage]);

  const setNavigationCollapsed = useCallback((value) => {
    setPreferredState((current) => ({
      ...current,
      navigationCollapsed: typeof value === "function"
        ? Boolean(value(current.navigationCollapsed))
        : Boolean(value),
    }));
  }, []);

  const setInspectorOpen = useCallback((value) => {
    setPreferredState((current) => ({
      ...current,
      inspectorOpen: typeof value === "function"
        ? Boolean(value(current.inspectorOpen))
        : Boolean(value),
    }));
  }, []);

  const setInspectorWidth = useCallback((value) => {
    setPreferredState((current) => {
      const candidate = typeof value === "function"
        ? value(current.inspectorWidth)
        : value;
      const inspectorWidth = normalizePreferredInspectorWidth(candidate);
      return inspectorWidth === current.inspectorWidth
        ? current
        : { ...current, inspectorWidth };
    });
  }, []);

  const setInspectorTab = useCallback((tab) => {
    if (!INSPECTOR_TABS.includes(tab)) return;
    setPreferredState((current) => (
      current.inspectorTab === tab ? current : { ...current, inspectorTab: tab }
    ));
  }, []);

  const setSourceFile = useCallback((fileName) => {
    const sourceFile = typeof fileName === "string" && fileName.trim()
      ? fileName
      : null;
    setPreferredState((current) => (
      current.sourceFile === sourceFile ? current : { ...current, sourceFile }
    ));
  }, []);

  const resetPersistedState = useCallback(() => {
    clearPersistedWorkbenchState({ storage });
    setPreferredState(readPersistedWorkbenchState({ storage: null }));
  }, [storage]);

  return {
    state: resolvedState,
    setNavigationCollapsed,
    setInspectorOpen,
    setInspectorWidth,
    setInspectorTab,
    setSourceFile,
    resetPersistedState,
  };
}
