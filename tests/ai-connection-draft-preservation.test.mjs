import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const hookSource = await readFile(
  new URL("../src/ai/useAiLearningAssistant.js", import.meta.url),
  "utf8",
);

function callbackSource(name, nextName) {
  const start = hookSource.indexOf(`const ${name} = useCallback`);
  const end = hookSource.indexOf(`const ${nextName} = useCallback`, start + 1);
  assert.notEqual(start, -1, `${name} callback must exist`);
  assert.notEqual(end, -1, `${nextName} callback must exist after ${name}`);
  return hookSource.slice(start, end);
}

test("saving provider settings preserves the current composer draft", () => {
  const source = callbackSource("saveConnectionSettings", "clearConnectionSettings");
  assert.doesNotMatch(source, /setInputValue\(\s*["']{2}\s*\)/);
});

test("clearing provider settings preserves the current composer draft", () => {
  const start = hookSource.indexOf("const clearConnectionSettings = useCallback");
  const end = hookSource.indexOf("const summarizeMessages = useCallback", start + 1);
  assert.notEqual(start, -1);
  assert.notEqual(end, -1);
  const source = hookSource.slice(start, end);
  assert.doesNotMatch(source, /setInputValue\(\s*["']{2}\s*\)/);
});

test("intentional conversation reset still clears the composer", () => {
  const source = callbackSource("newConversation", "renameConversation");
  assert.match(source, /setInputValue\(\s*["']{2}\s*\)/);
});
