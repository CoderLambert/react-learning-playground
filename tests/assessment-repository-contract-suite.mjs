import assert from "node:assert/strict";
import test from "node:test";

import { ASSESSMENT_ERROR_CODES } from "../src/assessment/domain/assessmentErrors.js";

function question(id, learningUnitId, overrides = {}) {
  return {
    id,
    learningUnitId,
    type: "single_choice",
    content: { prompt: `Prompt ${id}` },
    status: "active",
    revision: 1,
    createdAt: "2026-09-12T00:00:00.000Z",
    updatedAt: "2026-09-12T00:00:00.000Z",
    provenance: { source: "test" },
    ...overrides,
  };
}

function session(id, learningUnitId) {
  return {
    id,
    learningUnitId,
    status: "in_progress",
    startedAt: "2026-09-12T00:00:00.000Z",
    items: [],
  };
}

function attempt(id, sessionId, questionId, overrides = {}) {
  return {
    id,
    sessionId,
    questionId,
    questionRevision: 1,
    answer: "a",
    correct: true,
    submittedAt: `2026-09-12T00:00:0${id.slice(-1)}.000Z`,
    ...overrides,
  };
}

export function registerAssessmentRepositoryContract({ name, createRepository }) {
  async function fresh() {
    const repository = await createRepository();
    return repository;
  }

  test(`${name}: required question queries are scoped and deterministic`, async () => {
    const repository = await fresh();
    const first = question("q-2", "unit-1");
    const second = question("q-1", "unit-1");
    await repository.createQuestions({
      learningUnitId: "unit-1",
      questions: [first, second],
      mutationId: "create-1",
    });
    await repository.createQuestions({
      learningUnitId: "unit-2",
      questions: [question("q-other", "unit-2")],
      mutationId: "create-other",
    });

    assert.deepEqual(await repository.listQuestions({ learningUnitId: "unit-1" }), [second, first]);
    assert.deepEqual(
      await repository.listQuestions({ learningUnitId: "unit-1", status: "retired" }),
      [],
    );
    assert.deepEqual(await repository.getQuestion({ learningUnitId: "unit-1", questionId: "q-1" }), second);
    assert.equal(await repository.getQuestion({ learningUnitId: "unit-2", questionId: "q-1" }), null);
    assert.equal(await repository.getQuestion({ learningUnitId: "unit-1", questionId: "q-other" }), null);
    repository.close?.();
  });

  test(`${name}: create is atomic and replaying a mutation does not write twice`, async () => {
    const repository = await fresh();
    const first = question("q-1", "unit-1");
    const created = await repository.createQuestions({
      learningUnitId: "unit-1",
      questions: [first],
      mutationId: "create-1",
    });
    assert.deepEqual(created, { result: [first], replayed: false });

    const replay = await repository.createQuestions({
      learningUnitId: "unit-1",
      questions: [question("q-forged", "unit-1")],
      mutationId: "create-1",
    });
    assert.deepEqual(replay, { result: [first], replayed: true });
    assert.deepEqual(await repository.listQuestions({ learningUnitId: "unit-1" }), [first]);
    assert.deepEqual(await repository.getMutationReceipt({ mutationId: "create-1" }), {
      mutationId: "create-1",
      operation: "createQuestions",
      result: [first],
      createdAt: "2026-09-12T00:00:00.000Z",
    });

    await assert.rejects(
      repository.createQuestions({
        learningUnitId: "unit-1",
        questions: [question("q-2", "unit-1"), first],
        mutationId: "create-failed",
      }),
      /already exists/,
    );
    assert.equal(await repository.getQuestion({ learningUnitId: "unit-1", questionId: "q-2" }), null);
    assert.equal(await repository.getMutationReceipt({ mutationId: "create-failed" }), null);
    repository.close?.();
  });

  test(`${name}: update is revision checked, immutable, and idempotent`, async () => {
    const repository = await fresh();
    const first = question("q-1", "unit-1");
    await repository.createQuestions({ learningUnitId: "unit-1", questions: [first], mutationId: "create-1" });

    const updated = {
      ...first,
      title: "updated",
      revision: 2,
    };
    assert.deepEqual(
      await repository.updateQuestion({
        learningUnitId: "unit-1",
        questionId: "q-1",
        expectedRevision: 1,
        patch: { title: "updated" },
        mutationId: "update-1",
      }),
      { result: updated, replayed: false },
    );

    const replay = await repository.updateQuestion({
      learningUnitId: "unit-1",
      questionId: "q-1",
      expectedRevision: 1,
      patch: { title: "forged replay" },
      mutationId: "update-1",
    });
    assert.deepEqual(replay, { result: updated, replayed: true });
    await assert.rejects(
      repository.updateQuestion({
        learningUnitId: "unit-1",
        questionId: "q-1",
        expectedRevision: 1,
        patch: { title: "stale" },
        mutationId: "update-stale",
      }),
      (error) => error?.code === ASSESSMENT_ERROR_CODES.REVISION_CONFLICT,
    );
    assert.deepEqual(
      await repository.getQuestion({ learningUnitId: "unit-1", questionId: "q-1" }),
      updated,
    );
    await assert.rejects(
      repository.updateQuestion({
        learningUnitId: "unit-1",
        questionId: "q-1",
        expectedRevision: 2,
        patch: { revision: 99 },
        mutationId: "update-forbidden",
      }),
      /revision cannot be changed/,
    );
    assert.equal(await repository.getMutationReceipt({ mutationId: "update-stale" }), null);
    repository.close?.();
  });

  test(`${name}: retire atomically advances revision and trusted metadata without deleting the question`, async () => {
    const repository = await fresh();
    const first = question("q-1", "unit-1");
    await repository.createQuestions({ learningUnitId: "unit-1", questions: [first], mutationId: "create-1" });
    const metadata = {
      updatedAt: "2026-09-12T00:00:01.000Z",
      provenance: { source: "ai", agentRunId: "run-1", toolCallId: "call-1" },
    };
    const retired = { ...first, status: "retired", revision: 2, ...metadata };
    assert.deepEqual(
      await repository.retireQuestion({
        learningUnitId: "unit-1",
        questionId: "q-1",
        expectedRevision: 1,
        mutationId: "retire-1",
        metadata,
      }),
      { result: retired, replayed: false },
    );
    assert.deepEqual(await repository.getQuestion({ learningUnitId: "unit-1", questionId: "q-1" }), retired);
    assert.deepEqual(await repository.listQuestions({ learningUnitId: "unit-1", status: "retired" }), [retired]);
    assert.deepEqual(await repository.retireQuestion({
      learningUnitId: "unit-1",
      questionId: "q-1",
      expectedRevision: 1,
      mutationId: "retire-1",
      metadata: {
        updatedAt: "2099-01-01T00:00:00.000Z",
        provenance: { source: "forged-replay" },
      },
    }), { result: retired, replayed: true });
    repository.close?.();
  });

  test(`${name}: sessions and attempts are separate persisted records`, async () => {
    const repository = await fresh();
    const savedSession = await repository.createSession({ session: session("session-1", "unit-1") });
    assert.deepEqual(savedSession, session("session-1", "unit-1"));
    assert.deepEqual(
      await repository.getSession({ learningUnitId: "unit-1", sessionId: "session-1" }),
      savedSession,
    );
    assert.equal(await repository.getSession({ learningUnitId: "unit-2", sessionId: "session-1" }), null);
    assert.deepEqual(await repository.listSessions({ learningUnitId: "unit-1", status: "in_progress" }), [savedSession]);

    const firstAttempt = attempt("attempt-1", "session-1", "q-1");
    const secondAttempt = attempt("attempt-2", "session-1", "q-2", { correct: false, answer: "b" });
    await repository.saveAttempt({ attempt: firstAttempt });
    await repository.saveAttempt({ attempt: secondAttempt });
    assert.deepEqual(await repository.listAttempts({ sessionId: "session-1" }), [firstAttempt, secondAttempt]);
    assert.deepEqual(await repository.listAttempts({ sessionId: "session-1", questionId: "q-2" }), [secondAttempt]);
    assert.deepEqual(await repository.listAttempts({ sessionId: "unknown" }), []);
    repository.close?.();
  });

  test(`${name}: attempt persistence and session completion are atomic`, async () => {
    const repository = await fresh();
    const savedSession = await repository.createSession({
      session: {
        ...session("session-progress", "unit-1"),
        items: [{ questionId: "q-1" }, { questionId: "q-2" }],
      },
    });
    const first = await repository.saveAttemptAndProgressSession({
      learningUnitId: "unit-1",
      sessionId: savedSession.id,
      attempt: attempt("attempt-1", savedSession.id, "q-1"),
      completedAt: "2026-09-12T00:01:00.000Z",
    });
    assert.equal(first.session.status, "in_progress");
    assert.equal(first.session.completedAt, undefined);

    const second = await repository.saveAttemptAndProgressSession({
      learningUnitId: "unit-1",
      sessionId: savedSession.id,
      attempt: attempt("attempt-2", savedSession.id, "q-2"),
      completedAt: "2026-09-12T00:02:00.000Z",
    });
    assert.equal(second.session.status, "completed");
    assert.equal(second.session.completedAt, "2026-09-12T00:02:00.000Z");
    assert.equal((await repository.listAttempts({ sessionId: savedSession.id })).length, 2);
    await assert.rejects(
      repository.saveAttemptAndProgressSession({
        learningUnitId: "unit-1",
        sessionId: savedSession.id,
        attempt: attempt("attempt-3", savedSession.id, "q-1"),
        completedAt: "2026-09-12T00:03:00.000Z",
      }),
      (error) => error?.code === ASSESSMENT_ERROR_CODES.SESSION_COMPLETED,
    );
    assert.equal((await repository.listAttempts({ sessionId: savedSession.id })).length, 2);
    repository.close?.();
  });

  test(`${name}: returned values are detached from persisted values`, async () => {
    const repository = await fresh();
    const first = question("q-1", "unit-1");
    const created = await repository.createQuestions({ learningUnitId: "unit-1", questions: [first], mutationId: "create-1" });
    created.result[0].content.prompt = "caller mutation";
    const loaded = await repository.getQuestion({ learningUnitId: "unit-1", questionId: "q-1" });
    assert.equal(loaded.content.prompt, first.content.prompt);
    repository.close?.();
  });
}
