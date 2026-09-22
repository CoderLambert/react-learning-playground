import { GUIDED_RESPONSE_KINDS, GUIDED_STEP_TYPES } from "./contract.js";

export const USE_REDUCE_WITH_CONTEXT_DEFINITION = {
  learningUnitId: "use-reduce-with-context",
  revision: 1,
  goal: "让 reducer 负责状态转换，让 Context 负责分发，并按真实读取需求拆分 State 与 Dispatch 订阅边界。",
  steps: [
    {
      id: "predict-dispatch-only-consumer",
      type: GUIDED_STEP_TYPES.PREDICT,
      prompt: "AddButton 只需要 dispatch。若它读取 value={{tasks, dispatch}} 的单 Context，tasks 变化时最可靠的判断是什么？",
      response: {
        kind: GUIDED_RESPONSE_KINDS.CHOICE,
        options: [
          { id: "receives-context-update", label: "它也订阅了整个对象 value，因此会收到这次 Context 更新" },
          { id: "dispatch-field-selector", label: "React 会自动识别它只用了 dispatch 字段并跳过通知" },
          { id: "reducer-prevents", label: "用了 useReducer 就不会有 Context 更新传播" },
        ],
      },
      reveal: {
        expectedOptionId: "receives-context-update",
        observation: "原生 Context 没有字段 selector。读取单对象 Context 就订阅整个 value identity。",
      },
    },
    {
      id: "experiment-single-vs-split-context",
      type: GUIDED_STEP_TYPES.EXPERIMENT,
      prompt: "在单 Context 与 State/Dispatch 双 Context 两边执行相同 ADD / TOGGLE / DELETE，比较 dispatch-only consumer 的探针。",
      demoActionId: "compare-single-and-split-context",
      expectedObservation: "单 Context 中 tasks 改变会产生新对象 value 并通知写组件；双 Context 中写组件不读取 State Context，因此没有这条通知来源。",
    },
    {
      id: "explain-two-responsibilities",
      type: GUIDED_STEP_TYPES.EXPLAIN,
      prompt: "解释 reducer 与 Context 分别解决什么问题，以及为什么拆 State/Dispatch Context 只优化订阅面，不保证组件永远不 render。",
      response: {
        kind: GUIDED_RESPONSE_KINDS.TEXT,
        placeholder: "从 transition、distribution、subscription boundary 来说明…",
      },
    },
    {
      id: "practice-split-state-dispatch",
      type: GUIDED_STEP_TYPES.PRACTICE,
      prompt: "Toolbar 只 dispatch action，却读取包含 tasks 的整个 Context。选择最小正确订阅边界修复。",
      codeContext: {
        label: "陌生组件 · TasksProvider.jsx",
        language: "jsx",
        code: `const TasksContext = createContext(null);

function Provider({ children }) {
  const [tasks, dispatch] = useReducer(reducer, []);
  return (
    <TasksContext value={{ tasks, dispatch }}>
      {children}
    </TasksContext>
  );
}

function Toolbar() {
  const { dispatch } = useContext(TasksContext);
  return <button onClick={() => dispatch({ type: "ADD" })}>Add</button>;
}`,
      },
      response: {
        kind: GUIDED_RESPONSE_KINDS.PATCH_CHOICE,
        options: [
          {
            id: "split-state-dispatch",
            label: "Patch A",
            patch: `+ const TasksStateContext = createContext(null);
+ const TasksDispatchContext = createContext(null);
...
+ <TasksStateContext value={tasks}>
+   <TasksDispatchContext value={dispatch}>{children}</TasksDispatchContext>
+ </TasksStateContext>
...
- const { dispatch } = useContext(TasksContext);
+ const dispatch = useContext(TasksDispatchContext);`,
          },
          {
            id: "memo-toolbar-only",
            label: "Patch B",
            patch: `- function Toolbar() {
+ const Toolbar = memo(function Toolbar() {`,
          },
          {
            id: "copy-dispatch-state",
            label: "Patch C",
            patch: `+ const [localDispatch] = useState(dispatch);`,
          },
        ],
      },
      reveal: {
        expectedOptionId: "split-state-dispatch",
        observation: "Toolbar 真正依赖的是 dispatch。独立 Dispatch Context 让它不再订阅 tasks 的 State Context；这不影响 reducer 的转换职责。",
      },
    },
    {
      id: "review-reducer-context",
      type: GUIDED_STEP_TYPES.REVIEW,
      prompt: "复习：Reducer 管转换；Context 管跨层依赖分发；State/Dispatch 拆分只在读写依赖边界明确时有价值。",
      resources: ["notes", "source", "demo"],
    },
  ],
};
