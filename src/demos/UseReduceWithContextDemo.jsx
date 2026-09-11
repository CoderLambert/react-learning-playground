import { createContext, useContext, useReducer, useRef, useEffect } from "react";

// ==========================================
// 1. 拆分为独立的两个 Context 通道
// ==========================================
// 通道 A：只负责传递变化频繁的状态 State
const TaskStateContext = createContext(null);
// 通道 B：只负责传递引用稳定的 dispatch 函数
const TaskDispatchContext = createContext(null);

// ==========================================
// 2. Reducer 纯函数
// ==========================================
const initialTasks = [
  { id: 1, title: "学习 React 19 核心 API", done: true },
  { id: 2, title: "拆分 Context 双通道，理解订阅边界", done: false },
  { id: 3, title: "消除全部 Oxlint 语法规范告警", done: false },
];

function taskReducer(tasks, action) {
  switch (action.type) {
    case "ADD":
      return [{ id: action.id, title: action.title, done: false }, ...tasks];
    case "TOGGLE":
      return tasks.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t));
    case "DELETE":
      return tasks.filter((t) => t.id !== action.id);
    case "CLEAR_DONE":
      return tasks.filter((t) => !t.done);
    default:
      return tasks;
  }
}

// 内部安全 Hook（不导出以完全兼容 Fast Refresh）
function useTaskState() {
  const ctx = useContext(TaskStateContext);
  if (!ctx) throw new Error("useTaskState 必须在 TaskProvider 内使用");
  return ctx;
}

function useTaskDispatch() {
  const ctx = useContext(TaskDispatchContext);
  if (!ctx) throw new Error("useTaskDispatch 必须在 TaskProvider 内使用");
  return ctx;
}

// ==========================================
// 3. Provider 包装容器
// ==========================================
function TaskProvider({ children }) {
  const [tasks, dispatch] = useReducer(taskReducer, initialTasks);

  return (
    <TaskStateContext value={tasks}>
      <TaskDispatchContext value={dispatch}>
        {children}
      </TaskDispatchContext>
    </TaskStateContext>
  );
}

// ==========================================
// 4. 消费组件 A：仅订阅 Dispatch 通道（写操作）
// State Context value 的变化不会因为 Context 订阅本身通知这个组件。
// 这不是“组件永远不会重新渲染”的保证：其他 props/state/父级路径仍可能触发渲染。
// ==========================================
function AddTaskBar() {
  const dispatch = useTaskDispatch();
  const badgeElementRef = useRef(null);

  // 在副作用中更新 DOM 计数，避免渲染阶段直接操作 DOM。
  useEffect(() => {
    if (badgeElementRef.current) {
      const count = (Number(badgeElementRef.current.dataset.renders) || 0) + 1;
      badgeElementRef.current.dataset.renders = String(count);
      badgeElementRef.current.textContent = `⚡ 本组件实际渲染：${count} 次`;
    }
  });

  const handleQuickAdd = (text) => {
    dispatch({ type: "ADD", id: Date.now(), title: text });
  };

  return (
    <div
      style={{
        padding: "16px",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-md)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <h4 style={{ margin: 0, fontSize: "14px", color: "var(--text-main)" }}>
          组件 A：任务添加栏（只订阅 Dispatch 通道）
        </h4>
        <span ref={badgeElementRef} className="badge badge-green">
          ⚡ 本组件实际渲染：1 次
        </span>
      </div>

      <p style={{ margin: "0 0 10px 0", fontSize: "12.5px", color: "var(--text-muted)" }}>
        该组件不读取 <code>TaskStateContext</code>，因此任务 state 的 Context 更新不会因为订阅关系直接通知它；这不等于 React 对任何其他渲染来源做“永不重渲染”的保证。
      </p>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => handleQuickAdd("阅读 React Profiler 性能文档")}
        >
          ➕ 添加：阅读 React Profiler 文档
        </button>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => handleQuickAdd("编写自定义 Hook 并做好安全断言")}
        >
          ➕ 添加：编写安全 Hook
        </button>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => dispatch({ type: "CLEAR_DONE" })}
        >
          🧹 清理已完成
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 5. 消费组件 B：订阅 State 通道（读操作）
// ==========================================
function TaskList() {
  const tasks = useTaskState();
  const dispatch = useTaskDispatch();
  const badgeElementRef = useRef(null);

  useEffect(() => {
    if (badgeElementRef.current) {
      const count = (Number(badgeElementRef.current.dataset.renders) || 0) + 1;
      badgeElementRef.current.dataset.renders = String(count);
      badgeElementRef.current.textContent = `🔄 本组件实际渲染：${count} 次`;
    }
  });

  return (
    <div
      style={{
        padding: "16px",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-md)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <h4 style={{ margin: 0, fontSize: "14px", color: "var(--text-main)" }}>
          组件 B：任务列表视图（订阅 State 通道）
        </h4>
        <span ref={badgeElementRef} className="badge badge-amber">
          🔄 本组件实际渲染：1 次
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {tasks.map((task) => (
          <div
            key={task.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 12px",
              background: task.done ? "var(--bg-surface-secondary)" : "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-sm)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => dispatch({ type: "TOGGLE", id: task.id })}
                style={{ cursor: "pointer" }}
              />
              <span style={{ fontSize: "13.5px", textDecoration: task.done ? "line-through" : "none", color: task.done ? "var(--text-subtle)" : "var(--text-main)" }}>
                {task.title}
              </span>
            </div>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => dispatch({ type: "DELETE", id: task.id })}
              style={{ padding: "2px 8px", fontSize: "11px" }}
            >
              删除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function UseReduceWithContextDemo() {
  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>⚡</span> Reducer + Context：拆分读写订阅边界
            </h2>
          </div>
          <span className="badge badge-green">Context 边界</span>
        </div>
        <p className="demo-desc">
          当 <code>&#123; state, dispatch &#125;</code> 作为一个 Context value 时，state 改变会产生新的 value identity，所有读取该 Context 的消费者都会收到更新。把 State 与稳定的 Dispatch 分成两个 Context，可以让只需要 dispatch 的节点不订阅 State Context。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">State / Dispatch Context</span>
          <span className="badge badge-gray">Stable dispatch identity</span>
          <span className="badge badge-gray">Subscription boundary</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>⚖️</span> 单 Context vs 双 Context
          </h3>
        </div>

        <div className="demo-grid-2">
          <div className="comparison-card bad">
            <div className="comparison-header bad">
              <span>⚠️</span> 单 Context
            </div>
            <pre style={{ margin: 0, padding: "8px", background: "#fef2f2", borderRadius: "4px", fontSize: "12px", overflowX: "auto" }}>
{`// state 变化时，这个 value 对象 identity 也变化
<AppContext value={{ state, dispatch }}>
  <AddButton /> {/* 若读取 AppContext，也订阅整份 value */}
  <ListView />
</AppContext>`}
            </pre>
          </div>

          <div className="comparison-card good">
            <div className="comparison-header good">
              <span>✅</span> 双 Context
            </div>
            <pre style={{ margin: 0, padding: "8px", background: "#f0fdf4", borderRadius: "4px", fontSize: "12px", overflowX: "auto" }}>
{`// dispatch identity 稳定；写组件无需订阅 StateContext
<StateContext value={state}>
  <DispatchContext value={dispatch}>
    <AddButton />
    <ListView />
  </DispatchContext>
</StateContext>`}
            </pre>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🔬</span> 实时渲染观察
          </h3>
          <p className="demo-section-desc">
            点击组件 A 的按钮添加/清理任务，或在组件 B 中切换/删除任务。对比两个组件的实际渲染计数，并把观察解释为“订阅来源不同”，而不是“dispatch-only 组件永远不会渲染”。
          </p>
        </div>

        <TaskProvider>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <AddTaskBar />
            <TaskList />
          </div>
        </TaskProvider>
      </div>

      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title">
          <span>💡</span> 决策规则
        </div>
        <div>
          React 保证 <code>useReducer</code> 返回的 <code>dispatch</code> 具有稳定 identity。拆分 Context 的直接收益是缩小订阅面；是否值得这样做，应结合 API 清晰度和真实渲染成本判断，而不是把双 Context 当成默认性能模板。
        </div>
      </div>
    </div>
  );
}

export default UseReduceWithContextDemo;
