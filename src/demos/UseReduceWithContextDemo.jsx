import { createContext, useContext, useReducer, useRef, useEffect } from "react";

// ==========================================
// 1. 拆分为独立的两个 Context 通道
// ==========================================
// 通道 A：只负责传递变化频繁的状态 State
const TaskStateContext = createContext(null);
// 通道 B：只负责传递生命周期内引用恒定不变的 dispatch 函数
const TaskDispatchContext = createContext(null);

// ==========================================
// 2. Reducer 纯函数
// ==========================================
const initialTasks = [
  { id: 1, title: "学习 React 19 核心 API", done: true },
  { id: 2, title: "拆分 Context 双通道，规避无效重渲染", done: false },
  { id: 3, title: "消除全部 Oxlint 语法规范告警", done: false },
];

function taskReducer(tasks, action) {
  switch (action.type) {
    case "ADD":
      return [{ id: Date.now(), title: action.title, done: false }, ...tasks];
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
    <TaskStateContext.Provider value={tasks}>
      <TaskDispatchContext.Provider value={dispatch}>
        {children}
      </TaskDispatchContext.Provider>
    </TaskStateContext.Provider>
  );
}

// ==========================================
// 4. 消费组件 A：仅订阅 Dispatch 通道（写操作）
// 核心亮点：无论任务状态怎么变，由于 dispatch 引用永久稳定，本组件【绝对不会】触发重渲染！
// ==========================================
function AddTaskBar() {
  const dispatch = useTaskDispatch();
  const badgeElementRef = useRef(null);

  // 在副作用中更新 DOM 计数，严格遵守纯函数渲染阶段禁止操作 ref 规范
  useEffect(() => {
    if (badgeElementRef.current) {
      const count = (Number(badgeElementRef.current.dataset.renders) || 0) + 1;
      badgeElementRef.current.dataset.renders = String(count);
      badgeElementRef.current.textContent = `⚡ 挂载/渲染次数：${count} 次（保持恒定）`;
    }
  });

  const handleQuickAdd = (text) => {
    dispatch({ type: "ADD", title: text });
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
          ⚡ 挂载/渲染次数：1 次（保持恒定）
        </span>
      </div>

      <p style={{ margin: "0 0 10px 0", fontSize: "12.5px", color: "var(--text-muted)" }}>
        由于仅使用了 <code>useTaskDispatch()</code>，即便右侧任务列表不断增删，本组件依然 0 次多余重渲染！
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
// 核心亮点：只有当任务数据真实变化时，才响应式重渲染
// ==========================================
function TaskList() {
  const tasks = useTaskState();
  const dispatch = useTaskDispatch();
  const badgeElementRef = useRef(null);

  // 在副作用中更新 DOM 计数
  useEffect(() => {
    if (badgeElementRef.current) {
      const count = (Number(badgeElementRef.current.dataset.renders) || 0) + 1;
      badgeElementRef.current.dataset.renders = String(count);
      badgeElementRef.current.textContent = `🔄 渲染次数：${count} 次（随 State 刷新）`;
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
          🔄 渲染次数：1 次（随 State 刷新）
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
      {/* 头部说明卡片 */}
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>⚡</span> Reducer + Context 双通道拆分与性能极致优化
            </h2>
          </div>
          <span className="badge badge-green">高级性能模式</span>
        </div>
        <p className="demo-desc">
          在传统 Context 架构中，一旦将 <code>&#123; state, dispatch &#125;</code> 混在一个 Provider 中向下传递，每次 state 变更都会导致整个子树所有订阅 Context 的组件无脑重新渲染。<strong>双通道拆分模式</strong> 将 State 与稳定的 Dispatch 彻底隔离，让写组件保持 0 无效重渲染。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">双通道架构 (Dual-Channel Context)</span>
          <span className="badge badge-gray">Dispatch 引用不变性 (Stable Identity)</span>
          <span className="badge badge-gray">按需精确定向重渲染 (Targeted Re-render)</span>
        </div>
      </div>

      {/* 原理对比卡片 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>⚖️</span> 单通道 vs 双通道架构对比
          </h3>
        </div>

        <div className="demo-grid-2">
          <div className="comparison-card bad">
            <div className="comparison-header bad">
              <span>❌</span> 单通道（常见性能杀手）
            </div>
            <pre style={{ margin: 0, padding: "8px", background: "#fef2f2", borderRadius: "4px", fontSize: "12px", overflowX: "auto" }}>
{`// 🔴 只要 state 变了，对象引用更新
// 所有只想发送 dispatch 的按钮组件全部被迫重渲染！
<AppContext.Provider value={{ state, dispatch }}>
  <AddButton /> {/* 每次都白白重渲染！ */}
  <ListView />
</AppContext.Provider>`}
            </pre>
          </div>

          <div className="comparison-card good">
            <div className="comparison-header good">
              <span>✅</span> 双通道拆分（工业级标准实践）
            </div>
            <pre style={{ margin: 0, padding: "8px", background: "#f0fdf4", borderRadius: "4px", fontSize: "12px", overflowX: "auto" }}>
{`// 🟢 dispatch 引用恒定不变
// 只消费 Dispatch 的组件永远不因数据更新而重渲染！
<StateContext.Provider value={state}>
  <DispatchContext.Provider value={dispatch}>
    <AddButton /> {/* 始终保持 1 次渲染！ */}
    <ListView />
  </DispatchContext.Provider>
</StateContext.Provider>`}
            </pre>
          </div>
        </div>
      </div>

      {/* 实时性能测试工作台 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🔬</span> 实时渲染计数测试工作台
          </h3>
          <p className="demo-section-desc">
            点击下方组件 A 中的按钮添加或切换任务，注意观察顶部绿色的【组件 A 渲染次数】与橙色的【组件 B 渲染次数】：
          </p>
        </div>

        <TaskProvider>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <AddTaskBar />
            <TaskList />
          </div>
        </TaskProvider>
      </div>

      {/* 总结提示 */}
      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title">
          <span>💡</span> 性能优化心智法则
        </div>
        <div>
          React 官方明确指出：<code>dispatch</code> 函数的引用在组件的整个生命周期中是<strong>完全稳定且永久不变的</strong>。因此，通过单独开辟 <code>DispatchContext</code>，所有只负责触发行为的组件（按钮、表单提交器、定时调度器）都不需要重渲染，无需编写任何复杂的 <code>React.memo</code>！
        </div>
      </div>
    </div>
  );
}

export default UseReduceWithContextDemo;
