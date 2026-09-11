import { memo, useMemo, useState } from "react";

const StablePrimitiveChild = memo(function StablePrimitiveChild({ theme }) {
  console.count("StablePrimitiveChild render");

  return (
    <div className="demo-alert demo-alert-success">
      <div className="demo-alert-title">✅ Primitive prop：memo 可命中</div>
      <div>
        当前 theme：<strong>{theme}</strong>。父组件因为无关 State 更新而重新 render 时，
        只要 theme 没变，这个子组件通常会跳过 render。
      </div>
    </div>
  );
});

const FreshObjectChild = memo(function FreshObjectChild({ options }) {
  console.count("FreshObjectChild render");

  return (
    <div className="demo-alert demo-alert-warning">
      <div className="demo-alert-title">⚠️ Fresh object prop：memo miss</div>
      <div>
        options.status = <strong>{options.status}</strong>。虽然内容相同，但父组件每次 render 都创建新对象，
        默认比较时 <code>Object.is(prevOptions, nextOptions)</code> 为 false。
      </div>
    </div>
  );
});

const StableObjectChild = memo(function StableObjectChild({ options }) {
  console.count("StableObjectChild render");

  return (
    <div className="demo-alert demo-alert-success">
      <div className="demo-alert-title">✅ Stable object prop：memo 可再次命中</div>
      <div>
        options.status = <strong>{options.status}</strong>。父组件使用 <code>useMemo</code> 保持引用稳定，
        因此无关 State 更新时可以跳过 render。
      </div>
    </div>
  );
});

export function ReactMemoDemo() {
  const [unrelatedCount, setUnrelatedCount] = useState(0);
  const [theme, setTheme] = useState("light");

  const freshOptions = { status: "active" };
  const stableOptions = useMemo(() => ({ status: "active" }), []);

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>🧠</span> React.memo：命中、失效与 Props Identity
            </h2>
          </div>
          <span className="badge badge-purple">性能优化</span>
        </div>

        <p className="demo-desc">
          <code>memo</code> 的目标不是“禁止组件 render”，而是在父组件重新 render 时，
          当 props 与上一轮相同时跳过一次不必要的子组件 render。默认情况下，React 会逐个 prop 使用
          <code>Object.is</code> 比较；因此 primitive 值稳定时容易命中，而新建对象、数组、函数会改变 identity。
        </p>

        <div className="demo-meta-tags">
          <span className="badge badge-gray">memo</span>
          <span className="badge badge-gray">Object.is</span>
          <span className="badge badge-gray">Prop Identity</span>
          <span className="badge badge-gray">Profiler First</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🧪</span> 实验：同一次父 Render，观察三种 memo 结果
          </h3>
          <p className="demo-section-desc">
            打开浏览器 Console，观察三个子组件的 <code>console.count</code>。先连续点击“更新无关 State”，
            再切换 theme，对比 primitive prop、新对象 prop、稳定对象 prop 的 render 次数。
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
          <button className="btn btn-primary" onClick={() => setUnrelatedCount((count) => count + 1)}>
            更新无关 State：{unrelatedCount}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setTheme((value) => (value === "light" ? "dark" : "light"))}
          >
            切换 theme：{theme}
          </button>
        </div>

        <div style={{ display: "grid", gap: "12px" }}>
          <StablePrimitiveChild theme={theme} />
          <FreshObjectChild options={freshOptions} />
          <StableObjectChild options={stableOptions} />
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🔍</span> 可观察结果
          </h3>
        </div>

        <div className="comparison-container">
          <div className="comparison-card bad">
            <div className="comparison-header bad"><span>❌</span> memo 包了就一定省 Render</div>
            <pre style={{ margin: 0, fontSize: "12px", overflowX: "auto" }}>{`const Child = memo(...);

function Parent() {
  return <Child options={{ status: 'active' }} />;
}`}</pre>
            <div style={{ marginTop: "8px", fontSize: "13px", lineHeight: 1.7 }}>
              每次 Parent render 都创建新的 options；默认比较发现 prop identity 改变，因此 Child 仍会 render。
            </div>
          </div>

          <div className="comparison-card good">
            <div className="comparison-header good"><span>✅</span> 先减少真正有成本的更新</div>
            <div style={{ fontSize: "13px", lineHeight: 1.7 }}>
              如果子组件 render 昂贵、父组件频繁更新、且多数时候 props 不变，memo 才更可能有收益。
              优先传递最小必要 props；只有确实需要稳定对象/函数 identity 时，再配合 useMemo/useCallback。
            </div>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title"><span>📏</span> 真实项目边界</h3>
        </div>

        <div style={{ display: "grid", gap: "10px", fontSize: "13px", lineHeight: 1.75 }}>
          <div><strong>适合：</strong>昂贵可视化组件、大列表中的稳定行组件、频繁父更新但 props 很少变化的叶子节点。</div>
          <div><strong>不适合：</strong>组件本身很轻、props 几乎每次都变化、为了“看起来更专业”而全项目默认 memo。</div>
          <div><strong>注意：</strong>memo 不能阻止组件自己的 State 更新，也不能阻止其消费的 Context 更新。</div>
          <div><strong>判断：</strong>先用 React DevTools Profiler 找到真实热点，再决定是否加入手动 memoization。</div>
        </div>
      </div>

      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title"><span>📌</span> 与 React Compiler 的关系</div>
        <div>
          当前 React Compiler 可以在构建期自动完成大量等价 memoization，因此新代码不应把手写 memo 当默认模板。
          本仓库当前没有启用 Compiler；本实验用于理解手动 memo 的运行模型，而不是声称项目必须这样优化。
        </div>
      </div>
    </div>
  );
}

export default ReactMemoDemo;
