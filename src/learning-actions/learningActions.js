export const LEARNING_ACTION_EVENT = "react-learning:ai-context-action";

const ACTION_COPY = Object.freeze({
  note: Object.freeze({
    explain: "请解释这段笔记，先说明核心概念，再结合当前 React 学习单元说明为什么重要。",
    example: "请基于这段笔记给出一个最小但真实的 React 示例，并补充一个常见反例。",
    quiz: "请基于这段笔记先出一道检验理解的问题，不要立即给答案；等我回答后再点评。",
  }),
  source: Object.freeze({
    explain: "请解释这段源码在当前 Demo 中的作用，说明关键执行过程以及它与当前知识点的关系。",
    rationale: "请解释这段源码为什么这样写，并对比一个看似合理但更容易出错的写法。",
    quiz: "请基于这段源码出一道需要阅读代码才能回答的问题，不要立即给答案。",
  }),
  demo: Object.freeze({
    explain: "请解释当前 Demo 在演示什么，按“目标 → 操作 → 观察 → 原理”组织答案。",
    walkthrough: "请带我阅读当前 Demo 的实现，优先从核心组件和关键状态/事件流开始，不要一次展开所有细节。",
    purpose: "请说明当前 Demo 最值得观察的现象、它验证的 React 机制，以及容易形成的误解。",
    quiz: "请针对当前 Demo 出一道需要我预测行为或解释原因的问题，不要立即给答案。",
  }),
});

function clean(value, maxLength = 1600) {
  const text = String(value ?? "").replace(/\s+/g, " ").trim();
  if (!text) return "";
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}

function lineLabel(startLine, endLine) {
  const start = Number(startLine);
  const end = Number(endLine);
  if (!Number.isFinite(start) || start < 1) return "";
  if (!Number.isFinite(end) || end <= start) return `L${start}`;
  return `L${start}–L${end}`;
}

export function buildLearningActionPrompt({
  kind,
  action,
  learningUnitId,
  learningUnitTitle,
  text,
  section,
  fileName,
  startLine,
  endLine,
  symbol,
} = {}) {
  const instruction = ACTION_COPY[kind]?.[action];
  if (!instruction) throw new TypeError(`Unsupported learning action: ${kind}:${action}`);

  const context = [];
  const unitLabel = clean(learningUnitTitle || learningUnitId, 200);
  if (unitLabel) context.push(`学习单元：${unitLabel}`);

  if (kind === "note") {
    const sectionLabel = clean(section, 240);
    const selectedText = clean(text);
    if (sectionLabel) context.push(`笔记位置：${sectionLabel}`);
    if (selectedText) context.push(`选中内容：\n> ${selectedText}`);
    else context.push("范围：当前笔记/当前小节");
  }

  if (kind === "source") {
    const file = clean(fileName, 240);
    const lines = lineLabel(startLine, endLine);
    const symbolLabel = clean(symbol, 240);
    if (file) context.push(`源码：${file}${lines ? ` ${lines}` : ""}`);
    if (symbolLabel) context.push(`语义区域：${symbolLabel}`);
    context.push("请优先使用当前源码上下文，不要臆造未提供的实现。 ");
  }

  if (kind === "demo") {
    context.push("范围：当前可交互 Demo 及其关联源码");
  }

  return [instruction, "", "上下文：", ...context.map((item) => `- ${item}`)].join("\n").trim();
}

export function createLearningActionDetail(input = {}) {
  const prompt = buildLearningActionPrompt(input);
  return Object.freeze({
    ...input,
    prompt,
    createdAt: Date.now(),
  });
}

export function dispatchLearningAction(input = {}, target = globalThis.window) {
  const detail = createLearningActionDetail(input);
  if (!target?.dispatchEvent || typeof CustomEvent === "undefined") return detail;
  target.dispatchEvent(new CustomEvent(LEARNING_ACTION_EVENT, { detail }));
  return detail;
}
