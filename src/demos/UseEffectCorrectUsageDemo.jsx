import { useState, useEffect } from "react";

// 独立可挂载/卸载的子组件，用于直观展示 Setup 与 Cleanup 过程
function LiveWindowWatcher({ onLog }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      onLog("info", `📐 窗口宽度变更为: ${window.innerWidth}px`);
    };

    window.addEventListener("resize", handleResize);

    // 💡 极其关键的清理函数 (Cleanup)
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [onLog]);

  return (
    <div
      style={{
        padding: "16px",
        background: "var(--color-primary-light)",
        border: "1px solid var(--color-primary-border)",
        borderRadius: "var(--radius-sm)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
          实时视口宽度监听器：
        </span>
        <strong style={{ marginLeft: "8px", fontSize: "16px", color: "var(--color-primary)" }}>
          {windowWidth} px
        </strong>
      </div>
      <span className="badge badge-green">监听活跃中</span>
    </div>
  );
}

export function UseEffectCorrectUsageDemo() {
  const [showWatcher, setShowWatcher] = useState(true);
  const [logs, setLogs] = useState([
    { type: "info", text: "系统已就绪，准备演示 Effect 生命周期", time: new Date().toLocaleTimeString() },
  ]);

  // 控制台日志打印函数
  const addLog = (type, text) => {
    setLogs((prev) => [
      { type, text, time: new Date().toLocaleTimeString() },
      ...prev.slice(0, 19),
    ]);
  };

  const handleToggleWatcher = () => {
    setShowWatcher((prev) => {
      const next = !prev;
      if (next) {
        addLog("info", "🟢 [Setup 建立] 重新挂载组件并注册 window resize 监听器");
      } else {
        addLog("warn", "🧹 [Cleanup 清理] 卸载组件并触发 Cleanup 销毁监听器，杜绝内存泄漏！");
      }
      return next;
    });
  };

  // 场景 2：与 Document Title 浏览器外部系统同步
  const [pageTitleBadge, setPageTitleBadge] = useState(0);

  useEffect(() => {
    const originalTitle = document.title;
    if (pageTitleBadge > 0) {
      document.title = `(${pageTitleBadge}条未读) React 学习实验室`;
    } else {
      document.title = "React 学习实验室";
    }

    // 页面卸载或变更时恢复
    return () => {
      document.title = originalTitle;
    };
  }, [pageTitleBadge]);

  const handleAddBadge = () => {
    setPageTitleBadge((c) => {
      const next = c + 1;
      addLog("info", `🏷️ 同步外部 document.title: (${next}条未读)`);
      return next;
    });
  };

  const handleClearBadge = () => {
    setPageTitleBadge(0);
    addLog("info", "🏷️ 恢复外部 document.title: React 学习实验室");
  };

  return (
    <div>
      {/* 头部说明卡片 */}
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>🔄</span> useEffect 正确用法、心智模型与清理函数 (Cleanup)
            </h2>
          </div>
          <span className="badge badge-green">外部系统同步</span>
        </div>
        <p className="demo-desc">
          <code>useEffect</code> 不是传统意义上的生命周期函数（如 componentDidMount），它的本质是：<strong>将组件与某个非 React 外部系统保持同步</strong>（例如：浏览器原生事件、WebSocket、第三方地图控件或定时器）。并且，<strong>每一个副作用都必须有始有终，提供完整的 Cleanup 清理函数</strong>。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">外部系统同步 (External Sync)</span>
          <span className="badge badge-gray">清理函数 (Cleanup Return)</span>
          <span className="badge badge-gray">严格模式双重调用 (StrictMode Verification)</span>
        </div>
      </div>

      {/* 实验区域 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🔬</span> 实验 1：外部浏览器监听与清理验证
          </h3>
          <p className="demo-section-desc">
            点击按钮挂载/卸载监听器组件，或者尝试缩放浏览器窗口，观察控制台清晰捕捉到的 Setup 与 Cleanup 执行时机：
          </p>
        </div>

        <div style={{ marginBottom: "14px", display: "flex", gap: "10px" }}>
          <button
            className={`btn ${showWatcher ? "btn-danger" : "btn-success"}`}
            onClick={handleToggleWatcher}
          >
            {showWatcher ? "❌ 卸载监听组件（触发 Cleanup）" : "➕ 挂载监听组件（触发 Setup）"}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setLogs([])}
          >
            清空日志
          </button>
        </div>

        {/* 动态挂载的目标组件 */}
        {showWatcher ? (
          <div style={{ marginBottom: "16px" }}>
            <LiveWindowWatcher onLog={addLog} />
          </div>
        ) : (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              background: "var(--bg-surface-secondary)",
              borderRadius: "var(--radius-sm)",
              color: "var(--text-subtle)",
              fontSize: "13.5px",
              marginBottom: "16px",
            }}
          >
            组件已卸载，清理函数已将 window resize 监听器完全移除，不会造成任何残留！
          </div>
        )}

        {/* 实时模拟控制台 */}
        <div className="demo-console">
          <div className="demo-console-header">
            <span>TERMINAL OUTPUT / EFFECT LIFECYCLE LOGS</span>
            <span>{logs.length} 条记录</span>
          </div>
          {logs.map((log, index) => (
            <div key={index} className={`demo-console-log ${log.type}`}>
              [{log.time}] {log.text}
            </div>
          ))}
        </div>
      </div>

      {/* 实验 2：Document Title 同步 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🏷️</span> 实验 2：浏览器标头 Title 同步
          </h3>
          <p className="demo-section-desc">
            点击下方按钮调整未读消息数，观察浏览器标签页标题的即时同步：
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button className="btn btn-primary btn-sm" onClick={handleAddBadge}>
            模拟收到未读通知 (+1)
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handleClearBadge}>
            标记全部已读 (清空)
          </button>
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            当前未读数：<strong>{pageTitleBadge}</strong> 条
          </span>
        </div>
      </div>

      {/* 核心心智总结 */}
      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title">
          <span>💡</span> 为什么 React 19 严格模式在开发环境会执行两次 Effect？
        </div>
        <div>
          在 <code>StrictMode</code> 下，React 会故意挂载 ➔ 立即卸载 ➔ 再次挂载组件。
          这并非 Bug，而是 React 为你进行<strong>副作用健壮性测试</strong>：如果你的 Cleanup 函数写得不严谨（例如只开了 <code>setInterval</code> 或 <code>addEventListener</code> 却没有销毁），第二次执行就会暴露出重复监听或内存泄漏。
        </div>
      </div>
    </div>
  );
}

export default UseEffectCorrectUsageDemo;
