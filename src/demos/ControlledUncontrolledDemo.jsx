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
    onChange?.(nextValue);
    if (!isControlled) {
      setInternalValue(nextValue);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`btn ${activeValue === tab.id ? "btn-primary" : "btn-secondary"} btn-sm`}
            type="button"
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
  const [blockSettings, setBlockSettings] = useState(true);
  const [controlledLog, setControlledLog] = useState([]);

  const [uncontrolledDefault, setUncontrolledDefault] = useState("activity");
  const [uncontrolledVersion, setUncontrolledVersion] = useState(0);
  const [uncontrolledLog, setUncontrolledLog] = useState([]);

  function pushControlledLog(message) {
    setControlledLog((logs) => [message, ...logs].slice(0, 6));
  }

  function handleControlledChange(nextValue) {
    pushControlledLog(`Tabs 发出 onChange(${nextValue})：这是请求，不是最终事实`);

    if (blockSettings && nextValue === "settings") {
      pushControlledLog("父组件拒绝这次请求，因此 value 不变，Tabs 也不会切换");
      return;
    }

    setControlledValue(nextValue);
    pushControlledLog(`父组件接受请求并更新 value=${nextValue}`);
  }

  function handleUncontrolledChange(nextValue) {
    setUncontrolledLog((logs) => [
      `Tabs 内部已切换到 ${nextValue}；父组件可以知道发生了什么，但没有当前值的控制权`,
      ...logs,
    ].slice(0, 5));
  }

  function rotateDefaultValue() {
    setUncontrolledDefault((current) => (current === "activity" ? "settings" : "activity"));
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>🎛️</span> Controlled / Uncontrolled：这份 State 由谁决定？
            </h2>
          </div>
          <span className="badge badge-blue">State Ownership</span>
        </div>
        <p className="demo-desc">
          不要把“受控 / 非受控”理解成整个组件的永久标签。更实用的问题是：<strong>对这份重要 State，谁拥有最终决定权？</strong>
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">value = authoritative state</span>
          <span className="badge badge-gray">onChange = intent</span>
          <span className="badge badge-gray">defaultValue = initial state</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">1. 受控：子组件提出请求，父组件决定最终值</h3>
          <p className="demo-section-desc">
            <code>onChange(next)</code> 表达用户意图；真正决定下一次 UI 的是父组件传回来的 <code>value</code>。
          </p>
        </div>

        <div className="demo-grid-2">
          <div style={{ padding: 14, border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}>
            <Tabs value={controlledValue} onChange={handleControlledChange} />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input
                  type="checkbox"
                  checked={blockSettings}
                  onChange={(event) => setBlockSettings(event.currentTarget.checked)}
                />
                父组件拒绝切换到 settings
              </label>
              <button className="btn btn-secondary btn-sm" type="button" onClick={() => setControlledValue("overview")}>
                父组件强制重置为 overview
              </button>
            </div>
            <div className="demo-alert demo-alert-info" style={{ marginTop: 12 }}>
              <div className="demo-alert-title">权威状态</div>
              <div>controlledValue = {controlledValue}</div>
            </div>
          </div>

          <div style={{ padding: 14, border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}>
            <strong>观察请求与决定是否一致</strong>
            <div style={{ marginTop: 10, display: "grid", gap: 6, fontSize: 12, color: "var(--text-muted)" }}>
              {controlledLog.length === 0
                ? "保持“拒绝 settings”开启，点击“设置”，再关闭限制重试。"
                : controlledLog.map((log, index) => <div key={`${log}-${index}`}>• {log}</div>)}
            </div>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">2. 非受控：defaultValue 只参与初始化</h3>
          <p className="demo-section-desc">
            这个 Tabs 在挂载时用 <code>defaultValue</code> 初始化自己的 <code>internalValue</code>。之后父组件改变 defaultValue，不会持续覆盖它；重新挂载时才会重新读取新的初始值。
          </p>
        </div>

        <div className="demo-grid-2">
          <div style={{ padding: 14, border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}>
            <Tabs
              key={uncontrolledVersion}
              defaultValue={uncontrolledDefault}
              onChange={handleUncontrolledChange}
            />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
              <button className="btn btn-secondary btn-sm" type="button" onClick={rotateDefaultValue}>
                仅修改父级 defaultValue
              </button>
              <button className="btn btn-primary btn-sm" type="button" onClick={() => setUncontrolledVersion((version) => version + 1)}>
                使用新 key 重新挂载
              </button>
            </div>
          </div>

          <div style={{ padding: 14, border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}>
            <strong>父组件当前提供的初始值</strong>
            <p style={{ margin: "8px 0 12px" }}><code>defaultValue={uncontrolledDefault}</code></p>
            <p className="demo-section-desc" style={{ marginBottom: 10 }}>
              先手动切换 Tabs，再修改 defaultValue：当前选中项不会被覆盖。随后重新挂载，新的 defaultValue 才参与初始化。
            </p>
            <div style={{ display: "grid", gap: 6, fontSize: 12, color: "var(--text-muted)" }}>
              {uncontrolledLog.length === 0
                ? "父组件尚未收到内部切换通知。"
                : uncontrolledLog.map((log, index) => <div key={`${log}-${index}`}>• {log}</div>)}
            </div>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">3. 组件级 ownership 与原生表单值不是同一层概念</h3>
        </div>
        <div className="comparison-container">
          <div className="comparison-card good">
            <div className="comparison-header good">组件 API</div>
            <div style={{ fontSize: 13, lineHeight: 1.7 }}>
              “controlled” 常用来描述重要信息由 props 驱动，而不是组件自己的 local state。一个组件仍然可以同时保留 hover、focus 等内部 State。
            </div>
          </div>
          <div className="comparison-card good">
            <div className="comparison-header good">原生 input / select</div>
            <div style={{ fontSize: 13, lineHeight: 1.7 }}>
              对表单元素，<code>value</code>/<code>checked</code> 会持续控制当前值；<code>defaultValue</code>/<code>defaultChecked</code> 只提供初始值，之后值主要由 DOM 持有。
            </div>
          </div>
        </div>
      </div>

      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title">项目决策</div>
        <div>
          需要 URL 同步、跨组件协调、父级校验/拒绝/重置时，优先让这份 State 受控；只在局部 UI 内有意义、父级只关心初始值时，可以让组件内部持有。判断的是“这份 State”的 ownership，而不是给整个组件贴永久标签。
        </div>
      </div>
    </div>
  );
}

export default ControlledUncontrolledDemo;
