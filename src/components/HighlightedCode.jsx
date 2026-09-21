import { useEffect, useMemo, useState } from "react";
import { highlightCode } from "../lib/shikiHighlighter.js";
import "./HighlightedCode.css";

export function HighlightedCode({
  code = "",
  language = "jsx",
  fileName,
  className = "",
}) {
  const source = useMemo(() => String(code ?? ""), [code]);
  const requestKey = `${fileName ?? ""}\u0000${language}\u0000${source}`;
  const [result, setResult] = useState({ key: "", html: "", error: false });

  useEffect(() => {
    let active = true;

    highlightCode(source, { language, fileName })
      .then((html) => {
        if (active) setResult({ key: requestKey, html, error: false });
      })
      .catch(() => {
        if (active) setResult({ key: requestKey, html: "", error: true });
      });

    return () => {
      active = false;
    };
  }, [fileName, language, requestKey, source]);

  const highlightedHtml = result.key === requestKey && !result.error
    ? result.html
    : "";

  return (
    <div
      className={`highlighted-code ${className}`.trim()}
      data-code-highlighted={highlightedHtml ? "true" : "false"}
    >
      {highlightedHtml ? (
        <div
          className="highlighted-code__shiki"
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      ) : (
        <pre><code>{source}</code></pre>
      )}
    </div>
  );
}

export default HighlightedCode;
