import { createContext, memo, useContext, useRef, useState } from "react";

const ThemeContext = createContext("light");

function RenderBadge({ label, count }) {
  return (
    <span className="badge badge-gray">
      {label} render #{count}
    </span>
  );
}

function ContextConsumer() {
  const theme = useContext(ThemeContext);
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  return (
    <div style={{ padding: 12, border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}>
      <RenderBadge label="Consumer" count={renderCountRef.current} />
      <div style={{ marginTop: 8 }}>
        useContext(ThemeContext) = <strong>{theme}</strong>
      </div>
    </div>
  );
}

const MemoConsumer = memo(function MemoConsumer() {
  const theme = useContext(ThemeContext);
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  return (
    <div style={{ padding: 12, border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}>
      <RenderBadge label="memo Consumer" count={renderCountRef.current} />
      <div style={{ marginTop: 8 }}>
        context = <strong>{theme}</strong>
      </div>
    </div>
  );
});

const MemoNonConsumer = memo(function MemoNonConsumer() {
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  return (
    <div style={{ padding: 12, border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}>
      <RenderBadge label="memo Non-consumer" count={renderCountRef.current} />
      <div style={{ marginTop: 8 }}>这个组件没有读取 ThemeContext。</div>
    </div>
  );
});

export function ContextPropagationDemo() {
  const [theme, setTheme] = useState("light");
  const [localCount, setLocalCount] = useState(0);

  function toggleTheme() {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  }

  function updateLocalState() {
    setLocalCount((count) => count + 1);
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>📡</span> Context 更新传播：谁会收到新值？
            </h2>
          </div>
          <span className="badge badge-blue">Subscription</span>
        </div>
        <p className="demo-desc">
          useContext 不只是“跨层取值”，它同时建立订阅关系。Provider 的 value 变化后，读取该 Context 的组件会收到最新值并重新渲染；memo 不能阻止 Context 消费者接收新的 Context value。
        </p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">1. 两种更新来源</h3>
          <p className="demo-section-desc">
            点击“切换 Theme”改变 Provider value；点击“更新局部 State”只改变父组件自己的 localCount。比较普通 Consumer、memo Consumer 和 memo Non-consumer 的真实组件执行次数。
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="btn btn-primary btn-sm" onClick={toggleTheme}>切换 Theme</button>
          <button className="btn btn-secondary btn-sm" onClick={updateLocalState}>更新局部 State</button>
        </div>
        <div className="demo-alert demo-alert-info">
          <div className="demo-alert-title">Provider / Local State</div>
          <div>theme = {theme} · localCount = {localCount}</div>
        </div>
      </div>

      <ThemeContext value={theme}>
        <div className="demo-grid-2">
          <ContextConsumer />
          <MemoConsumer />
          <MemoNonConsumer />
        </div>
      </ThemeContext>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">2. 传播模型</h3>
        </div>
        <pre style={{ fontSize: 12, lineHeight: 1.7, overflowX: "auto" }}>{`Provider value changes
        ↓
React compares old/new value with Object.is
        ↓
all descendants that read this Context
receive the fresh value
        ↓
those consumers re-render

memo(Component)
        ↓
can skip parent-prop-driven work
but does NOT block fresh Context values`}</pre>
      </div>

      <div className="comparison-container">
        <div className="comparison-card good">
          <div className="comparison-header good">✅ 设计边界</div>
          <div style={{ fontSize: 13, lineHeight: 1.7 }}>
            Context 适合主题、认证信息、locale、页面级共享状态等跨层数据。Provider value 变化频繁时，应关注 value 粒度、拆分 Context 或稳定对象/函数引用。
          </div>
        </div>
        <div className="comparison-card bad">
          <div className="comparison-header bad">❌ 常见误解</div>
          <div style={{ fontSize: 13, lineHeight: 1.7 }}>
            Context 不是“不会 re-render 的全局变量”。读取 Context 就意味着订阅它；也不能指望给消费者套 memo 就阻止 Context 更新传播。
          </div>
        </div>
      </div>

      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title">关于本页 render 计数</div>
        <div>
          计数在各组件函数执行点通过 ref 累加，因此反映真实组件调用，而不是按钮事件中的预测值。开发环境启用 Strict Mode 时，React 可能额外调用组件来检查纯度，所以不要把“一次点击”机械解释为“一次 render”。真实性能诊断仍应使用 React DevTools Profiler。
        </div>
      </div>
    </div>
  );
}

export default ContextPropagationDemo;
