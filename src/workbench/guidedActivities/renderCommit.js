import { GUIDED_RESPONSE_KINDS, GUIDED_STEP_TYPES } from "./contract.js";

export const RENDER_COMMIT_DEFINITION = {
  learningUnitId: "render-commit",
  revision: 1,
  goal: "区分 Trigger、Render、Commit 与 Browser Paint，并理解一次 render 不等于每个 DOM 节点都会 mutation。",
  steps: [
    {
      id: "predict-unrelated-dom",
      type: GUIDED_STEP_TYPES.PREDICT,
      prompt: "只更新 themeTick，Count 文本仍由相同 count 计算。最合理的预期是什么？",
      response: {
        kind: GUIDED_RESPONSE_KINDS.CHOICE,
        options: [
          { id: "render-without-count-mutation", label: "组件可以重新 render，但 Count DOM 不需要发生 mutation" },
          { id: "every-node-mutates", label: "组件 render 后所有 DOM 节点都必须重新写入" },
          { id: "no-render", label: "只要 Count 没变，React 就不会处理这次 themeTick State 更新" },
        ],
      },
      reveal: {
        expectedOptionId: "render-without-count-mutation",
        observation: "Render 计算下一份 UI；Commit 只应用需要的 host changes。目标节点结果不变时不需要 mutation。",
      },
    },
    {
      id: "experiment-count-vs-unrelated",
      type: GUIDED_STEP_TYPES.EXPERIMENT,
      prompt: "分别点击“更新 count”和“只更新无关 state”，比较 Count 节点的 MutationObserver 结果。不要把 requestAnimationFrame 当成 React commit callback。",
      demoActionId: "compare-render-and-dom-mutation",
      expectedObservation: "count 更新会产生 Count DOM mutation；只更新 themeTick 时 Count 文本不变，下一浏览器帧可观察到该节点没有 mutation。",
    },
    {
      id: "explain-render-commit-paint",
      type: GUIDED_STEP_TYPES.EXPLAIN,
      prompt: "解释为什么 React render、DOM commit 与 browser paint 是不同层级，以及为什么组件重新 render 不能直接推出某个 DOM 节点被改写。",
      response: {
        kind: GUIDED_RESPONSE_KINDS.TEXT,
        placeholder: "按 Trigger → Render → Commit → Paint 说明各自职责…",
      },
    },
    {
      id: "practice-order-update-pipeline",
      type: GUIDED_STEP_TYPES.PRACTICE,
      prompt: "点击按钮触发一次 count 更新。按概念上的先后关系排列这条更新链。",
      codeContext: {
        label: "陌生组件 · Counter.jsx",
        language: "jsx",
        code: `function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount((value) => value + 1)}>
      Count: {count}
    </button>
  );
}`,
      },
      response: {
        kind: GUIDED_RESPONSE_KINDS.ORDERED_SEQUENCE,
        items: [
          { id: "browser-paint", label: "浏览器获得一次绘制最新页面的机会" },
          { id: "commit-change", label: "React 把必要的 DOM 变化提交到宿主环境" },
          { id: "render-next-ui", label: "React 调用组件计算下一份 UI 描述" },
          { id: "click-event", label: "用户点击按钮，Event Handler 执行" },
          { id: "state-update", label: "setCount 提交 State 更新请求" },
        ],
      },
      reveal: {
        expectedOrder: [
          "click-event",
          "state-update",
          "render-next-ui",
          "commit-change",
          "browser-paint",
        ],
        observation: "事件先请求 State 更新，React 随后 render 下一份 UI，并在 commit 应用必要变化；浏览器 paint 属于宿主环境后续调度。",
      },
    },
    {
      id: "review-render-commit-boundary",
      type: GUIDED_STEP_TYPES.REVIEW,
      prompt: "复习：Trigger 请求工作，Render 计算 UI，Commit 应用必要 host changes，Browser Paint 不是 React render；rAF 也不是 commit callback。",
      resources: ["notes", "source", "demo"],
    },
  ],
};
