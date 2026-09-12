import { useState } from "react";
import { CardContainer } from "../components/CardContainer";
import { ModalLayout } from "../components/ModalLayout";

export function ChildrenSlotDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContentType, setModalContentType] = useState("info"); // 'info' | 'form'
  const [formSubmitted, setFormSubmitted] = useState(false);

  const openModal = (type) => {
    setModalContentType(type);
    setIsModalOpen(true);
    setFormSubmitted(false);
  };

  return (
    <div>
      {/* 头部说明卡片 */}
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>📦</span> Children 默认插槽与组件组合模式
            </h2>
          </div>
          <span className="badge badge-purple">组合优于继承</span>
        </div>
        <p className="demo-desc">
          <code>props.children</code> 接收调用位置传入的 React 节点。容器组件可以负责自己拥有的布局、视觉外壳和关闭交互；
          具体内容及其业务语义由调用者负责。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">默认插槽 (props.children)</span>
          <span className="badge badge-gray">通用布局外壳 (Layout Shell)</span>
          <span className="badge badge-gray">条件渲染 (Conditional Rendering)</span>
        </div>
      </div>

      {/* 场景 1：通用卡片容器 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🗂️</span> 1. 通用卡片容器（CardContainer）的多态复用
          </h3>
          <p className="demo-section-desc">
            同一个卡片外壳组件，通过嵌套不同的子 JSX，既可以承载纯文本与操作按钮，也可以内嵌完整表单：
          </p>
        </div>

        <div className="demo-grid-2">
          {/* 场景 A */}
          <CardContainer
            title="通知公告卡片"
            subtitle="纯展示型内容组合"
            extra={<span className="badge badge-blue">系统</span>}
          >
            <p style={{ margin: "0 0 14px 0", color: "var(--text-muted)", fontSize: "13.5px", lineHeight: "1.6" }}>
              同一个 CardContainer 可以承载说明文本、操作按钮或表单等不同 React 节点；容器不需要读取这些内容的业务字段。
            </p>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => alert("触发了卡片内的自定义按钮逻辑！")}
            >
              了解更多详情
            </button>
          </CardContainer>

          {/* 场景 B */}
          <CardContainer
            title="快速反馈卡片"
            subtitle="内嵌表单控件组合"
            extra={<span className="badge badge-green">可交互</span>}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("已成功提交反馈内容！");
              }}
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>
                  建议或问题：
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="请输入您的宝贵建议..."
                  required
                />
              </div>
              <button type="submit" className="btn btn-success btn-sm">
                立即提交建议
              </button>
            </form>
          </CardContainer>
        </div>
      </div>

      {/* 场景 2：弹窗遮罩与条件渲染 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🪟</span> 2. 模态弹窗外壳（ModalLayout）
          </h3>
          <p className="demo-section-desc">
            弹窗外壳负责它实际实现的背景遮罩、居中定位与 ESC 快捷关闭；弹窗内部的具体 React 节点通过 <code>children</code> 由调用者提供：
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
          <button className="btn btn-primary" onClick={() => openModal("info")}>
            打开提示型弹窗（文本注入）
          </button>
          <button className="btn btn-secondary" onClick={() => openModal("form")}>
            打开登录型弹窗（表单注入）
          </button>
        </div>

        {/* 实际渲染的 Modal */}
        <ModalLayout
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={modalContentType === "info" ? "系统通知" : "快捷用户登录"}
        >
          {modalContentType === "info" ? (
            <div>
              <p style={{ margin: "0 0 16px 0", color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.6" }}>
                这是一个借助 <code>children</code> 传递给 <code>ModalLayout</code> 的简单文本视图。外壳负责居中与 ESC 快捷关闭，内容本身的业务语义仍由调用者拥有。
              </p>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button className="btn btn-primary btn-sm" onClick={() => setIsModalOpen(false)}>
                  好的，已阅读
                </button>
              </div>
            </div>
          ) : (
            <div>
              {formSubmitted ? (
                <div style={{ textAlign: "center", padding: "16px 0" }}>
                  <div style={{ fontSize: "36px", marginBottom: "8px" }}>🎉</div>
                  <h4 style={{ margin: "0 0 6px 0" }}>登录成功！</h4>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 16px 0" }}>
                    弹窗已被成功复用为表单容器。
                  </p>
                  <button className="btn btn-secondary btn-sm" onClick={() => setIsModalOpen(false)}>
                    完成并关闭
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setFormSubmitted(true);
                  }}
                  style={{ display: "flex", flexDirection: "column", gap: "12px" }}
                >
                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>
                      登录邮箱：
                    </label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>
                      登录密码：
                    </label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "8px" }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setIsModalOpen(false)}
                    >
                      取消
                    </button>
                    <button type="submit" className="btn btn-success btn-sm">
                      确认登录
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </ModalLayout>
      </div>

      {/* 总结卡片 */}
      <div className="demo-alert demo-alert-success">
        <div className="demo-alert-title">
          <span>💡</span> 组合模式设计原则
        </div>
        <div>
          当一个组件需要支持多种内部结构时，可以优先考虑组合（Passing Children），避免用大量布尔 props 控制结构分支；
          如果差异只是少量、稳定、语义明确的行为或样式配置，继续使用显式 props 往往更清楚。
        </div>
      </div>
    </div>
  );
}

export default ChildrenSlotDemo;
