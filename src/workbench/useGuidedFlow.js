import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import {
  createGuidedFlowState,
  GUIDED_FLOW_ACTIONS,
  guidedFlowReducer,
} from "./guidedFlow.js";
import {
  createGuidedSessionPersistence,
  GUIDED_SESSION_PERSISTENCE_STATUS,
  restoreGuidedFlowState,
} from "./guidedSessionStorage.js";

function createInitialGuidedFlowState({ learningUnitId, activityRevision, definition, persistence }) {
  const fallback = createGuidedFlowState({ learningUnitId, activityRevision });
  const result = persistence.read();

  if (result.status !== GUIDED_SESSION_PERSISTENCE_STATUS.RESTORED) {
    return { state: fallback, persistenceStatus: result.status };
  }

  try {
    return {
      state: restoreGuidedFlowState(result.snapshot, { definition }),
      persistenceStatus: result.status,
    };
  } catch {
    return {
      state: fallback,
      persistenceStatus: GUIDED_SESSION_PERSISTENCE_STATUS.INVALID,
    };
  }
}

export function getGuidedPersistenceNotice(status) {
  if (status === GUIDED_SESSION_PERSISTENCE_STATUS.INVALID) {
    return "上次 Guided session 数据无法使用，已安全重置为新 session。";
  }
  if (status === GUIDED_SESSION_PERSISTENCE_STATUS.INCOMPATIBLE) {
    return "Guided Activity 已更新，旧 session 与当前版本不兼容，已安全重置。";
  }
  if (status === GUIDED_SESSION_PERSISTENCE_STATUS.UNAVAILABLE) {
    return "本地持久化不可用，当前 Guided session 仍可继续，但只在本次页面会话中保留。";
  }
  return null;
}

export function useGuidedFlow({
  learningUnitId,
  activityRevision,
  definition,
  storage,
  clock,
}) {
  const persistence = useMemo(
    () => createGuidedSessionPersistence({ definition, storage, clock }),
    [clock, definition, storage],
  );
  const [initial] = useState(() => createInitialGuidedFlowState({
    learningUnitId,
    activityRevision,
    definition,
    persistence,
  }));
  const [state, dispatch] = useReducer(guidedFlowReducer, initial.state);
  const [persistenceStatus, setPersistenceStatus] = useState(initial.persistenceStatus);
  const skipInitialPersistence = useRef(true);
  const isCurrentActivity = state.learningUnitId === learningUnitId
    && state.activityRevision === activityRevision;

  useEffect(() => {
    if (isCurrentActivity) return;
    dispatch({
      type: GUIDED_FLOW_ACTIONS.RESET_SESSION,
      learningUnitId,
      activityRevision,
    });
  }, [activityRevision, isCurrentActivity, learningUnitId]);

  useEffect(() => {
    if (!isCurrentActivity) return;
    if (skipInitialPersistence.current) {
      skipInitialPersistence.current = false;
      return;
    }
    if (state.completionState === "not-started") return;

    const result = persistence.write(state);
    if (!result.ok) {
      // Storage failure is an external-system result that must be surfaced after the write attempt.
      // oxlint-disable-next-line react/set-state-in-effect -- report an external storage failure to the UI.
      setPersistenceStatus(GUIDED_SESSION_PERSISTENCE_STATUS.UNAVAILABLE);
    }
  }, [isCurrentActivity, persistence, state]);

  const startOver = useCallback(() => {
    const result = persistence.clear();
    if (!result.ok) setPersistenceStatus(GUIDED_SESSION_PERSISTENCE_STATUS.UNAVAILABLE);
    dispatch({ type: GUIDED_FLOW_ACTIONS.START_OVER });
  }, [persistence]);

  return {
    state,
    isCurrentActivity,
    persistenceStatus,
    persistenceNotice: getGuidedPersistenceNotice(persistenceStatus),
    start: () => dispatch({ type: GUIDED_FLOW_ACTIONS.START }),
    exit: () => dispatch({ type: GUIDED_FLOW_ACTIONS.EXIT }),
    startOver,
    dispatch,
  };
}
