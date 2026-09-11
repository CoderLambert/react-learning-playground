import { useRef, useState } from "react";

export function RenderCommitDemo() {
  const [count, setCount] = useState(0);
  const [themeTick, setThemeTick] = useState(0);
  const [observation, setObservation] = useState("尚未触发更新");
  const countNodeRef = useRef(null);

  const text = `Count: ${count}`;

  function observeAfterCommit(label) {
    requestAnimationFrame(() => {
      const domText = countNodeRef.current?.textContent ?? "(DOM unavailable)";
      setObservation(`${label} → 浏览器在 React commit 后读到：${domText}`);
    });
  }

  function updateCount() {
    setCount((c) => c + 1);
    observeAfterCommit("count state 更新");
  }

  function updateUnrelatedState() {
    setThemeTick((t) => t + 1);
    observeAfterCommit("无关 state 更新");
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top"><h2 className="demo-title"><span>🏗️</span> Trigger → Render → Commit</h2><span className="badge badge-blue">02-06</span></div>
        <p className="demo-desc">更新先触发 React 调用组件计算下一份 UI（Render），再把必要变化提交到宿主环境（浏览器里通常是 DOM Commit）。组件发生 render，不代表某个 DOM 节点一定会改变。</p>
        <div className="demo-meta-tags"><span className="badge badge-gray">Trigger</span><span className="badge badge-gray">Render</span><span className="badge badge-gray">Commit</span><span className="badge badge-gray">Paint</span></div>
      </div>

      <div className="demo-section">
        <div className="demo-grid-2">
          <div style={{ display: "grid", gap: 10, alignContent: "start" }}>
            <button className="btn btn-primary" type="button" onClick={updateCount}>更新 count（Count DOM 文本会变）</button>
            <button className="btn" type="button" onClick={updateUnrelatedState}>只更新无关 state（Count DOM 文本不变）</button>
          </div>
          <div style={{ padding: 16, background: "var(--bg-surface-secondary)", borderRadius: 10 }}>
            <strong ref={countNodeRef} style={{ fontSize: 28 }}>{text}</strong>
            <div style={{ marginTop: 12 }}>themeTick：{themeTick}</div>
            <div className="demo-alert demo-alert-tip" style={{ marginTop: 12 }}>{observation}</div>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title">🧠 四阶段心智模型</h3></div>
        <p><strong>1 Trigger：</strong>初次挂载，或 state 更新等原因让 React 安排一次 render。</p>
        <p><strong>2 Render：</strong>React 调用组件，纯计算下一份 JSX/UI 描述；这个阶段可能被重复、暂停或放弃，因此不应执行副作用。</p>
        <p><strong>3 Commit：</strong>React 把计算结果中真正需要的变化应用到宿主环境。即使组件重新 render，某个 DOM 节点也可能完全不变。</p>
        <p><strong>4 Browser Paint：</strong>浏览器在 DOM 更新后进行布局与绘制；它不是 React 的 render phase，而且浏览器何时实际绘制由浏览器调度决定。</p>
      </div>

      <div className="demo-alert demo-alert-warning"><strong>反模式：</strong>为了“统计 render 次数”而在组件函数执行期间修改 ref 或外部计数器，本身就会破坏纯 render 约束。调试 render 行为优先使用 React DevTools Profiler；业务副作用放事件处理器，外部系统同步放 Effect。</div>
    </div>
  );
}

export default RenderCommitDemo;
