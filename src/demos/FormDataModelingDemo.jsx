import { useState } from "react";

function formDataToObject(formData) {
  return {
    title: String(formData.get("title") ?? ""),
    priority: String(formData.get("priority") ?? "normal"),
    assignees: formData.getAll("assignees").map(String),
    notify: formData.has("notify"),
  };
}

export function FormDataModelingDemo() {
  const [submitted, setSubmitted] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const payload = formDataToObject(formData);
    setSubmitted(payload);
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title"><span>📦</span> FormData：提交时再读取表单快照</h2>
          </div>
          <span className="badge badge-blue">Forms</span>
        </div>
        <p className="demo-desc">
          并非所有表单都需要把每个按键同步进 React State。对于“填写 → 提交”型场景，可以让浏览器持有输入状态，在提交时一次性构造 FormData。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">uncontrolled</span>
          <span className="badge badge-gray">FormData</span>
          <span className="badge badge-gray">get / getAll</span>
          <span className="badge badge-gray">submit snapshot</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🎮</span> 提交快照实验</h3>
          <p className="demo-section-desc">输入过程中 React 不保存字段值；点击提交后才把浏览器表单转换成业务 payload。</p>
        </div>

        <div className="demo-grid-2">
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
            <label>
              <span style={{ display: "block", marginBottom: 4 }}>任务标题</span>
              <input className="form-input" name="title" defaultValue="学习 React FormData" required />
            </label>

            <label>
              <span style={{ display: "block", marginBottom: 4 }}>优先级</span>
              <select className="form-input" name="priority" defaultValue="normal">
                <option value="low">低</option>
                <option value="normal">普通</option>
                <option value="high">高</option>
              </select>
            </label>

            <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
              <legend style={{ marginBottom: 6 }}>协作者（同名字段会产生多个值）</legend>
              {["Alice", "Bob", "Carol"].map((name) => (
                <label key={name} style={{ marginRight: 16 }}>
                  <input type="checkbox" name="assignees" value={name} /> {name}
                </label>
              ))}
            </fieldset>

            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="checkbox" name="notify" defaultChecked />
              提交后通知协作者
            </label>

            <button className="btn btn-primary" type="submit">读取 FormData</button>
          </form>

          <div style={{ padding: 16, background: "var(--bg-surface-secondary)", borderRadius: "var(--radius-md)" }}>
            <h4 style={{ marginTop: 0 }}>可观察数据流</h4>
            <pre style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>{`浏览器维护输入值\n        ↓\nsubmit event\n        ↓\nnew FormData(form)\n        ↓\nget / getAll / has\n        ↓\n业务 payload`}</pre>
            {submitted ? (
              <>
                <strong>最近一次提交快照</strong>
                <pre style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>{JSON.stringify(submitted, null, 2)}</pre>
              </>
            ) : (
              <div className="demo-alert demo-alert-tip">修改表单不会触发这里更新；只有提交时 React 才保存 payload。</div>
            )}
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🧠</span> 状态建模：谁需要实时知道字段值？</h3>
        </div>
        <div className="demo-alert demo-alert-tip">
          <strong>适合 FormData：</strong>搜索框、登录、简单创建表单等主要关心“提交结果”的场景，可以避免为每个字段建立 React State。
        </div>
        <div className="demo-alert demo-alert-warning" style={{ marginTop: 10 }}>
          <strong>不要机械使用非受控：</strong>实时校验、字段联动、即时预览或条件展示需要当前输入值时，受控 State 往往更直接。
        </div>
        <p className="demo-section-desc" style={{ marginTop: 12 }}>
          注意多值字段：<code>formData.get()</code> 只读取一个值；checkbox group、multi-select 等需要使用 <code>getAll()</code>。同时不要直接把 FormData 当最终领域模型，应在提交边界完成字符串、布尔值、数组等类型转换。
        </p>
      </div>
    </div>
  );
}

export default FormDataModelingDemo;