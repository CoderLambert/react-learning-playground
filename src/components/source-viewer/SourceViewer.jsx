import CodeViewer from "../CodeViewer";
import "./SourceViewer.css";

export function SourceViewer({
  learningUnit,
  sources,
  activeFileName,
  onActiveFileChange,
  focusRange = null,
  emptyState,
}) {
  const fileList = sources ?? learningUnit?.sources ?? [];

  if (fileList.length === 0) {
    return (
      <div className="source-viewer-empty" role="status">
        {emptyState ?? "当前知识点没有可展示的源码。"}
      </div>
    );
  }

  return (
    <div
      className="source-viewer"
      data-source-file={activeFileName ?? fileList[0]?.name ?? ""}
      data-source-focus={focusRange ? `${focusRange.startLine}-${focusRange.endLine}` : undefined}
    >
      <CodeViewer
        files={fileList}
        variant="panel"
        defaultExpanded
        activeFileName={activeFileName}
        onActiveFileChange={onActiveFileChange}
        focusRange={focusRange}
      />
    </div>
  );
}

export default SourceViewer;
