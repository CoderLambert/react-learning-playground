import { useState } from "react";

const initialProfile = {
  name: "Ada",
  address: { city: "London", country: "UK" },
};

const initialTasks = [
  { id: 1, title: "理解 Snapshot", done: true },
  { id: 2, title: "掌握不可变更新", done: false },
];

const initialMutationProbe = {
  city: "London",
};

export function ImmutableStateDemo() {
  const [profile, setProfile] = useState(initialProfile);
  const [tasks, setTasks] = useState(initialTasks);
  const [previousProfile, setPreviousProfile] = useState(initialProfile);
  const [mutationProbe, setMutationProbe] = useState(initialMutationProbe);
  const [unrelatedRender, setUnrelatedRender] = useState(0);

  function changeCity() {
    setPreviousProfile(profile);
    setProfile((current) => ({
      ...current,
      address: { ...current.address, city: current.address.city === "London" ? "Tokyo" : "London" },
    }));
  }

  function mutateSameReference() {
    mutationProbe.city = mutationProbe.city === "London" ? "Tokyo" : "London";
    setMutationProbe(mutationProbe);
  }

  function updateProbeWithCopy() {
    setMutationProbe((current) => ({
      ...current,
      city: current.city === "London" ? "Tokyo" : "London",
    }));
  }

  function toggleTask(id) {
    setTasks((items) => items.map((task) => task.id === id ? { ...task, done: !task.done } : task));
  }

  function addTask() {
    setTasks((items) => [...items, { id: Date.now(), title: `新任务 ${items.length + 1}`, done: false }]);
  }

  function removeDone() {
    setTasks((items) => items.filter((task) => !task.done));
  }

  function reverse() {
    setTasks((items) => [...items].reverse());
  }

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top"><h2 className="demo-title"><span>🧊</span> Object / Array State：把快照当只读值</h2><span className="badge badge-blue">02-05</span></div>
        <p className="demo-desc">对象和数组在 JavaScript 中可变，但放进 React State 后应按只读快照处理：修改时创建新引用，并复制所有被修改路径。</p>
        <div className="demo-meta-tags"><span className="badge badge-gray">spread</span><span className="badge badge-gray">map / filter</span><span className="badge badge-gray">nested copy</span><span className="badge badge-gray">reference identity</span></div>
      </div>

      <div className="demo-section">
        <div className="demo-grid-2">
          <div>
            <h3 className="demo-section-title">嵌套对象</h3>
            <p>{profile.name} · {profile.address.city}, {profile.address.country}</p>
            <button className="btn" type="button" onClick={changeCity}>切换城市（copy）</button>
            <div className="demo-alert demo-alert-tip" style={{ marginTop: 12 }}>上一个对象 === 当前对象：<strong>{String(previousProfile === profile)}</strong><br />未修改字段复用，修改路径创建新对象。</div>
          </div>
          <div>
            <h3 className="demo-section-title">数组操作</h3>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}><button className="btn" onClick={addTask}>append</button><button className="btn" onClick={removeDone}>remove done</button><button className="btn" onClick={reverse}>copy + reverse</button></div>
            {tasks.map((task) => <label key={task.id} style={{ display: "flex", gap: 8, padding: "6px 0" }}><input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} />{task.title}</label>)}
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h3 className="demo-section-title">反例实验：mutate + set 同一个引用</h3>
        <p>React 当前渲染出的城市：<strong>{mutationProbe.city}</strong> · 无关 render 次数：{unrelatedRender}</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="btn" type="button" onClick={mutateSameReference}>错误：mutate + set 同引用</button>
          <button className="btn" type="button" onClick={() => setUnrelatedRender((count) => count + 1)}>触发一次无关 render</button>
          <button className="btn" type="button" onClick={updateProbeWithCopy}>正确：copy + set 新引用</button>
        </div>
        <div className="demo-alert demo-alert-warning" style={{ marginTop: 12 }}>
          先点“错误”按钮：对象已经在事件处理器里被改写，但 setter 收到的仍是同一个对象引用，React 可以跳过这次更新，所以 DOM 不一定立刻变化。再触发一次无关 render，先前被偷偷改写的值会暴露出来——这正是 mutation 破坏旧 snapshot 的问题。
        </div>
      </div>

      <div className="demo-alert demo-alert-warning"><strong>反模式：</strong><code>profile.address.city = "Tokyo"</code> 或 <code>tasks.reverse(); setTasks(tasks)</code> 会修改旧快照并保留同一引用，破坏调试、memoization 与未来并发特性的假设。</div>
      <div className="demo-alert demo-alert-tip" style={{ marginTop: 10 }}><strong>真实项目：</strong>嵌套过深时先考虑扁平化 State；只有更新表达式确实繁琐时再评估 Immer，而不是用库掩盖糟糕的数据结构。</div>
    </div>
  );
}

export default ImmutableStateDemo;
