import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { createAssessmentController } from "../src/assessment/application/assessmentController.js";
import { createAssessmentQueryStore } from "../src/assessment/store/AssessmentQueryStore.js";

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function makeRuntime(overrides = {}) {
  const queryStore = createAssessmentQueryStore();
  const runtime = {
    storageNotice: null,
    capabilities: Object.freeze({ kind: "assessment-capabilities" }),
    queryStore,
    service: {
      async listQuestions({ trusted }) {
        return [{ id: `q-${trusted.learningUnitId}`, status: "active" }];
      },
      async updateQuestion() {},
      async retireQuestion() {},
    },
    sessionLifecycle: {
      async recover() { return null; },
      async start({ learningUnitId }) {
        return { id: `s-${learningUnitId}`, status: "in_progress", items: [] };
      },
      async submit() {
        return { attempt: { correct: true }, session: { id: "s", items: [] } };
      },
    },
  };
  return Object.assign(runtime, overrides);
}

const selectQuestions = (snapshot, learningUnitId) => (
  snapshot?.learningUnitId === learningUnitId ? snapshot.questions : []
);

test("initialize owns query scope and recover lifecycle", async () => {
  const calls = [];
  const runtime = makeRuntime({
    service: {
      async listQuestions({ trusted }) {
        calls.push(`list:${trusted.learningUnitId}`);
        return [{ id: "q1", status: "active" }];
      },
    },
    sessionLifecycle: {
      async recover({ learningUnitId }) {
        calls.push(`recover:${learningUnitId}`);
        return { session: { id: "s1", items: [] }, currentIndex: 2 };
      },
    },
  });
  const controller = createAssessmentController({ runtime, selectQuestions });

  await controller.commands.initialize("unit-a");

  assert.deepEqual(calls.sort(), ["list:unit-a", "recover:unit-a"].sort());
  assert.equal(controller.getSnapshot().learningUnitId, "unit-a");
  assert.equal(controller.getSnapshot().session.id, "s1");
  assert.equal(controller.getSnapshot().currentIndex, 2);
  assert.deepEqual(controller.getSnapshot().questions.map((q) => q.id), ["q1"]);
});

test("learning-unit transition rejects stale initialize completion", async () => {
  const aQuestions = deferred();
  const runtime = makeRuntime({
    service: {
      listQuestions({ trusted }) {
        if (trusted.learningUnitId === "unit-a") return aQuestions.promise;
        return Promise.resolve([{ id: "q-b", status: "active" }]);
      },
    },
  });
  const controller = createAssessmentController({ runtime, selectQuestions });

  const first = controller.commands.initialize("unit-a");
  await controller.commands.initialize("unit-b");
  aQuestions.resolve([{ id: "q-a", status: "active" }]);
  await first;

  assert.equal(controller.getSnapshot().learningUnitId, "unit-b");
  assert.deepEqual(controller.getSnapshot().questions.map((q) => q.id), ["q-b"]);
  assert.equal(runtime.queryStore.getSnapshot().learningUnitId, "unit-b");
});

test("canonical start is opt-in and does not replace the mutable question-bank start path", async () => {
  const starts = [];
  const canonicalQuestions = [{ id: "canonical-q", learningUnitId: "unit-a", status: "active" }];
  const runtime = makeRuntime({
    sessionLifecycle: {
      async recover() { return null; },
      async start(input) {
        starts.push(input);
        return { id: `s-${starts.length}`, status: "in_progress", items: [] };
      },
    },
  });
  const controller = createAssessmentController({
    runtime,
    selectQuestions,
    getCanonicalQuestions: (learningUnitId) => learningUnitId === "unit-a" ? canonicalQuestions : [],
  });

  await controller.commands.initialize("unit-a");
  assert.equal(controller.getSnapshot().canonicalQuestions.length, 1);

  await controller.commands.start();
  assert.deepEqual(starts[0], { learningUnitId: "unit-a" });

  await controller.commands.startCanonical();
  assert.deepEqual(starts[1], {
    learningUnitId: "unit-a",
    questionRecords: canonicalQuestions,
  });
});

test("start failure is retryable", async () => {
  let attempts = 0;
  const runtime = makeRuntime({
    sessionLifecycle: {
      async recover() { return null; },
      async start({ learningUnitId }) {
        attempts += 1;
        if (attempts === 1) throw new Error("temporary start failure");
        return { id: `s-${learningUnitId}`, status: "in_progress", items: [] };
      },
    },
  });
  const controller = createAssessmentController({ runtime, selectQuestions });
  await controller.commands.initialize("unit-a");

  await controller.commands.start();
  assert.equal(controller.getSnapshot().startError, "temporary start failure");
  assert.equal(controller.getSnapshot().starting, false);

  await controller.commands.start();
  assert.equal(controller.getSnapshot().startError, null);
  assert.equal(controller.getSnapshot().session.id, "s-unit-a");
});

test("submit completion is ignored after learning-unit transition", async () => {
  const submitResult = deferred();
  const sessionA = {
    id: "s-a",
    status: "in_progress",
    items: [{ questionId: "q-unit-a", snapshot: { content: { explanation: "A" } } }],
  };
  const runtime = makeRuntime({
    sessionLifecycle: {
      async recover({ learningUnitId }) {
        return learningUnitId === "unit-a" ? { session: sessionA, currentIndex: 0 } : null;
      },
      async submit() { return submitResult.promise; },
    },
  });
  const controller = createAssessmentController({ runtime, selectQuestions });
  await controller.commands.initialize("unit-a");

  const submit = controller.commands.submit({ questionId: "q-unit-a", answer: "x" });
  await controller.commands.initialize("unit-b");
  submitResult.resolve({ attempt: { correct: true }, session: sessionA });
  await submit;

  assert.equal(controller.getSnapshot().learningUnitId, "unit-b");
  assert.equal(controller.getSnapshot().session, null);
  assert.equal(controller.getSnapshot().feedback, null);
});

test("App composition no longer owns Assessment runtime/query lifecycle", async () => {
  const appSource = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");

  for (const forbidden of [
    "createAssessmentRuntime",
    "queryStore",
    "sessionLifecycle",
    "createAssessmentOperationToken",
    "assessmentGenerationRef",
    "assessmentSubmitRequestRef",
    "setAssessmentSession",
    "setAssessmentFeedback",
  ]) {
    assert.equal(appSource.includes(forbidden), false, `App.jsx must not contain ${forbidden}`);
  }
  assert.match(appSource, /useAssessmentApplication/);
  assert.match(appSource, /createAiAssessmentIntegration/);
});
