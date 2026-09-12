import assert from "node:assert/strict";
import test from "node:test";

import {
  openIndexedDb,
  requestToPromise,
  transactionDone,
} from "../src/platform/storage/indexedDb.js";

test("requestToPromise resolves result and surfaces request errors", async () => {
  const success = {};
  const successPromise = requestToPromise(success);
  success.result = { ok: true };
  success.onsuccess();
  assert.deepEqual(await successPromise, { ok: true });

  const failure = {};
  const failurePromise = requestToPromise(failure);
  failure.error = new Error("boom");
  failure.onerror();
  await assert.rejects(failurePromise, /boom/);
});

test("transactionDone distinguishes completion and abort", async () => {
  const completed = {};
  const completedPromise = transactionDone(completed);
  completed.oncomplete();
  await completedPromise;

  const aborted = {};
  const abortedPromise = transactionDone(aborted);
  aborted.onabort();
  await assert.rejects(abortedPromise, /aborted/);
});

test("openIndexedDb forwards migration versions and installs version-change close", async () => {
  const db = {
    onversionchange: null,
    closeCalled: false,
    close() {
      this.closeCalled = true;
    },
  };
  const request = { result: db, transaction: { abort() {} } };
  const indexedDb = {
    open(name, version) {
      assert.equal(name, "test-db");
      assert.equal(version, 2);
      return request;
    },
  };
  let migration = null;
  const promise = openIndexedDb({
    indexedDb,
    name: "test-db",
    version: 2,
    migrate(value) {
      migration = value;
    },
  });

  request.onupgradeneeded({ oldVersion: 1, newVersion: 2 });
  request.onsuccess();

  assert.equal(await promise, db);
  assert.equal(migration.oldVersion, 1);
  assert.equal(migration.newVersion, 2);
  db.onversionchange();
  assert.equal(db.closeCalled, true);
});
