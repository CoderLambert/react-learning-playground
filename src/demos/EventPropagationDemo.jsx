import { useState } from "react";

export function EventPropagationDemo() {
  const [log, setLog] = useState([]);
  const [stopBubble, setStopBubble] = useState(false);

  function push(message) {
    setLog((items) => [message, ...items].slice(0, 8));
  }

  function handleSubmit(event) {
    event.preventDefault();
    push("submit: preventDefault() 阻止浏览器刷新，但不会阻止事件传播");
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <h2 className="demo-title"><span>🖱️</span> Event Handler：事件属于交互，不属于 Effect</h2>
          <span className="badge badge-blue">02-01</span>
        </div>
        <p className="demo-desc">把函数传给 JSX，React 在交互发生时调用它。事件默认向上冒泡；capture 在目标处理前从外向内执行。</p>
        <div className="demo-meta-tags"><span className="badge badge-gray">pass function</span><span className="badge badge-gray">capture / bubble</span><span className="badge badge-gray">stopPropagation</span><span className="badge badge-gray">preventDefault</span></div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title">🎮 传播顺序实验</h3><p className="demo-section-desc">点击内部按钮，观察 capture → target → bubble；再开启 stopPropagation 比较差异。</p></div>
        <label style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}><input type="checkbox" checked={stopBubble} onChange={(e) => setStopBubble(e.target.checked)} />按钮调用 stopPropagation()</label>
        <div onClickCapture={() => push("1. parent capture")} onClick={() => push("3. parent bubble")} style={{ padding: 20, border: "1px solid var(--border-color)", borderRadius: 10 }}>
          <button className="btn btn-primary" type="button" onClick={(event) => { push("2. button target"); if (stopBubble) event.stopPropagation(); }}>点击内部按钮</button>
        </div>
        <div style={{ marginTop: 12, display: "grid", gap: 6 }}>{log.length ? log.map((item, index) => <code key={`${item}-${index}`}>{item}</code>) : <span className="demo-section-desc">暂无事件</span>}</div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title">🧪 preventDefault ≠ stopPropagation</h3></div>
        <form onSubmit={handleSubmit}><button className="btn" type="submit">提交表单</button></form>
        <div className="demo-alert demo-alert-tip" style={{ marginTop: 12 }}><strong>正确做法：</strong>购买、提交、播放等“用户做了某件事”直接写在 Event Handler；不要先 set 一个 flag，再用 Effect 间接响应点击。</div>
        <div className="demo-alert demo-alert-warning" style={{ marginTop: 10 }}><strong>常见错误：</strong><code>onClick={handleClick()}</code> 会在 render 时调用函数；应传 <code>onClick={handleClick}</code>。</div>
      </div>
    </div>
  );
}

export default EventPropagationDemo;
