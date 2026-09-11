import { useEffect, useMemo, useRef, useState } from "react";
import { MDXProvider } from "@mdx-js/react";
import { getNoteLoader } from "../../workbench/noteRegistry";
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
  }, [learningUnitId, resolution.loader]);

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

  const NoteComponent = loaded.Component;
  return (
    <MDXProvider components={mergedComponents}>
      <article ref={contentRef} className={`note-runtime-content ${className}`.trim()}>
        <NoteComponent components={mergedComponents} />
      </article>
    </MDXProvider>
  );
}
