import { useState, useEffect, useRef } from "react";

// ==========================================
// 1. 模拟外部 WebSocket 服务
// ==========================================
function connectChatSocket(roomId, onMessage) {
  let isClosed = false;
  let timerId = null;

  // 模拟周期性接收消息
  const startEmitting = () => {
    timerId = setInterval(() => {
      if (!isClosed) {
        onMessage({
          id: Date.now(),
          text: `[来自房间 #${roomId} 的实时消息] 当前在线人数: ${Math.floor(Math.random() * 20 + 5)}`,
          time: new Date().toLocaleTimeString(),
        });
      }
    }, 2500);
  };

  startEmitting();

  return {
    close: () => {
      isClosed = true;
      if (timerId) clearInterval(timerId);
    },
  };
}

export function LifecycleOfReactiveEffectsDemo() {
  const [roomId, setRoomId] = useState("101");
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [lifecycleLogs, setLifecycleLogs] = useState([
    { type: "success", text: "🟢 [Effect 建立同步] 已建立与房间 #101 的 Socket 通讯", time: new Date().toLocaleTimeString() },
  ]);

  const addLog = (type, text) => {
    setLifecycleLogs((prev) => [
      { type, text, time: new Date().toLocaleTimeString() },
      ...prev.slice(0, 19),
    ]);
  };

  // 💡 技巧 1：用 Ref 追踪最新的 isMuted 状态
  // 核心收益：在消息回调中读取最新静音状态，而无需将 isMuted 列入 Effect 依赖项！
  // 切换静音绝对不会中断/重启昂贵的 WebSocket 连接！
  const isMutedRef = useRef(isMuted);
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  const handleToggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      addLog("info", `🔔 静音状态变更为: ${next ? "已开启静音（仅接收不发声）" : "已关闭静音"}`);
      return next;
    });
  };

  const handleSwitchRoom = (nextRoom) => {
    if (nextRoom === roomId) return;
    addLog("error", `🔴 [Effect 停止同步] 触发 Cleanup，安全关闭房间 #${roomId} 的 Socket 连接`);
    addLog("success", `🟢 [Effect 重新同步] 正在建立与房间 #${nextRoom} 的新 Socket 连接...`);
    setRoomId(nextRoom);
    setMessages([]);
  };

  // ==========================================
  // 核心响应式 Effect：同步房间 Socket
  // ==========================================
  useEffect(() => {
    const socket = connectChatSocket(roomId, (newMessage) => {
      // 💡 技巧 2：使用函数式更新 setMessages(prev => ...)，成功解除对 messages 的闭包依赖！
      setMessages((prev) => [newMessage, ...prev.slice(0, 7)]);

      // 读取 Ref 中的最新配置，破除闭包陈旧陷阱
      if (!isMutedRef.current) {
        addLog("info", `📩 收到新消息并播放提示音: ${newMessage.text}`);
      } else {
        addLog("warn", `🔕 [静音屏蔽] 收到消息但不播放提示音`);
      }
    });

    // 💡 核心：精确的清理函数
    return () => {
      socket.close();
    };
  }, [roomId]); // 仅依赖响应式值 roomId！极度干净稳定！

  return (
    <div>
      {/* 头部说明卡片 */}
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>🌐</span> 响应式 Effect 的生命周期与依赖解耦
            </h2>
          </div>
          <span className="badge badge-purple">深度核心</span>
        </div>
        <p className="demo-desc">
          组件中的每个 Effect 都有<strong>独立的生命周期</strong>：它会随着依赖项的变化，经历多次<strong>“停止同步（Cleanup）➔ 重新同步（Setup）”</strong>。通过函数式更新与 Ref 解耦非响应式逻辑，可避免因无关状态变化反复销毁重建昂贵连接。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">响应式值（Reactive Values）</span>
          <span className="badge badge-gray">函数式更新解耦（Functional Updates）</span>
          <span className="badge badge-gray">Ref 穿透闭包陷阱</span>
        </div>
      </div>

      {/* 控制台与模拟器 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🎮</span> 实时聊天室连接模拟器
          </h3>
          <p className="demo-section-desc">
            切换房间（触发断开重连）与切换静音（不重连只更新 Ref），观察终端中精准的生命周期事件：
          </p>
        </div>

        {/* 控制条 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "16px", padding: "12px 16px", background: "var(--bg-surface-secondary)", borderRadius: "var(--radius-sm)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "13px", fontWeight: "600" }}>切换当前房间：</span>
            {["101", "102", "103"].map((id) => (
              <button
                key={id}
                className={`btn btn-sm ${roomId === id ? "btn-primary" : "btn-secondary"}`}
                onClick={() => handleSwitchRoom(id)}
              >
                房间 #{id}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              className={`btn btn-sm ${isMuted ? "btn-warning" : "btn-outline"}`}
              onClick={handleToggleMute}
            >
              {isMuted ? "🔕 当前已静音（点击解除）" : "🔔 开启静音（点击静音）"}
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => setLifecycleLogs([])}>
              清空日志
            </button>
          </div>
        </div>

        <div className="demo-grid-2">
          {/* 左侧：收到的实时消息 */}
          <div>
            <div style={{ fontSize: "13px", fontWeight: "600", marginBottom: "8px", color: "var(--text-main)" }}>
              房间 #{roomId} 实时消息通道
            </div>
            <div
              style={{
                height: "220px",
                overflowY: "auto",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-sm)",
                padding: "10px",
                background: "var(--bg-surface)",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {messages.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-subtle)", fontSize: "13px" }}>
                  正在等待房间 #{roomId} 的广播消息...
                </div>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      padding: "8px 12px",
                      background: "var(--bg-surface-secondary)",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "12.5px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-subtle)", fontSize: "11px", marginBottom: "3px" }}>
                      <span>{m.time}</span>
                      <span>#{roomId}</span>
                    </div>
                    <div>{m.text}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 右侧：生命周期控制台 */}
          <div>
            <div style={{ fontSize: "13px", fontWeight: "600", marginBottom: "8px", color: "var(--text-main)" }}>
              Effect 运行时生命周期链路追踪
            </div>
            <div className="demo-console" style={{ height: "220px", maxHeight: "220px" }}>
              <div className="demo-console-header">
                <span>SOCKET LIFECYCLE MONITOR</span>
                <span>{lifecycleLogs.length} 条追踪</span>
              </div>
              {lifecycleLogs.map((log, index) => (
                <div key={index} className={`demo-console-log ${log.type}`}>
                  [{log.time}] {log.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 核心秘籍总结 */}
      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title">
          <span>💡</span> 依赖项优化两大杀手锏
        </div>
        <div>
          1. <strong>避免在 Effect 中读取 state 来计算下一个 state</strong>：使用 <code>setMessages(prev =&gt; [...prev, msg])</code>，这样 Effect 就不需要将 <code>messages</code> 放入依赖项数组，规避死循环。
        </div>
        <div>
          2. <strong>使用 Ref 隔离非响应式逻辑</strong>：例如这里的 <code>isMuted</code>。我们只想在收到消息时获取它的最新值，而不想在用户切换静音时重新建立 WebSocket 连接。用 Ref 保存最新值是完美破除“闭包陈旧”与“无效重启”的标准方案。
        </div>
      </div>
    </div>
  );
}

export default LifecycleOfReactiveEffectsDemo;
