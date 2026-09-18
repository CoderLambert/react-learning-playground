import { useEffect, useReducer } from "react";
import {
  createGuidedFlowState,
  GUIDED_FLOW_ACTIONS,
  guidedFlowReducer,
} from "./guidedFlow.js";

export function useGuidedFlow({ learningUnitId, activityRevision }) {
  const [state, dispatch] = useReducer(
    guidedFlowReducer,
    { learningUnitId, activityRevision },
    createGuidedFlowState,
  );
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

  return {
    state,
    isCurrentActivity,
    start: () => dispatch({ type: GUIDED_FLOW_ACTIONS.START }),
    exit: () => dispatch({ type: GUIDED_FLOW_ACTIONS.EXIT }),
    startOver: () => dispatch({ type: GUIDED_FLOW_ACTIONS.START_OVER }),
    dispatch,
  };
}
