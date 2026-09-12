import { useReducer } from "react";

// ==========================================
// 1. 初始状态定义
// ==========================================
const initialState = {
  count: 0,
  step: 1,
  history: [], // 记录部分 count 变更轨迹，支持 Undo 撤销
};

// ==========================================
// 2. 纯函数 Reducer：集中管理所有状态转移逻辑
// 时间、随机数、网络请求等非确定性输入应在事件边界产生，再通过 action 传入。
// ==========================================
function counterReducer(state, action) {
  switch (action.type) {
    case "INCREMENT": {
      const nextCount = state.count + state.step;
      return {
        ...state,
        count: nextCount,
        history: [{ type: `+${state.step}`, from: state.count, to: nextCount, time: action.at }, ...state.history.slice(0, 7)],
      };
    }

    case "DECREMENT": {
      const nextCount = state.count - state.step;
      return {
        ...state,
        count: nextCount,
        history: [{ type: `-${state.step}`, from: state.count, to: nextCount, time: action.at }, ...state.history.slice(0, 7)],
      };
    }

    case "SET_STEP": {
      return {
        ...state,
        step: action.payload,
      };
    }

    case "RESET": {
      return {
        ...state,
        count: 0,
        history: [{ type: "RESET", from: state.count, to: 0, time: action.at }, ...state.history.slice(0, 7)],
      };
    }

    case "UNDO": {
      if (state.history.length === 0) return state;
      const lastEntry = state.history[0];
      return {
        ...state,
        count: lastEntry.from,
        history: state.history.slice(1),
      };
    }

    default:
      // 未知 Action 抛出异常，防止静默 Bug
      throw new Error(`未处理的 Action 类型: ${action.type}`);
  }
}

export function StateReducerDemo() {
  const [state, dispatch] = useReducer(counterReducer, initialState);

  function dispatchWithTimestamp(type) {
    dispatch({ type, at: new Date().toLocaleTimeString() });
  }

  return (
    <div>
      {/* 头部说明卡片 */}
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>⚙️</span> 使用 Reducer 替换 State（useReducer 状态转换模式）
            </h2>
          </div>
          <span className="badge badge-purple">结构化状态更新</span>
        </div>
        <p className="demo-desc">
          当同一份状态存在多条相关更新路径、多个事件共享转换规则，或更新逻辑值得独立测试时，将状态更新提取为
          <strong>外部纯函数 Reducer</strong> 能让转换规则更集中、可审计，并通过统一的 <code>dispatch(action)</code> 驱动变更。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">纯函数 Reducer</span>
          <span className="badge badge-gray">统一 Action 调度 (Dispatch)</span>
          <span className="badge badge-gray">部分计数变更历史</span>
        </div>
      </div>

      {/* 交互实验区域 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🎮</span> 状态转换工作台
          </h3>
          <p className="demo-section-desc">
            点击操作按钮调度 Action，观察当前 count、step 与计数变更历史。日志时间在事件处理阶段生成并随 action 传入，Reducer 只消费输入并保持确定性：
          </p>
        </div>

        <div className="demo-grid-2">
          {/* 左侧：计数器主视图 */}
          <div style={{ padding: "20px", background: "var(--bg-surface-secondary)", borderRadius: "var(--radius-md)", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div style={{ fontSize: "12px", color: "var(--text-subtle)", textTransform: "uppercase", letterSpacing: "1px" }}>
                Current Value
              </div>
              <div style={{ fontSize: "48px", fontWeight: "800", color: state.count >= 0 ? "var(--color-primary)" : "var(--color-danger)" }}>
                {state.count}
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
                步长 (Step): <strong>{state.step}</strong>
              </div>
            </div>

            {/* 步长调节 */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>修改步长：</span>
              {[1, 5, 10, 50].map((stepValue) => (
                <button
                  key={stepValue}
                  className={`btn btn-sm ${state.step === stepValue ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => dispatch({ type: "SET_STEP", payload: stepValue })}
                >
                  ±{stepValue}
                </button>
              ))}
            </div>

            {/* 主操作按钮组 */}
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={() => dispatchWithTimestamp("DECREMENT")}
              >
                -{state.step}
              </button>
              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={() => dispatchWithTimestamp("INCREMENT")}
              >
                +{state.step}
              </button>
            </div>

            {/* 辅助按钮 */}
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => dispatch({ type: "UNDO" })}
                disabled={state.history.length === 0}
              >
                ↩️ 撤销一步 (Undo)
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => dispatchWithTimestamp("RESET")}
              >
                🔄 重置归零
              </button>
            </div>
          </div>

          {/* 右侧：部分 count 变更历史 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <h4 style={{ margin: 0, fontSize: "14px", color: "var(--text-main)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>计数变更历史</span>
              <span className="badge badge-gray">{state.history.length} 条记录</span>
            </h4>
            <div style={{ fontSize: "12px", color: "var(--text-subtle)", lineHeight: 1.6 }}>
              这里仅记录 INCREMENT、DECREMENT、RESET 产生的 count 转换；SET_STEP 不写入历史，UNDO 会消费最近一条记录，因此这不是完整的 action trace。
            </div>

            {state.history.length === 0 ? (
              <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--text-subtle)", background: "var(--bg-surface)", border: "1px dashed var(--border-color)", borderRadius: "var(--radius-sm)", fontSize: "13px" }}>
                暂无计数变更记录，点击左侧加减或重置按钮开始操作
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "240px", overflowY: "auto" }}>
                {state.history.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "8px 12px",
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "12px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span className={`badge ${item.type.startsWith("+") ? "badge-green" : item.type.startsWith("-") ? "badge-amber" : "badge-purple"}`}>
                        {item.type}
                      </span>
                      <span>{item.from} ➔ {item.to}</span>
                    </div>
                    <span style={{ color: "var(--text-subtle)", fontSize: "11px" }}>{item.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 对比选型指南 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>⚖️</span> useState 与 useReducer 选型指南
          </h3>
        </div>

        <div className="demo-grid-2">
          <div className="comparison-card" style={{ borderColor: "var(--border-color)" }}>
            <div className="comparison-header" style={{ color: "var(--color-primary)" }}>
              <span>🔹</span> 何时首选 useState？
            </div>
            <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "6px" }}>
              <li>状态简单，更新规则直接。</li>
              <li>多个状态值之间没有需要集中表达的转换规则。</li>
              <li>提取 reducer 只会增加间接层，而不会改善可读性或测试边界。</li>
            </ul>
          </div>

          <div className="comparison-card" style={{ borderColor: "var(--border-color)" }}>
            <div className="comparison-header" style={{ color: "var(--color-purple)" }}>
              <span>🔸</span> 何时考虑 useReducer？
            </div>
            <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "6px" }}>
              <li>同一份状态有多种相关更新路径，需要集中描述转换规则。</li>
              <li>事件语义比散落的 setter 更容易审计和调试。</li>
              <li>复杂状态更新逻辑值得脱离组件做独立测试。</li>
              <li>需要把 dispatch 与 Context 组合用于跨层级操作时，可在下一课继续讨论所有权与传播边界。</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StateReducerDemo;
