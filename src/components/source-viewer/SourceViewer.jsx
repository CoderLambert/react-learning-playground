import CodeViewer from "../CodeViewer";
import "./SourceViewer.css";

export function SourceViewer({ learningUnit, sources, activeFileName, onActiveFileChange, emptyState }) {
  const fileList = sources ?? learningUnit?.sources ?? [];

  if (fileList.length === 0) {
    return (
      <div className="source-viewer-empty" role="status">
        {emptyState ?? "当前知识点没有可展示的源码。"}
      </div>
    );
  }

  return (
    <div className="source-viewer" data-source-file={activeFileName ?? fileList[0]?.name ?? ""}>
      <CodeViewer
        files={fileList}
        variant="panel"
        defaultExpanded
        activeFileName={activeFileName}
        onActiveFileChange={onActiveFileChange}
      />
    </div>
  );
}

export default SourceViewer;
