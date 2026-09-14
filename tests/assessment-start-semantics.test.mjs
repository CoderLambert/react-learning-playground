import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { createAssessmentController } from "../src/assessment/application/assessmentController.js";
import { createAssessmentQueryStore } from "../src/assessment/store/AssessmentQueryStore.js";

const practiceSource = await readFile(new URL("../src/assessment/ui/AssessmentPracticePane.jsx", import.meta.url), "utf8");

function deferred() {
  let resolve;
  const promise = new Promise((res) => { resolve = res; });
  return { promise, resolve };
}

function createRuntime({ start }) {
  return {
    storageNotice: null,
    capabilities: Object.freeze({}),
    queryStore: createAssessmentQueryStore(),
    service: {
      async listQuestions() { return [{ id: "q1", status: "active" }]; },
    },
    sessionLifecycle: {
      async recover() { return null; },
      start,
      async submit() { throw new Error("not used"); },
    },
  };
}

const selectQuestions = (snapshot, learningUnitId) => (
  snapshot?.learningUnitId === learningUnitId ? snapshot.questions : []
);

test("Assessment start is single-flight at the visible action boundary", async () => {
  const pending = deferred();
  let calls = 0;
  const runtime = createRuntime({
    start() {
      calls += 1;
      return pending.promise;
    },
  });
  const controller = createAssessmentController({ runtime, selectQuestions });
  await controller.commands.initialize("unit-a");

  const first = controller.commands.start();
  const second = controller.commands.start();

  assert.equal(calls, 1);
  assert.equal(controller.getSnapshot().starting, true);
  assert.match(practiceSource, /disabled=\{starting\}/);
  assert.match(practiceSource, /正在开始…/);

  pending.resolve({ id: "s1", status: "in_progress", items: [] });
  await Promise.all([first, second]);
  assert.equal(controller.getSnapshot().starting, false);
});

test("start failure is presented as retryable infrastructure state, not grading feedback", async () => {
  let calls = 0;
  const runtime = createRuntime({
    async start() {
      calls += 1;
      if (calls === 1) throw new Error("无法连接评测存储");
      return { id: "s1", status: "in_progress", items: [] };
    },
  });
  const controller = createAssessmentController({ runtime, selectQuestions });
  await controller.commands.initialize("unit-a");

  await controller.commands.start();
  assert.equal(controller.getSnapshot().startError, "无法连接评测存储");
  assert.equal(controller.getSnapshot().feedback, null);
  assert.equal(controller.getSnapshot().starting, false);
  assert.match(practiceSource, /开始评测失败，可重试/);
  assert.match(practiceSource, /role="alert"/);

  await controller.commands.start();
  assert.equal(controller.getSnapshot().startError, null);
  assert.equal(controller.getSnapshot().session.id, "s1");
});
