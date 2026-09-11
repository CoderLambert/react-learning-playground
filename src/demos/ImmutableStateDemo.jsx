import { useState } from "react";

const initialProfile = {
  name: "Ada",
  address: { city: "London", country: "UK" },
};

const initialTasks = [
  { id: 1, title: "理解 Snapshot", done: true },
  { id: 2, title: "掌握不可变更新", done: false },
];

export function ImmutableStateDemo() {
  const [profile, setProfile] = useState(initialProfile);
  const [tasks, setTasks] = useState(initialTasks);
  const [previousProfile, setPreviousProfile] = useState(initialProfile);

  function changeCity() {
    setPreviousProfile(profile);
    setProfile((current) => ({
      ...current,
      address: { ...current.address, city: current.address.city === "London" ? "Tokyo" : "London" },
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
            <button className="btn" type="button" onClick={changeCity}>切换城市</button>
            <div className="demo-alert demo-alert-tip" style={{ marginTop: 12 }}>上一个对象 === 当前对象：<strong>{String(previousProfile === profile)}</strong><br />未修改字段复用，修改路径创建新对象。</div>
          </div>
          <div>
            <h3 className="demo-section-title">数组操作</h3>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}><button className="btn" onClick={addTask}>append</button><button className="btn" onClick={removeDone}>remove done</button><button className="btn" onClick={reverse}>copy + reverse</button></div>
            {tasks.map((task) => <label key={task.id} style={{ display: "flex", gap: 8, padding: "6px 0" }}><input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} />{task.title}</label>)}
          </div>
        </div>
      </div>

      <div className="demo-alert demo-alert-warning"><strong>反模式：</strong><code>profile.address.city = "Tokyo"</code> 或 <code>tasks.reverse(); setTasks(tasks)</code> 会修改旧快照并保留同一引用，破坏调试、memoization 与未来并发特性的假设。</div>
      <div className="demo-alert demo-alert-tip" style={{ marginTop: 10 }}><strong>真实项目：</strong>嵌套过深时先考虑扁平化 State；只有更新表达式确实繁琐时再评估 Immer，而不是用库掩盖糟糕的数据结构。</div>
    </div>
  );
}

export default ImmutableStateDemo;
