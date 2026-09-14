import { useCallback, useEffect, useRef, useState } from "react";
import { getActiveAssessmentRuntime } from "../composition/assessmentRuntime.js";

const EMPTY_STATE = Object.freeze({ history: [], review: null, loading: false, error: null, storageNotice: null });

export function useAssessmentReview({ learningUnitId, activeSessionId = null }) {
  const [state, setState] = useState(EMPTY_STATE);
  const requestRef = useRef(0);

  const load = useCallback(async (sessionId = activeSessionId) => {
    const requestId = ++requestRef.current;
    if (!learningUnitId) {
      setState(EMPTY_STATE);
      return;
    }
    const runtime = getActiveAssessmentRuntime();
    if (!runtime) return;
    setState((current) => ({ ...current, loading: true, error: null, storageNotice: runtime.storageNotice ?? null }));
    try {
      const history = await runtime.sessionLifecycle.listCompletedReviews({ learningUnitId });
      const selectedId = sessionId && history.some((entry) => entry?.sessionId === sessionId)
        ? sessionId
        : history[0]?.sessionId ?? null;
      const review = selectedId
        ? await runtime.sessionLifecycle.review({ learningUnitId, sessionId: selectedId })
        : null;
      if (requestRef.current !== requestId) return;
      setState({
        history: history.filter(Boolean),
        review,
        loading: false,
        error: null,
        storageNotice: runtime.storageNotice ?? null,
      });
    } catch (error) {
      if (requestRef.current !== requestId) return;
      setState((current) => ({
        ...current,
        loading: false,
        error: error?.message || "无法加载评测回顾",
        storageNotice: runtime.storageNotice ?? null,
      }));
    }
  }, [activeSessionId, learningUnitId]);

  useEffect(() => {
    void load(activeSessionId);
    return () => {
      requestRef.current += 1;
    };
  }, [activeSessionId, load]);

  const selectSession = useCallback((sessionId) => {
    void load(sessionId);
  }, [load]);

  return { ...state, selectSession, reload: load };
}
