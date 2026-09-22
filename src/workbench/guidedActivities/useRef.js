import { GUIDED_RESPONSE_KINDS, GUIDED_STEP_TYPES } from "./contract.js";

export const USE_REF_DEFINITION = {
  learningUnitId: "use-ref",
  revision: 1,
  goal: "区分 State 与 Ref：UI 事实由 State 驱动，Ref 只保存跨 render 需要保留但不应触发 render 的可变信息或 DOM handle。",
  steps: [
    {
      id: "predict-ref-write-ui",
      type: GUIDED_STEP_TYPES.PREDICT,
      prompt: "如果按钮点击只执行 countRef.current += 1，没有任何 State 更新，屏幕上 JSX 中读取的计数会自动刷新吗？",
      response: {
        kind: GUIDED_RESPONSE_KINDS.CHOICE,
        options: [
          { id: "no-render-request", label: "不会；写 ref.current 不会请求 React 重新 render" },
          { id: "rerenders-like-state", label: "会；ref.current 变化等价于 setState" },
          { id: "only-dom-ref-renders", label: "只有 ref 保存数字时会 render，DOM ref 不会" },
        ],
      },
      reveal: {
        expectedOptionId: "no-render-request",
        observation: "Ref 是静默可变容器。只有其他原因触发新 render 时，组件才会再次执行；ref 写入本身不会安排 render。",
      },
    },
    {
      id: "experiment-ref-state-roles",
      type: GUIDED_STEP_TYPES.EXPERIMENT,
      prompt: "在 Demo 中先用 DOM ref 聚焦输入框，再启动/暂停计时器。区分 inputRef/timerIdRef 与 timerSeconds/isTimerRunning 各自为什么选择 Ref 或 State。",
      demoActionId: "compare-ref-and-state-roles",
      expectedObservation: "DOM/interval handle 需要跨 render 保留但不参与 JSX；可见秒数与运行状态必须通过 State 驱动界面。",
    },
    {
      id: "explain-ref-boundary",
      type: GUIDED_STEP_TYPES.EXPLAIN,
      prompt: "用自己的话解释：什么信息适合 Ref、什么信息必须是 State，以及为什么 DOM ref 通常要等节点 commit 后再访问。",
      response: {
        kind: GUIDED_RESPONSE_KINDS.TEXT,
        placeholder: "从 render input、silent mutability、DOM commit timing 来说明…",
      },
    },
    {
      id: "practice-move-visible-value-to-state",
      type: GUIDED_STEP_TYPES.PRACTICE,
      prompt: "当前组件希望点击后立刻更新可见计数，但只修改了 Ref。选择最小正确修复。",
      codeContext: {
        label: "陌生组件 · ClickCounter.jsx",
        language: "jsx",
        code: `function ClickCounter() {
  const countRef = useRef(0);

  return (
    <button
      onClick={() => {
        countRef.current += 1;
      }}
    >
      Clicks: {countRef.current}
    </button>
  );
}`,
      },
      response: {
        kind: GUIDED_RESPONSE_KINDS.PATCH_CHOICE,
        options: [
          {
            id: "visible-count-state",
            label: "Patch A",
            patch: `- const countRef = useRef(0);
+ const [count, setCount] = useState(0);
...
- countRef.current += 1;
+ setCount((value) => value + 1);
...
- Clicks: {countRef.current}
+ Clicks: {count}`,
          },
          {
            id: "force-dom-read",
            label: "Patch B",
            patch: `  countRef.current += 1;
+ document.querySelector("button").textContent = countRef.current;`,
          },
          {
            id: "read-ref-twice",
            label: "Patch C",
            patch: `- Clicks: {countRef.current}
+ Clicks: {countRef.current + 0}`,
          },
        ],
      },
      reveal: {
        expectedOptionId: "visible-count-state",
        observation: "计数是可见 UI 事实，变化后必须进入 React render 数据流。Ref 不应作为隐藏的 UI State。",
      },
    },
    {
      id: "review-ref-state-boundary",
      type: GUIDED_STEP_TYPES.REVIEW,
      prompt: "复习：State 驱动 JSX；Ref 跨 render 保存非视觉可变值；写 current 不触发 render；DOM ref 在 commit 后用于命令式操作。",
      resources: ["notes", "source", "demo"],
    },
  ],
};
