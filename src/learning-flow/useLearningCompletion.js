import { useCallback, useEffect, useMemo, useState } from "react";
import { createLearnerEvidenceRuntime } from "../learning-evidence/public.js";
import { createLearningCompletionRuntime } from "../learning-completion/public.js";

export function useLearningCompletion({
  learningUnitId,
  assessmentSource,
  refreshKey = "",
} = {}) {
  const [revision, setRevision] = useState(0);
  const [snapshot, setSnapshot] = useState(null);
  const refresh = useCallback(() => setRevision((value) => value + 1), []);
  const runtime = useMemo(() => {
    if (!assessmentSource) return null;
    return createLearningCompletionRuntime({
      evidenceRuntime: createLearnerEvidenceRuntime({ assessmentSource }),
    });
  }, [assessmentSource]);

  const requestKey = [learningUnitId ?? "", refreshKey, revision].join(":");

  useEffect(() => {
    if (!runtime || !learningUnitId) return undefined;
    let cancelled = false;
    void runtime.read({ learningUnitId })
      .then((decision) => {
        if (!cancelled) setSnapshot({ requestKey, decision, error: null });
      })
      .catch((error) => {
        if (!cancelled) {
          setSnapshot({
            requestKey,
            decision: null,
            error: error?.message || "无法读取学习完成状态",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [learningUnitId, requestKey, runtime]);

  const current = snapshot?.requestKey === requestKey ? snapshot : null;
  return Object.freeze({
    decision: current?.decision ?? null,
    error: current?.error ?? null,
    loading: Boolean(runtime && learningUnitId && !current),
    refresh,
  });
}
