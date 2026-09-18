import { useMemo } from "react";
import { buildLearningPath } from "./learningPath";

function getSearchText(unit, categoryName) {
  return [
    unit.title,
    unit.id,
    unit.description,
    unit.badge,
    categoryName,
    ...(unit.keywords ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function formatChapter(chapter) {
  return String(chapter).padStart(2, "0");
}

export function WorkbenchNavigation({
  categories,
  learningUnits,
  activeId,
  viewMode = "focused",
  searchQuery = "",
  onSearchChange,
  onSelectUnit,
  onSelectAll,
  collapsed = false,
  onCollapsedChange,
  className = "",
}) {
  // App composition supplies the canonical LearningUnit collection. Navigation
  // must not infer or normalize registry entries at render time.
  const units = learningUnits;
  const learningPath = useMemo(() => buildLearningPath(units), [units]);
  const activePath = viewMode === "focused" ? learningPath.byUnitId.get(activeId) : null;
  const categoryMap = useMemo(() => new Map(categories.map((category) => [category.id, category])), [categories]);
  const filteredUnits = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return units;
    return units.filter((unit) => getSearchText(unit, categoryMap.get(unit.categoryId)?.name).includes(query));
  }, [categoryMap, searchQuery, units]);
  const groups = useMemo(
    () => categories
      .map((category) => ({ ...category, items: filteredUnits.filter((unit) => unit.categoryId === category.id) }))
      .filter((group) => group.items.length > 0),
    [categories, filteredUnits],
  );
  const navigationClassName = ["workbench-navigation", collapsed ? "is-collapsed" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={navigationClassName}>
      <div className="workbench-navigation-header">
        <div className="workbench-brand-row">
          <div className="workbench-brand-icon" aria-hidden="true">⚛️</div>
          {!collapsed && (
            <div className="workbench-brand-copy">
              <div className="workbench-brand-title-row">
                <h1>React 核心实验室</h1>
                <span>React 19</span>
              </div>
              <p>Demo、笔记与源码协同学习工作台</p>
            </div>
          )}
          <button
            type="button"
            className="workbench-navigation-collapse"
            onClick={() => onCollapsedChange?.(!collapsed)}
            aria-label={collapsed ? "展开左侧导航" : "收起左侧导航"}
            aria-pressed={collapsed}
            title={collapsed ? "展开导航" : "收起导航"}
          >
            {collapsed ? "›" : "‹"}
          </button>
        </div>

        {!collapsed && (
          <label className="workbench-navigation-search">
            <span aria-hidden="true">🔍</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchChange?.(event.target.value)}
              placeholder="搜索知识点或关键词..."
              aria-label="搜索知识点或关键词"
            />
          </label>
        )}
      </div>

      <nav className="workbench-navigation-list" aria-label="React 学习内容">
        <button
          type="button"
          className={`workbench-navigation-overview ${viewMode === "all" ? "is-active" : ""}`}
          onClick={onSelectAll}
          title={collapsed ? `全部功能完整总览（${units.length} 篇）` : undefined}
        >
          <span aria-hidden="true">🌟</span>
          {!collapsed && (
            <>
              <span>全部功能完整总览</span>
              <span className="workbench-navigation-count">{units.length} 篇</span>
            </>
          )}
        </button>

        {!collapsed && activePath && (
          <section aria-label="当前学习路径" data-learning-path-current style={{ marginBottom: 14 }}>
            <div className="workbench-navigation-group-header">
              <span aria-hidden="true">🧭</span>
              <span>Chapter {formatChapter(activePath.chapter)}</span>
              <span className="workbench-navigation-count">{activePath.position}/{activePath.chapterSize}</span>
            </div>
            <div className="workbench-navigation-items">
              <button
                type="button"
                className="workbench-navigation-overview"
                onClick={() => onSelectUnit?.(activePath.previousId)}
                disabled={!activePath.previousId}
                aria-label="上一知识点"
                data-learning-path-action="previous"
              >
                <span>← 上一知识点</span>
              </button>
              <button
                type="button"
                className={`workbench-navigation-overview ${activeId === activePath.checkpointId ? "is-active" : ""}`}
                onClick={() => onSelectUnit?.(activePath.checkpointId)}
                aria-label={`前往 Chapter ${formatChapter(activePath.chapter)} Checkpoint`}
                data-learning-path-action="checkpoint"
              >
                <span>本章 Checkpoint</span>
              </button>
              <button
                type="button"
                className="workbench-navigation-overview"
                onClick={() => onSelectUnit?.(activePath.nextId)}
                disabled={!activePath.nextId}
                aria-label="下一知识点"
                data-learning-path-action="next"
              >
                <span>下一知识点 →</span>
              </button>
            </div>
          </section>
        )}

        {groups.map((group) => (
          <section key={group.id} className="workbench-navigation-group" aria-label={group.name}>
            <div className="workbench-navigation-group-header" title={collapsed ? group.name : undefined}>
              <span aria-hidden="true">{group.icon}</span>
              {!collapsed && (
                <>
                  <span>{group.name}</span>
                  <span className="workbench-navigation-count">{group.items.length}</span>
                </>
              )}
            </div>
            <div className="workbench-navigation-items">
              {group.items.map((unit) => {
                const active = viewMode === "focused" && activeId === unit.id;
                return (
                  <button
                    key={unit.id}
                    type="button"
                    className={`workbench-navigation-item ${active ? "is-active" : ""}`}
                    onClick={() => onSelectUnit?.(unit.id)}
                    aria-current={active ? "page" : undefined}
                    title={collapsed ? unit.title : unit.description || unit.title}
                  >
                    {collapsed ? (
                      <span className="workbench-navigation-item-marker" aria-hidden="true">{unit.title.slice(0, 1)}</span>
                    ) : (
                      <>
                        <span className="workbench-navigation-item-title">{unit.title}</span>
                        {unit.badge && <span className="workbench-navigation-badge">{unit.badge}</span>}
                      </>
                    )}
                    {collapsed && <span className="sr-only">{unit.title}</span>}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
        {groups.length === 0 && !collapsed && <div className="workbench-navigation-empty">未找到匹配 “{searchQuery}” 的内容</div>}
      </nav>
      <footer className="workbench-navigation-footer">
        {collapsed ? <span title={`${units.length} 个核心模式`}>{units.length}</span> : <span>共收录 {units.length} 个核心模式</span>}
        {!collapsed && <span>⚡ Vite + Oxlint</span>}
      </footer>
    </div>
  );
}

export default WorkbenchNavigation;
