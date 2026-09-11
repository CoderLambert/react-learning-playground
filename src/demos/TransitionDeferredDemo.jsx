import { useDeferredValue, useMemo, useState, useTransition } from "react";

const ITEMS = Array.from({ length: 900 }, (_, index) => `React learning item ${index + 1}`);

function ExpensiveResults({ query }) {
  const normalized = query.trim().toLowerCase();
  const results = ITEMS.filter((item) => item.toLowerCase().includes(normalized));

  let checksum = 0;
  for (let i = 0; i < 180000; i += 1) checksum = (checksum + i) % 997;

  return (
    <div>
      <p style={{ fontSize: 12 }}>
        渲染查询：<code>{query || "(empty)"}</code> · 结果 {results.length} · CPU 模拟 checksum {checksum}
      </p>
      <ul>{results.slice(0, 8).map((item) => <li key={item}>{item}</li>)}</ul>
    </div>
  );
}

export function TransitionDeferredDemo() {
  const [tab, setTab] = useState("overview");
  const [visibleTab, setVisibleTab] = useState("overview");
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  const tabContent = useMemo(() => {
    let total = 0;
    for (let i = 0; i < 650000; i += 1) total += i % 11;
    return `${visibleTab} · expensive render checksum ${total}`;
  }, [visibleTab]);

  function selectTab(nextTab) {
    setTab(nextTab);
    startTransition(() => {
      setVisibleTab(nextTab);
    });
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title"><span>🚦</span> Transition 与 Deferred UI：urgent update 先走</h2>
          </div>
          <span className="badge badge-blue">Concurrent UI</span>
        </div>
        <p className="demo-desc">
          Transition 标记“可以在后台完成”的 state update；<code>useDeferredValue</code> 则让某个值的消费 UI 暂时落后。两者都不是定时器。
        </p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🎮</span> useTransition：立即选中 vs 后台内容更新</h3>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["overview", "metrics", "history"].map((name) => (
            <button key={name} type="button" className="btn" aria-pressed={tab === name} onClick={() => selectTab(name)}>{name}</button>
          ))}
        </div>
        <div className={isPending ? "demo-alert demo-alert-warning" : "demo-alert demo-alert-tip"} style={{ marginTop: 12 }}>
          <strong>isPending: {String(isPending)}</strong> · urgent tab = {tab} · committed content = {visibleTab}
        </div>
        <p>{tabContent}</p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🔎</span> useDeferredValue：输入保持即时，结果允许落后</h3>
        </div>
        <label>
          搜索
          <input className="form-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="输入 1、20、react…" />
        </label>
        <div style={{ opacity: isStale ? 0.55 : 1, marginTop: 12 }}>
          <div className="demo-alert">
            input value = <code>{query || "(empty)"}</code> · deferred value = <code>{deferredQuery || "(empty)"}</code> · stale = {String(isStale)}
          </div>
          <ExpensiveResults query={deferredQuery} />
        </div>
      </div>

      <div className="demo-grid-2">
        <div className="demo-alert demo-alert-tip">
          <div className="demo-alert-title">Deferred ≠ debounce</div>
          <p>Deferred 没有固定毫秒延迟，会尽快开始后台 render，且可被更紧急更新打断；它本身也不会减少网络请求。</p>
        </div>
        <div className="demo-alert demo-alert-warning">
          <div className="demo-alert-title">不要把受控 input 自身放进 Transition</div>
          <p>输入框 value 的更新应保持 urgent。把昂贵结果区、页面切换等非紧急更新放到 Transition/Deferred 层。</p>
        </div>
      </div>
    </div>
  );
}

export default TransitionDeferredDemo;
