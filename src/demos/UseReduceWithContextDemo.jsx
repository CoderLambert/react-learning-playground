import { createContext, useContext, useEffect, useReducer, useRef } from "react";

const TaskStateContext = createContext(null);
const TaskDispatchContext = createContext(null);
const SingleTaskContext = createContext(null);

const initialTasks = [
  { id: 1, title: "学习 React 19 核心 API", done: true },
  { id: 2, title: "理解 Context 订阅边界", done: false },
];

function taskReducer(tasks, action) {
  switch (action.type) {
    case "ADD":
      return [{ id: action.id, title: action.title, done: false }, ...tasks];
    case "TOGGLE":
      return tasks.map((task) => (task.id === action.id ? { ...task, done: !task.done } : task));
    case "DELETE":
      return tasks.filter((task) => task.id !== action.id);
    default:
      return tasks;
  }
}

function useEffectProbe(prefix) {
  const badgeRef = useRef(null);

  useEffect(() => {
    if (!badgeRef.current) return;
    const next = (Number(badgeRef.current.dataset.runs) || 0) + 1;
    badgeRef.current.dataset.runs = String(next);
    badgeRef.current.textContent = `${prefix} Effect 探针：${next}`;
  });

  return badgeRef;
}

function TaskProvider({ children }) {
  const [tasks, dispatch] = useReducer(taskReducer, initialTasks);

  return (
    <TaskStateContext value={tasks}>
      <TaskDispatchContext value={dispatch}>{children}</TaskDispatchContext>
    </TaskStateContext>
  );
}

function SingleTaskProvider({ children }) {
  const [tasks, dispatch] = useReducer(taskReducer, initialTasks);

  return (
    <SingleTaskContext value={{ tasks, dispatch }}>
      {children}
    </SingleTaskContext>
  );
}

function AddButton({ mode }) {
  const splitDispatch = useContext(TaskDispatchContext);
  const singleValue = useContext(SingleTaskContext);
  const dispatch = mode === "split" ? splitDispatch : singleValue?.dispatch;
  const badgeRef = useEffectProbe(mode === "single" ? "单 Context 写组件" : "双 Context 写组件");

  if (!dispatch) throw new Error("AddButton 缺少对应 Context Provider");

  return (
    <div style={{ padding: 12, border: "1px solid var(--border-color)", borderRadius: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
        <strong>只负责 dispatch 的组件</strong>
        <span ref={badgeRef} className="badge badge-green">Effect 探针</span>
      </div>
      <button
        className="btn btn-secondary btn-sm"
        type="button"
        style={{ marginTop: 10 }}
        onClick={() => dispatch({ type: "ADD", id: Date.now(), title: "新任务" })}
      >
        ➕ dispatch ADD
      </button>
    </div>
  );
}

function TaskList({ mode }) {
  const splitTasks = useContext(TaskStateContext);
  const splitDispatch = useContext(TaskDispatchContext);
  const singleValue = useContext(SingleTaskContext);
  const tasks = mode === "split" ? splitTasks : singleValue?.tasks;
  const dispatch = mode === "split" ? splitDispatch : singleValue?.dispatch;
  const badgeRef = useEffectProbe(mode === "single" ? "单 Context 读组件" : "双 Context 读组件");

  if (!tasks || !dispatch) throw new Error("TaskList 缺少对应 Context Provider");

  return (
    <div style={{ padding: 12, border: "1px solid var(--border-color)", borderRadius: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center", marginBottom: 8 }}>
        <strong>读取任务 state 的组件</strong>
        <span ref={badgeRef} className="badge badge-amber">Effect 探针</span>
      </div>
      <div style={{ display: "grid", gap: 6 }}>
        {tasks.map((task) => (
          <div key={task.id} style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => dispatch({ type: "TOGGLE", id: task.id })}
              />
              <span style={{ textDecoration: task.done ? "line-through" : "none" }}>{task.title}</span>
            </label>
            <button className="btn btn-outline btn-sm" type="button" onClick={() => dispatch({ type: "DELETE", id: task.id })}>删除</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExperimentPanel({ mode }) {
  const isSingle = mode === "single";
  const Provider = isSingle ? SingleTaskProvider : TaskProvider;

  return (
    <div className={`comparison-card ${isSingle ? "bad" : "good"}`}>
      <div className={`comparison-header ${isSingle ? "bad" : "good"}`}>
        <span>{isSingle ? "⚠️" : "✅"}</span> {isSingle ? "单 Context：{ tasks, dispatch }" : "双 Context：State / Dispatch 分离"}
      </div>
      <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
        {isSingle
          ? "写组件为了拿 dispatch 也读取整个 Context；tasks 改变时 value 对象改变，它会收到 Context 更新。"
          : "写组件只读取 Dispatch Context；tasks 改变不会通过 State Context 的订阅关系通知它。"}
      </p>
      <Provider>
        <div style={{ display: "grid", gap: 10 }}>
          <AddButton mode={mode} />
          <TaskList mode={mode} />
        </div>
      </Provider>
    </div>
  );
}

export function UseReduceWithContextDemo() {
  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <h2 className="demo-title"><span>⚡</span> Reducer + Context：拆分读写订阅边界</h2>
          <span className="badge badge-green">Context 边界</span>
        </div>
        <p className="demo-desc">
          当 <code>&#123; tasks, dispatch &#125;</code> 作为一个 Context value 时，tasks 改变会产生新的 value identity，所有读取该 Context 的消费者都会收到更新。把 State 与稳定的 Dispatch 分成两个 Context，可以让只需要 dispatch 的节点不订阅 State Context。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">State / Dispatch Context</span>
          <span className="badge badge-gray">Stable dispatch identity</span>
          <span className="badge badge-gray">Subscription boundary</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🔬</span> 同一动作的可交互对照</h3>
          <p className="demo-section-desc">
            分别在左右两边执行 ADD / TOGGLE / DELETE。观察“只负责 dispatch 的组件”的 Effect 探针：单 Context 中它订阅了整个 value；双 Context 中它没有读取 State Context。
          </p>
        </div>
        <div className="demo-grid-2">
          <ExperimentPanel mode="single" />
          <ExperimentPanel mode="split" />
        </div>
      </div>

      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title"><span>💡</span> 如何读这个实验</div>
        <div>
          探针运行在 Effect 中，只用于证明组件已经完成一次对应的 React 更新；开发 Strict Mode 可能让初始 Effect setup 额外执行，所以不要把初始数字当 production render 次数。真正要比较的是：任务 state 改变后，单 Context 的 dispatch-only consumer 会收到 Context value 更新，而双 Context 的 dispatch-only consumer 不会因为 State Context 变化而收到通知。
        </div>
      </div>

      <div className="demo-alert demo-alert-warning" style={{ marginTop: 10 }}>
        <strong>边界：</strong>双 Context 不是“永不重渲染”保证。props、自身 state、其他 Context 或父级结构仍可能让组件更新；拆分优化的是 Context 订阅面，不是 reducer 的魔法，也不是外部 store selector 的替代品。
      </div>
    </div>
  );
}

export default UseReduceWithContextDemo;
