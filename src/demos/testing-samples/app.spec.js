// Reference sample for CodeViewer. The real E2E suite lives under tests/e2e/.
import { expect, test } from "@playwright/test";

test("critical save flow works in a real browser", async ({ page }) => {
  // Preserve the configured GitHub Pages-style base path instead of resolving to the origin root.
  await page.goto("./");
  await page.getByRole("button", { name: /Testing/ }).click();
  await page.getByRole("button", { name: "保存资料" }).click();
  await expect(page.getByRole("status")).toHaveText("保存成功");
});
