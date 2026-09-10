import { useState } from "react";

export function StateDryDemo() {
  // ==========================================
  // 实验 1：姓名全称衍生计算
  // ==========================================
  const [firstName, setFirstName] = useState("张");
  const [lastName, setLastName] = useState("三丰");
  // ✅ 状态干净：直接在渲染期派生计算，不声明 fullName state，不使用 useEffect
  const fullName = `${firstName} ${lastName}`.trim();

  // ==========================================
  // 实验 2：购物车单一数据源 (Single Source of Truth)
  // ==========================================
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "新鲜红富士苹果 (斤)", price: 8.5, count: 2 },
    { id: 2, name: "进口特级香蕉 (把)", price: 12.0, count: 1 },
    { id: 3, name: "原味高钙纯牛奶 (箱)", price: 45.0, count: 1 },
  ]);

  // ✅ 核心收益：无需维护 totalPrice / totalCount / hasFreeShipping 等 5 个冗余 state
  const totalCount = cartItems.reduce((acc, item) => acc + item.count, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.count, 0);
  const isFreeShipping = totalPrice >= 60;

  const updateCount = (id, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextCount = Math.max(0, item.count + delta);
            return { ...item, count: nextCount };
          }
          return item;
        })
        .filter((item) => item.count > 0),
    );
  };

  // ==========================================
  // 实验 3：选中的商品（存 ID 还是存整条对象副本？）
  // ==========================================
  const [selectedId, setSelectedId] = useState(1);
  // ✅ 仅存 selectedId，通过 .find 动态查找最新对象，防止列表编辑后选中对象数据脱节
  const selectedItem = cartItems.find((i) => i.id === selectedId) || null;

  return (
    <div>
      {/* 头部说明卡片 */}
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>🧪</span> 状态干净原则 (DRY: Don't Repeat Yourself in State)
            </h2>
          </div>
          <span className="badge badge-green">核心心智模型</span>
        </div>
        <p className="demo-desc">
          React 官方核心准则之一：<strong>“永远不要在 State 中存储任何可以根据现有 Props 或 State 衍生计算出的值。”</strong> 冗余 State 不仅会带来额外的 re-render 损耗，还会导致多数据源脱节（Sync Desynchronization）的高危 Bug。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">单一数据源 (Single Source of Truth)</span>
          <span className="badge badge-gray">渲染期派生 (Derived Values during render)</span>
          <span className="badge badge-gray">严禁冗余缓存 (No Redundant State)</span>
        </div>
      </div>

      {/* 案例 1：计算衍生全名 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🔤</span> 案例 1：拼接全称（简单衍生值）
          </h3>
          <p className="demo-section-desc">
            初学者常误用 <code>useState(fullName)</code> 配合 <code>useEffect</code> 同步，造成多余渲染。正确做法：直接在组件内计算！
          </p>
        </div>

        <div className="comparison-container">
          {/* 错误模式 */}
          <div className="comparison-card bad">
            <div className="comparison-header bad">
              <span>❌</span> 反模式：声明冗余 State 并靠 Effect 同步
            </div>
            <pre style={{ margin: 0, padding: "8px", background: "#fef2f2", borderRadius: "4px", fontSize: "12px", overflowX: "auto" }}>
{`// 🔴 错误写法：3 个状态 + 1 个副作用
const [first, setFirst] = useState('');
const [last, setLast] = useState('');
const [fullName, setFullName] = useState('');

useEffect(() => {
  setFullName(first + ' ' + last); // 导致额外的重渲染！
}, [first, last]);`}
            </pre>
          </div>

          {/* 正确模式 */}
          <div className="comparison-card good">
            <div className="comparison-header good">
              <span>✅</span> 干净写法：纯函数渲染期计算
            </div>
            <pre style={{ margin: 0, padding: "8px", background: "#f0fdf4", borderRadius: "4px", fontSize: "12px", overflowX: "auto" }}>
{`// 🟢 干净写法：仅 2 个基础状态
const [first, setFirst] = useState('');
const [last, setLast] = useState('');
// 渲染期直接计算，0 额外状态，0 异步延迟
const fullName = \`\${first} \${last}\`.trim();`}
            </pre>
          </div>
        </div>

        {/* 交互体验 */}
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", padding: "12px", background: "var(--bg-surface-secondary)", borderRadius: "var(--radius-sm)" }}>
          <div>
            <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block" }}>姓氏：</label>
            <input
              type="text"
              className="form-input"
              style={{ width: "100px" }}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block" }}>名字：</label>
            <input
              type="text"
              className="form-input"
              style={{ width: "120px" }}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div style={{ marginLeft: "12px" }}>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", display: "block" }}>派生全名：</span>
            <span style={{ fontSize: "16px", fontWeight: "700", color: "var(--color-primary)" }}>
              {fullName || "（尚未输入）"}
            </span>
          </div>
        </div>
      </div>

      {/* 案例 2：购物车合计统计 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🛒</span> 案例 2：购物车结算清单与总价计算
          </h3>
          <p className="demo-section-desc">
            唯有 <code>cartItems</code> 需要作为状态存储。总件数、总金额、是否包邮等全部实时派生，保证数据永远绝对一致。
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
          {cartItems.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 14px",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-sm)",
                background: selectedId === item.id ? "var(--color-primary-light)" : "var(--bg-surface)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="radio"
                  name="selectedItem"
                  checked={selectedId === item.id}
                  onChange={() => setSelectedId(item.id)}
                  id={`item-${item.id}`}
                  style={{ cursor: "pointer" }}
                />
                <label htmlFor={`item-${item.id}`} style={{ cursor: "pointer", fontSize: "14px", fontWeight: "500" }}>
                  {item.name}
                </label>
                <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>单价: ¥{item.price.toFixed(2)}</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button className="btn btn-secondary btn-sm" onClick={() => updateCount(item.id, -1)}>
                  -
                </button>
                <span style={{ minWidth: "24px", textAlign: "center", fontWeight: "600", fontSize: "14px" }}>
                  {item.count}
                </span>
                <button className="btn btn-secondary btn-sm" onClick={() => updateCount(item.id, 1)}>
                  +
                </button>
                <span style={{ width: "80px", textAlign: "right", fontWeight: "700", color: "var(--color-danger)" }}>
                  ¥{(item.price * item.count).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 结算卡片 */}
        <div
          style={{
            padding: "14px 18px",
            backgroundColor: "var(--bg-surface-secondary)",
            borderRadius: "var(--radius-md)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              选中共 <strong>{totalCount}</strong> 件商品
            </span>
            <span style={{ margin: "0 8px", color: "var(--border-color)" }}>|</span>
            <span className={`badge ${isFreeShipping ? "badge-green" : "badge-amber"}`}>
              {isFreeShipping ? "已享满 ¥60 免费包邮" : `满 ¥60 包邮 (还差 ¥${(60 - totalPrice).toFixed(2)})`}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
            <span style={{ fontSize: "13px" }}>合计应付：</span>
            <span style={{ fontSize: "20px", fontWeight: "800", color: "var(--color-danger)" }}>
              ¥{totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        {/* 案例 3：当前选中项详情展示 */}
        {selectedItem && (
          <div style={{ marginTop: "14px", padding: "10px 14px", background: "var(--bg-surface)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}>
            <span style={{ fontSize: "12px", color: "var(--text-subtle)" }}>
              当前通过 <code>selectedId = {selectedId}</code> 动态查找的商品：
            </span>
            <span style={{ marginLeft: "8px", fontWeight: "600", color: "var(--color-primary)" }}>
              {selectedItem.name}（当前小计 ¥{(selectedItem.price * selectedItem.count).toFixed(2)}）
            </span>
          </div>
        )}
      </div>

      {/* 总结卡片 */}
      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title">
          <span>💡</span> 状态设计的黄金三问
        </div>
        <div>
          每次准备调用 <code>useState</code> 时，先问自己三个问题：
        </div>
        <div style={{ marginTop: "4px" }}>
          1. 该变量是否可以通过现有的 Props 或其他 State 计算出来？如果是，<strong>坚决不建 State</strong>。
        </div>
        <div>
          2. 该变量是否会随时间改变？如果永远不变，可以定义在组件外部或作为纯常量。
        </div>
        <div>
          3. 如果计算开销非常巨大（如几千条数据的复杂过滤），应该使用 <code>useMemo</code> 进行缓存，而不是退回使用 <code>useEffect + setState</code>！
        </div>
      </div>
    </div>
  );
}

export default StateDryDemo;
