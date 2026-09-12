import assert from "node:assert/strict";
import test from "node:test";

import {
  INSPECTOR_PANEL_DEFINITIONS,
  INSPECTOR_PANEL_IDS,
  getInspectorPanelDefinition,
  isInspectorPanelId,
  resolveInspectorPanels,
} from "../src/workbench/inspectorPanels.js";
import { INSPECTOR_TABS } from "../src/workbench/constants.js";

test("inspector registry preserves legacy panels and appends assessment", () => {
  assert.deepEqual(INSPECTOR_PANEL_IDS, ["notes", "source", "ai", "assessment"]);
  assert.deepEqual(INSPECTOR_TABS, INSPECTOR_PANEL_IDS);
  assert.deepEqual(
    INSPECTOR_PANEL_DEFINITIONS.map(({ id, label }) => [id, label]),
    [["notes", "笔记"], ["source", "源码"], ["ai", "AI"], ["assessment", "评测"]],
  );
});

test("panel id validation uses the registry as its single source of truth", () => {
  for (const id of ["notes", "source", "ai", "assessment"]) assert.equal(isInspectorPanelId(id), true);
  assert.equal(isInspectorPanelId("missing"), false);
  assert.equal(getInspectorPanelDefinition("assessment")?.label, "评测");
  assert.equal(getInspectorPanelDefinition("missing"), null);
});

test("resolveInspectorPanels binds content without mutating definitions", () => {
  const assessmentContent = { type: "fixture", value: "assessment" };
  const panels = resolveInspectorPanels({ assessment: assessmentContent });
  assert.equal(panels.length, 4);
  assert.equal(panels[3].content, assessmentContent);
  assert.equal(Object.hasOwn(INSPECTOR_PANEL_DEFINITIONS[3], "content"), false);
});
