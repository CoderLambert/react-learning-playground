import { useActionState } from "react";
import { useFormStatus } from "react-dom";

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const initialResult = {
  status: "idle",
  message: "尚未提交",
  email: "",
};

async function subscribe(previousState, formData) {
  const email = String(formData.get("email") ?? "").trim();
  await wait(900);

  if (!email.includes("@")) {
    return {
      status: "error",
      message: `“${email || "空值"}” 不是有效邮箱`,
      email,
      attempts: (previousState.attempts ?? 0) + 1,
    };
  }

  return {
    status: "success",
    message: `已为 ${email} 开启 React 学习周报`,
    email,
    attempts: (previousState.attempts ?? 0) + 1,
  };
}

function SubmitArea() {
  const { pending, data } = useFormStatus();
  const submittingEmail = data ? String(data.get("email") ?? "") : "";

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <button className="btn btn-primary" type="submit" disabled={pending}>
        {pending ? "提交中…" : "订阅"}
      </button>
      <small>
        useFormStatus.pending: <strong>{String(pending)}</strong>
        {pending && submittingEmail ? ` · 正在提交 ${submittingEmail}` : ""}
      </small>
    </div>
  );
}

export function ActionStateFormStatusDemo() {
  const [result, submitAction, isPending] = useActionState(subscribe, initialResult);

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title"><span>⏳</span> useActionState + useFormStatus：把 Action 结果与 pending 可视化</h2>
          </div>
          <span className="badge badge-blue">React 19</span>
        </div>
        <p className="demo-desc">
          <code>useActionState</code> 保存 Action 的返回结果并暴露 pending；<code>useFormStatus</code> 则让表单内部的设计系统组件读取最近一次提交状态，无需层层传 props。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">previousState</span>
          <span className="badge badge-gray">FormData</span>
          <span className="badge badge-gray">isPending</span>
          <span className="badge badge-gray">form status</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🎮</span> 异步订阅实验</h3>
          <p className="demo-section-desc">先输入无效邮箱观察已知业务错误，再输入有效邮箱观察 pending → result 的完整状态迁移。</p>
        </div>

        <div className="demo-grid-2">
          <form action={submitAction} style={{ display: "grid", gap: 12 }}>
            <label>
              <span style={{ display: "block", marginBottom: 4 }}>邮箱</span>
              <input className="form-input" name="email" defaultValue="demo" placeholder="you@example.com" />
            </label>
            <SubmitArea />
          </form>

          <div style={{ padding: 16, background: "var(--bg-surface-secondary)", borderRadius: "var(--radius-md)" }}>
            <h4 style={{ marginTop: 0 }}>Action State</h4>
            <pre style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>{JSON.stringify(result, null, 2)}</pre>
            <div className={`demo-alert ${isPending ? "demo-alert-warning" : "demo-alert-tip"}`}>
              <strong>useActionState.isPending: {String(isPending)}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🧠</span> 两个 pending 为什么都存在？</h3>
        </div>
        <div className="demo-alert demo-alert-tip">
          <strong>useActionState：</strong>关注“这个 Action 状态机”的结果与执行状态，适合页面业务逻辑读取。
        </div>
        <div className="demo-alert demo-alert-tip" style={{ marginTop: 10 }}>
          <strong>useFormStatus：</strong>关注“我所在父 form 的提交状态”，适合 SubmitButton、Spinner 等可复用表单子组件。
        </div>
        <div className="demo-alert demo-alert-warning" style={{ marginTop: 10 }}>
          <strong>常见错误：</strong><code>useFormStatus</code> 放在渲染该 <code>&lt;form&gt;</code> 的同一个组件里，并不能读取这个 form；调用 Hook 的组件必须是目标 form 的后代。
        </div>
        <p className="demo-section-desc" style={{ marginTop: 12 }}>
          业务校验失败这类“预期错误”通常作为 Action state 返回并渲染；真正未知的程序异常可以抛出，由最近的 Error Boundary 接管。
        </p>
      </div>
    </div>
  );
}

export default ActionStateFormStatusDemo;