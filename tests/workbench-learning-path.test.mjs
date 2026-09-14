import assert from "node:assert/strict";
import test from "node:test";

import { buildLearningPath, getLearningPathEntry } from "../src/workbench/learningPath.js";

const units = [
  { id: "component-jsx-pure-render" },
  { id: "prop-drilling" },
  { id: "event-propagation" },
  { id: "render-commit" },
  { id: "state-dry" },
  { id: "use-reduce-with-context" },
];

test("derives chapter boundaries from registry order and checkpoint terminals", () => {
  const path = buildLearningPath(units);

  assert.deepEqual(
    path.chapters.map(({ chapter, firstId, checkpointId }) => ({ chapter, firstId, checkpointId })),
    [
      { chapter: 1, firstId: "component-jsx-pure-render", checkpointId: "prop-drilling" },
      { chapter: 2, firstId: "event-propagation", checkpointId: "render-commit" },
      { chapter: 3, firstId: "state-dry", checkpointId: "use-reduce-with-context" },
    ],
  );
});

test("exposes chapter position, previous/next lesson and checkpoint targets", () => {
  assert.deepEqual(getLearningPathEntry(units, "event-propagation"), {
    chapter: 2,
    position: 1,
    chapterSize: 2,
    previousId: "prop-drilling",
    nextId: "render-commit",
    checkpointId: "render-commit",
    nextChapterFirstId: "state-dry",
  });

  assert.equal(getLearningPathEntry(units, "unknown"), null);
});
