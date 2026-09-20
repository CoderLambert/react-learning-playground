import { useEffect } from "react";
import "./OfficialDocsPane.css";

const REACT_LEARN_HOME = "https://zh-hans.react.dev/learn";

export function OfficialDocsPane({
  learningUnit,
  doc,
  fullscreen = false,
  onFullscreenChange,
  onBackToLesson,
}) {
  useEffect(() => {
    if (!fullscreen || typeof document === "undefined") return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      onFullscreenChange?.(false);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [fullscreen, onFullscreenChange]);

  if (!doc) {
    return (
      <div className="official-docs-empty">
        <span className="official-docs-kicker">React 官方文档</span>
        <h3>当前知识点还未接入官方章节</h3>
        <p>当前试点只为已完成映射的知识点提供产品内官方文档阅读。</p>
        <a href={REACT_LEARN_HOME} target="_blank" rel="noreferrer">
          打开 React 官方 Learn ↗
        </a>
      </div>
    );
  }

  const relationLabel = doc.match === "related" ? "相关延伸" : "直接对应";

  return (
    <section
      className={`official-docs-pane ${fullscreen ? "is-fullscreen" : ""}`.trim()}
      aria-label={`React 官方文档：${doc.title}`}
      data-fullscreen={fullscreen ? "true" : "false"}
    >
      <div className="official-docs-toolbar">
        <div className="official-docs-heading">
          <div className="official-docs-title-row">
            <span className="official-docs-kicker">React 官方</span>
            <span className={`official-docs-relation ${doc.match === "related" ? "is-related" : ""}`.trim()}>
              {relationLabel}
            </span>
          </div>
          <strong>{doc.title}</strong>
          <span className="official-docs-course-link">
            {learningUnit?.title ? `对应「${learningUnit.title}」` : doc.description}
          </span>
        </div>

        <div className="official-docs-actions">
          {onBackToLesson && (
            <button type="button" className="official-docs-action" onClick={onBackToLesson}>
              返回实验
            </button>
          )}
          {onFullscreenChange && (
            <button
              type="button"
              className="official-docs-action"
              onClick={() => onFullscreenChange(true)}
              aria-label="全屏阅读 React 官方文档"
            >
              ⛶ 全屏阅读
            </button>
          )}
          <a
            className="official-docs-action"
            href={doc.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`在 React 官方网站打开：${doc.title}`}
          >
            官网打开 ↗
          </a>
        </div>
      </div>

      <div className="official-docs-frame-shell">
        <iframe
          key={doc.url}
          className="official-docs-frame"
          src={doc.url}
          title={`React 官方文档：${doc.title}`}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>

      {fullscreen && (
        <button
          type="button"
          className="official-docs-exit-fullscreen"
          onClick={() => onFullscreenChange?.(false)}
          aria-label="退出官方文档全屏"
          title="退出全屏 (Esc)"
        >
          ×
        </button>
      )}
    </section>
  );
}

export default OfficialDocsPane;
