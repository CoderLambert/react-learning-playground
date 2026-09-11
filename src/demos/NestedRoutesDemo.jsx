import { useState } from "react";

const ROUTES = {
  "/dashboard": {
    label: "Dashboard index",
    matched: ["Root", "DashboardLayout", "DashboardHome"],
    child: "DashboardHome（index route）",
    note: "访问父路径本身时，index route 填入父级 Outlet。",
  },
  "/dashboard/settings": {
    label: "Settings",
    matched: ["Root", "DashboardLayout", "Settings"],
    child: "Settings",
    note: "settings 是 dashboard 的子路径，父布局继续保留，只替换 Outlet 内容。",
  },
  "/dashboard/projects/42": {
    label: "Project 42",
    matched: ["Root", "DashboardLayout", "ProjectLayout", "ProjectDetail"],
    child: "ProjectDetail（:projectId = 42）",
    note: "URL 层级可以映射为多层组件层级，每一层通过 Outlet 承接下一层。",
  },
  "/login": {
    label: "Login",
    matched: ["Root", "AuthLayout", "Login"],
    child: "Login",
    note: "AuthLayout 可以是无 path 的 layout route：共享 UI 布局，但不会给 URL 增加额外 segment。",
  },
};

function RouteTree({ matched }) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      {matched.map((name, index) => (
        <div
          key={name}
          style={{
            marginLeft: index * 18,
            padding: "10px 12px",
            border: "1px solid var(--border-color)",
            borderRadius: 8,
            background: index === matched.length - 1 ? "var(--bg-surface-secondary)" : undefined,
          }}
        >
          <strong>{name}</strong>
          {index < matched.length - 1 && (
            <div style={{ marginTop: 6, fontSize: 12, color: "var(--text-muted)" }}>↓ Outlet</div>
          )}
        </div>
      ))}
    </div>
  );
}

export function NestedRoutesDemo() {
  const [pathname, setPathname] = useState("/dashboard");
  const route = ROUTES[pathname];

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title"><span>🪆</span> Nested Routes：URL 层级如何进入 Outlet</h2>
          </div>
          <span className="badge badge-blue">Router 架构</span>
        </div>
        <p className="demo-desc">
          嵌套路由把 URL 层级、组件层级和数据边界组织在同一棵 Route Tree 中。父路由负责共享布局，
          匹配到的子路由渲染进父级 Outlet；切换子页面时，不需要把整个页面壳重新建模。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">Nested Route</span>
          <span className="badge badge-gray">Outlet</span>
          <span className="badge badge-gray">Index Route</span>
          <span className="badge badge-gray">Layout Route</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🎮</span> 路由树实验台</h3>
          <p className="demo-section-desc">
            仓库当前没有安装 React Router，因此这里不伪造 Router 运行时；用等价的 route match 结果直接观察“哪些布局保留、哪个子路由进入 Outlet”。
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          {Object.entries(ROUTES).map(([path, item]) => (
            <button
              key={path}
              type="button"
              className="btn"
              onClick={() => setPathname(path)}
              aria-pressed={pathname === path}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="demo-grid-2">
          <div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>当前 URL</div>
            <code style={{ display: "block", padding: 12, marginBottom: 14 }}>{pathname}</code>
            <RouteTree matched={route.matched} />
          </div>

          <div style={{ padding: 16, background: "var(--bg-surface-secondary)", borderRadius: "var(--radius-md)" }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>最深层 Outlet 当前内容</div>
            <strong>{route.child}</strong>
            <p style={{ marginTop: 12 }}>{route.note}</p>
            <div className="demo-alert demo-alert-tip" style={{ marginTop: 16 }}>
              <div className="demo-alert-title">观察重点</div>
              <p>
                在 <code>/dashboard</code> 与 <code>/dashboard/settings</code> 之间切换时，
                <code>DashboardLayout</code> 仍属于两条 URL 的共同匹配链，变化的是它 Outlet 中的子页面。
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🧠</span> 四个必须分清的概念</h3>
        </div>
        <div className="demo-grid-2">
          <div className="demo-alert demo-alert-tip">
            <div className="demo-alert-title">Nested Route</div>
            <p>父路径会自动包含到子路径中，例如 dashboard + settings → <code>/dashboard/settings</code>。</p>
          </div>
          <div className="demo-alert demo-alert-tip">
            <div className="demo-alert-title">Outlet</div>
            <p>父路由渲染共享 UI，Outlet 是匹配子路由的插槽；没有匹配子路由时可以为空。</p>
          </div>
          <div className="demo-alert demo-alert-tip">
            <div className="demo-alert-title">Index Route</div>
            <p>当 URL 正好等于父路由路径时，index route 作为默认子页面渲染进 Outlet。</p>
          </div>
          <div className="demo-alert demo-alert-tip">
            <div className="demo-alert-title">Layout Route</div>
            <p>无 path 的父 Route 可以只提供共享布局，不向 URL 添加新的 segment，例如登录/注册共用 AuthLayout。</p>
          </div>
        </div>
      </div>

      <div className="demo-alert demo-alert-warning">
        <div className="demo-alert-title"><span>⚠️</span> 常见反模式：把所有布局塞进根组件条件判断</div>
        <p>
          当页面层级已经由 URL 决定，却在根组件里用大量路径判断手写侧栏、Header、权限区块条件，会把路由结构重新复制成第二套 UI 状态机。
          真实项目中应让 Route Tree 表达层级，让父布局和 Outlet 承担组合职责。
        </p>
      </div>

      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title"><span>💡</span> 项目边界</div>
        <p>
          URL 嵌套与 Layout 嵌套相关，但不是绝对一一对应：有时需要嵌套 URL 而不继承某个布局，也可能需要共享布局却不新增 URL segment。
          因此设计路由时要同时考虑 URL 信息架构和 UI 布局边界，而不是只按目录层级机械嵌套。
        </p>
      </div>
    </div>
  );
}
