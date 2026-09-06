// 1. 定义
function UserStatus({ isLoggedIn, unreadCount }) {
  return (
    <div className="status-panel">
      {/* 1. 三元运算符：二选一 */}
      <h2>{isLoggedIn ? "欢迎回来，开发者！" : "请先登录"}</h2>

      {/* 2. 逻辑与 &&：满足条件才渲染 */}
      {isLoggedIn && unreadCount > 0 && (
        <p style={{ color: "orange", fontWeight: "bold" }}>
          你有 {unreadCount} 条未读消息
        </p>
      )}
    </div>
  );
}

export default function App() {
  return (
    <>
      <h1>条件渲染演示</h1>
      {/* 登录状态展示 */}
      <UserStatus isLoggedIn={true} unreadCount={5} />
      <hr />
      {/* 未登录状态展示 */}
      <UserStatus isLoggedIn={false} unreadCount={0} />
    </>
  );
}
