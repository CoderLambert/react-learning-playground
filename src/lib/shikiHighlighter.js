import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import jsxLang from "shiki/langs/jsx.mjs";
import jsLang from "shiki/langs/javascript.mjs";
import cssLang from "shiki/langs/css.mjs";
import githubDarkTheme from "shiki/themes/github-dark.mjs";

const THEME = "github-dark";
const BASE_LANGUAGES = new Set(["jsx", "javascript", "css"]);
const SUPPORTED_LANGUAGES = new Set(["jsx", "javascript", "typescript", "tsx", "css", "json", "bash"]);
const LANGUAGE_ALIASES = Object.freeze({ js: "javascript", ts: "typescript", sh: "bash", shell: "bash" });
const LANGUAGE_LOADERS = Object.freeze({
  typescript: () => import("shiki/langs/typescript.mjs"),
  tsx: () => import("shiki/langs/tsx.mjs"),
  json: () => import("shiki/langs/json.mjs"),
  bash: () => import("shiki/langs/bash.mjs"),
});

let highlighterPromise = null;
const loadedLanguages = new Set(BASE_LANGUAGES);
const languagePromises = new Map();

export function getSharedHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [githubDarkTheme],
      langs: [jsxLang, jsLang, cssLang],
      engine: createJavaScriptRegexEngine(),
    });
  }
  return highlighterPromise;
}

export function normalizeLanguage(language = "jsx") {
  const normalized = LANGUAGE_ALIASES[language] ?? language;
  return SUPPORTED_LANGUAGES.has(normalized) ? normalized : "jsx";
}

export function inferLanguage(fileName = "", fallback = "jsx") {
  const extension = fileName.split(".").pop()?.toLowerCase();
  const byExtension = {
    js: "javascript",
    jsx: "jsx",
    ts: "typescript",
    tsx: "tsx",
    css: "css",
    json: "json",
    sh: "bash",
    bash: "bash",
  };
  return normalizeLanguage(byExtension[extension] ?? fallback);
}

async function ensureLanguage(highlighter, language) {
  if (loadedLanguages.has(language)) return;
  if (!languagePromises.has(language)) {
    const loader = LANGUAGE_LOADERS[language];
    if (!loader) return;
    languagePromises.set(
      language,
      loader().then(({ default: grammar }) => highlighter.loadLanguage(grammar)).then(() => {
        loadedLanguages.add(language);
      }),
    );
  }
  await languagePromises.get(language);
}

export async function highlightCode(code, { language = "jsx", fileName } = {}) {
  const resolvedLanguage = fileName ? inferLanguage(fileName, language) : normalizeLanguage(language);
  const highlighter = await getSharedHighlighter();
  await ensureLanguage(highlighter, resolvedLanguage);
  return highlighter.codeToHtml(code ?? "", { lang: resolvedLanguage, theme: THEME });
}

export const SHIKI_THEME = THEME;
