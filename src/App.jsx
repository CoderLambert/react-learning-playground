import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import "./App.css";
import "./workbench/Integration.css";
import { demos, CATEGORIES } from "./demos";
import { ChapterCheckpoint } from "./components/ChapterCheckpoint";
import { getCheckpointChapter } from "./components/chapterCheckpointMap";
import { AiAssistant, DeepSeekSettings } from "./components/ai-assistant";
import { LearningInspector } from "./components/learning-inspector";
import { NoteToc } from "./components/notes/NoteToc";
import { NoteViewer } from "./components/notes/NoteViewer";
import { MDX_TEACHING_COMPONENTS } from "./components/mdx";
import { useAiLearningAssistant } from "./ai/useAiLearningAssistant.js";
import { WorkbenchNavigation } from "./workbench/WorkbenchNavigation";
import { WorkbenchShell } from "./workbench/WorkbenchShell";
import { toLearningUnit } from "./workbench/contracts";
import { useDemoUrlState } from "./workbench/demoUrlState";
import { usePersistedWorkbenchState } from "./workbench/usePersistedWorkbenchState";

const CodeViewer = lazy(() => import("./components/CodeViewer"));
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

export default function App() {
  const [viewMode, setViewMode] = useState("focused");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
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
  const currentLearningUnit = useMemo(() => (currentDemo ? toLearningUnit(currentDemo) : null), [currentDemo]);
  const currentCategory = useMemo(() => CATEGORIES.find((category) => category.id === currentDemo?.category), [currentDemo]);
  const currentCheckpointChapter = currentDemo ? getCheckpointChapter(currentDemo.id) : null;
  const aiAssistant = useAiLearningAssistant({
    learningUnit: currentLearningUnit,
    activeSourceFile: workbenchState.sourceFile,
  });

  useEffect(() => {
    setSourceFile(null);
  }, [currentDemo?.id, setSourceFile]);

  const handleSelectDemo = (id) => {
    selectDemo(id);
    setViewMode("focused");
    setMobileNavigationOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectAll = () => {
    setViewMode("all");
    setMobileNavigationOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
            onActiveFileChange={setSourceFile}
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
          onReset={aiAssistant.reset}
          onStop={aiAssistant.stop}
          disabled={aiAssistant.disabled}
          error={aiAssistant.error}
          notice={aiAssistant.notice}
          providerLabel="DeepSeek"
          modelLabel={aiAssistant.modelLabel}
          settings={(
            <DeepSeekSettings
              settings={aiAssistant.deepSeekSettings}
              connectionMode={aiAssistant.connectionMode}
              onSave={aiAssistant.saveConnectionSettings}
              onClear={aiAssistant.clearConnectionSettings}
              disabled={aiAssistant.settingsDisabled}
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
              {currentCheckpointChapter && <ChapterCheckpoint chapter={currentCheckpointChapter} />}
            </div>
          ) : null
        ) : (
          <div className="demo-all-container">
            {demos.map((demo, index) => {
              const checkpointChapter = getCheckpointChapter(demo.id);
              return (
                <div key={demo.id} id={`demo-${demo.id}`}>
                  {index > 0 && <hr className="demo-divider" />}
                  <div className="workbench-all-demo-heading">
                    <span className="badge badge-blue">案例 {index + 1}</span>
                    <h3>{demo.label}</h3>
                    <span>#{demo.id}</span>
                  </div>
                  <demo.Component />
                  <Suspense fallback={<div className="code-accordion-wrapper workbench-code-loading">⚡ 载入代码视图...</div>}>
                    <CodeViewer files={demo.files} fileName={`${demo.id}.jsx`} />
                  </Suspense>
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
