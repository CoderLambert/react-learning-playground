import { HighlightedCode } from "../components/HighlightedCode.jsx";
import {
  GUIDED_FLOW_ACTIONS,
} from "./guidedFlow.js";
import {
  evaluateGuidedPracticeResponse,
  getInitialGuidedPracticeDraft,
  GUIDED_PRACTICE_KINDS,
  isGuidedPracticeResponseValidForStep,
  normalizeGuidedPracticeResponse,
} from "./guidedPractice.js";

function getSelectedOptionId(value) {
  const response = normalizeGuidedPracticeResponse(value);
  if (!response || response.kind === GUIDED_PRACTICE_KINDS.ORDERED_SEQUENCE) return null;
  return response.optionId;
}

function getSequenceItemIds(step, value) {
  const response = normalizeGuidedPracticeResponse(value)
    ?? getInitialGuidedPracticeDraft(step);
  return response?.kind === GUIDED_PRACTICE_KINDS.ORDERED_SEQUENCE
    ? [...response.itemIds]
    : [];
}

function PracticeResponseSummary({ summary, label }) {
  if (!summary) return null;

  if (summary.kind === GUIDED_PRACTICE_KINDS.ORDERED_SEQUENCE) {
    return (
      <div className="guided-flow-practice-summary">
        <strong>{label}</strong>
        <ol>
          {summary.items.map((item) => <li key={item.itemId}>{item.label}</li>)}
        </ol>
      </div>
    );
  }

  return (
    <div className="guided-flow-practice-summary">
      <strong>{label}</strong>
      <p>{summary.label}</p>
      {summary.kind === GUIDED_PRACTICE_KINDS.PATCH_CHOICE && summary.patch && (
        <pre className="guided-flow-patch"><code>{summary.patch}</code></pre>
      )}
    </div>
  );
}

export function GuidedPracticeOutcomeSummary({ outcome }) {
  if (!outcome) return null;

  return (
    <div
      className="guided-flow-observation guided-flow-practice-outcome"
      role="status"
      data-guided-practice-outcome={outcome.correct ? "correct" : "incorrect"}
    >
      <strong>{outcome.correct ? "回答正确" : "需要修正"}</strong>
      <PracticeResponseSummary summary={outcome.response} label="你的提交" />
      <PracticeResponseSummary summary={outcome.expected} label="期望结果" />
      {outcome.rationale && (
        <div className="guided-flow-practice-rationale">
          <strong>为什么</strong>
          <p>{outcome.rationale}</p>
        </div>
      )}
    </div>
  );
}

function PracticeOptionList({
  step,
  state,
  dispatch,
  inputName,
  patch = false,
}) {
  const committed = Boolean(state.practiceResponse);
  const selectedOptionId = getSelectedOptionId(state.practiceDraft);

  return (
    <div className="guided-flow-options" role="radiogroup" aria-label="你的 practice 回答">
      {step.response.options.map((option) => (
        <label key={option.id} className="guided-flow-option guided-flow-practice-option">
          <input
            type="radio"
            name={inputName}
            value={option.id}
            checked={selectedOptionId === option.id}
            disabled={committed}
            onChange={() => dispatch({
              type: GUIDED_FLOW_ACTIONS.SET_PRACTICE_DRAFT,
              value: {
                kind: step.response.kind,
                optionId: option.id,
              },
            })}
          />
          <span className="guided-flow-practice-option-content">
            <span>{option.label}</span>
            {patch && <pre className="guided-flow-patch"><code>{option.patch}</code></pre>}
          </span>
        </label>
      ))}
    </div>
  );
}

function OrderedSequencePractice({
  step,
  state,
  dispatch,
}) {
  const committed = Boolean(state.practiceResponse);
  const itemIds = getSequenceItemIds(step, state.practiceDraft);
  const itemMap = new Map(step.response.items.map((item) => [item.id, item]));

  const move = (itemId, delta) => {
    if (committed) return;
    const from = itemIds.indexOf(itemId);
    const to = from + delta;
    if (from < 0 || to < 0 || to >= itemIds.length) return;

    const nextIds = [...itemIds];
    [nextIds[from], nextIds[to]] = [nextIds[to], nextIds[from]];
    dispatch({
      type: GUIDED_FLOW_ACTIONS.SET_PRACTICE_DRAFT,
      value: {
        kind: GUIDED_PRACTICE_KINDS.ORDERED_SEQUENCE,
        itemIds: nextIds,
      },
    });
  };

  return (
    <ol className="guided-flow-sequence" aria-label="你的执行顺序">
      {itemIds.map((itemId, index) => (
        <li key={itemId} data-guided-sequence-item={itemId}>
          <span className="guided-flow-sequence-index">{index + 1}</span>
          <span className="guided-flow-sequence-label">{itemMap.get(itemId)?.label ?? itemId}</span>
          <span className="guided-flow-sequence-actions">
            <button
              type="button"
              className="btn btn-outline"
              disabled={committed || index === 0}
              onClick={() => move(itemId, -1)}
              aria-label={`上移 ${itemMap.get(itemId)?.label ?? itemId}`}
            >
              上移
            </button>
            <button
              type="button"
              className="btn btn-outline"
              disabled={committed || index === itemIds.length - 1}
              onClick={() => move(itemId, 1)}
              aria-label={`下移 ${itemMap.get(itemId)?.label ?? itemId}`}
            >
              下移
            </button>
          </span>
        </li>
      ))}
    </ol>
  );
}

export function GuidedPracticeActivity({
  step,
  state,
  dispatch,
  inputName,
}) {
  const committed = Boolean(state.practiceResponse);
  const kind = step.response.kind;
  const draft = kind === GUIDED_PRACTICE_KINDS.ORDERED_SEQUENCE
    ? (normalizeGuidedPracticeResponse(state.practiceDraft) ?? getInitialGuidedPracticeDraft(step))
    : normalizeGuidedPracticeResponse(state.practiceDraft);
  const canSubmit = isGuidedPracticeResponseValidForStep(step, draft, { allowNull: false });
  const outcome = committed
    ? evaluateGuidedPracticeResponse(step, state.practiceResponse)
    : null;

  const submit = () => {
    if (!canSubmit || committed) return;
    dispatch({
      type: GUIDED_FLOW_ACTIONS.SUBMIT_PRACTICE,
      value: draft,
    });
  };

  return (
    <div className="guided-flow-step" data-guided-step-panel="practice" data-guided-practice-kind={kind}>
      <p className="guided-flow-eyebrow">迁移到新情境</p>
      <h3>{step.prompt}</h3>

      {step.codeContext && (
        <div className="guided-flow-code-context" data-guided-practice-code-context>
          {step.codeContext.label && <strong>{step.codeContext.label}</strong>}
          <HighlightedCode
            code={step.codeContext.code}
            language={step.codeContext.language ?? "jsx"}
            className="guided-flow-patch"
          />
        </div>
      )}

      {kind === GUIDED_PRACTICE_KINDS.CHOICE && (
        <PracticeOptionList
          step={step}
          state={state}
          dispatch={dispatch}
          inputName={inputName}
        />
      )}

      {kind === GUIDED_PRACTICE_KINDS.PATCH_CHOICE && (
        <PracticeOptionList
          step={step}
          state={state}
          dispatch={dispatch}
          inputName={inputName}
          patch
        />
      )}

      {kind === GUIDED_PRACTICE_KINDS.ORDERED_SEQUENCE && (
        <OrderedSequencePractice
          step={step}
          state={state}
          dispatch={dispatch}
        />
      )}

      {!committed && (
        <p className="guided-flow-hint">
          提交前不会显示正确结果；首次提交会作为本次学习记录保留。
        </p>
      )}

      {committed && <GuidedPracticeOutcomeSummary outcome={outcome} />}

      <button
        type="button"
        className="btn btn-primary"
        disabled={committed || !canSubmit}
        onClick={submit}
      >
        {committed ? "已完成 practice" : "提交 practice，查看 review"}
      </button>
    </div>
  );
}
