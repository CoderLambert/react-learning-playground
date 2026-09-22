import { canonicalQuestion } from "./factory.js";

export const CONTROLLED_UNCONTROLLED_QUESTIONS = Object.freeze([
  canonicalQuestion({
    id: "canonical-controlled-authority",
    learningUnitId: "controlled-uncontrolled",
    difficulty: "easy",
    conceptTags: ["controlled", "ownership"],
    content: {
      prompt: "Controlled Tabs 调用 onChange('settings') 后，谁最终决定下一次 UI 是否真的显示 settings？",
      options: [
        { id: "parent-value", text: "父级下一次传回的 value" },
        { id: "callback-call", text: "只要 onChange 被调用就一定切换" },
        { id: "default-value", text: "defaultValue" },
        { id: "browser", text: "浏览器自动决定" },
      ],
      correctOptionId: "parent-value",
      explanation: "受控模式的当前权威值来自 props。onChange 表达 intent，不是最终事实。",
      diagnosticOptionMap: {
        "callback-call": "onchange-is-authority",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "ControlledUncontrolledDemo.jsx", startLine: 63, endLine: 73 }],
  }),
  canonicalQuestion({
    id: "canonical-uncontrolled-default",
    learningUnitId: "controlled-uncontrolled",
    difficulty: "medium",
    conceptTags: ["uncontrolled", "default-value"],
    content: {
      prompt: "非受控 Tabs 已经挂载并切换到 settings。父级随后只把 defaultValue 从 activity 改成 overview。当前选中项应该怎样理解？",
      options: [
        { id: "stays-internal", text: "仍由 internal State 决定；defaultValue 改变不会持续覆盖已挂载实例" },
        { id: "becomes-overview", text: "立即变成 overview，因为 defaultValue 与 value 等价" },
        { id: "controlled", text: "组件自动切换为 controlled" },
        { id: "error", text: "defaultValue 不能是字符串" },
      ],
      correctOptionId: "stays-internal",
      explanation: "defaultValue 是初始化输入。新的初始值要影响组件，通常需要新实例或明确 reset。",
      diagnosticOptionMap: {
        "becomes-overview": "default-value-controls-after-mount",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "ControlledUncontrolledDemo.jsx", startLine: 156, endLine: 168 }],
  }),
  canonicalQuestion({
    id: "canonical-controlled-mirror",
    learningUnitId: "controlled-uncontrolled",
    difficulty: "medium",
    conceptTags: ["controlled", "derived-state"],
    content: {
      prompt: "一个只支持 controlled 模式的组件把 props.value 复制进 local State，再用 Effect 同步。主要问题是什么？",
      options: [
        { id: "two-authorities", text: "同一个当前值出现两份 authority，增加同步顺序与 stale 状态风险" },
        { id: "effect-required", text: "问题只是 Effect 应换成 Layout Effect" },
        { id: "props-mutable", text: "应该直接修改 props.value" },
        { id: "state-forbidden", text: "受控组件完全不能有任何 local State" },
      ],
      correctOptionId: "two-authorities",
      explanation: "Controlled 的那份值应直接由 prop 决定；组件仍可拥有 hover/focus 等其他 local State。",
      diagnosticOptionMap: {
        "effect-required": "mirror-controlled-prop",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "ControlledUncontrolledDemo.jsx", startLine: 9, endLine: 18 }],
  }),
  canonicalQuestion({
    id: "canonical-controlled-transfer",
    learningUnitId: "controlled-uncontrolled",
    difficulty: "medium",
    conceptTags: ["controlled", "transfer"],
    content: {
      prompt: "下面 SearchInput 是 controlled。用户输入后父级拒绝更新 query 时，input 应显示什么？",
      codeContext: {
        label: "陌生代码 · SearchInput.jsx",
        language: "jsx",
        code: `function SearchInput({ query, onQueryChange }) {
  return (
    <input
      value={query}
      onChange={(event) => onQueryChange(event.target.value)}
    />
  );
}`,
      },
      options: [
        { id: "prop-query", text: "继续显示父级传入的 query，直到父级接受并传回新值" },
        { id: "dom-input", text: "永远显示浏览器刚输入的字符，不受 query prop 影响" },
        { id: "default-query", text: "自动退回 defaultValue" },
        { id: "local-hidden", text: "React 会自动创建一份隐藏 local State 保存输入" },
      ],
      correctOptionId: "prop-query",
      explanation: "value prop 持续指定当前值，onChange 只是把用户 intent 报告给 owner。",
      diagnosticOptionMap: {
        "local-hidden": "onchange-is-authority",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "ControlledUncontrolledDemo.jsx", startLine: 9, endLine: 19 }],
  }),
  canonicalQuestion({
    id: "canonical-controlled-piece-of-state",
    learningUnitId: "controlled-uncontrolled",
    difficulty: "hard",
    conceptTags: ["ownership", "component-design"],
    content: {
      prompt: "一个 Tabs 的 selectedValue 由父级 value 控制，但 hoverIndex 保存在组件内部。这个组件应该怎样理解？",
      options: [
        { id: "per-state-ownership", text: "selectedValue 是 controlled，hoverIndex 是 local；controlled/uncontrolled 应按具体信息的 ownership 判断" },
        { id: "all-controlled", text: "只要有 value prop，组件内任何 State 都禁止存在" },
        { id: "all-uncontrolled", text: "只要有一个 local State，selectedValue 就不再受控" },
        { id: "invalid", text: "React 不允许组件混合两种 ownership" },
      ],
      correctOptionId: "per-state-ownership",
      explanation: "受控/非受控是讨论某份重要信息由谁拥有的设计概念，不是组件的永久二元标签。",
      diagnosticOptionMap: {},
    },
    evidenceRefs: [{ kind: "source", fileName: "ControlledUncontrolledDemo.jsx", startLine: 9, endLine: 18 }],
  }),
]);
