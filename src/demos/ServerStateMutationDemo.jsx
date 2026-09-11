import { useRef, useState } from "react";

function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    const id = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(id);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}

export function ServerStateMutationDemo() {
  const requestIdRef = useRef(0);
  const abortRef = useRef(null);
  const [result, setResult] = useState("尚未请求");
  const [logs, setLogs] = useState([]);
  const [items, setItems] = useState([{ id: 1, text: "已同步任务" }]);
  const [failNext, setFailNext] = useState(false);
  const [page, setPage] = useState(1);

  function log(message) {
    setLogs((rows) => [...rows.slice(-8), message]);
  }

  async function search(label, delay) {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const requestId = ++requestIdRef.current;
    log(`start #${requestId} ${label} (${delay}ms)`);
    try {
      await wait(delay, controller.signal);
      if (requestId !== requestIdRef.current) {
        log(`ignore stale #${requestId}`);
        return;
      }
      setResult(`${label} · request #${requestId}`);
      log(`commit #${requestId}`);
    } catch (error) {
      if (error.name === "AbortError") log(`abort #${requestId}`);
      else log(`error #${requestId}: ${error.message}`);
    }
  }

  async function optimisticAdd() {
    const temp = { id: `temp-${Date.now()}`, text: "optimistic item", optimistic: true };
    setItems((rows) => [...rows, temp]);
    log("optimistic append");
    await wait(700);
    if (failNext) {
      setItems((rows) => rows.filter((item) => item.id !== temp.id));
      setFailNext(false);
      log("server failed → rollback");
      return;
    }
    setItems((rows) => rows.map((item) => item.id === temp.id ? { ...item, id: Date.now(), optimistic: false } : item));
    log("server success → confirm canonical item");
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top"><h2 className="demo-title"><span>🏎️</span> 请求架构：race、cancellation、pagination、optimistic mutation</h2><span className="badge badge-blue">Server State</span></div>
        <p className="demo-desc">网络请求可能乱序、取消、失败和重试。成熟 Server State 层的价值，是把缓存与请求生命周期集中管理，而不是让每个组件重复拼装 Effect、loading、race guard 和 mutation 回滚逻辑。</p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>⚔️</span> Race + AbortController</h3><p className="demo-section-desc">先发一个慢请求，再立刻发快请求。这个教学实现主动 abort 旧请求；request id 仍作为 stale-result guard，演示“取消底层工作”和“忽略过期结果”是两个相关但不同的防线。</p></div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><button className="btn" onClick={() => search("slow-react", 1600)}>slow 1600ms</button><button className="btn btn-primary" onClick={() => search("fast-query", 400)}>fast 400ms</button><button className="btn" onClick={() => abortRef.current?.abort()}>cancel current</button></div>
        <div className="demo-grid-2" style={{ marginTop: 14 }}><div className="demo-alert demo-alert-tip"><strong>Committed result</strong><p>{result}</p></div><pre style={{ whiteSpace: "pre-wrap" }}>{logs.join("\n")}</pre></div>
        <div className="demo-alert demo-alert-tip" style={{ marginTop: 12 }}><strong>映射到 TanStack Query：</strong>queryFn 会收到 <code>AbortSignal</code>。只有 queryFn/底层请求实际消费这个 signal 时，网络 Promise 才会随取消协作终止；未消费 signal 的未使用 query 默认仍可完成并把结果留在 cache。</div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>📄</span> Pagination 是 query identity 的一部分</h3></div>
        <button className="btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>上一页</button><span style={{ margin: "0 12px" }}>queryKey = ["projects", {'{'} page: {page} {'}'}]</span><button className="btn" onClick={() => setPage((p) => p + 1)}>下一页</button>
        <div className="demo-alert demo-alert-tip" style={{ marginTop: 12 }}>真实查询层应把 page/cursor 纳入 query key。TanStack Query v5 可用 <code>placeholderData: keepPreviousData</code>（或等价 identity function）在新 key 请求期间继续显示上一页成功数据，并通过 <code>isPlaceholderData</code> 区分占位数据。</div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>✨</span> Optimistic mutation：临时 UI → confirm / rollback</h3></div>
        <div style={{ display: "flex", gap: 8 }}><button className="btn btn-primary" onClick={optimisticAdd}>新增 optimistic item</button><button className="btn" aria-pressed={failNext} onClick={() => setFailNext((v) => !v)}>下次请求失败：{String(failNext)}</button></div>
        <div style={{ marginTop: 12, display: "grid", gap: 8 }}>{items.map((item) => <div key={item.id} style={{ padding: 10, border: "1px solid var(--border-color)", borderRadius: 8 }}><strong>{item.text}</strong>{item.optimistic && <span className="badge badge-gray" style={{ marginLeft: 8 }}>pending</span>}</div>)}</div>
      </div>

      <div className="demo-grid-2">
        <div className="demo-alert demo-alert-warning"><strong>反模式</strong><p>每个页面都写 useEffect + fetch + loading + error + ignore flag + retry + cache。代码会快速演化成彼此不一致的数据层。</p></div>
        <div className="demo-alert demo-alert-tip"><strong>TanStack Query 心智</strong><p>query 负责读取与缓存生命周期；mutation 负责写入。成功后常见做法是 invalidate 相关 query 或直接 setQueryData。Optimistic UI 有两条主路：只在单个 UI 中展示时可利用 mutation variables；需要修改共享 cache 时通常在 onMutate 中 cancel 相关 refetch、snapshot 旧值、setQueryData，并在失败时 rollback。</p></div>
      </div>
    </div>
  );
}

export default ServerStateMutationDemo;
