/**
 * ProductCard 组件
 * 演示：Props 派生计算（实际售价）、只读性、列表渲染与展开语法
 */
export function ProductCard({ title = "暂无标题", price = 0, discount = 1, tags = [] }) {
  // 💡 Props 是只读的，组件像纯函数一样，不修改自己的入参
  // 实际售价通过衍生计算得出，无需也不应该把 actualPrice 放入单独的 useState 中
  const actualPrice = price * discount;
  const hasDiscount = discount < 1;

  return (
    <div
      style={{
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-md)",
        padding: "16px",
        backgroundColor: "var(--bg-surface)",
        boxShadow: "var(--shadow-xs)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "12px",
        transition: "all var(--transition-fast)",
      }}
    >
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
          <strong style={{ fontSize: "15px", color: "var(--text-main)", fontWeight: "600" }}>
            {title}
          </strong>
          {hasDiscount && (
            <span className="badge badge-amber" style={{ fontSize: "11px" }}>
              {(discount * 10).toFixed(1).replace(/\.0$/, "")} 折
            </span>
          )}
        </div>

        <div style={{ marginTop: "8px", display: "flex", alignItems: "baseline", gap: "8px" }}>
          <span style={{ fontSize: "18px", fontWeight: "700", color: "var(--color-danger)" }}>
            ¥{actualPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span style={{ fontSize: "12px", color: "var(--text-subtle)", textDecoration: "line-through" }}>
              ¥{price.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {tags.length > 0 && (
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", paddingTop: "8px", borderTop: "1px solid var(--border-subtle)" }}>
          {tags.map((tag) => (
            <span key={tag} className="badge badge-gray" style={{ fontSize: "11px" }}>
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductCard;
