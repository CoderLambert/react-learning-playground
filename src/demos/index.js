import { ComponentJsxPureRenderDemo } from "./ComponentJsxPureRenderDemo";
import { PropsBasicsDemo } from "./PropsBasicsDemo";
import { ChildrenSlotDemo } from "./ChildrenSlotDemo";
import { MultiSlotsDemo } from "./MultiSlotsDemo";
import { ConditionalRenderingDemo } from "./ConditionalRenderingDemo";
import { RenderingListsKeyDemo } from "./RenderingListsKeyDemo";
import { PropDrillingDemo } from "./PropDrillingDemo";
import { EventPropagationDemo } from "./EventPropagationDemo";
import { StateSnapshotQueueDemo } from "./StateSnapshotQueueDemo";
import { ImmutableStateDemo } from "./ImmutableStateDemo";
import { RenderCommitDemo } from "./RenderCommitDemo";
import { StateDryDemo } from "./StateDryDemo";
import { ControlledUncontrolledDemo } from "./ControlledUncontrolledDemo";
import { LiftingStateUpDemo } from "./LiftingStateUpDemo";
import { PreservingResettingStateDemo } from "./PreservingResettingStateDemo";
import { StateReducerDemo } from "./StateReducerDemo";
import { ContextPropagationDemo } from "./ContextPropagationDemo";
import { UseReduceWithContextDemo } from "./UseReduceWithContextDemo";
import { UseRefDemo } from "./UseRefDemo";
import { UseEffectCorrectUsageDemo } from "./UseEffectCorrectUsageDemo";
import { NotNeedEffectDemo } from "./NotNeedEffectDemo";
import { LifecycleOfReactiveEffectsDemo } from "./LifecycleOfReactiveEffectsDemo";
import { EventVsEffectDemo } from "./EventVsEffectDemo";
import { EffectEventDemo } from "./EffectEventDemo";
import { CustomHooksDemo } from "./CustomHooksDemo";
import { AdvancedRefDemo } from "./AdvancedRefDemo";
import { ControlledFormDemo } from "./ControlledFormDemo";
import { FormDataModelingDemo } from "./FormDataModelingDemo";
import { FormActionDemo } from "./FormActionDemo";
import { ActionStateFormStatusDemo } from "./ActionStateFormStatusDemo";
import { OptimisticUpdateDemo } from "./OptimisticUpdateDemo";
import { LazySuspenseDemo } from "./LazySuspenseDemo";
import { SuspenseBoundaryDemo } from "./SuspenseBoundaryDemo";
import { ErrorBoundaryUseDemo } from "./ErrorBoundaryUseDemo";
import { TransitionDeferredDemo } from "./TransitionDeferredDemo";
import { RenderVsDomUpdateDemo } from "./RenderVsDomUpdateDemo";
import { ReferenceEqualityDemo } from "./ReferenceEqualityDemo";
import { ReactMemoDemo } from "./ReactMemoDemo";
import { UseMemoDemo } from "./UseMemoDemo";
import { UseCallbackDemo } from "./UseCallbackDemo";
import { ProfilerDemo } from "./ProfilerDemo";
import { ReactCompilerDemo } from "./ReactCompilerDemo";
import { ExternalStoreDemo } from "./ExternalStoreDemo";
import { PortalThirdPartyDemo } from "./PortalThirdPartyDemo";
import { ServerStateCacheDemo } from "./ServerStateCacheDemo";
import { ServerStateMutationDemo } from "./ServerStateMutationDemo";
import { UrlStateDemo } from "./UrlStateDemo";
import { NestedRoutesDemo } from "./NestedRoutesDemo";
import { NavigationBoundaryDemo } from "./NavigationBoundaryDemo";
import { RouteDataBoundaryDemo } from "./RouteDataBoundaryDemo";
import { AccessibilityBasicsDemo } from "./AccessibilityBasicsDemo";
import { AccessibleModalDemo } from "./AccessibleModalDemo";
import { TestingStrategyDemo } from "./TestingStrategyDemo";
import { TypeScriptReactDemo } from "./TypeScriptReactDemo";
import { RenderingStrategiesDemo } from "./RenderingStrategiesDemo";
import { HydrationStreamingDemo } from "./HydrationStreamingDemo";
import { RscBoundaryDemo } from "./RscBoundaryDemo";
import { ServerFunctionsFrameworkDemo } from "./ServerFunctionsFrameworkDemo";

// 源码原始字符串（Vite ?raw 原生支持）
import componentJsxPureRenderRaw from "./ComponentJsxPureRenderDemo.jsx?raw";
import propsBasicsRaw from "./PropsBasicsDemo.jsx?raw";
import userCardRaw from "../components/UserCard.jsx?raw";
import productCardRaw from "../components/ProductCard.jsx?raw";
import childrenSlotRaw from "./ChildrenSlotDemo.jsx?raw";
import cardContainerRaw from "../components/CardContainer.jsx?raw";
import modalLayoutRaw from "../components/ModalLayout.jsx?raw";
import multiSlotsRaw from "./MultiSlotsDemo.jsx?raw";
import multySlotsComponentRaw from "../components/MultySlots.jsx?raw";
import pannelRaw from "../components/Pannel.jsx?raw";
import conditionalRenderingRaw from "./ConditionalRenderingDemo.jsx?raw";
import renderingListsKeyRaw from "./RenderingListsKeyDemo.jsx?raw";
import propDrillingRaw from "./PropDrillingDemo.jsx?raw";
import eventPropagationRaw from "./EventPropagationDemo.jsx?raw";
import stateSnapshotQueueRaw from "./StateSnapshotQueueDemo.jsx?raw";
import immutableStateRaw from "./ImmutableStateDemo.jsx?raw";
import renderCommitRaw from "./RenderCommitDemo.jsx?raw";
import stateDryRaw from "./StateDryDemo.jsx?raw";
import controlledUncontrolledRaw from "./ControlledUncontrolledDemo.jsx?raw";
import liftingStateUpRaw from "./LiftingStateUpDemo.jsx?raw";
import preservingResettingStateRaw from "./PreservingResettingStateDemo.jsx?raw";
import stateReducerRaw from "./StateReducerDemo.jsx?raw";
import contextPropagationRaw from "./ContextPropagationDemo.jsx?raw";
import useReduceWithContextRaw from "./UseReduceWithContextDemo.jsx?raw";
import useRefRaw from "./UseRefDemo.jsx?raw";
import useEffectCorrectUsageRaw from "./UseEffectCorrectUsageDemo.jsx?raw";
import notNeedEffectRaw from "./NotNeedEffectDemo.jsx?raw";
import lifecycleRaw from "./LifecycleOfReactiveEffectsDemo.jsx?raw";
import eventVsEffectRaw from "./EventVsEffectDemo.jsx?raw";
import effectEventRaw from "./EffectEventDemo.jsx?raw";
import customHooksRaw from "./CustomHooksDemo.jsx?raw";
import advancedRefRaw from "./AdvancedRefDemo.jsx?raw";
import controlledFormRaw from "./ControlledFormDemo.jsx?raw";
import formDataModelingRaw from "./FormDataModelingDemo.jsx?raw";
import formActionRaw from "./FormActionDemo.jsx?raw";
import actionStateFormStatusRaw from "./ActionStateFormStatusDemo.jsx?raw";
import optimisticUpdateRaw from "./OptimisticUpdateDemo.jsx?raw";
import lazySuspenseRaw from "./LazySuspenseDemo.jsx?raw";
import lazyLessonPanelRaw from "../components/LazyLessonPanel.jsx?raw";
import suspenseBoundaryRaw from "./SuspenseBoundaryDemo.jsx?raw";
import errorBoundaryUseRaw from "./ErrorBoundaryUseDemo.jsx?raw";
import transitionDeferredRaw from "./TransitionDeferredDemo.jsx?raw";
import renderVsDomUpdateRaw from "./RenderVsDomUpdateDemo.jsx?raw";
import referenceEqualityRaw from "./ReferenceEqualityDemo.jsx?raw";
import reactMemoRaw from "./ReactMemoDemo.jsx?raw";
import useMemoRaw from "./UseMemoDemo.jsx?raw";
import useCallbackRaw from "./UseCallbackDemo.jsx?raw";
import profilerRaw from "./ProfilerDemo.jsx?raw";
import reactCompilerRaw from "./ReactCompilerDemo.jsx?raw";
import externalStoreRaw from "./ExternalStoreDemo.jsx?raw";
import portalThirdPartyRaw from "./PortalThirdPartyDemo.jsx?raw";
import serverStateCacheRaw from "./ServerStateCacheDemo.jsx?raw";
import serverStateMutationRaw from "./ServerStateMutationDemo.jsx?raw";
import urlStateRaw from "./UrlStateDemo.jsx?raw";
import nestedRoutesRaw from "./NestedRoutesDemo.jsx?raw";
import navigationBoundaryRaw from "./NavigationBoundaryDemo.jsx?raw";
import routeDataBoundaryRaw from "./RouteDataBoundaryDemo.jsx?raw";
import accessibilityBasicsRaw from "./AccessibilityBasicsDemo.jsx?raw";
import accessibleModalRaw from "./AccessibleModalDemo.jsx?raw";
import testingStrategyRaw from "./TestingStrategyDemo.jsx?raw";
import rtlBehaviorRaw from "./testing-samples/behavior.test.jsx?raw";
import playwrightSpecRaw from "./testing-samples/app.spec.js?raw";
import typeScriptReactRaw from "./TypeScriptReactDemo.jsx?raw";
import reactBoundariesRaw from "./typescript-samples/react-boundaries.tsx?raw";
import genericPatternsRaw from "./typescript-samples/generic-patterns.tsx?raw";
import renderingStrategiesRaw from "./RenderingStrategiesDemo.jsx?raw";
import hydrationStreamingRaw from "./HydrationStreamingDemo.jsx?raw";
import rscBoundaryRaw from "./RscBoundaryDemo.jsx?raw";
import serverFunctionsFrameworkRaw from "./ServerFunctionsFrameworkDemo.jsx?raw";

// @demo-imports

export const CATEGORIES = [
  { id: "components", name: "组件通信与插槽", icon: "🧩" },
  { id: "render-model", name: "事件、State 与渲染模型", icon: "🔁" },
  { id: "state", name: "状态管理与演进", icon: "⚡" },
  { id: "effects", name: "Hooks 与副作用深度", icon: "🎣" },
  { id: "forms", name: "Forms 与 React 19 Actions", icon: "📝" },
  { id: "async-ui", name: "Suspense 与并发 UI", icon: "⏳" },
  { id: "performance", name: "性能模型与优化", icon: "🚀" },
  { id: "external", name: "外部 Store 与第三方系统", icon: "📡" },
  { id: "server-state", name: "Server State 与请求架构", icon: "🗄️" },
  { id: "routing", name: "Router 与页面状态", icon: "🧭" },
  { id: "accessibility", name: "Accessibility", icon: "♿" },
  { id: "testing", name: "Testing 与质量边界", icon: "🧪" },
  { id: "typescript", name: "TypeScript for React", icon: "🔷" },
  { id: "server-react", name: "SSR、RSC 与 Framework", icon: "🖥️" },
];

export const demos = [
  { id: "component-jsx-pure-render", label: "Component、JSX 与纯渲染", category: "components", badge: "基础", description: "组件作为 UI 构建块、JSX 表达式、Fragment、组件树与纯渲染约束", Component: ComponentJsxPureRenderDemo, files: [{ name: "ComponentJsxPureRenderDemo.jsx", code: componentJsxPureRenderRaw }] },
  { id: "props", label: "Props 基础与解构", category: "components", badge: "基础", description: "单向只读数据流、对象解构默认值回退、展开语法与派生计算", Component: PropsBasicsDemo, files: [{ name: "PropsBasicsDemo.jsx", code: propsBasicsRaw }, { name: "UserCard.jsx", code: userCardRaw }, { name: "ProductCard.jsx", code: productCardRaw }] },
  { id: "children", label: "Children 默认插槽", category: "components", badge: "组合", description: "React 组合模式（Composition），容器布局与可插拔子节点解耦", Component: ChildrenSlotDemo, files: [{ name: "ChildrenSlotDemo.jsx", code: childrenSlotRaw }, { name: "CardContainer.jsx", code: cardContainerRaw }, { name: "ModalLayout.jsx", code: modalLayoutRaw }] },
  { id: "multi-slots", label: "具名多插槽客制化", category: "components", badge: "规范", description: "生产级多插槽三态协议（默认模板 + 局部覆盖 + 显式隐藏）", Component: MultiSlotsDemo, files: [{ name: "MultiSlotsDemo.jsx", code: multiSlotsRaw }, { name: "ProductionModal.jsx", code: multySlotsComponentRaw }, { name: "Pannel.jsx", code: pannelRaw }] },
  { id: "conditional-rendering", label: "条件渲染与业务四态", category: "components", badge: "分支", description: "用 if、early return、三元表达式与 && 将 loading/empty/error/success 清晰映射为 UI", Component: ConditionalRenderingDemo, files: [{ name: "ConditionalRenderingDemo.jsx", code: conditionalRenderingRaw }] },
  { id: "rendering-lists-key", label: "列表渲染与 key 身份", category: "components", badge: "核心", description: "通过可编辑列表排序实验理解 stable key、index key 与组件 State 身份匹配", Component: RenderingListsKeyDemo, files: [{ name: "RenderingListsKeyDemo.jsx", code: renderingListsKeyRaw }] },
  { id: "prop-drilling", label: "属性逐层透传解法", category: "components", badge: "解耦", description: "对比逐层透传 (Drilling)、组件组合 (Children) 与 Context API", Component: PropDrillingDemo, files: [{ name: "PropDrillingDemo.jsx", code: propDrillingRaw }] },
  { id: "event-propagation", label: "Event Handler 与事件传播", category: "render-model", badge: "事件", description: "观察 handler 传递、capture/bubble、stopPropagation、preventDefault 与 Event/Effect 的职责边界", Component: EventPropagationDemo, files: [{ name: "EventPropagationDemo.jsx", code: eventPropagationRaw }] },
  { id: "state-snapshot-queue", label: "State Snapshot、Batching 与 Update Queue", category: "render-model", badge: "核心", description: "把 useState、snapshot、batching 与 functional updater 的不可见时序变成可观察日志", Component: StateSnapshotQueueDemo, files: [{ name: "StateSnapshotQueueDemo.jsx", code: stateSnapshotQueueRaw }] },
  { id: "immutable-state", label: "对象 / 数组 State 不可变更新", category: "render-model", badge: "不可变", description: "观察 nested copy、append/remove/replace/sort 与 reference identity，理解为什么 mutation 会破坏更新模型", Component: ImmutableStateDemo, files: [{ name: "ImmutableStateDemo.jsx", code: immutableStateRaw }] },
  { id: "render-commit", label: "Trigger → Render → Commit", category: "render-model", badge: "渲染模型", description: "区分触发、Render、Commit 与 Browser Paint，并观察 render 不等于 DOM 一定变化", Component: RenderCommitDemo, files: [{ name: "RenderCommitDemo.jsx", code: renderCommitRaw }] },
  { id: "state-dry", label: "State 结构设计与单一数据源", category: "state", badge: "核心", description: "避免矛盾、冗余、重复与过深 State，通过派生计算和扁平化降低同步风险", Component: StateDryDemo, files: [{ name: "StateDryDemo.jsx", code: stateDryRaw }] },
  { id: "controlled-uncontrolled", label: "受控与非受控组件", category: "state", badge: "所有权", description: "从组件 API 理解 State ownership：value + onChange 与 defaultValue 的边界", Component: ControlledUncontrolledDemo, files: [{ name: "ControlledUncontrolledDemo.jsx", code: controlledUncontrolledRaw }] },
  { id: "lifting-state-up", label: "状态提升与协同联动", category: "state", badge: "协同", description: "兄弟组件状态共享、受控输入与向最近共同祖先提升", Component: LiftingStateUpDemo, files: [{ name: "LiftingStateUpDemo.jsx", code: liftingStateUpRaw }] },
  { id: "preserving-resetting-state", label: "State 保留、重置与 key 身份", category: "state", badge: "身份", description: "可视化 State 与 render tree 位置的绑定，以及 key 如何显式切换组件身份并重置子树", Component: PreservingResettingStateDemo, files: [{ name: "PreservingResettingStateDemo.jsx", code: preservingResettingStateRaw }] },
  { id: "state-reducer", label: "useReducer 状态机模式", category: "state", badge: "架构", description: "将更新逻辑集中为纯函数 Reducer，规范复杂状态与行为审计", Component: StateReducerDemo, files: [{ name: "StateReducerDemo.jsx", code: stateReducerRaw }] },
  { id: "context-propagation", label: "Context 更新传播模型", category: "state", badge: "订阅", description: "可视化 useContext 订阅、Provider value 更新传播，以及 memo 与 Context 的真实边界", Component: ContextPropagationDemo, files: [{ name: "ContextPropagationDemo.jsx", code: contextPropagationRaw }] },
  { id: "use-reduce-with-context", label: "Reducer + Context 双通道优化", category: "state", badge: "进阶", description: "拆分 State 与 Dispatch 上下文，缩小只消费 dispatch 节点的更新范围", Component: UseReduceWithContextDemo, files: [{ name: "UseReduceWithContextDemo.jsx", code: useReduceWithContextRaw }] },
  { id: "use-ref", label: "useRef 引用与 DOM 控制", category: "effects", badge: "引用", description: "DOM 访问、可变值持久化与纯函数渲染期的引用安全守则", Component: UseRefDemo, files: [{ name: "UseRefDemo.jsx", code: useRefRaw }] },
  { id: "use-effect-correct-usage", label: "useEffect 正确用法与心智", category: "effects", badge: "同步", description: "与外部系统同步、定时器与事件监听的清理函数 (Cleanup) 闭环", Component: UseEffectCorrectUsageDemo, files: [{ name: "UseEffectCorrectUsageDemo.jsx", code: useEffectCorrectUsageRaw }] },
  { id: "not-need-effect", label: "无需 Effect 的常见反模式", category: "effects", badge: "避坑", description: "官方避坑指南：衍生数据计算、用户事件触发与依赖同步陷阱", Component: NotNeedEffectDemo, files: [{ name: "NotNeedEffectDemo.jsx", code: notNeedEffectRaw }] },
  { id: "lifecycle-of-reactive-effects", label: "响应式 Effect 生命周期与依赖", category: "effects", badge: "深度", description: "响应式值追踪、依赖闭环、使用 Ref 与函数式更新解耦依赖", Component: LifecycleOfReactiveEffectsDemo, files: [{ name: "LifecycleOfReactiveEffectsDemo.jsx", code: lifecycleRaw }] },
  { id: "event-vs-effect", label: "Event vs Effect 因果边界", category: "effects", badge: "核心", description: "区分用户动作与外部系统同步，避免用 State + Effect 间接编排业务事件", Component: EventVsEffectDemo, files: [{ name: "EventVsEffectDemo.jsx", code: eventVsEffectRaw }] },
  { id: "effect-event", label: "useEffectEvent 非响应式逻辑", category: "effects", badge: "React 19.2", description: "读取最新 committed props/state，同时避免无关值变化导致 Effect 重新同步", Component: EffectEventDemo, files: [{ name: "EffectEventDemo.jsx", code: effectEventRaw }] },
  { id: "custom-hooks", label: "Custom Hooks 复用状态逻辑", category: "effects", badge: "抽象", description: "复用 stateful logic 与 Effect 封装，同时保持每次 Hook 调用的 State 独立", Component: CustomHooksDemo, files: [{ name: "CustomHooksDemo.jsx", code: customHooksRaw }] },
  { id: "advanced-ref", label: "Layout Effect 与高级 Ref", category: "effects", badge: "P2", description: "布局测量、imperative handle、React 19 ref-as-prop 与 forwardRef 历史边界", Component: AdvancedRefDemo, files: [{ name: "AdvancedRefDemo.jsx", code: advancedRefRaw }] },
  { id: "controlled-form", label: "Controlled Form 与实时校验", category: "forms", badge: "基础", description: "input / textarea / select / checkbox / radio 的受控数据流、派生校验与提交快照", Component: ControlledFormDemo, files: [{ name: "ControlledFormDemo.jsx", code: controlledFormRaw }] },
  { id: "form-data-modeling", label: "FormData 与提交状态建模", category: "forms", badge: "建模", description: "非受控字段、提交时读取 FormData、get/getAll 与领域 payload 转换", Component: FormDataModelingDemo, files: [{ name: "FormDataModelingDemo.jsx", code: formDataModelingRaw }] },
  { id: "form-action", label: "React 19 form action / formAction", category: "forms", badge: "React 19", description: "函数 action、按钮级 formAction、FormData 与异步 Action / Transition 提交模型", Component: FormActionDemo, files: [{ name: "FormActionDemo.jsx", code: formActionRaw }] },
  { id: "action-state-form-status", label: "useActionState + useFormStatus", category: "forms", badge: "状态", description: "Action 结果状态、previousState、isPending 与表单后代组件读取 pending/data", Component: ActionStateFormStatusDemo, files: [{ name: "ActionStateFormStatusDemo.jsx", code: actionStateFormStatusRaw }] },
  { id: "optimistic-update", label: "useOptimistic 成功收敛与失败回退", category: "forms", badge: "Optimistic", description: "Action 期间的临时 optimistic state、服务器成功确认与失败自动回退", Component: OptimisticUpdateDemo, files: [{ name: "OptimisticUpdateDemo.jsx", code: optimisticUpdateRaw }] },
  { id: "lazy-suspense", label: "lazy + Suspense 与 Code Splitting", category: "async-ui", badge: "加载", description: "观察首次 lazy module 加载、Suspense fallback 与模块缓存边界", Component: LazySuspenseDemo, files: [{ name: "LazySuspenseDemo.jsx", code: lazySuspenseRaw }, { name: "LazyLessonPanel.jsx", code: lazyLessonPanelRaw }] },
  { id: "suspense-boundary", label: "Suspense Boundary 与 Nested Reveal", category: "async-ui", badge: "Boundary", description: "对比单一与嵌套 Suspense boundary，观察不同资源准备速度如何影响 reveal sequence", Component: SuspenseBoundaryDemo, files: [{ name: "SuspenseBoundaryDemo.jsx", code: suspenseBoundaryRaw }] },
  { id: "error-boundary-use", label: "Error Boundary + React 19 use", category: "async-ui", badge: "React 19", description: "观察 Promise pending → Suspense、rejected → Error Boundary，并理解稳定 Promise/缓存要求", Component: ErrorBoundaryUseDemo, files: [{ name: "ErrorBoundaryUseDemo.jsx", code: errorBoundaryUseRaw }] },
  { id: "transition-deferred", label: "Transition Pending 与 Deferred UI", category: "async-ui", badge: "并发", description: "观察 urgent update、isPending、后台 render、deferred stale UI，并区分 useDeferredValue 与 debounce", Component: TransitionDeferredDemo, files: [{ name: "TransitionDeferredDemo.jsx", code: transitionDeferredRaw }] },
  { id: "render-vs-dom-update", label: "Re-render ≠ DOM Update", category: "performance", badge: "核心", description: "用 MutationObserver 对照 Render 与 Commit，建立先测量再优化的性能心智模型", Component: RenderVsDomUpdateDemo, files: [{ name: "RenderVsDomUpdateDemo.jsx", code: renderVsDomUpdateRaw }] },
  { id: "reference-equality", label: "Reference Equality 引用身份", category: "performance", badge: "基础", description: "用 Object.is 对比对象、数组、函数跨 Render 的 identity，理解 memo 与 Hook dependencies 的基础", Component: ReferenceEqualityDemo, files: [{ name: "ReferenceEqualityDemo.jsx", code: referenceEqualityRaw }] },
  { id: "react-memo", label: "React.memo 命中与失效", category: "performance", badge: "优化", description: "对比 primitive、新对象与稳定对象 props，观察 memo 的命中条件和 identity 陷阱", Component: ReactMemoDemo, files: [{ name: "ReactMemoDemo.jsx", code: reactMemoRaw }] },
  { id: "use-memo", label: "useMemo 昂贵计算缓存", category: "performance", badge: "优化", description: "对比缓存与直接计算，观察依赖变化、昂贵计算与稳定 identity 的真实使用边界", Component: UseMemoDemo, files: [{ name: "UseMemoDemo.jsx", code: useMemoRaw }] },
  { id: "use-callback", label: "useCallback 函数引用稳定", category: "performance", badge: "优化", description: "联动 memo child 观察函数 prop identity，理解 useCallback 的命中条件、updater function 与真实边界", Component: UseCallbackDemo, files: [{ name: "UseCallbackDemo.jsx", code: useCallbackRaw }] },
  { id: "profiler", label: "Profiler 先测量再优化", category: "performance", badge: "分析", description: "用 Profiler actualDuration/baseDuration 观察 commit 成本，建立先定位瓶颈再优化的流程", Component: ProfilerDemo, files: [{ name: "ProfilerDemo.jsx", code: profilerRaw }] },
  { id: "react-compiler", label: "React Compiler 自动优化模型", category: "performance", badge: "Compiler", description: "理解构建期自动 memoization、Rules of React、渐进采用与手工 memoization 的新边界", Component: ReactCompilerDemo, files: [{ name: "ReactCompilerDemo.jsx", code: reactCompilerRaw }] },
  { id: "external-store", label: "useSyncExternalStore 外部订阅", category: "external", badge: "Store", description: "可视化 subscribe/getSnapshot、snapshot identity、unsubscribe 与外部状态选型边界", Component: ExternalStoreDemo, files: [{ name: "ExternalStoreDemo.jsx", code: externalStoreRaw }] },
  { id: "portal-third-party", label: "Portal 与第三方 DOM 生命周期", category: "external", badge: "集成", description: "观察 React Tree 与 DOM Tree 差异，并用 ref + Effect setup/cleanup 管理第三方 DOM 实例", Component: PortalThirdPartyDemo, files: [{ name: "PortalThirdPartyDemo.jsx", code: portalThirdPartyRaw }] },
  { id: "server-state-cache", label: "Server State Cache 生命周期", category: "server-state", badge: "Cache", description: "区分 Client/Server State，可视化 query key、fresh/stale、refetch、in-flight dedupe 与 invalidation", Component: ServerStateCacheDemo, files: [{ name: "ServerStateCacheDemo.jsx", code: serverStateCacheRaw }] },
  { id: "server-state-mutation", label: "请求竞态、取消与 Optimistic Mutation", category: "server-state", badge: "Mutation", description: "观察 Abort cancellation、race guard、pagination query identity、optimistic confirm/rollback", Component: ServerStateMutationDemo, files: [{ name: "ServerStateMutationDemo.jsx", code: serverStateMutationRaw }] },
  { id: "url-state", label: "URL 状态与 Search Params", category: "routing", badge: "核心", description: "把 URL 作为可分享、可刷新、可前进后退的页面状态来源，区分 Route Params 与 Search Params", Component: UrlStateDemo, files: [{ name: "UrlStateDemo.jsx", code: urlStateRaw }] },
  { id: "nested-routes", label: "Nested Routes 与 Outlet", category: "routing", badge: "架构", description: "可视化父子 Route 匹配链、Outlet 插槽、Index Route 与无 path Layout Route 的职责边界", Component: NestedRoutesDemo, files: [{ name: "NestedRoutesDemo.jsx", code: nestedRoutesRaw }] },
  { id: "navigation-boundary", label: "Navigation 与 Route Boundary", category: "routing", badge: "导航", description: "区分声明式链接与程序式导航，可视化 history push/replace/back/forward 与 Not Found 边界", Component: NavigationBoundaryDemo, files: [{ name: "NavigationBoundaryDemo.jsx", code: navigationBoundaryRaw }] },
  { id: "route-data-boundary", label: "Route Loader 数据边界", category: "routing", badge: "数据", description: "可视化 route match → loader(params) → pending → loader data / nearest error boundary 的页面数据流程", Component: RouteDataBoundaryDemo, files: [{ name: "RouteDataBoundaryDemo.jsx", code: routeDataBoundaryRaw }] },
  { id: "accessibility-basics", label: "语义、Label 与可访问状态反馈", category: "accessibility", badge: "基础", description: "使用原生语义、accessible name、键盘操作与 live region 构建可感知的 loading/error/success UI", Component: AccessibilityBasicsDemo, files: [{ name: "AccessibilityBasicsDemo.jsx", code: accessibilityBasicsRaw }] },
  { id: "accessible-modal", label: "Modal Focus 与键盘边界", category: "accessibility", badge: "Focus", description: "可视化 dialog accessible name、初始焦点、Tab trap、Escape 与关闭后的焦点恢复", Component: AccessibleModalDemo, files: [{ name: "AccessibleModalDemo.jsx", code: accessibleModalRaw }] },
  { id: "testing-strategy", label: "Vitest / RTL / Playwright 测试分层", category: "testing", badge: "工程", description: "以用户行为为中心理解 unit、integration、E2E 分工、异步查询与 mock 边界", Component: TestingStrategyDemo, files: [{ name: "TestingStrategyDemo.jsx", code: testingStrategyRaw }, { name: "behavior.test.jsx", code: rtlBehaviorRaw }, { name: "app.spec.js", code: playwrightSpecRaw }] },
  { id: "typescript-react", label: "TypeScript for React 类型边界", category: "typescript", badge: "工程", description: "用 Props/children/event/state/ref/generic 建立组件 contract，运行 JSX 实验并查看真实 TSX 类型源码", Component: TypeScriptReactDemo, files: [{ name: "TypeScriptReactDemo.jsx", code: typeScriptReactRaw }, { name: "react-boundaries.tsx", code: reactBoundariesRaw }, { name: "generic-patterns.tsx", code: genericPatternsRaw }] },
  { id: "rendering-strategies", label: "CSR / SSG / SSR 渲染策略", category: "server-react", badge: "架构", description: "区分客户端渲染、静态预渲染与请求时 SSR，理解 React Core 与 framework rendering policy 的边界", Component: RenderingStrategiesDemo, files: [{ name: "RenderingStrategiesDemo.jsx", code: renderingStrategiesRaw }] },
  { id: "hydration-streaming", label: "Hydration 与 Streaming SSR", category: "server-react", badge: "SSR", description: "可视化 server HTML → hydrate → interactive、hydration mismatch 与 shell/Suspense streaming 时间线", Component: HydrationStreamingDemo, files: [{ name: "HydrationStreamingDemo.jsx", code: hydrationStreamingRaw }] },
  { id: "rsc-boundary", label: "RSC Server / Client Boundary", category: "server-react", badge: "RSC", description: "观察 Server Component、Client Component、RSC payload 与客户端 bundle 边界，区分 RSC 和 SSR", Component: RscBoundaryDemo, files: [{ name: "RscBoundaryDemo.jsx", code: rscBoundaryRaw }] },
  { id: "server-functions-framework", label: "Server Functions 与 Framework 边界", category: "server-react", badge: "React 19", description: "区分 Server Function、Server Action、React primitive 与 React Router / Next.js framework responsibility", Component: ServerFunctionsFrameworkDemo, files: [{ name: "ServerFunctionsFrameworkDemo.jsx", code: serverFunctionsFrameworkRaw }] },
  // @demo-entries
];
