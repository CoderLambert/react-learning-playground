/**
 * CardContainer 容器组件
 * 演示：children 基础默认插槽与组件组合模式 (Composition)
 * 容器只负责结构包装、边框阴影与标题外壳，内部具体内容完全交由调用方定制
 */
export function CardContainer({ title, subtitle, extra, children }) {
  return (
    <div
      style={{
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-md)",
        backgroundColor: "var(--bg-surface)",
        boxShadow: "var(--shadow-xs)",
        overflow: "hidden",
        transition: "box-shadow var(--transition-fast)",
      }}
    >
      {(title || extra) && (
        <div
          style={{
            padding: "14px 18px",
            borderBottom: "1px solid var(--border-subtle)",
            backgroundColor: "var(--bg-surface-secondary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            {title && (
              <h4 style={{ margin: 0, fontSize: "15px", color: "var(--text-main)", fontWeight: "600" }}>
                {title}
              </h4>
            )}
            {subtitle && (
              <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "var(--text-subtle)" }}>
                {subtitle}
              </p>
            )}
          </div>
          {extra && <div>{extra}</div>}
        </div>
      )}
      <div style={{ padding: "18px" }}>{children}</div>
    </div>
  );
}

export default CardContainer;
