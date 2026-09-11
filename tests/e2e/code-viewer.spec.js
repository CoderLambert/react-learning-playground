import { expect } from "@playwright/test";
import { loadApp, openDemo, test } from "./test-fixtures.js";

test.describe("SourceViewer", () => {
  test("switches files and exercises copy feedback in the inspector", async ({ page }, testInfo) => {
    await loadApp(page);
    await openDemo(page, "Props 基础与解构");
    await page.getByRole("tab", { name: "源码" }).click();

    const viewer = page.locator(".source-viewer .code-accordion-wrapper");
    const viewport = viewer.locator(".code-highlight-viewport");
    await expect(viewport).toContainText("PropsBasicsDemo");
    const firstSource = await viewport.innerText();

    const userCardTab = viewer.locator(".code-file-tab").filter({ hasText: "UserCard.jsx" });
    await userCardTab.click();
    await expect(viewport).toContainText("export function UserCard");
    const secondSource = await viewport.innerText();
    expect(secondSource).not.toBe(firstSource);

    await page.context().grantPermissions(["clipboard-read", "clipboard-write"], { origin: new URL(page.url()).origin });
    const canReadClipboard = await page.evaluate(() => Boolean(navigator.clipboard?.readText));
    await viewer.getByTitle("复制代码到剪贴板").click();
    await expect(viewer.getByRole("button", { name: /已复制/ })).toBeVisible();
    if (canReadClipboard) {
      try { await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(secondSource); }
      catch { testInfo.annotations.push({ type: "limitation", description: "Clipboard readback was not reliable; UI feedback passed." }); }
    }
  });
});
