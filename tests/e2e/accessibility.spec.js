import AxeBuilder from "@axe-core/playwright";
import { expect } from "@playwright/test";
import { loadApp, openDemo, test } from "./test-fixtures.js";

test.describe("keyboard and accessibility interaction", () => {
  test("keeps focus visible, labels the form, and exposes live status semantics", async ({ page }) => {
    await loadApp(page);

    const search = page.getByRole("textbox", { name: "搜索知识点或关键词" });
    await search.focus();
    await expect(search).toBeFocused();
    const focusMetrics = await search.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const styles = getComputedStyle(element);
      return { width: rect.width, height: rect.height, boxShadow: styles.boxShadow };
    });
    expect(focusMetrics.width).toBeGreaterThan(0);
    expect(focusMetrics.height).toBeGreaterThan(0);
    expect(focusMetrics.boxShadow).not.toBe("none");

    await openDemo(page, "语义、Label 与可访问状态反馈");
    const email = page.getByLabel("邮箱地址");
    await expect(email).toBeVisible();
    await expect(page.locator('[role="status"]')).toHaveAttribute("aria-live", "polite");

    await email.fill("invalid");
    await email.press("Enter");
    await expect(page.locator('[role="status"]')).toContainText("正在保存", { timeout: 1_000 });
    await expect(page.getByRole("alert")).toHaveAttribute("aria-live", "assertive", { timeout: 3_000 });
    await expect(page.getByRole("alert")).toContainText("有效邮箱");

    await email.fill("learner@example.com");
    await email.press("Enter");
    await expect(page.getByRole("status")).toContainText("已保存 learner@example.com", { timeout: 3_000 });
  });

  test("enters, contains, closes, and restores focus for the modal", async ({ page }) => {
    await loadApp(page);
    await openDemo(page, "Modal Focus");

    const opener = page.getByRole("button", { name: "打开 Modal", exact: true });
    await opener.focus();
    await opener.press("Space");

    const dialog = page.getByRole("dialog", { name: /键盘可用的 Modal/ });
    await expect(dialog).toBeVisible();
    const note = page.getByRole("textbox", { name: "备注" });
    const cancel = page.getByRole("button", { name: "取消", exact: true });
    const save = page.getByRole("button", { name: "保存并关闭", exact: true });
    await expect(note).toBeFocused();

    await page.keyboard.press("Shift+Tab");
    await expect(cancel).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(note).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(save).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(opener).toBeFocused();
  });

  test("passes automated axe checks for the shell and modal", async ({ page }) => {
    await loadApp(page);
    await page.waitForTimeout(300);
    const shellResults = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    expect(shellResults.violations).toEqual([]);

    await openDemo(page, "Modal Focus");
    await page.getByRole("button", { name: "打开 Modal", exact: true }).click();
    await page.waitForTimeout(300);
    const modalResults = await new AxeBuilder({ page })
      .include('[role="dialog"]')
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    expect(modalResults.violations).toEqual([]);
  });
});
