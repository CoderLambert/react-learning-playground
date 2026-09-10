import { useState } from "react";

// ==========================================
// 场景 3 辅助子组件：通过 key 重置状态
// ==========================================
function CommentForm({ userId }) {
  // 💡 无需编写 useEffect([userId]) 去手动 setComment("")
  // 只要父级指定了 key={userId}，切换用户时 React 自动重置本组件及其初始 State！
  const [comment, setComment] = useState("");

  return (
    <div style={{ padding: "14px", background: "var(--bg-surface-secondary)", borderRadius: "var(--radius-sm)" }}>
      <div style={{ fontSize: "13px", marginBottom: "8px" }}>
        给用户 <strong>{userId}</strong> 的留言板：
      </div>
      <input
        type="text"
        className="form-input"
        placeholder="写下留言..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <div style={{ fontSize: "11px", color: "var(--text-subtle)", marginTop: "6px" }}>
        当前输入草稿: {comment || "（空）"}
      </div>
    </div>
  );
}

export function NotNeedEffectDemo() {
  // ==========================================
  // 场景 1：数据转换（过滤 + 排序）
  // ==========================================
  const rawProducts = [
    { id: 1, name: "MacBook Pro 16", category: "电脑", price: 19999 },
    { id: 2, name: "iPhone 16 Pro Max", category: "手机", price: 9999 },
    { id: 3, name: "iPad Pro M4", category: "平板", price: 8999 },
    { id: 4, name: "AirPods Pro 2", category: "配件", price: 1899 },
    { id: 5, name: "Apple Watch Ultra 2", category: "手表", price: 6499 },
  ];

  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");

  // ✅ 正确做法：直接在渲染期派生，无需 useEffect，无多余二次渲染
  const filteredProducts = rawProducts.filter((p) => {
    const matchCat = selectedCategory === "全部" || p.category === selectedCategory;
    const matchQuery = p.name.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQuery;
  });

  // ==========================================
  // 场景 2：用户事件处理（埋点 / 提示）
  // ==========================================
  const [purchasedCount, setPurchasedCount] = useState(0);
  const [eventLogs, setEventLogs] = useState([]);

  const handleBuy = (productName) => {
    // ✅ 正确做法：业务交互与网络请求直接在 onClick 处理函数中触发！
    // 严禁使用 useEffect 监听 purchasedCount 去上报！
    setPurchasedCount((c) => c + 1);
    const log = `用户主动点击购买了【${productName}】，完成结算操作`;
    setEventLogs((prev) => [log, ...prev.slice(0, 4)]);
  };

  // ==========================================
  // 场景 3：根据 Prop 重置状态
  // ==========================================
  const [activeUserId, setActiveUserId] = useState("User_A");

  return (
    <div>
      {/* 头部说明卡片 */}
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>🚫</span> 你可能不需要 Effect（官方避坑指南）
            </h2>
          </div>
          <span className="badge badge-amber">架构避坑</span>
        </div>
        <p className="demo-desc">
          很多开发者将 <code>useEffect</code> 当成了“数据联动触发器”。滥用 Effect 会引发严重的级联重渲染、难以追踪的时序竞态与闪烁。React 官方总结了三大最典型的“伪 Effect 场景”。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">误区 1：渲染期数据派生</span>
          <span className="badge badge-gray">误区 2：用户事件放入 Effect</span>
          <span className="badge badge-gray">误区 3：利用 key 替代重置 Effect</span>
        </div>
      </div>

      {/* 典型误区 1：转换渲染数据 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🔍</span> 误区 1：用 Effect 过滤衍生数据（产生二次无谓渲染）
          </h3>
          <p className="demo-section-desc">
            错误做法是声明 <code>filteredList</code> 状态并在 Effect 中 <code>setFilteredList</code>。正确做法：直接在组件内计算！
          </p>
        </div>

        <div className="comparison-container">
          <div className="comparison-card bad">
            <div className="comparison-header bad">
              <span>❌</span> 反模式代码
            </div>
            <pre style={{ margin: 0, padding: "8px", background: "#fef2f2", borderRadius: "4px", fontSize: "11.5px", overflowX: "auto" }}>
{`// 🔴 错误：数据流变卡顿且触发两次 Render
const [filtered, setFiltered] = useState([]);
useEffect(() => {
  setFiltered(products.filter(p => ...));
}, [query, category]);`}
            </pre>
          </div>

          <div className="comparison-card good">
            <div className="comparison-header good">
              <span>✅</span> 官方推荐写法
            </div>
            <pre style={{ margin: 0, padding: "8px", background: "#f0fdf4", borderRadius: "4px", fontSize: "11.5px", overflowX: "auto" }}>
{`// 🟢 正确：纯计算，0 延迟，0 额外 state
const filtered = products.filter(p => {
  return matchCategory && matchQuery;
});`}
            </pre>
          </div>
        </div>

        {/* 交互演示 */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "12px", flexWrap: "wrap" }}>
          <input
            type="text"
            className="form-input"
            style={{ maxWidth: "200px" }}
            placeholder="搜索商品..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div style={{ display: "flex", gap: "6px" }}>
            {["全部", "电脑", "手机", "平板", "配件", "手表"].map((cat) => (
              <button
                key={cat}
                className={`btn btn-sm ${selectedCategory === cat ? "btn-primary" : "btn-secondary"}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              style={{
                padding: "10px 14px",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-sm)",
                background: "var(--bg-surface)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "8px",
              }}
            >
              <div>
                <strong style={{ fontSize: "13.5px" }}>{p.name}</strong>
                <div style={{ fontSize: "12px", color: "var(--text-subtle)", marginTop: "2px" }}>{p.category}</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "700", color: "var(--color-danger)", fontSize: "14px" }}>
                  ¥{p.price}
                </span>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleBuy(p.name)}
                >
                  购买
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 典型误区 2：用户事件 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🛒</span> 误区 2：在 Effect 中处理用户特定的事件（如购买通知、提交日志）
          </h3>
          <p className="demo-section-desc">
            Effect 是为了<strong>组件因为被展示而需要运行的代码</strong>。如果某段代码是因为<strong>用户点击了按钮</strong>而运行，它必须直接写在 Event Handler 内部！
          </p>
        </div>

        <div style={{ padding: "12px", background: "var(--bg-surface-secondary)", borderRadius: "var(--radius-sm)" }}>
          <div style={{ fontSize: "13px", marginBottom: "8px" }}>
            已购买件数：<strong>{purchasedCount}</strong>
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            最近操作触发记录（直接由 onClick 调度）：
          </div>
          {eventLogs.length > 0 ? (
            <ul style={{ margin: "6px 0 0 0", paddingLeft: "20px", fontSize: "12.5px" }}>
              {eventLogs.map((log, i) => (
                <li key={i}>{log}</li>
              ))}
            </ul>
          ) : (
            <div style={{ fontSize: "12px", color: "var(--text-subtle)", marginTop: "4px" }}>
              点击上方商品的“购买”按钮即可触发
            </div>
          )}
        </div>
      </div>

      {/* 典型误区 3：利用 key 重置状态 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🔑</span> 误区 3：使用 Effect 监听 Props 改变来重置组件状态
          </h3>
          <p className="demo-section-desc">
            当用户 ID 切换时，需要重置输入草稿？切勿在 Effect 中调用 <code>setComment(&quot;&quot;)</code>，直接使用 <code>key=&#123;userId&#125;</code> 即可让 React 自动完全重新初始化：
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
          <button
            className={`btn btn-sm ${activeUserId === "User_A" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setActiveUserId("User_A")}
          >
            切换为用户 A (Alice)
          </button>
          <button
            className={`btn btn-sm ${activeUserId === "User_B" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setActiveUserId("User_B")}
          >
            切换为用户 B (Bob)
          </button>
        </div>

        {/* 关键：使用 key 让 React 优雅自动重置 */}
        <CommentForm key={activeUserId} userId={activeUserId} />
      </div>
    </div>
  );
}

export default NotNeedEffectDemo;
