import { useState } from "react";

const LAYERS = [
  {
    id: "react",
    title: "React Core / React DOM",
    items: ["Components / Hooks", "hydrateRoot", "renderToPipeableStream / renderToReadableStream", "RSC / Server Function primitives"],
  },
  {
    id: "router",
    title: "React Router Framework Mode",
    items: ["routes", "loaders / actions", "CSR / SSR config", "static pre-rendering", "deployment adapters"],
  },
  {
    id: "next",
    title: "Next.js App Router",
    items: ["file-system routing", "Server / Client Component graph", "cache / revalidation", "Server Actions integration", "build / runtime conventions"],
  },
];

export function ServerFunctionsFrameworkDemo() {
  const [layer, setLayer] = useState("react");
  const [authorized, setAuthorized] = useState(false);
  const selected = LAYERS.find((item) => item.id === layer);

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <h2 className="demo-title"><span>🏗️</span> Server Functions 与 Framework 职责边界</h2>
          <span className="badge badge-blue">Architecture Boundary</span>
        </div>
        <p className="demo-desc">React 19 的 Server Function 允许客户端持有一个服务器函数引用并通过网络调用服务器执行。框架负责把这个抽象真正落地成 module transform、请求协议、路由、缓存、部署和安全集成。</p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>🔐</span> Server Function 不是“可信客户端调用”</h3></div>
        <div className="demo-grid-2">
          <div>
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="checkbox" checked={authorized} onChange={(event) => setAuthorized(event.target.checked)} />
              模拟服务端已验证当前用户权限
            </label>
            <button type="button" className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => {}}>调用 updateOrder() Server Function</button>
          </div>
          <div className={`demo-alert ${authorized ? "demo-alert-tip" : "demo-alert-warning"}`}>
            <div className="demo-alert-title">Server-side decision</div>
            <p>{authorized ? "允许 mutation：服务端重新验证身份和授权后执行。" : "拒绝 mutation：客户端传入的参数和函数引用都不能代替服务端授权。"}</p>
          </div>
        </div>
        <p className="demo-section-desc" style={{ marginTop: 12 }}>React 官方要求把 Server Function 参数视为不可信输入，并在服务端验证 mutation 权限。<code>"use server"</code> 标记可被客户端调用的 async Server Function；它不是“这个组件在服务器渲染”的指令。</p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>🧭</span> React 与 Framework 谁负责什么？</h3></div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          {LAYERS.map((item) => <button key={item.id} type="button" className="btn" aria-pressed={layer === item.id} onClick={() => setLayer(item.id)}>{item.title}</button>)}
        </div>
        <div style={{ padding: 16, background: "var(--bg-surface-secondary)", borderRadius: "var(--radius-md)" }}>
          <h4 style={{ marginTop: 0 }}>{selected.title}</h4>
          <ul>{selected.items.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </div>

      <div className="demo-grid-2">
        <div className="demo-alert demo-alert-tip"><div className="demo-alert-title">React Router Framework</div><p>官方当前提供 CSR、SSR 和 static pre-rendering 三类 rendering strategy；Framework Mode 在 Data/Declarative 能力上增加构建与框架约定。</p></div>
        <div className="demo-alert demo-alert-tip"><div className="demo-alert-title">Next.js App Router</div><p>把 RSC、路由、缓存/再验证和 Server Actions 等组合成具体产品框架。学习时应区分“React primitive”与“Next.js policy/API”。</p></div>
      </div>

      <div className="demo-alert demo-alert-warning" style={{ marginTop: 12 }}><div className="demo-alert-title">真实项目边界</div><p>除非你正在写框架或自定义 bundler，否则不要自己拼 RSC protocol。React 官方明确说明：RSC / Server Function 的用户模型在 React 19 稳定，但实现这些能力的 bundler/framework 底层 API 在 19.x minor 之间不遵循 semver。</p></div>
    </div>
  );
}

export default ServerFunctionsFrameworkDemo;
