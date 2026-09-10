import { useState } from "react";

// ==========================================
// 子组件 1：搜索输入框 (SearchBox)
// 只负责渲染输入框和派发更新事件，自身不存 query 状态
// ==========================================
function SearchBox({ value, onChange, onClear }) {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        type="text"
        className="form-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="搜索技术栈（如 React, Vue, Vite...）"
        style={{ paddingRight: value ? "32px" : "12px" }}
      />
      {value && (
        <button
          onClick={onClear}
          aria-label="清空搜索"
          style={{
            position: "absolute",
            right: "8px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-subtle)",
            fontSize: "14px",
            padding: "2px",
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}

// ==========================================
// 子组件 2：统计摘要面板 (SearchSummary)
// 接收筛选后的匹配项数量和原始总数
// ==========================================
function SearchSummary({ matchCount, totalCount, query }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 14px",
        background: "var(--bg-surface-secondary)",
        borderRadius: "var(--radius-sm)",
        fontSize: "13px",
      }}
    >
      <div>
        <span>共匹配到 </span>
        <strong style={{ color: matchCount > 0 ? "var(--color-primary)" : "var(--color-danger)" }}>
          {matchCount}
        </strong>
        <span> / {totalCount} 项</span>
      </div>
      {query && (
        <span className="badge badge-blue">
          当前过滤条件: &quot;{query}&quot;
        </span>
      )}
    </div>
  );
}

// ==========================================
// 子组件 3：结果列表 (FrameworkList)
// 接收过滤后的列表并高亮显示匹配文本
// ==========================================
function FrameworkList({ items, query, onSelectItem }) {
  if (items.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-subtle)", fontSize: "14px" }}>
        🔍 未找到与 &quot;{query}&quot; 匹配的前端技术栈
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "10px" }}>
      {items.map((item) => {
        // 简单高亮匹配字词
        const hasMatch = query && item.name.toLowerCase().includes(query.toLowerCase());

        return (
          <div
            key={item.id}
            onClick={() => onSelectItem(item)}
            style={{
              padding: "12px 14px",
              border: hasMatch ? "1px solid var(--color-primary-border)" : "1px solid var(--border-color)",
              backgroundColor: hasMatch ? "var(--color-primary-light)" : "var(--bg-surface)",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
              transition: "all var(--transition-fast)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong style={{ fontSize: "14px", color: hasMatch ? "var(--color-primary-dark)" : "var(--text-main)" }}>
                {item.name}
              </strong>
              <span className="badge badge-gray" style={{ fontSize: "10px" }}>
                {item.type}
              </span>
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-subtle)", marginTop: "4px" }}>
              {item.desc}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ==========================================
// 共同父组件：保存被提升的状态 (Lifted State)
// ==========================================
const INITIAL_FRAMEWORKS = [
  { id: 1, name: "React", type: "UI 库", desc: "构建 Web 与原生交互界面" },
  { id: 2, name: "Vue", type: "渐进式框架", desc: "易学易用、性能出色的 MVVM 框架" },
  { id: 3, name: "Angular", type: "综合平台", desc: "Google 出品的企业级全功能框架" },
  { id: 4, name: "Svelte", type: "编译器", desc: "将声明式代码编译为极小原生的 JS" },
  { id: 5, name: "Next.js", type: "全栈框架", desc: "React 生态服务端渲染利器" },
  { id: 6, name: "Vite", type: "构建工具", desc: "基于原生 ESM 的极速前端开发工具" },
];

export function LiftingStateUpDemo() {
  // 💡 状态被提升至此：query 状态由父级统领
  const [query, setQuery] = useState("");
  const [frameworks, setFrameworks] = useState(INITIAL_FRAMEWORKS);
  const [newFrameworkName, setNewFrameworkName] = useState("");
  const [selectedTech, setSelectedTech] = useState(null);

  // 派生计算：过滤出的列表
  const filteredList = frameworks.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.desc.toLowerCase().includes(query.toLowerCase()),
  );

  const handleAddNew = (e) => {
    e.preventDefault();
    if (!newFrameworkName.trim()) return;
    const newItem = {
      id: Date.now(),
      name: newFrameworkName.trim(),
      type: "自定义",
      desc: "用户动态添加的探索技术项",
    };
    setFrameworks((prev) => [newItem, ...prev]);
    setNewFrameworkName("");
  };

  return (
    <div>
      {/* 头部说明卡片 */}
      <div className="demo-header-card">
        <div className="demo-header-top">
          <div>
            <h2 className="demo-title">
              <span>🪜</span> 状态提升（Lifting State Up）与兄弟协同
            </h2>
          </div>
          <span className="badge badge-blue">单向数据流核心</span>
        </div>
        <p className="demo-desc">
          在 React 中，兄弟组件之间<strong>无法直接横向传递状态</strong>。当两个或多个子组件需要反映相同的数据变化时，必须将该状态提升至它们的<strong>最近公共父组件</strong>中统一管理，并通过 Props 向下分发。
        </p>
        <div className="demo-meta-tags">
          <span className="badge badge-gray">受控输入 (Controlled Input)</span>
          <span className="badge badge-gray">最近共同祖先 (Closest Common Ancestor)</span>
          <span className="badge badge-gray">事件向上回传 (Event Callbacks)</span>
        </div>
      </div>

      {/* 数据流向架构图解 */}
      <div className="demo-alert demo-alert-info">
        <div className="demo-alert-title">
          <span>📐</span> 状态提升架构数据流向
        </div>
        <pre style={{ margin: "6px 0 0 0", fontSize: "12px", background: "#f8fafc", padding: "10px", borderRadius: "6px", overflowX: "auto" }}>
{`       ┌────────────────────────────────────────────────────────┐
       │   公共父组件 LiftingStateUpDemo (持有 [query, setQuery])   │
       └──────────────────────────┬─────────────────────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         │ 传 value + onChange    │ 传 filteredList.length │ 传 filteredList
         ▼                        ▼                        ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ 子组件 SearchBox │    │ 子组件 Summary   │    │ 子组件 List      │
└──────────────────┘    └──────────────────┘    └──────────────────┘`}
        </pre>
      </div>

      {/* 交互实验区域 */}
      <div className="demo-section">
        <div className="demo-section-header">
          <h3 className="demo-section-title">
            <span>🎮</span> 协同联动实验台
          </h3>
          <p className="demo-section-desc">
            在输入框键入关键词，观察输入框、统计卡片和结果列表三者如何实时协同：
          </p>
        </div>

        {/* 顶部搜索输入框 */}
        <div style={{ marginBottom: "14px" }}>
          <SearchBox value={query} onChange={setQuery} onClear={() => setQuery("")} />
        </div>

        {/* 搜索结果统计栏 */}
        <div style={{ marginBottom: "14px" }}>
          <SearchSummary matchCount={filteredList.length} totalCount={frameworks.length} query={query} />
        </div>

        {/* 列表渲染 */}
        <div style={{ marginBottom: "20px" }}>
          <FrameworkList items={filteredList} query={query} onSelectItem={setSelectedTech} />
        </div>

        {/* 选中项提示 */}
        {selectedTech && (
          <div style={{ padding: "12px 16px", background: "var(--color-primary-light)", border: "1px solid var(--color-primary-border)", borderRadius: "var(--radius-sm)", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span>当前选中的卡片：</span>
              <strong>{selectedTech.name}</strong> - {selectedTech.desc}
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => setSelectedTech(null)}>
              取消选中
            </button>
          </div>
        )}

        {/* 动态追加新项 */}
        <form onSubmit={handleAddNew} style={{ display: "flex", gap: "10px", alignItems: "center", paddingTop: "14px", borderTop: "1px solid var(--border-subtle)" }}>
          <input
            type="text"
            className="form-input"
            style={{ maxWidth: "240px" }}
            placeholder="添加新技术栈..."
            value={newFrameworkName}
            onChange={(e) => setNewFrameworkName(e.target.value)}
          />
          <button type="submit" className="btn btn-secondary btn-sm">
            ➕ 添加到列表
          </button>
        </form>
      </div>

      {/* 总结提示 */}
      <div className="demo-alert demo-alert-tip">
        <div className="demo-alert-title">
          <span>💡</span> 状态提升的最佳实践法则
        </div>
        <div>
          1. 寻找消费该状态的所有组件树节点。
        </div>
        <div>
          2. 找到它们在组件树中位置最低的<strong>共同父组件</strong>。
        </div>
        <div>
          3. 将状态与变更方法定义在共同父组件，向下通过 Props 传给子组件消费。
        </div>
      </div>
    </div>
  );
}

export default LiftingStateUpDemo;
