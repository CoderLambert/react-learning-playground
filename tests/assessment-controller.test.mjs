import assert from "node:assert/strict";
import test from "node:test";
import { createAssessmentController } from "../src/assessment/application/assessmentController.js";

test("assessment controller owns initialize lifecycle instead of callers", async () => {
  const calls = [];
  const runtime = {
    service: {
      async listQuestions() {
        calls.push("listQuestions");
        return [{ id: "q1" }];
      },
    },
    queryStore: {
      replaceSnapshot(snapshot) {
        calls.push("replaceSnapshot");
        this.snapshot = snapshot;
      },
      getSnapshot() {
        return this.snapshot;
      },
    },
    sessionLifecycle: {
      async recover() {
        calls.push("recover");
        return null;
      },
    },
  };

  const controller = createAssessmentController({ runtime });
  await controller.initialize("unit-a");

  assert.deepEqual(calls, ["listQuestions", "replaceSnapshot", "recover"]);
  assert.equal(controller.getViewModel().learningUnitId, "unit-a");
});

test("assessment controller exposes commands without runtime ownership", () => {
  const controller = createAssessmentController({
    runtime: {},
  });

  const viewModel = controller.getViewModel();

  assert.equal(typeof viewModel.commands.initialize, "function");
  assert.equal(typeof viewModel.commands.submit, "function");
});
