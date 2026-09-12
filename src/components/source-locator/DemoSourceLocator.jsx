import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { dispatchLearningAction } from "../../learning-actions/learningActions.js";
import { LearningActionBar } from "../learning-actions/LearningActionBar.jsx";
import "./DemoSourceLocator.css";

const SOURCE_ATTRIBUTE = "data-source-loc";
const ALT_MODE_ATTRIBUTE = "data-source-locator-alt";
const INTERACTIVE_TAGS = new Set(["A", "BUTTON", "INPUT", "SELECT", "TEXTAREA", "SUMMARY", "OPTION"]);

let sourceLocatorMountCount = 0;
let releaseGlobalAltListeners = null;

function normalizePath(value) {
  return String(value ?? "").replace(/\\/g, "/").replace(/^\.\//, "");
}

function basename(value) {
  const normalized = normalizePath(value);
  return normalized.slice(normalized.lastIndexOf("/") + 1);
}

function setGlobalAltMode(active) {
  if (typeof document === "undefined") return;
  if (active) document.documentElement.setAttribute(ALT_MODE_ATTRIBUTE, "true");
  else document.documentElement.removeAttribute(ALT_MODE_ATTRIBUTE);
}

function acquireGlobalAltModeListeners() {
  if (typeof window === "undefined" || typeof document === "undefined") return () => {};
  sourceLocatorMountCount += 1;

  if (!releaseGlobalAltListeners) {
    const handleKeyDown = (event) => {
      if (event.key === "Alt") setGlobalAltMode(true);
    };
    const handleKeyUp = (event) => {
      if (event.key === "Alt") setGlobalAltMode(false);
    };
    const clearAltMode = () => setGlobalAltMode(false);
    const handleVisibilityChange = () => {
      if (document.hidden) clearAltMode();
    };

    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("keyup", handleKeyUp, true);
    window.addEventListener("blur", clearAltMode);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    releaseGlobalAltListeners = () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("keyup", handleKeyUp, true);
      window.removeEventListener("blur", clearAltMode);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      setGlobalAltMode(false);
      releaseGlobalAltListeners = null;
    };
  }

  return () => {
    sourceLocatorMountCount = Math.max(0, sourceLocatorMountCount - 1);
    if (sourceLocatorMountCount === 0) releaseGlobalAltListeners?.();
  };
}

function isGlobalAltModeActive() {
  return typeof document !== "undefined" && document.documentElement.getAttribute(ALT_MODE_ATTRIBUTE) === "true";
}

function parseLocator(value) {
  const [sourcePath, startValue, endValue] = String(value ?? "").split("|");
  const startLine = Number(startValue);
  const endLine = Number(endValue);
  if (!sourcePath || !Number.isInteger(startLine) || startLine < 1) return null;
  return {
    sourcePath: normalizePath(sourcePath),
    startLine,
    endLine: Number.isInteger(endLine) && endLine >= startLine ? endLine : startLine,
  };
}

function resolveLearningSource(learningUnit, locator) {
  if (!locator) return null;
  const sources = learningUnit?.sources ?? [];
  const exact = sources.find((source) => normalizePath(source.semantics?.path) === locator.sourcePath);
  if (exact) return exact;

  const fallbackName = basename(locator.sourcePath);
  return sources.find((source) => source.name === fallbackName) ?? null;
}

function resolveCandidate(target, root, learningUnit) {
  let element = target instanceof Element ? target : target?.parentElement;
  const candidates = [];

  while (element && root.contains(element)) {
    const rawLocator = element.getAttribute?.(SOURCE_ATTRIBUTE);
    if (rawLocator) {
      const locator = parseLocator(rawLocator);
      const source = resolveLearningSource(learningUnit, locator);
      if (locator && source) candidates.push({ element, locator, source });
    }
    if (element === root) break;
    element = element.parentElement;
  }

  return candidates.find((candidate) => INTERACTIVE_TAGS.has(candidate.element.tagName)) ?? candidates[0] ?? null;
}

function getOverlay(candidate) {
  if (!candidate) return null;
  const rect = candidate.element.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return null;
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    labelTop: rect.top >= 36 ? rect.top - 30 : rect.bottom + 6,
    labelLeft: Math.max(8, rect.left),
    tagName: candidate.element.tagName.toLowerCase(),
    fileName: candidate.source.name,
    startLine: candidate.locator.startLine,
    endLine: candidate.locator.endLine,
  };
}

function Overlay({ value, modifierOnly = false }) {
  if (!value || typeof document === "undefined") return null;
  const lineLabel = value.endLine !== value.startLine
    ? `L${value.startLine}–L${value.endLine}`
    : `L${value.startLine}`;
  const modifierClass = modifierOnly ? " source-locator-overlay--modifier" : "";
  const modifierLabelClass = modifierOnly ? " source-locator-label--modifier" : "";

  return createPortal(
    <>
      <div
        className={`source-locator-overlay${modifierClass}`}
        data-testid="source-locator-overlay"
        aria-hidden="true"
        style={{
          top: value.top,
          left: value.left,
          width: value.width,
          height: value.height,
        }}
      />
      <div
        className={`source-locator-label${modifierLabelClass}`}
        aria-hidden="true"
        style={{ top: value.labelTop, left: value.labelLeft }}
      >
        <span>{value.tagName}</span>
        <strong>{value.fileName}</strong>
        <span>{lineLabel}</span>
      </div>
    </>,
    document.body,
  );
}

export function DemoSourceLocator({ learningUnit, enabled = false, onLocate, children }) {
  const [hovered, setHovered] = useState(null);
  const overlay = useMemo(() => getOverlay(hovered), [hovered]);

  useEffect(() => acquireGlobalAltModeListeners(), []);

  const updateHover = (event) => {
    const modifierActive = event.altKey || isGlobalAltModeActive();
    if (!enabled && !modifierActive) {
      if (hovered) setHovered(null);
      return;
    }

    const candidate = resolveCandidate(event.target, event.currentTarget, learningUnit);
    setHovered((current) => (
      current?.element === candidate?.element && current?.locator?.sourcePath === candidate?.locator?.sourcePath
        ? current
        : candidate
    ));
  };

  const handleClickCapture = (event) => {
    const shouldLocate = enabled || event.altKey || isGlobalAltModeActive();
    if (!shouldLocate) return;

    const candidate = resolveCandidate(event.target, event.currentTarget, learningUnit);
    if (!candidate) return;

    event.preventDefault();
    event.stopPropagation();
    setHovered(null);
    onLocate?.({
      learningUnitId: learningUnit?.id,
      fileName: candidate.source.name,
      sourcePath: candidate.locator.sourcePath,
      startLine: candidate.locator.startLine,
      endLine: candidate.locator.endLine,
    });
  };

  const askAboutDemo = (action) => dispatchLearningAction({
    kind: "demo",
    action,
    learningUnitId: learningUnit?.id,
    learningUnitTitle: learningUnit?.title,
  });

  return (
    <div
      className={`source-locator-scope ${enabled ? "source-locator-scope--active" : ""}`.trim()}
      data-learning-unit-id={learningUnit?.id ?? undefined}
      data-source-locator-active={enabled ? "true" : "false"}
      onPointerOverCapture={updateHover}
      onPointerMoveCapture={updateHover}
      onPointerLeave={() => setHovered(null)}
      onClickCapture={handleClickCapture}
    >
      <LearningActionBar
        compact
        label="当前 Demo"
        actions={[
          { id: "explain", label: "解释 Demo", onSelect: () => askAboutDemo("explain") },
          { id: "walkthrough", label: "带我读实现", onSelect: () => askAboutDemo("walkthrough") },
          { id: "purpose", label: "它验证什么", onSelect: () => askAboutDemo("purpose") },
          { id: "quiz", label: "测测我", onSelect: () => askAboutDemo("quiz") },
        ]}
      />
      {children}
      {hovered && <Overlay value={overlay} modifierOnly={!enabled} />}
    </div>
  );
}

export default DemoSourceLocator;
