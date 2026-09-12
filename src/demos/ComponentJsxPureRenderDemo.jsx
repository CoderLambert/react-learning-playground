import { useState } from "react";

let impureSequence = 0;

function buildPureDescription(name, count) {
  return `${name} × ${count}`;
}

function buildImpureDescription(name, count) {
  impureSequence += 1;
  return `#${impureSequence} ${name} × ${count}`;
}

function ProductSummary({ name, count }) {
  const totalLabel = count > 1 ? `${count} 件商品` : "1 件商品";

  return (
    <>
      <strong>{name}</strong>
      <span style={{ color: "var(--text-muted)" }}> · {totalLabel}</span>
    </>
  );
}

function ComponentTreeCard({ name, count }) {
  return (
    <div
      style={{
        padding: "16px",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-sm)",
        background: "var(--bg-surface-secondary)",
      }}
    >
      <div style={{ marginBottom: "10px", fontSize: "12px", color: "var(--text-subtle)" }}>
        App → ComponentJsxPureRenderDemo → ComponentTreeCard → ProductSummary
      </div>
      <ProductSummary name={name} count={count} />
    </div>
  );
}

export function ComponentJsxPureRenderDemo() {
  const [productName, setProductName] = useState("React 实战手册");
  const [count, setCount] = useState(2);
  const [runs, setRuns] = useState([]);

  const simulateRepeatedRender = () => {
    const pureFirst = buildPureDescription(productName, count);
    const pureSecond = buildPureDescription(productName, count);
    const impureFirst = buildImpureDescription(productName, count);
    const impureSecond = buildImpureDescription(productName, count);

    setRuns([
      { label: "纯计算 #1", value: pureFirst, stable: true },
      { label: "纯计算 #2", value: pureSecond, stable: true },
      { label: "非纯计算 #1", value: impureFirst, stable: false },
      { label: "非纯计算 #2", value: impureSecond, stable: false },
    ]);
  };

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>🧱</span> Component、JSX 与纯渲染模型
            </h2>
          </div>
          <span className="badge badge-green">React UI 基础</span>
        </div>

        <p className="demo-desc">
          React 组件本质上是描述 UI 的 JavaScript 函数。组件读取 Props、State、Context 等输入，
          返回 JSX 描述；React 假设渲染阶段保持纯净：<strong>相同输入应得到相同的 JSX 结果</strong>，
          并且不能在 render 中修改组件外部已经存在的数据。
        </p>

        <div className="demo-meta-tags">
          <span className="badge badge-gray">Component = UI Building Block</span>
          <span className="badge badge-gray">JSX = UI Description</span>
          <span className="badge badge-gray">Same Input → Same Output</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🌳</span> 实验 1：组件树、JSX 表达式与 Fragment
          </h3>
          <p className="demo-section-desc">
            修改输入，观察 Props 如何沿组件树传递。<code>ProductSummary</code> 使用 Fragment 返回多个并列节点，
            JSX 中的 JavaScript 表达式负责派生显示文本。
          </p>
        </div>

        <div style={{ display: "grid", gap: "14px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            <input
              className="form-input"
              style={{ flex: "1 1 280px" }}
              value={productName}
              onChange={(event) => setProductName(event.target.value)}
              aria-label="商品名称"
            />
            <select
              className="form-input"
              style={{ width: "140px" }}
              value={count}
              onChange={(event) => setCount(Number(event.target.value))}
              aria-label="商品数量"
            >
              <option value={1}>1 件</option>
              <option value={2}>2 件</option>
              <option value={3}>3 件</option>
            </select>
          </div>

          <ComponentTreeCard name={productName || "未命名商品"} count={count} />
        </div>

        <div className="demo-alert demo-alert-info">
          <div className="demo-alert-title">组件树与模块树不是一回事</div>
          <div>
            组件树描述“这次 UI 中谁渲染了谁”；模块树描述 JavaScript 文件之间的 import 依赖。
            一个组件可以被多个组件复用，因此运行时组件树和源码模块结构通常不会一一对应。
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🧪</span> 实验 2：为什么 Render 必须保持纯净
          </h3>
          <p className="demo-section-desc">
            点击按钮模拟 React 可能发生的重复 render。这里不会真的在组件 render 中制造副作用，而是安全地调用两类计算函数，观察相同输入连续执行两次的差异。
          </p>
        </div>

        <button className="btn btn-primary" onClick={simulateRepeatedRender}>
          模拟相同输入重复 Render 两次
        </button>

        {runs.length > 0 && (
          <div className="demo-grid-2" style={{ marginTop: "16px" }}>
            {runs.map((run) => (
              <div
                key={run.label}
                style={{
                  padding: "14px 16px",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--bg-surface-secondary)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                  <strong>{run.label}</strong>
                  <span className={`badge ${run.stable ? "badge-green" : "badge-red"}`}>
                    {run.stable ? "结果稳定" : "结果漂移"}
                  </span>
                </div>
                <code style={{ display: "block", marginTop: "10px" }}>{run.value}</code>
              </div>
            ))}
          </div>
        )}

        <div className="demo-alert demo-alert-tip">
          <div className="demo-alert-title">为什么 React 强调 Purity？</div>
          <div>
            React 在开发环境的 StrictMode 中会额外调用组件函数来帮助发现非纯逻辑；并发渲染也可能暂停、丢弃或重新开始一次 render。
            因此 render 只负责计算 UI。副作用应离开 render：由明确用户动作触发的工作通常放在 Event Handler；需要让当前 UI 与 React 外部系统持续保持同步时再考虑 Effect；数据获取还应结合所用框架或数据层的职责边界判断。
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🏗️</span> 真实项目中的组件边界
          </h3>
        </div>

        <div className="demo-grid-2">
          <div className="demo-alert demo-alert-success" style={{ margin: 0 }}>
            <div className="demo-alert-title">✅ 适合拆成组件</div>
            <div>可复用的 UI 单元、职责明确的业务区块、需要独立维护或测试的交互边界。</div>
          </div>
          <div className="demo-alert demo-alert-danger" style={{ margin: 0 }}>
            <div className="demo-alert-title">⚠️ 避免机械拆分</div>
            <div>不要因为“每个 div 都应该是组件”而制造大量只有一行 JSX、没有独立语义的包装组件。</div>
          </div>
        </div>
      </div>

      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title">
          <span>📌</span> 本章心智模型
        </div>
        <div>
          <strong>Component = 输入 → JSX 描述。</strong> JSX 不是 HTML 字符串，而是 JavaScript 中的 UI 描述语法；
          渲染阶段只做计算，副作用离开 render。只要先守住这条边界，后面的 State、Effect、并发渲染和性能优化都会更容易理解。
        </div>
      </div>
    </div>
  );
}

export default ComponentJsxPureRenderDemo;