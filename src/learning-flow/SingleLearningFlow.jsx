import { LEARNING_FLOW_STAGES } from "./learningFlowRegistry.js";
import "./SingleLearningFlow.css";

const STAGE_ITEMS = Object.freeze([
  { id: LEARNING_FLOW_STAGES.UNDERSTAND, index: 1, label: "理解" },
  { id: LEARNING_FLOW_STAGES.PRACTICE, index: 2, label: "实践" },
  { id: LEARNING_FLOW_STAGES.VERIFY, index: 3, label: "验证" },
]);

export function SingleLearningFlow({
  learningUnit,
  definition,
  stage = LEARNING_FLOW_STAGES.UNDERSTAND,
  onStageChange,
  renderDemo,
  renderNotes,
  renderPractice,
  renderVerify,
  onOpenOfficial,
  onOpenSource,
  onOpenAi,
  onContinue,
  verificationSession = null,
  assessmentReview = null,
}) {
  const latestReview = assessmentReview?.review ?? assessmentReview?.history?.[0] ?? null;
  const needsReview = Boolean(latestReview?.incorrectCount > 0);
  const currentStage = STAGE_ITEMS.find((item) => item.id === stage) ?? STAGE_ITEMS[0];

  if (!learningUnit || !definition || definition.learningUnitId !== learningUnit.id) return null;

  return (
    <section
      className="single-learning-flow"
      data-learning-flow="single"
      data-learning-unit={learningUnit.id}
      data-learning-stage={currentStage.id}
      aria-labelledby="single-learning-flow-title"
    >
      <header className="single-learning-flow__header">
        <div className="single-learning-flow__heading">
          <p className="single-learning-flow__eyebrow">Learning Loop · 首课试点</p>
          <h2 id="single-learning-flow-title">{learningUnit.title}</h2>
          <p>{definition.objective}</p>
        </div>

        <nav className="single-learning-flow__stages" aria-label="当前知识点学习阶段">
          {STAGE_ITEMS.map((item) => {
            const active = item.id === currentStage.id;
            return (
              <button
                key={item.id}
                type="button"
                className={active ? "is-active" : ""}
                aria-current={active ? "step" : undefined}
                onClick={() => onStageChange?.(item.id)}
              >
                <span>{item.index}</span>
                <strong>{item.label}</strong>
              </button>
            );
          })}
        </nav>

        <div className="single-learning-flow__next-action" role="status">
          <strong>当前任务：</strong>
          <span>{definition.stageHints?.[currentStage.id]}</span>
        </div>

        {needsReview && (
          <div className="single-learning-flow__review-signal" role="status">
            <div>
              <strong>需要复习</strong>
              <span>最近一次已完成评测有 {latestReview.incorrectCount} 道错误。</span>
            </div>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => onStageChange?.(LEARNING_FLOW_STAGES.UNDERSTAND)}>
              回到理解
            </button>
          </div>
        )}
      </header>

      {currentStage.id === LEARNING_FLOW_STAGES.UNDERSTAND && (
        <div className="single-learning-flow__stage" data-learning-stage-panel="understand">
          <div className="single-learning-flow__concept-grid">
            <article className="single-learning-flow__concept single-learning-flow__concept--primary">
              <span>核心模型</span>
              <h3>key → Component Identity → State preservation</h3>
              <p>{definition.mentalModel}</p>
            </article>
            <article className="single-learning-flow__concept">
              <span>常见误区</span>
              <h3>不只是性能优化</h3>
              <p>{definition.misconception}</p>
            </article>
            <article className="single-learning-flow__concept">
              <span>工程判断</span>
              <h3>什么时候必须稳定 key</h3>
              <p>{definition.decisionRule}</p>
            </article>
          </div>

          <div className="single-learning-flow__demo">
            <div className="single-learning-flow__section-heading">
              <div>
                <span>Observable evidence</span>
                <h3>先看真实行为</h3>
              </div>
              <button type="button" className="btn btn-outline btn-sm" onClick={onOpenSource}>
                查看核心源码
              </button>
            </div>
            {renderDemo?.()}
          </div>

          <div className="single-learning-flow__actions">
            <button type="button" className="btn btn-primary" onClick={() => onStageChange?.(LEARNING_FLOW_STAGES.PRACTICE)}>
              开始实践 →
            </button>
            <button type="button" className="btn btn-outline" onClick={onOpenOfficial}>
              React 官方解释
            </button>
            <button type="button" className="btn btn-outline" onClick={onOpenAi}>
              问 AI 当前概念
            </button>
          </div>

          {renderNotes && (
            <details className="single-learning-flow__notes">
              <summary>阅读完整笔记</summary>
              <div>{renderNotes()}</div>
            </details>
          )}
        </div>
      )}

      {currentStage.id === LEARNING_FLOW_STAGES.PRACTICE && (
        <div className="single-learning-flow__stage" data-learning-stage-panel="practice">
          <div className="single-learning-flow__stage-intro">
            <span>Practice</span>
            <h3>先做判断，再让 Demo 证明或推翻它</h3>
            <p>这里复用现有 Guided runtime，但它只是本节“实践”阶段，不是另一套学习模式。</p>
          </div>
          {renderPractice?.({
            onComplete: () => onStageChange?.(LEARNING_FLOW_STAGES.VERIFY),
          })}
        </div>
      )}

      {currentStage.id === LEARNING_FLOW_STAGES.VERIFY && (
        <div className="single-learning-flow__stage" data-learning-stage-panel="verify">
          <div className="single-learning-flow__stage-intro">
            <span>Verify</span>
            <h3>不看答案，独立检查一次</h3>
            <p>这组题来自产品内置 canonical questions；不需要先让 AI 帮你出题。</p>
          </div>

          {renderVerify?.()}

          {verificationSession?.status === "completed" && (
            <div className="single-learning-flow__completion">
              <div>
                <strong>{needsReview ? "本节已验证，但还有需要复习的点" : "本节验证完成"}</strong>
                <p>
                  {needsReview
                    ? "先根据错误反馈回到证据，再决定是否继续。"
                    : "当前证据没有发现错误；这不等同于生成一个虚假的 mastery 百分比。"}
                </p>
              </div>
              <div className="single-learning-flow__completion-actions">
                {needsReview && (
                  <button type="button" className="btn btn-outline" onClick={() => onStageChange?.(LEARNING_FLOW_STAGES.UNDERSTAND)}>
                    回顾证据
                  </button>
                )}
                <button type="button" className="btn btn-primary" onClick={onContinue}>
                  下一知识点 →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default SingleLearningFlow;
