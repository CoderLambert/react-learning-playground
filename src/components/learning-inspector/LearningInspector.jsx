import { useCallback, useEffect, useRef } from "react";
import {
  DEFAULT_INSPECTOR_STATE,
  WORKBENCH_DIMENSIONS,
} from "../../workbench/constants";
import { resolveInspectorPanels } from "../../workbench/inspectorPanels.js";
import { subscribeLearningActions } from "../../learning-actions";
import { clampInspectorWidth } from "./inspectorDimensions";
import { useInspectorScrollMemory } from "./useInspectorScrollMemory";
import "./LearningInspector.css";

export function LearningInspector({
  learningUnit,
  state = DEFAULT_INSPECTOR_STATE,
  onTabChange,
  onOpenChange,
  onFocusModeChange,
  onWidthChange,
  notes,
  source,
  ai,
  assessment,
  panels,
  className = "",
}) {
  const {
    open = true,
    activeTab = "notes",
    focusMode = false,
    width = WORKBENCH_DIMENSIONS.inspectorDefaultWidth,
  } = state;
  const resizeStateRef = useRef(null);
  const animationFrameRef = useRef(null);
  const mobileFocusFrameRef = useRef(null);
  const inspectorRef = useRef(null);
  const closeButtonRef = useRef(null);
  const reopenButtonRef = useRef(null);
  const mobileInspectorOpenerRef = useRef(null);
  const focusModeRef = useRef(focusMode);
  const onOpenChangeRef = useRef(onOpenChange);
  const tabRefs = useRef(new Map());
  focusModeRef.current = focusMode;
  onOpenChangeRef.current = onOpenChange;
  const { getPaneProps } = useInspectorScrollMemory(learningUnit?.id ?? "unknown");
  const resolvedPanels = panels ?? resolveInspectorPanels({ notes, source, ai, assessment });

  const emitWidth = useCallback(
    (nextWidth) => {
      if (!onWidthChange) return;
      const viewportWidth = typeof window === "undefined" ? 1440 : window.innerWidth;
      onWidthChange(clampInspectorWidth(nextWidth, viewportWidth));
    },
    [onWidthChange],
  );

  useEffect(() => subscribeLearningActions((detail) => {
    if (!detail?.prompt) return;
    onOpenChange?.(true);
    onTabChange?.("ai");
  }), [onOpenChange, onTabChange]);

  useEffect(() => {
    if (!focusMode) return undefined;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onFocusModeChange?.(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [focusMode, onFocusModeChange]);

  useEffect(() => {
    if (!open || typeof window === "undefined") return undefined;

    const mediaQuery = window.matchMedia("(max-width: 640px)");
    let modalActive = false;
    let backgroundState = [];

    const cancelPendingFocus = () => {
      if (mobileFocusFrameRef.current) {
        cancelAnimationFrame(mobileFocusFrameRef.current);
        mobileFocusFrameRef.current = null;
      }
    };

    const restoreBackground = () => {
      for (const { element, inert } of backgroundState) {
        if (element?.isConnected) element.inert = inert;
      }
      backgroundState = [];
    };

    const deactivateMobileModal = ({ restoreFocus = false } = {}) => {
      if (!modalActive) return;
      modalActive = false;
      cancelPendingFocus();
      restoreBackground();
      if (restoreFocus) {
        mobileFocusFrameRef.current = requestAnimationFrame(() => {
          const opener = mobileInspectorOpenerRef.current;
          const externalToggle = document.querySelector(".workbench-inspector-toggle");
          if (opener?.isConnected && !opener.closest("[inert]")) opener.focus();
          else if (externalToggle instanceof HTMLElement && externalToggle.isConnected && !externalToggle.closest("[inert]")) externalToggle.focus();
          else reopenButtonRef.current?.focus();
          mobileFocusFrameRef.current = null;
        });
      }
    };

    const activateMobileModal = () => {
      if (!mediaQuery.matches || modalActive) return;
      modalActive = true;
      const activeElement = document.activeElement;
      if (
        activeElement instanceof HTMLElement &&
        activeElement !== document.body &&
        !inspectorRef.current?.contains(activeElement)
      ) {
        mobileInspectorOpenerRef.current = activeElement;
      }
      backgroundState = [
        document.querySelector(".workbench-navigation-slot"),
        document.querySelector(".workbench-content-slot"),
      ].filter(Boolean).map((element) => ({ element, inert: element.inert }));
      for (const { element } of backgroundState) element.inert = true;
      cancelPendingFocus();
      mobileFocusFrameRef.current = requestAnimationFrame(() => {
        closeButtonRef.current?.focus();
        mobileFocusFrameRef.current = null;
      });
    };

    const handleViewportChange = () => {
      if (mediaQuery.matches) activateMobileModal();
      else deactivateMobileModal();
    };

    const handleMobileEscape = (event) => {
      if (event.key !== "Escape" || !mediaQuery.matches || focusModeRef.current) return;
      event.preventDefault();
      onOpenChangeRef.current?.(false);
    };

    activateMobileModal();
    mediaQuery.addEventListener("change", handleViewportChange);
    document.addEventListener("keydown", handleMobileEscape);
    return () => {
      mediaQuery.removeEventListener("change", handleViewportChange);
      document.removeEventListener("keydown", handleMobileEscape);
      deactivateMobileModal({ restoreFocus: mediaQuery.matches });
    };
  }, [open]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (mobileFocusFrameRef.current) {
        cancelAnimationFrame(mobileFocusFrameRef.current);
      }
    };
  }, []);

  const handlePointerDown = (event) => {
    if (event.button !== 0 || focusMode) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    resizeStateRef.current = { pointerId: event.pointerId, startX: event.clientX, startWidth: width };
  };

  const handlePointerMove = (event) => {
    const resizeState = resizeStateRef.current;
    if (!resizeState || resizeState.pointerId !== event.pointerId) return;
    const nextWidth = resizeState.startWidth + resizeState.startX - event.clientX;
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(() => emitWidth(nextWidth));
  };

  const finishPointerResize = (event) => {
    const resizeState = resizeStateRef.current;
    if (!resizeState || resizeState.pointerId !== event.pointerId) return;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    resizeStateRef.current = null;
  };

  const handleResizeKeyDown = (event) => {
    let nextWidth = null;
    if (event.key === "ArrowLeft") nextWidth = width + WORKBENCH_DIMENSIONS.keyboardResizeStep;
    else if (event.key === "ArrowRight") nextWidth = width - WORKBENCH_DIMENSIONS.keyboardResizeStep;
    else if (event.key === "Home") nextWidth = WORKBENCH_DIMENSIONS.inspectorMinWidth;
    else if (event.key === "End") nextWidth = WORKBENCH_DIMENSIONS.inspectorMaxWidth;
    if (nextWidth === null) return;
    event.preventDefault();
    emitWidth(nextWidth);
  };

  const handleTabKeyDown = (event, panelIndex) => {
    let nextIndex = null;
    if (event.key === "ArrowRight") nextIndex = (panelIndex + 1) % resolvedPanels.length;
    else if (event.key === "ArrowLeft") nextIndex = (panelIndex - 1 + resolvedPanels.length) % resolvedPanels.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = resolvedPanels.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    const nextPanel = resolvedPanels[nextIndex];
    onTabChange?.(nextPanel.id);
    requestAnimationFrame(() => tabRefs.current.get(nextPanel.id)?.focus());
  };

  const handleClose = () => {
    if (focusMode) onFocusModeChange?.(false);
    onOpenChange?.(false);
  };

  if (!open) {
    return (
      <button ref={reopenButtonRef} type="button" className="learning-inspector-reopen" onClick={() => onOpenChange?.(true)} aria-label="打开学习面板">
        <span aria-hidden="true">‹</span><span>学习面板</span>
      </button>
    );
  }

  const viewportWidth = typeof window === "undefined" ? 1440 : window.innerWidth;
  const maxWidth = Math.max(WORKBENCH_DIMENSIONS.inspectorMinWidth, Math.min(WORKBENCH_DIMENSIONS.inspectorMaxWidth, Math.floor(viewportWidth * WORKBENCH_DIMENSIONS.inspectorMaxViewportRatio)));
  const resolvedWidth = clampInspectorWidth(width, viewportWidth);
  const title = learningUnit?.title ?? "学习面板";

  return (
    <aside ref={inspectorRef} className={`learning-inspector ${focusMode ? "is-focus-mode" : ""} ${className}`.trim()} style={{ "--learning-inspector-width": `${resolvedWidth}px` }} aria-label={`${title} 学习面板`}>
      {!focusMode && (
        <div className="learning-inspector-resize-handle" role="separator" aria-label="调整学习面板宽度" aria-orientation="vertical" aria-valuemin={WORKBENCH_DIMENSIONS.inspectorMinWidth} aria-valuemax={maxWidth} aria-valuenow={resolvedWidth} tabIndex={0} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={finishPointerResize} onPointerCancel={finishPointerResize} onKeyDown={handleResizeKeyDown} onDoubleClick={() => emitWidth(WORKBENCH_DIMENSIONS.inspectorDefaultWidth)} title="拖动调整宽度；方向键微调；双击恢复默认" />
      )}
      <div className="learning-inspector-surface">
        <header className="learning-inspector-header">
          <div className="learning-inspector-heading"><strong>{title}</strong><span>Learning Inspector</span></div>
          <div className="learning-inspector-actions">
            <button type="button" className="learning-inspector-icon-button" onClick={() => onFocusModeChange?.(!focusMode)} aria-label={focusMode ? "退出专注模式" : "进入专注模式"} aria-pressed={focusMode} title={focusMode ? "退出专注模式 (Esc)" : "专注模式"}><span aria-hidden="true">{focusMode ? "↙" : "⛶"}</span></button>
            <button ref={closeButtonRef} type="button" className="learning-inspector-icon-button" onClick={handleClose} aria-label="关闭学习面板" title="关闭学习面板"><span aria-hidden="true">×</span></button>
          </div>
        </header>
        <div className="learning-inspector-tabs" role="tablist" aria-label="学习面板内容">
          {resolvedPanels.map((panel, panelIndex) => {
            const selected = activeTab === panel.id;
            return (
              <button key={panel.id} id={`learning-inspector-tab-${panel.id}`} ref={(node) => { if (node) tabRefs.current.set(panel.id, node); else tabRefs.current.delete(panel.id); }} type="button" role="tab" className={`learning-inspector-tab ${selected ? "is-active" : ""}`.trim()} aria-selected={selected} aria-controls={`learning-inspector-panel-${panel.id}`} tabIndex={selected ? 0 : -1} onClick={() => onTabChange?.(panel.id)} onKeyDown={(event) => handleTabKeyDown(event, panelIndex)}>
                {panel.label ?? panel.id}
              </button>
            );
          })}
        </div>
        <div className="learning-inspector-body">
          {resolvedPanels.map((panel) => (
            <section key={panel.id} {...getPaneProps(panel.id)} id={`learning-inspector-panel-${panel.id}`} role="tabpanel" aria-labelledby={`learning-inspector-tab-${panel.id}`} hidden={activeTab !== panel.id} className="learning-inspector-pane">
              {panel.content ?? <InspectorPlaceholder panel={panel} />}
            </section>
          ))}
        </div>
      </div>
    </aside>
  );
}

function InspectorPlaceholder({ panel }) {
  const [title, description] = panel?.placeholder ?? [`${panel?.label ?? "内容"}区域`, "当前面板暂未提供内容。"];
  return <div className="learning-inspector-placeholder"><strong>{title}</strong><p>{description}</p></div>;
}

export default LearningInspector;
