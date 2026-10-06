import { LEARNING_FLOW_STAGES } from "./learningFlowRegistry.js";
import { createLearningReviewProjection } from "./learningReviewProjection.js";
import { LEARNING_COMPLETION_NEXT_ACTION, LEARNING_COMPLETION_STATUS } from "../learning-completion/public.js";
import { HighlightedCode } from "../components/HighlightedCode.jsx";
import { resolveLearningSourceExcerpt } from "./sourceEvidence.js";
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

function SourceEvidence({ learningUnit, model }) {
  if (!model?.codeEvidence?.length) return null;

  const items = model.codeEvidence
    .map((item) => ({
      ...item,
      excerpt: resolveLearningSourceExcerpt(learningUnit, item.sourceRef),
    }))
    .filter((item) => item.excerpt);

  if (items.length === 0) return null;
  const titleId = `${model.learningUnitId}-source-evidence-title`;

  return (
    <section
      className="single-learning-flow__source-evidence"
      aria-labelledby={titleId}
      data-learning-code-evidence
    >
      <div className="single-learning-flow__section-heading">
        <div>
          <span>Real React code</span>
          <h3 id={titleId}>把机制落到当前 Demo 的真实实现</h3>
        </div>
      </div>

      <div className="single-learning-flow__source-evidence-grid">
        {items.map((item) => (
          <article
            key={item.id}
            className="single-learning-flow__source-evidence-card"
            data-learning-code-evidence-item={item.id}
          >
            <div className="single-learning-flow__source-evidence-meta">
              <strong>{item.title}</strong>
              <span>
                {item.excerpt.fileName} · L{item.excerpt.startLine}–L{item.excerpt.endLine}
              </span>
            </div>
            <HighlightedCode
              code={item.excerpt.code}
              fileName={item.excerpt.fileName}
              className="single-learning-flow__source-evidence-code"
            />
            <p>{item.explanation}</p>
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
  onRetryVerify,
  completion = null,
  completionLoading = false,
  completionError = null,
  assessmentReview = null,
  guidedNeedsReview = false,
}) {
  const reviewProjection = createLearningReviewProjection({
    assessmentReview,
    guidedNeedsReview,
  });
  const needsReview = reviewProjection.needsReview
    || completion?.status === LEARNING_COMPLETION_STATUS.NEEDS_REVIEW;
  const completionAction = completion?.nextAction ?? null;
  const currentStage = STAGE_ITEMS.find((item) => item.id === stage) ?? STAGE_ITEMS[0];

  if (!learningUnit || !definition || definition.learningUnitId !== learningUnit.id) return null;

  return (
    <section
      className="single-learning-flow"
      data-learning-flow="single"
      data-learning-unit={learningUnit.id}
      data-learning-stage={currentStage.id}
      data-learning-completion-status={completion?.status ?? (completionLoading ? "loading" : "unavailable")}
      data-learning-completion-next-action={completionAction ?? ""}
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

        {completionError && (
          <div className="single-learning-flow__review-signal" role="alert" data-learning-completion-error>
            <div>
              <strong>完成状态暂不可用</strong>
              <span>{completionError}</span>
            </div>
          </div>
        )}

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
          <SourceEvidence learningUnit={learningUnit} model={definition.conceptModel} />

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

          {completionLoading && (
            <p className="single-learning-flow__next-action" role="status" data-learning-completion-loading>
              正在核对本节学习证据…
            </p>
          )}

          {completion?.status === LEARNING_COMPLETION_STATUS.COMPLETE && completion.canContinue && (
            <div className="single-learning-flow__completion" data-learning-completion-decision="continue">
              <div>
                <strong>本节验证完成</strong>
                <p>实践与验证所需证据均已满足，可以继续下一知识点；需要时也可以随时回顾本节证据。</p>
              </div>
              <div className="single-learning-flow__completion-actions">
                <button type="button" className="btn btn-primary" onClick={onContinue}>
                  下一知识点 →
                </button>
              </div>
            </div>
          )}

          {completion?.status === LEARNING_COMPLETION_STATUS.NEEDS_REVIEW && (
            <div className="single-learning-flow__completion" data-learning-completion-decision={completionAction}>
              <div>
                <strong>本节还需要处理一项学习证据</strong>
                <p>
                  {completionAction === LEARNING_COMPLETION_NEXT_ACTION.RETRY_VERIFY
                    ? "当前正式验证仍有错误证据；本地纠正不会覆盖原始结果，请开启新一轮验证。"
                    : completionAction === LEARNING_COMPLETION_NEXT_ACTION.REVIEW_GUIDED
                      ? "实践证据已正确，但你仍保留了需要复习标记；先回到实践回顾再继续。"
                      : "实践证据尚未满足当前闭环，请先回到实践重试。"}
                </p>
              </div>
              <div className="single-learning-flow__completion-actions">
                {completionAction === LEARNING_COMPLETION_NEXT_ACTION.RETRY_VERIFY ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={onRetryVerify}
                    disabled={typeof onRetryVerify !== "function"}
                  >
                    重新验证
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => onStageChange?.(LEARNING_FLOW_STAGES.PRACTICE)}
                  >
                    返回实践
                  </button>
                )}
                <button type="button" className="btn btn-outline" onClick={() => onStageChange?.(LEARNING_FLOW_STAGES.UNDERSTAND)}>
                  回顾证据
                </button>
              </div>
            </div>
          )}

          {completion && completion.status !== LEARNING_COMPLETION_STATUS.COMPLETE
            && completion.status !== LEARNING_COMPLETION_STATUS.NEEDS_REVIEW
            && [
              LEARNING_COMPLETION_NEXT_ACTION.START_PRACTICE,
              LEARNING_COMPLETION_NEXT_ACTION.RESUME_PRACTICE,
            ].includes(completionAction) && (
              <div className="single-learning-flow__completion" data-learning-completion-decision={completionAction}>
                <div>
                  <strong>先完成实践证据</strong>
                  <p>验证可以浏览，但本节闭环仍需要先完成当前实践。</p>
                </div>
                <div className="single-learning-flow__completion-actions">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => onStageChange?.(LEARNING_FLOW_STAGES.PRACTICE)}
                  >
                    返回实践
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
