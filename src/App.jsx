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

function BadgeList({ isVIP, score }) {
  return (
    <>
      <section>
        <button> 通过</button>
        <button> 拒绝</button>
      </section>
      <section>
        {isVIP ? <span> 最贵的vip用户</span> : <span> 普通用户</span>}

        <hr />
        {score > 80 && (
          <span style={{ color: "green", background: "red" }}> 优秀</span>
        )}

        <hr />
        {score && <span>有分数</span>}
        {/* ✅ 显式返回 null，React 遇到 null 什么都不会渲染 */}
        {score ? <span>有分数</span> : <span>分数不存在</span>}
      </section>
    </>
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

      <BadgeList isVIP={true} score={81}></BadgeList>
      <BadgeList isVIP={false} score={80}></BadgeList>
      <BadgeList isVIP={false} score={0}></BadgeList>
    </>
  );
}
