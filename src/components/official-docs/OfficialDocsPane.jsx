import "./OfficialDocsPane.css";

const REACT_LEARN_HOME = "https://zh-hans.react.dev/learn";

export function OfficialDocsPane({ learningUnit, doc }) {
  if (!doc) {
    return (
      <div className="official-docs-empty">
        <span className="official-docs-kicker">React 官方文档</span>
        <h3>当前知识点还未接入官方章节</h3>
        <p>
          这一版先验证“课程内容 + 官方原文”的组合体验。已优先接入组件基础章节，后续可以继续补齐映射。
        </p>
        <a href={REACT_LEARN_HOME} target="_blank" rel="noreferrer">
          打开 React 官方 Learn ↗
        </a>
      </div>
    );
  }

  const relationLabel = doc.match === "related" ? "相关延伸" : "直接对应";

  return (
    <div className="official-docs-pane">
      <div className="official-docs-header">
        <div className="official-docs-heading">
          <div className="official-docs-title-row">
            <span className="official-docs-kicker">React 官方文档</span>
            <span className={`official-docs-relation ${doc.match === "related" ? "is-related" : ""}`}>
              {relationLabel}
            </span>
          </div>
          <strong>{doc.title}</strong>
          <p>
            {learningUnit?.title ? `当前课程「${learningUnit.title}」→ ` : ""}
            {doc.description}
          </p>
        </div>
        <a
          className="official-docs-open-link"
          href={doc.url}
          target="_blank"
          rel="noreferrer"
          aria-label={`在 React 官方网站打开：${doc.title}`}
        >
          官网打开 ↗
        </a>
      </div>

      <div className="official-docs-embed-note">
        下方直接加载 zh-hans.react.dev 原始页面；若浏览器或官网安全策略阻止内嵌，请使用“官网打开”。
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
    </div>
  );
}

export default OfficialDocsPane;
