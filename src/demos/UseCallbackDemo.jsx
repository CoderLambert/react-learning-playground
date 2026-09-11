import { memo, useCallback, useState } from "react";

const MemoChild = memo(function MemoChild({ onAdd }) {
  console.count("MemoChild render");

  return (
    <div className="demo-alert demo-alert-success">
      <div className="demo-alert-title">🧒 memo 子组件</div>
      <div>
        当 <code>onAdd</code> 的引用与上一轮相同、且组件自身 State / Context 没有触发更新时，
        父组件的无关 Render 才有机会被 <code>memo</code> 跳过。
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

  const stableCallback = useCallback(() => {
    setCount((value) => value + 1);
  }, []);

  const unstableCallback = () => {
    setCount((value) => value + 1);
  };

  const activeCallback = stable ? stableCallback : unstableCallback;

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
          每次 Render 中声明的函数通常都是新引用。<code>useCallback</code> 会在依赖未变化时返回缓存的函数定义，
          常见用途是配合 <code>memo</code> 子组件，或稳定其他 Hook / 自定义 Hook API 所依赖的函数 identity。
          它只应作为性能优化使用，不是 correctness 工具。
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
            切换“稳定 callback / 每次新建函数”，再点击“无关 Render”。查看 Console 中
            <code>MemoChild render</code> 次数：稳定 callback 模式下，只有父级无关 State 改变时，子组件应能跳过 render；
            普通函数模式则会因为函数 prop identity 每轮变化而重新 render。
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "14px" }}>
          <button className="btn btn-primary" onClick={() => setThemeTick((value) => value + 1)}>
            无关 Render：{themeTick}
          </button>
          <button className="btn btn-secondary" onClick={() => setStable((value) => !value)}>
            当前：{stable ? "useCallback 缓存函数" : "普通函数每轮新建"}
          </button>
        </div>

        <div className="demo-alert demo-alert-tip" style={{ marginBottom: "12px" }}>
          <div className="demo-alert-title">🔎 观察方式</div>
          <div>
            当前模式：<strong>{stable ? "依赖不变时复用 callback identity" : "每次 Render 创建新 callback identity"}</strong>
          </div>
          <div>count：{count}</div>
          <div style={{ marginTop: 6 }}>
            不在 render 中通过 ref 记录“上一轮 callback”来证明 identity；那会为了教学观察而引入 render 阶段可变读写，反而破坏纯渲染示例。
          </div>
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
              callback 不再读取当前 count，因此这个 reactive dependency 可以被移除。
            </div>
          </div>
        </div>
      </div>

      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title"><span>📌</span> 真实项目边界</div>
        <div>
          不要给所有事件函数机械套 <code>useCallback</code>。普通按钮 handler 通常不需要稳定 identity。
          当函数作为 memoized child 的 prop、其他 Hook 的 dependency，或自定义 Hook 对外 API 时，稳定引用才可能有价值。
          如果没有具体优化目标，直接声明普通函数更清晰；启用 React Compiler 的项目还会进一步减少手写 <code>useCallback</code> 的需要。
        </div>
      </div>
    </div>
  );
}

export default UseCallbackDemo;
