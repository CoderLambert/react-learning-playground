/**
 * UserCard 组件
 * 演示：Props 基础读取、参数默认值解构与纯函数渲染
 */
export function UserCard({ name, role = "普通成员", isOnline }) {
  // 生成用户名首字母头像
  const initial = name ? name.trim().charAt(0).toUpperCase() : "?";

  return (
    <div
      style={{
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-md)",
        padding: "16px",
        backgroundColor: "var(--bg-surface)",
        boxShadow: "var(--shadow-xs)",
        transition: "all var(--transition-fast)",
        display: "flex",
        alignItems: "center",
        gap: "14px",
      }}
    >
      {/* 头像与在线状态 */}
      <div style={{ position: "relative" }}>
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            backgroundColor: "var(--color-primary-light)",
            color: "var(--color-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "700",
            fontSize: "18px",
            border: "1px solid var(--color-primary-border)",
          }}
        >
          {initial}
        </div>
        <span
          style={{
            position: "absolute",
            bottom: "0",
            right: "0",
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: isOnline ? "var(--color-success)" : "var(--text-subtle)",
            border: "2px solid #fff",
          }}
          title={isOnline ? "在线" : "离线"}
        />
      </div>

      {/* 用户信息 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <h4 style={{ margin: 0, fontSize: "15px", color: "var(--text-main)", fontWeight: "600" }}>
            {name}
          </h4>
          <span
            style={{
              fontSize: "11px",
              padding: "1px 6px",
              borderRadius: "var(--radius-xs)",
              backgroundColor: "var(--bg-surface-secondary)",
              color: "var(--text-muted)",
              border: "1px solid var(--border-color)",
            }}
          >
            {role}
          </span>
        </div>
        <div style={{ fontSize: "12.5px", color: isOnline ? "var(--color-success-text)" : "var(--text-subtle)" }}>
          {isOnline ? "🟢 当前在线" : "⚪ 离线"}
        </div>
      </div>
    </div>
  );
}

export default UserCard;
