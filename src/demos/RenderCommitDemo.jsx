import { useState } from "react";

export function RenderCommitDemo() {
  const [count, setCount] = useState(0);
  const [themeTick, setThemeTick] = useState(0);
  const [renderCount, setRenderCount] = useState(1);
  const [commitCount, setCommitCount] = useState(1);
  const [changed, setChanged] = useState(false);

  const text = `Count: ${count}`;

  function recordInteraction(didTextChange) {
    setRenderCount((value) => value + 1);
    setCommitCount((value) => value + 1);
    setChanged(didTextChange);
  }

  function incrementCount() {
    setCount((value) => value + 1);
    recordInteraction(true);
  }

  function incrementThemeTick() {
    setThemeTick((value) => value + 1);
    recordInteraction(false);
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top"><h2 className="demo-title"><span>🏗️</span> Trigger → Render → Commit</h2><span className="badge badge-blue">02-06</span></div>
        <p className="demo-desc">更新先触发 React 调用组件计算 JSX（Render），再把必要变化提交到 DOM（Commit）。一次 render 不等于 DOM 一定发生变化。</p>
        <div className="demo-meta-tags"><span className="badge badge-gray">Trigger</span><span className="badge badge-gray">Render</span><span className="badge badge-gray">Commit</span><span className="badge badge-gray">Paint</span></div>
      </div>

      <div className="demo-section">
        <div className="demo-grid-2">
          <div style={{ display: "grid", gap: 10, alignContent: "start" }}>
            <button className="btn btn-primary" type="button" onClick={incrementCount}>更新 count（UI 文本会变）</button>
            <button className="btn" type="button" onClick={incrementThemeTick}>只更新无关 state（Count 文本不变）</button>
          </div>
          <div style={{ padding: 16, background: "var(--bg-surface-secondary)", borderRadius: 10 }}>
            <strong style={{ fontSize: 28 }}>{text}</strong>
            <div style={{ marginTop: 12 }}>Render 调用次数：{renderCount}</div>
            <div>已完成 Commit：{commitCount}</div>
            <div>themeTick：{themeTick}</div>
            <div className={`demo-alert ${changed ? "demo-alert-tip" : ""}`} style={{ marginTop: 12 }}>本次 render 计算出的 Count 文本相对上次 commit：<strong>{changed ? "变化" : "相同"}</strong></div>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title">🧠 四阶段心智模型</h3></div>
        <p><strong>1 Trigger：</strong>初次挂载或 state 更新请求一次 render。</p>
        <p><strong>2 Render：</strong>React 调用组件，纯计算下一份 JSX snapshot；此阶段不应执行副作用。</p>
        <p><strong>3 Commit：</strong>React 将真正需要的 DOM 变化提交到页面。即使组件 render，某个 DOM 节点也可能完全不变。</p>
        <p><strong>4 Browser Paint：</strong>浏览器在 React 提交 DOM 后负责布局与绘制；这不是 React 的 render phase。</p>
      </div>

      <div className="demo-alert demo-alert-warning"><strong>反模式：</strong>在组件函数执行期间直接写 DOM、发请求或修改外部变量，会让可重复 render 失去纯度。副作用应放事件处理或与外部系统同步的 Effect。</div>
    </div>
  );
}

export default RenderCommitDemo;
