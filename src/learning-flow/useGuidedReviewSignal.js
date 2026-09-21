import { useCallback, useMemo, useState } from "react";
import { readGuidedSessionReviewSignal } from "../workbench/guidedSessionStorage.js";

export function useGuidedReviewSignal({ definition, storage } = {}) {
  const persistedSignal = useMemo(
    () => readGuidedSessionReviewSignal({ definition, storage }),
    [definition, storage],
  );
  const [liveSignal, setLiveSignal] = useState(null);
  const learningUnitId = definition?.learningUnitId ?? null;
  const hasLiveSignal = liveSignal?.learningUnitId === learningUnitId;

  const setNeedsReview = useCallback((value) => {
    if (!learningUnitId) return;
    const nextNeedsReview = value === true;
    setLiveSignal((current) => (
      current?.learningUnitId === learningUnitId && current.needsReview === nextNeedsReview
        ? current
        : { learningUnitId, needsReview: nextNeedsReview }
    ));
  }, [learningUnitId]);

  return Object.freeze({
    needsReview: hasLiveSignal ? liveSignal.needsReview : persistedSignal.needsReview,
    persistenceStatus: persistedSignal.status,
    setNeedsReview,
  });
}
