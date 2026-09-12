import { useState } from "react";
import CodeViewer from "../CodeViewer";
import "./SourceViewer.css";

export function SourceViewer({
  learningUnit,
  sources,
  activeFileName,
  onActiveFileChange,
  focusRange = null,
  emptyState,
  mode = "inspector",
  defaultExpanded,
  onOpenInInspector,
}) {
  const fileList = sources ?? learningUnit?.sources ?? [];
  const [internalActiveFileName, setInternalActiveFileName] = useState(null);
  const firstFileName = fileList[0]?.name ?? null;
  const controlledFileExists = activeFileName && fileList.some((file) => file.name === activeFileName);
  const internalFileExists = internalActiveFileName && fileList.some((file) => file.name === internalActiveFileName);
  const resolvedActiveFileName = controlledFileExists
    ? activeFileName
    : internalFileExists
      ? internalActiveFileName
      : firstFileName;
  const inline = mode === "inline";

  if (fileList.length === 0) {
    return (
      <div className="source-viewer-empty" role="status">
        {emptyState ?? "当前知识点没有可展示的源码。"}
      </div>
    );
  }

  const handleActiveFileChange = (fileName) => {
    setInternalActiveFileName(fileName);
    onActiveFileChange?.(fileName);
  };

  const openInInspectorAction = inline && onOpenInInspector ? (
    <button
      type="button"
      className="btn btn-outline btn-sm source-viewer-open-inspector"
      onClick={(event) => {
        event.stopPropagation();
        onOpenInInspector(resolvedActiveFileName);
      }}
      title="在右侧源码面板中继续查看"
    >
      在源码面板打开 <span aria-hidden="true">↗</span>
    </button>
  ) : null;

  return (
    <div
      className={`source-viewer source-viewer--${inline ? "inline" : "inspector"}`}
      data-source-file={resolvedActiveFileName ?? ""}
      data-source-focus={focusRange ? `${focusRange.startLine}-${focusRange.endLine}` : undefined}
      data-source-mode={mode}
    >
      <CodeViewer
        files={fileList}
        variant={inline ? "accordion" : "panel"}
        defaultExpanded={defaultExpanded ?? !inline}
        activeFileName={resolvedActiveFileName}
        onActiveFileChange={handleActiveFileChange}
        focusRange={focusRange}
        title={inline ? "实现源码" : "源码实现"}
        headerActions={openInInspectorAction}
      />
    </div>
  );
}

export default SourceViewer;
