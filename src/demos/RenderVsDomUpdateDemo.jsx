import { useEffect, useRef, useState } from "react";

function RenderedPreview({ label }) {
  const observedNodeRef = useRef(null);
  const renderCountRef = useRef(0);
  const [domMutationCount, setDomMutationCount] = useState(0);

  renderCountRef.current += 1;

  useEffect(() => {
    const node = observedNodeRef.current;
    if (!node || typeof MutationObserver === "undefined") return undefined;

    const observer = new MutationObserver((records) => {
      const textMutations = records.filter(
        (record) => record.type === "characterData" || record.type === "childList",
      ).length;

      if (textMutations > 0) {
        setDomMutationCount((count) => count + textMutations);
      }
    });

    observer.observe(node, {
      childList: true,
      characterData: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      style={{
        display: "grid",
        gap: "12px",
        padding: "16px",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-sm)",
        background: "var(--bg-surface-secondary)",
      }}
    >
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <span className="badge badge-blue">组件执行次数：{renderCountRef.current}</span>
        <span className="badge badge-green">目标 DOM mutation：{domMutationCount}</span>
      </div>

      <div>
        <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px" }}>
          MutationObserver 只观察下面这个真实 DOM 节点：
        </div>
        <strong
          ref={observedNodeRef}
          style={{
            display: "inline-block",
            padding: "8px 12px",
            borderRadius: "var(--radius-xs)",
            background: "var(--bg-surface)",
            border: "1px solid var(--border-color)",
          }}
        >
          {label}
        </strong>
      </div>

      <div className="demo-alert demo-alert-info" style={{ margin: 0 }}>
        开发环境启用 Strict Mode 时，React 可能额外调用组件来帮助发现不纯渲染，因此这里的组件执行次数可能比一次交互增加更多；它仍然是在组件函数执行点采集的真实计数，而不是事件 handler 手工推算。
      </div>
    </div>
  );
}

export function RenderVsDomUpdateDemo() {
  const [label, setLabel] = useState("稳定的 DOM 内容");
  const [unrelated, setUnrelated] = useState(0);

  const triggerUnrelatedUpdate = () => {
    setUnrelated((value) => value + 1);
  };

  const changeDomContent = () => {
    setLabel((current) =>
      current === "稳定的 DOM 内容" ? "DOM 内容真的改变了" : "稳定的 DOM 内容",
    );
  };

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>⚙️</span> Re-render ≠ DOM Update
            </h2>
          </div>
          <span className="badge badge-green">性能心智模型</span>
        </div>

        <p className="demo-desc">
          React 的 render 是“调用组件并计算下一份 UI 描述”；commit 才负责把必要差异写入 DOM。
          因此组件重新执行，并不意味着对应 DOM 节点一定发生修改。
        </p>

        <div className="demo-meta-tags">
          <span className="badge badge-gray">Trigger → Render → Commit</span>
          <span className="badge badge-gray">Minimal DOM Mutation</span>
          <span className="badge badge-gray">不要看到 re-render 就 memo</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🧪</span> 实验：触发 Render，但保持目标 DOM 内容不变
          </h3>
          <p className="demo-section-desc">
            “无关 State 更新”会让当前组件树再次执行 render，但传给目标节点的 <code>label</code>
            没变。比较组件函数执行次数与目标 DOM mutation；再点击“修改 DOM 内容”进行对照。
          </p>
        </div>

        <div style={{ display: "grid", gap: "14px" }}>
          <RenderedPreview label={label} />

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={triggerUnrelatedUpdate}>
              更新无关 State（当前 {unrelated}）
            </button>
            <button className="btn btn-secondary" onClick={changeDomContent}>
              修改目标 DOM 内容
            </button>
          </div>

          <div className="demo-alert demo-alert-info" style={{ margin: 0 }}>
            <div className="demo-alert-title">观察结论</div>
            <div>
              点击无关更新时，组件函数会再次执行，但目标节点文本没有变化，因此 React
              没必要改写这个节点。只有 <code>label</code> 真正改变时，MutationObserver 才会观察到对应 DOM mutation。
            </div>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🧭</span> 为什么这对性能优化很重要
          </h3>
        </div>

        <div className="comparison-container">
          <div className="comparison-card bad">
            <div className="comparison-header bad">
              <span>❌</span> 错误判断
            </div>
            <div style={{ fontSize: "13px", lineHeight: 1.7 }}>
              DevTools 看到组件 re-render → 立刻给所有组件加 <code>memo</code>、<code>useMemo</code>、
              <code>useCallback</code>。
            </div>
          </div>

          <div className="comparison-card good">
            <div className="comparison-header good">
              <span>✅</span> 正确流程
            </div>
            <div style={{ fontSize: "13px", lineHeight: 1.7 }}>
              先判断交互是否真的慢 → 用 Profiler 找到昂贵 render → 再判断 memoization 是否能减少实际工作量。
            </div>
          </div>
        </div>
      </div>

      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title">
          <span>📌</span> 项目边界
        </div>
        <div>
          普通父子组件重新 render 通常不是问题。大型表格、复杂图表、富文本编辑器包装层等出现可测量的 render
          开销时，才值得继续进入 <code>memo</code>、引用稳定性和 Profiler。React Compiler 启用后还会自动承担大量 memoization 工作。
        </div>
      </div>
    </div>
  );
}

export default RenderVsDomUpdateDemo;
