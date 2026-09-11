import { useEffect, useEffectEvent, useState } from "react";

function createConnection(roomId, onConnected) {
  let timer;
  return {
    connect() {
      timer = setTimeout(onConnected, 500);
    },
    disconnect() {
      clearTimeout(timer);
    },
  };
}

export function EffectEventDemo() {
  const [roomId, setRoomId] = useState("general");
  const [theme, setTheme] = useState("light");
  const [connectCount, setConnectCount] = useState(0);
  const [notice, setNotice] = useState("等待连接");

  const onConnected = useEffectEvent(() => {
    setNotice(`已连接 ${roomId}，当前主题 ${theme}`);
  });

  useEffect(() => {
    setConnectCount((n) => n + 1);
    const connection = createConnection(roomId, onConnected);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top"><h2 className="demo-title"><span>📡</span> useEffectEvent：响应式连接 + 非响应式读取</h2><span className="badge badge-blue">React 19.2</span></div>
        <p className="demo-desc">连接是否需要重建由 roomId 决定；连接成功时显示什么主题，只需要读取最新 committed theme，不应该因此重连。</p>
      </div>
      <div className="demo-section">
        <div className="demo-grid-2">
          <div>
            <label>房间</label>
            <select className="form-input" value={roomId} onChange={(e) => setRoomId(e.target.value)}><option>general</option><option>react</option><option>typescript</option></select>
            <label style={{ display: "block", marginTop: 12 }}>主题</label>
            <button className="btn" onClick={() => setTheme((v) => v === "light" ? "dark" : "light")}>切换 theme：{theme}</button>
          </div>
          <div>
            <div className="demo-alert demo-alert-tip"><strong>连接次数：{connectCount}</strong><p>{notice}</p></div>
            <p>观察：只切换 theme 不会增加连接次数；切换 roomId 才触发 cleanup → setup。</p>
          </div>
        </div>
      </div>
      <div className="demo-alert demo-alert-warning"><strong>边界：</strong>Effect Event 不是“绕过 exhaustive-deps”的工具。真正决定外部同步关系的值仍必须放入 Effect dependencies；只有非响应式逻辑适合移入 Effect Event。</div>
    </div>
  );
}

export default EffectEventDemo;
