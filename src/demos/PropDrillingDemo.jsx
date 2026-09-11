import { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

// ==========================================
// 路径 1：显式 Props 数据流
// Props 本身不是反模式；问题出现在大量中间组件只负责机械透传时。
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
      <span style={{ fontSize: "13px" }}>
        {user.name} ({user.role})
      </span>
    </div>
  );
}

function DrillingHeader({ user }) {
  return (
    <div
      style={{
        padding: "8px 12px",
        background: "#f1f5f9",
        borderRadius: "6px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span style={{ fontSize: "12px", color: "#64748b" }}>
        Header（只负责继续传递 user）
      </span>
      <DrillingAvatar user={user} />
    </div>
  );
}

function DrillingNavbar({ user }) {
  return (
    <div
      style={{
        padding: "10px",
        border: "1px dashed #cbd5e1",
        borderRadius: "8px",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          color: "#64748b",
          marginBottom: "6px",
        }}
      >
        Navbar（只负责继续传递 user）
      </div>
      <DrillingHeader user={user} />
    </div>
  );
}

// ==========================================
// 路径 2：组件组合
// 当中间层本质是布局容器时，把已经组装好的 JSX 作为 slot/children 传入。
// ==========================================
function CompositionNavbar({ rightSlot }) {
  return (
    <div
      style={{
        padding: "10px",
        border: "1px dashed #86efac",
        borderRadius: "8px",
        background: "#f0fdf4",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          color: "#166534",
          marginBottom: "6px",
        }}
      >
        Navbar（只定义布局插槽，不需要知道 user）
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "13px", fontWeight: "600" }}>应用 Logo</span>
        {rightSlot}
      </div>
    </div>
  );
}

// ==========================================
// 路径 3：Context
// 适合树中相距较远、多个位置都需要消费同一份信息的场景。
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
      <span style={{ fontSize: "13px" }}>
        {user.name} ({user.role})
      </span>
    </div>
  );
}

function ContextHeader() {
  return (
    <div
      style={{
        padding: "8px 12px",
        background: "#eff6ff",
        borderRadius: "6px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span style={{ fontSize: "12px", color: "#1e40af" }}>
        Header（不消费 user）
      </span>
      <ContextAvatar />
    </div>
  );
}

function ContextNavbar() {
  return (
    <div
      style={{
        padding: "10px",
        border: "1px dashed #93c5fd",
        borderRadius: "8px",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          color: "#1e40af",
          marginBottom: "6px",
        }}
      >
        Navbar（不消费 user）
      </div>
      <ContextHeader />
    </div>
  );
}

export function PropDrillingDemo() {
  const [user, setUser] = useState({ name: "Alex Chen", role: "技术总监" });

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>🪜</span> Prop Drilling：不是看到多层 Props 就要消灭
            </h2>
          </div>
          <span className="badge badge-amber">数据边界</span>
        </div>
        <p className="demo-desc">
          Props 是 React 最直接、最显式的数据流。只有当数据需要穿过许多“不消费它”的中间组件，导致接口噪声和重构成本明显上升时，才值得把它识别为需要处理的 prop drilling。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-amber">默认：显式 Props</span>
          <span className="badge badge-green">布局解耦：Composition</span>
          <span className="badge badge-blue">远距离共享：Context</span>
        </div>
      </div>

      <div className="demo-section" style={{ padding: "16px 20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "13px", fontWeight: "600" }}>
              修改数据所有者中的 user：
            </span>
            <input
              type="text"
              className="form-input"
              style={{ width: "160px" }}
              value={user.name}
              onChange={(event) =>
                setUser((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="用户姓名"
            />
            <input
              type="text"
              className="form-input"
              style={{ width: "160px" }}
              value={user.role}
              onChange={(event) =>
                setUser((current) => ({ ...current, role: event.target.value }))
              }
              placeholder="用户角色"
            />
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setUser({ name: "Sarah Lee", role: "UI 设计总监" })}
          >
            切换为 Sarah
          </button>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>⚖️</span> 同一份数据的三种传递路径
          </h3>
          <p className="demo-section-desc">
            三种路径都能工作。真正要比较的是数据所有权、组件职责、消费范围和接口成本，而不是寻找一个永远正确的 API。
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="comparison-card bad">
            <div className="comparison-header bad">
              <span>1️⃣</span> 显式 Props：链路很深时才出现 drilling 成本
            </div>
            <p
              style={{
                margin: "0 0 10px 0",
                fontSize: "13px",
                color: "var(--text-muted)",
              }}
            >
              <code>Page → Navbar → Header → Avatar</code>。这种写法的数据来源最清楚；当 Navbar、Header 长期只是机械透传，而且链路继续增长时，接口噪声才开始成为真实问题。
            </p>
            <DrillingNavbar user={user} />
          </div>

          <div className="comparison-card good">
            <div className="comparison-header good">
              <span>2️⃣</span> Composition：中间层本质是布局容器时很合适
            </div>
            <p
              style={{
                margin: "0 0 10px 0",
                fontSize: "13px",
                color: "var(--text-muted)",
              }}
            >
              顶层直接创建 <code>&lt;DrillingAvatar user=&#123;user&#125; /&gt;</code>，Navbar 只接收已经组装好的 JSX。这样缩短了数据 props 的传递链，但代价是父组件承担更多布局组合职责。
            </p>
            <CompositionNavbar rightSlot={<DrillingAvatar user={user} />} />
          </div>

          <div
            style={{
              border: "1px solid #bfdbfe",
              borderRadius: "var(--radius-md)",
              padding: "16px",
              backgroundColor: "#f8fafc",
            }}
          >
            <div
              style={{
                fontSize: "13.5px",
                fontWeight: "700",
                color: "#1d4ed8",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "10px",
              }}
            >
              <span>3️⃣</span> Context：多个远距离消费者需要同一信息
            </div>
            <p
              style={{
                margin: "0 0 10px 0",
                fontSize: "13px",
                color: "var(--text-muted)",
              }}
            >
              Provider 让后代消费者直接读取当前值，中间组件不用声明对应 prop。它降低了重复透传，但也让依赖从组件调用处变得不那么显式，因此不应仅因为“传了两三层”就引入 Context。
            </p>
            <UserContext.Provider value={user}>
              <ContextNavbar />
            </UserContext.Provider>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🧠</span> 判断顺序：先问数据归谁，再问怎么传
          </h3>
        </div>
        <div style={{ display: "grid", gap: "10px" }}>
          <div className="demo-alert demo-alert-tip">
            <strong>Props：</strong>消费关系局部、链路可读时继续使用。显式依赖通常更容易追踪和复用。
          </div>
          <div className="demo-alert demo-alert-tip">
            <strong>Composition：</strong>如果中间组件只是 Layout / Shell，把 JSX 作为 <code>children</code> 或 slot 传入，通常可以减少无意义的数据 props。
          </div>
          <div className="demo-alert demo-alert-tip">
            <strong>Context：</strong>当同一信息由树中多个、相距较远的组件消费，例如主题、当前账号、路由上下文或模块级共享状态，再考虑 Context。
          </div>
        </div>
      </div>

      <div className="demo-alert demo-alert-warning">
        <div className="demo-alert-title">
          <span>⚠️</span> 真实项目边界
        </div>
        <div>
          不要按“层数”机械选方案。两三层 props 可能完全合理；十层透传也可能通过重新划分组件边界解决。先检查 State ownership、组件是否承担了过多职责、真正消费者有多少，再决定是否引入 Composition 或 Context。
        </div>
      </div>
    </div>
  );
}

export default PropDrillingDemo;
