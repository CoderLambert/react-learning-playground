import { createContext, useContext } from "react";
import { LinkNode } from "markstream-react";
import {
  buildSourceCitationPreview,
  parseSourceCitationUrl,
} from "../../../ai/citations/sourceCitation.js";
import { SourceCitation } from "./SourceCitation.js";

const AiSourcePreviewContext = createContext([]);

function collectNodeText(node) {
  if (!node || typeof node !== "object") return "";
  if (typeof node.text === "string") return node.text;
  if (typeof node.content === "string" && !Array.isArray(node.children)) return node.content;
  if (!Array.isArray(node.children)) return "";
  return node.children.map(collectNodeText).join("");
}

export function AiSourcePreviewProvider({ sources, children }) {
  return (
    <AiSourcePreviewContext.Provider value={Array.isArray(sources) ? sources : []}>
      {children}
    </AiSourcePreviewContext.Provider>
  );
}

export function AiMarkdownLink(props) {
  const sources = useContext(AiSourcePreviewContext);
  const citation = parseSourceCitationUrl(props?.node?.href);

  if (!citation) {
    return <LinkNode {...props} />;
  }

  const preview = buildSourceCitationPreview(citation, sources);
  const label = collectNodeText(props.node).trim();

  return (
    <SourceCitation
      fileName={citation.fileName}
      startLine={citation.startLine}
      endLine={citation.endLine}
      label={label || undefined}
      preview={preview}
      variant="inline"
    />
  );
}

export default AiMarkdownLink;
