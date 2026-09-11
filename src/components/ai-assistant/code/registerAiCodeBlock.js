import { setCustomComponents } from "markstream-react";
import { AiMarkdownLink } from "../citations/AiSourceLink.jsx";
import { AiCodeBlock } from "./AiCodeBlock.jsx";

export const AI_MARKDOWN_CUSTOM_ID = "ai-assistant-code-blocks";

setCustomComponents(AI_MARKDOWN_CUSTOM_ID, {
  code_block: AiCodeBlock,
  link: AiMarkdownLink,
});
