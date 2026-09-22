import { GUIDED_RESPONSE_KINDS, GUIDED_STEP_TYPES } from "./contract.js";

export const MULTI_SLOTS_DEFINITION = {
  learningUnitId: "multi-slots",
  revision: 1,
  goal: "理解 named slot 的 default / override / hide 三态协议，并避免 falsy fallback 破坏显式隐藏。",
  steps: [
    {
      id: "predict-false-footer",
      type: GUIDED_STEP_TYPES.PREDICT,
      prompt: "ProductionModal 的协议规定 footer=false 表示显式隐藏，footer=undefined 表示使用默认 Footer。传 footer={false} 后应该出现什么？",
      response: {
        kind: GUIDED_RESPONSE_KINDS.CHOICE,
        options: [
          { id: "footer-hidden", label: "底部区域不渲染" },
          { id: "default-footer", label: "回退到默认 Footer" },
          { id: "literal-false", label: "页面显示文本 false" },
        ],
      },
      reveal: {
        expectedOptionId: "footer-hidden",
        observation: "false 在这份 API 中是明确的 hide 信号，不能与“未提供”混为一谈。",
      },
    },
    {
      id: "experiment-slot-three-states",
      type: GUIDED_STEP_TYPES.EXPERIMENT,
      prompt: "依次打开全默认、覆盖标题、覆盖 Footer、显式隐藏 Footer 四个 Modal，重点比较省略 slot、传自定义 node、传 false 的区别。",
      demoActionId: "compare-slot-three-state-contract",
      expectedObservation: "undefined 触发默认模板；自定义 node 替换对应区域；false 让区域完全不渲染。",
    },
    {
      id: "explain-three-state-contract",
      type: GUIDED_STEP_TYPES.EXPLAIN,
      prompt: "解释为什么 footer || <DefaultFooter /> 无法正确表达这份三态协议，以及 false 与 undefined 分别代表什么产品意图。",
      response: {
        kind: GUIDED_RESPONSE_KINDS.TEXT,
        placeholder: "从 API contract 而不是 truthy/falsy 口诀来解释…",
      },
    },
    {
      id: "practice-fix-slot-fallback",
      type: GUIDED_STEP_TYPES.PRACTICE,
      prompt: "下面实现把 false 当成了 fallback。要求保持 undefined=默认、false=隐藏、其他值=覆盖。选择最小正确修复。",
      codeContext: {
        label: "陌生 slot 实现",
        language: "jsx",
        code: `function renderFooter(footer) {
  return footer || <DefaultFooter />;
}`,
      },
      response: {
        kind: GUIDED_RESPONSE_KINDS.PATCH_CHOICE,
        options: [
          {
            id: "explicit-three-state",
            label: "Patch A",
            patch: `- return footer || <DefaultFooter />;
+ if (footer === false) return null;
+ if (footer !== undefined) return footer;
+ return <DefaultFooter />;`,
          },
          {
            id: "nullish-fallback",
            label: "Patch B",
            patch: `- return footer || <DefaultFooter />;
+ return footer ?? <DefaultFooter />;`,
          },
          {
            id: "boolean-coerce",
            label: "Patch C",
            patch: `- return footer || <DefaultFooter />;
+ return Boolean(footer) ? footer : <DefaultFooter />;`,
          },
        ],
      },
      reveal: {
        expectedOptionId: "explicit-three-state",
        observation: "显式分支精确对应 API contract。?? 还会把 null 与 undefined 合并；Boolean/falsy 判断仍会让 false 回退默认。",
      },
    },
    {
      id: "review-named-slot-contract",
      type: GUIDED_STEP_TYPES.REVIEW,
      prompt: "复习 ProductionModal 的 slot contract：undefined 默认、自定义 node 覆盖、false 隐藏；具名 slot 仍然是显式 Props。",
      resources: ["notes", "source", "demo"],
    },
  ],
};
