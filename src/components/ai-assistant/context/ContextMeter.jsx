import { useId, useState } from "react";
import "./ContextMeter.css";

const LABELS = Object.freeze({
  system: "System",
  note: "Note",
  sources: "Sources",
  summary: "Summary",
  history: "Recent history",
  input: "Current input",
});

export function ContextMeter({ budget, onCompact, compacting = false, disabled = false }) {
  const [expanded, setExpanded] = useState(false);
  const detailsId = useId();

  if (!budget) return null;

  const used = Number(budget.estimatedInputTokens) || 0;
  const soft = Number(budget.softBudgetTokens) || 0;
  const modelWindow = Number(budget.model?.contextWindowTokens) || 0;
  const actual = budget.actualUsage;
  const level = budget.overSoftBudget ? "danger" : budget.shouldCompact ? "warning" : "normal";

  return (
    <section className={`ai-context-meter ai-context-meter--${level}`} aria-label="AI context usage">
      <div className="ai-context-meter__summary">
        <button
          type="button"
          className="ai-context-meter__toggle"
          aria-expanded={expanded}
          aria-controls={detailsId}
          onClick={() => setExpanded((value) => !value)}
        >
          <span>Context</span>
          <strong>{formatTokens(used)} / {formatTokens(soft)}</strong>
          <span className="ai-context-meter__window">of {formatTokens(modelWindow)} model window</span>
          <span className="ai-context-meter__estimate">Estimated</span>
        </button>

        <button
          type="button"
          className="ai-context-meter__compact"
          onClick={onCompact}
          disabled={disabled || compacting || typeof onCompact !== "function"}
        >
          {compacting ? "Compacting…" : "Compact"}
        </button>
      </div>

      <progress
        className="ai-context-meter__progress"
        max={Math.max(soft, 1)}
        value={Math.min(used, Math.max(soft, 1))}
        aria-label="Estimated application context budget usage"
      />

      {expanded ? (
        <div id={detailsId} className="ai-context-meter__details">
          <dl>
            {Object.entries(budget.breakdown || {}).map(([key, value]) => (
              <div key={key} className="ai-context-meter__row">
                <dt>{LABELS[key] || key}</dt>
                <dd>≈ {formatTokens(value)}</dd>
              </div>
            ))}
          </dl>
          {actual ? (
            <p className="ai-context-meter__actual">
              Last actual request: {formatTokens(actual.inputTokens)} input · {formatTokens(actual.outputTokens)} output
            </p>
          ) : (
            <p className="ai-context-meter__actual">Actual provider usage not available yet.</p>
          )}
        </div>
      ) : null}
    </section>
  );
}

function formatTokens(value) {
  const number = Math.max(0, Number(value) || 0);
  if (number >= 1_000_000) return `${(number / 1_000_000).toFixed(number >= 10_000_000 ? 0 : 1)}M`;
  if (number >= 1_000) return `${(number / 1_000).toFixed(number >= 100_000 ? 0 : 1)}K`;
  return String(Math.round(number));
}
