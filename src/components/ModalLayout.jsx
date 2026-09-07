/**
 * 演示：children 弹窗遮罩与条件渲染模式
 * 
 * 核心设计思想：
 * 1. 条件渲染：!isOpen 时显式返回 null，避免在页面中生成无意义的不可见 DOM。
 * 2. 内容定制：遮罩与居中结构由组件固化，弹窗内部展示内容通过 {children} 灵活传入。
 */
export function ModalLayout({ isOpen = false, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        backdropFilter: "blur(2px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "480px",
          maxWidth: "90%",
          background: "#ffffff",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {onClose && (
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              background: "transparent",
              border: "none",
              fontSize: "18px",
              color: "#94a3b8",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        )}
        {children}
      </div>
    </div>
  );
}

export default ModalLayout;
