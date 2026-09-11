import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

function FakeChart({ series }) {
  const hostRef = useRef(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const host = hostRef.current;
    const instance = { id: crypto.randomUUID?.() ?? String(Date.now()) };
    host.textContent = `第三方 Chart 实例 ${instance.id.slice(0, 8)} · ${series.join(" / ")}`;
    setEvents((items) => [...items, `setup ${instance.id.slice(0, 8)}`]);

    return () => {
      host.textContent = "";
      setEvents((items) => [...items, `cleanup ${instance.id.slice(0, 8)}`]);
    };
  }, [series]);

  return (
    <div>
      <div ref={hostRef} style={{ padding: 14, border: "1px dashed var(--border-color)", borderRadius: 8 }} />
      <pre style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>{events.slice(-6).join("\n") || "等待 setup"}</pre>
    </div>
  );
}

export function PortalThirdPartyDemo() {
  const [open, setOpen] = useState(false);
  const [seriesKey, setSeriesKey] = useState(0);
  const series = seriesKey % 2 === 0 ? [12, 24, 18] : [8, 32, 21];

  return (
    <div onClick={() => console.log("React parent 收到 portal child 的冒泡事件") }>
      <div className="demo-header-card">
        <div className="demo-header-top"><h2 className="demo-title"><span>🌀</span> Portal + 第三方 DOM：React Tree ≠ DOM Tree</h2><span className="badge badge-blue">Escape Hatch</span></div>
        <p className="demo-desc">Portal 只改变 DOM 的物理落点，React 关系仍留在原组件树中；第三方 DOM 实例则应由 ref 定位容器，并在 Effect 中 setup / cleanup。</p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>🎮</span> Portal 实验</h3></div>
        <button className="btn btn-primary" onClick={(event) => { event.stopPropagation(); setOpen(true); }}>打开 Portal</button>
        {open && createPortal(
          <div role="dialog" aria-modal="true" aria-label="Portal demo" style={{ position: "fixed", inset: 20, zIndex: 1000, display: "grid", placeItems: "center", background: "rgba(0,0,0,.45)" }}>
            <div style={{ padding: 20, borderRadius: 12, background: "var(--bg-surface)", maxWidth: 520 }}>
              <h3>DOM 在 document.body，React 仍是当前组件的 child</h3>
              <p>Portal 内事件默认仍按 React tree 冒泡，而不是按 DOM tree 推断组件父子关系。</p>
              <button className="btn" onClick={() => setOpen(false)}>关闭</button>
            </div>
          </div>,
          document.body,
        )}
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>📈</span> 第三方 DOM 生命周期</h3><p className="demo-section-desc">模拟图表/地图/编辑器：依赖变化时 cleanup old → setup new；卸载时 cleanup，避免重复 listener、observer、worker 或实例泄漏。</p></div>
        <button className="btn" onClick={() => setSeriesKey((key) => key + 1)}>切换 series，触发重建</button>
        <div style={{ marginTop: 12 }}><FakeChart series={series} /></div>
      </div>

      <div className="demo-grid-2">
        <div className="demo-alert demo-alert-tip"><strong>Portal 正确边界</strong><p>Modal / tooltip / popover 需要逃离 overflow、stacking context 时使用。Portal 不自动提供 focus trap、Escape、ARIA 或滚动锁。</p></div>
        <div className="demo-alert demo-alert-warning"><strong>第三方 DOM 反模式</strong><p>在 render 中直接 new Chart(...)、重复 addEventListener，或只 setup 不 destroy。Render 应保持纯净，外部系统同步进入 Effect。</p></div>
      </div>
    </div>
  );
}

export default PortalThirdPartyDemo;
