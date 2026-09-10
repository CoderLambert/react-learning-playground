import { useState } from "react";

const USERS = {
  "1": { id: "1", name: "Ada", role: "Frontend Engineer" },
  "2": { id: "2", name: "Lin", role: "Product Engineer" },
};

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function loadUser(userId) {
  await wait(650);
  const user = USERS[userId];
  if (!user) {
    throw new Error("404 User Not Found");
  }
  return user;
}

export function RouteDataBoundaryDemo() {
  const [userId, setUserId] = useState("1");
  const [status, setStatus] = useState("idle");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [trace, setTrace] = useState(["等待导航"]);

  async function navigateToUser(nextUserId) {
    setUserId(nextUserId);
    setStatus("loading");
    setData(null);
    setError(null);
    setTrace([
      `1. match /users/${nextUserId}`,
      `2. loader({ params: { userId: ${nextUserId} } })`,
      "3. 等待 loader 结果",
    ]);

    try {
      const user = await loadUser(nextUserId);
      setData(user);
      setStatus("success");
      setTrace((items) => [...items, "4. loader 返回数据", "5. route component 使用 loader data 渲染"]);
    } catch (nextError) {
      setError(nextError.message);
      setStatus("error");
      setTrace((items) => [...items, "4. loader 抛出错误", "5. 最近的 route error boundary 接管 UI"]);
    }
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title"><span>📦</span> Route Data Boundary：先匹配，再加载，再渲染</h2>
          </div>
          <span className="badge badge-blue">Data Router</span>
        </div>
        <p className="demo-desc">
          Data Router 把“这个 URL 需要什么数据”放到 route boundary 上。导航发生后先匹配路由并执行 loader，loader 完成后页面再消费数据；失败则交给最近的路由错误边界。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">loader</span>
          <span className="badge badge-gray">params</span>
          <span className="badge badge-gray">pending navigation</span>
          <span className="badge badge-gray">error boundary</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🎮</span> Loader 生命周期实验台</h3>
          <p className="demo-section-desc">
            当前仓库没有 React Router，因此这里用同样的阶段顺序模拟 Data Router。重点观察数据职责属于 route，而不是每个页面都自行写一套 mount Effect。
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          <button type="button" className="btn" onClick={() => navigateToUser("1")}>/users/1</button>
          <button type="button" className="btn" onClick={() => navigateToUser("2")}>/users/2</button>
          <button type="button" className="btn" onClick={() => navigateToUser("404")}>/users/404</button>
        </div>

        <div className="demo-grid-2">
          <div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>当前 route params</div>
            <code style={{ display: "block", padding: 12, marginBottom: 14 }}>{`{ userId: "${userId}" }`}</code>
            <div style={{ display: "grid", gap: 8 }}>
              {trace.map((item) => (
                <div key={item} style={{ padding: 9, border: "1px solid var(--border-color)", borderRadius: 8 }}>{item}</div>
              ))}
            </div>
          </div>

          <div style={{ padding: 16, background: "var(--bg-surface-secondary)", borderRadius: "var(--radius-md)" }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>Route outlet 当前状态</div>
            {status === "idle" && <div className="demo-alert">选择一个用户路由开始实验。</div>}
            {status === "loading" && (
              <div className="demo-alert demo-alert-tip">
                <div className="demo-alert-title">Navigation pending</div>
                <p>下一页面 loader 正在执行。真实 Data Router 可通过 navigation state 显示全局或局部 pending UI。</p>
              </div>
            )}
            {status === "success" && data && (
              <div className="demo-alert demo-alert-tip">
                <div className="demo-alert-title">Loader data ready</div>
                <p><strong>{data.name}</strong></p>
                <p>{data.role}</p>
              </div>
            )}
            {status === "error" && (
              <div className="demo-alert demo-alert-warning">
                <div className="demo-alert-title">Route Error Boundary</div>
                <p>{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🧠</span> Route loader 与组件 fetch 的架构差异</h3>
        </div>
        <div className="demo-grid-2">
          <div className="demo-alert demo-alert-tip">
            <div className="demo-alert-title">Route boundary</div>
            <p>路由匹配已经知道页面身份，因此 loader 可以直接拿 params 加载页面必需数据，并与 navigation pending、错误边界、重定向等路由语义组合。</p>
          </div>
          <div className="demo-alert demo-alert-warning">
            <div className="demo-alert-title">每页 mount Effect 重复取数</div>
            <p>如果所有页面都在挂载后才各自 Effect → fetch，就需要重复实现 loading、错误、竞态、取消、导航协作等机制。复杂应用通常应由 Router 或 Server State 层承担这些职责。</p>
          </div>
        </div>
      </div>

      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title"><span>💡</span> 与 TanStack Query 的边界</div>
        <p>
          Loader 解决“路由进入前需要什么数据”的页面边界问题；TanStack Query 更擅长 cache、stale、refetch、dedupe、mutation 等 Server State 生命周期。
          两者可以组合，不需要把它们理解成只能二选一。Chapter 09 会专门拆解这一层。
        </p>
      </div>
    </div>
  );
}
