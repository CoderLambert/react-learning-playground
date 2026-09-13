import { useEffect, useRef } from "react";
import "./tokens.css";
import "./WorkbenchShell.css";
import "./ClosureSurfaceFixes.css";

export function WorkbenchShell({
  navigation,
  content,
  inspector = null,
  navigationCollapsed = false,
  mobileNavigationOpen = false,
  inspectorOpen = Boolean(inspector),
  onMobileNavigationClose,
  className = "",
  style,
}) {
  const classes = ["workbench-shell", className].filter(Boolean).join(" ");
  const navigationRef = useRef(null);
  const mobileNavigationOpenerRef = useRef(null);
  const wasMobileNavigationOpenRef = useRef(false);

  useEffect(() => {
    if (mobileNavigationOpen) {
      if (!wasMobileNavigationOpenRef.current) {
        const activeElement = document.activeElement;
        if (activeElement instanceof HTMLElement) mobileNavigationOpenerRef.current = activeElement;
      }
      requestAnimationFrame(() => navigationRef.current?.focus());
    } else if (wasMobileNavigationOpenRef.current) {
      requestAnimationFrame(() => mobileNavigationOpenerRef.current?.focus());
    }
    wasMobileNavigationOpenRef.current = mobileNavigationOpen;
  }, [mobileNavigationOpen]);

  useEffect(() => {
    if (!mobileNavigationOpen || !onMobileNavigationClose) return undefined;
    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      onMobileNavigationClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileNavigationOpen, onMobileNavigationClose]);

  return (
    <div
      className={classes}
      style={style}
      data-navigation-collapsed={navigationCollapsed ? "true" : "false"}
      data-mobile-navigation-open={mobileNavigationOpen ? "true" : "false"}
      data-inspector-open={inspectorOpen && inspector ? "true" : "false"}
    >
      {mobileNavigationOpen && (
        <button
          type="button"
          className="workbench-mobile-scrim"
          aria-label="关闭侧边导航背景"
          tabIndex={-1}
          onClick={onMobileNavigationClose}
        />
      )}
      <aside id="workbench-navigation" ref={navigationRef} className="workbench-navigation-slot" aria-label="学习导航" tabIndex={-1}>{navigation}</aside>
      <section className="workbench-content-slot" inert={mobileNavigationOpen ? true : undefined}>{content}</section>
      {inspector && <aside className="workbench-inspector-slot" aria-label="学习检查器" inert={mobileNavigationOpen ? true : undefined}>{inspector}</aside>}
    </div>
  );
}

export default WorkbenchShell;
