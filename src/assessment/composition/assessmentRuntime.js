import { AgentRunner } from "../../ai/agent/AgentRunner.js";
import { ToolExecutor } from "../../ai/agent/ToolExecutor.js";
import { ToolPolicy } from "../../ai/agent/ToolPolicy.js";
import { ToolRegistry } from "../../ai/agent/ToolRegistry.js";
import { assertModelClient } from "../../ai/providers/modelClient.js";
import { AssessmentService } from "../application/AssessmentService.js";
import { createAssessmentToolDefinitions } from "../ai/assessmentTools.js";
import {
  createIndexedDbAssessmentRepository,
  MemoryAssessmentRepository,
} from "../infrastructure/index.js";
import { createAssessmentQueryStore } from "../store/AssessmentQueryStore.js";

let activeAssessmentRuntime = null;

export function getActiveAssessmentRuntime() {
  return activeAssessmentRuntime;
}

/**
 * Build the browser-side Assessment object graph. Persistence is the only
 * asynchronous part; the application, tool, and agent layers stay behind
 * this composition boundary.
 */
export async function createAssessmentRuntime({
  indexedDb = globalThis.indexedDB,
  clock,
  idFactory,
  evidenceValidator,
  evidenceResolver,
} = {}) {
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
  const registry = new ToolRegistry();
  for (const definition of createAssessmentToolDefinitions({ assessmentService: service })) {
    registry.register(definition);
  }
  const toolExecutor = new ToolExecutor({ registry, policy: new ToolPolicy() });
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
      const [session] = await repository.listSessions({ learningUnitId, status: "in_progress" });
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
    registry,
    toolExecutor,
    sessionLifecycle,
    createAgentRunner(modelClient, options = {}) {
      return new AgentRunner({
        modelClient: assertModelClient(modelClient),
        toolRegistry: registry,
        toolExecutor,
        ...options,
      });
    },
  });
  activeAssessmentRuntime = runtime;
  return runtime;
}
