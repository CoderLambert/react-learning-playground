import { useCallback, useEffect, useState } from "react";

function LiveWindowWatcher({ onLog }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      onLog("info", `📐 窗口宽度变更为: ${window.innerWidth}px`);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [onLog]);

  return (
    <div style={{ padding: "16px", background: "var(--color-primary-light)", border: "1px solid var(--color-primary-border)", borderRadius: "var(--radius-sm)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>实时视口宽度监听器：</span>
        <strong style={{ marginLeft: "8px", fontSize: "16px", color: "var(--color-primary)" }}>{windowWidth} px</strong>
      </div>
      <span className="badge badge-green">监听活跃中</span>
    </div>
  );
}

export function UseEffectCorrectUsageDemo() {
  const [showWatcher, setShowWatcher] = useState(true);
  const [logs, setLogs] = useState([
    { type: "info", text: "系统已就绪，准备演示 Effect 同步与 Cleanup", time: new Date().toLocaleTimeString() },
  ]);

  const addLog = useCallback((type, text) => {
    setLogs((prev) => [
      { type, text, time: new Date().toLocaleTimeString() },
      ...prev.slice(0, 19),
    ]);
  }, []);

  const handleToggleWatcher = () => {
    setShowWatcher((prev) => {
      const next = !prev;
      addLog(
        "info",
        next
          ? "🟢 [Setup 建立] 重新挂载监听组件；Effect 会注册 resize listener"
          : "🧹 [Cleanup 清理] 卸载监听组件；Effect cleanup 会移除 resize listener",
      );
      return next;
    });
  };

  const [pageTitleBadge, setPageTitleBadge] = useState(0);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = pageTitleBadge > 0 ? `(${pageTitleBadge}条未读) React 学习实验室` : "React 学习实验室";

    return () => {
      document.title = originalTitle;
    };
  }, [pageTitleBadge]);

  const handleAddBadge = () => {
    setPageTitleBadge((c) => c + 1);
    addLog("info", "🏷️ 请求更新未读数；Effect 会把最新状态同步到 document.title");
  };

  const handleClearBadge = () => {
    setPageTitleBadge(0);
    addLog("info", "🏷️ 清空未读数；Effect 会同步 document.title");
  };

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div><h2 className="demo-title"><span>🔄</span> useEffect 正确用法、同步模型与 Cleanup</h2></div>
          <span className="badge badge-green">外部系统同步</span>
        </div>
        <p className="demo-desc">
          <code>useEffect</code> 用来让组件与 React 之外的外部系统保持同步，例如浏览器事件、WebSocket、第三方控件或某些 timer。Cleanup 不是每个 Effect 都必须返回的仪式：<strong>只有当 setup 建立了需要停止、撤销或释放的外部同步时，才应返回与之对称的 cleanup</strong>。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">External Sync</span>
          <span className="badge badge-gray">Setup ↔ Cleanup</span>
          <span className="badge badge-gray">StrictMode Stress Test</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🔬</span> 实验 1：浏览器事件监听与对称清理</h3>
          <p className="demo-section-desc">挂载组件后 Effect 注册 resize listener；卸载时 cleanup 移除同一个 listener。缩放窗口可观察当前订阅仍在工作。</p>
        </div>

        <div style={{ marginBottom: "14px", display: "flex", gap: "10px" }}>
          <button className={`btn ${showWatcher ? "btn-danger" : "btn-success"}`} onClick={handleToggleWatcher}>
            {showWatcher ? "❌ 卸载监听组件（触发 Cleanup）" : "➕ 挂载监听组件（触发 Setup）"}
          </button>
          <button className="btn btn-secondary" onClick={() => setLogs([])}>清空日志</button>
        </div>

        {showWatcher ? (
          <div style={{ marginBottom: "16px" }}><LiveWindowWatcher onLog={addLog} /></div>
        ) : (
          <div style={{ padding: "20px", textAlign: "center", background: "var(--bg-surface-secondary)", borderRadius: "var(--radius-sm)", color: "var(--text-subtle)", fontSize: "13.5px", marginBottom: "16px" }}>
            组件已卸载；cleanup 会撤销这个组件建立的 resize 订阅。
          </div>
        )}

        <div className="demo-console">
          <div className="demo-console-header"><span>TERMINAL OUTPUT / EFFECT LOGS</span><span>{logs.length} 条记录</span></div>
          {logs.map((log, index) => <div key={index} className={`demo-console-log ${log.type}`}>[{log.time}] {log.text}</div>)}
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🏷️</span> 实验 2：把 React state 同步到 document.title</h3>
          <p className="demo-section-desc">按钮只更新 React state；Effect 根据当前 state 把浏览器标签标题同步到相同状态。</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button className="btn btn-primary btn-sm" onClick={handleAddBadge}>模拟收到未读通知 (+1)</button>
          <button className="btn btn-secondary btn-sm" onClick={handleClearBadge}>标记全部已读 (清空)</button>
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>当前未读数：<strong>{pageTitleBadge}</strong> 条</span>
        </div>
      </div>

      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title"><span>💡</span> StrictMode 到底在验证什么？</div>
        <div>
          开发环境启用 <code>StrictMode</code> 时，React 会对 Effect 做一次额外的 <strong>setup → cleanup → setup</strong> 压力测试（并且 StrictMode 还有其他开发期检查）。目标不是模拟一次真实业务卸载，而是验证 cleanup 是否能完整撤销 setup；用户不应能分辨“只 setup 一次”和这组额外检查带来的差异。
        </div>
      </div>
    </div>
  );
}

export default UseEffectCorrectUsageDemo;
