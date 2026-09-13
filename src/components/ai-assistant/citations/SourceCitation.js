import { createElement, useCallback, useId, useRef, useState } from "react";
import {
  formatSourceCitationLines,
  normalizeSourceCitation,
} from "../../../ai/citations/sourceCitation.js";

function FileIcon() {
  return createElement(
    "svg",
    {
      viewBox: "0 0 16 16",
      width: 14,
      height: 14,
      "aria-hidden": "true",
      focusable: "false",
    },
    createElement("path", {
      d: "M4 1.75h5.1L12.25 4.9v9.35H4z",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.2",
      strokeLinejoin: "round",
    }),
    createElement("path", {
      d: "M9 1.9V5h3.05",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.2",
      strokeLinejoin: "round",
    }),
  );
}

function normalizePreview(preview) {
  if (preview == null || preview === "") return "";
  if (typeof preview === "string") return preview;
  if (Array.isArray(preview)) return preview.filter(Boolean).join("\n");
  if (typeof preview === "object" && Array.isArray(preview.lines)) {
    return preview.lines.filter(Boolean).join("\n");
  }
  if (typeof preview === "object" && typeof preview.text === "string") {
    return preview.text;
  }
  return String(preview);
}

function normalizeCitationLabel(value) {
  return String(value ?? "").trim().replace(/–/g, "-").toLowerCase();
}

function isRedundantLabel(label, fileName, lineLabel) {
  const normalized = normalizeCitationLabel(label);
  if (!normalized) return true;
  const normalizedRange = normalizeCitationLabel(lineLabel);
  const normalizedCanonical = normalizeCitationLabel(`${fileName}:${lineLabel}`);
  return normalized === normalizedRange || normalized === normalizedCanonical;
}

function horizontalOverflow(left, width, viewportWidth, edge) {
  const right = left + width;
  return Math.max(0, edge - left) + Math.max(0, right - (viewportWidth - edge));
}

function clampPreviewLeft(left, width, viewportWidth, edge) {
  const minimum = edge;
  const maximum = Math.max(minimum, viewportWidth - edge - width);
  return Math.min(Math.max(left, minimum), maximum);
}

export function resolveCitationPreviewPlacement({
  wrapperLeft,
  wrapperRight,
  previewWidth,
  viewportWidth,
  edge = 8,
}) {
  const safeViewportWidth = Math.max(0, Number(viewportWidth) || 0);
  const safeEdge = Math.max(0, Number(edge) || 0);
  const safeWrapperLeft = Number(wrapperLeft) || 0;
  const safeWrapperRight = Number(wrapperRight) || safeWrapperLeft;
  const safePreviewWidth = Math.max(0, Number(previewWidth) || 0);
  const width = Math.min(safePreviewWidth, Math.max(0, safeViewportWidth - safeEdge * 2));
  const startLeft = safeWrapperLeft;
  const endLeft = safeWrapperRight - width;
  const startOverflow = horizontalOverflow(startLeft, width, safeViewportWidth, safeEdge);
  const endOverflow = horizontalOverflow(endLeft, width, safeViewportWidth, safeEdge);
  const align = endOverflow < startOverflow ? "end" : "start";
  const baseLeft = align === "end" ? endLeft : startLeft;
  const left = clampPreviewLeft(baseLeft, width, safeViewportWidth, safeEdge);

  return {
    align,
    left,
    width,
    offsetX: left - baseLeft,
  };
}

export function createSourceCitationOpenPayload(citation) {
  const normalized = normalizeSourceCitation(citation);
  if (!normalized) return null;
  return {
    fileName: normalized.fileName,
    startLine: normalized.startLine,
    endLine: normalized.endLine,
  };
}

export function SourceCitation({
  fileName,
  startLine,
  endLine,
  label,
  preview,
  onOpen,
  disabled = false,
  className = "",
  variant = "default",
}) {
  const tooltipId = useId();
  const wrapperRef = useRef(null);
  const previewRef = useRef(null);
  const [previewAlign, setPreviewAlign] = useState("start");
  const [previewOffsetX, setPreviewOffsetX] = useState(0);
  const citation = normalizeSourceCitation({ fileName, startLine, endLine, label });
  const previewText = normalizePreview(preview);

  const containPreview = useCallback(() => {
    if (!previewText) return;
    globalThis.requestAnimationFrame?.(() => {
      const wrapper = wrapperRef.current;
      const element = previewRef.current;
      if (
        !wrapper
        || !element
        || typeof wrapper.getBoundingClientRect !== "function"
        || typeof element.getBoundingClientRect !== "function"
      ) return;

      const viewportWidth = globalThis.innerWidth || globalThis.document?.documentElement?.clientWidth || 0;
      if (!viewportWidth) return;

      const wrapperRect = wrapper.getBoundingClientRect();
      const previewRect = element.getBoundingClientRect();
      const placement = resolveCitationPreviewPlacement({
        wrapperLeft: wrapperRect.left,
        wrapperRight: wrapperRect.right,
        previewWidth: previewRect.width,
        viewportWidth,
      });

      setPreviewAlign((current) => current === placement.align ? current : placement.align);
      setPreviewOffsetX((current) => Math.abs(current - placement.offsetX) < 0.5 ? current : placement.offsetX);
    });
  }, [previewText]);

  if (!citation) return null;

  const lineLabel = formatSourceCitationLines(citation.startLine, citation.endLine);
  const interactive = typeof onOpen === "function" && !disabled;
  const visibleLabel = label && !isRedundantLabel(label, citation.fileName, lineLabel)
    ? String(label)
    : citation.fileName;
  const accessibleLabel = interactive
    ? `${visibleLabel}，打开源码 ${citation.fileName} ${lineLabel}`
    : `${visibleLabel}，源码片段 ${citation.fileName} ${lineLabel}`;
  const payload = createSourceCitationOpenPayload(citation);
  const controlChildren = [
    createElement("span", { key: "icon", className: "ai-source-citation-icon" }, createElement(FileIcon)),
    createElement(
      "span",
      { key: "file", className: "ai-source-citation-file", dir: "ltr" },
      visibleLabel,
    ),
    createElement("span", { key: "lines", className: "ai-source-citation-lines" }, lineLabel),
  ];
  const controlClassName = [
    "ai-source-citation",
    interactive ? "is-actionable" : "is-preview-only",
    variant === "inline" ? "is-inline" : "",
  ].filter(Boolean).join(" ");
  const sharedControlProps = {
    className: controlClassName,
    title: `${citation.fileName}:${lineLabel}`,
    "aria-label": accessibleLabel,
    "aria-describedby": previewText ? tooltipId : undefined,
  };
  const control = interactive
    ? createElement(
        "button",
        {
          ...sharedControlProps,
          type: "button",
          disabled,
          onClick: () => onOpen(payload),
        },
        controlChildren,
      )
    : createElement(
        "span",
        {
          ...sharedControlProps,
          tabIndex: previewText ? 0 : undefined,
        },
        controlChildren,
      );

  return createElement(
    "span",
    {
      ref: wrapperRef,
      className: `ai-source-citation-wrap ${className}`.trim(),
      "data-preview-align": previewAlign,
      style: { "--ai-citation-preview-offset-x": `${previewOffsetX}px` },
      onMouseEnter: containPreview,
      onFocusCapture: containPreview,
    },
    control,
    previewText
      ? createElement(
          "span",
          {
            ref: previewRef,
            id: tooltipId,
            className: "ai-source-citation-preview",
            role: "tooltip",
          },
          previewText,
        )
      : null,
  );
}

export default SourceCitation;
