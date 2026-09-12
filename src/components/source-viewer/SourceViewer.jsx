import { useEffect, useMemo, useState } from "react";
import CodeViewer from "../CodeViewer";
import {
  LEARNING_CONTEXT_KINDS,
  LearningActionBar,
  createLearningActionContext,
  emitLearningAction,
} from "../../learning-actions";
import "./SourceViewer.css";

const KIND_LABELS = Object.freeze({
  component: "Component",
  reducer: "Reducer",
  "reducer-hook": "Hook",
  effect: "Effect",
  "custom-hook": "Custom Hook",
  provider: "Provider",
  context: "Context",
  "context-hook": "Hook",
  "event-handler": "Event",
  state: "State",
  memo: "Memo",
  callback: "Callback",
  ref: "Ref",
  concurrency: "Concurrent",
  action: "Action",
  "external-store": "External Store",
  async: "Async",
  hook: "Hook",
  identity: "Identity",
  helper: "Helper",
});

function regionLabel(region) {
  if (!region) return "实现";
  const kind = KIND_LABELS[region.kind] ?? region.kind;
  return `${kind} · ${region.symbol}`;
}

function regionFocus(fileName, region) {
  if (!fileName || !region) return null;
  return {
    fileName,
    startLine: Math.max(1, Number(region.startLine) || 1),
    endLine: Math.max(Number(region.endLine) || Number(region.startLine) || 1, Number(region.startLine) || 1),
  };
}

function focusedSourceText(code, range) {
  if (typeof code !== "string" || !range) return "";
  const lines = code.split("\n");
  return lines.slice(range.startLine - 1, range.endLine).join("\n");
}

function SourceSemanticNavigator({
  semantics,
  mode,
  selection,
  externalFocus,
  onSelect,
}) {
  const regions = semantics?.regions ?? [];
  const primary = semantics?.primaryRegion ?? null;
  if (!primary || regions.length === 0) return null;

  const inline = mode === "inline";
  const visibleRegions = regions
    .filter((region) => region.id !== primary.id)
    .slice(0, inline ? 5 : 10);
  const externalFocusActive = Boolean(externalFocus);

  return (
    <div className="source-semantic-nav" data-semantic-parser={semantics.parser ?? undefined}>
      <div className="source-semantic-nav__heading">
        <span className="source-semantic-nav__eyebrow">AST 源码结构</span>
        {externalFocusActive && (
          <span className="source-semantic-nav__citation">
            引用定位 L{externalFocus.startLine}{externalFocus.endLine && externalFocus.endLine !== externalFocus.startLine ? `–L${externalFocus.endLine}` : ""}
          </span>
        )}
      </div>
      <div className="source-semantic-nav__controls" role="group" aria-label="源码结构导航">
        <button
          type="button"
          className={`source-semantic-chip source-semantic-chip--primary ${selection === "primary" ? "is-active" : ""}`.trim()}
          aria-pressed={selection === "primary"}
          onClick={() => onSelect("primary")}
          title={`核心实现：${regionLabel(primary)}，L${primary.startLine}-L${primary.endLine}`}
        >
          <span>核心实现</span>
          <span className="source-semantic-chip__detail">{regionLabel(primary)}</span>
        </button>

        {visibleRegions.map((region) => (
          <button
            key={region.id}
            type="button"
            className={`source-semantic-chip ${selection === region.id ? "is-active" : ""}`.trim()}
            aria-pressed={selection === region.id}
            onClick={() => onSelect(region.id)}
            title={`${regionLabel(region)}，L${region.startLine}-L${region.endLine}`}
          >
            {regionLabel(region)}
          </button>
        ))}

        <button
          type="button"
          className={`source-semantic-chip source-semantic-chip--full ${selection === null && !externalFocusActive ? "is-active" : ""}`.trim()}
          aria-pressed={selection === null && !externalFocusActive}
          onClick={() => onSelect(null)}
        >
          完整文件
        </button>
      </div>
    </div>
  );
}

export function SourceViewer({
  learningUnit,
  sources,
  activeFileName,
  onActiveFileChange,
  focusRange = null,
  onFocusRangeChange,
  emptyState,
  mode = "inspector",
  defaultExpanded,
  onOpenInInspector,
}) {
  const fileList = sources ?? learningUnit?.sources ?? [];
  const [internalActiveFileName, setInternalActiveFileName] = useState(null);
  const [semanticSelection, setSemanticSelection] = useState(null);
  const firstFileName = fileList[0]?.name ?? null;
  const controlledFileExists = activeFileName && fileList.some((file) => file.name === activeFileName);
  const internalFileExists = internalActiveFileName && fileList.some((file) => file.name === internalActiveFileName);
  const resolvedActiveFileName = controlledFileExists
    ? activeFileName
    : internalFileExists
      ? internalActiveFileName
      : firstFileName;
  const inline = mode === "inline";
  const currentFile = fileList.find((file) => file.name === resolvedActiveFileName) ?? fileList[0] ?? null;
  const semantics = currentFile?.semantics ?? null;

  useEffect(() => {
    if (focusRange?.fileName === resolvedActiveFileName) {
      setSemanticSelection(null);
      return;
    }
    setSemanticSelection(inline && semantics?.primaryRegion ? "primary" : null);
  }, [focusRange?.endLine, focusRange?.fileName, focusRange?.startLine, inline, resolvedActiveFileName, semantics?.primaryRegionId]);

  const selectedRegion = useMemo(() => {
    if (!semantics) return null;
    if (semanticSelection === "primary") return semantics.primaryRegion ?? null;
    if (!semanticSelection) return null;
    return semantics.regions?.find((region) => region.id === semanticSelection) ?? null;
  }, [semanticSelection, semantics]);

  const semanticFocusRange = regionFocus(resolvedActiveFileName, selectedRegion);
  const effectiveFocusRange = semanticFocusRange ?? focusRange;
  const learningActionContext = useMemo(() => createLearningActionContext({
    kind: LEARNING_CONTEXT_KINDS.SOURCE,
    learningUnit,
    fileName: resolvedActiveFileName,
    range: effectiveFocusRange,
    semanticRegion: selectedRegion ? regionLabel(selectedRegion) : focusRange ? "citation" : "full-file",
    selectedText: focusedSourceText(currentFile?.code, effectiveFocusRange),
  }), [currentFile?.code, effectiveFocusRange, focusRange, learningUnit, resolvedActiveFileName, selectedRegion]);

  if (fileList.length === 0) {
    return (
      <div className="source-viewer-empty" role="status">
        {emptyState ?? "当前知识点没有可展示的源码。"}
      </div>
    );
  }

  const handleActiveFileChange = (fileName) => {
    setInternalActiveFileName(fileName);
    setSemanticSelection(null);
    onFocusRangeChange?.(null);
    onActiveFileChange?.(fileName);
  };

  const handleSemanticSelect = (selection) => {
    onFocusRangeChange?.(null);
    setSemanticSelection(selection);
  };

  const openInInspectorAction = inline && onOpenInInspector ? (
    <button
      type="button"
      className="btn btn-outline btn-sm source-viewer-open-inspector"
      onClick={(event) => {
        event.stopPropagation();
        onOpenInInspector(resolvedActiveFileName, effectiveFocusRange, selectedRegion);
      }}
      title="在右侧源码面板中继续查看当前实现"
    >
      在源码面板打开 <span aria-hidden="true">↗</span>
    </button>
  ) : null;

  const semanticNavigator = (
    <SourceSemanticNavigator
      semantics={semantics}
      mode={mode}
      selection={semanticSelection}
      externalFocus={semanticFocusRange ? null : focusRange}
      onSelect={handleSemanticSelect}
    />
  );

  return (
    <div
      className={`source-viewer source-viewer--${inline ? "inline" : "inspector"}`}
      data-source-file={resolvedActiveFileName ?? ""}
      data-source-focus={effectiveFocusRange ? `${effectiveFocusRange.startLine}-${effectiveFocusRange.endLine}` : undefined}
      data-source-mode={mode}
      data-source-semantic={selectedRegion?.id ?? (focusRange ? "citation" : "full")}
    >
      <LearningActionBar
        context={learningActionContext}
        onAction={emitLearningAction}
        label="针对当前源码上下文的 AI 学习动作"
      />
      <CodeViewer
        files={fileList}
        variant={inline ? "accordion" : "panel"}
        defaultExpanded={defaultExpanded ?? !inline}
        activeFileName={resolvedActiveFileName}
        onActiveFileChange={handleActiveFileChange}
        focusRange={effectiveFocusRange}
        title={inline ? "实现源码" : "源码实现"}
        headerActions={openInInspectorAction}
        bodyToolbar={semanticNavigator}
        copyFocusedRange={Boolean(selectedRegion)}
      />
    </div>
  );
}

export default SourceViewer;
