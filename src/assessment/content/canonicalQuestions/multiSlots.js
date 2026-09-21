import { canonicalQuestion } from "./factory.js";

export const MULTI_SLOTS_QUESTIONS = Object.freeze([
  canonicalQuestion({
    id: "canonical-multi-slots-false",
    learningUnitId: "multi-slots",
    difficulty: "easy",
    conceptTags: ["slots", "api-contract"],
    content: {
      prompt: "在 ProductionModal 的三态协议里，footer={false} 表示什么？",
      options: [
        { id: "hide", text: "调用者显式要求 Footer 区域不渲染" },
        { id: "default", text: "调用者没有提供 Footer，所以使用默认 Footer" },
        { id: "text-false", text: "在 Footer 中显示 false 文本" },
        { id: "error", text: "React 会把 false 当成非法 Prop 抛错" },
      ],
      correctOptionId: "hide",
      explanation: "当前 API 把 false 定义成显式隐藏信号，而 undefined 才代表未提供、使用默认模板。",
      diagnosticOptionMap: {
        default: "false-means-default",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "ProductionModal.jsx", startLine: 96, endLine: 106 }],
  }),
  canonicalQuestion({
    id: "canonical-multi-slots-undefined",
    learningUnitId: "multi-slots",
    difficulty: "easy",
    conceptTags: ["slots", "default"],
    content: {
      prompt: "footer 完全省略时，当前 ProductionModal 为什么会渲染 DefaultModalFooter？",
      options: [
        { id: "undefined-fallback", text: "因为 footer === undefined 表示调用者接受默认模板" },
        { id: "false-fallback", text: "因为省略值等价于显式 false" },
        { id: "context", text: "因为 Context 会自动补一个 Footer" },
        { id: "children", text: "因为 children 会被复制到 Footer" },
      ],
      correctOptionId: "undefined-fallback",
      explanation: "三态协议必须保留“未提供”和“显式隐藏”的区别；只有 undefined 才触发默认。",
      diagnosticOptionMap: {
        "false-fallback": "false-means-default",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "ProductionModal.jsx", startLine: 96, endLine: 106 }],
  }),
  canonicalQuestion({
    id: "canonical-multi-slots-transfer",
    learningUnitId: "multi-slots",
    difficulty: "medium",
    conceptTags: ["slots", "fallback", "transfer"],
    content: {
      prompt: "下面 slot 实现的 bug 是什么？",
      codeContext: {
        label: "陌生代码 · Card.jsx",
        language: "jsx",
        code: `function renderActions(actions) {
  return actions || <DefaultActions />;
}

// contract:
// undefined => default
// false => hide
// React node => override`,
      },
      options: [
        { id: "false-collapsed", text: "actions=false 会因为 || 回退到 DefaultActions，破坏显式隐藏" },
        { id: "undefined-wrong", text: "undefined 不会触发 || 右侧" },
        { id: "node-invalid", text: "React node 不能作为普通 Prop 传递" },
        { id: "function-needed", text: "slot 必须改成 Context 才能工作" },
      ],
      correctOptionId: "false-collapsed",
      explanation: "|| 按 falsy 规则处理值，无法表达这份精确的三态 API。需要显式区分 false 和 undefined。",
      diagnosticOptionMap: {
        "node-invalid": "named-slot-is-context",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "ProductionModal.jsx", startLine: 80, endLine: 106 }],
  }),
  canonicalQuestion({
    id: "canonical-multi-slots-explicit-props",
    learningUnitId: "multi-slots",
    difficulty: "medium",
    conceptTags: ["slots", "props"],
    content: {
      prompt: "title / footer 这类具名 slot 与 Context 的关键区别是什么？",
      options: [
        { id: "explicit-props", text: "它们仍是调用位置显式传入的 Props；不会建立跨层订阅" },
        { id: "implicit-context", text: "具名 slot 本质上就是自动生成的 Context" },
        { id: "global-state", text: "slot 值会自动成为全局 State" },
        { id: "dom-slot", text: "React 会把它们转换成原生 Web Components slot 属性" },
      ],
      correctOptionId: "explicit-props",
      explanation: "ProductionModal 在参数列表直接接收 title/footer。具名 slot 是 API 命名方式，不是新的数据传播机制。",
      diagnosticOptionMap: {
        "implicit-context": "named-slot-is-context",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "ProductionModal.jsx", startLine: 70, endLine: 77 }],
  }),
  canonicalQuestion({
    id: "canonical-multi-slots-api-stability",
    learningUnitId: "multi-slots",
    difficulty: "hard",
    conceptTags: ["slots", "api-design"],
    content: {
      prompt: "为什么显式三态判断通常比 Boolean(footer) 或简单 truthy/falsy 更适合 ProductionModal？",
      options: [
        { id: "preserve-intent", text: "因为 API 需要保留调用者的三种不同意图：默认、覆盖、隐藏" },
        { id: "faster", text: "因为三个 if 一定比 Boolean 转换运行更快" },
        { id: "react-rule", text: "因为 React 禁止对 Props 使用 Boolean()" },
        { id: "state", text: "因为每个 slot 必须独立创建 State" },
      ],
      correctOptionId: "preserve-intent",
      explanation: "这里首先是产品 API contract。精确比较的价值是保持不同输入状态的语义，而不是微小性能差异。",
      diagnosticOptionMap: {
        "react-rule": "falsy-collapse",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "ProductionModal.jsx", startLine: 80, endLine: 106 }],
  }),
]);
