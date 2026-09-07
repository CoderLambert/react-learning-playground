import { StrictMode, Profiler } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

const FRAME_BUDGET_MS = 16.67;

/** @typedef {"mount" | "update" | "nested-update"} ProfilerPhase */

/**
 * @typedef {Object} ProfilerRender
 * @property {ProfilerPhase} phase
 * @property {number} actualDuration
 * @property {number} baseDuration
 * @property {number} startTime
 * @property {number} commitTime
 * @property {number} commitDelay
 */

/**
 * @typedef {Object} ProfilerSummary
 * @property {number} renderCount
 * @property {number} mountCount
 * @property {number} updateCount
 * @property {number} slowRenderCount
 * @property {number} totalActualDuration
 * @property {number} maxActualDuration
 * @property {ProfilerRender} [lastRender]
 */

/** @type {Map<string, ProfilerSummary>} */
const profilerMetrics = new Map();

/** @param {number} value */
function round(value) {
  return Number(value.toFixed(2));
}

/**
 * React Profiler 的回调会在一次提交完成后执行。
 * 这里保留汇总数据，并在开发环境输出单次渲染详情，方便定位慢渲染。
 *
 * @param {string} id
 * @param {ProfilerPhase} phase
 * @param {number} actualDuration
 * @param {number} baseDuration
 * @param {number} startTime
 * @param {number} commitTime
 */
function onRender(
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime,
) {
  const duration = round(actualDuration);
  const previous = profilerMetrics.get(id) ?? {
    renderCount: 0,
    mountCount: 0,
    updateCount: 0,
    slowRenderCount: 0,
    totalActualDuration: 0,
    maxActualDuration: 0,
  };

  const current = {
    phase,
    actualDuration: duration,
    baseDuration: round(baseDuration),
    startTime: round(startTime),
    commitTime: round(commitTime),
    commitDelay: round(Math.max(0, commitTime - startTime)),
  };

  const summary = {
    renderCount: previous.renderCount + 1,
    mountCount: previous.mountCount + (phase === "mount" ? 1 : 0),
    updateCount: previous.updateCount + (phase === "mount" ? 0 : 1),
    slowRenderCount:
      previous.slowRenderCount + (actualDuration > FRAME_BUDGET_MS ? 1 : 0),
    totalActualDuration: round(previous.totalActualDuration + actualDuration),
    maxActualDuration: Math.max(previous.maxActualDuration, duration),
    lastRender: current,
  };

  profilerMetrics.set(id, summary);

  if (import.meta.env.DEV) {
    const log = actualDuration > FRAME_BUDGET_MS ? console.warn : console.info;
    log(`[React Profiler] ${id} ${phase}`, {
      ...current,
      frameBudget: FRAME_BUDGET_MS,
      summary,
    });
  }
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Profiler id="AppProfiler" onRender={onRender}>
      <App />
    </Profiler>
  </StrictMode>,
);
