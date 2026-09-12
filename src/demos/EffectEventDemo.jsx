import { useEffect, useEffectEvent, useState } from "react";

function createConnection(roomId, onConnected) {
  let timer;

  return {
    connect() {
      timer = setTimeout(() => onConnected(roomId), 500);
    },
    disconnect() {
      clearTimeout(timer);
    },
  };
}

function ReactiveThemeConnection({ roomId, theme }) {
  const [setupCount, setSetupCount] = useState(0);
  const [notice, setNotice] = useState("等待连接");

  useEffect(() => {
    setSetupCount((count) => count + 1);
    const connection = createConnection(roomId, () => {
      setNotice(`已连接 ${roomId}，当前主题 ${theme}`);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]);

  return (
    <div className="demo-alert demo-alert-warning">
      <strong>对照：Effect 依赖 roomId + theme</strong>
      <p>setup 次数：{setupCount}</p>
      <p>{notice}</p>
      <p>切换 theme 会 cleanup 并重新 setup，因为 theme 是这个 Effect 的真实依赖。</p>
    </div>
  );
}

function EffectEventConnection({ roomId, theme }) {
  const [setupCount, setSetupCount] = useState(0);
  const [notice, setNotice] = useState("等待连接");

  const onConnected = useEffectEvent((connectedRoomId) => {
    setNotice(`已连接 ${connectedRoomId}，当前主题 ${theme}`);
  });

  useEffect(() => {
    setSetupCount((count) => count + 1);
    const connection = createConnection(roomId, onConnected);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <div className="demo-alert demo-alert-tip">
      <strong>Effect Event：Effect 只依赖 roomId</strong>
      <p>setup 次数：{setupCount}</p>
      <p>{notice}</p>
      <p>切换 theme 不重建连接；连接回调仍读取最近一次 committed theme。</p>
    </div>
  );
}

export function EffectEventDemo() {
  const [roomId, setRoomId] = useState("general");
  const [theme, setTheme] = useState("light");

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <h2 className="demo-title"><span>📡</span> useEffectEvent：响应式连接 + 非响应式读取</h2>
          <span className="badge badge-blue">React 19.2</span>
        </div>
        <p className="demo-desc">
          用同一组 room/theme 同时驱动两个真实 Effect：左侧把 theme 当作同步依赖，右侧把通知逻辑拆进 Effect Event。
        </p>
      </div>

      <div className="demo-section">
        <div className="demo-grid-2">
          <div>
            <label htmlFor="effect-event-room">房间</label>
            <select
              id="effect-event-room"
              className="form-input"
              value={roomId}
              onChange={(event) => setRoomId(event.target.value)}
            >
              <option>general</option>
              <option>react</option>
              <option>typescript</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block" }}>主题</label>
            <button className="btn" type="button" onClick={() => setTheme((value) => value === "light" ? "dark" : "light")}>
              切换 theme：{theme}
            </button>
          </div>
        </div>
      </div>

      <div className="demo-grid-2">
        <ReactiveThemeConnection roomId={roomId} theme={theme} />
        <EffectEventConnection roomId={roomId} theme={theme} />
      </div>

      <div className="demo-alert demo-alert-warning" style={{ marginTop: 12 }}>
        <strong>观察顺序：</strong>先只切换 theme：左侧 setup 增加，右侧不增加；再切换 roomId：两侧都应重新 setup。
        <p style={{ marginBottom: 0, fontSize: 12 }}>
          开发环境启用 Strict Mode 时，初次挂载可能额外经历 setup → cleanup → setup 压力测试，因此比较“同一次操作前后是否增加”比比较绝对初始数字更可靠。
        </p>
      </div>

      <div className="demo-alert demo-alert-tip">
        <strong>边界：</strong>Effect Event 只能从 Effect 或其他 Effect Event 调用，也不是绕过 exhaustive-deps 的工具。真正决定外部同步关系的值仍必须保留为依赖。
      </div>
    </div>
  );
}

export default EffectEventDemo;
