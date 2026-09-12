import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const SERIES = [[12, 24, 18], [8, 32, 21]];

function FakeChart({ series, seriesKey, onLifecycle }) {
  const hostRef = useRef(null);
  const instanceId = `series-${seriesKey}`;

  useEffect(() => {
    const host = hostRef.current;
    host.textContent = `第三方 Chart 实例 ${instanceId} · ${series.join(" / ")}`;
    onLifecycle(`setup ${instanceId}`);

    return () => {
      host.textContent = "";
      onLifecycle(`cleanup ${instanceId}`);
    };
  }, [instanceId, onLifecycle, series]);

  return (
    <div ref={hostRef} style={{ padding: 14, border: "1px dashed var(--border-color)", borderRadius: 8 }} />
  );
}

export function PortalThirdPartyDemo() {
  const [open, setOpen] = useState(false);
  const [seriesKey, setSeriesKey] = useState(0);
  const [chartMounted, setChartMounted] = useState(true);
  const [lifecycleEvents, setLifecycleEvents] = useState([]);
  const series = SERIES[seriesKey % SERIES.length];

  const recordLifecycle = useCallback((event) => {
    setLifecycleEvents((current) => [...current, event].slice(-8));
  }, []);

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
        <div className="demo-section-header"><h3 className="demo-section-title"><span>📈</span> 第三方 DOM 生命周期</h3><p className="demo-section-desc">模拟图表/地图/编辑器：依赖变化时 cleanup old → setup new；卸载时 cleanup，避免重复 listener、observer、worker 或实例泄漏。下面日志由 Effect 的真实 setup/cleanup 写入，而不是根据按钮状态预测。</p></div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="btn" onClick={() => setSeriesKey((key) => key + 1)} disabled={!chartMounted}>切换 series，触发重建</button>
          <button className="btn btn-secondary" onClick={() => setChartMounted((mounted) => !mounted)}>{chartMounted ? "卸载第三方实例" : "重新挂载第三方实例"}</button>
        </div>
        <div style={{ marginTop: 12 }}>
          {chartMounted ? <FakeChart series={series} seriesKey={seriesKey} onLifecycle={recordLifecycle} /> : <div className="demo-alert">第三方实例当前已卸载。</div>}
          <pre style={{ whiteSpace: "pre-wrap", fontSize: 12, marginTop: 10 }}>{lifecycleEvents.join("\n") || "等待 Effect setup"}</pre>
        </div>
      </div>

      <div className="demo-grid-2">
        <div className="demo-alert demo-alert-tip"><strong>Portal 正确边界</strong><p>Modal / tooltip / popover 需要逃离 overflow、stacking context 时使用。Portal 不自动提供 focus trap、Escape、ARIA 或滚动锁。</p></div>
        <div className="demo-alert demo-alert-warning"><strong>第三方 DOM 反模式</strong><p>在 render 中直接 new Chart(...)、重复 addEventListener，或只 setup 不 destroy。Render 应保持纯净，外部系统同步进入 Effect。</p></div>
      </div>
    </div>
  );
}

export default PortalThirdPartyDemo;
