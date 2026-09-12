import assert from "node:assert/strict";
import test from "node:test";

import {
  LEARNING_ACTION_KINDS,
  LEARNING_CONTEXT_KINDS,
  buildLearningActionPrompt,
  clampLearningSelection,
  createLearningActionContext,
  getLearningActionsForContext,
} from "../src/learning-actions/promptBuilder.js";

test("clampLearningSelection trims and marks oversized selections", () => {
  assert.deepEqual(clampLearningSelection("  hello  ", 20), { text: "hello", truncated: false });
  assert.deepEqual(clampLearningSelection("abcdef", 3), { text: "abc", truncated: true });
});

test("source context preserves stable file/range metadata", () => {
  const context = createLearningActionContext({
    kind: LEARNING_CONTEXT_KINDS.SOURCE,
    learningUnit: { id: "state-snapshot", label: "State Snapshot" },
    fileName: "Demo.jsx",
    range: { startLine: 10, endLine: 20 },
    semanticRegion: "event handler",
    selectedText: "setCount(count + 1)",
  });

  assert.equal(context.learningUnitId, "state-snapshot");
  assert.deepEqual(context.range, { startLine: 10, endLine: 20 });
  assert.equal(Object.isFrozen(context), true);
});

test("buildLearningActionPrompt includes bounded material and references", () => {
  const context = createLearningActionContext({
    kind: LEARNING_CONTEXT_KINDS.SOURCE,
    learningUnit: { id: "state-snapshot", label: "State Snapshot" },
    fileName: "Demo.jsx",
    range: { startLine: 4, endLine: 7 },
    selectedText: "const value = state.value;",
  });
  const prompt = buildLearningActionPrompt({
    action: LEARNING_ACTION_KINDS.WHY,
    context,
  });

  assert.match(prompt, /为什么这样设计或这样写/);
  assert.match(prompt, /\[文件\] Demo.jsx/);
  assert.match(prompt, /\[范围\] L4-L7/);
  assert.match(prompt, /const value = state\.value/);
});

test("context kinds expose only relevant learning actions", () => {
  assert.deepEqual(getLearningActionsForContext(LEARNING_CONTEXT_KINDS.NOTE), [
    "explain",
    "example",
    "counterexample",
    "quiz",
  ]);
  assert.deepEqual(getLearningActionsForContext(LEARNING_CONTEXT_KINDS.SOURCE), [
    "explain",
    "why",
    "quiz",
  ]);
  assert.deepEqual(getLearningActionsForContext(LEARNING_CONTEXT_KINDS.DEMO), [
    "explain",
    "walkthrough",
    "verify",
    "quiz",
  ]);
});

test("unsupported actions fail closed", () => {
  const context = createLearningActionContext({ kind: LEARNING_CONTEXT_KINDS.NOTE });
  assert.throws(
    () => buildLearningActionPrompt({ action: "unknown", context }),
    /Unsupported learning action/,
  );
});
