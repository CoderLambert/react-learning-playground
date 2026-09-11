import { useMemo, useState } from "react";
import { CodeBlockNode } from "markstream-react";
import { buildAiCodeBlockModel, performCodeBlockCopy } from "./aiCodeBlockModel.js";
import "./AiCodeBlock.css";

async function copyToClipboard(text) {
  if (globalThis.navigator?.clipboard?.writeText) {
    await globalThis.navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

export function AiCodeBlock({
  node,
  stream,
  theme,
  darkTheme,
  lightTheme,
  themes,
  minWidth,
  maxWidth,
  codeBlockOptions,
  onCopy,
  ...forwardedProps
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [copyState, setCopyState] = useState("idle");
  const model = useMemo(() => buildAiCodeBlockModel(node), [node]);
  const title = model.label || model.language;
  const lineLabel = `${model.lineCount} ${model.lineCount === 1 ? "line" : "lines"}`;

  const handleCopy = async () => {
    if (!model.code) return;

    try {
      await performCodeBlockCopy({
        code: model.code,
        writeText: copyToClipboard,
        onCopy,
      });
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }

    window.setTimeout(() => setCopyState("idle"), 1200);
  };

  return (
    <section
      className={`ai-code-block ${collapsed ? "is-collapsed" : "is-expanded"}`}
      data-ai-code-block="true"
      data-collapsed={collapsed ? "true" : "false"}
    >
      <header className="ai-code-block-header">
        <div className="ai-code-block-meta" title={model.label || undefined}>
          <strong>{title}</strong>
          <span>{lineLabel}</span>
        </div>
        <div className="ai-code-block-actions">
          <button
            type="button"
            className="ai-code-block-action"
            onClick={handleCopy}
            disabled={!model.code}
            aria-label={copyState === "copied" ? "代码已复制" : "复制代码"}
          >
            {copyState === "copied" ? "已复制" : copyState === "failed" ? "复制失败" : "复制"}
          </button>
          <button
            type="button"
            className="ai-code-block-action"
            onClick={() => setCollapsed((value) => !value)}
            aria-expanded={!collapsed}
            aria-label={collapsed ? "展开代码" : "收起代码"}
          >
            {collapsed ? "展开" : "收起"}
          </button>
        </div>
      </header>

      {collapsed ? (
        <div className="ai-code-block-collapsed" data-ai-code-block-summary="true">
          <code>{model.preview || "空代码块"}</code>
        </div>
      ) : (
        <div className="ai-code-block-body" data-ai-code-block-body="true">
          <CodeBlockNode
            {...forwardedProps}
            node={node}
            stream={stream}
            theme={theme}
            darkTheme={darkTheme}
            lightTheme={lightTheme}
            themes={themes}
            minWidth={minWidth}
            maxWidth={maxWidth}
            codeBlockOptions={codeBlockOptions}
            showHeader={false}
            showCollapseButton={false}
            showFontSizeButtons={false}
            showTooltips={false}
          />
        </div>
      )}
    </section>
  );
}

export default AiCodeBlock;
