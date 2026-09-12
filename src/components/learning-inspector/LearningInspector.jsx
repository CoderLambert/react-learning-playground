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
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handlePointerDown = (event) => {
    if (event.button !== 0 || focusMode) return;

    event.currentTarget.setPointerCapture?.(event.pointerId);
    resizeStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startWidth: width,
    };
  };

  const handlePointerMove = (event) => {
    const resizeState = resizeStateRef.current;
    if (!resizeState || resizeState.pointerId !== event.pointerId) return;

    const nextWidth = resizeState.startWidth + resizeState.startX - event.clientX;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

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

    if (event.key === "ArrowLeft") {
      nextWidth = width + WORKBENCH_DIMENSIONS.keyboardResizeStep;
    } else if (event.key === "ArrowRight") {
      nextWidth = width - WORKBENCH_DIMENSIONS.keyboardResizeStep;
    } else if (event.key === "Home") {
      nextWidth = WORKBENCH_DIMENSIONS.inspectorMinWidth;
    } else if (event.key === "End") {
      nextWidth = WORKBENCH_DIMENSIONS.inspectorMaxWidth;
    }

    if (nextWidth === null) return;
    event.preventDefault();
    emitWidth(nextWidth);
  };

  if (!open) {
    return (
      <button
        type="button"
        className="learning-inspector-reopen"
        onClick={() => onOpenChange?.(true)}
        aria-label="打开学习面板"
      >
        <span aria-hidden="true">‹</span>
        <span>学习面板</span>
      </button>
    );
  }

  const viewportWidth = typeof window === "undefined" ? 1440 : window.innerWidth;
  const maxWidth = Math.max(
    WORKBENCH_DIMENSIONS.inspectorMinWidth,
    Math.min(
      WORKBENCH_DIMENSIONS.inspectorMaxWidth,
      Math.floor(viewportWidth * WORKBENCH_DIMENSIONS.inspectorMaxViewportRatio),
    ),
  );
  const resolvedWidth = clampInspectorWidth(width, viewportWidth);
  const title = learningUnit?.title ?? "学习面板";

  return (
    <aside
      className={`learning-inspector ${focusMode ? "is-focus-mode" : ""} ${className}`.trim()}
      style={{ "--learning-inspector-width": `${resolvedWidth}px` }}
      aria-label={`${title} 学习面板`}
    >
      {!focusMode && (
        <div
          className="learning-inspector-resize-handle"
          role="separator"
          aria-label="调整学习面板宽度"
          aria-orientation="vertical"
          aria-valuemin={WORKBENCH_DIMENSIONS.inspectorMinWidth}
          aria-valuemax={maxWidth}
          aria-valuenow={resolvedWidth}
          tabIndex={0}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishPointerResize}
          onPointerCancel={finishPointerResize}
          onKeyDown={handleResizeKeyDown}
          onDoubleClick={() => emitWidth(WORKBENCH_DIMENSIONS.inspectorDefaultWidth)}
          title="拖动调整宽度；方向键微调；双击恢复默认"
        />
      )}

      <div className="learning-inspector-surface">
        <header className="learning-inspector-header">
          <div className="learning-inspector-heading">
            <strong>{title}</strong>
            <span>Learning Inspector</span>
          </div>

          <div className="learning-inspector-actions">
            <button
              type="button"
              className="learning-inspector-icon-button"
              onClick={() => onFocusModeChange?.(!focusMode)}
              aria-label={focusMode ? "退出专注模式" : "进入专注模式"}
              aria-pressed={focusMode}
              title={focusMode ? "退出专注模式 (Esc)" : "专注模式"}
            >
              <span aria-hidden="true">{focusMode ? "↙" : "⛶"}</span>
            </button>
            <button
              type="button"
              className="learning-inspector-icon-button"
              onClick={() => onOpenChange?.(false)}
              aria-label="关闭学习面板"
              title="关闭学习面板"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
        </header>

        <div className="learning-inspector-tabs" role="tablist" aria-label="学习面板内容">
          {resolvedPanels.map((panel) => {
            const selected = activeTab === panel.id;
            return (
              <button
                key={panel.id}
                id={`learning-inspector-tab-${panel.id}`}
                type="button"
                role="tab"
                className={`learning-inspector-tab ${selected ? "is-active" : ""}`.trim()}
                aria-selected={selected}
                aria-controls={`learning-inspector-panel-${panel.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => onTabChange?.(panel.id)}
              >
                {panel.label ?? panel.id}
              </button>
            );
          })}
        </div>

        <div className="learning-inspector-body">
          {resolvedPanels.map((panel) => (
            <section
              key={panel.id}
              {...getPaneProps(panel.id)}
              id={`learning-inspector-panel-${panel.id}`}
              role="tabpanel"
              aria-labelledby={`learning-inspector-tab-${panel.id}`}
              hidden={activeTab !== panel.id}
              className="learning-inspector-pane"
            >
              {panel.content ?? <InspectorPlaceholder panel={panel} />}
            </section>
          ))}
        </div>
      </div>
    </aside>
  );
}

function InspectorPlaceholder({ panel }) {
  const [title, description] = panel?.placeholder ?? [
    `${panel?.label ?? "内容"}区域`,
    "当前面板暂未提供内容。",
  ];

  return (
    <div className="learning-inspector-placeholder">
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  );
}

export default LearningInspector;
