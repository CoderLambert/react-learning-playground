import { useEffect, useMemo, useRef, useState } from "react";
import { MDXProvider } from "@mdx-js/react";
import { dispatchLearningAction } from "../../learning-actions/learningActions.js";
import { getNoteLoader } from "../../workbench/noteRegistry";
import { LearningActionBar } from "../learning-actions/LearningActionBar.jsx";
import { collectNoteToc } from "./noteToc";

function RuntimeLink({ href = "", children, ...props }) {
  const isExternal = /^https?:\/\//.test(href);
  return (
    <a href={href} {...props} {...(isExternal ? { target: "_blank", rel: "noreferrer" } : {})}>
      {children}
    </a>
  );
}

const RUNTIME_COMPONENTS = Object.freeze({ a: RuntimeLink });

function getSelectionWithin(root) {
  if (!root || typeof window === "undefined") return "";
  const selection = window.getSelection?.();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return "";
  const range = selection.getRangeAt(0);
  const container = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
    ? range.commonAncestorContainer
    : range.commonAncestorContainer.parentElement;
  if (!container || !root.contains(container)) return "";
  return selection.toString().replace(/\s+/g, " ").trim().slice(0, 1600);
}

export function NoteViewer({
  learningUnitId,
  learningUnitTitle,
  components,
  onTocChange,
  missingFallback,
  loadingFallback,
  errorFallback,
  className = "",
}) {
  const contentRef = useRef(null);
  const [selectedText, setSelectedText] = useState("");
  const [loaded, setLoaded] = useState({ learningUnitId: null, Component: null, error: null });

  const resolution = useMemo(() => {
    if (!learningUnitId) return { loader: null, error: null };
    try {
      return { loader: getNoteLoader(learningUnitId), error: null };
    } catch (error) {
      return { loader: null, error };
    }
  }, [learningUnitId]);

  const mergedComponents = useMemo(
    () => ({ ...RUNTIME_COMPONENTS, ...(components || {}) }),
    [components],
  );

  useEffect(() => {
    if (!resolution.loader || !learningUnitId) return;
    let cancelled = false;

    resolution.loader()
      .then((module) => {
        if (cancelled) return;
        if (typeof module?.default !== "function") {
          throw new TypeError(`Note ${learningUnitId} does not export a default MDX component`);
        }
        setLoaded({ learningUnitId, Component: module.default, error: null });
      })
      .catch((error) => {
        if (!cancelled) setLoaded({ learningUnitId, Component: null, error });
      });

    return () => {
      cancelled = true;
    };
  }, [learningUnitId, resolution]);

  const isReady = loaded.learningUnitId === learningUnitId && Boolean(loaded.Component);

  useEffect(() => {
    if (!isReady) {
      onTocChange?.([]);
      return;
    }

    const frame = requestAnimationFrame(() => {
      onTocChange?.(collectNoteToc(contentRef.current));
    });
    return () => cancelAnimationFrame(frame);
  }, [isReady, loaded.Component, onTocChange]);

  useEffect(() => {
    if (!isReady || typeof document === "undefined") return undefined;
    const handleSelection = () => setSelectedText(getSelectionWithin(contentRef.current));
    document.addEventListener("selectionchange", handleSelection);
    return () => document.removeEventListener("selectionchange", handleSelection);
  }, [isReady]);

  useEffect(() => setSelectedText(""), [learningUnitId]);

  if (resolution.error) {
    return errorFallback ?? (
      <div className="note-runtime-state note-runtime-state-error" role="alert">
        笔记加载失败：{resolution.error.message || "未知错误"}
      </div>
    );
  }

  if (!resolution.loader) {
    return missingFallback ?? <div className="note-runtime-state" role="status">该知识点的详细笔记尚未创建。</div>;
  }

  if (loaded.learningUnitId === learningUnitId && loaded.error) {
    return errorFallback ?? (
      <div className="note-runtime-state note-runtime-state-error" role="alert">
        笔记加载失败：{loaded.error.message || "未知错误"}
      </div>
    );
  }

  if (!isReady) {
    return loadingFallback ?? (
      <div className="note-runtime-state" role="status" aria-live="polite">正在加载笔记…</div>
    );
  }

  const trigger = (action) => dispatchLearningAction({
    kind: "note",
    action,
    learningUnitId,
    learningUnitTitle,
    text: selectedText,
  });

  const NoteComponent = loaded.Component;
  return (
    <MDXProvider components={mergedComponents}>
      <div className="note-runtime-learning-actions" data-selection-active={selectedText ? "true" : "false"}>
        <LearningActionBar
          label={selectedText ? "针对选中的笔记内容" : "针对当前笔记"}
          compact
          actions={[
            { id: "explain", label: selectedText ? "解释选中内容" : "解释这篇笔记", onSelect: () => trigger("explain") },
            { id: "example", label: "举例 / 反例", onSelect: () => trigger("example") },
            { id: "quiz", label: "测测我", onSelect: () => trigger("quiz") },
          ]}
        />
        {selectedText ? <span className="sr-only" role="status">已选择笔记内容，可发送给 AI 学习助手。</span> : null}
      </div>
      <article ref={contentRef} className={`note-runtime-content ${className}`.trim()}>
        <NoteComponent components={mergedComponents} />
      </article>
    </MDXProvider>
  );
}
