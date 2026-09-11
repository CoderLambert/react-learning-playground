import { useState } from "react";

const MODULES = [
  { name: "ProductPage.server", side: "server", canState: false, canDb: true, shipped: false },
  { name: "Price.server", side: "server", canState: false, canDb: true, shipped: false },
  { name: "AddToCart.client", side: "client", canState: true, canDb: false, shipped: true },
  { name: "CartCount.client", side: "client", canState: true, canDb: false, shipped: true },
];

export function RscBoundaryDemo() {
  const [selected, setSelected] = useState(MODULES[0]);
  const [payloadStep, setPayloadStep] = useState(0);
  const payload = [
    "Server Component executes in the RSC server environment",
    "RSC payload describes rendered server result + client references",
    "Framework/SSR layer may use that result to produce initial HTML",
    "Browser loads referenced Client Component JS and hydrates interactive UI",
  ];

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <h2 className="demo-title"><span>🧱</span> React Server Components：Server / Client Boundary</h2>
          <span className="badge badge-blue">RSC</span>
        </div>
        <p className="demo-desc">Server Components 会在客户端应用与传统 SSR renderer 之外的 RSC 环境中提前执行，其组件实现不会作为该 Server Component 的客户端模块发送。需要 state、Effect、事件处理或浏览器 API 的模块进入 Client Component graph。<code>"use client"</code> 定义客户端模块边界，而 <code>"use server"</code> 标记 Server Function，不是 Server Component。</p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>🎮</span> Module graph 边界实验</h3></div>
        <div className="demo-grid-2">
          <div style={{ display: "grid", gap: 8 }}>
            {MODULES.map((module) => <button key={module.name} type="button" className="btn" aria-pressed={selected.name === module.name} onClick={() => setSelected(module)}>{module.side === "server" ? "🖥️" : "🌐"} {module.name}</button>)}
          </div>
          <div style={{ padding: 16, background: "var(--bg-surface-secondary)", borderRadius: "var(--radius-md)" }}>
            <strong>{selected.name}</strong>
            <p>模块边界：{selected.side}</p>
            <p>可使用 useState / browser event：<strong>{String(selected.canState)}</strong></p>
            <p>可直接访问 server data layer：<strong>{String(selected.canDb)}</strong></p>
            <p>组件模块进入浏览器 JS graph：<strong>{String(selected.shipped)}</strong></p>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>📦</span> RSC payload 心智时间线</h3></div>
        <div style={{ display: "grid", gap: 8 }}>
          {payload.slice(0, payloadStep + 1).map((line, index) => <div key={line} style={{ padding: 10, border: "1px solid var(--border-color)", borderRadius: 8 }}><strong>{index + 1}.</strong> {line}</div>)}
        </div>
        <button className="btn" type="button" style={{ marginTop: 12 }} disabled={payloadStep === payload.length - 1} onClick={() => setPayloadStep((value) => Math.min(payload.length - 1, value + 1))}>下一阶段</button>
      </div>

      <div className="demo-grid-2">
        <div className="demo-alert demo-alert-tip"><div className="demo-alert-title">Server Component</div><p>适合在 RSC 环境读取服务端数据、减少发送到客户端的组件代码，并把非交互工作留在服务端。React 官方说明它们可以在 build time 或 request time 执行。</p></div>
        <div className="demo-alert demo-alert-tip"><div className="demo-alert-title">Client Component</div><p>承担 state、Effects、event handlers 与浏览器 API。<code>"use client"</code> 标记的是模块依赖图边界；在支持 RSC + SSR 的框架里，Client Component 的初始 UI 仍可能参与服务端预渲染，之后再由客户端 JS hydration，因此“Client Component”不等于“首屏只在浏览器生成 HTML”。</p></div>
      </div>

      <div className="demo-alert demo-alert-warning" style={{ marginTop: 12 }}><div className="demo-alert-title">反模式：把 RSC 等同 SSR</div><p>SSR 讨论“React UI 如何在服务器输出 HTML，并由客户端 hydration”；RSC 讨论“哪些组件在哪个 RSC 环境执行、哪些模块进入客户端 graph，以及如何通过 RSC payload 组合结果”。框架可以把两层组合在一次页面请求里，但它们不是同一层能力。</p></div>
    </div>
  );
}

export default RscBoundaryDemo;
