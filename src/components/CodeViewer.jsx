import { useEffect, useId, useState } from "react";
import { highlightCode } from "../lib/shikiHighlighter";

export function CodeViewer({
  code,
  fileName = "Demo.jsx",
  files,
  defaultExpanded = false,
  lang = "jsx",
  variant = "accordion",
  activeFileName,
  onActiveFileChange,
}) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [highlightedMap, setHighlightedMap] = useState({});
  const [copied, setCopied] = useState(false);
  const bodyId = useId();

  const fileList = files && files.length > 0 ? files : [{ name: fileName, code: code || "" }];
  const controlledIndex = activeFileName ? fileList.findIndex((file) => file.name === activeFileName) : -1;
  const resolvedIndex = controlledIndex >= 0 ? controlledIndex : activeFileIndex < fileList.length ? activeFileIndex : 0;
  const currentFile = fileList[resolvedIndex] || fileList[0];
  const currentCode = currentFile?.code || "";
  const isExpanded = variant === "panel" || internalExpanded;
  const isHighlighted = Boolean(highlightedMap[currentFile.name]);
  const isLoading = isExpanded && Boolean(currentCode) && !isHighlighted;

  useEffect(() => {
    if (!isExpanded || !currentCode || highlightedMap[currentFile.name]) return;
    let isMounted = true;

    highlightCode(currentCode, { language: lang, fileName: currentFile.name })
      .then((html) => {
        if (isMounted) setHighlightedMap((prev) => ({ ...prev, [currentFile.name]: html }));
      })
      .catch((err) => {
        console.error("Shiki 高亮失败:", err);
      });

    return () => { isMounted = false; };
  }, [isExpanded, currentCode, currentFile.name, highlightedMap, lang]);

  const selectFile = (index) => {
    setActiveFileIndex(index);
    onActiveFileChange?.(fileList[index]?.name ?? null);
  };

  const handleCopy = async (event) => {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(currentCode);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = currentCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = currentCode ? currentCode.trim().split("\n").length : 0;
  const body = (
    <div className="code-accordion-body" id={bodyId}>
      {fileList.length > 1 && (
        <div className="code-file-tabs" role="tablist" aria-label="源码文件">
          {fileList.map((file, index) => (
            <button
              key={file.name}
              type="button"
              role="tab"
              aria-selected={resolvedIndex === index}
              className={`code-file-tab ${resolvedIndex === index ? "active" : ""}`}
              onClick={() => selectFile(index)}
            >
              <span aria-hidden="true">📄</span>
              <span>{file.name}</span>
            </button>
          ))}
        </div>
      )}
      <div className="code-highlight-viewport">
        {isLoading && <div className="code-loading-indicator">⚡ 正在使用 Shiki 渲染高亮语法树...</div>}
        {isHighlighted ? (
          <div className="shiki-container" dangerouslySetInnerHTML={{ __html: highlightedMap[currentFile.name] }} />
        ) : (
          <pre className="code-fallback-pre"><code>{currentCode}</code></pre>
        )}
      </div>
    </div>
  );

  if (variant === "panel") {
    return (
      <div className="code-accordion-wrapper code-viewer-panel">
        <div className="code-accordion-header expanded">
          <div className="code-accordion-header-left">
            <span className="code-accordion-title"><span aria-hidden="true">💻</span><span>源码实现</span></span>
            <span className="badge badge-gray" style={{ fontSize: "11px" }}>{fileList.length > 1 ? `${fileList.length} 个文件` : currentFile.name}</span>
            <span style={{ fontSize: "12px", color: "var(--text-subtle)" }}>({lineCount} 行代码)</span>
          </div>
          <button type="button" className="btn btn-outline btn-sm code-copy-btn" onClick={handleCopy} title="复制代码到剪贴板">
            {copied ? "✅ 已复制" : "📋 复制代码"}
          </button>
        </div>
        {body}
      </div>
    );
  }

  return (
    <div className="code-accordion-wrapper">
      <div className={`code-accordion-header ${isExpanded ? "expanded" : ""}`}>
        <button
          type="button"
          className="code-accordion-toggle"
          onClick={() => setInternalExpanded((value) => !value)}
          aria-expanded={isExpanded}
          aria-controls={bodyId}
        >
          <span className="code-accordion-header-left">
            <span className="code-accordion-arrow" aria-hidden="true">{isExpanded ? "▼" : "▶"}</span>
            <span className="code-accordion-title"><span aria-hidden="true">💻</span><span>源码实现</span></span>
            <span className="badge badge-gray" style={{ fontSize: "11px" }}>{fileList.length > 1 ? `${fileList.length} 个文件` : currentFile.name}</span>
            <span style={{ fontSize: "12px", color: "var(--text-subtle)" }}>({lineCount} 行代码)</span>
          </span>
          <span style={{ fontSize: "12px", color: "var(--text-subtle)" }}>{isExpanded ? "点击折叠" : "点击展开源码"}</span>
        </button>
        {isExpanded && (
          <button type="button" className="btn btn-outline btn-sm code-copy-btn" onClick={handleCopy} title="复制代码到剪贴板">
            {copied ? "✅ 已复制" : "📋 复制代码"}
          </button>
        )}
      </div>
      {isExpanded && body}
    </div>
  );
}

export default CodeViewer;
