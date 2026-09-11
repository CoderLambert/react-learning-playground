import { useMemo, useRef, useState } from "react";

const USERS = {
  ada: { id: "ada", name: "Ada", role: "Frontend" },
  lin: { id: "lin", name: "Lin", role: "Product" },
};

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchUser(id) {
  await wait(700);
  return { ...USERS[id], fetchedAt: Date.now() };
}

export function ServerStateCacheDemo() {
  const cacheRef = useRef(new Map());
  const inFlightRef = useRef(new Map());
  const [userId, setUserId] = useState("ada");
  const [view, setView] = useState({ status: "idle", data: null, source: "—" });
  const [staleMs, setStaleMs] = useState(3000);
  const [requestCount, setRequestCount] = useState(0);

  const cacheRows = useMemo(() => Array.from(cacheRef.current.entries()).map(([key, entry]) => ({ key, age: Date.now() - entry.cachedAt, name: entry.data.name })), [view]);

  async function load(id, { force = false } = {}) {
    setUserId(id);
    const key = `user:${id}`;
    const cached = cacheRef.current.get(key);
    const fresh = cached && Date.now() - cached.cachedAt < staleMs;

    if (!force && fresh) {
      setView({ status: "success", data: cached.data, source: "fresh cache" });
      return;
    }

    if (!force && inFlightRef.current.has(key)) {
      setView((current) => ({ ...current, status: "loading", source: "deduped: reuse in-flight promise" }));
      const data = await inFlightRef.current.get(key);
      setView({ status: "success", data, source: "shared in-flight result" });
      return;
    }

    if (cached) setView({ status: "loading", data: cached.data, source: "stale cache shown while refetching" });
    else setView({ status: "loading", data: null, source: "network" });

    const promise = fetchUser(id);
    inFlightRef.current.set(key, promise);
    setRequestCount((count) => count + 1);
    try {
      const data = await promise;
      cacheRef.current.set(key, { data, cachedAt: Date.now() });
      setView({ status: "success", data, source: "network → cache" });
    } finally {
      inFlightRef.current.delete(key);
    }
  }

  function invalidate() {
    const key = `user:${userId}`;
    const entry = cacheRef.current.get(key);
    if (entry) cacheRef.current.set(key, { ...entry, cachedAt: 0 });
    setView((current) => ({ ...current, source: "invalidated: next read is stale" }));
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top"><h2 className="demo-title"><span>🗄️</span> Server State：cache、stale、refetch、dedupe</h2><span className="badge badge-blue">Chapter 09</span></div>
        <p className="demo-desc">Server State 不是“后端返回后塞进 useState”这么简单。它有远端所有权、缓存时间、陈旧状态、后台刷新、请求去重和失效策略。</p>
        <div className="demo-meta-tags"><span className="badge badge-gray">query key</span><span className="badge badge-gray">stale</span><span className="badge badge-gray">refetch</span><span className="badge badge-gray">dedupe</span></div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>🎮</span> 最小 Query Cache 模拟器</h3><p className="demo-section-desc">这是教学实现，不是 TanStack Query。用它观察真实库为什么需要 query key、fresh/stale、in-flight dedupe 和 invalidation。</p></div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <button className="btn" onClick={() => load("ada")}>读取 Ada</button>
          <button className="btn" onClick={() => { load("ada"); load("ada"); }}>连续读取 Ada ×2</button>
          <button className="btn" onClick={() => load("lin")}>读取 Lin</button>
          <button className="btn" onClick={invalidate}>invalidate 当前 key</button>
          <button className="btn btn-primary" onClick={() => load(userId, { force: true })}>强制 refetch</button>
        </div>
        <label style={{ display: "block", marginTop: 14 }}>模拟 staleTime：{staleMs}ms <input type="range" min="0" max="8000" step="1000" value={staleMs} onChange={(e) => setStaleMs(Number(e.target.value))} /></label>
        <div className="demo-grid-2" style={{ marginTop: 14 }}>
          <div className="demo-alert demo-alert-tip"><strong>当前 query</strong><p>key: user:{userId}</p><p>status: {view.status}</p><p>source: {view.source}</p><p>实际 network request: {requestCount}</p>{view.data && <pre>{JSON.stringify(view.data, null, 2)}</pre>}</div>
          <div className="demo-alert"><strong>Cache</strong>{cacheRows.length === 0 ? <p>empty</p> : cacheRows.map((row) => <p key={row.key}>{row.key} → {row.name} · age {row.age}ms</p>)}</div>
        </div>
      </div>

      <div className="demo-grid-2">
        <div className="demo-alert demo-alert-tip"><strong>Client State</strong><p>modal 是否打开、当前 tab、输入框草稿。通常由当前客户端直接拥有和修改。</p></div>
        <div className="demo-alert demo-alert-warning"><strong>Server State</strong><p>用户、订单、列表等远端资源。客户端只是缓存副本，必须考虑 freshness、同步、失败和并发。</p></div>
      </div>

      <div className="demo-alert demo-alert-tip"><strong>映射到 TanStack Query：</strong>queryKey 决定缓存身份；staleTime 控制多久仍 fresh；invalidateQueries 可把匹配 query 标为 stale 并按观察状态触发 refetch。真实库还处理 GC、retry、focus/reconnect refetch 等，本 Demo 不冒充这些行为。</div>
    </div>
  );
}

export default ServerStateCacheDemo;
