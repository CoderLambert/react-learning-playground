import { ComponentJsxPureRenderDemo } from "./ComponentJsxPureRenderDemo";
import { PropsBasicsDemo } from "./PropsBasicsDemo";
import { ChildrenSlotDemo } from "./ChildrenSlotDemo";
import { MultiSlotsDemo } from "./MultiSlotsDemo";
import { ConditionalRenderingDemo } from "./ConditionalRenderingDemo";
import { RenderingListsKeyDemo } from "./RenderingListsKeyDemo";
import { PropDrillingDemo } from "./PropDrillingDemo";
import { StateDryDemo } from "./StateDryDemo";
import { LiftingStateUpDemo } from "./LiftingStateUpDemo";
import { StateReducerDemo } from "./StateReducerDemo";
import { UseReduceWithContextDemo } from "./UseReduceWithContextDemo";
import { UseRefDemo } from "./UseRefDemo";
import { UseEffectCorrectUsageDemo } from "./UseEffectCorrectUsageDemo";
import { NotNeedEffectDemo } from "./NotNeedEffectDemo";
import { LifecycleOfReactiveEffectsDemo } from "./LifecycleOfReactiveEffectsDemo";
import { RenderVsDomUpdateDemo } from "./RenderVsDomUpdateDemo";
import { ReferenceEqualityDemo } from "./ReferenceEqualityDemo";
import { ReactMemoDemo } from "./ReactMemoDemo";
import { UseMemoDemo } from "./UseMemoDemo";
import { UseCallbackDemo } from "./UseCallbackDemo";
import { ProfilerDemo } from "./ProfilerDemo";
import { ReactCompilerDemo } from "./ReactCompilerDemo";

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
import stateDryRaw from "./StateDryDemo.jsx?raw";
import liftingStateUpRaw from "./LiftingStateUpDemo.jsx?raw";
import stateReducerRaw from "./StateReducerDemo.jsx?raw";
import useReduceWithContextRaw from "./UseReduceWithContextDemo.jsx?raw";
import useRefRaw from "./UseRefDemo.jsx?raw";
import useEffectCorrectUsageRaw from "./UseEffectCorrectUsageDemo.jsx?raw";
import notNeedEffectRaw from "./NotNeedEffectDemo.jsx?raw";
import lifecycleRaw from "./LifecycleOfReactiveEffectsDemo.jsx?raw";
import renderVsDomUpdateRaw from "./RenderVsDomUpdateDemo.jsx?raw";
import referenceEqualityRaw from "./ReferenceEqualityDemo.jsx?raw";
import reactMemoRaw from "./ReactMemoDemo.jsx?raw";
import useMemoRaw from "./UseMemoDemo.jsx?raw";
import useCallbackRaw from "./UseCallbackDemo.jsx?raw";
import profilerRaw from "./ProfilerDemo.jsx?raw";
import reactCompilerRaw from "./ReactCompilerDemo.jsx?raw";

// @demo-imports

export const CATEGORIES = [
  { id: "components", name: "组件通信与插槽", icon: "🧩" },
  { id: "state", name: "状态管理与演进", icon: "⚡" },
  { id: "effects", name: "Hooks 与副作用深度", icon: "🎣" },
  { id: "performance", name: "性能模型与优化", icon: "🚀" },
];

export const demos = [
  {
    id: "component-jsx-pure-render",
    label: "Component、JSX 与纯渲染",
    category: "components",
    badge: "基础",
    description: "组件作为 UI 构建块、JSX 表达式、Fragment、组件树与纯渲染约束",
    Component: ComponentJsxPureRenderDemo,
    files: [
      { name: "ComponentJsxPureRenderDemo.jsx", code: componentJsxPureRenderRaw },
    ],
  },
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
    id: "conditional-rendering",
    label: "条件渲染与业务四态",
    category: "components",
    badge: "分支",
    description: "用 if、early return、三元表达式与 && 将 loading/empty/error/success 清晰映射为 UI",
    Component: ConditionalRenderingDemo,
    files: [
      { name: "ConditionalRenderingDemo.jsx", code: conditionalRenderingRaw },
    ],
  },
  {
    id: "rendering-lists-key",
    label: "列表渲染与 key 身份",
    category: "components",
    badge: "核心",
    description: "通过可编辑列表排序实验理解 stable key、index key 与组件 State 身份匹配",
    Component: RenderingListsKeyDemo,
    files: [
      { name: "RenderingListsKeyDemo.jsx", code: renderingListsKeyRaw },
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
    description: "拆分 State 与 Dispatch 独立上下文，缩小只消费 dispatch 节点的更新范围",
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
    id: "render-vs-dom-update",
    label: "Re-render ≠ DOM Update",
    category: "performance",
    badge: "核心",
    description: "用 MutationObserver 对照 Render 与 Commit，建立先测量再优化的性能心智模型",
    Component: RenderVsDomUpdateDemo,
    files: [
      { name: "RenderVsDomUpdateDemo.jsx", code: renderVsDomUpdateRaw },
    ],
  },
  {
    id: "reference-equality",
    label: "Reference Equality 引用身份",
    category: "performance",
    badge: "基础",
    description: "用 Object.is 对比对象、数组、函数跨 Render 的 identity，理解 memo 与 Hook dependencies 的基础",
    Component: ReferenceEqualityDemo,
    files: [
      { name: "ReferenceEqualityDemo.jsx", code: referenceEqualityRaw },
    ],
  },
  {
    id: "react-memo",
    label: "React.memo 命中与失效",
    category: "performance",
    badge: "优化",
    description: "对比 primitive、新对象与稳定对象 props，观察 memo 的命中条件和 identity 陷阱",
    Component: ReactMemoDemo,
    files: [
      { name: "ReactMemoDemo.jsx", code: reactMemoRaw },
    ],
  },
  {
    id: "use-memo",
    label: "useMemo 昂贵计算缓存",
    category: "performance",
    badge: "优化",
    description: "对比缓存与直接计算，观察依赖变化、昂贵计算与稳定 identity 的真实使用边界",
    Component: UseMemoDemo,
    files: [
      { name: "UseMemoDemo.jsx", code: useMemoRaw },
    ],
  },
  {
    id: "use-callback",
    label: "useCallback 函数引用稳定",
    category: "performance",
    badge: "优化",
    description: "联动 memo child 观察函数 prop identity，理解 useCallback 的命中条件、updater function 与真实边界",
    Component: UseCallbackDemo,
    files: [
      { name: "UseCallbackDemo.jsx", code: useCallbackRaw },
    ],
  },
  {
    id: "profiler",
    label: "Profiler 先测量再优化",
    category: "performance",
    badge: "分析",
    description: "用 Profiler actualDuration/baseDuration 观察 commit 成本，建立先定位瓶颈再优化的流程",
    Component: ProfilerDemo,
    files: [
      { name: "ProfilerDemo.jsx", code: profilerRaw },
    ],
  },
  {
    id: "react-compiler",
    label: "React Compiler 自动优化模型",
    category: "performance",
    badge: "Compiler",
    description: "理解构建期自动 memoization、Rules of React、渐进采用与手工 memoization 的新边界",
    Component: ReactCompilerDemo,
    files: [
      { name: "ReactCompilerDemo.jsx", code: reactCompilerRaw },
    ],
  },
  // @demo-entries
];
