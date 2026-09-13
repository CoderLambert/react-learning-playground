import { lazy, Suspense, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
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
import { createAssessmentOperationToken, isAssessmentOperationCurrent } from "./assessment/ui/assessmentOperationOwnership.js";
import { selectAssessmentQuestionsForLearningUnit } from "./assessment/ui/assessmentScope.js";
import { createAssessmentRuntime } from "./assessment/composition/assessmentRuntime.js";
import { createLearningUnitEvidenceResolver } from "./assessment/composition/learningUnitEvidenceResolver.js";
import { NoteToc } from "./components/notes/NoteToc";
import { NoteViewer } from "./components/notes/NoteViewer";
import { MDX_TEACHING_COMPONENTS } from "./components/mdx";
import { DemoSourceLocator } from "./components/source-locator/DemoSourceLocator";
import { useAiLearningAssistant } from "./ai/useAiLearningAssistant.js";
import { createAiAssessmentIntegration } from "./app/aiAssessmentIntegration.js";
import { enrichLearningUnitSourceSemantics } from "./source/semanticSources";
import { WorkbenchNavigation } from "./workbench/WorkbenchNavigation";
import { WorkbenchShell } from "./workbench/WorkbenchShell";
import { toLearningUnit } from "./workbench/contracts";
import { useDemoUrlState } from "./workbench/demoUrlState";
import { usePersistedWorkbenchState } from "./workbench/usePersistedWorkbenchState";

const SourceViewer = lazy(() =>
  import("./components/source-viewer/SourceViewer").then((module) => ({ default: module.SourceViewer })),
);

const EMPTY_ASSESSMENT_SNAPSHOT = null;
const EMPTY_SUBSCRIBE = () => () => {};
const EMPTY_GET_SNAPSHOT = () => EMPTY_ASSESSMENT_SNAPSHOT;

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
  const { demoId, selectDemo } = useDemoUrlState({ learningUnits: demos, defaultDemoId: demos[0]?.id });
  const currentDemo = useMemo(() => demos.find((demo) => demo.id === demoId) || demos[0], [demoId]);
  const currentLearningUnit = useMemo(
    () => (currentDemo ? enrichLearningUnitSourceSemantics(toLearningUnit(currentDemo)) : null),
    [currentDemo],
  );
  const learningUnitsById = useMemo(
    () => new Map(demos.map((demo) => {
      const unit = enrichLearningUnitSourceSemantics(toLearningUnit(demo));
      return [unit.id, unit];
    })),
    [],
  );
  const currentCategory = useMemo(() => CATEGORIES.find((category) => category.id === currentDemo?.category), [currentDemo]);
  const currentCheckpointChapter = currentDemo ? getCheckpointChapter(currentDemo.id) : null;
  const [assessmentRuntime, setAssessmentRuntime] = useState(null);
  const [assessmentSession, setAssessmentSession] = useState(null);
  const [assessmentIndex, setAssessmentIndex] = useState(0);
  const [assessmentAnswer, setAssessmentAnswer] = useState(null);
  const [assessmentFeedback, setAssessmentFeedback] = useState(null);
  const [assessmentSubmitError, setAssessmentSubmitError] = useState(null);
  const [assessmentStartError, setAssessmentStartError] = useState(null);
  const [assessmentInitializationErrors, setAssessmentInitializationErrors] = useState({ load: null, recover: null });
  const [assessmentInitializationRetry, setAssessmentInitializationRetry] = useState(0);
  const [assessmentSubmitting, setAssessmentSubmitting] = useState(false);
  const [assessmentStarting, setAssessmentStarting] = useState(false);
  const assessmentGenerationRef = useRef(0);
  const assessmentInitializationRequestRef = useRef(0);
  const assessmentStartRequestRef = useRef(0);
  const assessmentStartingRef = useRef(false);
  const assessmentSubmitRequestRef = useRef(0);
  const assessmentContextRef = useRef({ learningUnitId: null, sessionId: null });
  assessmentContextRef.current = {
    learningUnitId: currentLearningUnit?.id ?? null,
    sessionId: assessmentSession?.id ?? null,
  };
  const assessmentSnapshot = useSyncExternalStore(
    assessmentRuntime?.queryStore.subscribe ?? EMPTY_SUBSCRIBE,
    assessmentRuntime?.queryStore.getSnapshot ?? EMPTY_GET_SNAPSHOT,
    EMPTY_GET_SNAPSHOT,
  );

  useEffect(() => {
    let cancelled = false;
    const evidenceResolver = createLearningUnitEvidenceResolver({
      getLearningUnit: (learningUnitId) => learningUnitsById.get(learningUnitId) ?? null,
    });
    void createAssessmentRuntime({ evidenceResolver }).then((runtime) => {
      if (!cancelled) setAssessmentRuntime(runtime);
    });
    return () => {
      cancelled = true;
    };
  }, [learningUnitsById]);

  const aiAssessmentIntegration = useMemo(
    () => assessmentRuntime
      ? createAiAssessmentIntegration({ assessmentCapabilities: assessmentRuntime.capabilities })
      : null,
    [assessmentRuntime],
  );

  const aiAssistant = useAiLearningAssistant({
    learningUnit: currentLearningUnit,
    activeSourceFile: workbenchState.sourceFile,
    assessmentRuntime: aiAssessmentIntegration,
  });

  const assessmentQuestions = selectAssessmentQuestionsForLearningUnit(
    assessmentSnapshot,
    currentLearningUnit?.id ?? null,
  );
  const assessmentInitializationError = [assessmentInitializationErrors.load, assessmentInitializationErrors.recover]
    .filter(Boolean)
    .join("；") || null;

  useEffect(() => {
    setSourceFile(null);
    setSourceFocus(null);
  }, [currentDemo?.id, setSourceFile]);

  useEffect(() => {
    if (!assessmentRuntime || !currentLearningUnit?.id) return undefined;

    const learningUnitId = currentLearningUnit.id;
    const generation = ++assessmentGenerationRef.current;
    const requestId = ++assessmentInitializationRequestRef.current;
    assessmentStartRequestRef.current += 1;
    assessmentSubmitRequestRef.current += 1;
    const token = createAssessmentOperationToken({ generation, learningUnitId, requestId });
    const isCurrentInitialization = () => isAssessmentOperationCurrent(token, {
      generation: assessmentGenerationRef.current,
      learningUnitId: assessmentContextRef.current.learningUnitId,
      sessionId: assessmentContextRef.current.sessionId,
      requestId: assessmentInitializationRequestRef.current,
    });

    setAssessmentSession(null);
    setAssessmentIndex(0);
    setAssessmentAnswer(null);
    setAssessmentFeedback(null);
    setAssessmentSubmitError(null);
    setAssessmentStartError(null);
    assessmentStartingRef.current = false;
    setAssessmentStarting(false);
    setAssessmentInitializationErrors({ load: null, recover: null });
    setAssessmentSubmitting(false);
    assessmentRuntime.queryStore.replaceSnapshot({ learningUnitId, questions: [] });

    void assessmentRuntime.service.listQuestions({ trusted: { learningUnitId } }).then((questions) => {
      if (!isCurrentInitialization()) return;
      assessmentRuntime.queryStore.replaceSnapshot({ learningUnitId, questions });
    }).catch((error) => {
      if (!isCurrentInitialization()) return;
      setAssessmentInitializationErrors((current) => ({
        ...current,
        load: error?.message || "无法加载评测题目",
      }));
    });

    void assessmentRuntime.sessionLifecycle.recover({ learningUnitId }).then((recovered) => {
      if (!isCurrentInitialization()) return;
      if (recovered) {
        setAssessmentSession(recovered.session);
        setAssessmentIndex(recovered.currentIndex);
      }
    }).catch((error) => {
      if (!isCurrentInitialization()) return;
      setAssessmentInitializationErrors((current) => ({
        ...current,
        recover: error?.message || "无法恢复评测进度",
      }));
    });

    return undefined;
  }, [assessmentRuntime, currentLearningUnit?.id, assessmentInitializationRetry]);

  useEffect(() => {
    if (!sourceLocatorActive) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setSourceLocatorActive(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [sourceLocatorActive]);

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

  const handleAssessmentStart = async () => {
    if (
      !assessmentRuntime ||
      !currentLearningUnit?.id ||
      !assessmentQuestions.length ||
      assessmentStartingRef.current
    ) return;
    const learningUnitId = currentLearningUnit.id;
    const requestId = ++assessmentStartRequestRef.current;
    assessmentStartingRef.current = true;
    setAssessmentStarting(true);
    setAssessmentStartError(null);
    const token = createAssessmentOperationToken({
      generation: assessmentGenerationRef.current,
      learningUnitId,
      requestId,
    });
    try {
      const session = await assessmentRuntime.sessionLifecycle.start({ learningUnitId });
      if (!isAssessmentOperationCurrent(token, {
        generation: assessmentGenerationRef.current,
        learningUnitId: assessmentContextRef.current.learningUnitId,
        sessionId: assessmentContextRef.current.sessionId,
        requestId: assessmentStartRequestRef.current,
      })) return;
      setAssessmentSession(session);
      setAssessmentIndex(0);
      setAssessmentAnswer(null);
      setAssessmentFeedback(null);
      setAssessmentSubmitError(null);
    } catch (error) {
      if (!isAssessmentOperationCurrent(token, {
        generation: assessmentGenerationRef.current,
        learningUnitId: assessmentContextRef.current.learningUnitId,
        sessionId: assessmentContextRef.current.sessionId,
        requestId: assessmentStartRequestRef.current,
      })) return;
      setAssessmentStartError(error?.message || "无法开始评测");
    } finally {
      if (isAssessmentOperationCurrent(token, {
        generation: assessmentGenerationRef.current,
        learningUnitId: assessmentContextRef.current.learningUnitId,
        sessionId: assessmentContextRef.current.sessionId,
        requestId: assessmentStartRequestRef.current,
      })) {
        assessmentStartingRef.current = false;
        setAssessmentStarting(false);
      }
    }
  };

  const handleAssessmentSubmit = async ({ questionId, answer }) => {
    if (!assessmentRuntime || !assessmentSession || !currentLearningUnit?.id || assessmentSubmitting) return;
    const learningUnitId = currentLearningUnit.id;
    const sessionId = assessmentSession.id;
    const requestId = ++assessmentSubmitRequestRef.current;
    const token = createAssessmentOperationToken({
      generation: assessmentGenerationRef.current,
      learningUnitId,
      sessionId,
      requestId,
    });
    setAssessmentSubmitting(true);
    setAssessmentSubmitError(null);
    try {
      const { attempt, session } = await assessmentRuntime.sessionLifecycle.submit({
        learningUnitId,
        sessionId,
        questionId,
        answer,
      });
      if (!isAssessmentOperationCurrent(token, {
        generation: assessmentGenerationRef.current,
        learningUnitId: assessmentContextRef.current.learningUnitId,
        sessionId: assessmentContextRef.current.sessionId,
        requestId: assessmentSubmitRequestRef.current,
      })) return;
      setAssessmentSession(session);
      const item = assessmentSession.items.find((candidate) => candidate.questionId === questionId);
      setAssessmentFeedback({
        correct: attempt.correct,
        explanation: item?.snapshot?.content?.explanation ?? "已记录本次作答。",
      });
      setAssessmentSubmitError(null);
    } catch (error) {
      if (!isAssessmentOperationCurrent(token, {
        generation: assessmentGenerationRef.current,
        learningUnitId: assessmentContextRef.current.learningUnitId,
        sessionId: assessmentContextRef.current.sessionId,
        requestId: assessmentSubmitRequestRef.current,
      })) return;
      setAssessmentFeedback(null);
      setAssessmentSubmitError(error?.message || "提交答案失败");
    } finally {
      if (isAssessmentOperationCurrent(token, {
        generation: assessmentGenerationRef.current,
        learningUnitId: assessmentContextRef.current.learningUnitId,
        sessionId: assessmentContextRef.current.sessionId,
        requestId: assessmentSubmitRequestRef.current,
      })) setAssessmentSubmitting(false);
    }
  };

  const handleAssessmentNext = () => {
    if (!assessmentSession || assessmentIndex >= assessmentSession.items.length - 1) return;
    setAssessmentIndex((index) => index + 1);
    setAssessmentAnswer(null);
    setAssessmentFeedback(null);
    setAssessmentSubmitError(null);
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

  const handleVisualSourceLocate = (target) => {
    if (!target?.learningUnitId || !target?.fileName) return;
    const learningUnitExists = demos.some((demo) => demo.id === target.learningUnitId);
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

    const targetExists = demos.some((demo) => demo.id === conversation.learningUnitId);
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
          {assessmentRuntime?.storageNotice && <p role="status">{assessmentRuntime.storageNotice}</p>}
          {!assessmentRuntime && <p role="status">正在初始化评测存储…</p>}
          {assessmentInitializationError && (
            <div role="alert" className="mx-4 mt-4 rounded-lg border border-[var(--color-danger-border)] bg-[var(--color-danger-light)] p-3 text-sm text-[var(--color-danger-text)] sm:mx-5">
              <strong>评测初始化未完全成功</strong>
              <p className="mt-1 mb-2">{assessmentInitializationError}</p>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setAssessmentInitializationRetry((value) => value + 1)}>
                重试加载
              </button>
            </div>
          )}
          <AssessmentPane
            runtime={assessmentRuntime}
            learningUnitId={currentLearningUnit.id}
            session={assessmentSession}
            currentIndex={assessmentIndex}
            answer={assessmentAnswer}
            feedback={assessmentFeedback}
            startError={assessmentStartError}
            starting={assessmentStarting}
            submitError={assessmentSubmitError}
            submitting={assessmentSubmitting}
            onStart={assessmentRuntime && assessmentQuestions.length ? handleAssessmentStart : undefined}
            onAnswerChange={(value) => {
              setAssessmentAnswer(value);
              setAssessmentSubmitError(null);
            }}
            onSubmit={handleAssessmentSubmit}
            onNext={handleAssessmentNext}
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
            <span className="breadcrumb-current">{viewMode === "all" ? "全部知识点看板" : currentDemo?.label}</span>
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
          currentDemo ? (
            <div key={currentDemo.id} className="demo-page">
              <DemoSourceLocator
                learningUnit={currentLearningUnit}
                enabled={sourceLocatorActive}
                onLocate={handleVisualSourceLocate}
              >
                <currentDemo.Component />
              </DemoSourceLocator>
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
                  <DemoSourceLocator
                    learningUnit={learningUnit}
                    enabled={sourceLocatorActive}
                    onLocate={handleVisualSourceLocate}
                  >
                    <demo.Component />
                  </DemoSourceLocator>
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
