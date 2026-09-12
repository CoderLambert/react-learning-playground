const DEFAULT_PANEL_DEFINITIONS = [
  {
    id: "notes",
    label: "笔记",
    placeholder: ["笔记区域", "等待 MDX Runtime 注入当前知识点笔记。"],
  },
  {
    id: "source",
    label: "源码",
    placeholder: ["源码区域", "等待 SourceViewer 注入当前 Demo 源码。"],
  },
  {
    id: "ai",
    label: "AI",
    placeholder: ["AI 区域", "等待 AI 学习助手注入当前笔记与源码上下文。"],
  },
];

export const INSPECTOR_PANEL_DEFINITIONS = Object.freeze(
  DEFAULT_PANEL_DEFINITIONS.map((panel) => Object.freeze({
    ...panel,
    placeholder: Object.freeze([...panel.placeholder]),
  })),
);

export const INSPECTOR_PANEL_IDS = Object.freeze(
  INSPECTOR_PANEL_DEFINITIONS.map((panel) => panel.id),
);

export function isInspectorPanelId(value) {
  return INSPECTOR_PANEL_IDS.includes(value);
}

export function getInspectorPanelDefinition(id) {
  return INSPECTOR_PANEL_DEFINITIONS.find((panel) => panel.id === id) ?? null;
}

export function resolveInspectorPanels(contentById = {}) {
  return INSPECTOR_PANEL_DEFINITIONS.map((definition) => ({
    ...definition,
    content: contentById[definition.id] ?? null,
  }));
}
