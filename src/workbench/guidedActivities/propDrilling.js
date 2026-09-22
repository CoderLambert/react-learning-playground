import { GUIDED_RESPONSE_KINDS, GUIDED_STEP_TYPES } from "./contract.js";

export const PROP_DRILLING_DEFINITION = {
  learningUnitId: "prop-drilling",
  revision: 1,
  goal: "根据数据所有权和消费者范围，在 Props、Composition、Context 之间选择最小合适机制。",
  steps: [
    {
      id: "predict-three-paths-update",
      type: GUIDED_STEP_TYPES.PREDICT,
      prompt: "顶层 user 从 Alex 改为 Sarah。Props、Composition、Context 三条路径都连接到同一个当前 user。最合理的预期是什么？",
      response: {
        kind: GUIDED_RESPONSE_KINDS.CHOICE,
        options: [
          { id: "all-update", label: "三条路径都能显示 Sarah，只是依赖传递方式不同" },
          { id: "context-only", label: "只有 Context 路径能响应更新" },
          { id: "props-frozen", label: "Props 路径会一直保留第一次传入的 Alex" },
        ],
      },
      reveal: {
        expectedOptionId: "all-update",
        observation: "三种机制都能传递当前数据；课程比较的是依赖边界和接口成本，不是“哪个 API 才会更新”。",
      },
    },
    {
      id: "experiment-three-data-paths",
      type: GUIDED_STEP_TYPES.EXPERIMENT,
      prompt: "修改 user.name / role 并切换 Sarah，观察三条路径都更新。然后查看中间 Navbar/Header：哪些路径要求它们声明 user，哪些只负责布局，哪些完全通过 Context 跳过显式 Props。",
      demoActionId: "compare-props-composition-context",
      expectedObservation: "三条路径都能工作；Props 依赖最显式，Composition 可让布局层不认识 user，Context 让真正消费者直接订阅 Provider value。",
    },
    {
      id: "explain-transmission-choice",
      type: GUIDED_STEP_TYPES.EXPLAIN,
      prompt: "解释为什么“传了三层 Props”本身还不足以引入 Context，以及布局中间层为什么可能更适合 Composition。",
      response: {
        kind: GUIDED_RESPONSE_KINDS.TEXT,
        placeholder: "从真正消费者、依赖可见性和组件职责解释…",
      },
    },
    {
      id: "practice-remove-layout-drilling",
      type: GUIDED_STEP_TYPES.PRACTICE,
      prompt: "下面只有 Avatar 真正需要 user，Shell/Toolbar 只是布局。要求去掉中间层对 user 的业务依赖，又不为单个消费者引入 Context。选择最合适方向。",
      codeContext: {
        label: "陌生组件树",
        language: "jsx",
        code: `function Shell({ user }) {
  return <Toolbar user={user} />;
}

function Toolbar({ user }) {
  return <div className="toolbar"><Avatar user={user} /></div>;
}

function Page({ user }) {
  return <Shell user={user} />;
}`,
      },
      response: {
        kind: GUIDED_RESPONSE_KINDS.PATCH_CHOICE,
        options: [
          {
            id: "compose-avatar-from-page",
            label: "Patch A",
            patch: `- function Shell({ user }) {
-   return <Toolbar user={user} />;
+ function Shell({ children }) {
+   return <div className="toolbar">{children}</div>;
  }

- return <Shell user={user} />;
+ return <Shell><Avatar user={user} /></Shell>;`,
          },
          {
            id: "introduce-context",
            label: "Patch B",
            patch: `+ <UserContext.Provider value={user}>
+   <Shell />
+ </UserContext.Provider>`,
          },
          {
            id: "rename-prop-each-level",
            label: "Patch C",
            patch: `- <Toolbar user={user} />
+ <Toolbar currentUser={user} />`,
          },
        ],
      },
      reveal: {
        expectedOptionId: "compose-avatar-from-page",
        observation: "只有一个深层消费者且中间层只是布局时，父级直接组合 Avatar 能去掉业务数据透传，同时保持依赖显式；Context 在这里没有必要。",
      },
    },
    {
      id: "review-data-passing-boundary",
      type: GUIDED_STEP_TYPES.REVIEW,
      prompt: "复习：Props 不是反模式；Composition 适合布局解耦；Context 适合真正的跨层多消费者共享，State ownership 不会被传递机制自动改变。",
      resources: ["notes", "source", "demo"],
    },
  ],
};
