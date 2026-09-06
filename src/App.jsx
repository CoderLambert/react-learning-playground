// 1. 定义一个子组件（注意首字母大写）
function ProfileCard() {
  return (
    <div className="card">
      <h2>开发者名片</h2>
      <p>状态：正在学习 React 声明式 UI</p>
    </div>
  );
}

const skills = [
  {
    title: "产品设计",
    desc: "技能描述",
  },
  {
    title: "产品设计2",
    desc: "技能描述",
  },
  {
    title: "产品设计",
    desc: "技能描述",
  },
];

function skillList({ skills }) {
  return (
    <ul>
      {skills.map((skill, index) => {
        return (
          <li key={index}>
            <h2>{skill.title}</h2>
            <span>{skill.desc}</span>
          </li>
        );
      })}
    </ul>
  );
}

// 2. 导出根组件
export default function App() {
  return (
    <div>
      <h1>我的 React 应用</h1>
      <h4>test</h4>
      {/* 3. 像 HTML 标签一样嵌套使用子组件 */}
      <ProfileCard />
      <skillList skills={skills}></skillList>
    </div>
  );
}
