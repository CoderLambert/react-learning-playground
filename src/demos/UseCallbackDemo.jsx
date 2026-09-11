import { memo, useCallback, useRef, useState } from "react";

const MemoChild = memo(function MemoChild({ onAdd }) {
  console.count("MemoChild render");

  return (
    <div className="demo-alert demo-alert-success">
      <div className="demo-alert-title">🧒 memo 子组件</div>
      <div>
        只有当 <code>onAdd</code> 的引用保持不变时，父组件的无关 Render 才可能命中 memo。
      </div>
      <button className="btn btn-secondary" onClick={onAdd} style={{ marginTop: "10px" }}>
        子组件调用 onAdd
      </button>
    </div>
  );
});

export function UseCallbackDemo() {
  const [count, setCount] = useState(0);
  const [themeTick, setThemeTick] = useState(0);
  const [stable, setStable] = useState(true);
  const previousCallbackRef = useRef(null);

  const stableCallback = useCallback(() => {
    setCount((value) => value + 1);
  }, []);

  const unstableCallback = () => {
    setCount((value) => value + 1);
  };

  const activeCallback = stable ? stableCallback : unstableCallback;
  const isSameAsPrevious = previousCallbackRef.current
    ? Object.is(previousCallbackRef.current, activeCallback)
    : null;
  previousCallbackRef.current = activeCallback;

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title"><span>📞</span> useCallback：缓存函数 identity，不是让函数执行更快</h2>
          </div>
          <span className="badge badge-purple">性能优化</span>
        </div>

        <p className="demo-desc">
          每次 Render 中声明的函数默认都是新引用。<code>useCallback</code> 会在依赖未变化时返回同一个函数引用，
          主要用于配合 <code>memo</code> 子组件或需要稳定函数 dependency 的 Hook。
        </p>

        <div className="demo-meta-tags">
          <span className="badge badge-gray">Function Identity</span>
          <span className="badge badge-gray">memo</span>
          <span className="badge badge-gray">Dependencies</span>
          <span className="badge badge-gray">Functional Updater</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🧪</span> 实验：函数 prop 是否让 memo 失效</h3>
          <p className="demo-section-desc">
            切换“稳定 callback / 每次新建函数”，再点击“无关 Render”。观察当前函数与上一轮是否为同一引用，
            同时查看 Console 中 <code>MemoChild render</code> 次数。
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "14px" }}>
          <button className="btn btn-primary" onClick={() => setThemeTick((value) => value + 1)}>
            无关 Render：{themeTick}
          </button>
          <button className="btn btn-secondary" onClick={() => setStable((value) => !value)}>
            当前：{stable ? "useCallback 稳定引用" : "普通函数新引用"}
          </button>
        </div>

        <div className="demo-alert demo-alert-tip" style={{ marginBottom: "12px" }}>
          <div className="demo-alert-title">🔎 identity 观察</div>
          <div>
            当前 callback 与上一轮：
            <strong>{isSameAsPrevious === null ? "首次 Render" : isSameAsPrevious ? " 相同引用" : " 不同引用"}</strong>
          </div>
          <div>count：{count}</div>
        </div>

        <MemoChild onAdd={activeCallback} />
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>🧠</span> 为什么这里可以写空依赖</h3>
        </div>

        <div className="comparison-container">
          <div className="comparison-card bad">
            <div className="comparison-header bad"><span>❌</span> 读取 count，依赖不断变化</div>
            <pre style={{ margin: 0, fontSize: "12px", overflowX: "auto" }}>{`const add = useCallback(() => {
  setCount(count + 1);
}, [count]);`}</pre>
            <div style={{ marginTop: "8px", fontSize: "13px" }}>
              count 改变后 callback identity 也会改变，可能让 memo child 再次 render。
            </div>
          </div>

          <div className="comparison-card good">
            <div className="comparison-header good"><span>✅</span> 使用 updater function</div>
            <pre style={{ margin: 0, fontSize: "12px", overflowX: "auto" }}>{`const add = useCallback(() => {
  setCount(value => value + 1);
}, []);`}</pre>
            <div style={{ marginTop: "8px", fontSize: "13px" }}>
              callback 不再需要读取当前 count，因此可以移除这个 reactive dependency。
            </div>
          </div>
        </div>
      </div>

      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title"><span>📌</span> 真实项目边界</div>
        <div>
          不要给所有事件函数机械套 <code>useCallback</code>。普通按钮 handler 通常不需要稳定 identity。
          当函数作为 memoized child 的 prop、其他 Hook 的 dependency，或自定义 Hook 对外 API 时，稳定引用才可能有价值。
          如果没有具体优化目标，直接声明普通函数更清晰。
        </div>
      </div>
    </div>
  );
}

export default UseCallbackDemo;
