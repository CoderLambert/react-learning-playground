export async function copyTextToClipboard(text, { navigatorImpl = globalThis.navigator } = {}) {
  if (!navigatorImpl?.clipboard?.writeText) {
    throw new Error("当前浏览器不支持复制到剪贴板");
  }
  await navigatorImpl.clipboard.writeText(String(text ?? ""));
}

export function downloadTextFile({
  content,
  filename,
  mimeType = "text/plain;charset=utf-8",
  documentImpl = globalThis.document,
  urlImpl = globalThis.URL,
  BlobImpl = globalThis.Blob,
} = {}) {
  if (!documentImpl?.createElement || !urlImpl?.createObjectURL || !BlobImpl) {
    throw new Error("当前环境不支持文件下载");
  }
  const blob = new BlobImpl([String(content ?? "")], { type: mimeType });
  const url = urlImpl.createObjectURL(blob);
  const anchor = documentImpl.createElement("a");
  anchor.href = url;
  anchor.download = filename || "conversation.txt";
  anchor.style.display = "none";
  documentImpl.body?.appendChild(anchor);
  try {
    anchor.click();
  } finally {
    anchor.remove?.();
    urlImpl.revokeObjectURL?.(url);
  }
}
