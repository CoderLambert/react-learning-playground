import { useCallback, useEffect, useMemo, useState } from "react";
import { LEARNING_ACTION_EVENT } from "../learning-actions/learningActions.js";
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
  const resolvedState = useMemo(() => {
    const inspectorWidth = clampInspectorWidth(state.inspectorWidth, viewportWidth);
    return inspectorWidth === state.inspectorWidth
      ? state
      : { ...state, inspectorWidth };
  }, [state, viewportWidth]);

  useEffect(() => {
    persistWorkbenchState(resolvedState, { storage, viewportWidth });
  }, [resolvedState, storage, viewportWidth]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const handleLearningAction = () => {
      setState((current) => ({
        ...current,
        inspectorOpen: true,
        inspectorTab: "ai",
      }));
    };
    window.addEventListener(LEARNING_ACTION_EVENT, handleLearningAction);
    return () => window.removeEventListener(LEARNING_ACTION_EVENT, handleLearningAction);
  }, []);

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
    state: resolvedState,
    setNavigationCollapsed,
    setInspectorOpen,
    setInspectorWidth,
    setInspectorTab,
    setSourceFile,
    resetPersistedState,
  };
}
