import { useMemo, useSyncExternalStore } from "react";

const PRODUCTS = [
  { id: 1, name: "React 性能手册", category: "book" },
  { id: 2, name: "TypeScript 工程指南", category: "book" },
  { id: 3, name: "React 实验课程", category: "course" },
  { id: 4, name: "Web Accessibility 课程", category: "course" },
];

const URL_STATE_EVENT = "url-state-demo:navigate";

function getSearchSnapshot() {
  return typeof window === "undefined" ? "" : window.location.search;
}

function subscribeToUrlState(onStoreChange) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener("popstate", onStoreChange);
  window.addEventListener(URL_STATE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("popstate", onStoreChange);
    window.removeEventListener(URL_STATE_EVENT, onStoreChange);
  };
}

function readUrlState(search) {
  const params = new URLSearchParams(search);
  return {
    query: params.get("q") ?? "",
    category: params.get("category") ?? "all",
  };
}

function writeUrlState({ query, category }) {
  const url = new URL(window.location.href);

  if (query) url.searchParams.set("q", query);
  else url.searchParams.delete("q");

  if (category !== "all") url.searchParams.set("category", category);
  else url.searchParams.delete("category");

  window.history.pushState(window.history.state, "", url);
  window.dispatchEvent(new Event(URL_STATE_EVENT));
}

function resetUrlState() {
  const url = new URL(window.location.href);
  url.searchParams.delete("q");
  url.searchParams.delete("category");
  window.history.pushState(window.history.state, "", url);
  window.dispatchEvent(new Event(URL_STATE_EVENT));
}

export function UrlStateDemo() {
  const search = useSyncExternalStore(subscribeToUrlState, getSearchSnapshot, () => "");
  const { query, category } = readUrlState(search);

  const visibleProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return PRODUCTS.filter((product) => {
      const matchesQuery = !normalized || product.name.toLowerCase().includes(normalized);
      const matchesCategory = category === "all" || product.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

  function updateUrlState(patch) {
    writeUrlState({ query, category, ...patch });
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title"><span>🔗</span> URL 也是页面状态：Params / Search Params</h2>
          </div>
          <span className="badge badge-blue">Router 心智模型</span>
        </div>
        <p className="demo-desc">
          Router 不只是“点击链接换组件”。URL 本身就是可复制、可刷新、可前进后退的页面状态容器。
          路径参数通常表达资源身份，Search Params 更适合搜索、筛选、排序、分页等页面视图状态。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">URL = 可持久化页面状态</span>
          <span className="badge badge-gray">Route Params</span>
          <span className="badge badge-gray">Search Params</span>
          <span className="badge badge-gray">Single Source of Truth</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🎮</span> URL 状态实验台</h3>
          <p className="demo-section-desc">
            这里直接使用浏览器 History API 修改当前地址栏的 search params，并从 <code>window.location.search</code> 订阅当前值。
            未知参数会被保留；本实验只拥有 <code>q</code> 与 <code>category</code>。Back / Forward 会通过真实 <code>popstate</code> 恢复 UI。
          </p>
        </div>

        <div className="demo-grid-2">
          <div style={{ padding: 16, background: "var(--bg-surface-secondary)", borderRadius: "var(--radius-md)" }}>
            <label style={{ display: "block", fontSize: 12, marginBottom: 6 }}>搜索关键字 q</label>
            <input
              className="form-input"
              value={query}
              onChange={(event) => updateUrlState({ query: event.target.value })}
              placeholder="例如 react"
            />

            <label style={{ display: "block", fontSize: 12, margin: "14px 0 6px" }}>分类 category</label>
            <select
              className="form-input"
              value={category}
              onChange={(event) => updateUrlState({ category: event.target.value })}
            >
              <option value="all">全部</option>
              <option value="book">图书</option>
              <option value="course">课程</option>
            </select>

            <button className="btn" style={{ marginTop: 14 }} onClick={resetUrlState}>重置 URL 状态</button>
          </div>

          <div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>当前地址栏 search</div>
            <code style={{ display: "block", padding: 12, overflowWrap: "anywhere" }}>
              {search || "（无 search params）"}
            </code>
            <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
              {visibleProducts.length === 0 ? (
                <div className="demo-alert">没有匹配结果。URL 仍完整记录了当前筛选条件。</div>
              ) : visibleProducts.map((product) => (
                <div key={product.id} style={{ padding: 10, border: "1px solid var(--border-color)", borderRadius: 8 }}>
                  <strong>{product.name}</strong>
                  <span className="badge badge-gray" style={{ marginLeft: 8 }}>{product.category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🧭</span> Params 与 Search Params 怎么分工</h3>
        </div>
        <div className="demo-grid-2">
          <div className="demo-alert demo-alert-tip">
            <div className="demo-alert-title">Route Params：资源身份</div>
            <code>/users/:userId</code><br />
            <code>/orders/:orderId</code>
            <p>通常决定“你正在看哪个资源”，是路由匹配的一部分。</p>
          </div>
          <div className="demo-alert demo-alert-tip">
            <div className="demo-alert-title">Search Params：页面视图状态</div>
            <code>?q=react&page=2&sort=price</code>
            <p>适合搜索、过滤、排序、分页；刷新和分享链接后仍能恢复同一视图。</p>
          </div>
        </div>
      </div>

      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title"><span>💡</span> 项目边界</div>
        <p>
          不要把所有 UI State 都塞进 URL。Modal 临时动画状态、输入法组合状态等通常留在组件内；
          但只要状态需要“刷新保持、链接分享、浏览器前进/后退恢复”，URL 往往比普通 useState 更合适。
        </p>
      </div>

      <div className="demo-alert demo-alert-warning">
        <div className="demo-alert-title"><span>⚠️</span> 常见反模式：双份真相</div>
        <p>
          同时维护 <code>searchParams</code> 和一套完全相同的 <code>filterState</code>，再用 Effect 双向同步，容易形成循环更新和状态漂移。
          优先选择一个 Source of Truth，再从它派生 UI。
        </p>
      </div>

      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title"><span>📌</span> 与真实 Router 的边界</div>
        <p>
          本实验直接使用浏览器 History API，是为了让地址栏、刷新和 Back / Forward 真实可观察；生产应用通常应通过 Router 的 search/navigation API 完成同一职责，
          让 Router 同时处理匹配、数据和导航状态，而不是在业务组件中自行广播自定义 history 事件。
        </p>
      </div>
    </div>
  );
}
