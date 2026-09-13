import assert from "node:assert/strict";
import test from "node:test";

import { ASSESSMENT_ERROR_CODES } from "../src/assessment/domain/assessmentErrors.js";
import { MemoryAssessmentRepository } from "../src/assessment/infrastructure/memoryAssessmentRepository.js";
import { createIndexedDbAssessmentRepository } from "../src/assessment/infrastructure/indexedDbAssessmentRepository.js";
import { FakeIndexedDB } from "./assessment-repository-fake-indexeddb.mjs";

function session() {
  return {
    id: "session-duplicate",
    learningUnitId: "unit-1",
    status: "in_progress",
    startedAt: "2026-09-13T00:00:00.000Z",
    completedAt: null,
    items: [
      { questionId: "q-1" },
      { questionId: "q-2" },
    ],
  };
}

function attempt(id, answer) {
  return {
    id,
    sessionId: "session-duplicate",
    questionId: "q-1",
    questionRevision: 1,
    answer,
    correct: answer === "a",
    submittedAt: id === "attempt-1" ? "2026-09-13T00:00:01.000Z" : "2026-09-13T00:00:02.000Z",
  };
}

async function assertDuplicateAttemptRejected(repository) {
  await repository.createSession({ session: session() });
  const first = attempt("attempt-1", "a");
  const replay = attempt("attempt-2", "b");

  const saved = await repository.saveAttemptAndProgressSession({
    learningUnitId: "unit-1",
    sessionId: "session-duplicate",
    attempt: first,
    completedAt: "2026-09-13T00:01:00.000Z",
  });
  assert.equal(saved.session.status, "in_progress");

  await assert.rejects(
    repository.saveAttemptAndProgressSession({
      learningUnitId: "unit-1",
      sessionId: "session-duplicate",
      attempt: replay,
      completedAt: "2026-09-13T00:02:00.000Z",
    }),
    (error) => error?.code === ASSESSMENT_ERROR_CODES.DUPLICATE_ATTEMPT,
  );

  assert.deepEqual(
    await repository.listAttempts({ sessionId: "session-duplicate", questionId: "q-1" }),
    [first],
  );
  assert.equal(
    (await repository.getSession({ learningUnitId: "unit-1", sessionId: "session-duplicate" })).status,
    "in_progress",
  );
  repository.close?.();
}

test("MemoryAssessmentRepository rejects a second attempt for the same session question", async () => {
  await assertDuplicateAttemptRejected(new MemoryAssessmentRepository());
});

test("IndexedDbAssessmentRepository atomically rejects a second attempt for the same session question", async () => {
  const repository = await createIndexedDbAssessmentRepository({ indexedDb: new FakeIndexedDB() });
  await assertDuplicateAttemptRejected(repository);
});
