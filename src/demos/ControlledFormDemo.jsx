import { useMemo, useState } from "react";

const initialForm = {
  name: "",
  bio: "",
  role: "frontend",
  newsletter: true,
  contact: "email",
};

export function ControlledFormDemo() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(null);

  const errors = useMemo(() => ({
    name: form.name.trim().length < 2 ? "姓名至少需要 2 个字符" : "",
    bio: form.bio.length > 80 ? "简介不能超过 80 个字符" : "",
  }), [form.name, form.bio]);

  const isValid = !errors.name && !errors.bio;

  function updateField(event) {
    const { name, type, checked, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!isValid) return;
    setSubmitted({ ...form, submittedAt: new Date().toLocaleTimeString() });
  }

  function resetForm() {
    setForm(initialForm);
    setSubmitted(null);
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title"><span>📝</span> Controlled Form：React State 是表单真源</h2>
          </div>
          <span className="badge badge-blue">Forms</span>
        </div>
        <p className="demo-desc">
          受控表单把输入值放进 React State：输入事件请求更新 State，下一次 render 再把 value / checked 写回控件。适合需要实时校验、联动和条件 UI 的表单。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">input / textarea</span>
          <span className="badge badge-gray">select</span>
          <span className="badge badge-gray">checkbox / radio</span>
          <span className="badge badge-gray">validation</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🎮</span> 实时表单实验</h3>
          <p className="demo-section-desc">修改任意字段，观察 State、派生校验结果和最终提交快照如何同步变化。</p>
        </div>

        <div className="demo-grid-2">
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
            <label>
              <span style={{ display: "block", marginBottom: 4 }}>姓名</span>
              <input className="form-input" name="name" value={form.name} onChange={updateField} placeholder="至少 2 个字符" />
              {errors.name && <small style={{ color: "var(--color-danger)" }}>{errors.name}</small>}
            </label>

            <label>
              <span style={{ display: "block", marginBottom: 4 }}>个人简介</span>
              <textarea className="form-input" name="bio" value={form.bio} onChange={updateField} rows={3} />
              <small>{form.bio.length}/80 {errors.bio && `· ${errors.bio}`}</small>
            </label>

            <label>
              <span style={{ display: "block", marginBottom: 4 }}>岗位</span>
              <select className="form-input" name="role" value={form.role} onChange={updateField}>
                <option value="frontend">前端</option>
                <option value="backend">后端</option>
                <option value="product">产品</option>
              </select>
            </label>

            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="checkbox" name="newsletter" checked={form.newsletter} onChange={updateField} />
              接收学习周报
            </label>

            <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
              <legend style={{ marginBottom: 6 }}>首选联系方式</legend>
              {["email", "phone"].map((value) => (
                <label key={value} style={{ marginRight: 16 }}>
                  <input type="radio" name="contact" value={value} checked={form.contact === value} onChange={updateField} /> {value}
                </label>
              ))}
            </fieldset>

            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-primary" type="submit" disabled={!isValid}>提交</button>
              <button className="btn" type="button" onClick={resetForm}>重置</button>
            </div>
          </form>

          <div style={{ padding: 16, background: "var(--bg-surface-secondary)", borderRadius: "var(--radius-md)" }}>
            <h4 style={{ marginTop: 0 }}>可观察数据流</h4>
            <pre style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>{JSON.stringify(form, null, 2)}</pre>
            <div className={`demo-alert ${isValid ? "demo-alert-tip" : "demo-alert-warning"}`}>
              <strong>{isValid ? "✓ 当前表单可提交" : "等待修正校验错误"}</strong>
            </div>
            {submitted && (
              <div style={{ marginTop: 12 }}>
                <strong>最近一次提交快照</strong>
                <pre style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>{JSON.stringify(submitted, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🧠</span> 状态建模边界</h3>
        </div>
        <div className="demo-alert demo-alert-tip">
          <strong>正确：</strong>保存用户真正输入的字段；像 <code>isValid</code>、字符数、错误提示这类可以由当前字段计算出的值直接派生。
        </div>
        <div className="demo-alert demo-alert-warning" style={{ marginTop: 10 }}>
          <strong>反模式：</strong>同时保存 <code>name</code>、<code>nameLength</code>、<code>isNameValid</code> 三份可互相推导的数据，会制造同步成本和矛盾状态。
        </div>
        <p className="demo-section-desc" style={{ marginTop: 12 }}>
          项目边界：小型、强联动表单直接使用受控 State 很清晰；大型表单若每次按键都会导致庞大子树更新，应先拆组件或采用成熟表单方案，而不是机械地把所有字段提升到页面顶层。
        </p>
      </div>
    </div>
  );
}

export default ControlledFormDemo;
