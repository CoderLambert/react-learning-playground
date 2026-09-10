import { useState } from "react";
import { ProductionModal } from "../components/MultySlots";
import { Pannel } from "../components/Pannel";

export function MultiSlotsDemo() {
  const [modalType, setModalType] = useState(null);
  const closeModal = () => setModalType(null);

  const [refreshCount, setRefreshCount] = useState(0);

  return (
    <div>
      {/* 头部说明卡片 */}
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>🧩</span> 具名多插槽客制化设计规范
            </h2>
          </div>
          <span className="badge badge-purple">组件库架构协议</span>
        </div>
        <p className="demo-desc">
          成熟组件库（如 Ant Design、shadcn/ui、MUI）广泛采用“三态插槽协议”（默认模板 + 局部覆盖 + 显式隐藏）。通过 Props 接收自定义 JSX 节点或布尔值，实现比单一 <code>children</code> 更高维度的扩展能力。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">具名插槽（Named Slots via Props）</span>
          <span className="badge badge-gray">三态渲染协议（Tri-state Protocol）</span>
          <span className="badge badge-gray">零额外 DOM 成本</span>
        </div>
      </div>

      {/* 核心协议规则卡片 */}
      <div className="demo-alert demo-alert-info">
        <div className="demo-alert-title">
          <span>📋</span> 工业级三态插槽协议判定规范
        </div>
        <ul style={{ margin: "4px 0 0 0", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "4px" }}>
          <li>
            <strong>1. 显式隐藏：</strong><code>slotProp === false</code> → 返回 <code>null</code>，完全不产生 DOM 占位
          </li>
          <li>
            <strong>2. 局部覆盖：</strong><code>slotProp !== undefined</code> → 渲染调用方传入的内容（支持 string、JSX 或组件）
          </li>
          <li>
            <strong>3. 回退默认：</strong><code>slotProp === undefined</code> → 自动渲染内置预设的默认模板组件
          </li>
        </ul>
      </div>

      {/* 模块 1：ProductionModal 生产级弹窗 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🪟</span> 1. 多插槽模态框（ProductionModal）
          </h3>
          <p className="demo-section-desc">
            支持 <code>title</code>（头部插槽）、<code>footer</code>（底部插槽）与 <code>children</code>（主体插槽）：
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
          <button className="btn btn-primary" onClick={() => setModalType("default")}>
            1. 全默认模板（默认头部+底部）
          </button>
          <button className="btn btn-danger" onClick={() => setModalType("custom-title")}>
            2. 局部覆盖标题（危险红色警告）
          </button>
          <button className="btn btn-success" onClick={() => setModalType("custom-footer")}>
            3. 局部覆盖底部（自定义单个按钮）
          </button>
          <button className="btn btn-secondary" onClick={() => setModalType("no-footer")}>
            4. 显式隐藏底部 (footer=false)
          </button>
        </div>

        {/* 场景 1：全默认 */}
        <ProductionModal
          isOpen={modalType === "default"}
          onClose={closeModal}
          onConfirm={() => {
            alert("触发了默认弹窗确认！");
            closeModal();
          }}
        >
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.6" }}>
            这是零额外配置的通知弹窗，头部标题和底部操作按钮均采用组件库内置默认模板。
          </p>
        </ProductionModal>

        {/* 场景 2：覆盖 Header */}
        <ProductionModal
          isOpen={modalType === "custom-title"}
          title={
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--color-danger)" }}>
              <span>⚠️</span>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700" }}>严重警告：危险操作</h3>
            </div>
          }
          onClose={closeModal}
          onConfirm={closeModal}
        >
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.6" }}>
            该操作将永久删除该项数据，且无法撤销！注意：虽然头部被完全重写，但底部依然保留了内置的确认与取消操作栏。
          </p>
        </ProductionModal>

        {/* 场景 3：覆盖 Footer */}
        <ProductionModal
          isOpen={modalType === "custom-footer"}
          onClose={closeModal}
          footer={
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button className="btn btn-success" onClick={closeModal}>
                🎉 我知道了，立即体验
              </button>
            </div>
          }
        >
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.6" }}>
            恭喜！您的专属权益已成功生效。底部插槽被替换为居中的单项体验按钮。
          </p>
        </ProductionModal>

        {/* 场景 4：隐藏 Footer */}
        <ProductionModal
          isOpen={modalType === "no-footer"}
          title="纯展示性服务协议条款"
          footer={false}
          onClose={closeModal}
        >
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.6" }}>
            通过传入 <code>footer=&#123;false&#125;</code>，组件直接跳过底部操作条的 DOM 生成，适合展示纯文本说明。
          </p>
        </ProductionModal>
      </div>

      {/* 模块 2：Pannel 面板组件 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>📋</span> 2. 多插槽卡片面板（Pannel）
          </h3>
          <p className="demo-section-desc">
            具有 <code>header</code>（左上角标题插槽）、<code>extra</code>（右上角扩展操作插槽）与 <code>children</code>（主体内容）：
          </p>
        </div>

        <div className="demo-grid-2">
          {/* 场景 A */}
          <div>
            <div style={{ marginBottom: "6px", fontSize: "12px", fontWeight: "600", color: "var(--color-primary)" }}>
              场景 A：全默认模板（未传 header 与 extra）
            </div>
            <Pannel>
              <p style={{ margin: 0, fontSize: "13.5px", color: "var(--text-muted)" }}>
                默认标题为“📋 卡片面板”，右上角展示默认的“查看更多 →”。
              </p>
            </Pannel>
          </div>

          {/* 场景 B */}
          <div>
            <div style={{ marginBottom: "6px", fontSize: "12px", fontWeight: "600", color: "var(--color-primary)" }}>
              场景 B：自定义 Header 标题（保留默认 extra）
            </div>
            <Pannel header={<strong style={{ color: "var(--color-primary)" }}>📈 业务实时大盘</strong>}>
              <p style={{ margin: 0, fontSize: "13.5px", color: "var(--text-muted)" }}>
                自定义了左侧标题，右侧 Extra 仍然优雅回退到内置的链接模板。
              </p>
            </Pannel>
          </div>

          {/* 场景 C */}
          <div>
            <div style={{ marginBottom: "6px", fontSize: "12px", fontWeight: "600", color: "var(--color-primary)" }}>
              场景 C：同时自定义 Header 与 Extra 交互
            </div>
            <Pannel
              header={<strong style={{ color: "var(--color-success)" }}>⚡ 实时心跳健康检测</strong>}
              extra={
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => setRefreshCount((c) => c + 1)}
                >
                  🔄 刷新 ({refreshCount})
                </button>
              }
            >
              <p style={{ margin: 0, fontSize: "13.5px", color: "var(--text-muted)" }}>
                插槽内可无缝嵌入受控交互，已点击刷新 {refreshCount} 次。
              </p>
            </Pannel>
          </div>

          {/* 场景 D */}
          <div>
            <div style={{ marginBottom: "6px", fontSize: "12px", fontWeight: "600", color: "var(--color-primary)" }}>
              场景 D：显式隐藏顶部导航条 (header=false, extra=false)
            </div>
            <Pannel header={false} extra={false}>
              <p style={{ margin: 0, fontSize: "13.5px", color: "var(--text-subtle)" }}>
                顶部栏整体被消除，呈现为一张干净的纯内容卡片。
              </p>
            </Pannel>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MultiSlotsDemo;
