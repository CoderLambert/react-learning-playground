import { memo, useMemo, useState } from "react";

const DATASET = Array.from({ length: 6000 }, (_, index) => ({
  id: index + 1,
  name: `React Item ${index + 1}`,
  score: (index * 37) % 101,
}));

function expensiveFilter(items, query, threshold) {
  const startedAt = performance.now();
  const normalized = query.trim().toLowerCase();

  const result = items.filter((item) => {
    let syntheticWork = 0;
    for (let step = 0; step < 120; step += 1) {
      syntheticWork += (item.id * step) % 17;
    }

    return (
      syntheticWork >= 0 &&
      item.score >= threshold &&
      (!normalized || item.name.toLowerCase().includes(normalized))
    );
  });

  return {
    result,
    duration: performance.now() - startedAt,
  };
}

const ResultSummary = memo(function ResultSummary({ stats }) {
  console.count("ResultSummary render");
  return (
    <div className="demo-alert demo-alert-success">
      <div className="demo-alert-title">📊 结果对象 identity 保持稳定时，memo child 可跳过无关 render</div>
      <div>
        匹配 <strong>{stats.count}</strong> 条；最近一次计算耗时约 <strong>{stats.duration.toFixed(2)} ms</strong>。
      </div>
    </div>
  );
});

export function UseMemoDemo() {
  const [query, setQuery] = useState("");
  const [threshold, setThreshold] = useState(60);
  const [themeTick, setThemeTick] = useState(0);
  const [memoEnabled, setMemoEnabled] = useState(true);

  const directResult = memoEnabled ? null : expensiveFilter(DATASET, query, threshold);
  const memoResult = useMemo(
    () => expensiveFilter(DATASET, query, threshold),
    [query, threshold],
  );
  const activeResult = memoEnabled ? memoResult : directResult;

  const stats = useMemo(
    () => ({ count: activeResult.result.length, duration: activeResult.duration }),
    [activeResult],
  );

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title"><span>🧮</span> useMemo：缓存昂贵计算，而不是缓存一切</h2>
          </div>
          <span className="badge badge-purple">性能优化</span>
        </div>

        <p className="demo-desc">
          <code>useMemo</code> 在依赖未变化时复用上一轮计算结果。它适合已被测量证明昂贵的纯计算，
          也可在确有需要时保持对象 identity；它不是 correctness 工具，也不应包住所有普通表达式。
        </p>

        <div className="demo-meta-tags">
          <span className="badge badge-gray">Expensive Calculation</span>
          <span className="badge badge-gray">Dependencies</span>
          <span className="badge badge-gray">Object.is</span>
          <span className="badge badge-gray">Stable Identity</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🧪</span> 实验：无关 Render 是否重复执行昂贵过滤</h3>
          <p className="demo-section-desc">
            数据集包含 6000 条记录。调整搜索词或阈值会改变真实依赖；点击“无关 Render”只更新与过滤无关的 State。
            切换 memo 开关后对比最近一次计算耗时，并观察 Console 中子组件 render 次数。
          </p>
        </div>

        <div style={{ display: "grid", gap: "12px", marginBottom: "16px" }}>
          <label style={{ display: "grid", gap: "6px" }}>
            <span>搜索</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="例如：React Item 42" />
          </label>

          <label style={{ display: "grid", gap: "6px" }}>
            <span>最低 score：{threshold}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={threshold}
              onChange={(event) => setThreshold(Number(event.target.value))}
            />
          </label>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={() => setThemeTick((value) => value + 1)}>
              无关 Render：{themeTick}
            </button>
            <button className="btn btn-secondary" onClick={() => setMemoEnabled((value) => !value)}>
              useMemo：{memoEnabled ? "开启" : "关闭"}
            </button>
          </div>
        </div>

        <ResultSummary stats={stats} />

        <div style={{ marginTop: "12px", color: "var(--text-muted)", fontSize: "13px", lineHeight: 1.7 }}>
          当前模式：<strong>{memoEnabled ? "缓存计算" : "每次 render 直接计算"}</strong>。
          在开发 StrictMode 下，React 可能额外调用纯计算来帮助发现副作用，因此不要把单次 console 次数当成生产性能结论。
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>⚖️</span> 正确做法 vs 反模式</h3>
        </div>

        <div className="comparison-container">
          <div className="comparison-card bad">
            <div className="comparison-header bad"><span>❌</span> 所有计算都 useMemo</div>
            <pre style={{ margin: 0, fontSize: "12px", overflowX: "auto" }}>{`const fullName = useMemo(
  () => firstName + ' ' + lastName,
  [firstName, lastName]
);`}</pre>
            <div style={{ marginTop: "8px", fontSize: "13px" }}>普通字符串拼接通常远比 memoization 本身更便宜。</div>
          </div>

          <div className="comparison-card good">
            <div className="comparison-header good"><span>✅</span> 已测量的昂贵纯计算</div>
            <pre style={{ margin: 0, fontSize: "12px", overflowX: "auto" }}>{`const visibleRows = useMemo(
  () => filterAndRank(rows, query),
  [rows, query]
);`}</pre>
            <div style={{ marginTop: "8px", fontSize: "13px" }}>依赖不变时跳过真正有成本的重复工作。</div>
          </div>
        </div>
      </div>

      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title"><span>📌</span> 项目边界</div>
        <div>
          优先保证计算纯净和依赖完整，再用 Profiler/Performance 工具确认瓶颈。若只是为了避免 Effect 因对象依赖反复触发，
          通常先尝试把对象移进 Effect 或简化依赖；只有 identity 本身确实是接口契约时，才用 useMemo 保持稳定。
          React Compiler 启用后还会自动处理大量这类 memoization。
        </div>
      </div>
    </div>
  );
}

export default UseMemoDemo;
