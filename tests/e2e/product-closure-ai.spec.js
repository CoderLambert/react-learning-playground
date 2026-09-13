import { expect } from "@playwright/test";
import { test } from "./test-fixtures.js";

const GATEWAY_PATH = "/__ai-test__";

async function installLongAnswerGateway(page) {
  await page.addInitScript((gatewayPath) => {
    const originalFetch = window.fetch.bind(window);
    const encoder = new TextEncoder();
    window.fetch = async (input, init = {}) => {
      const url = typeof input === "string" ? input : input?.url;
      if (!url || !new URL(url, window.location.href).pathname.endsWith(gatewayPath)) {
        return originalFetch(input, init);
      }
      const longText = Array.from({ length: 180 }, (_, index) => `第 ${index + 1} 段：用于验证长回答滚动区域。`).join("\n\n");
      return new Response(new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(`${JSON.stringify({ type: "start" })}\n`));
          controller.enqueue(encoder.encode(`${JSON.stringify({ type: "delta", text: longText })}\n`));
          controller.enqueue(encoder.encode(`${JSON.stringify({ type: "done", finishReason: "stop" })}\n`));
          controller.close();
        },
      }), { status: 200, headers: { "content-type": "application/x-ndjson; charset=utf-8" } });
    };
  }, GATEWAY_PATH);
}

async function openAi(page) {
  await installLongAnswerGateway(page);
  await page.goto("./?demo=props");
  await page.getByRole("tab", { name: "AI", exact: true }).click();
  return {
    panel: page.locator("#learning-inspector-panel-ai"),
    composer: page.getByRole("textbox", { name: "向 AI 助手提问" }),
    transcript: page.getByRole("log", { name: "AI 对话记录" }),
  };
}

test("long AI answer scrolls inside transcript while composer remains visible and actions are reachable", async ({ page }) => {
  const { panel, composer, transcript } = await openAi(page);
  await composer.fill("e2e:product-closure-long-answer");
  await page.getByRole("button", { name: "发送", exact: true }).click();
  const assistant = transcript.locator('[data-message-role="assistant"]');
  await expect(assistant).toContainText("第 180 段");

  const metrics = await panel.evaluate((panelNode) => {
    const transcriptNode = panelNode.querySelector('[role="log"][aria-label="AI 对话记录"]');
    const textarea = panelNode.querySelector('textarea[aria-label="向 AI 助手提问"], textarea');
    const panelRect = panelNode.getBoundingClientRect();
    const composerRect = textarea?.getBoundingClientRect();
    return {
      transcriptScrollable: Boolean(transcriptNode && transcriptNode.scrollHeight > transcriptNode.clientHeight),
      panelOverflowY: getComputedStyle(panelNode).overflowY,
      composerInsidePanel: Boolean(composerRect && composerRect.top >= panelRect.top && composerRect.bottom <= panelRect.bottom),
    };
  });
  expect(metrics.transcriptScrollable).toBe(true);
  expect(metrics.panelOverflowY).not.toBe("auto");
  expect(metrics.panelOverflowY).not.toBe("scroll");
  expect(metrics.composerInsidePanel).toBe(true);

  await transcript.evaluate((node) => { node.scrollTop = node.scrollHeight; });
  await expect(assistant.getByRole("button", { name: "复制", exact: true })).toBeVisible();
  await expect(assistant.getByRole("button", { name: /继续|解释|举例|深入/ }).first()).toBeVisible();
  await expect(composer).toBeVisible();
});

test("current conversation exposes copy plus Markdown and JSON export through accessible controls", async ({ page }) => {
  const { composer } = await openAi(page);
  await composer.fill("e2e:export-current-conversation");
  await page.getByRole("button", { name: "发送", exact: true }).click();
  await expect(page.getByRole("log", { name: "AI 对话记录" })).toContainText("第 180 段");

  await page.getByLabel("会话导出与复制").click();
  const actions = page.getByRole("group", { name: "当前会话操作" });
  await expect(actions.getByRole("button", { name: "复制整段会话" })).toBeEnabled();
  await expect(actions.getByRole("button", { name: "导出 Markdown" })).toBeEnabled();
  await expect(actions.getByRole("button", { name: "导出 JSON" })).toBeEnabled();

  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await actions.getByRole("button", { name: "复制整段会话" }).click();
  await expect(page.getByRole("status", { name: "会话操作状态" })).toContainText("已复制整段会话");
  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboard).toContain("e2e:export-current-conversation");
  expect(clipboard).toContain("第 180 段");

  const markdownDownload = page.waitForEvent("download");
  await actions.getByRole("button", { name: "导出 Markdown" }).click();
  expect((await markdownDownload).suggestedFilename()).toMatch(/\.md$/);

  await page.getByLabel("会话导出与复制").click();
  const jsonDownload = page.waitForEvent("download");
  await page.getByRole("group", { name: "当前会话操作" }).getByRole("button", { name: "导出 JSON" }).click();
  expect((await jsonDownload).suggestedFilename()).toMatch(/\.json$/);
});

test("switching from AI to Assessment hides the AI panel and shows the selected tabpanel", async ({ page }) => {
  await page.goto("./?demo=props");

  const aiTab = page.getByRole("tab", { name: "AI", exact: true });
  const assessmentTab = page.getByRole("tab", { name: "评测", exact: true });
  const aiPanel = page.locator("#learning-inspector-panel-ai");
  const assessmentPanel = page.locator("#learning-inspector-panel-assessment");

  await aiTab.click();
  await expect(aiTab).toHaveAttribute("aria-selected", "true");
  await expect(aiPanel).toBeVisible();
  await expect(assessmentPanel).toBeHidden();

  await assessmentTab.click();
  await expect(assessmentTab).toHaveAttribute("aria-selected", "true");
  await expect(aiTab).toHaveAttribute("aria-selected", "false");
  await expect(aiPanel).toBeHidden();
  await expect(assessmentPanel).toBeVisible();
});
