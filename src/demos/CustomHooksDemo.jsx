import { useEffect, useState } from "react";

function useOnlineSignal(initial = true) {
  const [online, setOnline] = useState(() => (
    typeof navigator === "undefined" ? initial : navigator.onLine
  ));

  useEffect(() => {
    const handler = () => setOnline(navigator.onLine);
    window.addEventListener("online", handler);
    window.addEventListener("offline", handler);
    return () => {
      window.removeEventListener("online", handler);
      window.removeEventListener("offline", handler);
    };
  }, []);

  return online;
}

function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);
  return { count, increment: () => setCount((n) => n + 1), reset: () => setCount(initial) };
}

function CounterCard({ label }) {
  const { count, increment, reset } = useCounter();
  return <div className="demo-alert demo-alert-tip"><strong>{label}: {count}</strong><div style={{ marginTop: 8 }}><button className="btn" onClick={increment}>+1</button><button className="btn" style={{ marginLeft: 8 }} onClick={reset}>reset</button></div></div>;
}

export function CustomHooksDemo() {
  const online = useOnlineSignal();
  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top"><h2 className="demo-title"><span>🪝</span> Custom Hooks：复用状态逻辑，不共享 State</h2><span className="badge badge-blue">04-07</span></div>
        <p className="demo-desc">自定义 Hook 抽取的是“如何使用 State/Effect”的逻辑。每次调用都拥有独立 State；若需要真正共享数据，应提升 State、使用 Context 或 external store。</p>
      </div>
      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title">🎮 两个 useCounter 调用</h3></div>
        <div className="demo-grid-2"><CounterCard label="A" /><CounterCard label="B" /></div>
        <p>给 A 加 1 不会改变 B：同一个 Hook 实现被复用，但 State 没有共享。</p>
      </div>
      <div className="demo-section">
        <div className="demo-alert demo-alert-tip"><strong>封装 Effect：</strong>useOnlineSignal 把浏览器 online/offline 订阅及 cleanup 隐藏在声明式 API 后面。当前浏览器状态：{online ? "online" : "offline"}</div>
      </div>
      <div className="demo-alert demo-alert-warning"><strong>Rules of Hooks：</strong>自定义 Hook 仍必须在组件或其他 Hook 顶层调用；不要在条件、循环或普通工具函数里调用 Hook。</div>
    </div>
  );
}

export default CustomHooksDemo;
