import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  discoverDeterministicTests,
  discoverRequiredTests,
  findOrphanDeterministicTests,
} from "../scripts/run-required-tests.mjs";

const packageJson = JSON.parse(
  await readFile(new URL("../package.json", import.meta.url), "utf8"),
);
const reactVerifyWorkflow = await readFile(
  new URL("../.github/workflows/react-learning-verify.yml", import.meta.url),
  "utf8",
);
const workbenchWorkflow = await readFile(
  new URL("../.github/workflows/workbench-integration-verify.yml", import.meta.url),
  "utf8",
);

test("every deterministic tests/**/*.test.mjs file belongs to required verification", async () => {
  const deterministicTests = await discoverDeterministicTests();
  const requiredTests = new Set(await discoverRequiredTests());

  assert.ok(deterministicTests.length > 0, "expected deterministic tests to exist");
  for (const file of deterministicTests) {
    assert.ok(requiredTests.has(file), `${file} is missing from required verification`);
  }
});

test("deterministic .test.mjs files outside the owned tests root fail the inventory contract", async () => {
  assert.deepEqual(await findOrphanDeterministicTests(), []);
});

test("React Learning Verify delegates deterministic repository verification to the canonical script", () => {
  assert.equal(
    packageJson.scripts["test:required"],
    "node scripts/run-required-tests.mjs",
  );
  assert.match(packageJson.scripts["verify:required"], /npm run test:required/);
  assert.match(packageJson.scripts["verify:required"], /npm run typecheck:samples/);
  assert.match(packageJson.scripts["verify:required"], /npm run lint/);
  assert.match(packageJson.scripts["verify:required"], /npm run build/);
  assert.match(reactVerifyWorkflow, /run: npm run verify:required/);
});

test("browser verification keeps a code-side canonical entry aligned with Workbench prerequisites", () => {
  assert.equal(packageJson.scripts["verify:browser"], "npm run test:e2e:mock");
  assert.match(packageJson.scripts["test:e2e:mock"], /npm run build/);
  assert.match(packageJson.scripts["test:e2e:mock"], /npm run test:e2e/);
  assert.match(workbenchWorkflow, /run: npm run build/);
  assert.match(workbenchWorkflow, /run: npm run test:e2e/);
});
