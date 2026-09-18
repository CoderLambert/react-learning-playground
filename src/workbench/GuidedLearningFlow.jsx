import { useId } from "react";
import {
  GUIDED_FLOW_ACTIONS,
  GUIDED_FLOW_STEP_INDEX,
  getGuidedFlowUnlockedStep,
} from "./guidedFlow.js";
import { useGuidedFlow } from "./useGuidedFlow.js";
import "./GuidedLearningFlow.css";

const STEP_LABELS = Object.freeze({
  predict: "Predict",
  experiment: "Experiment",
  explain: "Explain",
  practice: "Practice",
  review: "Review",
});

function getChoiceLabel(step, optionId) {
  return step?.response?.options?.find((option) => option.id === optionId)?.label ?? optionId ?? "未选择";
}

function GuidedStepProgress({ definition, state, onNavigate }) {
  const unlockedStep = getGuidedFlowUnlockedStep(state);
  return (
    <nav className="guided-flow-progress" aria-label="Guided 学习步骤">
      {definition.steps.map((step, index) => (
        <button
          key={step.id}
          type="button"
          className={index === state.stepIndex ? "is-current" : ""}
          aria-current={index === state.stepIndex ? "step" : undefined}
          disabled={index > unlockedStep}
          data-guided-step={step.type}
          onClick={() => onNavigate(index)}
        >
          <span className="guided-flow-progress-index">{index + 1}</span>
          <span>{STEP_LABELS[step.type] ?? step.type}</span>
        </button>
      ))}
    </nav>
  );
}

function GuidedPredictionStep({ definition, state, dispatch, inputName }) {
  const step = definition.steps[GUIDED_FLOW_STEP_INDEX.PREDICT];
  const committed = Boolean(state.firstPrediction);
  return (
    <div className="guided-flow-step" data-guided-step-panel="predict">
      <p className="guided-flow-eyebrow">先预测，再看结果</p>
      <h3>{step.prompt}</h3>
      <div className="guided-flow-options" role="radiogroup" aria-label="你的 prediction">
        {step.response.options.map((option) => (
          <label key={option.id} className="guided-flow-option">
            <input
              type="radio"
              name={inputName}
              value={option.id}
              checked={state.predictionDraft === option.id}
              disabled={committed}
              onChange={() => dispatch({
                type: GUIDED_FLOW_ACTIONS.SET_PREDICTION_DRAFT,
                value: option.id,
              })}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {committed && (
        <p className="guided-flow-status" role="status" data-guided-first-prediction={state.firstPrediction}>
          首次 prediction 已记录为「{getChoiceLabel(step, state.firstPrediction)}」。普通步骤导航不会覆盖它。
        </p>
      )}
      {!committed && <p className="guided-flow-hint">提交前不会显示正确结果。</p>}
      <button
        type="button"
        className="btn btn-primary"
        disabled={committed || !state.predictionDraft}
        onClick={() => dispatch({ type: GUIDED_FLOW_ACTIONS.SUBMIT_PREDICTION })}
      >
        提交 prediction
      </button>
    </div>
  );
}

function GuidedExperimentStep({ definition, state, dispatch, renderDemo }) {
  const step = definition.steps[GUIDED_FLOW_STEP_INDEX.EXPERIMENT];
  return (
    <div className="guided-flow-step" data-guided-step-panel="experiment">
      <p className="guided-flow-eyebrow">操作真实 Demo</p>
      <h3>{step.prompt}</h3>
      <div className="guided-flow-demo-surface">
        {renderDemo?.()}
      </div>
      <button
        type="button"
        className="btn btn-primary"
        disabled={state.experimentAcknowledged}
        onClick={() => dispatch({
          type: GUIDED_FLOW_ACTIONS.ACKNOWLEDGE_EXPERIMENT,
          observation: step.expectedObservation,
        })}
      >
        {state.experimentAcknowledged ? "已记录实际观察" : "我已运行并观察结果"}
      </button>
      {state.experimentAcknowledged && (
        <div className="guided-flow-observation" role="status">
          <strong>实际观察</strong>
          <p>{state.observation || step.expectedObservation}</p>
        </div>
      )}
    </div>
  );
}

function GuidedExplainStep({ definition, state, dispatch }) {
  const step = definition.steps[GUIDED_FLOW_STEP_INDEX.EXPLAIN];
  return (
    <div className="guided-flow-step" data-guided-step-panel="explain">
      <p className="guided-flow-eyebrow">用自己的话解释</p>
      <h3>{step.prompt}</h3>
      <label className="guided-flow-field">
        <span>你的 explanation</span>
        <textarea
          aria-label="你的 explanation"
          value={state.explanation}
          placeholder={step.response.placeholder}
          disabled={state.explanationSubmitted}
          onChange={(event) => dispatch({
            type: GUIDED_FLOW_ACTIONS.SET_EXPLANATION,
            value: event.target.value,
          })}
        />
      </label>
      {state.explanationSubmitted && (
        <p className="guided-flow-status" role="status">已保存原始 explanation；这里不自动判定对错。</p>
      )}
      <button
        type="button"
        className="btn btn-primary"
        disabled={state.explanationSubmitted || !state.explanation.trim()}
        onClick={() => dispatch({ type: GUIDED_FLOW_ACTIONS.SUBMIT_EXPLANATION })}
      >
        {state.explanationSubmitted ? "已保存 explanation" : "保存 explanation，继续 practice"}
      </button>
    </div>
  );
}

function GuidedPracticeStep({ definition, state, dispatch, inputName }) {
  const step = definition.steps[GUIDED_FLOW_STEP_INDEX.PRACTICE];
  const committed = Boolean(state.practiceResponse);
  return (
    <div className="guided-flow-step" data-guided-step-panel="practice">
      <p className="guided-flow-eyebrow">迁移到新情境</p>
      <h3>{step.prompt}</h3>
      <div className="guided-flow-options" role="radiogroup" aria-label="你的 practice 回答">
        {step.response.options.map((option) => (
          <label key={option.id} className="guided-flow-option">
            <input
              type="radio"
              name={inputName}
              value={option.id}
              checked={state.practiceDraft === option.id}
              disabled={committed}
              onChange={() => dispatch({
                type: GUIDED_FLOW_ACTIONS.SET_PRACTICE_DRAFT,
                value: option.id,
              })}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {committed && (
        <div className="guided-flow-observation" role="status">
          <strong>已记录 practice 回答</strong>
          <p>{step.reveal.observation}</p>
        </div>
      )}
      <button
        type="button"
        className="btn btn-primary"
        disabled={committed || !state.practiceDraft}
        onClick={() => dispatch({ type: GUIDED_FLOW_ACTIONS.SUBMIT_PRACTICE })}
      >
        {committed ? "已完成 practice" : "提交 practice，查看 review"}
      </button>
    </div>
  );
}

function GuidedReviewStep({ definition, state, dispatch, onReviewResource }) {
  const predictionStep = definition.steps[GUIDED_FLOW_STEP_INDEX.PREDICT];
  const practiceStep = definition.steps[GUIDED_FLOW_STEP_INDEX.PRACTICE];
  const step = definition.steps[GUIDED_FLOW_STEP_INDEX.REVIEW];

  const handleResource = (resource) => {
    if (resource === "demo") {
      dispatch({ type: GUIDED_FLOW_ACTIONS.EXIT });
      return;
    }
    onReviewResource?.(resource);
  };

  return (
    <div className="guided-flow-step" data-guided-step-panel="review">
      <p className="guided-flow-eyebrow">回到证据验证理解</p>
      <h3>{step.prompt}</h3>
      <div className="guided-flow-evidence" aria-label="本次 Guided 学习记录">
        <div>
          <strong>Your first prediction</strong>
          <p>{getChoiceLabel(predictionStep, state.firstPrediction)}</p>
        </div>
        <div>
          <strong>Actual observation</strong>
          <p>{state.observation || "尚未记录"}</p>
        </div>
        <div>
          <strong>Your explanation</strong>
          <p>{state.explanation || "尚未记录"}</p>
        </div>
        <div>
          <strong>Practice outcome</strong>
          <p>{getChoiceLabel(practiceStep, state.practiceResponse)}</p>
        </div>
      </div>
      <p className="guided-flow-hint">这些是本次 session 的原始学习记录；Explanation 不在这里自动评分。</p>
      <div className="guided-flow-review-actions" aria-label="Review 资源">
        {step.resources.map((resource) => (
          <button
            key={resource}
            type="button"
            className="btn btn-outline"
            data-guided-review-resource={resource}
            onClick={() => handleResource(resource)}
          >
            {resource === "notes" && "回顾 Notes"}
            {resource === "source" && "回顾 Source"}
            {resource === "demo" && "回到 Demo"}
          </button>
        ))}
      </div>
    </div>
  );
}

export function GuidedLearningFlow({
  learningUnit,
  definition,
  renderDemo,
  onReviewResource,
}) {
  const predictionInputId = useId();
  const practiceInputId = useId();
  const {
    state,
    isCurrentActivity,
    persistenceNotice,
    start,
    exit,
    startOver,
    dispatch,
  } = useGuidedFlow({
    learningUnitId: learningUnit?.id,
    activityRevision: definition?.revision,
    definition,
  });

  if (!definition || !learningUnit || definition.learningUnitId !== learningUnit.id || !isCurrentActivity) {
    return null;
  }

  if (!state.active) {
    return (
      <>
        <section className="guided-flow-entry" data-guided-entry aria-labelledby="guided-learning-entry-title">
          <div>
            <p className="guided-flow-eyebrow">可选学习路径</p>
            <h2 id="guided-learning-entry-title">Guided Learning</h2>
            <p>先暴露 prediction，再操作真实 Demo、写下 explanation，最后完成一个 practice 迁移题。</p>
            {persistenceNotice && (
              <p className="guided-flow-persistence-notice" role="status" data-guided-persistence-status>
                {persistenceNotice}
              </p>
            )}
          </div>
          <button type="button" className="btn btn-primary" data-guided-action="start" onClick={start}>
            {state.completionState === "not-started" ? "开始 Guided Learning" : "继续 Guided Learning"}
          </button>
        </section>
        <div className="guided-flow-free-explore" data-guided-free-explore>
          {renderDemo?.()}
        </div>
      </>
    );
  }

  const currentStep = definition.steps[state.stepIndex];
  return (
    <section
      className="guided-flow"
      data-guided-flow
      data-guided-status={state.completionState}
      data-guided-current-step={currentStep.type}
      data-guided-learning-unit={learningUnit.id}
      aria-labelledby="guided-learning-title"
    >
      <header className="guided-flow-header">
        <div>
          <p className="guided-flow-eyebrow">Guided Learning · {learningUnit.title}</p>
          <h2 id="guided-learning-title">{definition.goal}</h2>
          {persistenceNotice && (
            <p className="guided-flow-persistence-notice" role="status" data-guided-persistence-status>
              {persistenceNotice}
            </p>
          )}
        </div>
        <div className="guided-flow-header-actions">
          <button type="button" className="btn btn-outline" data-guided-action="start-over" onClick={startOver}>
            重新开始
          </button>
          <button type="button" className="btn btn-outline" data-guided-action="exit" onClick={exit}>
            退出 Guided Mode
          </button>
        </div>
      </header>
      <GuidedStepProgress
        definition={definition}
        state={state}
        onNavigate={(stepIndex) => dispatch({ type: GUIDED_FLOW_ACTIONS.NAVIGATE, stepIndex })}
      />
      <div className="guided-flow-current-step">
        {currentStep.type === "predict" && (
          <GuidedPredictionStep
            definition={definition}
            state={state}
            dispatch={dispatch}
            inputName={predictionInputId}
          />
        )}
        {currentStep.type === "experiment" && (
          <GuidedExperimentStep
            definition={definition}
            state={state}
            dispatch={dispatch}
            renderDemo={renderDemo}
          />
        )}
        {currentStep.type === "explain" && (
          <GuidedExplainStep definition={definition} state={state} dispatch={dispatch} />
        )}
        {currentStep.type === "practice" && (
          <GuidedPracticeStep
            definition={definition}
            state={state}
            dispatch={dispatch}
            inputName={practiceInputId}
          />
        )}
        {currentStep.type === "review" && (
          <GuidedReviewStep
            definition={definition}
            state={state}
            dispatch={dispatch}
            onReviewResource={onReviewResource}
          />
        )}
      </div>
    </section>
  );
}
