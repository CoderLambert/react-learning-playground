import { useMemo, useState } from "react";

const SERVER_HTML = '<button id="buy">购买 · $99</button>';

export function HydrationStreamingDemo() {
  const [clientPrice, setClientPrice] = useState(99);
  const [hydrated, setHydrated] = useState(false);
  const [revealed, setRevealed] = useState(1);
  const clientHtml = `<button id="buy">购买 · $${clientPrice}</button>`;
  const matches = SERVER_HTML === clientHtml;

  const chunks = useMemo(() => [
    "① shell: <header> + product title",
    "② Suspense fallback: reviews loading…",
    "③ reviews boundary resolves → stream replacement content",
  ], []);

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <h2 className="demo-title"><span>💧</span> Server HTML → Hydration → Interactive</h2>
          <span className="badge badge-blue">hydrateRoot / Streaming</span>
        </div>
        <p className="demo-desc">SSR 先生成 HTML；hydration 是让客户端 React 接管已有的服务端 HTML，使同一初始 UI 获得 React 交互能力。用于 hydration 的客户端首次 render 应与服务端输出一致，mismatch 应被当作需要修复的 bug。</p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>🎮</span> Hydration mismatch 实验</h3><p className="demo-section-desc">把客户端首屏价格改成与服务端不同，观察为什么这不是普通的“稍后更新”。</p></div>
        <div className="demo-grid-2">
          <div>
            <label htmlFor="hydration-client-price" style={{ display: "block", marginBottom: 6 }}>客户端首屏 price</label>
            <input id="hydration-client-price" className="form-input" type="number" value={clientPrice} onChange={(event) => { setClientPrice(Number(event.target.value)); setHydrated(false); }} />
            <button type="button" className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => setHydrated(true)}>模拟 hydrateRoot</button>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Server HTML</div><code style={{ display: "block", padding: 8 }}>{SERVER_HTML}</code>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 10 }}>Client first render</div><code style={{ display: "block", padding: 8 }}>{clientHtml}</code>
            <div className={`demo-alert ${matches ? "demo-alert-tip" : "demo-alert-warning"}`} style={{ marginTop: 12 }}><strong>{matches ? "MATCH" : "MISMATCH"}</strong><p>{matches ? "客户端可基于同一初始 UI hydrate 服务端标记。" : "真实 hydrateRoot 会报告 hydration mismatch；React 不保证修补所有不一致（例如某些属性差异），因此不能把 mismatch 当成业务同步机制。"}</p></div>
            {hydrated && <p><strong>交互状态：</strong>{matches ? "hydrated / interactive" : "hydration correctness violated"}</p>}
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>🌊</span> Streaming SSR：先 shell，再逐步 reveal</h3></div>
        <div style={{ display: "grid", gap: 8 }}>
          {chunks.slice(0, revealed).map((chunk) => <div key={chunk} style={{ padding: 10, border: "1px solid var(--border-color)", borderRadius: 8 }}>{chunk}</div>)}
        </div>
        <button type="button" className="btn" style={{ marginTop: 12 }} disabled={revealed === chunks.length} onClick={() => setRevealed((value) => Math.min(chunks.length, value + 1))}>流式发送下一段</button>
        <div className="demo-alert demo-alert-tip" style={{ marginTop: 12 }}><p>Node.js Stream 环境优先使用 <code>renderToPipeableStream</code>；Deno、现代 edge runtime 等 Web Streams 环境使用 <code>renderToReadableStream</code>。Node.js 也提供 ReadableStream 兼容能力，但 React 官方仍建议 Node 使用专用的 pipeable API。两类 API 解决的是“HTML 如何边生成边发送”，不是 RSC 的同义词。</p></div>
      </div>

      <div className="demo-alert demo-alert-warning"><div className="demo-alert-title">常见 mismatch 来源</div><p>render 中直接读取 <code>Date.now()</code>、随机数、仅浏览器存在且首屏两端取值不同的数据，或服务端与客户端使用不同初始数据。正确做法是让用于 hydration 的首次输出可重现；若确实需要不同的客户端内容，再使用明确的 hydration 后更新策略。</p></div>
    </div>
  );
}

export default HydrationStreamingDemo;
