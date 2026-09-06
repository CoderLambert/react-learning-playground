import { useState } from "react";
// 1. 通用卡片容器组件：只关心外壳样式，不关心内部装什么内容
function CardContainer({ title, children }) {
  return (
    <div
      style={{
        border: "2px solid #333",
        borderRadius: "8px",
        padding: "16px",
        margin: "12px 0",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h3 style={{ marginTop: 0, borderBottom: "1px solid #ddd" }}>{title}</h3>
      {/* 2. 在这里渲染父组件嵌套进来的任意 JSX */}
      <div className="card-body">{children}</div>
    </div>
  );
}

function ModalLayout({ isOpen = false, children }) {
  return isOpen ? (
    <div
      style={{
        position: "fixed",
        right: 0,
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: "black",
        opacity: 0.4,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
      className="modal-container"
    >
      <div
        className="modal-container"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: "620px",
          height: "60%",
          background: "#fff",
          borderRadius: "15px",
        }}
      >
        {children}
      </div>
    </div>
  ) : null;
}

// 3. 父组件：灵活使用 CardContainer 包裹不同的结构
export default function App() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div>
      <h2>组件组合示例</h2>

      {/* 场景 A：嵌套简单的文本与按钮 */}
      <CardContainer title="提示信息">
        <p>这是一段放置在卡片内部的文本内容。</p>
        <button onClick={() => alert("点击了确认")}>确认</button>
      </CardContainer>

      {/* 场景 B：嵌套复杂的结构与表单 */}
      <CardContainer title="用户登录">
        <form onSubmit={(e) => e.preventDefault()}>
          <label>
            账号：
            <input type="text" />
          </label>
          <br />
          <br />
          <button type="submit">登录</button>
        </form>
      </CardContainer>

      <ModalLayout isOpen={isOpen}>
        <button
          className="open-modal"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          登录 modal
        </button>
      </ModalLayout>

      <ModalLayout isOpen={false}>
        <button className="hidden-modal">隐藏 modal</button>
      </ModalLayout>
    </div>
  );
}
