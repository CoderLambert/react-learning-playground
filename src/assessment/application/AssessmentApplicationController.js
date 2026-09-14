import { createAssessmentOperationToken, isAssessmentOperationCurrent } from "../ui/assessmentOperationOwnership.js";

/**
 * Application boundary for Assessment lifecycle ownership.
 *
 * This layer intentionally exposes view state and commands only. It keeps
 * runtime/query-store internals out of composition consumers while preserving
 * existing AssessmentService/session semantics.
 */
export function createAssessmentApplicationController({ runtime }) {
  if (!runtime) throw new Error("Assessment runtime is required");

  let generation = 0;
  let requestId = 0;
  let state = {
    session: null,
    index: 0,
    answer: null,
    feedback: null,
    error: null,
    starting: false,
    submitting: false,
  };

  const listeners = new Set();

  const notify = () => listeners.forEach((listener) => listener(getView()));
  const setState = (patch) => {
    state = { ...state, ...patch };
    notify();
  };

  const getView = () => ({ ...state });

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const isCurrent = (token) => isAssessmentOperationCurrent(token, {
    generation,
    requestId,
    sessionId: state.session?.id ?? null,
  });

  return Object.freeze({
    subscribe,
    getView,

    async start({ learningUnitId }) {
      const token = createAssessmentOperationToken({
        generation,
        learningUnitId,
        requestId: ++requestId,
      });
      setState({ starting: true, error: null });
      try {
        const session = await runtime.sessionLifecycle.start({ learningUnitId });
        if (!isCurrent(token)) return;
        setState({ session, index: 0, answer: null, feedback: null });
      } catch (error) {
        if (isCurrent(token)) setState({ error: error?.message || "无法开始评测" });
      } finally {
        if (isCurrent(token)) setState({ starting: false });
      }
    },

    async submit({ learningUnitId, sessionId, questionId, answer }) {
      const token = createAssessmentOperationToken({
        generation,
        learningUnitId,
        sessionId,
        requestId: ++requestId,
      });
      setState({ submitting: true, error: null });
      try {
        const result = await runtime.sessionLifecycle.submit({
          learningUnitId,
          sessionId,
          questionId,
          answer,
        });
        if (!isCurrent(token)) return;
        setState({ session: result.session, feedback: result.attempt });
      } catch (error) {
        if (isCurrent(token)) setState({ error: error?.message || "提交答案失败" });
      } finally {
        if (isCurrent(token)) setState({ submitting: false });
      }
    },

    async recover({ learningUnitId }) {
      const recovered = await runtime.sessionLifecycle.recover({ learningUnitId });
      if (recovered) setState({ session: recovered.session, index: recovered.currentIndex });
      return recovered;
    },

    next() {
      setState({ index: state.index + 1, answer: null, feedback: null });
    },
  });
}
