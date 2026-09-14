import { AssessmentService } from "../application/AssessmentService.js";
import { createAssessmentCapabilities } from "../ai/assessmentTools.js";
import {
  createIndexedDbAssessmentRepository,
  MemoryAssessmentRepository,
} from "../infrastructure/index.js";
import { createAssessmentQueryStore } from "../store/AssessmentQueryStore.js";

let activeAssessmentRuntime = null;
let assessmentRuntimeGeneration = 0;

export function getActiveAssessmentRuntime() {
  return activeAssessmentRuntime;
}

/**
 * Build the browser-side Assessment object graph. Persistence is the only
 * asynchronous part. Assessment exposes domain-owned capabilities, while
 * app/integration owns any mapping into a generic AI runtime.
 *
 * Runtime activation follows latest-started-wins semantics. React StrictMode
 * may start composition twice and let the cancelled first request finish
 * after the accepted second request. A stale completion must never replace
 * the runtime that belongs to the latest composition request.
 */
export async function createAssessmentRuntime({
  indexedDb = globalThis.indexedDB,
  clock,
  idFactory,
  evidenceValidator,
  evidenceResolver,
} = {}) {
  const generation = ++assessmentRuntimeGeneration;
  let repository;
  let storageNotice = null;

  try {
    repository = await createIndexedDbAssessmentRepository({ indexedDb, clock });
  } catch {
    repository = new MemoryAssessmentRepository({ clock });
    storageNotice = "本地持久化不可用，评测当前为本次会话存储。";
  }

  const queryStore = createAssessmentQueryStore();
  const service = new AssessmentService({
    repository,
    queryStore,
    clock,
    idFactory,
    evidenceValidator,
    evidenceResolver,
  });
  const capabilities = Object.freeze(createAssessmentCapabilities({ assessmentService: service }));
  const sessionLifecycle = Object.freeze({
    async start({ learningUnitId }) {
      return service.startSession({ trusted: { learningUnitId } });
    },
    async submit({ learningUnitId, sessionId, questionId, answer }) {
      const attempt = await service.submitAnswer({
        trusted: { learningUnitId }, sessionId, questionId, answer,
      });
      const session = await repository.getSession({ learningUnitId, sessionId });
      return { attempt, session };
    },
    async recover({ learningUnitId }) {
      const session = typeof repository.reconcileInProgressSessions === "function"
        ? await repository.reconcileInProgressSessions({ learningUnitId })
        : (await repository.listSessions({ learningUnitId, status: "in_progress" }))[0] ?? null;
      if (!session) return null;
      const attempts = await repository.listAttempts({ sessionId: session.id });
      const answeredQuestionIds = new Set(attempts.map((attempt) => attempt.questionId));
      const currentIndex = Math.max(0, session.items.findIndex((item) => !answeredQuestionIds.has(item.questionId)));
      return { session, attempts, currentIndex };
    },
  });

  const runtime = Object.freeze({
    mode: repository.mode,
    storageNotice,
    repository,
    queryStore,
    service,
    capabilities,
    sessionLifecycle,
  });
  if (generation === assessmentRuntimeGeneration) {
    activeAssessmentRuntime = runtime;
  }
  return runtime;
}
