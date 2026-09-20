const REACT_LEARN = "https://zh-hans.react.dev/learn";
const REACT_REFERENCE = "https://zh-hans.react.dev/reference";
const REACT_ROUTER = "https://reactrouter.com";
const TANSTACK_QUERY = "https://tanstack.com/query/latest/docs/framework/react";
const W3C_WAI = "https://www.w3.org/WAI";
const TESTING_LIBRARY = "https://testing-library.com/docs";
const VITEST = "https://vitest.dev";
const PLAYWRIGHT = "https://playwright.dev/docs";
const TYPESCRIPT = "https://www.typescriptlang.org/docs";
const MDN = "https://developer.mozilla.org/zh-CN/docs";

function reference(provider, title, url, match = "direct", description = "", presentation) {
  return {
    provider,
    title,
    url,
    match,
    description,
    presentation: presentation ?? (provider === "React" ? "embed" : "external"),
  };
}

function lesson(primary, related = []) {
  return { primary, related };
}

const RAW_OFFICIAL_DOCS_BY_LEARNING_UNIT_ID = {
  "component-jsx-pure-render": lesson(
    reference("React", "你的第一个组件", `${REACT_LEARN}/your-first-component`, "direct", "组件定义、命名与组件树的官方入门章节。"),
    [
      reference("React", "保持组件纯粹", `${REACT_LEARN}/keeping-components-pure`, "related", "补充纯渲染、局部 mutation 与 Strict Mode 对非纯逻辑的暴露。"),
      reference("React", "<StrictMode>", `${REACT_REFERENCE}/react/StrictMode`, "related", "补充开发期重复调用与副作用检查边界。"),
    ],
  ),
  props: lesson(
    reference("React", "向组件传递 Props", `${REACT_LEARN}/passing-props-to-a-component`, "direct", "Props、解构、默认值与单向数据传递。"),
  ),
  children: lesson(
    reference("React", "向组件传递 Props · 将 JSX 作为 children 传递", `${REACT_LEARN}/passing-props-to-a-component#passing-jsx-as-children`, "direct", "children 作为组合插槽的官方说明。"),
  ),
  "multi-slots": lesson(
    reference("React", "向组件传递 Props · 将 JSX 作为 children 传递", `${REACT_LEARN}/passing-props-to-a-component#passing-jsx-as-children`, "related", "React 官方重点讲 children；具名 JSX props 是相同 composition 思想的扩展。"),
  ),
  "conditional-rendering": lesson(
    reference("React", "条件渲染", `${REACT_LEARN}/conditional-rendering`, "direct", "if、三元表达式、&& 与条件 JSX。"),
  ),
  "rendering-lists-key": lesson(
    reference("React", "渲染列表 · 用 key 保持列表项顺序", `${REACT_LEARN}/rendering-lists#keeping-list-items-in-order-with-key`, "direct", "列表渲染与稳定 key。"),
    [
      reference("React", "状态的保留和重置", `${REACT_LEARN}/preserving-and-resetting-state`, "related", "补充 key 如何参与组件身份与 State 保留。"),
    ],
  ),
  "prop-drilling": lesson(
    reference("React", "使用 Context 深层传递参数", `${REACT_LEARN}/passing-data-deeply-with-context`, "direct", "Prop drilling、composition 替代方案与 Context 边界。"),
  ),

  "event-propagation": lesson(
    reference("React", "响应事件", `${REACT_LEARN}/responding-to-events`, "direct", "事件处理、传播、stopPropagation 与 preventDefault。"),
  ),
  "state-snapshot-queue": lesson(
    reference("React", "State 如同一张快照", `${REACT_LEARN}/state-as-a-snapshot`, "direct", "建立 render 中 State snapshot 的核心心智模型。"),
    [
      reference("React", "把一系列 State 更新加入队列", `${REACT_LEARN}/queueing-a-series-of-state-updates`, "direct", "补充 batching、update queue 与函数式 updater。"),
      reference("React", "State：组件的记忆", `${REACT_LEARN}/state-a-components-memory`, "related", "补充 useState 的基础语义。"),
    ],
  ),
  "immutable-state": lesson(
    reference("React", "更新 State 中的对象", `${REACT_LEARN}/updating-objects-in-state`, "direct", "对象 State 的不可变更新与 copy-on-write。"),
    [
      reference("React", "更新 State 中的数组", `${REACT_LEARN}/updating-arrays-in-state`, "direct", "数组 append、remove、replace、sort 等不可变更新。"),
    ],
  ),
  "render-commit": lesson(
    reference("React", "渲染和提交", `${REACT_LEARN}/render-and-commit`, "direct", "Trigger → Render → Commit 的官方渲染流程。"),
  ),

  "state-dry": lesson(
    reference("React", "选择 State 结构", `${REACT_LEARN}/choosing-the-state-structure`, "direct", "避免矛盾、冗余、重复与过深 State。"),
  ),
  "controlled-uncontrolled": lesson(
    reference("React", "在组件间共享状态", `${REACT_LEARN}/sharing-state-between-components`, "direct", "State ownership、受控与非受控组件边界。"),
    [
      reference("React", "<input>", `${REACT_REFERENCE}/react-dom/components/input`, "related", "补充 value/defaultValue 与 onChange 的 DOM 表单控制契约。"),
    ],
  ),
  "lifting-state-up": lesson(
    reference("React", "在组件间共享状态", `${REACT_LEARN}/sharing-state-between-components`, "direct", "把共享 State 提升到最近共同祖先。"),
  ),
  "preserving-resetting-state": lesson(
    reference("React", "状态的保留和重置", `${REACT_LEARN}/preserving-and-resetting-state`, "direct", "State 与 render tree 位置、类型和 key 的身份关系。"),
    [
      reference("React", "渲染列表", `${REACT_LEARN}/rendering-lists`, "related", "补充列表 key 的稳定身份规则。"),
    ],
  ),
  "state-reducer": lesson(
    reference("React", "迁移状态逻辑至 Reducer 中", `${REACT_LEARN}/extracting-state-logic-into-a-reducer`, "direct", "用纯 reducer 集中复杂状态更新逻辑。"),
  ),
  "context-propagation": lesson(
    reference("React", "使用 Context 深层传递参数", `${REACT_LEARN}/passing-data-deeply-with-context`, "direct", "Context Provider/consumer 与深层数据传播。"),
    [
      reference("React", "useContext", `${REACT_REFERENCE}/react/useContext`, "related", "补充订阅和 Provider value 更新语义。"),
    ],
  ),
  "use-reduce-with-context": lesson(
    reference("React", "使用 Reducer 和 Context 拓展你的应用", `${REACT_LEARN}/scaling-up-with-reducer-and-context`, "direct", "Reducer + Context 的官方组合模式。"),
  ),

  "use-ref": lesson(
    reference("React", "使用 Ref 引用值", `${REACT_LEARN}/referencing-values-with-refs`, "direct", "跨 render 保存非渲染数据。"),
    [
      reference("React", "使用 Ref 操作 DOM", `${REACT_LEARN}/manipulating-the-dom-with-refs`, "direct", "补充 DOM ref、focus 与 imperative DOM 操作。"),
    ],
  ),
  "use-effect-correct-usage": lesson(
    reference("React", "使用 Effect 进行同步", `${REACT_LEARN}/synchronizing-with-effects`, "direct", "Effect 用于把 React 与外部系统同步，以及 cleanup 闭环。"),
  ),
  "not-need-effect": lesson(
    reference("React", "你可能不需要 Effect", `${REACT_LEARN}/you-might-not-need-an-effect`, "direct", "派生数据、事件逻辑与不必要 Effect 的官方避坑指南。"),
  ),
  "lifecycle-of-reactive-effects": lesson(
    reference("React", "响应式 Effect 的生命周期", `${REACT_LEARN}/lifecycle-of-reactive-effects`, "direct", "Effect 的独立同步生命周期、响应式值和依赖。"),
  ),
  "event-vs-effect": lesson(
    reference("React", "将事件从 Effect 中分开", `${REACT_LEARN}/separating-events-from-effects`, "direct", "区分交互触发的 Event 与同步驱动的 Effect。"),
  ),
  "effect-event": lesson(
    reference("React", "useEffectEvent", `${REACT_REFERENCE}/react/useEffectEvent`, "direct", "Effect Event 读取最新 committed props/state 的 API 契约。"),
    [
      reference("React", "将事件从 Effect 中分开", `${REACT_LEARN}/separating-events-from-effects`, "related", "补充为什么要分离响应式与非响应式逻辑。"),
    ],
  ),
  "custom-hooks": lesson(
    reference("React", "使用自定义 Hook 复用逻辑", `${REACT_LEARN}/reusing-logic-with-custom-hooks`, "direct", "提取 stateful logic，同时保持各次 Hook 调用 State 独立。"),
  ),
  "advanced-ref": lesson(
    reference("React", "useLayoutEffect", `${REACT_REFERENCE}/react/useLayoutEffect`, "direct", "布局测量与 paint 前同步的使用边界。"),
    [
      reference("React", "useImperativeHandle", `${REACT_REFERENCE}/react/useImperativeHandle`, "direct", "定制通过 ref 暴露的 imperative handle。"),
      reference("React", "使用 Ref 操作 DOM", `${REACT_LEARN}/manipulating-the-dom-with-refs`, "related", "补充 DOM ref 的基础模型。"),
    ],
  ),

  "controlled-form": lesson(
    reference("React", "<input>", `${REACT_REFERENCE}/react-dom/components/input`, "direct", "受控 input、checkbox、radio 与 onChange。"),
    [
      reference("React", "<textarea>", `${REACT_REFERENCE}/react-dom/components/textarea`, "direct", "textarea 的受控/非受控契约。"),
      reference("React", "<select>", `${REACT_REFERENCE}/react-dom/components/select`, "direct", "select 的受控/非受控契约。"),
    ],
  ),
  "form-data-modeling": lesson(
    reference("MDN", "FormData", `${MDN}/Web/API/FormData`, "direct", "对应 new FormData(form)、get()、getAll() 与 has() 等本 Demo 的核心 Web API。"),
    [
      reference("React", "<form>", `${REACT_REFERENCE}/react-dom/components/form`, "related", "补充 React 表单提交与 action 契约。"),
      reference("React", "<input>", `${REACT_REFERENCE}/react-dom/components/input`, "related", "补充 React 受控/非受控输入边界。"),
    ],
  ),
  "form-action": lesson(
    reference("React", "<form>", `${REACT_REFERENCE}/react-dom/components/form`, "direct", "函数 action、FormData 与异步 Action 提交。"),
    [
      reference("React", "<input>", `${REACT_REFERENCE}/react-dom/components/input`, "related", "补充按钮/控件级 formAction。"),
      reference("React", "useTransition", `${REACT_REFERENCE}/react/useTransition`, "related", "补充 Action 与 Transition 的 pending 模型。"),
    ],
  ),
  "action-state-form-status": lesson(
    reference("React", "useActionState", `${REACT_REFERENCE}/react/useActionState`, "direct", "Action 结果状态、previousState 与 isPending。"),
    [
      reference("React", "useFormStatus", `${REACT_REFERENCE}/react-dom/hooks/useFormStatus`, "direct", "表单后代读取 pending/data/method/action。"),
    ],
  ),
  "optimistic-update": lesson(
    reference("React", "useOptimistic", `${REACT_REFERENCE}/react/useOptimistic`, "direct", "Action 期间的 optimistic state 与确认/回退。"),
  ),

  "lazy-suspense": lesson(
    reference("React", "lazy", `${REACT_REFERENCE}/react/lazy`, "direct", "延迟加载组件代码与模块缓存。"),
    [
      reference("React", "<Suspense>", `${REACT_REFERENCE}/react/Suspense`, "direct", "补充 fallback 与 Suspense boundary。"),
    ],
  ),
  "suspense-boundary": lesson(
    reference("React", "<Suspense>", `${REACT_REFERENCE}/react/Suspense`, "direct", "Suspense boundary、fallback 与嵌套 reveal。"),
  ),
  "error-boundary-use": lesson(
    reference("React", "use", `${REACT_REFERENCE}/react/use`, "direct", "读取 Promise/Context 资源并与 Suspense 协作。"),
    [
      reference("React", "Component · Error Boundary", `${REACT_REFERENCE}/react/Component#catching-rendering-errors-with-an-error-boundary`, "direct", "补充 rejected/render error 如何进入 Error Boundary。"),
      reference("React", "<Suspense>", `${REACT_REFERENCE}/react/Suspense`, "related", "补充 Promise pending 对应的 Suspense fallback。"),
    ],
  ),
  "transition-deferred": lesson(
    reference("React", "useTransition", `${REACT_REFERENCE}/react/useTransition`, "direct", "Transition、isPending 与非阻塞更新。"),
    [
      reference("React", "useDeferredValue", `${REACT_REFERENCE}/react/useDeferredValue`, "direct", "延迟非关键 UI 并保留 stale UI。"),
    ],
  ),

  "render-vs-dom-update": lesson(
    reference("React", "渲染和提交", `${REACT_LEARN}/render-and-commit`, "direct", "区分组件 render 与实际 DOM commit。"),
  ),
  "reference-equality": lesson(
    reference("MDN", "Object.is()", `${MDN}/Web/JavaScript/Reference/Global_Objects/Object/is`, "direct", "本 Demo 直接用 Object.is 比较跨 render 的对象、数组和函数引用身份。"),
    [
      reference("React", "memo", `${REACT_REFERENCE}/react/memo`, "related", "补充 Props identity 与组件 memoization 的关联。"),
      reference("React", "useMemo", `${REACT_REFERENCE}/react/useMemo`, "related", "补充依赖比较与缓存值 identity。"),
      reference("React", "useCallback", `${REACT_REFERENCE}/react/useCallback`, "related", "补充函数 identity 与依赖比较。"),
    ],
  ),
  "react-memo": lesson(
    reference("React", "memo", `${REACT_REFERENCE}/react/memo`, "direct", "组件 memoization、props 比较与使用边界。"),
  ),
  "use-memo": lesson(
    reference("React", "useMemo", `${REACT_REFERENCE}/react/useMemo`, "direct", "昂贵计算缓存与依赖语义。"),
  ),
  "use-callback": lesson(
    reference("React", "useCallback", `${REACT_REFERENCE}/react/useCallback`, "direct", "函数引用缓存、依赖与 updater function。"),
  ),
  profiler: lesson(
    reference("React", "<Profiler>", `${REACT_REFERENCE}/react/Profiler`, "direct", "用 Profiler 测量渲染性能。"),
  ),
  "react-compiler": lesson(
    reference("React", "React Compiler · Introduction", `${REACT_LEARN}/react-compiler/introduction`, "direct", "编译期自动优化、渐进采用与手工 memoization 的新边界。"),
  ),

  "external-store": lesson(
    reference("React", "useSyncExternalStore", `${REACT_REFERENCE}/react/useSyncExternalStore`, "direct", "外部 Store 的 subscribe/getSnapshot 契约。"),
  ),
  "portal-third-party": lesson(
    reference("React", "createPortal", `${REACT_REFERENCE}/react-dom/createPortal`, "direct", "Portal 的 React tree / DOM tree 边界。"),
    [
      reference("React", "使用 Effect 进行同步", `${REACT_LEARN}/synchronizing-with-effects`, "related", "补充第三方 DOM 实例的 setup/cleanup 生命周期。"),
    ],
  ),

  "server-state-cache": lesson(
    reference("TanStack Query", "Important Defaults", `${TANSTACK_QUERY}/guides/important-defaults`, "direct", "fresh/stale、cache、refetch、retry 等默认行为。"),
    [
      reference("TanStack Query", "Query Keys", `${TANSTACK_QUERY}/guides/query-keys`, "direct", "Query key 决定缓存身份。"),
      reference("TanStack Query", "Query Invalidation", `${TANSTACK_QUERY}/guides/query-invalidation`, "direct", "失效与后台 refetch。"),
    ],
  ),
  "server-state-mutation": lesson(
    reference("TanStack Query", "Query Cancellation", `${TANSTACK_QUERY}/guides/query-cancellation`, "direct", "AbortSignal 与请求取消。"),
    [
      reference("TanStack Query", "Optimistic Updates", `${TANSTACK_QUERY}/guides/optimistic-updates`, "direct", "乐观更新确认与回滚。"),
      reference("TanStack Query", "Paginated Queries", `${TANSTACK_QUERY}/guides/paginated-queries`, "direct", "分页 query identity 与 previous data。"),
      reference("TanStack Query", "Invalidations from Mutations", `${TANSTACK_QUERY}/guides/invalidations-from-mutations`, "related", "mutation 成功后的缓存失效。"),
    ],
  ),

  "url-state": lesson(
    reference("React Router", "URL Values", `${REACT_ROUTER}/start/declarative/url-values`, "direct", "Route params、search params 与 location 的页面状态来源。"),
    [
      reference("React Router", "useSearchParams", `${REACT_ROUTER}/api/hooks/useSearchParams`, "direct", "读取和更新 URLSearchParams。"),
    ],
  ),
  "nested-routes": lesson(
    reference("React Router", "Routing", `${REACT_ROUTER}/start/framework/routing`, "direct", "嵌套路由、layout route 与 index route。"),
    [
      reference("React Router", "<Outlet>", `${REACT_ROUTER}/api/components/Outlet`, "direct", "父路由渲染匹配子路由的插槽。"),
    ],
  ),
  "navigation-boundary": lesson(
    reference("React Router", "Navigating", `${REACT_ROUTER}/start/data/navigating`, "direct", "Link、NavLink 与程序式导航。"),
    [
      reference("React Router", "useNavigate", `${REACT_ROUTER}/api/hooks/useNavigate`, "direct", "push/replace/history delta 的程序式导航。"),
      reference("React Router", "Error Boundaries", `${REACT_ROUTER}/how-to/error-boundary`, "related", "补充 route error/not-found 类边界的 framework 处理。"),
    ],
  ),
  "route-data-boundary": lesson(
    reference("React Router", "Data Loading", `${REACT_ROUTER}/start/data/data-loading`, "direct", "route match、loader params 与 loader data。"),
    [
      reference("React Router", "Pending UI", `${REACT_ROUTER}/start/data/pending-ui`, "direct", "导航和数据加载期间的 pending UI。"),
      reference("React Router", "Error Boundaries", `${REACT_ROUTER}/how-to/error-boundary`, "direct", "loader/action/render error 的最近路由边界。"),
    ],
  ),

  "accessibility-basics": lesson(
    reference("W3C WAI", "Labeling Controls", `${W3C_WAI}/tutorials/forms/labels/`, "direct", "表单控件 label 与 accessible name 的基础实践。"),
    [
      reference("W3C WCAG", "Understanding Success Criterion 4.1.3: Status Messages", `${W3C_WAI}/WCAG22/Understanding/status-messages.html`, "direct", "无需移动焦点即可感知状态反馈。"),
      reference("W3C ARIA APG", "Providing Accessible Names and Descriptions", `${W3C_WAI}/ARIA/apg/practices/names-and-descriptions/`, "related", "补充 accessible name/description 设计。"),
    ],
  ),
  "accessible-modal": lesson(
    reference("W3C ARIA APG", "Dialog (Modal) Pattern", `${W3C_WAI}/ARIA/apg/patterns/dialog-modal/`, "direct", "Modal dialog 的 focus、Tab、Escape 与语义约束。"),
    [
      reference("W3C ARIA APG", "Modal Dialog Example", `${W3C_WAI}/ARIA/apg/patterns/dialog-modal/examples/dialog/`, "direct", "可运行的 dialog focus management 示例。"),
    ],
  ),

  "testing-strategy": lesson(
    reference("Testing Library", "Guiding Principles", `${TESTING_LIBRARY}/guiding-principles/`, "direct", "以用户行为为中心的测试哲学。"),
    [
      reference("Testing Library", "About Queries", `${TESTING_LIBRARY}/queries/about/`, "direct", "查询优先级与可访问语义。"),
      reference("Vitest", "Getting Started", `${VITEST}/guide/`, "related", "单元/集成测试 runner 的官方入口。"),
      reference("Playwright", "Best Practices", `${PLAYWRIGHT}/best-practices`, "related", "E2E 隔离、定位器与用户可见行为。"),
    ],
  ),
  "typescript-react": lesson(
    reference("React", "使用 TypeScript", `${REACT_LEARN}/typescript`, "direct", "React Props、Hook、事件与 DOM 类型的官方指南。"),
    [
      reference("TypeScript", "JSX", `${TYPESCRIPT}/handbook/jsx.html`, "related", "TSX/JSX 类型检查基础。"),
    ],
  ),

  "rendering-strategies": lesson(
    reference("React Router", "Rendering Strategies", `${REACT_ROUTER}/start/framework/rendering`, "related", "这是 framework 层的 CSR/SSR/静态预渲染实现案例，不代表 React Core 自身规定的统一渲染策略。"),
    [
      reference("React", "hydrateRoot", `${REACT_REFERENCE}/react-dom/client/hydrateRoot`, "related", "React Core 的 hydration primitive。"),
      reference("React", "renderToPipeableStream", `${REACT_REFERENCE}/react-dom/server/renderToPipeableStream`, "related", "React Core 的 Node.js streaming SSR primitive。"),
    ],
  ),
  "hydration-streaming": lesson(
    reference("React", "hydrateRoot", `${REACT_REFERENCE}/react-dom/client/hydrateRoot`, "direct", "服务器 HTML 的 hydration 与 mismatch 边界。"),
    [
      reference("React", "renderToPipeableStream", `${REACT_REFERENCE}/react-dom/server/renderToPipeableStream`, "direct", "Node.js 环境的 streaming SSR。"),
      reference("React", "renderToReadableStream", `${REACT_REFERENCE}/react-dom/server/renderToReadableStream`, "related", "Web Streams 环境的 streaming SSR。"),
      reference("React", "<Suspense>", `${REACT_REFERENCE}/react/Suspense`, "related", "补充 streaming 与 Suspense boundary 的协作。"),
    ],
  ),
  "rsc-boundary": lesson(
    reference("React", "Server Components", `${REACT_REFERENCE}/rsc/server-components`, "direct", "Server/Client boundary、RSC payload 与 bundle 责任。"),
    [
      reference("React", "'use client'", `${REACT_REFERENCE}/rsc/use-client`, "direct", "声明 client module boundary。"),
      reference("React Router", "React Server Components", `${REACT_ROUTER}/how-to/react-server-components`, "related", "观察 framework 如何承接 RSC integration；当前支持状态以其官方页面为准。"),
    ],
  ),
  "server-functions-framework": lesson(
    reference("React", "Server Functions", `${REACT_REFERENCE}/rsc/server-functions`, "direct", "React Server Function 的 primitive 与调用模型。"),
    [
      reference("React", "'use server'", `${REACT_REFERENCE}/rsc/use-server`, "direct", "声明 Server Function 的模块/函数边界。"),
      reference("React Router", "React Server Components", `${REACT_ROUTER}/how-to/react-server-components`, "related", "补充 framework 对 Server Functions/RSC 的集成职责。"),
    ],
  ),
};

function freezeReference(item) {
  return Object.freeze({ ...item });
}

function freezeLesson(entry) {
  return Object.freeze({
    primary: freezeReference(entry.primary),
    related: Object.freeze((entry.related ?? []).map(freezeReference)),
  });
}

export const OFFICIAL_DOCS_BY_LEARNING_UNIT_ID = Object.freeze(
  Object.fromEntries(
    Object.entries(RAW_OFFICIAL_DOCS_BY_LEARNING_UNIT_ID).map(([id, entry]) => [
      id,
      freezeLesson(entry),
    ]),
  ),
);

export const OFFICIAL_DOCS_COVERED_IDS = Object.freeze(
  Object.keys(OFFICIAL_DOCS_BY_LEARNING_UNIT_ID),
);

// A learning unit may intentionally have no authoritative one-to-one reading.
// Keep the reason explicit so future content does not invent a weak mapping just
// to satisfy a coverage metric.
export const OFFICIAL_DOCS_INTENTIONALLY_UNMAPPED = Object.freeze({});

export const OFFICIAL_DOCS_INTENTIONALLY_UNMAPPED_IDS = Object.freeze(
  Object.keys(OFFICIAL_DOCS_INTENTIONALLY_UNMAPPED),
);

// Backwards-compatible alias for the initial pilot export.
export const OFFICIAL_DOCS_PILOT_IDS = OFFICIAL_DOCS_COVERED_IDS;

export function getOfficialDocsForLearningUnit(learningUnitId) {
  if (!learningUnitId) return null;
  return OFFICIAL_DOCS_BY_LEARNING_UNIT_ID[learningUnitId] ?? null;
}
