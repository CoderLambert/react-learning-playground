/**
 * 演示：Props 计算派生、默认值、列表渲染与属性展开
 * 
 * 接收 Props：
 * - title（商品名称，默认 "暂无标题"）
 * - price（数字，价格）
 * - discount（数字，折扣比例，默认 1 即不打折）
 * - tags（字符串数组，默认 []）
 */
export function ProductCard({ title = "暂无标题", price, discount = 1, tags = [] }) {
  // 💡 知识点：Props 是只读的，组件应当像纯函数一样，不修改自己的入参。
  // 实际售价通过衍生计算得出，而不是尝试修改 price = price * discount
  const actualPrice = price * discount;

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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <strong style={{ fontSize: "16px", color: "#0f172a" }}>{title}</strong>
        <span style={{ fontSize: "16px", fontWeight: "bold", color: "#e11d48" }}>
          实际售价：¥{actualPrice.toFixed(2)}
        </span>
      </div>

      <div style={{ marginTop: "8px", fontSize: "13px", color: "#64748b" }}>
        <span>原价：¥{price}</span>
        {discount < 1 && (
          <span style={{ marginLeft: "8px", color: "#ea580c" }}>
            (享 {discount * 10} 折优惠)
          </span>
        )}
      </div>

      <div style={{ marginTop: "10px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {tags.map((tag) => (
          <span
            key={tag}
            style={{
              padding: "2px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              backgroundColor: "#f1f5f9",
              color: "#475569",
              border: "1px solid #cbd5e1",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default ProductCard;
