import { useEffect, useEffectEvent, useRef, useState } from "react";

function connectChatSocket(roomId, onMessage) {
  const timerId = setInterval(() => {
    onMessage({
      id: `${roomId}-${Date.now()}`,
      text: `[来自房间 #${roomId} 的实时消息] 当前在线人数: ${Math.floor(Math.random() * 20 + 5)}`,
      time: new Date().toLocaleTimeString(),
    });
  }, 2500);

  return {
    close() {
      clearInterval(timerId);
    },
  };
}

export function LifecycleOfReactiveEffectsDemo() {
  const [roomId, setRoomId] = useState("101");
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [lifecycleLogs, setLifecycleLogs] = useState([]);
  const logSequenceRef = useRef(0);

  const addLifecycleLog = useEffectEvent((type, text) => {
    logSequenceRef.current += 1;
    setLifecycleLogs((prev) => [
      {
        type,
        text: `#${logSequenceRef.current} ${text}`,
        time: new Date().toLocaleTimeString(),
      },
      ...prev.slice(0, 19),
    ]);
  });

  const notifyForMessage = useEffectEvent((newMessage) => {
    setLifecycleLogs((prev) => [
      {
        type: isMuted ? "warn" : "info",
        text: isMuted
          ? `🔕 收到消息；当前静音，不播放提示音：${newMessage.text}`
          : `📩 收到新消息并播放提示音：${newMessage.text}`,
        time: new Date().toLocaleTimeString(),
      },
      ...prev.slice(0, 19),
    ]);
  });

  useEffect(() => {
    addLifecycleLog("success", `🟢 setup：建立房间 #${roomId} 的连接`);

    const socket = connectChatSocket(roomId, (newMessage) => {
      // 函数式 updater 让 Effect 回调无需读取 messages。
      // 因此消息列表更新不会成为“重新建立连接”的依赖。
      setMessages((prev) => [newMessage, ...prev.slice(0, 7)]);
      notifyForMessage(newMessage);
    });

    return () => {
      socket.close();
      addLifecycleLog("warn", `🧹 cleanup：关闭房间 #${roomId} 的连接`);
    };
  }, [roomId]);

  function handleSwitchRoom(nextRoom) {
    if (nextRoom === roomId) return;
    setRoomId(nextRoom);
    setMessages([]);
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div><h2 className="demo-title"><span>🌐</span> 响应式 Effect 的生命周期与依赖</h2></div>
          <span className="badge badge-purple">深度核心</span>
        </div>
        <p className="demo-desc">
          每个 Effect 描述一段独立的同步过程。依赖中的响应式值变化时，React 先用旧值执行 cleanup，再用新值执行 setup；卸载时执行最后一次 cleanup。这里真正决定“连接到哪个房间”的值是 <code>roomId</code>。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">Reactive Values</span>
          <span className="badge badge-gray">Cleanup → Setup</span>
          <span className="badge badge-gray">Functional Updater</span>
          <span className="badge badge-gray">Effect Event</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🎮</span> 实时聊天室连接模拟器</h3>
          <p className="demo-section-desc">
            切换房间会改变同步目标，因此需要断开旧连接再建立新连接；静音只影响“收到消息后做什么”，不应该重新建立 Socket。右侧日志中的 setup/cleanup 由 Effect 本身记录，不是点击 handler 的预测。
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "16px", padding: "12px 16px", background: "var(--bg-surface-secondary)", borderRadius: "var(--radius-sm)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "13px", fontWeight: "600" }}>切换当前房间：</span>
            {["101", "102", "103"].map((id) => (
              <button key={id} className={`btn btn-sm ${roomId === id ? "btn-primary" : "btn-secondary"}`} onClick={() => handleSwitchRoom(id)}>
                房间 #{id}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button className={`btn btn-sm ${isMuted ? "btn-warning" : "btn-outline"}`} onClick={() => setIsMuted((value) => !value)}>
              {isMuted ? "🔕 当前已静音（点击解除）" : "🔔 开启静音（点击静音）"}
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => setLifecycleLogs([])}>清空日志</button>
          </div>
        </div>

        <div className="demo-grid-2">
          <div>
            <div style={{ fontSize: "13px", fontWeight: "600", marginBottom: "8px", color: "var(--text-main)" }}>房间 #{roomId} 实时消息通道</div>
            <div style={{ height: "220px", overflowY: "auto", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", padding: "10px", background: "var(--bg-surface)", display: "flex", flexDirection: "column", gap: "8px" }}>
              {messages.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-subtle)", fontSize: "13px" }}>正在等待房间 #{roomId} 的广播消息...</div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} style={{ padding: "8px 12px", background: "var(--bg-surface-secondary)", borderRadius: "var(--radius-sm)", fontSize: "12.5px" }}>
                    <div style={{ color: "var(--text-subtle)", fontSize: "11px", marginBottom: "3px" }}>{message.time}</div>
                    <div>{message.text}</div>
                  </div>
                ))
              )}
            </div>
            <p style={{ margin: "8px 0 0", fontSize: "12px", color: "var(--text-subtle)" }}>
              等待多条消息：列表会持续更新，但不会出现新的 cleanup/setup。Source 中的 <code>setMessages(prev =&gt; ...)</code> 没有读取 <code>messages</code>，因此消息变化不是连接 Effect 的依赖。
            </p>
          </div>

          <div>
            <div style={{ fontSize: "13px", fontWeight: "600", marginBottom: "8px", color: "var(--text-main)" }}>真实 Effect 同步日志</div>
            <div className="demo-console" style={{ height: "220px", maxHeight: "220px" }}>
              <div className="demo-console-header"><span>EFFECT SETUP / CLEANUP LOG</span><span>{lifecycleLogs.length} 条记录</span></div>
              {lifecycleLogs.map((log, index) => <div key={`${log.time}-${index}`} className={`demo-console-log ${log.type}`}>[{log.time}] {log.text}</div>)}
            </div>
          </div>
        </div>
      </div>

      <div className="demo-grid-2">
        <div className="demo-alert demo-alert-tip">
          <div className="demo-alert-title">依赖不是“运行次数开关”</div>
          <p>依赖数组描述 setup 读取了哪些响应式值。这里 <code>roomId</code> 决定连接目标，所以它必须是依赖；不能为了减少重连而把真实依赖删掉。</p>
        </div>
        <div className="demo-alert demo-alert-tip">
          <div className="demo-alert-title">先改变代码，再改变依赖</div>
          <p>消息追加使用函数式 updater，因此连接 Effect 不必读取 <code>messages</code>。静音则通过 <code>useEffectEvent</code> 在消息到达时读取最新 committed 值；两者都不是通过禁用 linter 来“逃避”依赖。</p>
        </div>
      </div>

      <div className="demo-alert demo-alert-warning" style={{ marginTop: 12 }}>
        <strong>开发环境边界：</strong>启用 Strict Mode 时，React 会额外执行一次开发期 setup → cleanup → setup 压力测试，所以首次进入页面可能看到额外生命周期日志。判断依赖变化时应看日志因果，而不是假设 setup 只会执行一次。
      </div>

      <div className="demo-alert demo-alert-warning" style={{ marginTop: 12 }}>
        <strong>Effect Event 边界：</strong><code>useEffectEvent</code> 不是逃避依赖的工具，也不能作为普通点击 handler 随处调用。它用于 Effect 内部触发的非响应式事件逻辑；真正决定外部同步关系的值仍必须留在依赖中。
      </div>
    </div>
  );
}

export default LifecycleOfReactiveEffectsDemo;
