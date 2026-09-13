import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

const GATEWAY_PATH = "/__ai-test__";

async function installGateway(page) {
  await page.addInitScript(({ gatewayPath }) => {
    const originalFetch = window.fetch.bind(window);
    const encoder = new TextEncoder();
    const longAnswer = Array.from(
      { length: 90 },
      (_, index) => `### 段落 ${index + 1}\n\n这是用于验证 Learning Inspector 长回答滚动边界的内容。`,
    ).join("\n\n");

    window.fetch = async (input, init = {}) => {
      const url = typeof input === "string" ? input : input?.url;
      if (!url || !new URL(url, window.location.href).pathname.endsWith(gatewayPath)) {
        return originalFetch(input, init);
      }

      const body = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(`${JSON.stringify({ type: "start" })}\n`));
          controller.enqueue(encoder.encode(`${JSON.stringify({ type: "delta", text: longAnswer })}\n`));
          controller.enqueue(encoder.encode(`${JSON.stringify({ type: "done", finishReason: "stop" })}\n`));
          controller.close();
        },
      });

      return new Response(body, {
        status: 200,
        headers: { "content-type": "application/x-ndjson; charset=utf-8" },
      });
    };
  }, { gatewayPath: GATEWAY_PATH });
}

async function openAi(page) {
  await installGateway(page);
  await page.goto("?demo=props");
  await page.getByRole("tab", { name: "AI" }).click();
  const composer = page.getByRole("textbox", { name: "向 AI 助手提问" });
  await expect(composer).toBeEnabled();
  return composer;
}

test("long answer keeps inspector pane fixed and uses transcript as the vertical scroller", async ({ page }) => {
  const composer = await openAi(page);
  await composer.fill("e2e:layout");
  await page.getByRole("button", { name: "发送", exact: true }).click();

  const pane = page.getByRole("tabpanel", { name: "AI" });
  const transcript = page.getByRole("log", { name: "AI 对话记录" });
  const assistant = transcript.locator('[data-message-role="assistant"]');

  await expect(assistant).toContainText("段落 90");
  await expect(assistant).toHaveAttribute("data-finish-reason", "stop");

  const metrics = await page.evaluate(() => {
    const paneNode = document.querySelector("#learning-inspector-panel-ai");
    const transcriptNode = document.querySelector('[role="log"][aria-label="AI 对话记录"]');
    const composerNode = document.querySelector(".ai-assistant-composer");
    const paneStyle = getComputedStyle(paneNode);
    const transcriptStyle = getComputedStyle(transcriptNode);
    const paneRect = paneNode.getBoundingClientRect();
    const composerRect = composerNode.getBoundingClientRect();
    return {
      paneOverflowY: paneStyle.overflowY,
      transcriptOverflowY: transcriptStyle.overflowY,
      transcriptScrollable: transcriptNode.scrollHeight > transcriptNode.clientHeight,
      composerInsidePane: composerRect.top >= paneRect.top && composerRect.bottom <= paneRect.bottom + 1,
    };
  });

  expect(metrics.paneOverflowY).toBe("hidden");
  expect(metrics.transcriptOverflowY).toBe("auto");
  expect(metrics.transcriptScrollable).toBe(true);
  expect(metrics.composerInsidePane).toBe(true);

  await transcript.evaluate((node) => node.scrollTo({ top: node.scrollHeight, behavior: "instant" }));
  await expect(assistant.getByRole("button", { name: "复制", exact: true })).toBeVisible();
  await expect(composer).toBeVisible();
  await expect(pane).toBeVisible();
});

test("toolbar exports the current conversation as markdown and json", async ({ page }) => {
  const composer = await openAi(page);
  await composer.fill("e2e:export");
  await page.getByRole("button", { name: "发送", exact: true }).click();
  await expect(page.getByRole("log", { name: "AI 对话记录" })).toContainText("段落 90");

  await page.getByRole("group", { name: "AI 会话工具栏" }).getByText("导出", { exact: true }).click();

  const markdownDownloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "导出 Markdown", exact: true }).click();
  const markdownDownload = await markdownDownloadPromise;
  expect(markdownDownload.suggestedFilename()).toMatch(/\.md$/);
  const markdownPath = await markdownDownload.path();
  const markdown = await readFile(markdownPath, "utf8");
  expect(markdown).toContain("## 你\n\ne2e:export");
  expect(markdown).toContain("## AI 学习助手");
  expect(markdown).toContain("段落 90");

  await page.getByRole("group", { name: "AI 会话工具栏" }).getByText("导出", { exact: true }).click();
  const jsonDownloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "导出 JSON", exact: true }).click();
  const jsonDownload = await jsonDownloadPromise;
  expect(jsonDownload.suggestedFilename()).toMatch(/\.json$/);
  const jsonPath = await jsonDownload.path();
  const payload = JSON.parse(await readFile(jsonPath, "utf8"));
  expect(payload.messages.some((message) => message.role === "user" && message.content === "e2e:export")).toBe(true);
  expect(payload.messages.some((message) => message.role === "assistant" && message.content.includes("段落 90"))).toBe(true);
});
