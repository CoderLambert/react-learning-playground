import { GUIDED_RESPONSE_KINDS, GUIDED_STEP_TYPES } from "./contract.js";

export const CONDITIONAL_RENDERING_DEFINITION = {
  learningUnitId: "conditional-rendering",
  revision: 1,
  goal: "理解条件渲染先依赖可靠的业务状态模型，再选择最简单的 JavaScript 控制流。",
  steps: [
    {
      id: "predict-single-status-branch",
      type: GUIDED_STEP_TYPES.PREDICT,
      prompt: "当前 status='error'，ResultPanel 先处理 loading，再处理 error 并 return。这个 render 中 success UI 会怎样？",
      response: {
        kind: GUIDED_RESPONSE_KINDS.CHOICE,
        options: [
          { id: "only-error", label: "只返回 error 分支，后面的 success 不会进入这次返回树" },
          { id: "error-and-success", label: "error 与 success 都会渲染" },
          { id: "depends-on-css", label: "两个都会生成，再由 CSS 决定显示哪个" },
        ],
      },
      reveal: {
        expectedOptionId: "only-error",
        observation: "early return 直接结束当前函数执行路径，让阻断态成为清晰的互斥分支。",
      },
    },
    {
      id: "experiment-four-statuses",
      type: GUIDED_STEP_TYPES.EXPERIMENT,
      prompt: "依次切换 loading、empty、error、success，并开关调试信息。观察业务 status 如何映射到大块 UI，boolean showDebug 又如何只控制一小段可选内容。",
      demoActionId: "switch-four-conditional-states",
      expectedObservation: "单一 status 决定主要互斥分支；showDebug 只控制额外调试 JSX，不复制主要业务状态。",
    },
    {
      id: "explain-state-before-syntax",
      type: GUIDED_STEP_TYPES.EXPLAIN,
      prompt: "解释为什么多个可互相矛盾的 boolean 不是“换一种 ternary 写法”就能修好，以及为什么能从 items.length 推导的 isEmpty 通常不该再存 State。",
      response: {
        kind: GUIDED_RESPONSE_KINDS.TEXT,
        placeholder: "先说业务事实，再说 JSX 控制流…",
      },
    },
    {
      id: "practice-remove-empty-sync-state",
      type: GUIDED_STEP_TYPES.PRACTICE,
      prompt: "下面列表把 isEmpty 复制成 State，再用 Effect 与 items 同步。要求 UI 始终反映当前 items。选择最小正确修复。",
      codeContext: {
        label: "陌生列表 · Results.jsx",
        language: "jsx",
        code: `function Results({ items }) {
  const [isEmpty, setIsEmpty] = useState(items.length === 0);

  useEffect(() => {
    setIsEmpty(items.length === 0);
  }, [items]);

  return isEmpty ? <Empty /> : <List items={items} />;
}`,
      },
      response: {
        kind: GUIDED_RESPONSE_KINDS.PATCH_CHOICE,
        options: [
          {
            id: "derive-is-empty",
            label: "Patch A",
            patch: `- const [isEmpty, setIsEmpty] = useState(items.length === 0);
- useEffect(() => {
-   setIsEmpty(items.length === 0);
- }, [items]);
+ const isEmpty = items.length === 0;`,
          },
          {
            id: "sync-length-only",
            label: "Patch B",
            patch: `  useEffect(() => {
    setIsEmpty(items.length === 0);
- }, [items]);
+ }, [items.length]);`,
          },
          {
            id: "add-not-empty-state",
            label: "Patch C",
            patch: `+ const [hasItems, setHasItems] = useState(items.length > 0);`,
          },
        ],
      },
      reveal: {
        expectedOptionId: "derive-is-empty",
        observation: "isEmpty 是当前 items 的函数，不是独立事实。直接派生让条件分支始终基于同一次 render 的输入。",
      },
    },
    {
      id: "review-conditional-state-model",
      type: GUIDED_STEP_TYPES.REVIEW,
      prompt: "复习：先建模业务状态和互斥关系，再使用 if/ternary/&&；能派生的条件直接计算。",
      resources: ["notes", "source", "demo"],
    },
  ],
};
