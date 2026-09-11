export const DEEPSEEK_OPENAI_BASE_URL = "https://api.deepseek.com";

export const DEEPSEEK_MODELS = Object.freeze([
  Object.freeze({ id: "deepseek-v4-flash", label: "DeepSeek V4 Flash" }),
  Object.freeze({ id: "deepseek-v4-pro", label: "DeepSeek V4 Pro" }),
]);

export const DEFAULT_DEEPSEEK_MODEL = DEEPSEEK_MODELS[0].id;

export const DEEPSEEK_BROWSER_STORAGE_KEYS = Object.freeze({
  apiKey: "react-learning.ai.deepseek.api-key",
  model: "react-learning.ai.deepseek.model",
  rememberApiKey: "react-learning.ai.deepseek.remember-api-key",
});

function safeStorage(storage) {
  return storage && typeof storage.getItem === "function" ? storage : null;
}

function read(storage, key) {
  try {
    return safeStorage(storage)?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

function write(storage, key, value) {
  try {
    safeStorage(storage)?.setItem(key, value);
  } catch {
    // Browser storage can be unavailable in private/restricted contexts.
  }
}

function remove(storage, key) {
  try {
    safeStorage(storage)?.removeItem(key);
  } catch {
    // Ignore storage cleanup failures and keep the in-memory setting usable.
  }
}

export function normalizeDeepSeekModel(model) {
  const normalized = typeof model === "string" ? model.trim() : "";
  return DEEPSEEK_MODELS.some((item) => item.id === normalized)
    ? normalized
    : DEFAULT_DEEPSEEK_MODEL;
}

export function loadDeepSeekBrowserSettings({
  localStorage = globalThis.localStorage,
  sessionStorage = globalThis.sessionStorage,
} = {}) {
  const rememberApiKey = read(localStorage, DEEPSEEK_BROWSER_STORAGE_KEYS.rememberApiKey) === "1";
  const apiKey = rememberApiKey
    ? read(localStorage, DEEPSEEK_BROWSER_STORAGE_KEYS.apiKey)
    : read(sessionStorage, DEEPSEEK_BROWSER_STORAGE_KEYS.apiKey);
  const model = normalizeDeepSeekModel(read(localStorage, DEEPSEEK_BROWSER_STORAGE_KEYS.model));

  return {
    apiKey: typeof apiKey === "string" ? apiKey.trim() : "",
    model,
    rememberApiKey,
  };
}

export function saveDeepSeekBrowserSettings(settings, {
  localStorage = globalThis.localStorage,
  sessionStorage = globalThis.sessionStorage,
} = {}) {
  const apiKey = typeof settings?.apiKey === "string" ? settings.apiKey.trim() : "";
  const model = normalizeDeepSeekModel(settings?.model);
  const rememberApiKey = Boolean(settings?.rememberApiKey);

  write(localStorage, DEEPSEEK_BROWSER_STORAGE_KEYS.model, model);

  if (rememberApiKey && apiKey) {
    write(localStorage, DEEPSEEK_BROWSER_STORAGE_KEYS.apiKey, apiKey);
    write(localStorage, DEEPSEEK_BROWSER_STORAGE_KEYS.rememberApiKey, "1");
    remove(sessionStorage, DEEPSEEK_BROWSER_STORAGE_KEYS.apiKey);
  } else {
    remove(localStorage, DEEPSEEK_BROWSER_STORAGE_KEYS.apiKey);
    remove(localStorage, DEEPSEEK_BROWSER_STORAGE_KEYS.rememberApiKey);
    if (apiKey) {
      write(sessionStorage, DEEPSEEK_BROWSER_STORAGE_KEYS.apiKey, apiKey);
    } else {
      remove(sessionStorage, DEEPSEEK_BROWSER_STORAGE_KEYS.apiKey);
    }
  }

  return { apiKey, model, rememberApiKey };
}

export function clearDeepSeekBrowserApiKey({
  localStorage = globalThis.localStorage,
  sessionStorage = globalThis.sessionStorage,
} = {}) {
  remove(localStorage, DEEPSEEK_BROWSER_STORAGE_KEYS.apiKey);
  remove(localStorage, DEEPSEEK_BROWSER_STORAGE_KEYS.rememberApiKey);
  remove(sessionStorage, DEEPSEEK_BROWSER_STORAGE_KEYS.apiKey);
}
