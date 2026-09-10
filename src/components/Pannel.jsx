/**
 * Pannel 面板组件
 * 演示：具名多插槽组件设计模式（header / extra / children）
 * 遵循三态插槽协议：false 显式隐藏、传入值覆盖、undefined 回退默认
 */

export const DefaultPannelHeader = () => {
  return (
    <div style={{ fontWeight: "700", color: "var(--text-main)", fontSize: "14.5px", display: "flex", alignItems: "center", gap: "6px" }}>
      <span>📋</span>
      <span>卡片面板</span>
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
          alert("触发默认 Extra: 查看详情");
        }}
        style={{ color: "var(--color-primary)", fontWeight: "500" }}
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
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-md)",
        backgroundColor: "var(--bg-surface)",
        margin: "12px 0",
        overflow: "hidden",
        boxShadow: "var(--shadow-xs)",
        transition: "box-shadow var(--transition-fast)",
      }}
    >
      {hasTopBar && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 18px",
            borderBottom: "1px solid var(--border-subtle)",
            backgroundColor: "var(--bg-surface-secondary)",
          }}
        >
          <div className="pannel-header">{renderHeader()}</div>
          <div className="pannel-extra">{renderExtra()}</div>
        </div>
      )}

      <div style={{ padding: "18px", color: "var(--text-main)" }} className="pannel-body">
        {children || <span style={{ color: "var(--text-subtle)", fontStyle: "italic" }}>暂无面板内容</span>}
      </div>
    </div>
  );
}

export default Pannel;
