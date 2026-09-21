export const LEARNING_ACTION_KINDS = Object.freeze({
  EXPLAIN: "explain",
  EXAMPLE: "example",
  COUNTEREXAMPLE: "counterexample",
  QUIZ: "quiz",
  WHY: "why",
  WALKTHROUGH: "walkthrough",
  VERIFY: "verify",
  REVIEW_REASONING: "review-reasoning",
});

export const LEARNING_CONTEXT_KINDS = Object.freeze({
  NOTE: "note",
  SOURCE: "source",
  DEMO: "demo",
  GUIDED: "guided",
});

const ACTION_INSTRUCTIONS = Object.freeze({
  [LEARNING_ACTION_KINDS.EXPLAIN]: "解释这部分内容，先给核心结论，再解释机制，并指出容易混淆的边界。",
  [LEARNING_ACTION_KINDS.EXAMPLE]: "基于这部分内容给一个最小、具体、可运行或可推演的例子。",
  [LEARNING_ACTION_KINDS.COUNTEREXAMPLE]: "给一个有代表性的反例或错误写法，并解释为什么错、什么时候容易踩坑。",
  [LEARNING_ACTION_KINDS.QUIZ]: "基于这部分内容出 1-3 道需要推理的问题，不要直接给答案，等我作答。",
  [LEARNING_ACTION_KINDS.WHY]: "解释这里为什么这样设计或这样写，并说明至少一种替代方案及 trade-off。",
  [LEARNING_ACTION_KINDS.WALKTHROUGH]: "按执行顺序带我读这部分实现，串起关键状态、事件和数据流。",
  [LEARNING_ACTION_KINDS.VERIFY]: "说明这个 Demo/片段在验证什么心智模型，以及我应该观察哪些现象。",
  [LEARNING_ACTION_KINDS.REVIEW_REASONING]: "先检查我的推理。\n\n优先指出一个最值得验证、最可能有偏差的推理点。\n\n如果我的解释不完整，先给最小提示或追问。\n\n默认不要直接给出完整标准答案，除非我明确要求。",
});
const GUIDED_REVIEW_SOURCES = Object.freeze(["explain", "review"]);

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

  const normalizedFileName = clean(fileName);
  const rangeFileName = clean(range?.fileName);
  const staleSourceRange = kind === LEARNING_CONTEXT_KINDS.SOURCE &&
    Boolean(normalizedFileName && rangeFileName && normalizedFileName !== rangeFileName);
  const selection = clampLearningSelection(staleSourceRange ? "" : selectedText);
  const normalizedRange = staleSourceRange ? null : normalizeRange(range);
  return Object.freeze({
    kind,
    learningUnitId: clean(learningUnit?.id),
    learningUnitTitle: clean(learningUnit?.label ?? learningUnit?.title),
    fileName: normalizedFileName,
    range: normalizedRange,
    semanticRegion: staleSourceRange ? "full-file" : clean(semanticRegion),
    selectedText: selection.text,
    selectionTruncated: selection.truncated,
  });
}

export function createGuidedReasoningReviewContext({
  learningUnit,
  source,
  stepId,
  stepPrompt,
  learnerResponse,
  reviewTarget,
} = {}) {
  if (!GUIDED_REVIEW_SOURCES.includes(source)) {
    throw new TypeError("Guided reasoning review source is required");
  }

  const learningUnitId = clean(learningUnit?.id);
  const learningUnitTitle = clean(learningUnit?.label ?? learningUnit?.title);
  const normalizedStepId = clean(stepId);
  const normalizedStepPrompt = clean(stepPrompt);
  const response = clampLearningSelection(learnerResponse);
  const target = clampLearningSelection(reviewTarget, 2000);

  if (!learningUnitId) throw new TypeError("Guided reasoning review requires a learning unit");
  if (!normalizedStepId) throw new TypeError("Guided reasoning review requires a step id");
  if (!normalizedStepPrompt) throw new TypeError("Guided reasoning review requires a step prompt");
  if (!response.text) throw new TypeError("Guided reasoning review requires a learner response");

  return Object.freeze({
    kind: LEARNING_CONTEXT_KINDS.GUIDED,
    learningUnitId,
    learningUnitTitle,
    guidedSource: source,
    stepId: normalizedStepId,
    stepPrompt: normalizedStepPrompt,
    learnerResponse: response.text,
    learnerResponseTruncated: response.truncated,
    reviewTarget: target.text,
    reviewTargetTruncated: target.truncated,
  });
}

function buildGuidedReasoningReviewPrompt(context) {
  if (context?.kind !== LEARNING_CONTEXT_KINDS.GUIDED) {
    throw new TypeError("Guided reasoning review requires a guided context");
  }
  if (!GUIDED_REVIEW_SOURCES.includes(context.guidedSource)) {
    throw new TypeError("Guided reasoning review requires a valid source");
  }
  if (!clean(context.learningUnitId) || !clean(context.stepId) || !clean(context.stepPrompt)) {
    throw new TypeError("Guided reasoning review requires unit and step metadata");
  }
  if (!clean(context.learnerResponse)) {
    throw new TypeError("Guided reasoning review requires a learner response");
  }

  const truncationNotice = context.learnerResponseTruncated
    ? "\n[我的回答已按安全长度截断]"
    : "";
  const delimitedLearnerResponse = context.learnerResponse.replaceAll(
    "</learner_reasoning>",
    "<\\/learner_reasoning>",
  );
  const delimitedReviewTarget = clean(context.reviewTarget).replaceAll(
    "</review_target>",
    "<\\/review_target>",
  );
  const closureContract = delimitedReviewTarget
    ? [
        "",
        "本次是 lesson-scoped review。只按下面的本节核心目标判断，不要自行扩展成新的必修问题。",
        "你的第一行必须且只能二选一：",
        "结论：核心目标已成立",
        "结论：还缺一个核心点",
        "",
        "如果核心目标已成立：用最多 2 个简短要点说明依据，然后停止 remediation；如确有延伸价值，只能放在“可选进阶：”下，且明确它不影响本节完成。",
        "如果还缺一个核心点：只指出最高价值的那个核心缺口，并给 1 个最小追问或验证实验；不要同时展开多个边界问题。",
        "",
        "[本节 review target]",
        "<review_target>",
        delimitedReviewTarget,
        "</review_target>",
        context.reviewTargetTruncated ? "[review target 已按安全长度截断]" : "",
      ]
    : [];

  return [
    ACTION_INSTRUCTIONS[LEARNING_ACTION_KINDS.REVIEW_REASONING],
    ...closureContract,
    "",
    `[学习单元] ${context.learningUnitTitle || context.learningUnitId}`,
    `[Guided step] ${context.stepId}`,
    `[入口] ${context.guidedSource}`,
    "[问题]",
    "<guided_step_prompt>",
    context.stepPrompt,
    "</guided_step_prompt>",
    "[我的回答]",
    "<learner_reasoning>",
    delimitedLearnerResponse,
    "</learner_reasoning>",
    truncationNotice,
  ].join("\n");
}

export function buildLearningActionPrompt({ action, context } = {}) {
  const instruction = ACTION_INSTRUCTIONS[action];
  if (!instruction) throw new TypeError("Unsupported learning action");
  if (!context || !Object.values(LEARNING_CONTEXT_KINDS).includes(context.kind)) {
    throw new TypeError("Learning action context is required");
  }

  if (action === LEARNING_ACTION_KINDS.REVIEW_REASONING) {
    return buildGuidedReasoningReviewPrompt(context);
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
    case LEARNING_CONTEXT_KINDS.GUIDED:
      return [LEARNING_ACTION_KINDS.REVIEW_REASONING];
    default:
      return [];
  }
}
