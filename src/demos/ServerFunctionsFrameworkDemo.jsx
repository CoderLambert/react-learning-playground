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
    items: ["file-system routing", "Server / Client Component graph", "cache / revalidation", "Server Function / Action integration", "build / runtime conventions"],
  },
];

export function ServerFunctionsFrameworkDemo() {
  const [layer, setLayer] = useState("react");
  const [authorized, setAuthorized] = useState(false);
  const [attempt, setAttempt] = useState(null);
  const selected = LAYERS.find((item) => item.id === layer);

  function simulateRequest() {
    setAttempt({
      id: Date.now(),
      authorized,
      result: authorized ? "mutation accepted" : "403 / mutation rejected",
    });
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <h2 className="demo-title"><span>🏗️</span> Server Functions 与 Framework 职责边界</h2>
          <span className="badge badge-blue">Architecture Boundary</span>
        </div>
        <p className="demo-desc">React 19 的 Server Function 允许 Client Component 调用在服务器执行的 async 函数；框架负责把这个用户模型落地成 module transform、server reference、请求协议、路由、缓存、部署和安全集成。当前 React 文档只在 Server Function 被传给 <code>action</code> prop 或从 Action 内调用时称其为 Server Action；不是所有 Server Function 都是 Server Action。</p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>🔐</span> Server Function 不是“可信客户端调用”</h3></div>
        <div className="demo-grid-2">
          <div>
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="checkbox" checked={authorized} onChange={(event) => setAuthorized(event.target.checked)} />
              模拟服务端已验证当前用户权限
            </label>
            <button type="button" className="btn btn-primary" style={{ marginTop: 12 }} onClick={simulateRequest}>模拟请求 updateOrder()</button>
            <p className="demo-section-desc">这是安全决策模拟器，不会发起真实 Server Function 网络请求。它只验证：服务端授权结果必须决定 mutation，而不是客户端能否拿到函数引用或按钮。</p>
          </div>
          <div className={`demo-alert ${authorized ? "demo-alert-tip" : "demo-alert-warning"}`}>
            <div className="demo-alert-title">Server-side decision</div>
            <p>{authorized ? "允许 mutation：服务端重新验证身份、授权和输入后执行。" : "拒绝 mutation：客户端参数、函数引用或 UI 状态都不能代替服务端授权。"}</p>
            {attempt && (
              <p role="status" style={{ marginTop: 10 }}>
                最近模拟请求：<strong>{attempt.result}</strong>（请求时服务端授权：{attempt.authorized ? "通过" : "拒绝"}）
              </p>
            )}
          </div>
        </div>
        <p className="demo-section-desc" style={{ marginTop: 12 }}>React 官方要求把 Server Function 参数视为不可信输入，并在服务端验证 mutation 权限。<code>"use server"</code> 只能用于 async Server Function；它不是“这个组件在服务器渲染”的指令。直接从事件代码调用 Server Function 时应位于 Transition 中；当它传给 <code>&lt;form action&gt;</code> / <code>formAction</code> 时，React 会按 Action 语义调用。</p>
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
        <div className="demo-alert demo-alert-tip"><div className="demo-alert-title">React Router Framework Mode</div><p>官方当前文档提供 CSR、SSR 和 static pre-rendering 三类 rendering strategy；Framework Mode 在路由/data APIs 之上增加构建、server rendering/pre-rendering 和部署约定。不要把这些框架能力写成 React Core API。</p></div>
        <div className="demo-alert demo-alert-tip"><div className="demo-alert-title">Next.js App Router</div><p>把 React Server/Client Component 模型与文件路由、数据/缓存策略、Server Function/Action 集成和部署运行时组合成具体框架。学习时应区分“React primitive/user model”与“Next.js policy/API”。</p></div>
      </div>

      <div className="demo-alert demo-alert-warning" style={{ marginTop: 12 }}><div className="demo-alert-title">真实项目边界</div><p>除非你正在写框架或自定义 bundler，否则不要自己拼 RSC protocol。React 官方明确说明：RSC / Server Function 的用户模型在 React 19 稳定，但实现这些能力的 bundler/framework 底层 API 在 React 19.x minor 之间不遵循 semver。</p></div>
    </div>
  );
}

export default ServerFunctionsFrameworkDemo;
