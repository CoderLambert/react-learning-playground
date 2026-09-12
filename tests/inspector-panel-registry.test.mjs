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

test("inspector registry preserves the legacy panel ids and order", () => {
  assert.deepEqual(INSPECTOR_PANEL_IDS, ["notes", "source", "ai"]);
  assert.deepEqual(INSPECTOR_TABS, INSPECTOR_PANEL_IDS);
  assert.deepEqual(
    INSPECTOR_PANEL_DEFINITIONS.map(({ id, label }) => [id, label]),
    [
      ["notes", "笔记"],
      ["source", "源码"],
      ["ai", "AI"],
    ],
  );
});

test("panel id validation uses the registry as its single source of truth", () => {
  assert.equal(isInspectorPanelId("notes"), true);
  assert.equal(isInspectorPanelId("source"), true);
  assert.equal(isInspectorPanelId("ai"), true);
  assert.equal(isInspectorPanelId("assessment"), false);
  assert.equal(getInspectorPanelDefinition("source")?.label, "源码");
  assert.equal(getInspectorPanelDefinition("missing"), null);
});

test("resolveInspectorPanels binds legacy slot content without mutating definitions", () => {
  const noteContent = { type: "fixture", value: "notes" };
  const panels = resolveInspectorPanels({ notes: noteContent });

  assert.equal(panels.length, 3);
  assert.equal(panels[0].id, "notes");
  assert.equal(panels[0].content, noteContent);
  assert.equal(panels[1].content, null);
  assert.equal(panels[2].content, null);
  assert.equal(Object.hasOwn(INSPECTOR_PANEL_DEFINITIONS[0], "content"), false);
});
