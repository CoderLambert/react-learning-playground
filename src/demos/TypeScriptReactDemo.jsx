import { useRef, useState } from "react";

const TOPICS = {
  props: {
    title: "Props / children = component contract",
    detail: "运行时 Demo 只能展示组件行为；真正的 props / children 类型约束请在 Source 里看 TSX。普通可渲染 children 通常是 ReactNode，只有 API 确实要求一个 element 对象时才收窄为 ReactElement。",
    boundary: "TypeScript 不能可靠表达“children 只能是某一种 JSX 标签”；不要把 JSX.Element 当成所有业务组件 API 的默认类型。",
  },
  event: {
    title: "Event = 保留具体元素关系",
    detail: "这里的输入框运行时只说明 onChange 如何驱动 State；Source 中对应的 handler 用 ChangeEvent<HTMLInputElement> 保留 currentTarget/value 的具体元素类型。",
    boundary: "浏览器不会显示 TypeScript diagnostics。事件类型是否正确必须由编辑器/tsc 检查，而不是靠这个 Demo。",
  },
  state: {
    title: "State = 静态模型与运行时 transition 是两件事",
    detail: "运行时你能观察 setState 后的下一次 render；Source 中 discriminated union 则负责限制哪些状态组合在开发期允许存在。",
    boundary: "union 能减少非法状态，但不能证明业务 transition 一定正确；交互测试仍然需要。",
  },
  ref: {
    title: "Ref = 运行时 DOM target + 静态 nullable contract",
    detail: "点击按钮可观察 ref 聚焦输入框。Source 用 HTMLInputElement | null 描述真实生命周期：首次 render 时节点尚未 commit，ref 可能为空。",
    boundary: "类型正确不代表应该用 ref。能用 props/state 表达的数据流，仍应优先保持声明式。",
  },
  generic: {
    title: "Generic = 保留调用方输入输出关系",
    detail: "Demo 只解释为什么需要这种 contract；Source 中 SelectList<T> 和 useHistory<T> 才展示 items、renderItem、onSelect、current/update 如何共享同一个 T。",
    boundary: "泛型必须连接真实关系。若只是把 unknown/any 换成一个字母 T，而调用方没有得到更强约束，就没有价值。",
  },
};

export function TypeScriptReactDemo() {
  const [topic, setTopic] = useState("props");
  const [name, setName] = useState("Lambert");
  const inputRef = useRef(null);
  const current = TOPICS[topic];

  function focusInput() {
    inputRef.current?.focus();
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <h2 className="demo-title"><span>🔷</span> TypeScript for React：运行时行为 ≠ 类型检查</h2>
          <span className="badge badge-blue">TypeScript</span>
        </div>
        <p className="demo-desc">
          中间 Demo 只展示 React 运行时行为与组件 contract 的含义；真正的 TypeScript 类型写法在 Source，真正的 diagnostics 由编辑器 / tsc / CI 负责。
        </p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>🧭</span> 三层职责</h3></div>
        <div className="demo-grid-2">
          <div className="demo-alert demo-alert-tip">
            <div className="demo-alert-title">Demo：观察运行时</div>
            <p>事件触发、State 更新、下一次 render、ref 聚焦都是真实浏览器行为，但这里不会产生 TypeScript 编译错误。</p>
          </div>
          <div className="demo-alert demo-alert-warning">
            <div className="demo-alert-title">Source / CI：证明静态 contract</div>
            <p>Source 展示 TSX；`@ts-expect-error` 等非法样例必须由未来的 typecheck gate 证明“确实会报错”。</p>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>🧠</span> 选择一个类型边界</h3></div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          {Object.keys(TOPICS).map((key) => (
            <button key={key} type="button" className="btn" aria-pressed={topic === key} onClick={() => setTopic(key)}>{key}</button>
          ))}
        </div>
        <div className="demo-alert demo-alert-tip">
          <div className="demo-alert-title">{current.title}</div>
          <p>{current.detail}</p>
        </div>
        <div className="demo-alert demo-alert-warning" style={{ marginTop: 10 }}>
          <div className="demo-alert-title">边界 / 反模式</div>
          <p>{current.boundary}</p>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>🎮</span> 可观察实验：event + state + ref</h3></div>
        <label style={{ display: "grid", gap: 6, maxWidth: 360 }}>
          <span>开发者名称</span>
          <input ref={inputRef} value={name} onChange={(event) => setName(event.currentTarget.value)} />
        </label>
        <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
          <button type="button" className="btn" onClick={focusInput}>通过 ref 聚焦输入框</button>
          <button type="button" className="btn" onClick={() => setName("React Learner")}>更新 State</button>
        </div>
        <p style={{ marginTop: 12 }}>当前运行时 State：<strong>{name || "（空）"}</strong></p>
        <p className="demo-hint">完成操作后切换到 Source：把这里看到的行为，对照到事件类型、nullable ref、受控 props 和 union/generic contract。</p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>🏗️</span> 项目决策</h3></div>
        <div className="demo-grid-2">
          <div className="demo-alert demo-alert-tip"><div className="demo-alert-title">优先建模</div><p>公共组件 Props、互斥状态 union、具体 DOM event/ref target、受控组件 value/callback 关系、复用 API 的输入输出关系。</p></div>
          <div className="demo-alert demo-alert-warning"><div className="demo-alert-title">不要过度建模</div><p>局部变量能推导就让 TypeScript 推导；不要为了“类型覆盖率”制造重复注解、无意义泛型或大量断言。</p></div>
        </div>
      </div>
    </div>
  );
}

export default TypeScriptReactDemo;
