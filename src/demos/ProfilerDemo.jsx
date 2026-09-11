import { Profiler, memo, useCallback, useMemo, useRef, useState } from "react";

const ROWS = Array.from({ length: 1800 }, (_, index) => ({
  id: index + 1,
  label: `Item ${index + 1}`,
}));

function ExpensiveList({ query }) {
  const normalized = query.trim().toLowerCase();
  const visibleRows = ROWS.filter((row) => {
    // 教学用 synthetic workload：让差异更容易被观察，不代表真实业务成本。
    let score = 0;
    for (let i = 0; i < 90; i += 1) score += (row.id * i) % 7;
    return score >= 0 && row.label.toLowerCase().includes(normalized);
  });

  return (
    <div style={{ maxHeight: "180px", overflow: "auto" }}>
      {visibleRows.slice(0, 80).map((row) => (
        <div key={row.id}>{row.label}</div>
      ))}
    </div>
  );
}

const MemoExpensiveList = memo(ExpensiveList);

function formatMs(value) {
  return `${value.toFixed(2)} ms`;
}

export function ProfilerDemo() {
  const [query, setQuery] = useState("");
  const [themeTick, setThemeTick] = useState(0);
  const [memoized, setMemoized] = useState(false);
  const [samples, setSamples] = useState([]);
  const samplesUpdateRef = useRef(false);

  const onRender = useCallback((id, phase, actualDuration, baseDuration, startTime, commitTime) => {
    if (samplesUpdateRef.current) {
      samplesUpdateRef.current = false;
      return;
    }

    samplesUpdateRef.current = true;
    setSamples((current) => [
      {
        id: `${commitTime}-${current.length}`,
        treeId: id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
      },
      ...current,
    ].slice(0, 8));
  }, []);

  const ListComponent = memoized ? MemoExpensiveList : ExpensiveList;
  const latest = samples[0] ?? null;
  const ratio = useMemo(() => {
    if (!latest || latest.baseDuration === 0) return null;
    return latest.actualDuration / latest.baseDuration;
  }, [latest]);

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title"><span>📈</span> Profiler：先测量，再决定是否优化</h2>
          </div>
          <span className="badge badge-purple">性能分析</span>
        </div>
        <p className="demo-desc">
          React 的 <code>&lt;Profiler&gt;</code> 会在被测子树 commit 时回调测量结果。重点不是追求某个固定毫秒数，
          而是比较“这次实际渲染成本”和“整棵子树无优化时的估算成本”，再定位值得优化的更新路径。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">actualDuration</span>
          <span className="badge badge-gray">baseDuration</span>
          <span className="badge badge-gray">commit</span>
          <span className="badge badge-gray">measure first</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🧪</span> 实验：相关更新 vs 无关父级 Render</h3>
          <p className="demo-section-desc">
            输入搜索会改变列表 props；“无关 Render”只改变父组件 State。切换 memo 后，观察无关更新时
            <code>actualDuration</code> 是否明显下降，并与 <code>baseDuration</code> 对照。
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "14px" }}>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索 Item 12"
            style={{ minWidth: "220px" }}
          />
          <button className="btn btn-primary" onClick={() => setThemeTick((value) => value + 1)}>
            无关 Render：{themeTick}
          </button>
          <button className="btn btn-secondary" onClick={() => setMemoized((value) => !value)}>
            当前：{memoized ? "memo 包裹列表" : "普通列表"}
          </button>
        </div>

        <Profiler id="ExpensiveList" onRender={onRender}>
          <ListComponent query={query} />
        </Profiler>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🔎</span> 可观察结果</h3>
        </div>

        {latest ? (
          <div className="demo-alert demo-alert-tip" style={{ marginBottom: "12px" }}>
            <div className="demo-alert-title">最近一次 commit</div>
            <div>phase：<strong>{latest.phase}</strong></div>
            <div>actualDuration：<strong>{formatMs(latest.actualDuration)}</strong></div>
            <div>baseDuration：<strong>{formatMs(latest.baseDuration)}</strong></div>
            <div>
              actual / base：<strong>{ratio === null ? "-" : `${(ratio * 100).toFixed(1)}%`}</strong>
            </div>
          </div>
        ) : null}

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th align="left">phase</th>
                <th align="right">actual</th>
                <th align="right">base</th>
                <th align="right">commitTime</th>
              </tr>
            </thead>
            <tbody>
              {samples.map((sample) => (
                <tr key={sample.id}>
                  <td>{sample.phase}</td>
                  <td align="right">{formatMs(sample.actualDuration)}</td>
                  <td align="right">{formatMs(sample.baseDuration)}</td>
                  <td align="right">{sample.commitTime.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="comparison-container">
        <div className="comparison-card bad">
          <div className="comparison-header bad"><span>❌</span> 先猜，再全局 memo</div>
          <div>看到 Render 次数多就机械加入 memo/useMemo/useCallback，既可能没有收益，也会增加认知成本。</div>
        </div>
        <div className="comparison-card good">
          <div className="comparison-header good"><span>✅</span> 先定位真实瓶颈</div>
          <div>先用 React DevTools Profiler / Performance tracks 找到慢更新和触发原因，再针对数据量、计算或 identity 做优化。</div>
        </div>
      </div>

      <div className="demo-alert demo-alert-tip" style={{ marginTop: "14px" }}>
        <div className="demo-alert-title"><span>📌</span> 真实项目边界</div>
        <div>
          本页为了教学故意制造 CPU 工作，数字会受开发模式、设备、浏览器和 StrictMode 影响，不能当性能基准。
          <code>&lt;Profiler&gt;</code> 适合程序化采样；实际排查优先使用 React DevTools Profiler，并在接近生产的构建和数据规模下复测。
        </div>
      </div>
    </div>
  );
}

export default ProfilerDemo;
