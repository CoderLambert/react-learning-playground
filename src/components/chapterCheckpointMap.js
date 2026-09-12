const CHECKPOINT_BY_DEMO_ID = {
  "prop-drilling": 1,
  "render-commit": 2,
  "use-reduce-with-context": 3,
  "advanced-ref": 4,
  "optimistic-update": 5,
  "transition-deferred": 6,
  "react-compiler": 7,
  "portal-third-party": 8,
  "server-state-mutation": 9,
  "route-data-boundary": 10,
  "typescript-react": 11,
  "server-functions-framework": 12,
};

const CHAPTER_NEXT_STEPS = {
  1: {
    understood: "你已经理解组件如何组合并保持身份稳定。",
    next: "下一步要回答一次交互如何进入 State 更新与渲染流程。",
    target: "→ Chapter 02 · 事件、State 与渲染模型",
  },
  2: {
    understood: "你已经理解 State 如何更新。",
    next: "下一步要判断 State 应该由谁拥有、应该长什么样。",
    target: "→ Chapter 03 · State 建模与状态架构",
  },
  3: {
    understood: "你已经能设计更可靠的 State。",
    next: "下一步要判断什么时候需要离开 React 数据流，与外部系统同步。",
    target: "→ Chapter 04 · Ref、Effect 与 Escape Hatches",
  },
  4: {
    understood: "你已经能区分事件与 Effect 的职责。",
    next: "下一步要把这套 ownership 应用到表单提交和 mutation。",
    target: "→ Chapter 05 · Forms 与 React 19 Actions",
  },
  5: {
    understood: "你已经理解表单与 Action 的提交边界。",
    next: "下一步要处理异步 UI 的加载、错误与并发揭示。",
    target: "→ Chapter 06 · Suspense 与并发 UI",
  },
  6: {
    understood: "你已经理解异步 UI 的边界。",
    next: "下一步要用 identity 与测量定位真实性能问题。",
    target: "→ Chapter 07 · 性能模型与优化",
  },
  7: {
    understood: "你已经理解 identity、测量与 memo 工具。",
    next: "下一步要把 React 与外部 store、imperative 系统接起来。",
    target: "→ Chapter 08 · 外部 Store 与第三方系统",
  },
  8: {
    understood: "你已经能管理外部订阅与第三方生命周期。",
    next: "下一步要区分 Server State 与本地 UI State。",
    target: "→ Chapter 09 · Server State 与请求架构",
  },
  9: {
    understood: "你已经理解 query identity、fresh/stale、invalidation 与 optimistic model。",
    next: "下一步要把页面状态放进 URL 和 route boundary。",
    target: "→ Chapter 10 · Router 与页面架构",
  },
  10: {
    understood: "你已经理解 URL 与 route boundary。",
    next: "下一步要在质量边界中验证真实用户路径。",
    target: "→ Chapter 11 · TypeScript、Testing 与 Accessibility",
  },
  11: {
    understood: "你已经能用类型、行为测试和键盘检查守住边界。",
    next: "下一步要把这些能力放进 SSR、Hydration 与 RSC 的 framework 边界。",
    target: "→ Chapter 12 · SSR、RSC 与 Framework",
  },
  12: {
    understood: "你已经理解 React Core 与 framework runtime 的边界。",
    next: "下一步要把这些边界组合成一个可维护的真实产品。",
    target: "→ 综合项目",
  },
};

const REAL_INTEGRATION_LABS = {
  9: {
    id: "tanstack-query",
    title: "Real Integration Lab: TanStack Query",
    description: "Core Demo 先建立通用模型；Real Lab 在独立应用中运行真实库，不会注册为 Core Playground Demo。",
    coreDemo: "query identity、fresh/stale、invalidation、optimistic model。",
    realLab: "actual TanStack Query runtime、retry、cancellation、dedupe、mutation lifecycle。",
    command: "cd integration-labs/tanstack-query && npm install && npm run dev:all",
    repositoryUrl: "https://github.com/CoderLambert/react-learning-playground/tree/main/integration-labs/tanstack-query",
  },
  10: {
    id: "router",
    title: "React Router Data Router Real Lab",
    description: "Core Demo 只讲页面与数据边界；Real Lab 在独立应用中运行 React Router Data Router。",
    coreDemo: "URL state、nested route、route boundary 与 loader 的职责模型。",
    realLab: "URL、nested route、loader、error boundary、navigation、404。",
    command: "cd integration-labs/router && npm install && npm run dev",
    repositoryUrl: "https://github.com/CoderLambert/react-learning-playground/tree/main/integration-labs/router",
  },
  12: {
    id: "next-app-router",
    title: "Next.js App Router Real Lab",
    description: "Core Playground 教 React/framework boundary；Real Lab 展示 framework runtime 的落地方式。",
    path: "Rendering Strategies → Hydration → RSC → Server Functions → Checkpoint → Next.js App Router Lab",
    coreDemo: "Rendering Strategies、Hydration、RSC、Server Functions 与 React/framework boundary。",
    realLab: "Next.js App Router framework runtime、Server/Client Components、hydration 与 Server Function。",
    command: "cd integration-labs/next-app-router && npm install && npm run dev",
    repositoryUrl: "https://github.com/CoderLambert/react-learning-playground/tree/main/integration-labs/next-app-router",
  },
};

export function getCheckpointChapter(demoId) {
  return CHECKPOINT_BY_DEMO_ID[demoId] ?? null;
}

export function getChapterNextStep(chapter) {
  return CHAPTER_NEXT_STEPS[chapter] ?? null;
}

export function getIntegrationLab(chapter) {
  return REAL_INTEGRATION_LABS[chapter] ?? null;
}
