import assert from "node:assert/strict";
import test from "node:test";

import { MemoryAssessmentRepository } from "../src/assessment/infrastructure/memoryAssessmentRepository.js";
import { IndexedDbAssessmentRepository, createIndexedDbAssessmentRepository } from "../src/assessment/infrastructure/indexedDbAssessmentRepository.js";
import { FakeIndexedDB } from "./assessment-repository-fake-indexeddb.mjs";
import { registerAssessmentRepositoryContract } from "./assessment-repository-contract-suite.mjs";

registerAssessmentRepositoryContract({
  name: "MemoryAssessmentRepository",
  createRepository: () => new MemoryAssessmentRepository({
    clock: () => new Date("2026-09-12T00:00:00.000Z"),
  }),
});

registerAssessmentRepositoryContract({
  name: "IndexedDbAssessmentRepository",
  createRepository: async () => createIndexedDbAssessmentRepository({
    indexedDb: new FakeIndexedDB(),
    clock: () => new Date("2026-09-12T00:00:00.000Z"),
  }),
});

test("IndexedDbAssessmentRepository rejects unavailable IndexedDB with a stable error code", async () => {
  await assert.rejects(
    createIndexedDbAssessmentRepository({ indexedDb: undefined }),
    (error) => error?.code === "STORAGE_UNAVAILABLE",
  );
  assert.equal(IndexedDbAssessmentRepository.name, "IndexedDbAssessmentRepository");
});
