import { useRef, useState } from "react";

const STABLE_FILTER = { status: "active" };
const stableHandler = () => "stable";

export function ReferenceEqualityDemo() {
  const [renderRound, setRenderRound] = useState(1);
  const freshObject = { status: "active" };
  const freshArray = ["react", "performance"];
  const freshHandler = () => "fresh";

  const previousRef = useRef({
    freshObject,
    freshArray,
    freshHandler,
    stableObject: STABLE_FILTER,
    stableHandler,
  });
  const [comparison, setComparison] = useState(null);

  const compareAndRenderAgain = () => {
    const previous = previousRef.current;

    setComparison({
      freshObject: Object.is(previous.freshObject, freshObject),
      freshArray: Object.is(previous.freshArray, freshArray),
      freshHandler: Object.is(previous.freshHandler, freshHandler),
      stableObject: Object.is(previous.stableObject, STABLE_FILTER),
      stableHandler: Object.is(previous.stableHandler, stableHandler),
    });

    previousRef.current = {
      freshObject,
      freshArray,
      freshHandler,
      stableObject: STABLE_FILTER,
      stableHandler,
    };
    setRenderRound((round) => round + 1);
  };

  const rows = comparison
    ? [
        ["组件内对象字面量 {}", comparison.freshObject, "每次 render 创建新对象"],
        ["组件内数组字面量 []", comparison.freshArray, "每次 render 创建新数组"],
        ["组件内箭头函数 () => {}", comparison.freshHandler, "每次 render 创建新函数"],
        ["组件外常量对象", comparison.stableObject, "模块加载时创建一次"],
        ["组件外函数", comparison.stableHandler, "模块加载时创建一次"],
      ]
    : [];

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>🔗</span> Reference Equality：值相同 ≠ 引用相同
            </h2>
          </div>
          <span className="badge badge-purple">性能基础</span>
        </div>

        <p className="demo-desc">
          React 的依赖比较与默认 memo props 比较建立在引用身份之上。对象、数组和函数即使“内容看起来一样”，
          只要重新创建，就不是同一个引用。理解这一点，是学习 <code>memo</code>、<code>useMemo</code>、
          <code>useCallback</code> 和 Effect dependency 的基础。
        </p>

        <div className="demo-meta-tags">
          <span className="badge badge-gray">Object.is</span>
          <span className="badge badge-gray">Object Identity</span>
          <span className="badge badge-gray">Props Stability</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🧪</span> 实验：跨两次 Render 比较引用身份
          </h3>
          <p className="demo-section-desc">
            当前为 Render Round #{renderRound}。点击按钮会先用 <code>Object.is</code> 比较“上一轮保存的引用”和“当前轮引用”，
            再触发下一轮 render。
          </p>
        </div>

        <button className="btn btn-primary" onClick={compareAndRenderAgain}>
          比较引用并触发下一次 Render
        </button>

        {comparison && (
          <div style={{ display: "grid", gap: "8px", marginTop: "16px" }}>
            {rows.map(([name, same, reason]) => (
              <div
                key={name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(180px, 1fr) auto minmax(180px, 1fr)",
                  gap: "12px",
                  alignItems: "center",
                  padding: "10px 12px",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--bg-surface-secondary)",
                }}
              >
                <strong style={{ fontSize: "13px" }}>{name}</strong>
                <span className={`badge ${same ? "badge-green" : "badge-red"}`}>
                  Object.is → {String(same)}
                </span>
                <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>{reason}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🧠</span> 为什么“新引用”会让优化失效
          </h3>
        </div>

        <div className="comparison-container">
          <div className="comparison-card bad">
            <div className="comparison-header bad"><span>❌</span> 看起来一样</div>
            <pre style={{ margin: 0, fontSize: "12px", overflowX: "auto" }}>{`function Parent() {
  return <Child options={{ status: 'active' }} />;
}`}</pre>
            <div style={{ marginTop: "8px", fontSize: "13px" }}>
              每次 Parent render 都会创建新的 <code>options</code> 对象。
            </div>
          </div>

          <div className="comparison-card good">
            <div className="comparison-header good"><span>✅</span> 先判断是否真的需要稳定引用</div>
            <div style={{ fontSize: "13px", lineHeight: 1.7 }}>
              不要为了“引用稳定”自动加入 memoization。只有当下游的 <code>memo</code>、昂贵计算或 Effect dependency
              确实依赖稳定 identity，并且 Profiler 证明存在收益时，再选择合适的优化手段。
            </div>
          </div>
        </div>
      </div>

      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title"><span>📌</span> 项目判断标准</div>
        <div>
          Primitive 通常按值比较；对象、数组、函数按 identity 比较。新引用本身不是 Bug，也不等于性能问题。
          它只有在“引用身份参与某个协议”时才重要，例如 memoized child props、Hook dependency、缓存 key 或外部订阅配置。
        </div>
      </div>
    </div>
  );
}

export default ReferenceEqualityDemo;
