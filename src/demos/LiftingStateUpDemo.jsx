import { useState } from 'react';

// 子组件 1：搜索输入框
function SearchInput({value, onChange}) {

  return (
    <input 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      placeholder="输入关键词..."
    />
  );
}

const results = ["React", "Vue", "Angular", "Svelte", "Ember"];

// 子组件 2：展示搜索结果数量
function SearchResultCount({value}) {
  const filteredResults = results.filter(item => item.toLowerCase().includes(value.toLowerCase()));
  // 🔴 错误：因为拿不到 SearchInput 里的 search，导致数据无法同步！
  return <p>搜索结果： {filteredResults.length} 条</p>;
}

export  function SearchApp() {
  const [search, setSearch] = useState('');

  return (
    <div>
      <SearchInput value={search} onChange={setSearch} />
      <hr />
      <SearchResultCount value={search} />
    </div>
  );
}



export function LiftingStateUpDemo() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ marginBottom: "20px" }}>
        <h2>{"🧪 状态提升"}</h2>
        <p style={{ color: "#475569", lineHeight: "1.6" }}>
          在这里记录这个 React 知识点的说明与实验目标。
        </p>
      </div>

      <section style={{ marginBottom: "28px" }}>
        <h3>实验区域</h3>
        <SearchApp></SearchApp>
      </section>
    </div>
  );
}

export default LiftingStateUpDemo;
