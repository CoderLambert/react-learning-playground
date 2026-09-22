import { canonicalQuestion } from "./factory.js";

export const USE_REF_QUESTIONS = Object.freeze([
  canonicalQuestion({
    id: "canonical-use-ref-state-vs-ref",
    learningUnitId: "use-ref",
    difficulty: "easy",
    conceptTags: ["ref", "state", "render"],
    content: {
      prompt: "一个数字改变后必须立刻反映在 JSX 中。它最适合由什么驱动？",
      options: [
        { id: "state", text: "State，因为更新需要请求新的 render" },
        { id: "ref-only", text: "只写 ref.current，因为 Ref 会自动触发 render" },
        { id: "dom-text", text: "直接改 DOM textContent 作为 React 的事实来源" },
        { id: "module-variable", text: "模块级变量，不需要 State 或 Ref" },
      ],
      correctOptionId: "state",
      explanation: "可见 UI 事实属于 render 输入。Ref 写入不会请求 render，因此不能替代 State 驱动界面。",
      diagnosticOptionMap: {
        "ref-only": "ref-drives-ui",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "UseRefDemo.jsx", startLine: 47, endLine: 66 }],
  }),
  canonicalQuestion({
    id: "canonical-use-ref-write-current",
    learningUnitId: "use-ref",
    difficulty: "medium",
    conceptTags: ["ref", "render-scheduling"],
    content: {
      prompt: "执行 timerIdRef.current = intervalId 后，React 会因为这次写入自动重新 render 吗？",
      options: [
        { id: "no", text: "不会；写 ref.current 本身不进入 React render 调度" },
        { id: "yes", text: "会；所有 Hook 容器变化都会触发 render" },
        { id: "only-number", text: "只有 current 是数字才会触发 render" },
        { id: "strict-only", text: "只在 Strict Mode 中触发 render" },
      ],
      correctOptionId: "no",
      explanation: "Ref 是组件实例内的稳定可变容器，React 不通过 current 的变化决定是否 render。",
      diagnosticOptionMap: {
        yes: "ref-write-rerenders",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "UseRefDemo.jsx", startLine: 52, endLine: 66 }],
  }),
  canonicalQuestion({
    id: "canonical-use-ref-dom-commit",
    learningUnitId: "use-ref",
    difficulty: "medium",
    conceptTags: ["ref", "dom", "commit"],
    content: {
      prompt: "为什么 inputRef.current?.focus() 更适合放在点击/提交 handler 中，而不是组件 render 时依赖它计算 UI？",
      options: [
        { id: "commit-first", text: "DOM ref 在对应节点 commit 后才可靠指向真实 DOM；render 应保持可预测的 UI 计算" },
        { id: "ref-async", text: "因为 useRef 是网络异步 API" },
        { id: "focus-state", text: "因为 focus 必须存进 State" },
        { id: "hooks-order", text: "因为事件 handler 才允许调用 Hook" },
      ],
      correctOptionId: "commit-first",
      explanation: "DOM 节点由 commit 建立，命令式 DOM 操作通常发生在事件或合适的 Effect 中。",
      diagnosticOptionMap: {
        "ref-async": "dom-ref-during-render",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "UseRefDemo.jsx", startLine: 31, endLine: 42 }],
  }),
  canonicalQuestion({
    id: "canonical-use-ref-transfer",
    learningUnitId: "use-ref",
    difficulty: "medium",
    conceptTags: ["ref", "state", "transfer"],
    content: {
      prompt: "点击后产品要求屏幕上的 Clicks 立即增加。下面实现的核心问题是什么？",
      codeContext: {
        label: "陌生代码 · ClickCounter.jsx",
        language: "jsx",
        code: `function ClickCounter() {
  const countRef = useRef(0);

  return (
    <button onClick={() => { countRef.current += 1; }}>
      Clicks: {countRef.current}
    </button>
  );
}`,
      },
      options: [
        { id: "needs-state", text: "可见 count 应由 State 驱动；只写 Ref 不会请求 render" },
        { id: "needs-effect", text: "应该保留 Ref，再加一个空依赖 Effect 自动刷新 UI" },
        { id: "ref-invalid", text: "useRef 不能保存数字" },
        { id: "button-invalid", text: "button 中不能读取 ref.current" },
      ],
      correctOptionId: "needs-state",
      explanation: "count 是 UI 事实。使用 setState 才能在数据变化后重新计算 JSX。",
      diagnosticOptionMap: {
        "needs-effect": "ref-drives-ui",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "UseRefDemo.jsx", startLine: 47, endLine: 66 }],
  }),
  canonicalQuestion({
    id: "canonical-use-ref-handle-vs-ui",
    learningUnitId: "use-ref",
    difficulty: "hard",
    conceptTags: ["ref", "state", "ownership"],
    content: {
      prompt: "计时器组件同时需要保存 interval handle、可见 seconds、可见 running 状态。哪种划分最合理？",
      options: [
        { id: "handle-ref-ui-state", text: "interval handle 放 Ref；seconds 和 running 放 State" },
        { id: "all-ref", text: "三者都放 Ref，因为 Ref 不会产生额外 render" },
        { id: "all-state", text: "三者都必须放 State，包括 interval handle" },
        { id: "all-dom", text: "三者都直接读取 DOM" },
      ],
      correctOptionId: "handle-ref-ui-state",
      explanation: "handle 只需跨 render 保存且不直接参与 JSX；seconds/running 需要驱动 UI。",
      diagnosticOptionMap: {
        "all-ref": "ref-is-better-state",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "UseRefDemo.jsx", startLine: 47, endLine: 66 }],
  }),
]);
