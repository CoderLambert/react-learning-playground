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
import { AssessmentPane } from "./assessment/ui/AssessmentPane.jsx";
import { useAssessmentApplication } from "./assessment/application/useAssessmentApplication.js";
import { NoteToc } from "./components/notes/NoteToc";
import { NoteViewer } from "./components/notes/NoteViewer";
import { MDX_TEACHING_COMPONENTS } from "./components/mdx";
import { DemoSourceLocator } from "./components/source-locator/DemoSourceLocator";
import { useAiLearningAssistant } from "./ai/useAiLearningAssistant.js";
import { createAiAssessmentIntegration } from "./app/aiAssessmentIntegration.js";
import { prepareGuidedAiHandoff } from "./app/guidedAiHandoff.js";
import { enrichLearningUnitSourceSemantics } from "./source/semanticSources";
import { WorkbenchNavigation } from "./workbench/WorkbenchNavigation";
import { WorkbenchShell } from "./workbench/WorkbenchShell";
import { toLearningUnit } from "./workbench/contracts";
import { useDemoUrlState } from "./workbench/demoUrlState";
import { getGuidedActivityDefinition, GuidedLearningFlow } from "./workbench/public";
import { getLearningPathEntry } from "./workbench/learningPath";
import { usePersistedWorkbenchState } from "./workbench/usePersistedWorkbenchState";

const SourceViewer = lazy(() =>
  import("./components/source-viewer/SourceViewer").then((module) => ({ default: module.SourceViewer })),
);

// The demos registry is authoritative. Normalize it once at the composition
// boundary so every Workbench, AI, Assessment, Source and Guided consumer gets
// the same canonical LearningUnit shape and object identity.
const learningUnits = demos.map((demo) => enrichLearningUnitSourceSemantics(toLearningUnit(demo)));

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
  const [sourceFocus, setSourceFocus] = useState(null);
  const [sourceLocatorActive, setSourceLocatorActive] = useState(false);
  const [pendingSourceTarget, setPendingSourceTarget] = useState(null);
  const [pendingConversationTarget, setPendingConversationTarget] = useState(null);
  const {
    state: workbenchState,
    setNavigationCollapsed,
    setInspectorOpen,
    setInspectorWidth,
    setInspectorTab,
    setSourceFile,
  } = usePersistedWorkbenchState();
  const { demoId, selectDemo } = useDemoUrlState({ learningUnits, defaultDemoId: learningUnits[0]?.id });
  const currentLearningUnit = learningUnits.find((unit) => unit.id === demoId) || learningUnits[0] || null;
  const learningUnitsById = useMemo(
    () => new Map(learningUnits.map((unit) => [unit.id, unit])),
    [],
  );
  const currentCategory = useMemo(
    () => CATEGORIES.find((category) => category.id === currentLearningUnit?.categoryId),
    [currentLearningUnit],
  );
  const currentCheckpointChapter = currentLearningUnit ? getCheckpointChapter(currentLearningUnit.id) : null;
  const currentLearningPathEntry = currentLearningUnit
    ? getLearningPathEntry(learningUnits, currentLearningUnit.id)
    : null;
  const guidedActivity = useMemo(
    () => (currentLearningUnit ? getGuidedActivityDefinition(currentLearningUnit.id) : null),
    [currentLearningUnit],
  );

  const assessment = useAssessmentApplication({
    learningUnitId: currentLearningUnit?.id ?? null,
    learningUnitsById,
  });
  const assessmentView = assessment.view;
  const assessmentCommands = assessment.commands;

  const aiAssessmentIntegration = useMemo(
    () => assessmentView.integrationCapabilities
      ? createAiAssessmentIntegration({ assessmentCapabilities: assessmentView.integrationCapabilities })
      : null,
    [assessmentView.integrationCapabilities],
  );

  const aiAssistant = useAiLearningAssistant({
    learningUnit: currentLearningUnit,
    activeSourceFile: workbenchState.sourceFile,
    assessmentRuntime: aiAssessmentIntegration,
  });
  const {
    activeConversationId,
    conversationHistory,
    selectConversation,
  } = aiAssistant;

  // This synchronizes persisted source selection with URL/deep-link navigation.
  // It is intentionally an effect because the navigation can originate outside App.
  /* oxlint-disable react/set-state-in-effect -- synchronize persisted state after external navigation. */
  useEffect(() => {
    setSourceFile(null);
    setSourceFocus(null);
  }, [currentLearningUnit?.id, setSourceFile]);
  /* oxlint-enable react/set-state-in-effect */

  useEffect(() => {
    if (!sourceLocatorActive) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setSourceLocatorActive(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [sourceLocatorActive]);

  // This completes a source-locator handoff after the selected learning unit renders.
  /* oxlint-disable react/set-state-in-effect -- finish the deferred source handoff after navigation. */
  useEffect(() => {
    if (!pendingSourceTarget) return;
    if (currentLearningUnit?.id !== pendingSourceTarget.learningUnitId) return;

    const exists = currentLearningUnit?.sources?.some((source) => source.name === pendingSourceTarget.fileName);
    if (!exists) {
      setPendingSourceTarget(null);
      return;
    }

    setInspectorOpen(true);
    setInspectorTab("source");
    setSourceFile(pendingSourceTarget.fileName);
    setSourceFocus({
      fileName: pendingSourceTarget.fileName,
      startLine: pendingSourceTarget.startLine,
      endLine: pendingSourceTarget.endLine,
    });
    setPendingSourceTarget(null);
  }, [
    currentLearningUnit?.id,
    currentLearningUnit?.sources,
    pendingSourceTarget,
    setInspectorOpen,
    setInspectorTab,
    setSourceFile,
  ]);
  /* oxlint-enable react/set-state-in-effect */

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

  const handleAssessmentRequestAi = () => {
    setInspectorOpen(true);
    setInspectorTab("ai");
    aiAssistant.enterAssessmentAuthoring();
    aiAssistant.setInputValue("请为当前知识点生成一组可直接作答的评测题，并使用 assessment_create_questions 工具。不要自动发送。");
  };

  const handleAssessmentEvidence = (evidence) => {
    if (evidence?.kind !== "source") return;
    handleCitationOpen({
      fileName: evidence.fileName,
      startLine: evidence.startLine,
      endLine: evidence.endLine,
    });
  };

  const handleGuidedReviewResource = (resource) => {
    if (resource !== "notes" && resource !== "source") return;
    setInspectorOpen(true);
    setInspectorTab(resource);
  };

  const handleGuidedAskAi = (payload) => {
    const handoff = prepareGuidedAiHandoff({
      learningUnit: currentLearningUnit,
      payload,
      currentDraft: aiAssistant.inputValue,
    });
    if (!handoff.accepted) return false;

    aiAssistant.exitAssessmentAuthoring();
    aiAssistant.setInputValue(handoff.prompt);
    setInspectorOpen(handoff.inspectorOpen);
    setInspectorTab(handoff.inspectorTab);
    return true;
  };

  const handleVisualSourceLocate = (target) => {
    if (!target?.learningUnitId || !target?.fileName) return;
    const learningUnitExists = learningUnitsById.has(target.learningUnitId);
    if (!learningUnitExists) return;

    setSourceLocatorActive(false);
    if (target.learningUnitId !== currentLearningUnit?.id) {
      setPendingSourceTarget(target);
      selectDemo(target.learningUnitId);
      return;
    }

    const sourceExists = currentLearningUnit?.sources?.some((source) => source.name === target.fileName);
    if (!sourceExists) return;
    setInspectorOpen(true);
    setInspectorTab("source");
    setSourceFile(target.fileName);
    setSourceFocus({
      fileName: target.fileName,
      startLine: target.startLine,
      endLine: target.endLine,
    });
  };

  const navigateToDemo = (id) => {
    selectDemo(id);
    setViewMode("focused");
    setMobileNavigationOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectDemo = (id) => {
    setPendingSourceTarget(null);
    setPendingConversationTarget(null);
    setSourceLocatorActive(false);
    navigateToDemo(id);
  };

  const handleGuidedContinue = () => {
    const nextUnitId = currentLearningPathEntry?.nextId;
    if (!nextUnitId) return false;
    handleSelectDemo(nextUnitId);
    return true;
  };

  const handleSelectAll = () => {
    setPendingSourceTarget(null);
    setPendingConversationTarget(null);
    setSourceLocatorActive(false);
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

    const targetExists = learningUnitsById.has(conversation.learningUnitId);
    if (!targetExists) return;

    setPendingSourceTarget(null);
    setSourceLocatorActive(false);
    setPendingConversationTarget({
      conversationId,
      learningUnitId: conversation.learningUnitId,
    });
    navigateToDemo(conversation.learningUnitId);
    setInspectorOpen(true);
    setInspectorTab("ai");
  };

  // This completes a conversation handoff after URL-driven demo navigation renders.
  /* oxlint-disable react/set-state-in-effect -- finish the deferred conversation handoff after navigation. */
  useEffect(() => {
    if (!pendingConversationTarget) return;
    if (currentLearningUnit?.id !== pendingConversationTarget.learningUnitId) return;

    const targetStillExists = conversationHistory.some((conversation) => (
      conversation.id === pendingConversationTarget.conversationId &&
      conversation.learningUnitId === pendingConversationTarget.learningUnitId &&
      !conversation.archived
    ));
    if (!targetStillExists) {
      setPendingConversationTarget(null);
      return;
    }

    if (activeConversationId === pendingConversationTarget.conversationId) {
      setPendingConversationTarget(null);
      return;
    }

    void selectConversation(pendingConversationTarget.conversationId);
  }, [
    activeConversationId,
    conversationHistory,
    selectConversation,
    currentLearningUnit?.id,
    pendingConversationTarget,
  ]);
  /* oxlint-enable react/set-state-in-effect */

  const navigation = (
    <WorkbenchNavigation
      categories={CATEGORIES}
      learningUnits={learningUnits}
      activeId={currentLearningUnit?.id}
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

  const learningUnitLabels = Object.fromEntries(learningUnits.map((unit) => [unit.id, unit.title]));
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
        <div>
          {aiAssistant.mode === "assessment_authoring" && (
            <div role="status" className="ai-assessment-mode-notice">
              当前处于评测出题/管理模式；本次发送可使用评测工具。
              <button type="button" onClick={aiAssistant.exitAssessmentAuthoring} disabled={aiAssistant.status === "streaming"}>
                退出评测模式
              </button>
            </div>
          )}
          <AiAssistant
            contextSummary={aiAssistant.contextSummary}
            messages={aiAssistant.messages}
            status={aiAssistant.status}
            inputValue={aiAssistant.inputValue}
            onInputChange={aiAssistant.setInputValue}
            onSubmit={aiAssistant.submit}
            onRetry={aiAssistant.canRetry ? aiAssistant.retryFailedTurn : undefined}
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
        </div>
      )}
      assessment={(
        <div className="assessment-pane-shell">
          {assessmentView.storageNotice && <p role="status">{assessmentView.storageNotice}</p>}
          {!assessmentView.ready && !assessmentView.initializationError && <p role="status">正在初始化评测存储…</p>}
          {assessmentView.initializationError && (
            <div role="alert" className="mx-4 mt-4 rounded-lg border border-[var(--color-danger-border)] bg-[var(--color-danger-light)] p-3 text-sm text-[var(--color-danger-text)] sm:mx-5">
              <strong>评测初始化未完全成功</strong>
              <p className="mt-1 mb-2">{assessmentView.initializationError}</p>
              <button type="button" className="btn btn-outline btn-sm" onClick={assessmentCommands?.retryInitialization} disabled={!assessmentCommands}>
                重试加载
              </button>
            </div>
          )}
          <AssessmentPane
            session={assessmentView.session}
            questions={assessmentView.questions}
            managementCommands={assessmentCommands}
            currentIndex={assessmentView.currentIndex}
            answer={assessmentView.answer}
            feedback={assessmentView.feedback}
            startError={assessmentView.startError}
            starting={assessmentView.starting}
            submitError={assessmentView.submitError}
            submitting={assessmentView.submitting}
            onStart={assessmentCommands && assessmentView.questions.length ? assessmentCommands.start : undefined}
            onAnswerChange={assessmentCommands?.setAnswer}
            onSubmit={assessmentCommands?.submit}
            onNext={assessmentCommands?.next}
            onOpenEvidence={handleAssessmentEvidence}
            onRequestAiQuestions={handleAssessmentRequestAi}
          />
        </div>
      )}
    />
  ) : null;

  const content = (
    <div className="app-main workbench-main">
      <header className="top-bar">
        <div className="top-bar-left">
          <button
            type="button"
            className="mobile-menu-toggle workbench-mobile-menu-toggle"
            onClick={() => setMobileNavigationOpen((open) => !open)}
            aria-label={mobileNavigationOpen ? "关闭侧边导航" : "打开侧边导航"}
            aria-expanded={mobileNavigationOpen}
            aria-controls="workbench-navigation"
          >
            ☰
          </button>
          <div className="breadcrumb-nav">
            <span className="breadcrumb-category">{viewMode === "all" ? "总览模式" : currentCategory?.name || "核心实验"}</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">{viewMode === "all" ? "全部知识点看板" : currentLearningUnit?.title}</span>
          </div>
        </div>
        <div className="top-bar-right">
          <button
            type="button"
            className="btn btn-outline btn-sm workbench-source-locator-toggle"
            onClick={() => setSourceLocatorActive((active) => !active)}
            aria-pressed={sourceLocatorActive}
            title="开启后悬停并点击 Demo 元素定位源码；Alt / Option + 点击可快速定位"
          >
            {sourceLocatorActive ? "退出源码定位" : "⌖ 定位源码"}
          </button>
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
          currentLearningUnit ? (
            <div key={currentLearningUnit.id} className="demo-page">
              {guidedActivity ? (
                <GuidedLearningFlow
                  key={`${guidedActivity.learningUnitId}:${guidedActivity.revision}`}
                  learningUnit={currentLearningUnit}
                  definition={guidedActivity}
                  renderDemo={() => (
                    <DemoSourceLocator
                      learningUnit={currentLearningUnit}
                      enabled={sourceLocatorActive}
                      onLocate={handleVisualSourceLocate}
                    >
                      <currentLearningUnit.component />
                    </DemoSourceLocator>
                  )}
                  onReviewResource={handleGuidedReviewResource}
                  onAskAi={handleGuidedAskAi}
                  onContinue={handleGuidedContinue}
                  canContinue={Boolean(currentLearningPathEntry?.nextId)}
                />
              ) : (
                <DemoSourceLocator
                  learningUnit={currentLearningUnit}
                  enabled={sourceLocatorActive}
                  onLocate={handleVisualSourceLocate}
                >
                  <currentLearningUnit.component />
                </DemoSourceLocator>
              )}
              {currentCheckpointChapter && (
                <ChapterCheckpoint
                  chapter={currentCheckpointChapter}
                  nextUnitId={currentLearningPathEntry?.nextChapterFirstId}
                  onNavigate={handleSelectDemo}
                />
              )}
            </div>
          ) : null
        ) : (
          <div className="demo-all-container">
            {learningUnits.map((learningUnit, index) => {
              const checkpointChapter = getCheckpointChapter(learningUnit.id);
              const learningPathEntry = getLearningPathEntry(learningUnits, learningUnit.id);
              return (
                <div key={learningUnit.id} id={`demo-${learningUnit.id}`}>
                  {index > 0 && <hr className="demo-divider" />}
                  <div className="workbench-all-demo-heading">
                    <span className="badge badge-blue">案例 {index + 1}</span>
                    <h3>{learningUnit.title}</h3>
                    <span>#{learningUnit.id}</span>
                  </div>
                  <DemoSourceLocator
                    learningUnit={learningUnit}
                    enabled={sourceLocatorActive}
                    onLocate={handleVisualSourceLocate}
                  >
                    <learningUnit.component />
                  </DemoSourceLocator>
                  {checkpointChapter && (
                    <ChapterCheckpoint
                      chapter={checkpointChapter}
                      nextUnitId={learningPathEntry?.nextChapterFirstId}
                      onNavigate={handleSelectDemo}
                    />
                  )}
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
