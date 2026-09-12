import assert from "node:assert/strict";
import test from "node:test";

import { createAssessmentQueryStore } from "../src/assessment/store/AssessmentQueryStore.js";

test("query store exposes the current snapshot and notifies subscribers on replacement", () => {
  const initial = { questions: [] };
  const next = { questions: [{ id: "q1" }] };
  const store = createAssessmentQueryStore(initial);
  let notifications = 0;

  const unsubscribe = store.subscribe(() => {
    notifications += 1;
  });

  assert.equal(store.getSnapshot(), initial);
  assert.equal(store.replaceSnapshot(initial), initial);
  assert.equal(notifications, 0);

  assert.equal(store.replaceSnapshot(next), next);
  assert.equal(store.getSnapshot(), next);
  assert.equal(notifications, 1);

  unsubscribe();
  store.replaceSnapshot({ questions: [] });
  assert.equal(notifications, 1);
});

test("query store validates subscribers", () => {
  const store = createAssessmentQueryStore();
  assert.throws(() => store.subscribe(null), /listener must be a function/);
});
