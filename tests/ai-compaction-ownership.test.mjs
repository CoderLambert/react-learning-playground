import assert from "node:assert/strict";
import test from "node:test";

import { createCompactionOwnership } from "../src/ai/compaction/compactionOwnership.js";

test("stale compaction cannot clear or replace a newer active promise", async () => {
  const ownership = createCompactionOwnership();
  const tokenA = ownership.capture();
  const promiseA = Promise.resolve("A");
  assert.equal(ownership.activate(tokenA, promiseA), true);
  assert.equal(ownership.isCurrent(tokenA, promiseA), true);

  ownership.invalidate();
  const tokenB = ownership.capture();
  const promiseB = Promise.resolve("B");
  assert.equal(ownership.activate(tokenB, promiseB), true);

  assert.equal(ownership.isCurrent(tokenA, promiseA), false);
  assert.equal(ownership.clear(tokenA, promiseA), false);
  assert.equal(ownership.getActivePromise(), promiseB);
  assert.equal(ownership.isCurrent(tokenB, promiseB), true);

  assert.equal(ownership.clear(tokenB, promiseB), true);
  assert.equal(ownership.getActivePromise(), null);
});

test("context invalidation allows a new compaction while the old promise is unresolved", () => {
  const ownership = createCompactionOwnership();
  const tokenA = ownership.capture();
  const promiseA = new Promise(() => {});
  assert.equal(ownership.activate(tokenA, promiseA), true);
  assert.equal(ownership.getActivePromise(), promiseA);

  ownership.invalidate();
  assert.equal(ownership.getActivePromise(), null);

  const tokenB = ownership.capture();
  const promiseB = Promise.resolve();
  assert.equal(ownership.activate(tokenB, promiseB), true);
  assert.equal(ownership.getActivePromise(), promiseB);
});
