import { useState, createContext, useContext } from "react";

// 创建全局用户上下文
const UserContext = createContext(null);

// ==========================================
// 方案 1：属性逐层透传 (Prop Drilling)
// 缺点：中间组件 Navbar 和 Header 完全不需要 user，却被迫传递
// ==========================================
function DrillingAvatar({ user }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          backgroundColor: "#ef4444",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
          fontWeight: "bold",
        }}
      >
        {user.name.charAt(0)}
      </div>
      <span style={{ fontSize: "13px" }}>{user.name} ({user.role})</span>
    </div>
  );
}

function DrillingHeader({ user }) {
  return (
    <div style={{ padding: "8px 12px", background: "#f1f5f9", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: "12px", color: "#64748b" }}>Header（中间层 2）</span>
      <DrillingAvatar user={user} />
    </div>
  );
}

function DrillingNavbar({ user }) {
  return (
    <div style={{ padding: "10px", border: "1px dashed #cbd5e1", borderRadius: "8px" }}>
      <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "6px" }}>Navbar 导航栏（中间层 1）</div>
      <DrillingHeader user={user} />
    </div>
  );
}

// ==========================================
// 方案 2：组件组合解法 (Component Composition)
// 官方推荐首选：由顶层直接组装目标组件，中间层通过 children / slot 穿透
// 中间层无需知晓任何 user 的字段！
// ==========================================
function CompositionNavbar({ rightSlot }) {
  return (
    <div style={{ padding: "10px", border: "1px dashed #86efac", borderRadius: "8px", background: "#f0fdf4" }}>
      <div style={{ fontSize: "12px", color: "#166534", marginBottom: "6px" }}>
        Navbar 导航栏（无任何 user Props，只负责布局插槽）
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "13px", fontWeight: "600" }}>应用 Logo</span>
        {rightSlot}
      </div>
    </div>
  );
}

// ==========================================
// 方案 3：Context API 全局共享解法
// 适合全局深层广播（如多处消费当前用户/主题）
// ==========================================
function ContextAvatar() {
  const user = useContext(UserContext);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          backgroundColor: "#3b82f6",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
          fontWeight: "bold",
        }}
      >
        {user.name.charAt(0)}
      </div>
      <span style={{ fontSize: "13px" }}>{user.name} ({user.role})</span>
    </div>
  );
}

function ContextHeader() {
  return (
    <div style={{ padding: "8px 12px", background: "#eff6ff", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: "12px", color: "#1e40af" }}>Header（无需 Props，直接透传）</span>
      <ContextAvatar />
    </div>
  );
}

function ContextNavbar() {
  return (
    <div style={{ padding: "10px", border: "1px dashed #93c5fd", borderRadius: "8px" }}>
      <div style={{ fontSize: "12px", color: "#1e40af", marginBottom: "6px" }}>
        Navbar 导航栏（无需 Props）
      </div>
      <ContextHeader />
    </div>
  );
}

export function PropDrillingDemo() {
  const [user, setUser] = useState({ name: "Alex Chen", role: "技术总监" });

  return (
    <div>
      {/* 头部说明卡片 */}
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>🪜</span> 属性逐层透传（Prop Drilling）与两大破解之道
            </h2>
          </div>
          <span className="badge badge-amber">架构解耦</span>
        </div>
        <p className="demo-desc">
          “Prop Drilling” 指为了将数据传递给深层子组件，沿途所有中间组件都必须显式接收并向下透传 Props 的反模式。这导致中间组件与无关数据过度耦合，重构极易出错。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-red">反模式：逐层透传 (Drilling)</span>
          <span className="badge badge-green">官方首选推荐：组件组合 (Composition)</span>
          <span className="badge badge-blue">全局解法：Context API</span>
        </div>
      </div>

      {/* 实时修改用户状态 */}
      <div className="demo-section" style={{ padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "13px", fontWeight: "600" }}>修改顶层用户状态：</span>
            <input
              type="text"
              className="form-input"
              style={{ width: "160px" }}
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              placeholder="用户姓名"
            />
            <input
              type="text"
              className="form-input"
              style={{ width: "160px" }}
              value={user.role}
              onChange={(e) => setUser({ ...user, role: e.target.value })}
              placeholder="用户角色"
            />
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setUser({ name: "Sarah Lee", role: "UI 设计总监" })}
          >
            切换为用户 Sarah
          </button>
        </div>
      </div>

      {/* 三大方案直观对比 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>⚖️</span> 三大解决路径方案对比
          </h3>
          <p className="demo-section-desc">
            观察代码结构与组件责任边界的不同：
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* 方案 1 */}
          <div className="comparison-card bad">
            <div className="comparison-header bad">
              <span>❌</span> 方案 1：属性逐层透传 (Prop Drilling)
            </div>
            <p style={{ margin: "0 0 10px 0", fontSize: "13px", color: "var(--text-muted)" }}>
              链路：<code>Page(拥有 user) ➔ Navbar(无需 user) ➔ Header(无需 user) ➔ Avatar(消费 user)</code>。中间任何一层改名或漏传都会导致崩溃。
            </p>
            <DrillingNavbar user={user} />
          </div>

          {/* 方案 2 */}
          <div className="comparison-card good">
            <div className="comparison-header good">
              <span>✅</span> 方案 2：组件组合插槽 (Component Composition - 官方优先推荐)
            </div>
            <p style={{ margin: "0 0 10px 0", fontSize: "13px", color: "var(--text-muted)" }}>
              由顶层直接渲染 <code>&lt;DrillingAvatar user=&#123;user&#125; /&gt;</code> 并作为 slot 传给 Navbar。中间组件仅负责插槽摆放，对 <code>user</code> 完全解耦，随时可替换！
            </p>
            <CompositionNavbar rightSlot={<DrillingAvatar user={user} />} />
          </div>

          {/* 方案 3 */}
          <div style={{ border: "1px solid #bfdbfe", borderRadius: "var(--radius-md)", padding: "16px", backgroundColor: "#f8fafc" }}>
            <div style={{ fontSize: "13.5px", fontWeight: "700", color: "#1d4ed8", display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
              <span>🌐</span> 方案 3：Context API 全局广播
            </div>
            <p style={{ margin: "0 0 10px 0", fontSize: "13px", color: "var(--text-muted)" }}>
              通过 <code>UserContext.Provider</code> 包裹顶层，深层 <code>Avatar</code> 直接使用 <code>useContext(UserContext)</code> 获取数据，中间链路 0 属性感知。
            </p>
            <UserContext.Provider value={user}>
              <ContextNavbar />
            </UserContext.Provider>
          </div>
        </div>
      </div>

      {/* 核心设计决策心智 */}
      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title">
          <span>💡</span> 架构决策指南：遇到 Prop Drilling 时如何抉择？
        </div>
        <div>
          1. <strong>不要过早引入 Context</strong>：Context 会降低组件的独立复用性。如果只是 2~3 层的布局传递，<strong>优先使用组件组合（插槽 / Children）</strong>。
        </div>
        <div>
          2. <strong>何时使用 Context</strong>：当数据是真正的“全局共享属性”（如当前登录用户信息、UI 主题 Theme、国际化语言 Locale、购物车全局清单），且组件树中很多不同深度的组件都需要同时读取时，才选用 Context。
        </div>
      </div>
    </div>
  );
}

export default PropDrillingDemo;
