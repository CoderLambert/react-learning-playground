const SOURCE_CITATION_PATTERN = /source:\/\/([^#\s)]+)#L(\d+)(?:-L?(\d+))?/g;

export function formatMessageForClipboard(content) {
  if (typeof content !== "string") return "";

  return content.replace(
    SOURCE_CITATION_PATTERN,
    (_, fileName, startLine, endLine) =>
      `${fileName}:L${startLine}${endLine ? `-L${endLine}` : ""}`,
  );
}

export async function copyTextToClipboard(text, clipboard = globalThis.navigator?.clipboard) {
  if (!text) {
    throw new Error("没有可复制的内容。");
  }

  if (!clipboard?.writeText) {
    throw new Error("当前浏览器不支持剪贴板写入。");
  }

  await clipboard.writeText(text);
}
