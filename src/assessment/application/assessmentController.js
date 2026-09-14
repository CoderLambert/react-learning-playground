import { createAssessmentOperationToken, isAssessmentOperationCurrent } from "../ui/assessmentOperationOwnership.js";

/**
 * Assessment application boundary.
 *
 * Keeps lifecycle orchestration outside composition roots. UI callers should
 * consume view state and commands rather than runtime/query-store internals.
 */
export function createAssessmentController({ runtime, selectQuestions }) {
  let state = {
    learningUnitId: null,
    session: null,
    index: 0,
    answer: null,
    feedback: null,
    loading: false,
    error: null,
    starting: false,
    submitting: false,
    snapshot: null,
  };

  let generation = 0;
  let requestId = 0;
  const listeners = new Set();

  const emit = () => listeners.forEach((listener) => listener());
  const update = (patch) => {
    state = { ...state, ...patch };
    emit();
  };

  const isCurrent = (token) => isAssessmentOperationCurrent(token, {
    generation,
    learningUnitId: state.learningUnitId,
    sessionId: state.session?.id ?? null,
    requestId,
  });

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    getViewModel() {
      return {
        ...state,
        questions: selectQuestions?.(state.snapshot, state.learningUnitId) ?? [],
        commands: {
          initialize: this.initialize,
          start: this.start,
          submit: this.submit,
          next: this.next,
        },
      };
    },

    async initialize(learningUnitId) {
      const currentGeneration = ++generation;
      const currentRequest = ++requestId;
      const token = createAssessmentOperationToken({
        generation: currentGeneration,
        learningUnitId,
        requestId: currentRequest,
      });

      update({ learningUnitId, loading: true, error: null });
      try {
        const questions = await runtime.service.listQuestions({ trusted: { learningUnitId } });
        if (!isCurrent(token)) return;
        runtime.queryStore.replaceSnapshot({ learningUnitId, questions });
        const recovered = await runtime.sessionLifecycle.recover({ learningUnitId });
        if (!isCurrent(token)) return;
        update({
          snapshot: runtime.queryStore.getSnapshot(),
          session: recovered?.session ?? null,
          index: recovered?.currentIndex ?? 0,
        });
      } catch (error) {
        if (isCurrent(token)) update({ error: error?.message ?? "Assessment initialization failed" });
      } finally {
        if (isCurrent(token)) update({ loading: false });
      }
    },

    async start() {
      if (!state.learningUnitId) return;
      update({ starting: true, error: null });
      try {
        const session = await runtime.sessionLifecycle.start({ learningUnitId: state.learningUnitId });
        update({ session, index: 0, answer: null, feedback: null });
      } catch (error) {
        update({ error: error?.message ?? "Assessment start failed" });
      } finally {
        update({ starting: false });
      }
    },

    async submit({ questionId, answer }) {
      if (!state.session) return;
      update({ submitting: true, error: null });
      try {
        const result = await runtime.sessionLifecycle.submit({
          learningUnitId: state.learningUnitId,
          sessionId: state.session.id,
          questionId,
          answer,
        });
        update({
          session: result.session,
          feedback: { correct: result.attempt.correct },
        });
      } catch (error) {
        update({ error: error?.message ?? "Assessment submit failed" });
      } finally {
        update({ submitting: false });
      }
    },

    next() {
      update({ index: state.index + 1, answer: null, feedback: null });
    },
  };
}
