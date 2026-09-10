import { useState } from "react";

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function FormActionDemo() {
  const [events, setEvents] = useState([]);

  function appendEvent(message) {
    setEvents((current) => [message, ...current].slice(0, 6));
  }

  async function publish(formData) {
    const title = String(formData.get("title") ?? "").trim();
    const content = String(formData.get("content") ?? "").trim();

    appendEvent(`publish 开始：${title || "未命名"}`);
    await wait(800);
    appendEvent(`publish 完成：${content.length} 个字符`);
  }

  async function saveDraft(formData) {
    const title = String(formData.get("title") ?? "").trim();

    appendEvent(`draft 开始：${title || "未命名"}`);
    await wait(500);
    appendEvent("draft 保存完成");
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title"><span>⚙️</span> React 19 Form Action：提交就是 Action</h2>
          </div>
          <span className="badge badge-blue">React 19</span>
        </div>
        <p className="demo-desc">
          React 19 允许把函数直接传给 <code>&lt;form action&gt;</code>。提交时 React 把 FormData 传给该函数，并以 Action / Transition 语义处理异步提交。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">action</span>
          <span className="badge badge-gray">formAction</span>
          <span className="badge badge-gray">FormData</span>
          <span className="badge badge-gray">Transition</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🎮</span> 发布 / 保存草稿双 Action</h3>
          <p className="demo-section-desc">默认提交走 publish；“保存草稿”按钮通过 formAction 覆盖父 form 的 action。</p>
        </div>

        <div className="demo-grid-2">
          <form action={publish} style={{ display: "grid", gap: 12 }}>
            <label>
              <span style={{ display: "block", marginBottom: 4 }}>标题</span>
              <input className="form-input" name="title" defaultValue="React 19 Actions" required />
            </label>

            <label>
              <span style={{ display: "block", marginBottom: 4 }}>正文</span>
              <textarea className="form-input" name="content" defaultValue="用一个表单承载多个提交意图。" rows={4} required />
            </label>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn btn-primary" type="submit">发布</button>
              <button className="btn" type="submit" formAction={saveDraft}>保存草稿</button>
            </div>
          </form>

          <div style={{ padding: 16, background: "var(--bg-surface-secondary)", borderRadius: "var(--radius-md)" }}>
            <h4 style={{ marginTop: 0 }}>Action 流程</h4>
            <pre style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>{`submit\n  ↓\nReact 收集 FormData\n  ↓\naction / formAction\n  ↓\n异步 Action 在 Transition 中运行\n  ↓\n成功后非受控字段 reset`}</pre>
            <strong>最近事件</strong>
            {events.length === 0 ? (
              <p className="demo-section-desc">尚未提交。</p>
            ) : (
              <ol style={{ paddingLeft: 20, marginBottom: 0 }}>
                {events.map((event, index) => <li key={`${event}-${index}`}>{event}</li>)}
              </ol>
            )}
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🧠</span> 与 onSubmit 的边界</h3>
        </div>
        <div className="demo-alert demo-alert-tip">
          <strong>Action：</strong>适合 mutation 工作流。React 可以跟踪 pending，错误可进入 Error Boundary，并可与 <code>useActionState</code>、<code>useFormStatus</code>、<code>useOptimistic</code> 组合。
        </div>
        <div className="demo-alert demo-alert-warning" style={{ marginTop: 10 }}>
          <strong>不要混淆：</strong><code>onSubmit</code> 仍然适用于需要直接操作 submit event、调用 <code>preventDefault()</code> 或自行读取表单的场景；函数 action 不是它的语法糖。
        </div>
        <p className="demo-section-desc" style={{ marginTop: 12 }}>
          真实项目中，一个表单可能存在“发布 / 保存草稿 / 送审”等多个 mutation。按钮级 <code>formAction</code> 可以表达不同提交意图，而不必先把“点击了哪个按钮”额外塞进 React State。
        </p>
      </div>
    </div>
  );
}

export default FormActionDemo;