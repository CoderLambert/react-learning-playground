import { useEffect, useMemo, useRef, useState } from "react";
import { MDXProvider } from "@mdx-js/react";
import { getNoteLoader } from "../../workbench/noteRegistry";
import { collectNoteToc } from "./noteToc";

function RuntimeLink({ href = "", children, ...props }) {
  const isExternal = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      {...props}
      {...(isExternal ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

const RUNTIME_COMPONENTS = Object.freeze({
  a: RuntimeLink,
});

export function NoteViewer({
  learningUnitId,
  components,
  onTocChange,
  missingFallback,
  loadingFallback,
  errorFallback,
  className = "",
}) {
  const contentRef = useRef(null);
  const [state, setState] = useState({ status: "idle", Component: null, error: null });

  const mergedComponents = useMemo(
    () => ({ ...RUNTIME_COMPONENTS, ...(components || {}) }),
    [components],
  );

  useEffect(() => {
    let cancelled = false;

    if (!learningUnitId) {
      setState({ status: "missing", Component: null, error: null });
      return () => {
        cancelled = true;
      };
    }

    let loader;
    try {
      loader = getNoteLoader(learningUnitId);
    } catch (error) {
      setState({ status: "error", Component: null, error });
      return () => {
        cancelled = true;
      };
    }

    if (!loader) {
      setState({ status: "missing", Component: null, error: null });
      return () => {
        cancelled = true;
      };
    }

    setState({ status: "loading", Component: null, error: null });

    loader()
      .then((module) => {
        if (cancelled) return;
        if (typeof module?.default !== "function") {
          throw new TypeError(`Note ${learningUnitId} does not export a default MDX component`);
        }
        setState({ status: "ready", Component: module.default, error: null });
      })
      .catch((error) => {
        if (!cancelled) setState({ status: "error", Component: null, error });
      });

    return () => {
      cancelled = true;
    };
  }, [learningUnitId]);

  useEffect(() => {
    if (state.status !== "ready") {
      onTocChange?.([]);
      return;
    }

    const frame = requestAnimationFrame(() => {
      onTocChange?.(collectNoteToc(contentRef.current));
    });

    return () => cancelAnimationFrame(frame);
  }, [state.status, state.Component, onTocChange]);

  if (state.status === "missing") {
    return missingFallback ?? (
      <div className="note-runtime-state" role="status">
        该知识点的详细笔记尚未创建。
      </div>
    );
  }

  if (state.status === "loading" || state.status === "idle") {
    return loadingFallback ?? (
      <div className="note-runtime-state" role="status" aria-live="polite">
        正在加载笔记…
      </div>
    );
  }

  if (state.status === "error") {
    return errorFallback ?? (
      <div className="note-runtime-state note-runtime-state-error" role="alert">
        笔记加载失败：{state.error?.message || "未知错误"}
      </div>
    );
  }

  const NoteComponent = state.Component;

  return (
    <MDXProvider components={mergedComponents}>
      <article ref={contentRef} className={`note-runtime-content ${className}`.trim()}>
        <NoteComponent components={mergedComponents} />
      </article>
    </MDXProvider>
  );
}
