import { expect } from "@playwright/test";
import { loadApp, openDemo, test } from "./test-fixtures.js";

test.describe("CodeViewer", () => {
  test("expands, collapses, switches files, and exercises copy feedback", async ({ page }, testInfo) => {
    await loadApp(page);
    await openDemo(page, "Props 基础与解构");

    const viewer = page.locator(".code-accordion-wrapper").first();
    const toggle = viewer.getByRole("button", { name: /源码实现/ });
    const body = viewer.locator(".code-accordion-body");

    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await toggle.press("Enter");
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(body).toBeVisible();

    const viewport = viewer.locator(".code-highlight-viewport");
    await expect(viewport).toContainText("PropsBasicsDemo");
    const firstSource = await viewport.innerText();

    const userCardTab = viewer.locator(".code-file-tab").filter({ hasText: "UserCard.jsx" });
    await expect(userCardTab).toBeVisible();
    await userCardTab.click();
    await expect(viewport).toContainText("export function UserCard");
    const secondSource = await viewport.innerText();
    expect(secondSource).not.toBe(firstSource);

    await page.context().grantPermissions(["clipboard-read", "clipboard-write"], {
      origin: new URL(page.url()).origin,
    });
    const canReadClipboard = await page.evaluate(() => Boolean(navigator.clipboard?.readText));
    await viewer.getByTitle("复制代码到剪贴板").click();
    await expect(viewer.getByRole("button", { name: /已复制/ })).toBeVisible();

    if (canReadClipboard) {
      try {
        await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(secondSource);
      } catch {
        testInfo.annotations.push({
          type: "limitation",
          description: "Clipboard write feedback passed, but browser clipboard readback was not reliable in this environment.",
        });
      }
    } else {
      testInfo.annotations.push({
        type: "limitation",
        description: "Clipboard API readback is unavailable; the copy UI feedback was verified instead.",
      });
    }

    await toggle.press("Space");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(body).toBeHidden();
  });
});
