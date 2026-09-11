import { memo, useMemo, useState } from "react";

const PRODUCTS = Array.from({ length: 1200 }, (_, index) => ({
  id: index + 1,
  name: `Product ${index + 1}`,
  price: (index % 37) + 10,
}));

const ProductList = memo(function ProductList({ products }) {
  console.count("ProductList render");
  return (
    <div style={{ maxHeight: "150px", overflow: "auto" }}>
      {products.slice(0, 30).map((product) => (
        <div key={product.id}>{product.name} · ¥{product.price}</div>
      ))}
    </div>
  );
});

function filterProducts(query) {
  const normalized = query.trim().toLowerCase();
  return PRODUCTS.filter((product) => product.name.toLowerCase().includes(normalized));
}

export function ReactCompilerDemo() {
  const [query, setQuery] = useState("");
  const [unrelated, setUnrelated] = useState(0);
  const [manualMemo, setManualMemo] = useState(false);

  const memoizedProducts = useMemo(() => filterProducts(query), [query]);
  const directProducts = filterProducts(query);
  const products = manualMemo ? memoizedProducts : directProducts;

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title"><span>🧠</span> React Compiler：把大量常规 memoization 交给构建期</h2>
          </div>
          <span className="badge badge-purple">React Compiler</span>
        </div>
        <p className="demo-desc">
          React Compiler 是构建期优化工具，会分析遵守 Rules of React 的组件和 Hook，并自动进行大量值、函数与组件级 memoization。
          React 官方文档将它描述为能减少手写 <code>memo</code>、<code>useMemo</code>、<code>useCallback</code> 的需要；
          它不会改变 React 的 State、Props、Context 或纯 Render 数据流规则。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">build-time</span>
          <span className="badge badge-gray">automatic memoization</span>
          <span className="badge badge-gray">Rules of React</span>
          <span className="badge badge-gray">incremental adoption</span>
        </div>
      </div>

      <div className="demo-alert demo-alert-tip" style={{ marginBottom: "14px" }}>
        <div className="demo-alert-title">⚠️ 本仓库当前没有启用 React Compiler</div>
        <div>
          当前 <code>package.json</code> 没有 React Compiler/Babel 插件配置。因此下面实验只展示“没有 Compiler 时手工稳定 identity 的效果”，
          以及启用 Compiler 后应建立的心智模型；不会把本页的手工 memo 结果冒充成 Compiler 实际优化结果。
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🧪</span> 对照实验：手工 memoization 的维护成本</h3>
          <p className="demo-section-desc">
            <code>ProductList</code> 已用 <code>memo</code> 包裹。关闭手工 <code>useMemo</code> 时，每次父级 Render 都创建新数组，
            子组件 memo 因 props identity 改变而失效；开启后，无关父级更新可以复用数组 identity。
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "14px" }}>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索 Product 12"
            style={{ minWidth: "220px" }}
          />
          <button className="btn btn-primary" onClick={() => setUnrelated((value) => value + 1)}>
            无关 Render：{unrelated}
          </button>
          <button className="btn btn-secondary" onClick={() => setManualMemo((value) => !value)}>
            当前：{manualMemo ? "手工 useMemo" : "直接计算新数组"}
          </button>
        </div>

        <ProductList products={products} />
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🔬</span> Compiler 改变的是优化责任，不是数据流规则</h3>
        </div>
        <div className="comparison-container">
          <div className="comparison-card bad">
            <div className="comparison-header bad"><span>❌</span> 错误理解</div>
            <div>
              “有 Compiler 后就不需要理解引用相等、纯 Render、Hook 规则，或者所有手工 memo 都应该立刻删除。”
            </div>
          </div>
          <div className="comparison-card good">
            <div className="comparison-header good"><span>✅</span> 正确理解</div>
            <div>
              Compiler 依赖 Rules of React 做静态分析，并自动承担大量常规 memoization。已有手工 memoization 可以渐进评估；
              对需要明确 identity 契约或经测量确认的热点，仍可以保留有理由的手工优化。
            </div>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🚦</span> "use memo" / "use no memo" 的边界</h3>
        </div>
        <pre style={{ margin: 0, fontSize: "12px", overflowX: "auto" }}>{`function SearchResults() {
  "use memo";      // annotation 模式下用于显式 opt-in；infer 模式下也可强制编译
  // ...
}

function LegacyWidget() {
  "use no memo";   // opt-out；官方定位为调试/兼容迁移的临时逃生口
  // ...
}`}</pre>
        <div className="demo-alert demo-alert-tip" style={{ marginTop: "12px" }}>
          <div>
            默认应优先通过项目级 Compiler 配置决定 compilation mode。<code>"use memo"</code> 在 annotation 模式最有意义；
            <code>"use no memo"</code> 会覆盖编译模式并跳过该函数优化，官方建议谨慎且临时使用，并记录移除原因。
          </div>
        </div>
      </div>

      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title"><span>📌</span> 真实项目边界</div>
        <div>
          采用 Compiler 时，应先保证 Rules of React 与 lint 基线可靠，再用 Profiler 验证真实收益。对第三方库、旧代码和特殊性能热点采用渐进迁移；
          不应因为“用了 Compiler”就机械删除所有已有 memoization，也不应把手写 memoization 继续当成新代码的默认仪式。
        </div>
      </div>
    </div>
  );
}

export default ReactCompilerDemo;
