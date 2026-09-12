import { useState } from "react";

function simulateQueue(snapshot, operations) {
  let pending = snapshot;
  const steps = operations.map((operation) => {
    if (operation.type === "replace") {
      pending = operation.value;
      return `${operation.label} → ${pending}`;
    }

    const before = pending;
    pending = operation.apply(pending);
    return `${operation.label}: ${before} → ${pending}`;
  });

  return { steps, result: pending };
}

export function StateSnapshotQueueDemo() {
  const [count, setCount] = useState(0);
  const [scenario, setScenario] = useState(null);

  function runScenario(name, operations, applyUpdates) {
    const snapshot = count;
    const simulation = simulateQueue(snapshot, operations);
    setScenario({ name, snapshot, ...simulation });
    applyUpdates(snapshot);
  }

  function replaceThreeTimes() {
    runScenario(
      "Replace × 3",
      [
        { type: "replace", value: count + 1, label: `replace ${count + 1}` },
        { type: "replace", value: count + 1, label: `replace ${count + 1}` },
        { type: "replace", value: count + 1, label: `replace ${count + 1}` },
      ],
      (snapshot) => {
        setCount(snapshot + 1);
        setCount(snapshot + 1);
        setCount(snapshot + 1);
      },
    );
  }

  function updaterThreeTimes() {
    runScenario(
      "Updater × 3",
      [
        { type: "update", apply: (value) => value + 1, label: "+1 updater" },
        { type: "update", apply: (value) => value + 1, label: "+1 updater" },
        { type: "update", apply: (value) => value + 1, label: "+1 updater" },
      ],
      () => {
        setCount((value) => value + 1);
        setCount((value) => value + 1);
        setCount((value) => value + 1);
      },
    );
  }

  function replaceThenUpdater() {
    runScenario(
      "Replace + Updater",
      [
        { type: "replace", value: count + 5, label: `replace ${count + 5}` },
        { type: "update", apply: (value) => value + 1, label: "+1 updater" },
      ],
      (snapshot) => {
        setCount(snapshot + 5);
        setCount((value) => value + 1);
      },
    );
  }

  function replaceUpdaterReplace() {
    runScenario(
      "Replace + Updater + Replace",
      [
        { type: "replace", value: count + 5, label: `replace ${count + 5}` },
        { type: "update", apply: (value) => value + 1, label: "+1 updater" },
        { type: "replace", value: 42, label: "replace 42" },
      ],
      (snapshot) => {
        setCount(snapshot + 5);
        setCount((value) => value + 1);
        setCount(42);
      },
    );
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top"><h2 className="demo-title"><span>📸</span> State Snapshot + Update Queue</h2><span className="badge badge-blue">02-02 ~ 02-04</span></div>
        <p className="demo-desc">setter 不会修改当前 render 已经拿到的 state；它把更新请求加入队列。下面直接观察 replace update 与 updater function 如何按顺序计算下一份 state。</p>
      </div>

      <div className="demo-section">
        <div className="demo-grid-2">
          <div style={{ padding: 16, background: "var(--bg-surface-secondary)", borderRadius: 10 }}>
            <div>当前 render 的 count snapshot</div>
            <strong style={{ fontSize: 34 }}>{count}</strong>
            <div style={{ marginTop: 8, fontSize: 12, color: "var(--text-muted)" }}>点击按钮后，当前 handler 仍读取这份 snapshot；React 会为下一次 render 处理队列。</div>
          </div>
          <div style={{ display: "grid", gap: 8, alignContent: "start" }}>
            <button className="btn" type="button" onClick={replaceThreeTimes}>Replace × 3</button>
            <button className="btn btn-primary" type="button" onClick={updaterThreeTimes}>Updater × 3</button>
            <button className="btn" type="button" onClick={replaceThenUpdater}>Replace + Updater</button>
            <button className="btn" type="button" onClick={replaceUpdaterReplace}>Replace + Updater + Replace 42</button>
            <button className="btn" type="button" onClick={() => { setCount(0); setScenario(null); }}>Reset</button>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-section-header"><h3 className="demo-section-title">🔬 Queue Debugger</h3></div>
        {scenario ? (
          <div style={{ display: "grid", gap: 8 }}>
            <code>scenario: {scenario.name}</code>
            <code>handler snapshot: {scenario.snapshot}</code>
            {scenario.steps.map((step, index) => <code key={`${step}-${index}`}>{index + 1}. {step}</code>)}
            <div className="demo-alert demo-alert-tip"><strong>next render state：</strong>{scenario.result}</div>
          </div>
        ) : <span className="demo-section-desc">选择一个场景，先预测结果，再对照队列。</span>}
      </div>

      <div className="demo-alert demo-alert-warning">
        <strong>不要背“setState 是异步的”：</strong>更准确的模型是“当前 render 的 state 不会被 setter 改写；setter 请求新的 render，React 按顺序处理队列得到下一份 state”。
      </div>
    </div>
  );
}

export default StateSnapshotQueueDemo;
