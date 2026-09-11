import { test as base, expect } from "@playwright/test";

function formatDiagnostics(diagnostics) {
  return JSON.stringify(
    {
      pageErrors: diagnostics.pageErrors.map((error) => error.message),
      consoleErrors: diagnostics.consoleErrors,
      consoleWarnings: diagnostics.consoleWarnings,
    },
    null,
    2,
  );
}

export const test = base.extend({
  browserDiagnostics: [
    async ({ page }, continueTest, testInfo) => {
      const diagnostics = { pageErrors: [], consoleErrors: [], consoleWarnings: [] };
      page.on("pageerror", (error) => diagnostics.pageErrors.push(error));
      page.on("console", (message) => {
        if (message.type() === "error") diagnostics.consoleErrors.push(message.text());
        if (message.type() === "warning") diagnostics.consoleWarnings.push(message.text());
      });
      await continueTest(diagnostics);
      if (diagnostics.pageErrors.length > 0 || diagnostics.consoleErrors.length > 0 || diagnostics.consoleWarnings.length > 0) {
        const body = formatDiagnostics(diagnostics);
        await testInfo.attach("browser-diagnostics.json", { body: Buffer.from(body), contentType: "application/json" });
        throw new Error(`Unexpected browser diagnostics:\n${body}`);
      }
    },
    { auto: true },
  ],
});

export async function loadApp(page) {
  await page.goto("./");
  await expect(page.getByRole("heading", { name: "React 核心实验室", exact: true })).toBeVisible();
  await expect(page.locator("main.app-content")).toBeVisible();
}

export async function openDemo(page, label) {
  const mobileMenu = page.getByRole("button", { name: /打开侧边导航/ });
  const shell = page.locator(".workbench-shell");
  if (await mobileMenu.isVisible() && (await shell.getAttribute("data-mobile-navigation-open")) !== "true") {
    const closeInspector = page.getByRole("button", { name: "关闭学习面板" }).last();
    if (await closeInspector.isVisible()) await closeInspector.click();
    await mobileMenu.click();
  }
  const navItem = page.locator("button.workbench-navigation-item").filter({ hasText: label }).first();
  await expect(navItem).toBeVisible();
  await navItem.click();
  await expect(page.locator(".demo-page")).toBeVisible();
  await expect(page.locator(".demo-page h2.demo-title")).toBeVisible();
}
