import { useState } from "react";

export function AccessibilityBasicsDemo() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("尚未提交");

  function submit(event) {
    event.preventDefault();
    setStatus("loading");
    setMessage("正在保存…");

    setTimeout(() => {
      if (!email.includes("@")) {
        setStatus("error");
        setMessage("请输入有效邮箱地址");
        return;
      }
      setStatus("success");
      setMessage(`已保存 ${email}`);
    }, 700);
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title"><span>♿</span> 可访问性基础：语义、名称、键盘与状态反馈</h2>
          </div>
          <span className="badge badge-blue">Accessibility</span>
        </div>
        <p className="demo-desc">
          优先使用原生 HTML 语义，让浏览器先提供键盘、焦点和辅助技术能力；ARIA 用于补足语义，而不是替代原生元素。
        </p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🎮</span> 可访问表单状态实验</h3>
          <p className="demo-section-desc">只用键盘 Tab / Shift+Tab / Enter 完成操作，并观察 loading / error / success 都通过 live region 暴露。</p>
        </div>

        <form noValidate onSubmit={submit} style={{ display: "grid", gap: 12, maxWidth: 520 }}>
          <label htmlFor="a11y-email">邮箱地址</label>
          <input
            id="a11y-email"
            className="form-input"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-describedby="a11y-email-help"
          />
          <small id="a11y-email-help">用于接收 React 学习进度通知。</small>
          <button type="submit" className="btn btn-primary" disabled={status === "loading"}>
            {status === "loading" ? "保存中…" : "保存"}
          </button>
        </form>

        <div
          role={status === "error" ? "alert" : "status"}
          aria-live={status === "error" ? "assertive" : "polite"}
          className={status === "error" ? "demo-alert demo-alert-warning" : "demo-alert demo-alert-tip"}
          style={{ marginTop: 16 }}
        >
          <strong>{message}</strong>
        </div>
      </div>

      <div className="demo-grid-2">
        <div className="demo-alert demo-alert-tip">
          <div className="demo-alert-title">优先原生语义</div>
          <p><code>&lt;button&gt;</code>、<code>&lt;label&gt;</code>、<code>&lt;nav&gt;</code> 等自带语义和交互行为，通常优于 div + role + 自己重写键盘逻辑。</p>
        </div>
        <div className="demo-alert demo-alert-warning">
          <div className="demo-alert-title">ARIA 不改变行为</div>
          <p>给 <code>div role="button"</code> 并不会自动获得 Enter/Space 行为、焦点规则或 disabled 语义；ARIA 主要描述语义状态。</p>
        </div>
      </div>
    </div>
  );
}

export default AccessibilityBasicsDemo;
