import { useState } from "react";

const INITIAL_TASKS = [
  { id: "task-a", title: "修复登录页", owner: "Alice" },
  { id: "task-b", title: "补充单元测试", owner: "Bob" },
  { id: "task-c", title: "发布生产版本", owner: "Carol" },
];

function EditableRow({ task }) {
  const [note, setNote] = useState("");

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(150px, 1fr) minmax(180px, 1fr)",
        gap: "10px",
        alignItems: "center",
        padding: "10px 0",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      <div>
        <div style={{ fontWeight: 700, color: "var(--text-main)", fontSize: "13.5px" }}>{task.title}</div>
        <div style={{ color: "var(--text-subtle)", fontSize: "12px" }}>
          {task.owner} · id: {task.id}
        </div>
      </div>
      <input
        className="form-input"
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder="给这一行输入临时备注"
      />
    </div>
  );
}

function TaskList({ tasks, useIndexKey }) {
  return (
    <div>
      {tasks.map((task, index) => (
        <EditableRow key={useIndexKey ? index : task.id} task={task} />
      ))}
    </div>
  );
}

export function RenderingListsKeyDemo() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [useIndexKey, setUseIndexKey] = useState(true);

  const reverseTasks = () => setTasks((current) => [...current].reverse());
  const removeFirst = () => setTasks((current) => current.slice(1));
  const resetTasks = () => setTasks(INITIAL_TASKS);

  return (
    <div>
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>🧾</span> Rendering Lists 与 key：身份比位置更重要
            </h2>
          </div>
          <span className="badge badge-purple">Identity</span>
        </div>
        <p className="demo-desc">
          <code>map()</code> 只是把数据映射成 JSX。真正决定 React 如何在后续 render 中匹配列表项的是 <code>key</code>。
          当项目支持排序、插入或删除时，稳定业务 ID 才能让组件 State 跟着“数据身份”移动，而不是跟着数组位置移动。
        </p>
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">🧪 实验：先输入备注，再反转列表</h3>
          <p className="demo-section-desc">
            每行的备注是 <code>EditableRow</code> 自己的 State。先给第一行输入一段文字，再点击“反转顺序”，观察备注最终跟着谁。
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "14px" }}>
          <button
            className={useIndexKey ? "btn btn-danger btn-sm" : "btn btn-secondary btn-sm"}
            onClick={() => setUseIndexKey(true)}
          >
            使用 index key
          </button>
          <button
            className={!useIndexKey ? "btn btn-success btn-sm" : "btn btn-secondary btn-sm"}
            onClick={() => setUseIndexKey(false)}
          >
            使用 stable id
          </button>
          <button className="btn btn-primary btn-sm" onClick={reverseTasks}>
            反转顺序
          </button>
          <button className="btn btn-outline btn-sm" onClick={removeFirst} disabled={tasks.length === 0}>
            删除第一项
          </button>
          <button className="btn btn-outline btn-sm" onClick={resetTasks}>
            恢复数据
          </button>
        </div>

        <div className={useIndexKey ? "demo-alert demo-alert-danger" : "demo-alert demo-alert-success"}>
          <div className="demo-alert-title">
            {useIndexKey ? "⚠️ 当前 key = index" : "✅ 当前 key = task.id"}
          </div>
          <div>
            {useIndexKey
              ? "数组位置变化后，React 仍按 0/1/2 匹配组件，行内 State 可能留在原位置，于是备注看起来“跟错任务”。"
              : "稳定 ID 不随排序改变，React 可以把已有组件与同一个业务实体重新匹配，行内 State 会跟着任务身份移动。"}
          </div>
        </div>

        {tasks.length > 0 ? (
          <TaskList tasks={tasks} useIndexKey={useIndexKey} />
        ) : (
          <div className="demo-alert demo-alert-tip">列表为空。点击“恢复数据”重新开始实验。</div>
        )}
      </div>

      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">🧠 key 规则</h3>
        </div>
        <div style={{ display: "grid", gap: "10px" }}>
          <div className="demo-alert demo-alert-success">
            <div className="demo-alert-title">✅ Stable key</div>
            <div>
              key 只需要在<strong>当前兄弟列表</strong>中唯一，并且在同一业务实体的生命周期内保持稳定。后端 ID、数据库主键、本地创建时生成的稳定 UUID 都更合适。
            </div>
          </div>
          <div className="demo-alert demo-alert-danger">
            <div className="demo-alert-title">⚠️ 不要在 render 时生成 key</div>
            <div>
              <code>Math.random()</code> 或每次 render 重新生成 UUID 会让 key 每次都变化，React 会把节点当成全新组件，导致 DOM/State 被重建。index 只适合永不重排、插入、删除的静态列表。
            </div>
          </div>
        </div>
      </div>

      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title">📌 项目判断</div>
        <div>
          如果列表项包含输入框、展开状态、动画状态、局部请求状态，或者列表会发生 reorder / insert / delete，key 的身份模型会直接影响正确性，而不仅仅是消除 console warning。
        </div>
      </div>
    </div>
  );
}

export default RenderingListsKeyDemo;
