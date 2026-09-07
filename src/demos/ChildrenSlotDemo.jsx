import { useState } from "react";
import { CardContainer } from "../components/CardContainer";
import { ModalLayout } from "../components/ModalLayout";

export function ChildrenSlotDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContentType, setModalContentType] = useState("info"); // 'info' | 'login'

  const openModal = (type) => {
    setModalContentType(type);
    setIsModalOpen(true);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ marginBottom: "20px" }}>
        <h2>📦 功能二：Children 默认插槽与组件组合</h2>
        <p style={{ color: "#475569", lineHeight: "1.6" }}>
          本 Demo 演示通过 React 内置的 <code>children</code> 属性实现组件组合模式（Composition）。容器组件专注布局与结构复用，内部具体内容完全交由调用方定制。
        </p>
      </div>

      {/* 场景 1：CardContainer 组合不同结构 */}
      <section style={{ marginBottom: "28px" }}>
        <h3>1. 通用卡片容器（CardContainer）</h3>
        <p style={{ fontSize: "14px", color: "#64748b" }}>
          同一个卡片容器组件，根据嵌套的 JSX 子节点不同，呈现完全不同的功能形态。
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          {/* 场景 A：嵌套简单的文本与按钮 */}
          <CardContainer title="提示信息卡片">
            <p style={{ margin: "0 0 12px 0", color: "#475569" }}>
              这是一段放置在卡片内部的文本内容，说明文字可以通过标签直接传递。
            </p>
            <button
              onClick={() => alert("点击了卡片内部确认按钮")}
              style={{
                padding: "6px 14px",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              确认操作
            </button>
          </CardContainer>

          {/* 场景 B：嵌套复杂表单结构 */}
          <CardContainer title="用户登录表单">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("触发了表单提交事件");
              }}
            >
              <div style={{ marginBottom: "10px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#334155", marginBottom: "4px" }}>
                  账号：
                </label>
                <input
                  type="text"
                  placeholder="请输入账号"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "6px 8px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "4px",
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  padding: "6px 14px",
                  backgroundColor: "#059669",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                立即登录
              </button>
            </form>
          </CardContainer>
        </div>
      </section>

      {/* 场景 2：ModalLayout 遮罩弹窗 */}
      <section style={{ marginBottom: "28px" }}>
        <h3>2. 基础弹窗布局（ModalLayout）</h3>
        <p style={{ fontSize: "14px", color: "#64748b" }}>
          利用 <code>children</code> 承载弹窗主体内容，结合条件渲染（<code>isOpen ? ... : null</code>）控制弹窗显隐。
        </p>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            onClick={() => openModal("info")}
            style={{
              padding: "8px 16px",
              backgroundColor: "#4f46e5",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            打开简单通知弹窗
          </button>

          <button
            onClick={() => openModal("login")}
            style={{
              padding: "8px 16px",
              backgroundColor: "#0d9488",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            打开弹窗内嵌表单
          </button>
        </div>

        {/* 交互式弹窗 */}
        <ModalLayout isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          {modalContentType === "info" ? (
            <div>
              <h3 style={{ marginTop: 0, color: "#1e293b" }}>系统提示</h3>
              <p style={{ color: "#475569", lineHeight: "1.5" }}>
                这是一个使用 <code>children</code> 注入弹窗主体的简单示例，背景遮罩与居中行为由 <code>ModalLayout</code> 封装统一管理。
              </p>
              <div style={{ textAlign: "right", marginTop: "16px" }}>
                <button
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: "6px 14px",
                    backgroundColor: "#e2e8f0",
                    color: "#334155",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  关闭
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3 style={{ marginTop: 0, color: "#1e293b" }}>快捷登录</h3>
              <div style={{ margin: "12px 0" }}>
                <input
                  type="text"
                  placeholder="手机号 / 邮箱"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "8px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "4px",
                    marginBottom: "10px",
                  }}
                />
                <input
                  type="password"
                  placeholder="密码"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "8px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "4px",
                  }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <button
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#f1f5f9",
                    border: "1px solid #cbd5e1",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    alert("登录成功！");
                    setIsModalOpen(false);
                  }}
                  style={{
                    padding: "6px 14px",
                    backgroundColor: "#0d9488",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  确认登录
                </button>
              </div>
            </div>
          )}
        </ModalLayout>
      </section>

      <div
        style={{
          padding: "12px 16px",
          backgroundColor: "#f0fdf4",
          borderRadius: "8px",
          border: "1px solid #bbf7d0",
          color: "#166534",
          fontSize: "13px",
          lineHeight: "1.6",
        }}
      >
        <strong>💡 核心总结：</strong>
        <br />
        <code>props.children</code> 是 React 实现组件复用与组合（Composition vs Inheritance）的基石。对于结构类似但内部内容多样的场景（如卡片、模态框、布局外壳），优先使用组合模式。
      </div>
    </div>
  );
}

export default ChildrenSlotDemo;
