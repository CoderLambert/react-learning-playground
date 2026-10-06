import assert from "node:assert/strict";
import test from "node:test";

import {
  LEARNING_COMPLETION_NEXT_ACTION,
  LEARNING_COMPLETION_STATUS,
  LearningCompletionContractError,
  createLearningCompletionRuntime,
} from "../src/learning-completion/public.js";

function notStartedProjection() {
  return {
    contractVersion: "learner-evidence-v1",
    learningUnitId: "props",
    sources: [{
      source: "guided",
      sourceRef: { activityRevision: 1 },
      lifecycle: { status: "not_started", updatedAt: null },
      learnerState: { needsReview: false },
      records: [],
    }],
  };
}

test("Completion runtime reads frozen Learner Evidence and returns one deterministic decision", async () => {
  let reads = 0;
  const runtime = createLearningCompletionRuntime({
    evidenceRuntime: {
      async read({ learningUnitId }) {
        reads += 1;
        assert.equal(learningUnitId, "props");
        return notStartedProjection();
      },
    },
  });

  const decision = await runtime.read({ learningUnitId: "props" });
  assert.equal(reads, 1);
  assert.equal(decision.status, LEARNING_COMPLETION_STATUS.NOT_STARTED);
  assert.equal(decision.nextAction, LEARNING_COMPLETION_NEXT_ACTION.START_PRACTICE);
  assert.equal(decision.canContinue, false);
  assert.equal(Object.isFrozen(decision), true);
});

test("Completion runtime fails closed when Learner Evidence violates the frozen contract", async () => {
  const runtime = createLearningCompletionRuntime({
    evidenceRuntime: {
      async read() {
        return { contractVersion: "wrong", learningUnitId: "props", sources: [] };
      },
    },
  });

  await assert.rejects(
    () => runtime.read({ learningUnitId: "props" }),
    (error) => error instanceof LearningCompletionContractError
      && error.code === "LEARNER_EVIDENCE_INVALID",
  );
});
