import { useState } from "react";

export function StateSnapshotQueueDemo() {
  const [count, setCount] = useState(0);
  const [notes, setNotes] = useState([]);

  function log(message) {
    setNotes((items) => [message, ...items].slice(0, 10));
  }

  function replaceThreeTimes() {
    log(`handler snapshot = ${count}`);
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    log(`调用 3 次 setCount(count + 1) 后，当前 handler 仍读到 ${count}`);
  }

  function updateThreeTimes() {
    log(`handler snapshot = ${count}`);
    setCount((c) => c + 1);
    setCount((c) => c + 1);
    setCount((c) => c + 1);
    log("三个 updater 依次进入队列：n→n+1→n+1→n+1");
  }

  function delayedRead() {
    const snapshot = count;
    setCount((c) => c + 1);
    setTimeout(() => log(`timer 来自旧 render：捕获 snapshot=${snapshot}；timer 执行时不会自动改成最新值`), 700);
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top"><h2 className="demo-title"><span>📸</span> State Snapshot + Update Queue</h2><span className="badge badge-blue">02-02 ~ 02-04</span></div>
        <p className="demo-desc">State 不是普通局部变量。每次 render 得到一个固定快照；setter 请求下一次 render，同一事件中的更新会排队并批处理。</p>
        <div className="demo-meta-tags"><span className="badge badge-gray">useState</span><span className="badge badge-gray">snapshot</span><span className="badge badge-gray">batching</span><span className="badge badge-gray">functional updater</span></div>
      </div>

      <div className="demo-section">
        <div className="demo-grid-2">
          <div style={{ padding: 16, background: "var(--bg-surface-secondary)", borderRadius: 10 }}>
            <div>当前这次 render 的 count snapshot</div>
            <strong style={{ fontSize: 34 }}>{count}</strong>
            <div style={{ marginTop: 8, fontSize: 12, color: "var(--text-muted)" }}>事件处理器会闭包捕获创建它的那次 render 的值。</div>
          </div>
          <div style={{ display: "grid", gap: 8, alignContent: "start" }}>
            <button className="btn" type="button" onClick={() => setCount(count + 1)}>+1：替换为 snapshot + 1</button>
            <button className="btn" type="button" onClick={replaceThreeTimes}>连续 3 次 count + 1</button>
            <button className="btn btn-primary" type="button" onClick={updateThreeTimes}>连续 3 次 updater</button>
            <button className="btn" type="button" onClick={delayedRead}>+1 并在 timer 中读取旧快照</button>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title">🔬 可观察结果</h3></div>
        <div style={{ display: "grid", gap: 6 }}>{notes.map((item, index) => <code key={`${item}-${index}`}>{item}</code>)}</div>
        <div className="demo-alert demo-alert-tip" style={{ marginTop: 12 }}><strong>队列模型：</strong><code>setCount(count + 1)</code> 在同一 render 中都基于同一个 snapshot；<code>setCount(c =&gt; c + 1)</code> 把 updater 加入队列，React 在处理队列时把前一个 updater 的结果交给后一个。</div>
        <div className="demo-alert demo-alert-warning" style={{ marginTop: 10 }}><strong>边界：</strong>functional updater 解决“基于前值更新”的队列问题，不是读取任意最新 state 的逃生舱；异步流程仍应明确其数据时序。</div>
      </div>
    </div>
  );
}

export default StateSnapshotQueueDemo;
