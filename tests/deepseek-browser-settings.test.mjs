import assert from "node:assert/strict";
import test from "node:test";

import {
  clearDeepSeekBrowserApiKey,
  loadDeepSeekBrowserSettings,
  saveDeepSeekBrowserSettings,
} from "../src/ai/deepseekBrowserSettings.js";

function createStorage(seed = {}) {
  const values = new Map(Object.entries(seed));
  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
    removeItem(key) {
      values.delete(key);
    },
    snapshot() {
      return Object.fromEntries(values);
    },
  };
}

test("session-scoped API key survives reload without entering localStorage", () => {
  const localStorage = createStorage();
  const sessionStorage = createStorage();

  saveDeepSeekBrowserSettings({
    apiKey: "  sk-session-secret  ",
    model: "deepseek-v4-pro",
    rememberApiKey: false,
  }, { localStorage, sessionStorage });

  assert.equal(localStorage.snapshot()["react-learning.ai.deepseek.api-key"], undefined);
  assert.equal(sessionStorage.snapshot()["react-learning.ai.deepseek.api-key"], "sk-session-secret");
  assert.deepEqual(loadDeepSeekBrowserSettings({ localStorage, sessionStorage }), {
    apiKey: "sk-session-secret",
    model: "deepseek-v4-pro",
    rememberApiKey: false,
  });
});

test("remembered API key moves to localStorage and removes the session copy", () => {
  const localStorage = createStorage();
  const sessionStorage = createStorage({
    "react-learning.ai.deepseek.api-key": "stale-session-key",
  });

  saveDeepSeekBrowserSettings({
    apiKey: "sk-persisted-secret",
    model: "deepseek-v4-flash",
    rememberApiKey: true,
  }, { localStorage, sessionStorage });

  assert.equal(localStorage.snapshot()["react-learning.ai.deepseek.api-key"], "sk-persisted-secret");
  assert.equal(localStorage.snapshot()["react-learning.ai.deepseek.remember-api-key"], "1");
  assert.equal(sessionStorage.snapshot()["react-learning.ai.deepseek.api-key"], undefined);
});

test("clearing removes API key material from both browser storage scopes", () => {
  const localStorage = createStorage({
    "react-learning.ai.deepseek.api-key": "sk-local-secret",
    "react-learning.ai.deepseek.remember-api-key": "1",
    "react-learning.ai.deepseek.model": "deepseek-v4-pro",
  });
  const sessionStorage = createStorage({
    "react-learning.ai.deepseek.api-key": "sk-session-secret",
  });

  clearDeepSeekBrowserApiKey({ localStorage, sessionStorage });

  assert.equal(localStorage.snapshot()["react-learning.ai.deepseek.api-key"], undefined);
  assert.equal(localStorage.snapshot()["react-learning.ai.deepseek.remember-api-key"], undefined);
  assert.equal(sessionStorage.snapshot()["react-learning.ai.deepseek.api-key"], undefined);
  assert.equal(localStorage.snapshot()["react-learning.ai.deepseek.model"], "deepseek-v4-pro");
});

test("storage failures degrade safely instead of throwing or echoing secrets", () => {
  const blocked = {
    getItem() { throw new Error("blocked"); },
    setItem() { throw new Error("blocked"); },
    removeItem() { throw new Error("blocked"); },
  };

  assert.doesNotThrow(() => saveDeepSeekBrowserSettings({
    apiKey: "sk-never-echo-this",
    model: "deepseek-v4-pro",
    rememberApiKey: true,
  }, { localStorage: blocked, sessionStorage: blocked }));

  assert.deepEqual(loadDeepSeekBrowserSettings({ localStorage: blocked, sessionStorage: blocked }), {
    apiKey: "",
    model: "deepseek-v4-flash",
    rememberApiKey: false,
  });
});
