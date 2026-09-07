import { useState } from "react";

// 🔴 1. 抽取默认模版：保持主组件纯洁，便于复用与维护
function DefaultModalHeader({ titleText, onClose }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #eee",
        paddingBottom: "8px",
      }}
    >
      <h3 style={{ margin: 0 }}>{titleText || "系统提示"}</h3>
      <button
        onClick={onClose}
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        ✕
      </button>
    </div>
  );
}

function DefaultModalFooter({ onConfirm, onClose }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: "8px",
        paddingTop: "12px",
        borderTop: "1px solid #eee",
      }}
    >
      <button
        onClick={onClose}
        style={{
          padding: "6px 12px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      >
        取消
      </button>
      <button
        onClick={onConfirm}
        style={{
          padding: "6px 12px",
          borderRadius: "4px",
          background: "#1890ff",
          color: "#fff",
          border: "none",
        }}
      >
        确认
      </button>
    </div>
  );
}

// 🟢 2. 通用 Modal 组件设计
export function ProductionModal({
  isOpen,
  onClose,
  onConfirm,
  title, // 具名插槽 1：可传 string | JSX | false
  footer, // 具名插槽 2：可传 JSX | false
  children, // 主插槽：弹窗主体
}) {
  if (!isOpen) return null; // 显式返回 null 避免生成 DOM[cite: 3, 5]

  // 💡 核心渲染逻辑：判断插槽传参
  const renderHeader = () => {
    if (title === false) return null; // 显式隐藏
    if (title !== undefined) return title; // 用户自定义重写
    return <DefaultModalHeader titleText="默认通知" onClose={onClose} />; // 回退默认模版
  };

  const renderFooter = () => {
    if (footer === false) return null; // 显式隐藏
    if (footer !== undefined) return footer; // 用户自定义重写
    return <DefaultModalFooter onConfirm={onConfirm} onClose={onClose} />; // 回退默认模版
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "8px",
          width: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {renderHeader()}
        <div className="modal-body">{children}</div>
        {renderFooter()}
      </div>
    </div>
  );
}

// 🔵 3. 各种消费场景演示
export function MultySlotsModal() {
  const [modalType, setModalType] = useState(null);

  const closeModal = () => setModalType(null);

  return (
    <div style={{ padding: "20px" }}>
      <h2>生产级多插槽 Modal 模式演示</h2>
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => setModalType("default")}>1. 全默认模版</button>
        <button onClick={() => setModalType("custom-title")}>
          2. 局部覆盖标题
        </button>
        <button onClick={() => setModalType("custom-footer")}>
          3. 局部覆盖底部
        </button>
        <button onClick={() => setModalType("no-footer")}>4. 隐藏底部</button>
      </div>

      {/* 场景 1：完全零配置，使用默认 Header 和默认 Footer */}
      <ProductionModal
        isOpen={modalType === "default"}
        onClose={closeModal}
        onConfirm={() => {
          alert("触发默认确认功能");
          closeModal();
        }}
      >
        <p>这是简单的消息提醒，标题和底部均走组件默认样式。</p>
      </ProductionModal>

      {/* 场景 2：局部覆盖 Header，Footer 依然走默认 */}
      <ProductionModal
        isOpen={modalType === "custom-title"}
        title={<h3 style={{ margin: 0, color: "red" }}>⚠️ 严重危险警告</h3>}
        onClose={closeModal}
        onConfirm={closeModal}
      >
        <p>此操作将永久删除数据，且无法恢复！</p>
      </ProductionModal>

      {/* 场景 3：Header 走默认，局部覆盖 Footer（替换为单个“我知道了”按钮） */}
      <ProductionModal
        isOpen={modalType === "custom-footer"}
        onClose={closeModal}
        footer={
          <div style={{ textAlign: "center" }}>
            <button
              onClick={closeModal}
              style={{
                background: "#52c41a",
                color: "#fff",
                border: "none",
                padding: "6px 20px",
                borderRadius: "4px",
              }}
            >
              我知道了
            </button>
          </div>
        }
      >
        <p>您的个人资料已成功更新。</p>
      </ProductionModal>

      {/* 场景 4：显式隐藏 Footer（传入 false） */}
      <ProductionModal
        isOpen={modalType === "no-footer"}
        title="纯展示内容"
        footer={false}
        onClose={closeModal}
      >
        <p>这个弹窗没有底部的按钮栏，适合纯富文本展示。</p>
      </ProductionModal>
    </div>
  );
}
