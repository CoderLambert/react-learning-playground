// 1. 定义

const INITIAL_TASKS = [
  { id: "t1", title: "完成阶段 1 学习" },
  { id: "t2", title: "复习 React 渲染原理" },
  { id: "t3", title: "提交代码作业" },
];

function TaskList() {
  return (
    <div>
      {INITIAL_TASKS.map((task, index) => (
        <li key={task.id}>
          <input type="text" name="test-input" placeholder="输入备注" />

          <h2>{task.title}</h2>
        </li>
      ))}
    </div>
  );
}

export default function App() {
  return (
    <>
      <h1> list 渲染与 key 的深层原理</h1>

      <TaskList></TaskList>
    </>
  );
}
