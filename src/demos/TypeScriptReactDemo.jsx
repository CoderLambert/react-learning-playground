import { useRef, useState } from "react";

const TOPICS = {
  props: {
    title: "Props / children = component contract",
    detail: "为组件输入定义最小且稳定的 contract。children 通常用 ReactNode；只有确实要求单个 React element 时才收紧为 ReactElement。",
    boundary: "不要为了方便把业务 Props 写成 any，也不要试图用 TypeScript 强制 children 必须是某一种 JSX 标签。",
  },
  event: {
    title: "Event = 从 JSX 位置反推具体事件类型",
    detail: "输入框常见 ChangeEvent<HTMLInputElement>，表单常见 FormEvent<HTMLFormElement>；优先从 JSX handler 的 hover/inference 得到准确类型。",
    boundary: "不要统一写 Event 或 any，否则会丢失 currentTarget/value 等元素级信息。",
  },
  state: {
    title: "State = 让非法状态难以表达",
    detail: "简单 state 依赖推断；复杂异步状态优先 discriminated union，例如 idle/loading/success/error，而不是多个互相矛盾的 boolean。",
    boundary: "类型不是把每个 useState 都写满泛型；重点是状态模型和 transition contract。",
  },
  ref: {
    title: "Ref = 明确 imperative target",
    detail: "DOM ref 指向具体元素类型，例如 HTMLInputElement；初始值通常是 null，因此读取时必须处理尚未挂载的阶段。",
    boundary: "ref 是 escape hatch，不应因为有类型就把普通数据流迁移到 ref。",
  },
  generic: {
    title: "Generic = 保留调用方数据类型关系",
    detail: "泛型组件与 Hook 适合表达 items → renderItem、initialValue → currentValue 这类输入输出关联，而不是为了“高级”而泛型化。",
    boundary: "泛型参数必须表达真实关系；如果所有字段最终都退化为 unknown/any，抽象没有价值。",
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
          <h2 className="demo-title"><span>🔷</span> TypeScript for React：类型写在边界，不是写满每一行</h2>
          <span className="badge badge-blue">TypeScript</span>
        </div>
        <p className="demo-desc">运行层保持 JSX；CodeViewer 提供真实 TSX 类型示例。重点观察 Props、children、event、state、ref 和 generic 如何描述组件之间的 contract。</p>
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
        <p style={{ marginTop: 12 }}>当前可观察 State：<strong>{name || "（空）"}</strong></p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title"><span>🏗️</span> 真实项目边界</h3></div>
        <div className="demo-grid-2">
          <div className="demo-alert demo-alert-tip"><div className="demo-alert-title">应该重点建模</div><p>公共组件 Props、领域状态 union、API/Domain 转换、复用 Hook 的输入输出关系。</p></div>
          <div className="demo-alert demo-alert-warning"><div className="demo-alert-title">不要过度建模</div><p>局部变量能推断就让 TypeScript 推断；不要为了“类型覆盖率”制造重复注解或把所有组件改成泛型。</p></div>
        </div>
      </div>
    </div>
  );
}

export default TypeScriptReactDemo;
