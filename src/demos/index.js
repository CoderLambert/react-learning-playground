import { PropsBasicsDemo } from "./PropsBasicsDemo";
import { ChildrenSlotDemo } from "./ChildrenSlotDemo";
import { MultiSlotsDemo } from "./MultiSlotsDemo";
import { PropDrillingDemo } from "./PropDrillingDemo";
import { StateDryDemo } from "./StateDryDemo";
import { LiftingStateUpDemo } from "./LiftingStateUpDemo";
import { StateReducerDemo } from "./StateReducerDemo";
import { UseReduceWithContextDemo } from "./UseReduceWithContextDemo";
import { UseRefDemo } from "./UseRefDemo";
import { UseEffectCorrectUsageDemo } from "./UseEffectCorrectUsageDemo";
import { NotNeedEffectDemo } from "./NotNeedEffectDemo";
import { LifecycleOfReactiveEffectsDemo } from "./LifecycleOfReactiveEffectsDemo";
import { UrlStateDemo } from "./UrlStateDemo";
import { NestedRoutesDemo } from "./NestedRoutesDemo";
import { NavigationBoundaryDemo } from "./NavigationBoundaryDemo";

// 源码原始字符串（Vite ?raw 原生支持）
import propsBasicsRaw from "./PropsBasicsDemo.jsx?raw";
import userCardRaw from "../components/UserCard.jsx?raw";
import productCardRaw from "../components/ProductCard.jsx?raw";

import childrenSlotRaw from "./ChildrenSlotDemo.jsx?raw";
import cardContainerRaw from "../components/CardContainer.jsx?raw";
import modalLayoutRaw from "../components/ModalLayout.jsx?raw";

import multiSlotsRaw from "./MultiSlotsDemo.jsx?raw";
import multySlotsComponentRaw from "../components/MultySlots.jsx?raw";
import pannelRaw from "../components/Pannel.jsx?raw";

import propDrillingRaw from "./PropDrillingDemo.jsx?raw";
import stateDryRaw from "./StateDryDemo.jsx?raw";
import liftingStateUpRaw from "./LiftingStateUpDemo.jsx?raw";
import stateReducerRaw from "./StateReducerDemo.jsx?raw";
import useReduceWithContextRaw from "./UseReduceWithContextDemo.jsx?raw";
import useRefRaw from "./UseRefDemo.jsx?raw";
import useEffectCorrectUsageRaw from "./UseEffectCorrectUsageDemo.jsx?raw";
import notNeedEffectRaw from "./NotNeedEffectDemo.jsx?raw";
import lifecycleRaw from "./LifecycleOfReactiveEffectsDemo.jsx?raw";
import urlStateRaw from "./UrlStateDemo.jsx?raw";
import nestedRoutesRaw from "./NestedRoutesDemo.jsx?raw";
import navigationBoundaryRaw from "./NavigationBoundaryDemo.jsx?raw";

// @demo-imports

export const CATEGORIES = [
  { id: "components", name: "组件通信与插槽", icon: "🧩" },
  { id: "state", name: "状态管理与演进", icon: "⚡" },
  { id: "effects", name: "Hooks 与副作用深度", icon: "🎣" },
  { id: "routing", name: "Router 与页面状态", icon: "🧭" },
];

export const demos = [
  {
    id: "props",
    label: "Props 基础与解构",
    category: "components",
    badge: "基础",
    description: "单向只读数据流、对象解构默认值回退、展开语法与派生计算",
    Component: PropsBasicsDemo,
    files: [
      { name: "PropsBasicsDemo.jsx", code: propsBasicsRaw },
      { name: "UserCard.jsx", code: userCardRaw },
      { name: "ProductCard.jsx", code: productCardRaw },
    ],
  },
  {
    id: "children",
    label: "Children 默认插槽",
    category: "components",
    badge: "组合",
    description: "React 组合模式（Composition），容器布局与可插拔子节点解耦",
    Component: ChildrenSlotDemo,
    files: [
      { name: "ChildrenSlotDemo.jsx", code: childrenSlotRaw },
      { name: "CardContainer.jsx", code: cardContainerRaw },
      { name: "ModalLayout.jsx", code: modalLayoutRaw },
    ],
  },
  {
    id: "multi-slots",
    label: "具名多插槽客制化",
    category: "components",
    badge: "规范",
    description: "生产级多插槽三态协议（默认模板 + 局部覆盖 + 显式隐藏）",
    Component: MultiSlotsDemo,
    files: [
      { name: "MultiSlotsDemo.jsx", code: multiSlotsRaw },
      { name: "ProductionModal.jsx", code: multySlotsComponentRaw },
      { name: "Pannel.jsx", code: pannelRaw },
    ],
  },
  {
    id: "prop-drilling",
    label: "属性逐层透传解法",
    category: "components",
    badge: "解耦",
    description: "对比逐层透传 (Drilling)、组件组合 (Children) 与 Context API",
    Component: PropDrillingDemo,
    files: [
      { name: "PropDrillingDemo.jsx", code: propDrillingRaw },
    ],
  },
  {
    id: "state-dry",
    label: "状态干净原则 (DRY)",
    category: "state",
    badge: "核心",
    description: "避免在 State 中冗余存储计算值，单一数据源与衍生状态实践",
    Component: StateDryDemo,
    files: [
      { name: "StateDryDemo.jsx", code: stateDryRaw },
    ],
  },
  {
    id: "lifting-state-up",
    label: "状态提升与协同联动",
    category: "state",
    badge: "协同",
    description: "兄弟组件状态共享、受控输入与向最近共同祖先提升",
    Component: LiftingStateUpDemo,
    files: [
      { name: "LiftingStateUpDemo.jsx", code: liftingStateUpRaw },
    ],
  },
  {
    id: "state-reducer",
    label: "useReducer 状态机模式",
    category: "state",
    badge: "架构",
    description: "将更新逻辑集中为纯函数 Reducer，规范复杂状态与行为审计",
    Component: StateReducerDemo,
    files: [
      { name: "StateReducerDemo.jsx", code: stateReducerRaw },
    ],
  },
  {
    id: "use-reduce-with-context",
    label: "Reducer + Context 双通道优化",
    category: "state",
    badge: "进阶",
    description: "拆分 State 与 Dispatch 独立上下文，彻底规避无效重新渲染",
    Component: UseReduceWithContextDemo,
    files: [
      { name: "UseReduceWithContextDemo.jsx", code: useReduceWithContextRaw },
    ],
  },
  {
    id: "use-ref",
    label: "useRef 引用与 DOM 控制",
    category: "effects",
    badge: "引用",
    description: "DOM 访问、可变值持久化与纯函数渲染期的引用安全守则",
    Component: UseRefDemo,
    files: [
      { name: "UseRefDemo.jsx", code: useRefRaw },
    ],
  },
  {
    id: "use-effect-correct-usage",
    label: "useEffect 正确用法与心智",
    category: "effects",
    badge: "同步",
    description: "与外部系统同步、定时器与事件监听的清理函数 (Cleanup) 闭环",
    Component: UseEffectCorrectUsageDemo,
    files: [
      { name: "UseEffectCorrectUsageDemo.jsx", code: useEffectCorrectUsageRaw },
    ],
  },
  {
    id: "not-need-effect",
    label: "无需 Effect 的常见反模式",
    category: "effects",
    badge: "避坑",
    description: "官方避坑指南：衍生数据计算、用户事件触发与依赖同步陷阱",
    Component: NotNeedEffectDemo,
    files: [
      { name: "NotNeedEffectDemo.jsx", code: notNeedEffectRaw },
    ],
  },
  {
    id: "lifecycle-of-reactive-effects",
    label: "响应式 Effect 生命周期与依赖",
    category: "effects",
    badge: "深度",
    description: "响应式值追踪、依赖闭环、使用 Ref 与函数式更新解耦依赖",
    Component: LifecycleOfReactiveEffectsDemo,
    files: [
      { name: "LifecycleOfReactiveEffectsDemo.jsx", code: lifecycleRaw },
    ],
  },
  {
    id: "url-state",
    label: "URL 状态与 Search Params",
    category: "routing",
    badge: "核心",
    description: "把 URL 作为可分享、可刷新、可前进后退的页面状态来源，区分 Route Params 与 Search Params",
    Component: UrlStateDemo,
    files: [
      { name: "UrlStateDemo.jsx", code: urlStateRaw },
    ],
  },
  {
    id: "nested-routes",
    label: "Nested Routes 与 Outlet",
    category: "routing",
    badge: "架构",
    description: "可视化父子 Route 匹配链、Outlet 插槽、Index Route 与无 path Layout Route 的职责边界",
    Component: NestedRoutesDemo,
    files: [
      { name: "NestedRoutesDemo.jsx", code: nestedRoutesRaw },
    ],
  },
  {
    id: "navigation-boundary",
    label: "Navigation 与 Route Boundary",
    category: "routing",
    badge: "导航",
    description: "区分声明式链接与程序式导航，可视化 history push/replace/back/forward 与 Not Found 边界",
    Component: NavigationBoundaryDemo,
    files: [
      { name: "NavigationBoundaryDemo.jsx", code: navigationBoundaryRaw },
    ],
  },
  // @demo-entries
];
