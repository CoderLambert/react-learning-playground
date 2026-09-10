import { useEffect } from "react";

/**
 * ModalLayout 弹窗外壳组件
 * 演示：children 弹窗遮罩、条件渲染与副作用键盘监听闭环
 */
export function ModalLayout({ isOpen = false, onClose, title, children }) {
  // 监听 ESC 键自动关闭弹窗
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
        animation: "fadeIn 0.15s ease",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "500px",
          maxWidth: "100%",
          backgroundColor: "var(--bg-surface)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-xl)",
          border: "1px solid var(--border-color)",
          overflow: "hidden",
          position: "relative",
          animation: "scaleUp 0.15s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部标题与关闭按钮 */}
        {(title || onClose) && (
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid var(--border-color)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "var(--text-main)" }}>
              {title || "提示"}
            </h3>
            {onClose && (
              <button
                onClick={onClose}
                aria-label="关闭弹窗"
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "18px",
                  lineHeight: 1,
                  color: "var(--text-subtle)",
                  cursor: "pointer",
                  padding: "4px",
                  borderRadius: "var(--radius-xs)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "color var(--transition-fast)",
                }}
              >
                ✕
              </button>
            )}
          </div>
        )}

        <div style={{ padding: "20px" }}>{children}</div>
      </div>
    </div>
  );
}

export default ModalLayout;
