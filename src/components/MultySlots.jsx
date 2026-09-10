/**
 * 生产级具名多插槽组件 (ProductionModal)
 * 
 * 核心三态插槽协议设计规范：
 * 1. 显式隐藏：slotProp === false => 返回 null，不渲染该区域，不占用 DOM 结构
 * 2. 局部覆盖：slotProp !== undefined => 渲染调用者传入的内容 (string | JSX | Component)
 * 3. 回退默认：slotProp === undefined => 渲染内置默认预设模板
 */

// 默认模版 1：头部
export function DefaultModalHeader({ titleText = "系统提示", onClose }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 20px",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "var(--text-main)" }}>
        {titleText}
      </h3>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="关闭"
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: "18px",
            color: "var(--text-subtle)",
            padding: "2px",
            lineHeight: 1,
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}

// 默认模版 2：底部操作栏
export function DefaultModalFooter({ onConfirm, onClose, confirmText = "确认", cancelText = "取消" }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: "10px",
        padding: "14px 20px",
        borderTop: "1px solid var(--border-color)",
        backgroundColor: "var(--bg-surface-secondary)",
      }}
    >
      <button className="btn btn-secondary btn-sm" onClick={onClose}>
        {cancelText}
      </button>
      <button className="btn btn-primary btn-sm" onClick={onConfirm}>
        {confirmText}
      </button>
    </div>
  );
}

// 核心多插槽 Modal 组件
export function ProductionModal({
  isOpen,
  onClose,
  onConfirm,
  title, // 具名插槽 1：string | JSX | false
  footer, // 具名插槽 2：JSX | false
  children, // 主插槽：弹窗主体
}) {
  if (!isOpen) return null;

  // 三态插槽判定
  const renderHeader = () => {
    if (title === false) return null;
    if (title !== undefined) {
      // 支持直接传字符串或自定义 JSX
      return typeof title === "string" ? (
        <DefaultModalHeader titleText={title} onClose={onClose} />
      ) : (
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-color)" }}>
          {title}
        </div>
      );
    }
    return <DefaultModalHeader titleText="系统通知" onClose={onClose} />;
  };

  const renderFooter = () => {
    if (footer === false) return null;
    if (footer !== undefined) {
      return (
        <div style={{ padding: "14px 20px", borderTop: "1px solid var(--border-color)" }}>
          {footer}
        </div>
      );
    }
    return <DefaultModalFooter onConfirm={onConfirm} onClose={onClose} />;
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.5)",
        backdropFilter: "blur(4px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "460px",
          maxWidth: "100%",
          backgroundColor: "var(--bg-surface)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-xl)",
          border: "1px solid var(--border-color)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {renderHeader()}
        <div style={{ padding: "20px" }}>{children}</div>
        {renderFooter()}
      </div>
    </div>
  );
}

export default ProductionModal;
