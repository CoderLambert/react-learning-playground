import { UserCard } from "../components/UserCard";
import { ProductCard } from "../components/ProductCard";

export function PropsBasicsDemo() {
  const adminData = {
    name: "管理员 Alex",
    role: "超级管理员",
    isOnline: true,
  };

  const item = {
    title: "进口香蕉",
    price: 5.5,
    tags: ["热销", "新鲜水果"],
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ marginBottom: "20px" }}>
        <h2>📌 功能一：Props 基础传递与赋值解构</h2>
        <p style={{ color: "#475569", lineHeight: "1.6" }}>
          本 Demo 演示 Props 的核心用法：作为父传子的单向只读数据通道，支持基础类型、默认值解构、对象展开批量传递以及派生计算。
        </p>
      </div>

      <section style={{ marginBottom: "28px" }}>
        <h3>1. 用户卡片示例（UserCard）</h3>
        <p style={{ fontSize: "14px", color: "#64748b" }}>
          演示：基础类型传递、参数默认值回退、对象解构与展开语法。
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" }}>
          <div>
            <span style={{ fontSize: "12px", color: "#6366f1", fontWeight: "bold" }}>场景 A：显式传参</span>
            <UserCard name="张三" role="前端工程师" isOnline={true} />
          </div>

          <div>
            <span style={{ fontSize: "12px", color: "#6366f1", fontWeight: "bold" }}>场景 B：未传 role（触发默认值）</span>
            <UserCard name="李四" isOnline={false} />
          </div>

          <div>
            <span style={{ fontSize: "12px", color: "#6366f1", fontWeight: "bold" }}>场景 C：展开语法 `&#123;...adminData&#125;`</span>
            <UserCard {...adminData} />
          </div>
        </div>
      </section>

      <section style={{ marginBottom: "28px" }}>
        <h3>2. 商品卡片示例（ProductCard）</h3>
        <p style={{ fontSize: "14px", color: "#64748b" }}>
          演示：折扣计算（派生状态）、标签数组 `.map()` 渲染、属性展开与只读性。
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" }}>
          <div>
            <span style={{ fontSize: "12px", color: "#0ea5e9", fontWeight: "bold" }}>商品 1：完整入参（打折 + 标签）</span>
            <ProductCard
              title="红富士苹果"
              price={20}
              discount={0.8}
              tags={["生鲜精选", "秒杀"]}
            />
          </div>

          <div>
            <span style={{ fontSize: "12px", color: "#0ea5e9", fontWeight: "bold" }}>商品 2：默认折扣（不传 discount 默认为 1）</span>
            <ProductCard title="高山绿茶" price={38} tags={["包邮", "春茶"]} />
          </div>

          <div>
            <span style={{ fontSize: "12px", color: "#0ea5e9", fontWeight: "bold" }}>商品 3：对象展开 `&#123;...item&#125;`</span>
            <ProductCard {...item} />
          </div>
        </div>
      </section>

      <div
        style={{
          padding: "12px 16px",
          backgroundColor: "#fef3c7",
          borderRadius: "8px",
          border: "1px solid #fde68a",
          color: "#92400e",
          fontSize: "13px",
          lineHeight: "1.6",
        }}
      >
        <strong>💡 核心总结：</strong>
        <br />
        Props 是只读的（纯函数理念）。严禁在子组件内部直接修改 props 参数（如 <code>props.price = 999</code> 会被 React 冻结或破坏单向数据流）。如需计算，请使用局部变量或者派生值。
      </div>
    </div>
  );
}

export default PropsBasicsDemo;
