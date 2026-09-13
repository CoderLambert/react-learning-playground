import { useEffect, useRef, useState } from "react";
import {
  DEEPSEEK_MODELS,
  DEEPSEEK_OPENAI_BASE_URL,
} from "../../ai/deepseekBrowserSettings.js";
import {
  classifyDeepSeekConnectionError,
  redactSecret,
  testDeepSeekBrowserConnection,
} from "../../ai/deepseekConnectionDiagnostics.js";
import "./DeepSeekSettings.css";

export function DeepSeekSettings({
  settings,
  connectionMode = "unconfigured",
  onSave,
  onClear,
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState(settings?.apiKey ?? "");
  const [model, setModel] = useState(settings?.model ?? DEEPSEEK_MODELS[0].id);
  const [rememberApiKey, setRememberApiKey] = useState(Boolean(settings?.rememberApiKey));
  const [showApiKey, setShowApiKey] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [testing, setTesting] = useState(false);
  const apiKeyRef = useRef(null);

  useEffect(() => {
    setApiKey(settings?.apiKey ?? "");
    setModel(settings?.model ?? DEEPSEEK_MODELS[0].id);
    setRememberApiKey(Boolean(settings?.rememberApiKey));
  }, [settings?.apiKey, settings?.model, settings?.rememberApiKey]);

  useEffect(() => {
    if (!open) return undefined;
    const frame = requestAnimationFrame(() => apiKeyRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  const hasBrowserKey = Boolean(settings?.apiKey);
  const statusLabel = hasBrowserKey
    ? "浏览器直连"
    : connectionMode === "gateway"
      ? "站点网关"
      : "待配置";

  const handleSubmit = (event) => {
    event.preventDefault();
    const normalizedKey = apiKey.trim();
    if (!normalizedKey) return;
    onSave?.({ apiKey: normalizedKey, model, rememberApiKey });
    setOpen(false);
    setFeedback({ type: "success", text: "配置已保存，可继续刚才的学习问题。" });
  };

  const handleClear = () => {
    setApiKey("");
    setRememberApiKey(false);
    setShowApiKey(false);
    setFeedback({ type: "success", text: "API Key 已从当前浏览器清除。" });
    onClear?.();
    requestAnimationFrame(() => apiKeyRef.current?.focus());
  };

  const handleTest = async () => {
    if (!apiKey.trim() || testing) return;
    setTesting(true);
    setFeedback({ type: "progress", text: "正在测试 DeepSeek 连接…" });
    try {
      const result = await testDeepSeekBrowserConnection({ apiKey, model });
      setFeedback({
        type: "success",
        text: `连接成功 · ${result.model}`,
      });
    } catch (error) {
      const diagnostic = classifyDeepSeekConnectionError(error, { connectionMode: "browser" });
      setFeedback({
        type: "error",
        text: `${diagnostic.title}：${diagnostic.guidance}`,
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="deepseek-settings">
      <button
        type="button"
        className="deepseek-settings-toggle"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="deepseek-settings-panel"
        disabled={disabled}
      >
        <span>{hasBrowserKey ? "DeepSeek 已配置" : "配置 DeepSeek"}</span>
        <em>{statusLabel}</em>
      </button>

      {open ? (
        <form
          id="deepseek-settings-panel"
          className="deepseek-settings-panel"
          onSubmit={handleSubmit}
          aria-busy={testing}
        >
          <div className="deepseek-settings-heading">
            <strong>{hasBrowserKey ? "DeepSeek 连接设置" : "连接 DeepSeek"}</strong>
            <p>
              {connectionMode === "gateway" && !hasBrowserKey
                ? "当前可使用站点网关；也可以配置自己的 Key 以启用浏览器直连。"
                : "使用自己的 API Key 时，请求从当前浏览器直接发送到 DeepSeek。"}
            </p>
          </div>

          <div className="deepseek-settings-field">
            <label htmlFor="deepseek-api-key">API Key</label>
            <div className="deepseek-settings-secret-row">
              <input
                id="deepseek-api-key"
                ref={apiKeyRef}
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(event) => {
                  setApiKey(event.target.value);
                  setFeedback(null);
                }}
                placeholder="sk-..."
                autoComplete="off"
                spellCheck="false"
                aria-describedby="deepseek-key-status"
              />
              <button
                type="button"
                className="ai-assistant-secondary-button"
                onClick={() => setShowApiKey((value) => !value)}
                aria-pressed={showApiKey}
              >
                {showApiKey ? "隐藏" : "显示"}
              </button>
            </div>
          </div>

          <p id="deepseek-key-status" className="deepseek-settings-key-status">
            {apiKey.trim() ? `当前输入：${redactSecret(apiKey)}` : "尚未输入 API Key"}
          </p>

          <label className="deepseek-settings-field">
            <span>模型</span>
            <select
              aria-label="DeepSeek 模型"
              value={model}
              onChange={(event) => {
                setModel(event.target.value);
                setFeedback(null);
              }}
            >
              {DEEPSEEK_MODELS.map((item) => (
                <option key={item.id} value={item.id}>{item.label} · {item.id}</option>
              ))}
            </select>
          </label>

          <details className="deepseek-settings-diagnostics">
            <summary>连接详情</summary>
            <div className="deepseek-settings-field">
              <span>OpenAI-compatible Base URL</span>
              <code>{DEEPSEEK_OPENAI_BASE_URL}</code>
            </div>
            <div className="deepseek-settings-field">
              <span>当前连接</span>
              <code>{statusLabel}</code>
            </div>
          </details>

          <label className="deepseek-settings-remember">
            <input
              type="checkbox"
              checked={rememberApiKey}
              onChange={(event) => setRememberApiKey(event.target.checked)}
            />
            <span>在此浏览器长期保存 API Key</span>
          </label>

          <p className="deepseek-settings-warning">
            默认只保存到当前标签页会话。长期保存会写入 localStorage；建议使用专用、低额度 Key。
          </p>

          {feedback ? (
            <p
              className={`deepseek-settings-feedback is-${feedback.type}`}
              role={feedback.type === "error" ? "alert" : "status"}
              aria-live="polite"
            >
              {feedback.text}
            </p>
          ) : null}

          <div className="deepseek-settings-actions">
            {hasBrowserKey ? (
              <button type="button" className="ai-assistant-secondary-button" onClick={handleClear} disabled={testing}>
                清除 Key
              </button>
            ) : null}
            <button
              type="button"
              className="ai-assistant-secondary-button"
              onClick={handleTest}
              disabled={!apiKey.trim() || testing}
            >
              {testing ? "测试中…" : "测试连接"}
            </button>
            <button type="submit" className="ai-assistant-send-button" disabled={!apiKey.trim() || testing}>
              保存配置
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}

export default DeepSeekSettings;
