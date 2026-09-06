// 子组件：读取 props，并通过解构赋默认值
//
function UserCard({ name, role = "普通成员", isOnline }) {
  return (
    <div
      style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}
    >
      <h3>{name}</h3>
      <p>身份：{role}</p>
      <p style={{ color: isOnline ? "green" : "gray" }}>
        状态：{isOnline ? "🟢 在线" : "⚪ 离线"}
      </p>
    </div>
  );
}

// 编写一个名为 ProductCard 的商品卡片组件，
// 接收以下 4 个 Props：
// title（字符串，商品名称）
// price（数字，价格）
// discount（数字，折扣比例，例如 0.8 表示 8 折，默认值为 1 即不打折）
// tags（字符串数组，例如 ['包邮', '热销']）
// 在组件内部计算并展示实际售价（price * discount），
// 并用 .map() 渲染出所有的标签 tags。
// 在 App 根组件中渲染三个不同的 <ProductCard/>：
// 第一个：正常传值（如 苹果、价格 10、折扣 0.8、tags ['新鲜']）
// 第二个：不传 discount，验证默认值是否自动计算为原价
// 第三个：声明一个商品数据对象 const item = { title: '香蕉', price: 5, tags: ['热销'] }，
// 使用 属性展开语法 {...item} 传递属性踩坑实验（验证 Props 的只读性）
// ：在 ProductCard 组件内部，尝试写一行修改 prop 的代码（例如 props.price = 999 或 price = 999），
// 保存后查看 Console 控制台或页面提示，看看发生了什么！

function ProductCard({ title = "暂无标题", price, discount = 1, tags = [] }) {
  return (
    <>
      <div style={{ margin: "20px", border: "1px solid gray" }}>
        {title} 实际售价： {price * discount}
        {tags.map((tag) => (
          <span
            key={tag}
            style={{ border: "1px solid black", marginLeft: "16px" }}
          >
            {tag}
          </span>
        ))}
      </div>
    </>
  );
}

// 父组件：向子组件传递各种类型的 Props
export default function App() {
  const adminData = {
    name: "管理员 Alex",
    role: "超级管理员",
    isOnline: true,
  };

  const item = { title: "香蕉", price: 5, tags: ["热销"] };
  return (
    <div>
      <h2>团队成员列表</h2>
      {/* 1. 传递基本类型：字符串、布尔值 */}
      <UserCard name="张三" isOnline={true} />

      {/* 2. 靠默认值生效（未传 role，使用默认值 '普通成员'） */}
      <UserCard name="李四" isOnline={false} />

      {/* 3. 使用对象展开语法批量传递 */}
      <UserCard {...adminData} />
      <ProductCard
        title="产品1"
        price={20}
        discount={0.3}
        tags={["11", "22"]}
      ></ProductCard>
      <ProductCard title="产品2" price={20} tags={["11", "22"]}></ProductCard>
      <ProductCard title="产品2" price={20}></ProductCard>
      <ProductCard {...item}></ProductCard>
    </div>
  );
}
