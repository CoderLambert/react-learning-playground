import { useState, useRef, useLayoutEffect } from "react";

export function UseRefDemo() {
  // ==========================================
  // 场景 1：DOM 元素直接访问与控制
  // ==========================================
  const inputRef = useRef(null);
  const chatBoxRef = useRef(null);
  const [messages, setMessages] = useState([
    "欢迎来到 React 19 核心研讨室",
    "useRef 能够保存对底层 DOM 节点的直接引用",
  ]);
  const [newMessageText, setNewMessageText] = useState("");
  const isFirstRender = useRef(true);

  // 监听 messages 列表更新，并在 DOM 渲染后平滑滚至最底端
  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;
    setMessages((prev) => [...prev, newMessageText.trim()]);
    setNewMessageText("");
    // 聚焦输入框
    inputRef.current?.focus();
  };

  const handleFocusInput = () => {
    inputRef.current?.focus();
  };

  // ==========================================
  // 场景 2：跨渲染周期持久化可变数据（不引发重渲染）
  // ==========================================
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  // 💡 定时器句柄保存在 Ref 中；写入句柄本身不会请求组件重新渲染。
  const timerIdRef = useRef(null);

  const startTimer = () => {
    if (timerIdRef.current !== null) return;
    setIsTimerRunning(true);
    timerIdRef.current = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerIdRef.current !== null) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    stopTimer();
    setTimerSeconds(0);
  };

  return (
    <div>
      {/* 头部说明卡片 */}
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>🎯</span> useRef 核心用法、DOM 控制与避坑守则
            </h2>
          </div>
          <span className="badge badge-purple">底层引用通道</span>
        </div>
        <p className="demo-desc">
          <code>useRef</code> 返回一个可变的 ref 对象，其 <code>.current</code> 属性在组件的整个生命周期内持久存在。它最核心的两大职责：<strong>直接操作底层 DOM 节点</strong>，以及<strong>跨渲染持久化任意可变值且不触发重渲染</strong>。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">DOM 访问（Focus / Scroll / Measure）</span>
          <span className="badge badge-gray">不引发重渲染 (Silent Mutability)</span>
          <span className="badge badge-gray">纯函数渲染安全守则</span>
        </div>
      </div>

      {/* 场景 1：DOM 控制 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🖥️</span> 1. DOM 访问：主动聚焦与聊天室自动平滑触底
          </h3>
          <p className="demo-section-desc">
            通过 <code>ref=&#123;inputRef&#125;</code> 绑定真实 DOM，可在点击或发送后立即调用 <code>.focus()</code>，并在新消息到来时自动调用 <code>scrollTo</code>：
          </p>
        </div>

        <div className="demo-grid-2">
          {/* 聊天消息流 */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                聊天消息窗口（总计 {messages.length} 条）
              </span>
              <button className="btn btn-outline btn-sm" onClick={handleFocusInput}>
                🎯 主动聚焦输入框
              </button>
            </div>

            <div
              ref={chatBoxRef}
              style={{
                height: "160px",
                overflowY: "auto",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-sm)",
                padding: "10px",
                background: "var(--bg-surface-secondary)",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    padding: "6px 12px",
                    background: "var(--bg-surface)",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border-subtle)",
                    fontSize: "13px",
                    alignSelf: i % 2 === 0 ? "flex-start" : "flex-end",
                    maxWidth: "85%",
                  }}
                >
                  {msg}
                </div>
              ))}
            </div>

            {/* 发送消息表单 */}
            <form onSubmit={handleSendMessage} style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
              <input
                ref={inputRef}
                type="text"
                className="form-input"
                placeholder="键入消息，回车发送..."
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-sm">
                发送
              </button>
            </form>
          </div>

          {/* 场景 2：保存定时器 ID */}
          <div style={{ padding: "16px", background: "var(--bg-surface-secondary)", borderRadius: "var(--radius-md)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <h4 style={{ margin: 0, fontSize: "14px" }}>
                  2. 可变值存储：计时器句柄
                </h4>
                <span className={`badge ${isTimerRunning ? "badge-green" : "badge-gray"}`}>
                  {isTimerRunning ? "⏱️ 计时中 (Ref 持有句柄)" : "⏸️ 处于就绪状态"}
                </span>
              </div>
              <p style={{ margin: "0 0 16px 0", fontSize: "12.5px", color: "var(--text-muted)", lineHeight: "1.5" }}>
                定时器的 <code>timerId</code> 不参与 JSX 计算。放进 <code>useRef</code> 可以让句柄跨 render 保留，而写入 <code>ref.current</code> 本身不会请求新的 render；屏幕上的秒数仍由 State 驱动。这里的 <code>setInterval</code> 只用于演示句柄生命周期，并不代表高精度计时。
              </p>

              <div style={{ textAlign: "center", padding: "12px 0", fontSize: "36px", fontWeight: "800", color: isTimerRunning ? "var(--color-primary)" : "var(--text-muted)" }}>
                {timerSeconds}s
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
              {!isTimerRunning ? (
                <button className="btn btn-success btn-sm" onClick={startTimer}>
                  ▶️ 启动计时器
                </button>
              ) : (
                <button className="btn btn-warning btn-sm" onClick={stopTimer}>
                  ⏸️ 暂停计时器
                </button>
              )}
              <button className="btn btn-secondary btn-sm" onClick={resetTimer}>
                🔄 复位
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ref 在 render 中的边界 */}
      <div className="demo-alert demo-alert-danger">
        <div className="demo-alert-title">
          <span>⚠️</span> Render 边界：通常不要在渲染阶段读写 ref.current
        </div>
        <div style={{ fontSize: "13px", lineHeight: "1.6" }}>
          如果某个值参与 JSX 计算，应使用 State，而不是依赖 <code>ref.current</code>。React 官方也建议通常不要在 render 中读写 <code>ref.current</code>，因为这会让渲染行为难以预测。
          一个明确的窄例外是<strong>完全可预测的一次性初始化</strong>，例如仅在 <code>ref.current === null</code> 时创建并保存同一个对象。
          其他命令式读写通常放在事件处理函数，或确实用于外部系统同步时放在合适的 Effect 中。
        </div>
      </div>
    </div>
  );
}

export default UseRefDemo;