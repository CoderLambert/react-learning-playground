// Reference sample for CodeViewer. The repository does not install Playwright yet.
import { expect, test } from "@playwright/test";

test("critical save flow works in a real browser", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Testing/ }).click();
  await page.getByRole("button", { name: "保存资料" }).click();
  await expect(page.getByRole("status")).toHaveText("保存成功");
});
