import { useState } from "react";

const TABS = [
  { id: "overview", label: "概览" },
  { id: "activity", label: "动态" },
  { id: "settings", label: "设置" },
];

function Tabs({ value, defaultValue = "overview", onChange }) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const activeValue = isControlled ? value : internalValue;

  function selectTab(nextValue) {
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`btn ${activeValue === tab.id ? "btn-primary" : "btn-secondary"} btn-sm`}
            onClick={() => selectTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        style={{
          marginTop: 12,
          padding: 12,
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-sm)",
          background: "var(--bg-surface-secondary)",
        }}
      >
        当前 Tab：<strong>{activeValue}</strong>
      </div>
    </div>
  );
}

export function ControlledUncontrolledDemo() {
  const [controlledValue, setControlledValue] = useState("overview");
  const [parentLog, setParentLog] = useState([]);

  function handleControlledChange(nextValue) {
    setControlledValue(nextValue);
    setParentLog((logs) => [
      `父组件收到 onChange(${nextValue})，决定更新 value`,
      ...logs,
    ].slice(0, 5));
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>🎛️</span> Controlled / Uncontrolled：谁拥有这份 State？
            </h2>
          </div>
          <span className="badge badge-blue">State Ownership</span>
        </div>
        <p className="demo-desc">
          “受控/非受控”不只属于表单输入，它描述的是<strong>组件状态由谁拥有</strong>。受控组件把当前值交给父组件管理；非受控组件自己持有 State，并允许父组件通过 defaultValue 提供初始值。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">value + onChange</span>
          <span className="badge badge-gray">defaultValue</span>
          <span className="badge badge-gray">Single Source of Truth</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">1. 受控模式：父组件持有唯一事实来源</h3>
          <p className="demo-section-desc">
            Tabs 不直接决定最终 active tab，而是发出 onChange。父组件收到事件后更新 value，再通过 props 把新值传回 Tabs。
          </p>
        </div>

        <div className="demo-grid-2">
          <div style={{ padding: 14, border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}>
            <Tabs value={controlledValue} onChange={handleControlledChange} />
            <div className="demo-alert demo-alert-info">
              <div className="demo-alert-title">父组件 State</div>
              <div>controlledValue = {controlledValue}</div>
            </div>
          </div>
          <div style={{ padding: 14, border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}>
            <strong>数据流</strong>
            <pre style={{ fontSize: 12, lineHeight: 1.6, overflowX: "auto" }}>{`Parent state
   ↓ value
<Tabs />
   ↓ onChange(next)
Parent setter
   ↓
next render
   ↓ value
<Tabs />`}</pre>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
              {parentLog.length === 0 ? "点击任意 Tab 观察父组件事件日志。" : parentLog.map((log, index) => <div key={`${log}-${index}`}>• {log}</div>)}
            </div>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">2. 非受控模式：组件内部持有 State</h3>
          <p className="demo-section-desc">
            父组件只给一次初始值 <code>defaultValue="activity"</code>。之后切换由 Tabs 自己的 internalValue 管理。父组件仍可监听 onChange，但不控制当前值。
          </p>
        </div>

        <div style={{ padding: 14, border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}>
          <Tabs defaultValue="activity" />
        </div>

        <div className="demo-alert demo-alert-tip">
          <div className="demo-alert-title">defaultValue 的含义</div>
          <div>
            它表达“初始值”，不是持续同步的控制信号。真实组件库通常用 <code>defaultValue</code> / <code>defaultOpen</code> 这类命名明确这一点。
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">3. 项目中如何选择</h3>
        </div>
        <div className="comparison-container">
          <div className="comparison-card good">
            <div className="comparison-header good">✅ 适合受控</div>
            <div style={{ fontSize: 13, lineHeight: 1.7 }}>
              URL 需要同步当前 Tab；多个组件共享同一选择；父组件需要校验、阻止或重置状态；业务流程需要完整审计状态变化。
            </div>
          </div>
          <div className="comparison-card good">
            <div className="comparison-header good">✅ 适合非受控</div>
            <div style={{ fontSize: 13, lineHeight: 1.7 }}>
              局部 UI 状态只在组件内部有意义；父组件只关心初始值；例如 Accordion 默认展开项、临时 Popover 状态等。
            </div>
          </div>
        </div>
      </div>

      <div className="demo-alert demo-alert-danger">
        <div className="demo-alert-title">⚠️ API 边界</div>
        <div>
          一个组件可以设计成同时支持 controlled / uncontrolled 两种模式，但一次挂载期间应保持模式稳定。不要一会传 value、一会又删除 value；这会让状态所有权变得不清晰，也很容易制造同步 Bug。
        </div>
      </div>
    </div>
  );
}

export default ControlledUncontrolledDemo;
