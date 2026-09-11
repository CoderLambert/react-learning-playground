import { createElement, useId } from "react";
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

function isRangeOnlyLabel(label, lineLabel) {
  const normalized = String(label ?? "").trim().replace(/–/g, "-");
  const normalizedRange = String(lineLabel ?? "").replace(/–/g, "-");
  return normalized && normalized.toLowerCase() === normalizedRange.toLowerCase();
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
  const citation = normalizeSourceCitation({ fileName, startLine, endLine, label });
  if (!citation) return null;

  const previewText = normalizePreview(preview);
  const lineLabel = formatSourceCitationLines(citation.startLine, citation.endLine);
  const interactive = typeof onOpen === "function" && !disabled;
  const visibleLabel = label && !isRangeOnlyLabel(label, lineLabel)
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
    { className: `ai-source-citation-wrap ${className}`.trim() },
    control,
    previewText
      ? createElement(
          "span",
          {
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
