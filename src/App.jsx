import { useState, useMemo, lazy, Suspense } from "react";
import "./App.css";
import { demos, CATEGORIES } from "./demos";
import { ChapterCheckpoint, getCheckpointChapter } from "./components/ChapterCheckpoint";

const CodeViewer = lazy(() => import("./components/CodeViewer"));

export default function App() {
  const [activeTab, setActiveTab] = useState(demos[0]?.id || "props");
  const [viewMode, setViewMode] = useState("focused"); // "focused" | "all"
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // 根据搜索词过滤 Demo 列表
  const filteredDemos = useMemo(() => {
    if (!searchQuery.trim()) return demos;
    const q = searchQuery.toLowerCase();
    return demos.filter(
      (d) => {
        const category = CATEGORIES.find((item) => item.id === d.category);
        return (
          d.label.toLowerCase().includes(q) ||
          d.id.toLowerCase().includes(q) ||
          d.description?.toLowerCase().includes(q) ||
          d.badge?.toLowerCase().includes(q) ||
          category?.name.toLowerCase().includes(q)
        );
      },
    );
  }, [searchQuery]);

  // 按分类对 Demo 进行聚合
  const categorizedDemos = useMemo(() => {
    return CATEGORIES.map((category) => {
      const items = filteredDemos.filter((d) => d.category === category.id);
      return {
        ...category,
        items,
      };
    }).filter((group) => group.items.length > 0);
  }, [filteredDemos]);

  // 获取当前选中的 Demo
  const currentDemo = useMemo(
    () => demos.find((d) => d.id === activeTab) || demos[0],
    [activeTab],
  );

  const currentCategory = useMemo(
    () => CATEGORIES.find((c) => c.id === currentDemo?.category),
    [currentDemo],
  );

  const currentCheckpointChapter = currentDemo ? getCheckpointChapter(currentDemo.id) : null;

  const handleSelectDemo = (id) => {
    setActiveTab(id);
    setViewMode("focused");
    setIsMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectAll = () => {
    setViewMode("all");
    setIsMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app-shell">
      {/* 移动端遮罩层 */}
      {isMobileOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.4)",
            zIndex: 45,
            backdropFilter: "blur(2px)",
          }}
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* 侧边导航栏 */}
      <aside className={`app-sidebar ${isMobileOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="brand-wrapper">
            <div className="brand-icon">⚛️</div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <h1 className="brand-title">React 核心实验室</h1>
                <span className="brand-badge">React 19</span>
              </div>
            </div>
          </div>
          <p className="brand-desc">
            系统级进阶实践：组件组合、状态模式、Context 优化与副作用闭环
          </p>

          <div className="sidebar-search-box">
            <span className="sidebar-search-icon">🔍</span>
            <input
              type="text"
              className="sidebar-search-input"
              placeholder="搜索知识点或关键词..."
              aria-label="搜索知识点或关键词"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <nav className="sidebar-content">
          <button
            className={`all-overview-btn ${viewMode === "all" ? "active" : ""}`}
            onClick={handleSelectAll}
          >
            <span>🌟</span>
            <span>全部功能完整总览</span>
            <span className="nav-item-badge">{demos.length} 篇</span>
          </button>

          {categorizedDemos.map((group) => (
            <div key={group.id} className="category-group">
              <div className="category-group-header">
                <span className="category-group-title">
                  <span>{group.icon}</span>
                  <span>{group.name}</span>
                </span>
                <span className="category-count">{group.items.length}</span>
              </div>

              {group.items.map((item) => {
                const isActive = viewMode === "focused" && activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    className={`nav-item ${isActive ? "active" : ""}`}
                    onClick={() => handleSelectDemo(item.id)}
                    title={item.description}
                  >
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.label}
                    </span>
                    {item.badge && <span className="nav-item-badge">{item.badge}</span>}
                  </button>
                );
              })}
            </div>
          ))}

          {categorizedDemos.length === 0 && (
            <div style={{ textAlign: "center", padding: "32px 16px", color: "var(--text-subtle)", fontSize: "13px" }}>
              未找到匹配 “{searchQuery}” 的内容
            </div>
          )}
        </nav>

        <div className="sidebar-footer">
          <span>共收录 {demos.length} 个核心模式</span>
          <span>⚡ Vite + Oxlint</span>
        </div>
      </aside>

      {/* 主工作舞台 */}
      <div className="app-main">
        {/* 顶部操作导航条 */}
        <header className="top-bar">
          <div className="top-bar-left">
            <button
              className="mobile-menu-toggle"
              onClick={() => setIsMobileOpen((prev) => !prev)}
              aria-label="打开侧边导航"
            >
              ☰
            </button>
            <div className="breadcrumb-nav">
              <span className="breadcrumb-category">
                {viewMode === "all" ? "总览模式" : currentCategory?.name || "核心实验"}
              </span>
              <span className="breadcrumb-sep">/</span>
              <span className="breadcrumb-current">
                {viewMode === "all" ? "全部知识点看板" : currentDemo?.label}
              </span>
            </div>
          </div>

          <div className="top-bar-right">
            <div className="view-mode-pill">
              <button
                className={`view-mode-btn ${viewMode === "focused" ? "active" : ""}`}
                onClick={() => setViewMode("focused")}
              >
                单篇聚焦
              </button>
              <button
                className={`view-mode-btn ${viewMode === "all" ? "active" : ""}`}
                onClick={() => setViewMode("all")}
              >
                连续阅读
              </button>
            </div>
          </div>
        </header>

        {/* 页面主内容 */}
        <main className="app-content">
          {viewMode === "focused" ? (
            currentDemo ? (
              <div key={currentDemo.id} className="demo-page">
                <currentDemo.Component />
                <Suspense
                  fallback={
                    <div className="code-accordion-wrapper" style={{ padding: "12px 18px", color: "var(--text-subtle)", fontSize: "12.5px" }}>
                      ⚡ 载入代码视图...
                    </div>
                  }
                >
                  <CodeViewer
                    files={currentDemo.files}
                    fileName={`${currentDemo.id}.jsx`}
                  />
                </Suspense>
                {currentCheckpointChapter && <ChapterCheckpoint chapter={currentCheckpointChapter} />}
              </div>
            ) : null
          ) : (
            <div className="demo-all-container">
              {demos.map((demo, index) => {
                const checkpointChapter = getCheckpointChapter(demo.id);
                return (
                  <div key={demo.id} id={`demo-${demo.id}`}>
                    {index > 0 && <hr className="demo-divider" />}
                    <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
                      <span className="badge badge-blue">案例 {index + 1}</span>
                      <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "var(--text-main)" }}>
                        {demo.label}
                      </h3>
                      <span style={{ fontSize: "12px", color: "var(--text-subtle)" }}>#{demo.id}</span>
                    </div>
                    <demo.Component />
                    <Suspense
                      fallback={
                        <div className="code-accordion-wrapper" style={{ padding: "12px 18px", color: "var(--text-subtle)", fontSize: "12.5px" }}>
                          ⚡ 载入代码视图...
                        </div>
                      }
                    >
                      <CodeViewer
                        files={demo.files}
                        fileName={`${demo.id}.jsx`}
                      />
                    </Suspense>
                    {checkpointChapter && <ChapterCheckpoint chapter={checkpointChapter} />}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
