import { useEffect, useState } from "react";
import "./OfficialDocsPane.css";

export function OfficialDocsPane({
  learningUnit,
  doc,
  fullscreen = false,
  onFullscreenChange,
  onBackToLesson,
}) {
  const [selectedUrl, setSelectedUrl] = useState(null);

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

  if (!doc?.primary) {
    return (
      <div className="official-docs-empty">
        <span className="official-docs-kicker">官方文档</span>
        <h3>当前知识点还未接入权威资料</h3>
        <p>该知识点暂时只提供实验、笔记、源码、AI 与评测内容。</p>
      </div>
    );
  }

  const references = [doc.primary, ...(doc.related ?? [])];
  const activeReference = references.find((item) => item.url === selectedUrl) ?? doc.primary;
  const relationLabel = activeReference.match === "related" ? "相关延伸" : "直接对应";
  const canEmbed = activeReference.presentation === "embed";

  return (
    <section
      className={`official-docs-pane ${fullscreen ? "is-fullscreen" : ""}`.trim()}
      aria-label={`${activeReference.provider} 官方文档：${activeReference.title}`}
      data-fullscreen={fullscreen ? "true" : "false"}
      data-provider={activeReference.provider}
      data-presentation={activeReference.presentation}
    >
      <div className="official-docs-toolbar">
        <div className="official-docs-heading">
          <div className="official-docs-title-row">
            <span className="official-docs-kicker">{activeReference.provider} 官方</span>
            <span className={`official-docs-relation ${activeReference.match === "related" ? "is-related" : ""}`.trim()}>
              {relationLabel}
            </span>
          </div>

          <div className="official-docs-reference-row">
            <strong>{activeReference.title}</strong>
            {references.length > 1 && (
              <label className="official-docs-reference-picker">
                <span>资料</span>
                <select
                  aria-label="选择官方资料"
                  value={activeReference.url}
                  onChange={(event) => setSelectedUrl(event.target.value)}
                >
                  {references.map((item, index) => (
                    <option key={item.url} value={item.url}>
                      {index === 0 ? "主要" : "延伸"} · {item.provider} · {item.title}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>

          <span className="official-docs-course-link">
            {learningUnit?.title ? `对应「${learningUnit.title}」` : ""}
            {activeReference.description ? ` · ${activeReference.description}` : ""}
          </span>
        </div>

        <div className="official-docs-actions">
          {onBackToLesson && (
            <button type="button" className="official-docs-action" onClick={onBackToLesson}>
              返回实验
            </button>
          )}
          {onFullscreenChange && canEmbed && (
            <button
              type="button"
              className="official-docs-action"
              onClick={() => onFullscreenChange(true)}
              aria-label="全屏阅读官方文档"
            >
              ⛶ 全屏阅读
            </button>
          )}
          <a
            className="official-docs-action"
            href={activeReference.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`在 ${activeReference.provider} 官网打开：${activeReference.title}`}
          >
            官网打开 ↗
          </a>
        </div>
      </div>

      <div className="official-docs-frame-shell">
        {canEmbed ? (
          <iframe
            key={activeReference.url}
            className="official-docs-frame"
            src={activeReference.url}
            title={`${activeReference.provider} 官方文档：${activeReference.title}`}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <div className="official-docs-external">
            <span className="official-docs-external__provider">{activeReference.provider} 官方资料</span>
            <h3>{activeReference.title}</h3>
            <p>{activeReference.description}</p>
            <p className="official-docs-external__note">
              当前来源未标记为可安全内嵌，为避免浏览器安全策略导致空白页面，这里不强制使用 iframe。
            </p>
            <a
              className="official-docs-external__open"
              href={activeReference.url}
              target="_blank"
              rel="noreferrer"
            >
              在 {activeReference.provider} 官网阅读 ↗
            </a>
          </div>
        )}
      </div>

      {fullscreen && (
        <button
          type="button"
          className="official-docs-exit-fullscreen"
          onClick={() => onFullscreenChange?.(false)}
          aria-label="退出官方文档全屏"
          title="退出全屏"
        >
          ×
        </button>
      )}
    </section>
  );
}

export default OfficialDocsPane;
