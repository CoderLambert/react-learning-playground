import { useCallback, useEffect, useState } from "react";
import { getActiveAssessmentRuntime } from "../composition/assessmentRuntime.js";

const EMPTY_STATE = Object.freeze({ history: [], review: null, loading: false, error: null });

export function useAssessmentReview({ learningUnitId, activeSessionId = null }) {
  const [state, setState] = useState(EMPTY_STATE);

  const load = useCallback(async (sessionId = activeSessionId) => {
    if (!learningUnitId) {
      setState(EMPTY_STATE);
      return;
    }
    const runtime = getActiveAssessmentRuntime();
    if (!runtime) return;
    setState((current) => ({ ...current, loading: true, error: null }));
    try {
      const history = await runtime.sessionLifecycle.listCompletedReviews({ learningUnitId });
      const selectedId = sessionId && history.some((entry) => entry?.sessionId === sessionId)
        ? sessionId
        : history[0]?.sessionId ?? null;
      const review = selectedId
        ? await runtime.sessionLifecycle.review({ learningUnitId, sessionId: selectedId })
        : null;
      setState({ history: history.filter(Boolean), review, loading: false, error: null });
    } catch (error) {
      setState((current) => ({ ...current, loading: false, error: error?.message || "无法加载评测回顾" }));
    }
  }, [activeSessionId, learningUnitId]);

  useEffect(() => {
    void load(activeSessionId);
  }, [activeSessionId, load]);

  const selectSession = useCallback((sessionId) => {
    void load(sessionId);
  }, [load]);

  return { ...state, selectSession, reload: load };
}
