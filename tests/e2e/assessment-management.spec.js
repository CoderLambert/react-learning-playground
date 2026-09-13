import { expect, test } from "@playwright/test";

test("assessment tab exposes the new runtime-backed question manager", async ({ page }) => {
  await page.goto("?demo=props");
  await page.getByRole("tab", { name: "评测" }).click();

  await expect(page.getByRole("heading", { name: "当前知识点题目" })).toBeVisible();
  await expect(page.getByRole("checkbox", { name: "显示已停用题目" })).toBeVisible();
  await expect(page.getByText(/当前知识点暂无评测|准备好检查理解了吗/)).toBeVisible();
});

test("assessment manager keeps practice UI in the same tab", async ({ page }) => {
  await page.goto("?demo=state-snapshot-queue");
  await page.getByRole("tab", { name: "评测" }).click();

  const panel = page.getByRole("tabpanel", { name: "评测" });
  await expect(panel.getByText("题库管理", { exact: true })).toBeVisible();
  await expect(panel.getByText("知识点评测", { exact: true })).toBeVisible();
});
