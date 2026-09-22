import { canonicalQuestion } from "./factory.js";

export const USE_REDUCE_WITH_CONTEXT_QUESTIONS = Object.freeze([
  canonicalQuestion({
    id: "canonical-reducer-context-responsibilities",
    learningUnitId: "use-reduce-with-context",
    difficulty: "easy",
    conceptTags: ["reducer", "context"],
    content: {
      prompt: "Reducer + Context 组合中，两者职责最准确的划分是什么？",
      options: [
        { id: "transition-distribution", text: "Reducer 管状态转换，Context 管跨层依赖分发" },
        { id: "same", text: "两者完全是同一个 API 的别名" },
        { id: "context-transition", text: "Context 计算 reducer，Reducer 负责跨层订阅" },
        { id: "global", text: "useReducer 自动把 State 全局化，不需要 Provider" },
      ],
      correctOptionId: "transition-distribution",
      explanation: "useReducer 和 Context 解决不同问题，组合只是把转换后的 state/dispatch 提供给深层消费者。",
      diagnosticOptionMap: {
        "global": "reducer-and-context-same-job",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "UseReduceWithContextDemo.jsx", startLine: 38, endLine: 45 }],
  }),
  canonicalQuestion({
    id: "canonical-reducer-context-single-value",
    learningUnitId: "use-reduce-with-context",
    difficulty: "medium",
    conceptTags: ["context", "subscription"],
    content: {
      prompt: "AddButton 只需要 dispatch，但读取 SingleTaskContext 的 {tasks, dispatch}。tasks 变化时为什么它仍会收到 Context 更新？",
      options: [
        { id: "whole-value", text: "它订阅整个对象 value；tasks 变化会生成新的 value identity" },
        { id: "dispatch-changes", text: "因为 React 保证 dispatch 每次 render 都是新函数" },
        { id: "field-selector", text: "其实不会，React 自动识别只读取 dispatch 字段" },
        { id: "reducer-side-effect", text: "因为 reducer 会主动调用 AddButton" },
      ],
      correctOptionId: "whole-value",
      explanation: "原生 Context 没有对象字段级 selector。",
      diagnosticOptionMap: {
        "field-selector": "single-context-is-free",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "UseReduceWithContextDemo.jsx", startLine: 48, endLine: 62 }],
  }),
  canonicalQuestion({
    id: "canonical-reducer-context-dispatch",
    learningUnitId: "use-reduce-with-context",
    difficulty: "medium",
    conceptTags: ["dispatch", "context"],
    content: {
      prompt: "为什么独立 Dispatch Context 对 dispatch-only consumer 有价值？",
      options: [
        { id: "avoid-state-subscription", text: "它可以只读取稳定 dispatch，不订阅变化的 State Context" },
        { id: "never-render", text: "它保证组件无论任何原因都永不 render" },
        { id: "faster-reducer", text: "它会让 reducer 算法复杂度下降" },
        { id: "global-dispatch", text: "它把 dispatch 存进浏览器全局变量" },
      ],
      correctOptionId: "avoid-state-subscription",
      explanation: "拆分优化的是 Context dependency surface，不是 render guarantee。",
      diagnosticOptionMap: {
        "never-render": "split-context-prevents-all-renders",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "UseReduceWithContextDemo.jsx", startLine: 38, endLine: 45 }],
  }),
  canonicalQuestion({
    id: "canonical-reducer-context-transfer",
    learningUnitId: "use-reduce-with-context",
    difficulty: "medium",
    conceptTags: ["context", "transfer"],
    content: {
      prompt: "Toolbar 只需要 dispatch。下面哪种改造最直接减少它对 tasks 更新的 Context 订阅？",
      codeContext: {
        label: "陌生代码 · TasksContext.jsx",
        language: "jsx",
        code: `const TasksContext = createContext(null);

function Toolbar() {
  const { dispatch } = useContext(TasksContext);
  return <button onClick={() => dispatch({ type: "ADD" })}>Add</button>;
}

<TasksContext value={{ tasks, dispatch }}>
  <Toolbar />
  <TaskList />
</TasksContext>`,
      },
      options: [
        { id: "split-dispatch-context", text: "建立独立 TasksDispatchContext，让 Toolbar 只读取 dispatch" },
        { id: "memo-toolbar", text: "只给 Toolbar 加 memo，继续读取同一个 Context" },
        { id: "copy-dispatch", text: "把 dispatch 复制进 Toolbar 的 local State" },
        { id: "remove-reducer", text: "移除 reducer 才能避免 Context 更新" },
      ],
      correctOptionId: "split-dispatch-context",
      explanation: "独立 Dispatch Context 让 Toolbar 不再读取包含 tasks 的 Context value。",
      diagnosticOptionMap: {
        "memo-toolbar": "single-context-is-free",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "UseReduceWithContextDemo.jsx", startLine: 38, endLine: 62 }],
  }),
  canonicalQuestion({
    id: "canonical-reducer-context-when-split",
    learningUnitId: "use-reduce-with-context",
    difficulty: "hard",
    conceptTags: ["context", "design"],
    content: {
      prompt: "State / Dispatch Context 是否应该成为所有 useReducer 的默认模板？",
      options: [
        { id: "only-when-boundary-matters", text: "不必；只有读写依赖明显不同、订阅边界或 API 清晰度确有价值时才值得拆" },
        { id: "always", text: "是；任何 useReducer 都必须创建两个 Context" },
        { id: "never", text: "否；拆 Context 永远没有语义价值" },
        { id: "selector", text: "只有为了让 React 自动获得字段 selector 才拆" },
      ],
      correctOptionId: "only-when-boundary-matters",
      explanation: "双 Context 是架构选择。它减少特定 Context 订阅，不替代整体性能测量或外部 store selector。",
      diagnosticOptionMap: {
        "always": "split-context-prevents-all-renders",
      },
    },
    evidenceRefs: [{ kind: "source", fileName: "UseReduceWithContextDemo.jsx", startLine: 38, endLine: 62 }],
  }),
]);
