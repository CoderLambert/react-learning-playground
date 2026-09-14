import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { createAssessmentRuntime } from "../composition/assessmentRuntime.js";
import { createLearningUnitEvidenceResolver } from "../composition/learningUnitEvidenceResolver.js";
import { selectAssessmentQuestionsForLearningUnit } from "../ui/assessmentScope.js";
import { createAssessmentController } from "./assessmentController.js";

const EMPTY_VIEW = Object.freeze({
  learningUnitId: null,
  session: null,
  currentIndex: 0,
  answer: null,
  feedback: null,
  questions: [],
  initializationErrors: { load: null, recover: null },
  startError: null,
  submitError: null,
  initializing: true,
  starting: false,
  submitting: false,
  storageNotice: null,
  integrationCapabilities: null,
});
const EMPTY_SUBSCRIBE = () => () => {};
const EMPTY_GET_SNAPSHOT = () => EMPTY_VIEW;

export function useAssessmentApplication({ learningUnitId, learningUnitsById }) {
  const [runtime, setRuntime] = useState(null);
  const [runtimeError, setRuntimeError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const evidenceResolver = createLearningUnitEvidenceResolver({
      getLearningUnit: (id) => learningUnitsById.get(id) ?? null,
    });

    setRuntimeError(null);
    void createAssessmentRuntime({ evidenceResolver })
      .then((nextRuntime) => {
        if (!cancelled) setRuntime(nextRuntime);
      })
      .catch((error) => {
        if (!cancelled) setRuntimeError(error?.message || "无法初始化评测存储");
      });

    return () => {
      cancelled = true;
    };
  }, [learningUnitsById]);

  const controller = useMemo(
    () => runtime
      ? createAssessmentController({
          runtime,
          selectQuestions: selectAssessmentQuestionsForLearningUnit,
        })
      : null,
    [runtime],
  );

  useEffect(() => () => controller?.dispose(), [controller]);

  useEffect(() => {
    if (!controller || !learningUnitId) return;
    void controller.commands.initialize(learningUnitId);
  }, [controller, learningUnitId]);

  const view = useSyncExternalStore(
    controller?.subscribe ?? EMPTY_SUBSCRIBE,
    controller?.getSnapshot ?? EMPTY_GET_SNAPSHOT,
    EMPTY_GET_SNAPSHOT,
  );

  const initializationError = [
    runtimeError,
    view.initializationErrors?.load,
    view.initializationErrors?.recover,
  ].filter(Boolean).join("；") || null;

  return {
    view: {
      ...view,
      ready: Boolean(controller),
      initializationError,
    },
    commands: controller?.commands ?? null,
  };
}
