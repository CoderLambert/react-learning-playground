import { useState } from "react";

const STATES = ["loading", "empty", "error", "success"];

function ResultPanel({ status }) {
  if (status === "loading") {
    return (
      <div className="demo-alert demo-alert-info">
        <div className="demo-alert-title">⏳ Loading</div>
        <div>正在加载订单列表。这里使用 early return，让每个业务分支保持独立。</div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="demo-alert demo-alert-danger">
        <div className="demo-alert-title">⚠️ Error</div>
        <div>请求失败，请稍后重试。错误态不需要和成功态挤在同一层嵌套三元表达式里。</div>
      </div>
    );
  }

  if (status === "empty") {
    return (
      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title">📭 Empty</div>
        <div>当前没有订单。空态是一个独立业务状态，不应该伪装成“成功但数组长度为 0”的隐式分支。</div>
      </div>
    );
  }

  return (
    <div className="demo-alert demo-alert-success">
      <div className="demo-alert-title">✅ Success</div>
      <div>已加载 3 条订单，页面进入正常内容态。</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const isHealthy = status === "success";

  return (
    <span className={isHealthy ? "badge badge-green" : "badge badge-gray"}>
      {isHealthy ? "数据可用" : "等待稳定结果"}
    </span>
  );
}

export function ConditionalRenderingDemo() {
  const [status, setStatus] = useState("loading");
  const [showDebug, setShowDebug] = useState(true);

  const isTerminal = status === "error" || status === "success" || status === "empty";

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>🚦</span> 条件渲染：让业务状态直接映射 UI
            </h2>
          </div>
          <span className="badge badge-blue">UI 分支</span>
        </div>
        <p className="demo-desc">
          React 不提供专门的模板条件语法，而是直接使用 JavaScript 的 <code>if</code>、三元表达式和
          <code>&amp;&amp;</code> 来决定返回哪些 JSX。关键不是记语法，而是让业务状态与 UI 分支保持清晰的一一对应。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">if / early return</span>
          <span className="badge badge-gray">ternary</span>
          <span className="badge badge-gray">&& / null</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">🧪 实验：四态请求 UI</h3>
          <p className="demo-section-desc">
            切换同一份业务状态，观察组件如何选择完全不同的 JSX 分支。
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
          {STATES.map((item) => (
            <button
              key={item}
              className={status === item ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}
              onClick={() => setStatus(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <ResultPanel status={status} />

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginTop: "14px" }}>
          <strong style={{ fontSize: "13px" }}>ternary：</strong>
          <StatusBadge status={status} />
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            {isTerminal ? "当前状态已经有明确结果" : "当前仍处于进行中状态"}
          </span>
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "14px", fontSize: "13px" }}>
          <input type="checkbox" checked={showDebug} onChange={(event) => setShowDebug(event.target.checked)} />
          展示调试信息
        </label>

        {showDebug && (
          <div className="demo-alert demo-alert-info" style={{ marginBottom: 0 }}>
            <div>
              <code>&amp;&amp;</code> 适合表达“条件满足时额外渲染一小段内容”；关闭开关后，这一段 JSX 不会进入返回树。
            </div>
          </div>
        )}
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">🧭 选择哪种写法</h3>
        </div>
        <div style={{ display: "grid", gap: "10px" }}>
          <div className="demo-alert demo-alert-success">
            <div className="demo-alert-title">✅ 推荐</div>
            <div>
              大块互斥业务状态优先使用 <strong>early return / 清晰的 if 分支</strong>；小型二选一内容使用三元表达式；只在“有或没有”时使用 <code>&amp;&amp;</code>。
            </div>
          </div>
          <div className="demo-alert demo-alert-danger">
            <div className="demo-alert-title">⚠️ 常见反模式</div>
            <div>
              把 loading、error、empty、success 塞进多层嵌套三元表达式，会让 JSX 很快失去可读性。复杂分支应提前计算、early return，或拆成职责明确的子组件。
            </div>
          </div>
        </div>
      </div>

      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title">📌 项目边界</div>
        <div>
          条件渲染只负责“当前状态应该显示什么”。不要为了切换 UI 再复制一份状态；例如 <code>isEmpty</code> 能从 <code>items.length</code> 推导时，应直接计算而不是额外保存 State。
        </div>
      </div>
    </div>
  );
}

export default ConditionalRenderingDemo;
