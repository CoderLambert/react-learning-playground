import "./tokens.css";
import "./WorkbenchShell.css";

/**
 * Layout-only shell for the React Learning Workbench.
 *
 * The shell deliberately owns no demo, note, source, or inspector business state.
 * Consumers control whether navigation is collapsed, whether the mobile drawer is
 * open, and whether an inspector slot is present.
 */
export function WorkbenchShell({
  navigation,
  content,
  inspector = null,
  navigationCollapsed = false,
  mobileNavigationOpen = false,
  inspectorOpen = Boolean(inspector),
  onMobileNavigationClose,
  className = "",
}) {
  const classes = ["workbench-shell", className].filter(Boolean).join(" ");

  return (
    <div
      className={classes}
      data-navigation-collapsed={navigationCollapsed ? "true" : "false"}
      data-mobile-navigation-open={mobileNavigationOpen ? "true" : "false"}
      data-inspector-open={inspectorOpen && inspector ? "true" : "false"}
    >
      {mobileNavigationOpen && (
        <button
          type="button"
          className="workbench-mobile-scrim"
          aria-label="关闭侧边导航"
          onClick={onMobileNavigationClose}
        />
      )}

      <aside className="workbench-navigation-slot" aria-label="学习导航">
        {navigation}
      </aside>

      <section className="workbench-content-slot">{content}</section>

      {inspector && (
        <aside className="workbench-inspector-slot" aria-label="学习检查器">
          {inspector}
        </aside>
      )}
    </div>
  );
}

export default WorkbenchShell;
