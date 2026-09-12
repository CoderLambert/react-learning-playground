import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const DOMAIN_FILES = [
  "assessmentErrors.js",
  "question.js",
  "assessmentSession.js",
  "attempt.js",
];

test("assessment domain contracts do not depend on React, IndexedDB infrastructure, or AI", async () => {
  for (const file of DOMAIN_FILES) {
    const source = await readFile(
      new URL(`../src/assessment/domain/${file}`, import.meta.url),
      "utf8",
    );
    assert.doesNotMatch(source, /from\s+["'][^"']*(react|indexedDb|infrastructure|\/ai\/)/i, file);
    assert.doesNotMatch(source, /indexedDB\b|localStorage\b|window\b|document\b/, file);
  }
});

test("generic agent contracts do not depend on Assessment implementation", async () => {
  const source = await readFile(
    new URL("../src/ai/agent/agentContracts.js", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(source, /assessment/i);
});

test("application ports contain interface guards only and no persistence implementation", async () => {
  const source = await readFile(
    new URL("../src/assessment/application/assessmentPorts.js", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(source, /indexedDB\b|objectStore\b|localStorage\b/);
});
