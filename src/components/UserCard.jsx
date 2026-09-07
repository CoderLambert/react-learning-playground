/**
 * 演示：Props 基础读取与默认值解构
 * 
 * 核心原理：
 * 1. Props 是父组件传递给子组件的只读属性（输入参数）。
 * 2. 在组件参数中直接通过对象解构赋予默认值，如 role = "普通成员"。
 */
export function UserCard({ name, role = "普通成员", isOnline }) {
  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        padding: "12px 16px",
        margin: "10px 0",
        backgroundColor: "#ffffff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <h3 style={{ margin: "0 0 6px 0", fontSize: "16px", color: "#1e293b" }}>{name}</h3>
      <p style={{ margin: "4px 0", color: "#64748b", fontSize: "14px" }}>身份：{role}</p>
      <p style={{ margin: "4px 0", fontSize: "14px", color: isOnline ? "#16a34a" : "#94a3b8" }}>
        状态：{isOnline ? "🟢 在线" : "⚪ 离线"}
      </p>
    </div>
  );
}

export default UserCard;
