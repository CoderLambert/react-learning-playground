import { LEARNING_FLOW_STAGES } from "./learningFlowRegistry.js";
import { createLearningReviewProjection } from "./learningReviewProjection.js";
import "./SingleLearningFlow.css";

const STAGE_ITEMS = Object.freeze([
  { id: LEARNING_FLOW_STAGES.UNDERSTAND, index: 1, label: "理解" },
  { id: LEARNING_FLOW_STAGES.PRACTICE, index: 2, label: "实践" },
  { id: LEARNING_FLOW_STAGES.VERIFY, index: 3, label: "验证" },
]);

function MechanismMap({ model }) {
  if (!model?.mechanismMap?.length) return null;
  const titleId = `${model.learningUnitId}-mechanism-title`;

  return (
    <section className="single-learning-flow__mechanism" aria-labelledby={titleId}>
      <div className="single-learning-flow__section-heading">
        <div>
          <span>Mechanism map</span>
          <h3 id={titleId}>{model.mechanismTitle ?? "先把关键对象分开"}</h3>
        </div>
      </div>

      <div
        className="single-learning-flow__mechanism-table"
        role="table"
        aria-label={model.mechanismAriaLabel ?? "核心机制区分"}
      >
        <div className="single-learning-flow__mechanism-row is-header" role="row">
          <strong role="columnheader">{model.mechanismHeaders?.subject ?? "对象"}</strong>
          <strong role="columnheader">{model.mechanismHeaders?.example ?? "当前 Demo"}</strong>
          <strong role="columnheader">{model.mechanismHeaders?.role ?? "它负责什么"}</strong>
          <strong role="columnheader">{model.mechanismHeaders?.change ?? "变化时会怎样"}</strong>
        </div>
        {model.mechanismMap.map((item) => (
          <div className="single-learning-flow__mechanism-row" role="row" key={item.id}>
            <strong role="cell">{item.label}</strong>
            <code role="cell">{item.example}</code>
            <span role="cell">{item.role}</span>
            <span role="cell">{item.change ?? item.reorder}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ContrastCases({ model }) {
  if (!model?.contrastCases?.length) return null;
  const titleId = `${model.learningUnitId}-contrast-title`;
  const dimensions = model.contrastDimensions ?? [
    { id: "keyStory", label: "key" },
    { id: "identityStory", label: "identity" },
    { id: "stateStory", label: "State" },
    { id: "uiStory", label: "UI" },
  ];

  return (
    <section className="single-learning-flow__contrasts" aria-labelledby={titleId}>
      <div className="single-learning-flow__section-heading">
        <div>
          <span>Contrast cases</span>
          <h3 id={titleId}>{model.contrastTitle ?? "把相似结果背后的不同机制分开"}</h3>
        </div>
      </div>

      <div className="single-learning-flow__contrast-grid">
        {model.contrastCases.map((item) => (
          <article key={item.id} className="single-learning-flow__contrast-card">
            <h4>{item.title}</h4>
            <dl>
              {dimensions.map((dimension) => (
                <div key={dimension.id}>
                  <dt>{dimension.label}</dt>
                  <dd>{item[dimension.id]}</dd>
                </div>
              ))}
            </dl>
            <p>{item.conclusion}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

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
  guidedNeedsReview = false,
}) {
  const reviewProjection = createLearningReviewProjection({
    assessmentReview,
    guidedNeedsReview,
  });
  const needsReview = reviewProjection.needsReview;
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
          <p className="single-learning-flow__eyebrow">本节学习</p>
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
          <div
            className="single-learning-flow__review-signal"
            role="status"
            data-learning-review-assessment-errors={reviewProjection.assessmentIncorrectCount}
            data-learning-review-guided={reviewProjection.guidedNeedsReview ? "true" : "false"}
          >
            <div>
              <strong>需要复习</strong>
              {reviewProjection.assessmentIncorrectCount > 0 && reviewProjection.guidedNeedsReview ? (
                <span>
                  最近一次已完成评测有 {reviewProjection.assessmentIncorrectCount} 道错误；你也在实践回顾中标记了需要复习。
                </span>
              ) : reviewProjection.assessmentIncorrectCount > 0 ? (
                <span>最近一次已完成评测有 {reviewProjection.assessmentIncorrectCount} 道错误。</span>
              ) : (
                <span>你在实践回顾中标记了需要复习。</span>
              )}
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
              <h3>{definition.coreModelTitle}</h3>
              <p>{definition.mentalModel}</p>
            </article>
            <article className="single-learning-flow__concept">
              <span>常见误区</span>
              <h3>{definition.misconceptionTitle}</h3>
              <p>{definition.misconception}</p>
            </article>
            <article className="single-learning-flow__concept">
              <span>工程判断</span>
              <h3>{definition.decisionRuleTitle}</h3>
              <p>{definition.decisionRule}</p>
            </article>
          </div>

          <MechanismMap model={definition.conceptModel} />
          <ContrastCases model={definition.conceptModel} />

          <div className="single-learning-flow__demo">
            <div className="single-learning-flow__section-heading">
              <div>
                <span>Observable evidence</span>
                <h3>再用真实行为验证上面的机制</h3>
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
            <span>实践</span>
            <h3>{definition.practiceTitle ?? "先做判断，再让 Demo 证明或推翻它"}</h3>
            <p>{definition.practiceDescription ?? "先预测结果，再亲手操作真实 Demo，最后把同一个 mental model 迁移到新场景。"}</p>
          </div>
          {renderPractice?.({
            onComplete: () => onStageChange?.(LEARNING_FLOW_STAGES.VERIFY),
          })}
        </div>
      )}

      {currentStage.id === LEARNING_FLOW_STAGES.VERIFY && (
        <div className="single-learning-flow__stage" data-learning-stage-panel="verify">
          <div className="single-learning-flow__stage-intro">
            <span>验证</span>
            <h3>{definition.verifyTitle ?? "不看答案，检查你有没有把几个机制混在一起"}</h3>
            <p>{definition.verifyDescription ?? "诊断题会区分“记住规则”和“能解释底层因果关系”。答错时先用反证实验纠正模型，再看完整解释。"}</p>
          </div>

          {renderVerify?.()}

          {verificationSession?.status === "completed" && (
            <div className="single-learning-flow__completion">
              <div>
                <strong>{needsReview ? "本节已验证，但还有需要复习的点" : "本节验证完成"}</strong>
                <p>
                  {needsReview
                    ? "先根据错误反馈回到证据，再决定是否继续。"
                    : "当前验证没有发现错误，可以继续下一知识点；需要时也可以随时回顾本节证据。"}
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
