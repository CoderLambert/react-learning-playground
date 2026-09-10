import { useState } from "react";
import { useCounter } from "../hooks/useCounter";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

const TOPICS = [
  "React State",
  "useEffect",
  "useReducer",
  "Context",
  "Custom Hooks",
  "Suspense",
  "useTransition",
  "React Compiler",
];

function CounterPanel({ title, initialValue }) {
  const counter = useCounter(initialValue);

  return (
    <div
      style={{
        flex: 1,
        minWidth: "250px",
        padding: "18px",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-sm)",
        background: "var(--bg-surface-secondary)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center" }}>
        <strong style={{ color: "var(--text-main)" }}>{title}</strong>
        <span className="badge badge-blue">独立 State</span>
      </div>

      <div
        style={{
          margin: "18px 0",
          fontSize: "34px",
          fontWeight: 800,
          color: "var(--color-primary)",
        }}
      >
        {counter.count}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        <button className="btn btn-secondary btn-sm" onClick={counter.decrement}>
          -1
        </button>
        <button className="btn btn-primary btn-sm" onClick={counter.increment}>
          +1
        </button>
        <button className="btn btn-outline btn-sm" onClick={counter.reset}>
          Reset
        </button>
      </div>
    </div>
  );
}

export function CustomHooksDemo() {
  const [keyword, setKeyword] = useState("");
  const [delay, setDelay] = useState(600);
  const debouncedKeyword = useDebouncedValue(keyword, delay);

  const normalizedKeyword = debouncedKeyword.trim().toLowerCase();
  const filteredTopics = normalizedKeyword
    ? TOPICS.filter((topic) => topic.toLowerCase().includes(normalizedKeyword))
    : TOPICS;

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>🪝</span> 自定义 Hook：复用状态逻辑，而不是共享 State
            </h2>
          </div>
          <span className="badge badge-green">工程复用</span>
        </div>

        <p className="demo-desc">
          自定义 Hook 是一个以 <code>use</code> 开头、内部可以调用其他 Hook 的 JavaScript
          函数。它最重要的价值不是“少写几行代码”，而是把<strong>状态逻辑、外部同步与业务意图</strong>
          从组件 JSX 中抽离，形成声明式、可组合、可测试的能力。
        </p>

        <div className="demo-meta-tags">
          <span className="badge badge-gray">逻辑复用 ≠ State 共享</span>
          <span className="badge badge-gray">Hook Composition</span>
          <span className="badge badge-gray">Effect Encapsulation</span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🧪</span> 实验 1：同一个 Hook，两份完全独立的 State
          </h3>
          <p className="demo-section-desc">
            两个面板都调用 <code>useCounter()</code>。操作其中一个不会影响另一个，因为每次 Hook
            调用都会创建属于当前组件调用位置的独立状态。
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
          <CounterPanel title="购物车数量" initialValue={1} />
          <CounterPanel title="消息重试次数" initialValue={0} />
        </div>

        <div className="demo-alert demo-alert-tip" style={{ marginTop: "14px" }}>
          <div className="demo-alert-title">
            <span>💡</span> 关键心智
          </div>
          <div>
            自定义 Hook <strong>复用的是“如何管理状态”的代码</strong>。如果多个组件需要共享同一份
            State，应该考虑状态提升、Context 或外部 Store，而不是依赖 Custom Hook 本身。
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>⌛</span> 实验 2：把定时器 Effect 封装成 useDebouncedValue
          </h3>
          <p className="demo-section-desc">
            项目中的搜索框、自动保存、联想请求经常需要防抖。调用组件只表达“我要一个延迟后的值”，
            定时器创建、清理和依赖同步全部由 Hook 内部负责。
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gap: "14px",
            padding: "16px",
            background: "var(--bg-surface-secondary)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="输入 React / Effect / Context..."
              style={{
                flex: "1 1 300px",
                minWidth: "220px",
                padding: "10px 12px",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                background: "var(--bg-surface)",
                color: "var(--text-main)",
              }}
            />

            <select
              value={delay}
              onChange={(event) => setDelay(Number(event.target.value))}
              style={{
                padding: "10px 12px",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                background: "var(--bg-surface)",
                color: "var(--text-main)",
              }}
            >
              <option value={300}>300ms</option>
              <option value={600}>600ms</option>
              <option value={1000}>1000ms</option>
            </select>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            <span className="badge badge-gray">即时值：{keyword || "（空）"}</span>
            <span className="badge badge-blue">防抖值：{debouncedKeyword || "（空）"}</span>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {filteredTopics.map((topic) => (
              <span key={topic} className="badge badge-gray">
                {topic}
              </span>
            ))}
            {filteredTopics.length === 0 && (
              <span style={{ color: "var(--text-subtle)", fontSize: "13px" }}>没有匹配项</span>
            )}
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🏗️</span> 项目中的抽取边界
          </h3>
        </div>

        <div style={{ display: "grid", gap: "10px" }}>
          <div className="demo-alert demo-alert-tip">
            <div className="demo-alert-title">✅ 适合抽成 Custom Hook</div>
            <div>
              需要复用的状态逻辑；浏览器 API / WebSocket / Observer 等外部同步；防抖、媒体查询、
              在线状态等可以用清晰业务名称描述的能力。
            </div>
          </div>

          <div className="demo-alert demo-alert-danger">
            <div className="demo-alert-title">⚠️ 不要为了“封装”而封装</div>
            <div>
              仅包装一次 <code>useState</code>、把所有 Effect 塞进万能 Hook、创建
              <code>useMount</code> / <code>useEffectOnce</code> 来绕开依赖规则，通常都会让真实数据流更难追踪。
              另外，防抖只负责控制触发频率，并不能替代请求取消、缓存、去重和竞态处理。
            </div>
          </div>
        </div>
      </div>

      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title">
          <span>📌</span> 判断标准
        </div>
        <div>
          一个好的 Custom Hook 应该让调用代码更接近业务语言，例如
          <code>useDebouncedValue(keyword, 600)</code>、<code>useOnlineStatus()</code>、
          <code>useChatRoom(options)</code>。如果 Hook 名字很难表达它负责什么，通常说明抽象边界还不够清晰。
        </div>
      </div>
    </div>
  );
}

export default CustomHooksDemo;
