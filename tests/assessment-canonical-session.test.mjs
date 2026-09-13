import assert from "node:assert/strict";
import test from "node:test";

import { MemoryAssessmentRepository } from "../src/assessment/infrastructure/memoryAssessmentRepository.js";
import { createIndexedDbAssessmentRepository } from "../src/assessment/infrastructure/indexedDbAssessmentRepository.js";
import { ASSESSMENT_STORES } from "../src/assessment/infrastructure/indexedDb/assessmentMigrations.js";
import { FakeIndexedDB } from "./assessment-repository-fake-indexeddb.mjs";

const CLOCK_ISO = "2026-09-14T00:00:10.000Z";
const clock = () => new Date(CLOCK_ISO);

function session(id, learningUnitId, startedAt, overrides = {}) {
  return {
    id,
    learningUnitId,
    status: "in_progress",
    startedAt,
    completedAt: null,
    items: [],
    ...overrides,
  };
}

const implementations = [
  {
    name: "memory",
    create: async () => ({ repository: new MemoryAssessmentRepository({ clock }) }),
    seed(repository, value) {
      repository.state[ASSESSMENT_STORES.SESSIONS].set(value.id, structuredClone(value));
    },
  },
  {
    name: "indexeddb",
    create: async () => ({
      repository: await createIndexedDbAssessmentRepository({ indexedDb: new FakeIndexedDB(), clock }),
    }),
    seed(repository, value) {
      repository.db.stores.get(ASSESSMENT_STORES.SESSIONS).records.set(value.id, structuredClone(value));
    },
  },
];

for (const implementation of implementations) {
  test(`${implementation.name}: concurrent starts converge on one canonical in-progress session`, async () => {
    const { repository } = await implementation.create();
    const first = session("session-a", "unit-1", "2026-09-14T00:00:00.000Z");
    const competing = session("session-b", "unit-1", "2026-09-14T00:00:01.000Z");

    const [left, right] = await Promise.all([
      repository.createSession({ session: first }),
      repository.createSession({ session: competing }),
    ]);

    assert.equal(left.id, "session-a");
    assert.equal(right.id, "session-a");
    assert.deepEqual(
      (await repository.listSessions({ learningUnitId: "unit-1", status: "in_progress" })).map((value) => value.id),
      ["session-a"],
    );
    assert.equal(await repository.getSession({ learningUnitId: "unit-1", sessionId: "session-b" }), null);
    repository.close?.();
  });

  test(`${implementation.name}: legacy duplicate active sessions reconcile newest-first without changing completed history`, async () => {
    const { repository } = await implementation.create();
    const older = session("session-old", "unit-1", "2026-09-14T00:00:00.000Z");
    const winner = session("session-new", "unit-1", "2026-09-14T00:00:05.000Z");
    const completed = session("session-done", "unit-1", "2026-09-13T23:00:00.000Z", {
      status: "completed",
      completedAt: "2026-09-13T23:10:00.000Z",
    });
    implementation.seed(repository, older);
    implementation.seed(repository, winner);
    implementation.seed(repository, completed);

    const canonical = await repository.reconcileInProgressSessions({ learningUnitId: "unit-1" });
    assert.equal(canonical.id, winner.id);
    assert.deepEqual(
      (await repository.listSessions({ learningUnitId: "unit-1", status: "in_progress" })).map((value) => value.id),
      [winner.id],
    );
    const superseded = await repository.listSessions({ learningUnitId: "unit-1", status: "superseded" });
    assert.equal(superseded.length, 1);
    assert.equal(superseded[0].id, older.id);
    assert.equal(superseded[0].supersededAt, CLOCK_ISO);
    assert.equal(superseded[0].supersededBySessionId, winner.id);
    assert.deepEqual(
      await repository.getSession({ learningUnitId: "unit-1", sessionId: completed.id }),
      completed,
    );
    repository.close?.();
  });

  test(`${implementation.name}: start after legacy reconciliation reuses the canonical winner`, async () => {
    const { repository } = await implementation.create();
    const older = session("session-old", "unit-1", "2026-09-14T00:00:00.000Z");
    const winner = session("session-new", "unit-1", "2026-09-14T00:00:05.000Z");
    implementation.seed(repository, older);
    implementation.seed(repository, winner);

    const returned = await repository.createSession({
      session: session("session-retry", "unit-1", "2026-09-14T00:00:09.000Z"),
    });

    assert.equal(returned.id, winner.id);
    assert.equal(
      (await repository.listSessions({ learningUnitId: "unit-1", status: "in_progress" })).length,
      1,
    );
    assert.equal(await repository.getSession({ learningUnitId: "unit-1", sessionId: "session-retry" }), null);
    repository.close?.();
  });
}
