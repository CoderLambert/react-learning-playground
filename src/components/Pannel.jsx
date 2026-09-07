/**
 * 演示：具名多插槽组件设计模式（Panel 面板）
 * 
 * 核心三态插槽协议：
 * 1. 显式隐藏：prop === false => 返回 null，不渲染该插槽
 * 2. 局部覆盖：prop !== undefined => 渲染调用者传入的自定义 JSX / 内容
 * 3. 回退默认：prop === undefined => 渲染组件内预设的默认模板
 */

export const DefaultPannelHeader = () => {
  return (
    <div
      style={{
        fontWeight: "bold",
        color: "#1e293b",
        fontSize: "15px",
      }}
    >
      📋 卡片面板
    </div>
  );
};

export const DefaultPannelExtra = () => {
  return (
    <div style={{ fontSize: "13px" }}>
      <a
        href="#more"
        onClick={(e) => {
          e.preventDefault();
          alert("点击了默认 Extra: 查看更多");
        }}
        style={{ color: "#2563eb", textDecoration: "none" }}
      >
        查看更多 →
      </a>
    </div>
  );
};

export function Pannel({ header, extra, children }) {
  function renderHeader() {
    if (header === false) return null;
    if (header !== undefined) return header;
    return <DefaultPannelHeader />;
  }

  function renderExtra() {
    if (extra === false) return null;
    if (extra !== undefined) return extra;
    return <DefaultPannelExtra />;
  }

  const hasTopBar = header !== false || extra !== false;

  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        backgroundColor: "#ffffff",
        margin: "12px 0",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      {hasTopBar && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 16px",
            borderBottom: "1px solid #f1f5f9",
            backgroundColor: "#f8fafc",
          }}
        >
          <div className="pannel-header">{renderHeader()}</div>
          <div className="pannel-extra">{renderExtra()}</div>
        </div>
      )}

      <div style={{ padding: "16px", color: "#334155" }} className="pannel-body">
        {children || <span style={{ color: "#94a3b8", fontStyle: "italic" }}>暂无面板主体内容</span>}
      </div>
    </div>
  );
}

export default Pannel;
