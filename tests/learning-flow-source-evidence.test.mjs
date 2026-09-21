import assert from "node:assert/strict";
import test from "node:test";

import { resolveLearningSourceExcerpt } from "../src/learning-flow/sourceEvidence.js";

const learningUnit = {
  id: "fixture",
  sources: [
    {
      name: "Fixture.jsx",
      code: [
        "function Fixture() {",
        "  const [count, setCount] = useState(0);",
        "  return <button>{count}</button>;",
        "}",
      ].join("\n"),
    },
  ],
};

test("source evidence resolves exact lines from LearningUnit.sources", () => {
  const excerpt = resolveLearningSourceExcerpt(learningUnit, {
    kind: "source",
    fileName: "Fixture.jsx",
    startLine: 2,
    endLine: 3,
  });

  assert.deepEqual(excerpt, {
    fileName: "Fixture.jsx",
    startLine: 2,
    endLine: 3,
    code: "  const [count, setCount] = useState(0);\n  return <button>{count}</button>;",
  });
  assert.equal(Object.isFrozen(excerpt), true);
});

test("source evidence fails closed for stale files or invalid ranges", () => {
  assert.equal(resolveLearningSourceExcerpt(learningUnit, {
    kind: "source",
    fileName: "Missing.jsx",
    startLine: 1,
    endLine: 2,
  }), null);

  assert.equal(resolveLearningSourceExcerpt(learningUnit, {
    kind: "source",
    fileName: "Fixture.jsx",
    startLine: 99,
    endLine: 100,
  }), null);

  assert.equal(resolveLearningSourceExcerpt(learningUnit, {
    kind: "source",
    fileName: "Fixture.jsx",
    startLine: 3,
    endLine: 2,
  }), null);
});

test("source evidence clamps only an oversized end line, never the start line", () => {
  assert.deepEqual(
    resolveLearningSourceExcerpt(learningUnit, {
      kind: "source",
      fileName: "Fixture.jsx",
      startLine: 3,
      endLine: 99,
    }),
    {
      fileName: "Fixture.jsx",
      startLine: 3,
      endLine: 4,
      code: "  return <button>{count}</button>;\n}",
    },
  );
});
