/**
 * 演示：children 基础插槽与容器组件模式
 * 
 * 核心设计思想：
 * 容器组件只关心外壳布局、边框与样式，不关心具体内容；
 * 内部通过 {children} 渲染调用者传入的任意 JSX 结构。
 */
export function CardContainer({ title, children }) {
  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        padding: "16px",
        margin: "12px 0",
        backgroundColor: "#ffffff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      {title && (
        <h3
          style={{
            margin: "0 0 12px 0",
            paddingBottom: "8px",
            borderBottom: "1px solid #f1f5f9",
            color: "#1e293b",
            fontSize: "16px",
          }}
        >
          {title}
        </h3>
      )}
      <div className="card-body">{children}</div>
    </div>
  );
}

export default CardContainer;
