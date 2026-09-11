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
    "Server Component executes near data source",
    "RSC payload describes rendered server result + client references",
    "Client loads referenced Client Component JS",
    "Interactive islands attach state/events",
  ];

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <h2 className="demo-title"><span>🧱</span> React Server Components：Server / Client Boundary</h2>
          <span className="badge badge-blue">RSC</span>
        </div>
        <p className="demo-desc">Server Components 在客户端应用之外的独立环境中提前执行，不发送组件实现到浏览器；需要交互的子树由 Client Component 承担。<code>"use client"</code> 定义客户端模块边界，而 <code>"use server"</code> 标记的是 Server Function，不是 Server Component。</p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>🎮</span> Module graph 边界实验</h3></div>
        <div className="demo-grid-2">
          <div style={{ display: "grid", gap: 8 }}>
            {MODULES.map((module) => <button key={module.name} type="button" className="btn" aria-pressed={selected.name === module.name} onClick={() => setSelected(module)}>{module.side === "server" ? "🖥️" : "🌐"} {module.name}</button>)}
          </div>
          <div style={{ padding: 16, background: "var(--bg-surface-secondary)", borderRadius: "var(--radius-md)" }}>
            <strong>{selected.name}</strong>
            <p>执行环境：{selected.side}</p>
            <p>可使用 useState / browser event：<strong>{String(selected.canState)}</strong></p>
            <p>可直接访问 server data layer：<strong>{String(selected.canDb)}</strong></p>
            <p>组件实现进入浏览器 JS bundle：<strong>{String(selected.shipped)}</strong></p>
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
        <div className="demo-alert demo-alert-tip"><div className="demo-alert-title">Server Component</div><p>适合读取数据、减少客户端 bundle、把非交互内容留在服务器环境。React 官方指出它们可以在 build time 或 request time 执行。</p></div>
        <div className="demo-alert demo-alert-tip"><div className="demo-alert-title">Client Component</div><p>承担 state、effects、event handlers 与浏览器 API。边界以下的客户端依赖进入客户端 module graph。</p></div>
      </div>

      <div className="demo-alert demo-alert-warning" style={{ marginTop: 12 }}><div className="demo-alert-title">反模式：把 RSC 等同 SSR</div><p>SSR 讨论的是“把 React 树输出为 HTML 并在浏览器 hydration”；RSC 讨论的是“哪些组件在哪个环境执行、如何通过 payload 组合 Server/Client module graph”。两者可以一起使用，但不是同一层能力。</p></div>
    </div>
  );
}

export default RscBoundaryDemo;
