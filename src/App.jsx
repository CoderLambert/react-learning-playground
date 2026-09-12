import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import "./App.css";
import "./workbench/Integration.css";
import { demos, CATEGORIES } from "./demos";
import { ChapterCheckpoint } from "./components/ChapterCheckpoint";
import { getCheckpointChapter } from "./components/chapterCheckpointMap";
import { AiAssistant, DeepSeekSettings } from "./components/ai-assistant";
import { ContextMeter } from "./components/ai-assistant/context/ContextMeter.jsx";
import { ConversationHistory } from "./components/ai-assistant/conversations/ConversationHistory.jsx";
import { LearningInspector } from "./components/learning-inspector";
import { NoteToc } from "./components/notes/NoteToc";
import { NoteViewer } from "./components/notes/NoteViewer";
import { MDX_TEACHING_COMPONENTS } from "./components/mdx";
import { useAiLearningAssistant } from "./ai/useAiLearningAssistant.js";
import { enrichLearningUnitSourceSemantics } from "./source/semanticSources";
import { WorkbenchNavigation } from "./workbench/WorkbenchNavigation";
import { WorkbenchShell } from "./workbench/WorkbenchShell";
import { toLearningUnit } from "./workbench/contracts";
import { useDemoUrlState } from "./workbench/demoUrlState";
import { usePersistedWorkbenchState } from "./workbench/usePersistedWorkbenchState";

const SourceViewer = lazy(() =>
  import("./components/source-viewer/SourceViewer").then((module) => ({ default: module.SourceViewer })),
);

function NotesPane({ learningUnitId }) {
  const [toc, setToc] = useState([]);
  return (
    <div className="workbench-notes-pane">
      <NoteToc items={toc} />
      <NoteViewer learningUnitId={learningUnitId} components={MDX_TEACHING_COMPONENTS} onTocChange={setToc} />
    </div>
  );
}

function InlineSourcePane({ learningUnit, activeFileName, onActiveFileChange, onOpenInInspector }) {
  return (
    <Suspense fallback={<div className="code-accordion-wrapper workbench-code-loading">⚡ 载入实现源码...</div>}>
      <SourceViewer
        learningUnit={learningUnit}
        mode="inline"
        activeFileName={activeFileName}
        onActiveFileChange={onActiveFileChange}
        onOpenInInspector={onOpenInInspector}
      />
    </Suspense>
  );
}

export default function App() {
  const [viewMode, setViewMode] = useState("focused");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [sourceFocus, setSourceFocus] = useState(null);
  const [pendingConversationTarget, setPendingConversationTarget] = useState(null);
  const {
    state: workbenchState,
    setNavigationCollapsed,
    setInspectorOpen,
    setInspectorWidth,
    setInspectorTab,
    setSourceFile,
  } = usePersistedWorkbenchState();
  const { demoId, selectDemo } = useDemoUrlState({ learningUnits: demos, defaultDemoId: demos[0]?.id });
  const currentDemo = useMemo(() => demos.find((demo) => demo.id === demoId) || demos[0], [demoId]);
  const currentLearningUnit = useMemo(
    () => (currentDemo ? enrichLearningUnitSourceSemantics(toLearningUnit(currentDemo)) : null),
    [currentDemo],
  );
  const currentCategory = useMemo(() => CATEGORIES.find((category) => category.id === currentDemo?.category), [currentDemo]);
  const currentCheckpointChapter = currentDemo ? getCheckpointChapter(currentDemo.id) : null;
  const aiAssistant = useAiLearningAssistant({
    learningUnit: currentLearningUnit,
    activeSourceFile: workbenchState.sourceFile,
  });

  useEffect(() => {
    setSourceFile(null);
    setSourceFocus(null);
  }, [currentDemo?.id, setSourceFile]);

  const handleCitationOpen = (citation) => {
    const fileName = citation?.fileName;
    const exists = currentLearningUnit?.sources?.some((source) => source.name === fileName);
    if (!exists) return;
    setInspectorOpen(true);
    setInspectorTab("source");
    setSourceFile(fileName);
    setSourceFocus({
      fileName,
      startLine: citation.startLine,
      endLine: citation.endLine ?? citation.startLine,
    });
  };

  const handleInlineSourceOpen = (fileName, focusRange = null) => {
    const exists = currentLearningUnit?.sources?.some((source) => source.name === fileName);
    if (!exists) return;
    setSourceFocus(focusRange);
    setSourceFile(fileName);
    setInspectorOpen(true);
    setInspectorTab("source");
  };

  const handleInlineSourceFileChange = (fileName) => {
    setSourceFile(fileName);
    if (sourceFocus?.fileName !== fileName) setSourceFocus(null);
  };

  const navigateToDemo = (id) => {
    selectDemo(id);
    setViewMode("focused");
    setMobileNavigationOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectDemo = (id) => {
    setPendingConversationTarget(null);
    navigateToDemo(id);
  };

  const handleSelectAll = () => {
    setPendingConversationTarget(null);
    setViewMode("all");
    setMobileNavigationOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConversationSelect = (conversationId) => {
    const conversation = aiAssistant.conversationHistory.find((item) => item.id === conversationId);
    if (!conversation || conversation.archived) return;

    if (conversation.learningUnitId === currentLearningUnit?.id) {
      setPendingConversationTarget(null);
      void aiAssistant.selectConversation(conversationId);
      return;
    }

    const targetExists = demos.some((demo) => demo.id === conversation.learningUnitId);
    if (!targetExists) return;

    setPendingConversationTarget({
      conversationId,
      learningUnitId: conversation.learningUnitId,
    });
    navigateToDemo(conversation.learningUnitId);
    setInspectorOpen(true);
    setInspectorTab("ai");
  };

  useEffect(() => {
    if (!pendingConversationTarget) return;
    if (currentLearningUnit?.id !== pendingConversationTarget.learningUnitId) return;

    const targetStillExists = aiAssistant.conversationHistory.some((conversation) => (
      conversation.id === pendingConversationTarget.conversationId &&
      conversation.learningUnitId === pendingConversationTarget.learningUnitId &&
      !conversation.archived
    ));
    if (!targetStillExists) {
      setPendingConversationTarget(null);
      return;
    }

    if (aiAssistant.activeConversationId === pendingConversationTarget.conversationId) {
      setPendingConversationTarget(null);
      return;
    }

    void aiAssistant.selectConversation(pendingConversationTarget.conversationId);
  }, [
    aiAssistant.activeConversationId,
    aiAssistant.conversationHistory,
    aiAssistant.selectConversation,
    currentLearningUnit?.id,
    pendingConversationTarget,
  ]);

  const navigation = (
    <WorkbenchNavigation
      categories={CATEGORIES}
      learningUnits={demos}
      activeId={currentDemo?.id}
      viewMode={viewMode}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onSelectUnit={handleSelectDemo}
      onSelectAll={handleSelectAll}
      collapsed={workbenchState.navigationCollapsed}
      onCollapsedChange={setNavigationCollapsed}
      className={mobileNavigationOpen ? "open" : ""}
    />
  );

  const learningUnitLabels = Object.fromEntries(demos.map((demo) => [demo.id, demo.label]));
  const conversationHistoryCount = aiAssistant.conversationHistory.filter(
    (conversation) => !conversation.archived,
  ).length;
  const conversationNavigation = (
    <div className="ai-assistant-history-toolbar" aria-label="AI 会话工具栏">
      <button
        type="button"
        onClick={aiAssistant.reset}
        disabled={aiAssistant.status === "streaming"}
      >
        新对话
      </button>
      <details className="ai-conversation-popover">
        <summary>历史会话 {conversationHistoryCount}</summary>
        <div className="ai-conversation-popover__panel">
          <ConversationHistory
            conversations={aiAssistant.conversationHistory}
            activeConversationId={aiAssistant.activeConversationId}
            learningUnitId={currentLearningUnit?.id}
            learningUnitLabels={learningUnitLabels}
            onSelect={handleConversationSelect}
            onRename={aiAssistant.renameConversation}
            onArchive={aiAssistant.archiveConversation}
            onDelete={aiAssistant.deleteConversation}
            disabled={aiAssistant.status === "streaming"}
          />
        </div>
      </details>
      <div className="ai-assistant-history-toolbar__model">
        <span>模型</span>
        <div className="ai-assistant-settings-slot">
          <DeepSeekSettings
            settings={aiAssistant.deepSeekSettings}
            connectionMode={aiAssistant.connectionMode}
            onSave={aiAssistant.saveConnectionSettings}
            onClear={aiAssistant.clearConnectionSettings}
            disabled={aiAssistant.settingsDisabled}
          />
        </div>
      </div>
    </div>
  );

  const inspector = currentLearningUnit ? (
    <LearningInspector
      learningUnit={currentLearningUnit}
      state={{
        open: workbenchState.inspectorOpen,
        activeTab: workbenchState.inspectorTab,
        focusMode,
        width: workbenchState.inspectorWidth,
        sourceFile: workbenchState.sourceFile,
      }}
      onTabChange={setInspectorTab}
      onOpenChange={setInspectorOpen}
      onFocusModeChange={setFocusMode}
      onWidthChange={setInspectorWidth}
      notes={<NotesPane learningUnitId={currentLearningUnit.id} />}
      source={(
        <Suspense fallback={<div className="note-runtime-state">正在加载源码查看器…</div>}>
          <SourceViewer
            learningUnit={currentLearningUnit}
            activeFileName={workbenchState.sourceFile}
            onActiveFileChange={(fileName) => {
              setSourceFile(fileName);
              if (sourceFocus?.fileName !== fileName) setSourceFocus(null);
            }}
            focusRange={sourceFocus}
            onFocusRangeChange={setSourceFocus}
          />
        </Suspense>
      )}
      ai={(
        <AiAssistant
          contextSummary={aiAssistant.contextSummary}
          messages={aiAssistant.messages}
          status={aiAssistant.status}
          inputValue={aiAssistant.inputValue}
          onInputChange={aiAssistant.setInputValue}
          onSubmit={aiAssistant.submit}
          onStop={aiAssistant.stop}
          onCitationOpen={handleCitationOpen}
          disabled={aiAssistant.disabled}
          error={aiAssistant.error}
          notice={aiAssistant.notice}
          providerLabel="DeepSeek"
          modelLabel={aiAssistant.modelLabel}
          conversationNavigation={conversationNavigation}
          contextMeter={(
            <ContextMeter
              budget={aiAssistant.contextBudget}
              onCompact={aiAssistant.compactContext}
              compacting={aiAssistant.compacting}
              disabled={!aiAssistant.configured || aiAssistant.messages.length === 0}
            />
          )}
        />
      )}
    />
  ) : null;

  const content = (
    <div className="app-main workbench-main">
      <header className="top-bar">
        <div className="top-bar-left">
          <button
            className="mobile-menu-toggle workbench-mobile-menu-toggle"
            onClick={() => setMobileNavigationOpen((open) => !open)}
            aria-label="打开侧边导航"
          >
            ☰
          </button>
          <div className="breadcrumb-nav">
            <span className="breadcrumb-category">{viewMode === "all" ? "总览模式" : currentCategory?.name || "核心实验"}</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">{viewMode === "all" ? "全部知识点看板" : currentDemo?.label}</span>
          </div>
        </div>
        <div className="top-bar-right">
          <button
            type="button"
            className="btn btn-outline btn-sm workbench-inspector-toggle"
            onClick={() => setInspectorOpen((open) => !open)}
            aria-pressed={workbenchState.inspectorOpen}
          >
            {workbenchState.inspectorOpen ? "关闭学习面板" : "打开学习面板"}
          </button>
          <div className="view-mode-pill">
            <button
              className={`view-mode-btn ${viewMode === "focused" ? "active" : ""}`}
              onClick={() => setViewMode("focused")}
            >
              单篇聚焦
            </button>
            <button
              className={`view-mode-btn ${viewMode === "all" ? "active" : ""}`}
              onClick={() => setViewMode("all")}
            >
              连续阅读
            </button>
          </div>
        </div>
      </header>
      <main className="app-content workbench-app-content">
        {viewMode === "focused" ? (
          currentDemo ? (
            <div key={currentDemo.id} className="demo-page">
              <currentDemo.Component />
              <InlineSourcePane
                learningUnit={currentLearningUnit}
                activeFileName={workbenchState.sourceFile}
                onActiveFileChange={handleInlineSourceFileChange}
                onOpenInInspector={handleInlineSourceOpen}
              />
              {currentCheckpointChapter && <ChapterCheckpoint chapter={currentCheckpointChapter} />}
            </div>
          ) : null
        ) : (
          <div className="demo-all-container">
            {demos.map((demo, index) => {
              const checkpointChapter = getCheckpointChapter(demo.id);
              const learningUnit = enrichLearningUnitSourceSemantics(toLearningUnit(demo));
              return (
                <div key={demo.id} id={`demo-${demo.id}`}>
                  {index > 0 && <hr className="demo-divider" />}
                  <div className="workbench-all-demo-heading">
                    <span className="badge badge-blue">案例 {index + 1}</span>
                    <h3>{demo.label}</h3>
                    <span>#{demo.id}</span>
                  </div>
                  <demo.Component />
                  <InlineSourcePane learningUnit={learningUnit} />
                  {checkpointChapter && <ChapterCheckpoint chapter={checkpointChapter} />}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );

  return (
    <WorkbenchShell
      navigation={navigation}
      content={content}
      inspector={inspector}
      navigationCollapsed={workbenchState.navigationCollapsed}
      mobileNavigationOpen={mobileNavigationOpen}
      inspectorOpen={workbenchState.inspectorOpen}
      onMobileNavigationClose={() => setMobileNavigationOpen(false)}
      className={focusMode ? "workbench-focus-mode" : ""}
      style={{ "--workbench-inspector-width": `${workbenchState.inspectorWidth}px` }}
    />
  );
}
