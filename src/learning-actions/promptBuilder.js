export const LEARNING_ACTION_KINDS = Object.freeze({
  EXPLAIN: "explain",
  EXAMPLE: "example",
  COUNTEREXAMPLE: "counterexample",
  QUIZ: "quiz",
  WHY: "why",
  WALKTHROUGH: "walkthrough",
  VERIFY: "verify",
});

export const LEARNING_CONTEXT_KINDS = Object.freeze({
  NOTE: "note",
  SOURCE: "source",
  DEMO: "demo",
});

const ACTION_INSTRUCTIONS = Object.freeze({
  [LEARNING_ACTION_KINDS.EXPLAIN]: "解释这部分内容，先给核心结论，再解释机制，并指出容易混淆的边界。",
  [LEARNING_ACTION_KINDS.EXAMPLE]: "基于这部分内容给一个最小、具体、可运行或可推演的例子。",
  [LEARNING_ACTION_KINDS.COUNTEREXAMPLE]: "给一个有代表性的反例或错误写法，并解释为什么错、什么时候容易踩坑。",
  [LEARNING_ACTION_KINDS.QUIZ]: "基于这部分内容出 1-3 道需要推理的问题，不要直接给答案，等我作答。",
  [LEARNING_ACTION_KINDS.WHY]: "解释这里为什么这样设计或这样写，并说明至少一种替代方案及 trade-off。",
  [LEARNING_ACTION_KINDS.WALKTHROUGH]: "按执行顺序带我读这部分实现，串起关键状态、事件和数据流。",
  [LEARNING_ACTION_KINDS.VERIFY]: "说明这个 Demo/片段在验证什么心智模型，以及我应该观察哪些现象。",
});

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeRange(range) {
  const startLine = Number(range?.startLine);
  const endLine = Number(range?.endLine ?? range?.startLine);
  if (!Number.isInteger(startLine) || startLine < 1) return null;
  return {
    startLine,
    endLine: Number.isInteger(endLine) && endLine >= startLine ? endLine : startLine,
  };
}

export function clampLearningSelection(value, maxLength = 4000) {
  const text = clean(value);
  if (!text) return { text: "", truncated: false };
  if (text.length <= maxLength) return { text, truncated: false };
  return { text: text.slice(0, maxLength), truncated: true };
}

export function createLearningActionContext({
  kind,
  learningUnit,
  selectedText,
  fileName,
  range,
  semanticRegion,
} = {}) {
  if (!Object.values(LEARNING_CONTEXT_KINDS).includes(kind)) {
    throw new TypeError("Unsupported learning context kind");
  }

  const selection = clampLearningSelection(selectedText);
  const normalizedRange = normalizeRange(range);
  return Object.freeze({
    kind,
    learningUnitId: clean(learningUnit?.id),
    learningUnitTitle: clean(learningUnit?.label ?? learningUnit?.title),
    fileName: clean(fileName),
    range: normalizedRange,
    semanticRegion: clean(semanticRegion),
    selectedText: selection.text,
    selectionTruncated: selection.truncated,
  });
}

export function buildLearningActionPrompt({ action, context } = {}) {
  const instruction = ACTION_INSTRUCTIONS[action];
  if (!instruction) throw new TypeError("Unsupported learning action");
  if (!context || !Object.values(LEARNING_CONTEXT_KINDS).includes(context.kind)) {
    throw new TypeError("Learning action context is required");
  }

  const metadata = [
    `[学习单元] ${context.learningUnitTitle || context.learningUnitId || "当前知识点"}`,
    `[内容类型] ${context.kind}`,
  ];
  if (context.fileName) metadata.push(`[文件] ${context.fileName}`);
  if (context.range) metadata.push(`[范围] L${context.range.startLine}-L${context.range.endLine}`);
  if (context.semanticRegion) metadata.push(`[语义区域] ${context.semanticRegion}`);

  const material = context.selectedText
    ? `\n\n<selected_material>\n${context.selectedText}\n</selected_material>${context.selectionTruncated ? "\n[选中内容已按安全长度截断]" : ""}`
    : "";

  return `${instruction}\n\n${metadata.join("\n")}${material}`;
}

export function getLearningActionsForContext(kind) {
  switch (kind) {
    case LEARNING_CONTEXT_KINDS.NOTE:
      return [
        LEARNING_ACTION_KINDS.EXPLAIN,
        LEARNING_ACTION_KINDS.EXAMPLE,
        LEARNING_ACTION_KINDS.COUNTEREXAMPLE,
        LEARNING_ACTION_KINDS.QUIZ,
      ];
    case LEARNING_CONTEXT_KINDS.SOURCE:
      return [
        LEARNING_ACTION_KINDS.EXPLAIN,
        LEARNING_ACTION_KINDS.WHY,
        LEARNING_ACTION_KINDS.QUIZ,
      ];
    case LEARNING_CONTEXT_KINDS.DEMO:
      return [
        LEARNING_ACTION_KINDS.EXPLAIN,
        LEARNING_ACTION_KINDS.WALKTHROUGH,
        LEARNING_ACTION_KINDS.VERIFY,
        LEARNING_ACTION_KINDS.QUIZ,
      ];
    default:
      return [];
  }
}
