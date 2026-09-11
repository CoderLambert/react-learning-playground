import { useCallback, useEffect, useMemo, useState } from "react";
import { INSPECTOR_TABS } from "./constants";
import {
  clampInspectorWidth,
  clearPersistedWorkbenchState,
  getBrowserStorage,
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
    () => readPersistedWorkbenchState({ storage, viewportWidth }),
    [storage, viewportWidth],
  );
  const [state, setState] = useState(initialState);

  useEffect(() => {
    persistWorkbenchState(state, { storage, viewportWidth });
  }, [state, storage, viewportWidth]);

  useEffect(() => {
    setState((current) => {
      const nextWidth = clampInspectorWidth(current.inspectorWidth, viewportWidth);
      return nextWidth === current.inspectorWidth
        ? current
        : { ...current, inspectorWidth: nextWidth };
    });
  }, [viewportWidth]);

  const setNavigationCollapsed = useCallback((value) => {
    setState((current) => ({
      ...current,
      navigationCollapsed: typeof value === "function"
        ? Boolean(value(current.navigationCollapsed))
        : Boolean(value),
    }));
  }, []);

  const setInspectorOpen = useCallback((value) => {
    setState((current) => ({
      ...current,
      inspectorOpen: typeof value === "function"
        ? Boolean(value(current.inspectorOpen))
        : Boolean(value),
    }));
  }, []);

  const setInspectorWidth = useCallback((value) => {
    setState((current) => {
      const candidate = typeof value === "function"
        ? value(current.inspectorWidth)
        : value;
      const inspectorWidth = clampInspectorWidth(candidate, viewportWidth);
      return inspectorWidth === current.inspectorWidth
        ? current
        : { ...current, inspectorWidth };
    });
  }, [viewportWidth]);

  const setInspectorTab = useCallback((tab) => {
    if (!INSPECTOR_TABS.includes(tab)) return;
    setState((current) => (
      current.inspectorTab === tab ? current : { ...current, inspectorTab: tab }
    ));
  }, []);

  const setSourceFile = useCallback((fileName) => {
    const sourceFile = typeof fileName === "string" && fileName.trim()
      ? fileName
      : null;
    setState((current) => (
      current.sourceFile === sourceFile ? current : { ...current, sourceFile }
    ));
  }, []);

  const resetPersistedState = useCallback(() => {
    clearPersistedWorkbenchState({ storage });
    setState(readPersistedWorkbenchState({ storage: null, viewportWidth }));
  }, [storage, viewportWidth]);

  return {
    state,
    setNavigationCollapsed,
    setInspectorOpen,
    setInspectorWidth,
    setInspectorTab,
    setSourceFile,
    resetPersistedState,
  };
}
