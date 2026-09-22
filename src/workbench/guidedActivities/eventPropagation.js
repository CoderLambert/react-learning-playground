import { GUIDED_RESPONSE_KINDS, GUIDED_STEP_TYPES } from "./contract.js";

export const EVENT_PROPAGATION_DEFINITION = {
  learningUnitId: "event-propagation",
  revision: 1,
  goal: "区分 capture / target / bubble 的传播路径与浏览器默认行为，并为每个控制 API 保留正确职责。",
  steps: [
    {
      id: "predict-prevent-default",
      type: GUIDED_STEP_TYPES.PREDICT,
      prompt: "只开启 preventDefault，不调用 stopPropagation。点击 submit button 后，parent bubble 最合理的结果是什么？",
      response: {
        kind: GUIDED_RESPONSE_KINDS.CHOICE,
        options: [
          { id: "bubble-still-runs", label: "parent bubble 仍会执行，但浏览器默认提交被取消" },
          { id: "bubble-stops", label: "parent bubble 被 preventDefault 自动截断" },
          { id: "capture-stops", label: "capture 与 bubble 都不会发生" },
        ],
      },
      reveal: {
        expectedOptionId: "bubble-still-runs",
        observation: "preventDefault 控制默认行为，不控制传播；bubble 是否继续要看 stopPropagation。",
      },
    },
    {
      id: "experiment-four-combinations",
      type: GUIDED_STEP_TYPES.EXPERIMENT,
      prompt: "在 Demo 依次尝试：两个开关都关、只 stopPropagation、只 preventDefault、两个都开。每次点击前先预测 capture、target、parent bubble 和 form submit 日志。",
      demoActionId: "compare-propagation-and-default-behavior",
      expectedObservation: "capture 先发生；stopPropagation 截断后续 bubble；preventDefault 不截断 bubble，但会取消 submit button 的默认提交行为。",
    },
    {
      id: "explain-two-axes",
      type: GUIDED_STEP_TYPES.EXPLAIN,
      prompt: "用自己的话解释为什么 stopPropagation 与 preventDefault 不能互换，以及 onClick={handleClick} 与 onClick={handleClick()} 的执行时机有什么不同。",
      response: {
        kind: GUIDED_RESPONSE_KINDS.TEXT,
        placeholder: "分别说明传播、默认行为和 handler 传递时机…",
      },
    },
    {
      id: "practice-fix-parent-click",
      type: GUIDED_STEP_TYPES.PRACTICE,
      prompt: "内层链接需要保留正常跳转，但点击它时不应该触发外层 Card 的 onClick。当前代码错误地用 preventDefault。选择最小正确修复。",
      codeContext: {
        label: "陌生组件 · CardLink.jsx",
        language: "jsx",
        code: `function CardLink() {
  return (
    <div onClick={() => selectCard()}>
      <a
        href="/details"
        onClick={(event) => {
          event.preventDefault();
        }}
      >
        查看详情
      </a>
    </div>
  );
}`,
      },
      response: {
        kind: GUIDED_RESPONSE_KINDS.PATCH_CHOICE,
        options: [
          {
            id: "stop-propagation-only",
            label: "Patch A",
            patch: `  onClick={(event) => {
-   event.preventDefault();
+   event.stopPropagation();
  }}`,
          },
          {
            id: "prevent-and-stop",
            label: "Patch B",
            patch: `  onClick={(event) => {
    event.preventDefault();
+   event.stopPropagation();
  }}`,
          },
          {
            id: "remove-handler",
            label: "Patch C",
            patch: `- onClick={(event) => {
-   event.preventDefault();
- }}`,
          },
        ],
      },
      reveal: {
        expectedOptionId: "stop-propagation-only",
        observation: "需求只要求阻止外层 click，因此 stopPropagation 是最小修复。继续 preventDefault 会额外取消链接跳转，改变产品行为。",
      },
    },
    {
      id: "review-event-boundaries",
      type: GUIDED_STEP_TYPES.REVIEW,
      prompt: "复习：capture → target → bubble 是传播；默认提交/跳转是另一条轴；handler 应传给 React 而不是在 render 中调用。",
      resources: ["notes", "source", "demo"],
    },
  ],
};
