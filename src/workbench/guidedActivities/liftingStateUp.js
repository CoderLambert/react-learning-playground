import { GUIDED_RESPONSE_KINDS, GUIDED_STEP_TYPES } from "./contract.js";

export const LIFTING_STATE_UP_DEFINITION = {
  learningUnitId: "lifting-state-up",
  revision: 1,
  goal: "为需要协同的组件建立一个最近共同 State owner，通过 props 向下和 callbacks 向上维持单一事实来源。",
  steps: [
    {
      id: "predict-shared-query-owner",
      type: GUIDED_STEP_TYPES.PREDICT,
      prompt: "SearchBox、Summary、ResultList 都必须反映同一个 query。最可靠的 State owner 是谁？",
      response: {
        kind: GUIDED_RESPONSE_KINDS.CHOICE,
        options: [
          { id: "nearest-common-parent", label: "能覆盖三个消费者的最近共同父级" },
          { id: "each-child-copy", label: "每个子组件各存一份 query，再互相同步" },
          { id: "always-app-root", label: "无论消费者在哪，都放到 App 根节点" },
        ],
      },
      reveal: {
        expectedOptionId: "nearest-common-parent",
        observation: "共享事实只保留一份，并放在刚好覆盖真实协调范围的 owner。",
      },
    },
    {
      id: "experiment-query-flow",
      type: GUIDED_STEP_TYPES.EXPERIMENT,
      prompt: "修改 SearchBox query，观察输入框、Summary 和 ResultList 如何同时从父级 query 得到一致结果。",
      demoActionId: "trace-lifted-query-flow",
      expectedObservation: "SearchBox 只发送意图；父级 query 更新后通过 props 同时驱动所有消费者，无需兄弟之间横向同步。",
    },
    {
      id: "explain-owner-and-intent",
      type: GUIDED_STEP_TYPES.EXPLAIN,
      prompt: "解释为什么“props down / callbacks up”不是口号：它如何把共享事实的 authority 留在 owner，同时让子组件表达用户意图？",
      response: {
        kind: GUIDED_RESPONSE_KINDS.TEXT,
        placeholder: "从唯一 owner、消费者和 intent 回传来说明…",
      },
    },
    {
      id: "practice-lift-selection",
      type: GUIDED_STEP_TYPES.PRACTICE,
      prompt: "两个兄弟组件需要共享同一个 selectedId。选择消除重复本地 State 的最小正确修复。",
      codeContext: {
        label: "陌生组件 · ProductWorkspace.jsx",
        language: "jsx",
        code: `function Picker() {
  const [selectedId, setSelectedId] = useState(null);
  return <ProductPicker value={selectedId} onChange={setSelectedId} />;
}

function Details() {
  const [selectedId] = useState(null);
  return <ProductDetails productId={selectedId} />;
}

function Workspace() {
  return <><Picker /><Details /></>;
}`,
      },
      response: {
        kind: GUIDED_RESPONSE_KINDS.PATCH_CHOICE,
        options: [
          {
            id: "lift-to-workspace",
            label: "Patch A",
            patch: `function Workspace() {
+ const [selectedId, setSelectedId] = useState(null);
  return <>
-   <Picker />
-   <Details />
+   <ProductPicker value={selectedId} onChange={setSelectedId} />
+   <ProductDetails productId={selectedId} />
  </>;
}`,
          },
          {
            id: "sync-effects",
            label: "Patch B",
            patch: `+ // keep both local states and synchronize them with Effects`,
          },
          {
            id: "global-window",
            label: "Patch C",
            patch: `+ window.selectedId = selectedId;`,
          },
        ],
      },
      reveal: {
        expectedOptionId: "lift-to-workspace",
        observation: "Workspace 是两个消费者的最近共同 owner。共享 selection 只保留一份，就不再需要 sibling-to-sibling synchronization。",
      },
    },
    {
      id: "review-lifted-state",
      type: GUIDED_STEP_TYPES.REVIEW,
      prompt: "复习：共享事实只保存一份；放到最近共同 owner；值通过 props 下发；子组件通过 callback 报告 intent；不需要协同的 State 不必过度提升。",
      resources: ["notes", "source", "demo"],
    },
  ],
};
