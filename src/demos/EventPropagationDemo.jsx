import { useState } from "react";

export function EventPropagationDemo() {
  const [log, setLog] = useState([]);
  const [stopBubble, setStopBubble] = useState(false);
  const [preventDefault, setPreventDefault] = useState(false);

  function append(message) {
    setLog((items) => [...items, message].slice(-12));
  }

  function handleTargetClick(event) {
    append("2. target: button onClick");
    if (preventDefault) {
      event.preventDefault();
      append("   preventDefault() → defaultPrevented=true");
    }
    if (stopBubble) {
      event.stopPropagation();
      append("   stopPropagation() → parent bubble 不再执行");
    }
  }

  function handleSubmit(event) {
    append(`4. form submit: defaultPrevented=${event.defaultPrevented}`);
    event.preventDefault();
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <h2 className="demo-title"><span>🖱️</span> Event Handler：传播与默认行为是两条轴</h2>
          <span className="badge badge-blue">02-01</span>
        </div>
        <p className="demo-desc">一次点击既会沿 React tree 经历 capture / target / bubble，也可能触发浏览器默认行为。stopPropagation 与 preventDefault 控制不同事情。</p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title">🎮 同一次点击，切换两种控制</h3></div>
        <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
          <label><input type="checkbox" checked={stopBubble} onChange={(e) => setStopBubble(e.target.checked)} /> target 调用 stopPropagation()</label>
          <label><input type="checkbox" checked={preventDefault} onChange={(e) => setPreventDefault(e.target.checked)} /> target 调用 preventDefault()</label>
        </div>
        <div
          onClickCapture={() => append("1. parent capture")}
          onClick={(event) => append(`3. parent bubble: defaultPrevented=${event.defaultPrevented}`)}
          style={{ padding: 20, border: "1px solid var(--border-color)", borderRadius: 10 }}
        >
          <form onSubmit={handleSubmit}>
            <button className="btn btn-primary" type="submit" onClick={handleTargetClick}>点击提交按钮</button>
          </form>
        </div>
        <button className="btn" type="button" style={{ marginTop: 10 }} onClick={() => setLog([])}>清空日志</button>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title">🔬 实际事件日志</h3></div>
        <div style={{ display: "grid", gap: 6 }}>
          {log.length ? log.map((item, index) => <code key={`${item}-${index}`}>{item}</code>) : <span className="demo-section-desc">先预测，再点击。</span>}
        </div>
        <div className="demo-alert demo-alert-tip" style={{ marginTop: 12 }}>
          <strong>观察：</strong>stopPropagation 只截断后续传播；preventDefault 不会截断 bubble，但会阻止按钮触发 form submit 这一默认行为。
        </div>
      </div>

      <div className="demo-alert demo-alert-warning">
        <strong>传 handler，不要调用 handler：</strong><code>{"onClick={handleClick}"}</code> 是把函数交给 React；<code>{"onClick={handleClick()}"}</code> 会在 render 时执行。
      </div>
    </div>
  );
}

export default EventPropagationDemo;
