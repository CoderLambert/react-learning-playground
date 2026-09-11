import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import jsxLang from "shiki/langs/jsx.mjs";
import jsLang from "shiki/langs/javascript.mjs";
import tsLang from "shiki/langs/typescript.mjs";
import tsxLang from "shiki/langs/tsx.mjs";
import cssLang from "shiki/langs/css.mjs";
import jsonLang from "shiki/langs/json.mjs";
import bashLang from "shiki/langs/bash.mjs";
import githubDarkTheme from "shiki/themes/github-dark.mjs";

const THEME = "github-dark";
const SUPPORTED_LANGUAGES = new Set(["jsx", "javascript", "typescript", "tsx", "css", "json", "bash"]);
const LANGUAGE_ALIASES = Object.freeze({ js: "javascript", ts: "typescript", sh: "bash", shell: "bash" });

let highlighterPromise = null;

export function getSharedHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [githubDarkTheme],
      langs: [jsxLang, jsLang, tsLang, tsxLang, cssLang, jsonLang, bashLang],
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

export async function highlightCode(code, { language = "jsx", fileName } = {}) {
  const highlighter = await getSharedHighlighter();
  return highlighter.codeToHtml(code ?? "", {
    lang: fileName ? inferLanguage(fileName, language) : normalizeLanguage(language),
    theme: THEME,
  });
}

export const SHIKI_THEME = THEME;
