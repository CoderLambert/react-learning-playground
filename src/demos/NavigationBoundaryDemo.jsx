import { useState } from "react";

const KNOWN_ROUTES = {
  "/": "Home",
  "/courses": "Courses",
  "/courses/react": "React Course",
  "/account": "Account",
};

export function NavigationBoundaryDemo() {
  const [history, setHistory] = useState(["/"]);
  const [index, setIndex] = useState(0);
  const [programmaticReason, setProgrammaticReason] = useState("—");

  const pathname = history[index];
  const matchedPage = KNOWN_ROUTES[pathname] ?? null;

  function navigate(to, { replace = false, reason = "用户点击链接" } = {}) {
    if (replace) {
      const next = [...history];
      next[index] = to;
      setHistory(next);
      setProgrammaticReason(`${reason}：replace 当前 history entry`);
      return;
    }

    const next = [...history.slice(0, index + 1), to];
    setHistory(next);
    setIndex(next.length - 1);
    setProgrammaticReason(reason);
  }

  function go(delta) {
    const nextIndex = index + delta;
    if (nextIndex < 0 || nextIndex >= history.length) return;
    setIndex(nextIndex);
    setProgrammaticReason(delta < 0 ? "浏览器 Back" : "浏览器 Forward");
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title"><span>🧭</span> Navigation 与 Route Boundary</h2>
          </div>
          <span className="badge badge-blue">页面导航</span>
        </div>
        <p className="demo-desc">
          路由导航不只是“把 pathname 改掉”。真实应用还要区分声明式链接、程序式导航、history 前进后退，以及未匹配 URL 的 Not Found 边界。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">Link / NavLink</span>
          <span className="badge badge-gray">useNavigate</span>
          <span className="badge badge-gray">redirect</span>
          <span className="badge badge-gray">History</span>
          <span className="badge badge-gray">Not Found</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🎮</span> Navigation history 实验台</h3>
          <p className="demo-section-desc">
            这里用本地数组模拟浏览器 history，观察 push、replace、Back / Forward 的差异；真实 React Router 中普通用户导航优先使用 Link / NavLink。
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          {Object.keys(KNOWN_ROUTES).map((to) => (
            <button key={to} type="button" className="btn" onClick={() => navigate(to)}>
              {to}
            </button>
          ))}
          <button type="button" className="btn" onClick={() => navigate("/missing-page")}>
            打开不存在页面
          </button>
        </div>

        <div className="demo-grid-2">
          <div style={{ padding: 16, background: "var(--bg-surface-secondary)", borderRadius: "var(--radius-md)" }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>当前 location</div>
            <code style={{ display: "block", padding: "10px 0" }}>{pathname}</code>
            {matchedPage ? (
              <div className="demo-alert demo-alert-tip">
                <div className="demo-alert-title">Matched route</div>
                <p>{matchedPage}</p>
              </div>
            ) : (
              <div className="demo-alert demo-alert-warning">
                <div className="demo-alert-title">404 / Not Found boundary</div>
                <p>当前 URL 没有业务路由匹配。应由路由层渲染明确的 Not Found 页面，而不是让应用静默空白。</p>
              </div>
            )}
          </div>

          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <button type="button" className="btn" disabled={index === 0} onClick={() => go(-1)}>← Back</button>
              <button type="button" className="btn" disabled={index === history.length - 1} onClick={() => go(1)}>Forward →</button>
              <button
                type="button"
                className="btn"
                onClick={() => navigate("/account", { replace: true, reason: "登录完成后的重定向" })}
              >
                replace → /account
              </button>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>History stack</div>
            <div style={{ display: "grid", gap: 6 }}>
              {history.map((item, itemIndex) => (
                <div key={`${item}-${itemIndex}`} style={{ padding: 8, border: "1px solid var(--border-color)", borderRadius: 8 }}>
                  {itemIndex === index ? "→ " : "  "}{item}
                </div>
              ))}
            </div>
            <p style={{ marginTop: 12, fontSize: 12 }}>最近导航原因：{programmaticReason}</p>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🧠</span> Link、redirect、useNavigate 分工</h3>
        </div>
        <div className="demo-grid-2">
          <div className="demo-alert demo-alert-tip">
            <div className="demo-alert-title">Link / NavLink</div>
            <p>用户主动点击去另一个页面时优先使用。它们保留标准链接语义；NavLink 额外暴露 active 状态，在 Data / Framework 模式还可暴露 pending 状态。</p>
          </div>
          <div className="demo-alert demo-alert-tip">
            <div className="demo-alert-title">redirect / useNavigate</div>
            <p>在 Data / Framework 模式中，如果跳转是 loader/action 数据流程的一部分，官方更推荐直接返回 <code>redirect</code>。<code>useNavigate</code> 更适合不由普通链接表达的客户端流程，例如超时退出、计时器结束，或 Declarative 模式下表单成功后的命令式跳转。</p>
          </div>
        </div>
      </div>

      <div className="demo-alert demo-alert-warning">
        <div className="demo-alert-title"><span>⚠️</span> 常见反模式：按钮伪装链接</div>
        <p>
          如果行为本质是“导航到另一个 URL”，却统一使用按钮和 JavaScript 跳转，会丢失浏览器原生链接能力，例如右键菜单、在新标签页打开以及更自然的键盘/辅助技术语义。
          路由 API 应服从 Web 平台语义，而不是反过来。
        </p>
      </div>

      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title"><span>📌</span> 本页是概念模拟</div>
        <p>当前仓库没有安装 React Router；按钮和本地数组只用于可视化 history 语义，不等同于真实 <code>Link</code>、<code>redirect</code>、<code>useNavigate</code> 运行时。</p>
      </div>
    </div>
  );
}
