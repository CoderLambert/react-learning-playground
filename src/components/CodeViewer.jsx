import { useEffect, useId, useRef, useState } from "react";
import { highlightCode } from "../lib/shikiHighlighter";

function decorateHighlightedLines(html, focusRange) {
  if (!html || !focusRange || Number(focusRange.startLine) <= 0) return html;

  const startLine = Number(focusRange.startLine);
  const endLine = Math.max(Number(focusRange.endLine) || startLine, startLine);
  let lineNumber = 0;

  return html.replace(/<span class="line">/g, () => {
    lineNumber += 1;
    const highlighted = lineNumber >= startLine && lineNumber <= endLine;
    const style = [
      "display:block",
      "min-height:1.6em",
      "padding:0 10px",
      "margin:0 -10px",
      highlighted
        ? "background:color-mix(in srgb, var(--color-primary) 16%, transparent)"
        : "background:transparent",
      highlighted
        ? "border-left:3px solid var(--color-primary)"
        : "border-left:3px solid transparent",
    ].join(";");
    return `<span class="line" data-source-line="${lineNumber}"${highlighted ? ' data-highlighted="true"' : ""} style="${style}">`;
  });
}

export function CodeViewer({
  code,
  fileName = "Demo.jsx",
  files,
  defaultExpanded = false,
  lang = "jsx",
  variant = "accordion",
  activeFileName,
  onActiveFileChange,
  focusRange = null,
  title = "源码实现",
  headerActions = null,
}) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [highlightedMap, setHighlightedMap] = useState({});
  const [copied, setCopied] = useState(false);
  const viewportRef = useRef(null);
  const bodyId = useId();

  const fileList = files && files.length > 0 ? files : [{ name: fileName, code: code || "" }];
  const controlledIndex = activeFileName ? fileList.findIndex((file) => file.name === activeFileName) : -1;
  const resolvedIndex = controlledIndex >= 0 ? controlledIndex : activeFileIndex < fileList.length ? activeFileIndex : 0;
  const currentFile = fileList[resolvedIndex] || fileList[0];
  const currentCode = currentFile?.code || "";
  const isExpanded = variant === "panel" || internalExpanded;
  const highlightedEntry = highlightedMap[currentFile.name];
  const isHighlighted = Boolean(highlightedEntry?.code === currentCode && highlightedEntry?.html);
  const isFocusedFile = Boolean(
    focusRange && currentFile?.name === focusRange.fileName && Number(focusRange.startLine) > 0,
  );
  const isLoading = isExpanded && Boolean(currentCode) && !isHighlighted;

  useEffect(() => {
    if (!isExpanded || !currentCode || isHighlighted) return;
    let isMounted = true;

    highlightCode(currentCode, { language: lang, fileName: currentFile.name })
      .then((html) => {
        if (isMounted) {
          setHighlightedMap((prev) => ({
            ...prev,
            [currentFile.name]: { code: currentCode, html },
          }));
        }
      })
      .catch((err) => {
        console.error("Shiki 高亮失败:", err);
      });

    return () => { isMounted = false; };
  }, [currentCode, currentFile.name, isExpanded, isHighlighted, lang]);

  useEffect(() => {
    if (!isFocusedFile || !viewportRef.current || !isHighlighted) return;
    const target = viewportRef.current.querySelector(`[data-source-line="${focusRange.startLine}"]`);
    target?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [focusRange?.endLine, focusRange?.fileName, focusRange?.startLine, isFocusedFile, isHighlighted]);

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
  const focusedLines = currentCode.split("\n");
  const highlightedHtml = isHighlighted
    ? decorateHighlightedLines(highlightedEntry.html, isFocusedFile ? focusRange : null)
    : "";
  const copyButton = (
    <button type="button" className="btn btn-outline btn-sm code-copy-btn" onClick={handleCopy} title="复制代码到剪贴板">
      {copied ? "✅ 已复制" : "📋 复制代码"}
    </button>
  );
  const actions = (headerActions || isExpanded) ? (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px", flexShrink: 0 }}>
      {headerActions}
      {isExpanded && copyButton}
    </div>
  ) : null;
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
      <div className="code-highlight-viewport" ref={viewportRef}>
        {isLoading && <div className="code-loading-indicator">⚡ 正在使用 Shiki 渲染高亮语法树...</div>}
        {isHighlighted ? (
          <div
            className={`shiki-container ${isFocusedFile ? "source-focused-code" : ""}`.trim()}
            data-source-focus={isFocusedFile ? "true" : undefined}
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        ) : isFocusedFile ? (
          <pre className="code-fallback-pre source-focused-code" data-source-focus="true">
            <code>
              {focusedLines.map((line, index) => {
                const lineNumber = index + 1;
                const endLine = Math.max(Number(focusRange.endLine) || Number(focusRange.startLine), Number(focusRange.startLine));
                const highlighted = lineNumber >= Number(focusRange.startLine) && lineNumber <= endLine;
                return (
                  <span
                    key={lineNumber}
                    data-source-line={lineNumber}
                    data-highlighted={highlighted ? "true" : undefined}
                    style={{
                      display: "block",
                      minHeight: "1.6em",
                      padding: "0 10px",
                      margin: "0 -10px",
                      background: highlighted ? "color-mix(in srgb, var(--color-primary) 16%, transparent)" : undefined,
                      borderLeft: highlighted ? "3px solid var(--color-primary)" : "3px solid transparent",
                    }}
                  >
                    <span aria-hidden="true" style={{ display: "inline-block", width: "4ch", userSelect: "none", opacity: 0.5 }}>{lineNumber}</span>
                    {line || " "}
                    {"\n"}
                  </span>
                );
              })}
            </code>
          </pre>
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
            <span className="code-accordion-title"><span aria-hidden="true">💻</span><span>{title}</span></span>
            <span className="badge badge-gray" style={{ fontSize: "11px" }}>{fileList.length > 1 ? `${fileList.length} 个文件` : currentFile.name}</span>
            <span style={{ fontSize: "12px", color: "var(--text-subtle)" }}>({lineCount} 行代码)</span>
          </div>
          {actions}
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
            <span className="code-accordion-title"><span aria-hidden="true">💻</span><span>{title}</span></span>
            <span className="badge badge-gray" style={{ fontSize: "11px" }}>{fileList.length > 1 ? `${fileList.length} 个文件` : currentFile.name}</span>
            <span style={{ fontSize: "12px", color: "var(--text-subtle)" }}>({lineCount} 行代码)</span>
          </span>
          <span style={{ fontSize: "12px", color: "var(--text-subtle)" }}>{isExpanded ? "点击折叠" : "点击展开源码"}</span>
        </button>
        {actions}
      </div>
      {isExpanded && body}
    </div>
  );
}

export default CodeViewer;
