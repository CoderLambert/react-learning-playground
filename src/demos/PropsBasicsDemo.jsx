import { useState } from "react";
import { UserCard } from "../components/UserCard";
import { ProductCard } from "../components/ProductCard";

export function PropsBasicsDemo() {
  // 交互式试验状态
  const [userName, setUserName] = useState("张三");
  const [userRole, setUserRole] = useState("前端架构师");
  const [isOnline, setIsOnline] = useState(true);

  const [productPrice, setProductPrice] = useState(99);
  const [productDiscount, setProductDiscount] = useState(0.8);

  const adminData = {
    name: "管理员 Alex",
    role: "超级管理员",
    isOnline: true,
  };

  const item = {
    title: "高品质有机蓝莓",
    price: 36,
    discount: 0.9,
    tags: ["时令优选", "冷链配送"],
  };

  return (
    <div>
      {/* 头部说明卡片 */}
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>📌</span> Props 基础传递、解构与派生计算
            </h2>
          </div>
          <span className="badge badge-blue">单向数据流</span>
        </div>
        <p className="demo-desc">
          Props（属性）是父组件向子组件单向传递的只读输入参数。本 Demo 演示参数解构、默认值回退机制、展开语法（Spread Props）以及如何利用纯函数衍生计算替代多余的 State。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">只读性（Read-only）</span>
          <span className="badge badge-gray">默认值解构（Default Props）</span>
          <span className="badge badge-gray">JSX 展开语法（...props）</span>
          <span className="badge badge-gray">衍生状态（Derived Value）</span>
        </div>
      </div>

      {/* 交互式实验区 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🎮</span> 实时交互试验台
          </h3>
          <p className="demo-section-desc">
            调整输入项，观察子组件如何根据传入的 Props 发生响应式重新渲染：
          </p>
        </div>

        <div className="demo-grid-2">
          {/* 左侧控制器 */}
          <div style={{ padding: "16px", backgroundColor: "var(--bg-surface-secondary)", borderRadius: "var(--radius-md)" }}>
            <h4 style={{ margin: "0 0 12px 0", fontSize: "14px" }}>控制面板（父组件状态）</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>
                  用户姓名：
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>
                  用户角色：
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                <input
                  type="checkbox"
                  id="online-toggle"
                  checked={isOnline}
                  onChange={(e) => setIsOnline(e.target.checked)}
                  style={{ width: "16px", height: "16px", cursor: "pointer" }}
                />
                <label htmlFor="online-toggle" style={{ fontSize: "13px", cursor: "pointer" }}>
                  标记为在线状态 (isOnline)
                </label>
              </div>
            </div>
          </div>

          {/* 右侧渲染结果 */}
          <div>
            <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", color: "var(--text-muted)" }}>
              子组件接收 Props 渲染结果
            </h4>
            <UserCard name={userName || "（空名称）"} role={userRole} isOnline={isOnline} />
          </div>
        </div>
      </div>

      {/* 模块 1：UserCard 基础场景对比 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>👤</span> 用户卡片（UserCard）解构与默认值场景
          </h3>
          <p className="demo-section-desc">
            演示常规显式传参、未传参数自动触发形参默认值（role = "普通成员"），以及展开语法批量入参。
          </p>
        </div>

        <div className="demo-grid-3">
          <div>
            <div style={{ marginBottom: "6px", fontSize: "12px", fontWeight: "600", color: "var(--color-primary)" }}>
              场景 A：显式完整传参
            </div>
            <UserCard name="李雷" role="高级产品经理" isOnline={true} />
          </div>

          <div>
            <div style={{ marginBottom: "6px", fontSize: "12px", fontWeight: "600", color: "var(--color-primary)" }}>
              场景 B：未传 role（默认值生效）
            </div>
            <UserCard name="韩梅梅" isOnline={false} />
          </div>

          <div>
            <div style={{ marginBottom: "6px", fontSize: "12px", fontWeight: "600", color: "var(--color-primary)" }}>
              场景 C：展开语法 `&#123;...adminData&#125;`
            </div>
            <UserCard {...adminData} />
          </div>
        </div>
      </div>

      {/* 模块 2：ProductCard 派生计算与只读性 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🛍️</span> 商品卡片（ProductCard）衍生计算与列表渲染
          </h3>
          <p className="demo-section-desc">
            演示实际折后价 <code>price * discount</code> 衍生计算，严禁在子组件直接修改 <code>props.price</code>！
          </p>
        </div>

        <div style={{ marginBottom: "16px", padding: "12px", backgroundColor: "var(--bg-surface-secondary)", borderRadius: "var(--radius-sm)" }}>
          <div style={{ display: "flex", gap: "24px", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "13px" }}>原价：¥{productPrice}</span>
              <input
                type="range"
                min="10"
                max="300"
                step="5"
                value={productPrice}
                onChange={(e) => setProductPrice(Number(e.target.value))}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "13px" }}>折扣：{productDiscount * 10} 折</span>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.1"
                value={productDiscount}
                onChange={(e) => setProductDiscount(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="demo-grid-3">
          <div>
            <div style={{ marginBottom: "6px", fontSize: "12px", fontWeight: "600", color: "var(--color-success)" }}>
              实时滑块联动商品
            </div>
            <ProductCard
              title="进口阿拉斯加帝王蟹"
              price={productPrice}
              discount={productDiscount}
              tags={["海鲜直达", "热销"]}
            />
          </div>

          <div>
            <div style={{ marginBottom: "6px", fontSize: "12px", fontWeight: "600", color: "var(--color-success)" }}>
              不传 discount（默认为 1）
            </div>
            <ProductCard title="高山特级碧螺春" price={68} tags={["明前茶", "产地直发"]} />
          </div>

          <div>
            <div style={{ marginBottom: "6px", fontSize: "12px", fontWeight: "600", color: "var(--color-success)" }}>
              对象展开 `&#123;...item&#125;`
            </div>
            <ProductCard {...item} />
          </div>
        </div>
      </div>

      {/* 核心总结提示框 */}
      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title">
          <span>💡</span> Props 核心心智模型
        </div>
        <div>
          1. <strong>单向只读性</strong>：Props 永远由父级决定，子组件严禁直接修改入参对象（如 <code>props.price = 99</code> 会违背 React 纯函数规范并可能引发不可预测的副作用）。
        </div>
        <div>
          2. <strong>衍生计算优先</strong>：如果一个值可以通过已有 props/state 简单计算得到，直接在组件函数体内声明局部变量，切忌将其拷贝存入新的 state 中。
        </div>
      </div>
    </div>
  );
}

export default PropsBasicsDemo;
