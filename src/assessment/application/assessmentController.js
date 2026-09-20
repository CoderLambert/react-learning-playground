import { createId } from "../../platform/ids.js";

function createOperationToken({ generation, learningUnitId, sessionId = null, requestId }) {
  return Object.freeze({ generation, learningUnitId, sessionId, requestId });
}

function isOperationCurrent(token, current) {
  if (!token || !current) return false;
  if (token.generation !== current.generation) return false;
  if (token.learningUnitId !== current.learningUnitId) return false;
  if (token.requestId !== current.requestId) return false;
  if (token.sessionId !== null && token.sessionId !== current.sessionId) return false;
  return true;
}

function createManagerTrustedContext(learningUnitId) {
  return {
    learningUnitId,
    mutationId: createId("assessment-ui"),
    actor: { type: "application" },
    provenance: { source: "assessment_manager" },
  };
}

const errorMessage = (error, fallback) => error?.message || fallback;

/**
 * Assessment-owned application boundary.
 *
 * Runtime, service, repository and query-store internals stay behind this
 * controller. Composition consumers receive only snapshot state, semantic
 * capabilities and commands.
 */
export function createAssessmentController({
  runtime,
  selectQuestions = () => [],
  getCanonicalQuestions = () => [],
}) {
  if (!runtime) throw new Error("Assessment runtime is required");

  let generation = 0;
  let initializationRequestId = 0;
  let startRequestId = 0;
  let submitRequestId = 0;
  let disposed = false;
  const listeners = new Set();

  let state = {
    learningUnitId: null,
    session: null,
    currentIndex: 0,
    answer: null,
    feedback: null,
    questions: [],
    canonicalQuestions: [],
    initializationErrors: { load: null, recover: null },
    startError: null,
    submitError: null,
    initializing: false,
    starting: false,
    submitting: false,
    storageNotice: runtime.storageNotice ?? null,
    integrationCapabilities: runtime.capabilities ?? null,
  };

  const emit = () => {
    if (disposed) return;
    listeners.forEach((listener) => listener());
  };
  const update = (patch) => {
    if (disposed) return;
    state = { ...state, ...patch };
    emit();
  };
  const refreshQuestionsFromSnapshot = () => {
    const snapshot = runtime.queryStore.getSnapshot();
    update({ questions: selectQuestions(snapshot, state.learningUnitId) });
  };

  const unsubscribeQueryStore = runtime.queryStore.subscribe(refreshQuestionsFromSnapshot);

  const currentContext = (requestId) => ({
    generation,
    learningUnitId: state.learningUnitId,
    sessionId: state.session?.id ?? null,
    requestId,
  });

  const refreshQuestions = async (learningUnitId, token, requestKind = "initialize") => {
    try {
      const questions = await runtime.service.listQuestions({ trusted: { learningUnitId } });
      const requestId = requestKind === "initialize" ? initializationRequestId : token.requestId;
      if (!isOperationCurrent(token, currentContext(requestId))) return false;
      runtime.queryStore.replaceSnapshot({ learningUnitId, questions });
      refreshQuestionsFromSnapshot();
      return true;
    } catch (error) {
      if (requestKind === "initialize" && isOperationCurrent(token, currentContext(initializationRequestId))) {
        update({
          initializationErrors: {
            ...state.initializationErrors,
            load: errorMessage(error, "无法加载评测题目"),
          },
        });
      }
      return false;
    }
  };

  const commands = Object.freeze({
    async initialize(learningUnitId) {
      const currentGeneration = ++generation;
      const requestId = ++initializationRequestId;
      startRequestId += 1;
      submitRequestId += 1;
      const token = createOperationToken({ generation: currentGeneration, learningUnitId, requestId });

      const canonicalQuestions = getCanonicalQuestions(learningUnitId);
      if (!Array.isArray(canonicalQuestions)) {
        throw new TypeError("getCanonicalQuestions must return an array");
      }

      state = {
        ...state,
        learningUnitId,
        session: null,
        currentIndex: 0,
        answer: null,
        feedback: null,
        questions: [],
        canonicalQuestions,
        initializationErrors: { load: null, recover: null },
        startError: null,
        submitError: null,
        initializing: true,
        starting: false,
        submitting: false,
      };
      runtime.queryStore.replaceSnapshot({ learningUnitId, questions: [] });
      emit();

      const loadPromise = refreshQuestions(learningUnitId, token);
      const recoverPromise = runtime.sessionLifecycle.recover({ learningUnitId })
        .then((recovered) => {
          if (!isOperationCurrent(token, currentContext(initializationRequestId))) return;
          update({
            session: recovered?.session ?? null,
            currentIndex: recovered?.currentIndex ?? 0,
          });
        })
        .catch((error) => {
          if (!isOperationCurrent(token, currentContext(initializationRequestId))) return;
          update({
            initializationErrors: {
              ...state.initializationErrors,
              recover: errorMessage(error, "无法恢复评测进度"),
            },
          });
        });

      await Promise.allSettled([loadPromise, recoverPromise]);
      if (isOperationCurrent(token, currentContext(initializationRequestId))) {
        update({ initializing: false });
      }
    },

    async retryInitialization() {
      if (!state.learningUnitId) return;
      await commands.initialize(state.learningUnitId);
    },

    setAnswer(answer) {
      update({ answer, submitError: null });
    },

    async start() {
      if (state.questions.length === 0) return;
      return startSessionWithQuestions();
    },

    async startCanonical() {
      if (state.canonicalQuestions.length === 0) return;
      return startSessionWithQuestions(state.canonicalQuestions);
    },

    async submit({ questionId, answer }) {
      if (!state.learningUnitId || !state.session || state.submitting) return;
      const learningUnitId = state.learningUnitId;
      const sessionId = state.session.id;
      const requestId = ++submitRequestId;
      const token = createOperationToken({ generation, learningUnitId, sessionId, requestId });
      const item = state.session.items.find((candidate) => candidate.questionId === questionId);
      update({ submitting: true, submitError: null });
      try {
        const result = await runtime.sessionLifecycle.submit({
          learningUnitId,
          sessionId,
          questionId,
          answer,
        });
        if (!isOperationCurrent(token, currentContext(submitRequestId))) return;
        update({
          session: result.session,
          feedback: {
            correct: result.attempt.correct,
            explanation: item?.snapshot?.content?.explanation ?? "已记录本次作答。",
          },
        });
      } catch (error) {
        if (isOperationCurrent(token, currentContext(submitRequestId))) {
          update({ feedback: null, submitError: errorMessage(error, "提交答案失败") });
        }
      } finally {
        if (isOperationCurrent(token, currentContext(submitRequestId))) update({ submitting: false });
      }
    },

    next() {
      if (!state.session || state.currentIndex >= state.session.items.length - 1) return;
      update({ currentIndex: state.currentIndex + 1, answer: null, feedback: null, submitError: null });
    },

    async updateQuestion({ questionId, expectedRevision, patch }) {
      if (!state.learningUnitId) return;
      try {
        return await runtime.service.updateQuestion({
          trusted: createManagerTrustedContext(state.learningUnitId),
          questionId,
          expectedRevision,
          patch,
        });
      } catch (error) {
        await refreshQuestionsAfterMutationFailure();
        throw error;
      }
    },

    async retireQuestion({ questionId, expectedRevision }) {
      if (!state.learningUnitId) return;
      try {
        return await runtime.service.retireQuestion({
          trusted: createManagerTrustedContext(state.learningUnitId),
          questionId,
          expectedRevision,
        });
      } catch (error) {
        await refreshQuestionsAfterMutationFailure();
        throw error;
      }
    },
  });

  async function startSessionWithQuestions(questionRecords) {
    if (!state.learningUnitId || state.starting) return;
    if (questionRecords !== undefined && (!Array.isArray(questionRecords) || questionRecords.length === 0)) return;
    const learningUnitId = state.learningUnitId;
    const requestId = ++startRequestId;
    const token = createOperationToken({ generation, learningUnitId, requestId });
    update({ starting: true, startError: null });
    try {
      const session = await runtime.sessionLifecycle.start({
        learningUnitId,
        ...(questionRecords ? { questionRecords } : {}),
      });
      if (!isOperationCurrent(token, currentContext(startRequestId))) return;
      update({
        session,
        currentIndex: 0,
        answer: null,
        feedback: null,
        submitError: null,
      });
      return session;
    } catch (error) {
      if (isOperationCurrent(token, currentContext(startRequestId))) {
        update({ startError: errorMessage(error, "无法开始评测") });
      }
      return undefined;
    } finally {
      if (isOperationCurrent(token, currentContext(startRequestId))) update({ starting: false });
    }
  }

  async function refreshQuestionsAfterMutationFailure() {
    if (!state.learningUnitId) return;
    try {
      const questions = await runtime.service.listQuestions({ trusted: { learningUnitId: state.learningUnitId } });
      runtime.queryStore.replaceSnapshot({ learningUnitId: state.learningUnitId, questions });
      refreshQuestionsFromSnapshot();
    } catch {
      // Preserve the last scoped snapshot if refresh also fails.
    }
  }

  return Object.freeze({
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot() {
      return state;
    },
    commands,
    dispose() {
      if (disposed) return;
      disposed = true;
      generation += 1;
      initializationRequestId += 1;
      startRequestId += 1;
      submitRequestId += 1;
      unsubscribeQueryStore?.();
      listeners.clear();
    },
  });
}
