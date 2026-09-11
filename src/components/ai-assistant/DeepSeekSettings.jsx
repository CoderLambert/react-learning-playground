import { useEffect, useState } from "react";
import {
  DEEPSEEK_MODELS,
  DEEPSEEK_OPENAI_BASE_URL,
} from "../../ai/deepseekBrowserSettings.js";

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

  useEffect(() => {
    setApiKey(settings?.apiKey ?? "");
    setModel(settings?.model ?? DEEPSEEK_MODELS[0].id);
    setRememberApiKey(Boolean(settings?.rememberApiKey));
  }, [settings?.apiKey, settings?.model, settings?.rememberApiKey]);

  const hasBrowserKey = Boolean(settings?.apiKey);
  const statusLabel = hasBrowserKey
    ? "浏览器直连"
    : connectionMode === "gateway"
      ? "站点网关"
      : "待配置";

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave?.({ apiKey, model, rememberApiKey });
    setOpen(false);
  };

  const handleClear = () => {
    setApiKey("");
    setRememberApiKey(false);
    onClear?.();
  };

  return (
    <div className="deepseek-settings">
      <button
        type="button"
        className="deepseek-settings-toggle"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        disabled={disabled}
      >
        <span>{hasBrowserKey ? "DeepSeek 已配置" : "配置 DeepSeek"}</span>
        <em>{statusLabel}</em>
      </button>

      {open ? (
        <form className="deepseek-settings-panel" onSubmit={handleSubmit}>
          <div className="deepseek-settings-heading">
            <strong>使用你自己的 DeepSeek API Key</strong>
            <p>请求从当前浏览器直接发送到 DeepSeek，不经过本站服务器。</p>
          </div>

          <label className="deepseek-settings-field">
            <span>API Key</span>
            <input
              type="password"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
              placeholder="sk-..."
              autoComplete="off"
              spellCheck="false"
            />
          </label>

          <label className="deepseek-settings-field">
            <span>模型</span>
            <select value={model} onChange={(event) => setModel(event.target.value)}>
              {DEEPSEEK_MODELS.map((item) => (
                <option key={item.id} value={item.id}>{item.label} · {item.id}</option>
              ))}
            </select>
          </label>

          <div className="deepseek-settings-field">
            <span>OpenAI-compatible Base URL</span>
            <code>{DEEPSEEK_OPENAI_BASE_URL}</code>
          </div>

          <label className="deepseek-settings-remember">
            <input
              type="checkbox"
              checked={rememberApiKey}
              onChange={(event) => setRememberApiKey(event.target.checked)}
            />
            <span>在此浏览器长期保存 API Key</span>
          </label>

          <p className="deepseek-settings-warning">
            默认只保存到当前标签页会话。勾选长期保存后会写入 localStorage；任何能在本页面执行的脚本理论上都可读取它，建议使用专用、低额度 Key。
          </p>

          <div className="deepseek-settings-actions">
            {hasBrowserKey ? (
              <button type="button" className="ai-assistant-secondary-button" onClick={handleClear}>
                清除 Key
              </button>
            ) : null}
            <button type="submit" className="ai-assistant-send-button" disabled={!apiKey.trim()}>
              保存配置
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}

export default DeepSeekSettings;
