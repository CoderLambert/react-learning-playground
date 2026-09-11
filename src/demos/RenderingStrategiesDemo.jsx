import { useMemo, useState } from "react";

const STRATEGIES = {
  csr: {
    name: "CSR / SPA",
    timeline: ["Server → minimal HTML shell", "Browser → load JS", "React → render UI on client", "Client Router → subsequent navigation"],
    strengths: "客户端交互模型直接，静态托管简单。",
    tradeoffs: "首屏内容依赖 JS；SEO、首屏性能和数据瀑布需要额外设计。",
  },
  ssg: {
    name: "SSG / Static Pre-rendering",
    timeline: ["Build time → execute data loading", "Generate HTML for known URLs", "CDN → return ready HTML", "Browser → hydrate if interactive"],
    strengths: "可缓存、部署简单，适合内容相对稳定页面。",
    tradeoffs: "动态性受构建/再验证策略约束；不是每个 URL 都适合预生成。",
  },
  ssr: {
    name: "SSR",
    timeline: ["Request → server render React tree", "Server → stream/send HTML", "Browser → display HTML", "Client → hydrate interactive boundaries"],
    strengths: "请求时可读取动态数据并先发送 HTML。",
    tradeoffs: "需要服务器运行时、缓存策略和 hydration 正确性。",
  },
};

export function RenderingStrategiesDemo() {
  const [strategy, setStrategy] = useState("ssr");
  const item = STRATEGIES[strategy];
  const rows = useMemo(() => Object.entries(STRATEGIES), []);

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <h2 className="demo-title"><span>🌐</span> CSR / SPA / SSG / SSR：谁在什么时候生成 HTML？</h2>
          <span className="badge badge-blue">Rendering Strategy</span>
        </div>
        <p className="demo-desc">React 提供客户端渲染、服务端渲染和 hydration 等底层能力；SSG、路由、数据加载和部署策略通常由框架组合。不要把“React”与“某个 React 框架的默认策略”混为一谈。</p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🎮</span> 切换渲染策略观察时间线</h3>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {rows.map(([key, value]) => (
            <button key={key} type="button" className="btn" aria-pressed={strategy === key} onClick={() => setStrategy(key)}>{value.name}</button>
          ))}
        </div>
        <div className="demo-grid-2">
          <div style={{ display: "grid", gap: 8 }}>
            {item.timeline.map((step, index) => <div key={step} style={{ padding: 10, border: "1px solid var(--border-color)", borderRadius: 8 }}><strong>{index + 1}.</strong> {step}</div>)}
          </div>
          <div>
            <div className="demo-alert demo-alert-tip"><div className="demo-alert-title">适合点</div><p>{item.strengths}</p></div>
            <div className="demo-alert demo-alert-warning" style={{ marginTop: 10 }}><div className="demo-alert-title">代价</div><p>{item.tradeoffs}</p></div>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>🧠</span> 关键边界</h3></div>
        <div className="demo-grid-2">
          <div className="demo-alert demo-alert-tip"><div className="demo-alert-title">React Core</div><p><code>createRoot</code>、<code>hydrateRoot</code>、<code>react-dom/server</code> streaming APIs 等是底层能力。</p></div>
          <div className="demo-alert demo-alert-tip"><div className="demo-alert-title">Framework</div><p>路由、数据加载、build-time prerender、部署适配、缓存和 Server/Client module graph 通常由框架负责。</p></div>
        </div>
      </div>

      <div className="demo-alert demo-alert-warning"><div className="demo-alert-title">反模式：用 SPA / SSR 二选一描述整个产品</div><p>真实应用可以按路由混合策略：静态页预渲染、动态页 SSR、局部交互 hydration、后续导航客户端执行。先定义页面数据与更新频率，再选渲染策略。</p></div>
    </div>
  );
}

export default RenderingStrategiesDemo;
