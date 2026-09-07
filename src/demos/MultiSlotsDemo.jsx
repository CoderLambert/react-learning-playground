import { useState } from "react";
import { ProductionModal } from "../components/MultySlots";
import { Pannel } from "../components/Pannel";

export function MultiSlotsDemo() {
  const [modalType, setModalType] = useState(null);
  const closeModal = () => setModalType(null);

  const [refreshCount, setRefreshCount] = useState(0);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ marginBottom: "20px" }}>
        <h2>🧩 功能三：具名多插槽客制化设计</h2>
        <p style={{ color: "#475569", lineHeight: "1.6" }}>
          本 Demo 演示工业级组件库中常见的“三态插槽协议”（默认模板 + 局部覆盖 + 显式隐藏）。通过 Props 接收自定义 JSX 节点，实现比单一 <code>children</code> 更高维度的灵活扩展。
        </p>
      </div>

      {/* 核心协议规则卡片 */}
      <div
        style={{
          backgroundColor: "#eff6ff",
          border: "1px solid #bfdbfe",
          borderRadius: "8px",
          padding: "14px 18px",
          marginBottom: "24px",
          color: "#1e40af",
          fontSize: "13px",
          lineHeight: "1.7",
        }}
      >
        <strong>💡 插槽三态渲染判定规范：</strong>
        <ul style={{ margin: "6px 0 0 0", paddingLeft: "20px" }}>
          <li>
            <strong>1. 显式隐藏：</strong><code>slotProp === false</code> → 返回 <code>null</code>，完全不渲染该区域
          </li>
          <li>
            <strong>2. 局部覆盖：</strong><code>slotProp !== undefined</code> → 渲染调用者传入的内容（支持 string、JSX、组件）
          </li>
          <li>
            <strong>3. 回退默认：</strong><code>slotProp === undefined</code> → 自动渲染内置预设的默认模板组件
          </li>
        </ul>
      </div>

      {/* 模块 1：ProductionModal 弹窗展示 */}
      <section style={{ marginBottom: "32px" }}>
        <h3>1. 生产级多插槽模态框（ProductionModal）</h3>
        <p style={{ fontSize: "14px", color: "#64748b" }}>
          具有 <code>title</code>（头部插槽）、<code>footer</code>（底部插槽）与 <code>children</code>（主体插槽）。点击按钮体验不同插槽配置：
        </p>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
          <button
            onClick={() => setModalType("default")}
            style={{
              padding: "8px 14px",
              backgroundColor: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            1. 全默认模板（默认头部+底部）
          </button>

          <button
            onClick={() => setModalType("custom-title")}
            style={{
              padding: "8px 14px",
              backgroundColor: "#dc2626",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            2. 局部覆盖标题（危险红色警告）
          </button>

          <button
            onClick={() => setModalType("custom-footer")}
            style={{
              padding: "8px 14px",
              backgroundColor: "#16a34a",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            3. 局部覆盖底部（单个确认按钮）
          </button>

          <button
            onClick={() => setModalType("no-footer")}
            style={{
              padding: "8px 14px",
              backgroundColor: "#475569",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            4. 显式隐藏底部 (footer=false)
          </button>
        </div>

        {/* 场景 1：完全零配置 */}
        <ProductionModal
          isOpen={modalType === "default"}
          onClose={closeModal}
          onConfirm={() => {
            alert("触发了默认弹窗确认！");
            closeModal();
          }}
        >
          <p>这是零额外配置的通知弹窗，头部标题和底部确认/取消均采用默认模板。</p>
        </ProductionModal>

        {/* 场景 2：局部覆盖 Header */}
        <ProductionModal
          isOpen={modalType === "custom-title"}
          title={<h3 style={{ margin: 0, color: "#dc2626" }}>⚠️ 严重警告：敏感数据操作</h3>}
          onClose={closeModal}
          onConfirm={closeModal}
        >
          <p>该操作将删除所有未保存的历史草稿，且无法撤销！底部仍保留默认确认/取消操作栏。</p>
        </ProductionModal>

        {/* 场景 3：局部覆盖 Footer */}
        <ProductionModal
          isOpen={modalType === "custom-footer"}
          onClose={closeModal}
          footer={
            <div style={{ textAlign: "center" }}>
              <button
                onClick={closeModal}
                style={{
                  background: "#16a34a",
                  color: "#fff",
                  border: "none",
                  padding: "8px 24px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                我知道了，马上体验
              </button>
            </div>
          }
        >
          <p>🎉 恭喜！您的企业版权益已成功开通。</p>
        </ProductionModal>

        {/* 场景 4：显式隐藏 Footer */}
        <ProductionModal
          isOpen={modalType === "no-footer"}
          title="富文本服务协议"
          footer={false}
          onClose={closeModal}
        >
          <p style={{ color: "#64748b", lineHeight: "1.6" }}>
            这是一份纯展示类的协议条款，底部按钮栏通过 <code>footer=&#123;false&#125;</code> 显式隐藏，不会产生任何 DOM 占位。可通过右上角 ✕ 关闭。
          </p>
        </ProductionModal>
      </section>

      {/* 模块 2：Pannel 面板组件展示 */}
      <section style={{ marginBottom: "28px" }}>
        <h3>2. 多插槽卡片面板（Pannel）</h3>
        <p style={{ fontSize: "14px", color: "#64748b" }}>
          具有 <code>header</code>（头部插槽）、<code>extra</code>（右上角操作扩展插槽）与 <code>children</code>（内容主体）。
        </p>

        {/* 场景 A：全默认 */}
        <div style={{ marginBottom: "16px" }}>
          <span style={{ fontSize: "12px", color: "#6366f1", fontWeight: "bold" }}>
            场景 A：全默认（默认标题 + 默认“查看更多”操作）
          </span>
          <Pannel>
            <p style={{ margin: 0 }}>面板主体内容：未传入 header 和 extra，自动回退默认布局。</p>
          </Pannel>
        </div>

        {/* 场景 B：自定义 Header */}
        <div style={{ marginBottom: "16px" }}>
          <span style={{ fontSize: "12px", color: "#6366f1", fontWeight: "bold" }}>
            场景 B：自定义头部标题（保留默认 extra 操作区）
          </span>
          <Pannel header={<span style={{ fontWeight: "bold", color: "#0284c7" }}>📊 数据监控面板</span>}>
            <p style={{ margin: 0 }}>Header 被自定义重写为带图标的标题，右侧 Extra 仍保持默认的“查看更多”。</p>
          </Pannel>
        </div>

        {/* 场景 C：自定义 Header + 自定义 Extra 操作按钮 */}
        <div style={{ marginBottom: "16px" }}>
          <span style={{ fontSize: "12px", color: "#6366f1", fontWeight: "bold" }}>
            场景 C：自定义头部 + 自定义右侧交互操作
          </span>
          <Pannel
            header={<span style={{ fontWeight: "bold", color: "#0f766e" }}>⚡ 实时运行状态</span>}
            extra={
              <button
                onClick={() => setRefreshCount((c) => c + 1)}
                style={{
                  padding: "4px 10px",
                  fontSize: "12px",
                  backgroundColor: "#0f766e",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                🔄 刷新 ({refreshCount})
              </button>
            }
          >
            <p style={{ margin: 0 }}>已成功触发刷新 {refreshCount} 次，插槽内支持完整的事件绑定与状态响应。</p>
          </Pannel>
        </div>

        {/* 场景 D：显式隐藏头部 */}
        <div style={{ marginBottom: "16px" }}>
          <span style={{ fontSize: "12px", color: "#6366f1", fontWeight: "bold" }}>
            场景 D：显式隐藏顶部导航条 (header=false, extra=false)
          </span>
          <Pannel header={false} extra={false}>
            <p style={{ margin: 0, color: "#64748b" }}>
              这是一个无头部栏的纯净内容卡片，顶部栏完全被消除。
            </p>
          </Pannel>
        </div>
      </section>
    </div>
  );
}

export default MultiSlotsDemo;
