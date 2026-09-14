import assert from "node:assert/strict";
import test from "node:test";
import { createLocatorExplainAction } from "../src/components/source-locator/locatorLearningAction.js";

test("locator explain action preserves exact source range and selected material", () => {
  const action = createLocatorExplainAction({
    learningUnit: { id: "immutable-state", label: "对象 / 数组 State 不可变更新" },
    source: {
      name: "ImmutableStateDemo.jsx",
      code: [
        "line 1",
        "const updateCity = () => {",
        "  setProfile({ ...profile, city: 'London' });",
        "};",
        "line 5",
      ].join("\n"),
    },
    locator: {
      sourcePath: "src/demos/ImmutableStateDemo.jsx",
      startLine: 2,
      endLine: 4,
    },
  });

  assert.equal(action.action, "explain");
  assert.equal(action.context.kind, "source");
  assert.equal(action.context.learningUnitId, "immutable-state");
  assert.equal(action.context.fileName, "ImmutableStateDemo.jsx");
  assert.deepEqual(action.context.range, { startLine: 2, endLine: 4 });
  assert.equal(action.context.semanticRegion, "visual-source-locator");
  assert.match(action.context.selectedText, /setProfile/);
  assert.match(action.prompt, /\[文件\] ImmutableStateDemo\.jsx/);
  assert.match(action.prompt, /\[范围\] L2-L4/);
  assert.match(action.prompt, /<selected_material>[\s\S]*setProfile/);
});

test("locator explain action fails closed without a resolved source", () => {
  assert.equal(createLocatorExplainAction({ learningUnit: { id: "x" }, locator: { startLine: 1, endLine: 1 } }), null);
});
