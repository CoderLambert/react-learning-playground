import { useId, useState, useEffect } from "react";
import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import jsxLang from "shiki/langs/jsx.mjs";
import jsLang from "shiki/langs/javascript.mjs";
import cssLang from "shiki/langs/css.mjs";
import githubDarkTheme from "shiki/themes/github-dark.mjs";

// 单例 Highlighter 实例，避免重复初始化
let highlighterPromise = null;
function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [githubDarkTheme],
      langs: [jsxLang, jsLang, cssLang],
      engine: createJavaScriptRegexEngine(),
    });
  }
  return highlighterPromise;
}

export function CodeViewer({
  code,
  fileName = "Demo.jsx",
  files, // 可选：支持多文件切换 [{ name: string, code: string }]
  defaultExpanded = false,
  lang = "jsx",
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [highlightedMap, setHighlightedMap] = useState({});
  const [copied, setCopied] = useState(false);
  const bodyId = useId();

  // 规范化文件列表
  const fileList = files && files.length > 0 ? files : [{ name: fileName, code: code || "" }];
  const currentFile = fileList[activeFileIndex] || fileList[0];
  const currentCode = currentFile?.code || "";

  const isHighlighted = Boolean(highlightedMap[currentFile.name]);
  const isLoading = isExpanded && !isHighlighted;

  // 惰性加载语法高亮
  useEffect(() => {
    if (!isExpanded || !currentCode) return;
    if (highlightedMap[currentFile.name]) return;

    let isMounted = true;
    const fileLang = currentFile.name.endsWith(".css") ? "css" : lang;

    getHighlighter()
      .then((highlighter) => {
        const html = highlighter.codeToHtml(currentCode, {
          lang: fileLang,
          theme: "github-dark",
        });
        if (isMounted) {
          setHighlightedMap((prev) => ({ ...prev, [currentFile.name]: html }));
        }
      })
      .catch((err) => {
        console.error("Shiki 高亮失败:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [isExpanded, currentCode, currentFile.name, highlightedMap, lang]);

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = currentCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const lineCount = currentCode ? currentCode.trim().split("\n").length : 0;

  return (
    <div className="code-accordion-wrapper">
      {/* 折叠栏头部开关 */}
      <div
        className={`code-accordion-header ${isExpanded ? "expanded" : ""}`}
      >
        <button
          type="button"
          className="code-accordion-toggle"
          onClick={() => setIsExpanded((v) => !v)}
          aria-expanded={isExpanded}
          aria-controls={bodyId}
        >
          <span className="code-accordion-header-left">
            <span className="code-accordion-arrow" aria-hidden="true">{isExpanded ? "▼" : "▶"}</span>
            <span className="code-accordion-title">
              <span aria-hidden="true">💻</span>
              <span>源码实现</span>
            </span>
            <span className="badge badge-gray" style={{ fontSize: "11px" }}>
              {fileList.length > 1 ? `${fileList.length} 个文件` : currentFile.name}
            </span>
            <span style={{ fontSize: "12px", color: "var(--text-subtle)" }}>
              ({lineCount} 行代码)
            </span>
          </span>
          <span style={{ fontSize: "12px", color: "var(--text-subtle)" }}>
            {isExpanded ? "点击折叠" : "点击展开源码"}
          </span>
        </button>
        {isExpanded && (
          <button
            type="button"
            className="btn btn-outline btn-sm code-copy-btn"
            onClick={handleCopy}
            title="复制代码到剪贴板"
          >
            {copied ? "✅ 已复制" : "📋 复制代码"}
          </button>
        )}
      </div>

      {/* 展开后的内容区域 */}
      {isExpanded && (
        <div className="code-accordion-body" id={bodyId}>
          {/* 多文件选项卡 */}
          {fileList.length > 1 && (
            <div className="code-file-tabs">
              {fileList.map((file, idx) => (
                <button
                  key={file.name}
                  type="button"
                  className={`code-file-tab ${activeFileIndex === idx ? "active" : ""}`}
                  onClick={() => setActiveFileIndex(idx)}
                >
                  <span>📄</span>
                  <span>{file.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* 代码展示视口 */}
          <div className="code-highlight-viewport">
            {isLoading && (
              <div className="code-loading-indicator">
                ⚡ 正在使用 Shiki 渲染高亮语法树...
              </div>
            )}

            {isHighlighted ? (
              <div
                className="shiki-container"
                dangerouslySetInnerHTML={{ __html: highlightedMap[currentFile.name] }}
              />
            ) : (
              <pre className="code-fallback-pre">
                <code>{currentCode}</code>
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CodeViewer;
