// 1. 定义

const PRODUCTS = [
  { id: "p1", name: "苹果", price: "$1", isFruit: true },
  { id: "p2", name: "大蒜", price: "$2", isFruit: false },
  { id: "p3", name: "香蕉", price: "$3", isFruit: true },
];

const INITIAL_TASKS = [
  { id: "t1", title: "完成阶段 1 学习" },
  { id: "t2", title: "复习 React 渲染原理" },
  { id: "t3", title: "提交代码作业" },
];

function ShoppingList() {
  return (
    <div>
      <h2>水果与蔬菜清单</h2>
      <ul>
        {PRODUCTS.map((product) => (
          <li
            key={product.id} // ✅ 使用数据自带的稳定性唯一 ID 作为 key
            style={{ color: product.isFruit ? "magenta" : "darkgreen" }}
          >
            {product.name} - {product.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TaskList() {
  return (
    <div>
      {INITIAL_TASKS.map((task, index) => (
        <li key={index}>
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

      <ShoppingList></ShoppingList>
      <TaskList></TaskList>
    </>
  );
}
