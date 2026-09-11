import { expect } from "@playwright/test";
import { loadApp, openDemo, test } from "./test-fixtures.js";

test.describe("effects and cleanup", () => {
  test("exercises listeners, timers, Effect Event, hooks, and third-party cleanup", async ({ page }) => {
    await loadApp(page);

    await openDemo(page, "useEffect 正确用法");
    await page.getByRole("button", { name: /卸载监听组件/ }).click();
    await expect(page.locator(".demo-console").first()).toContainText("Cleanup 清理");
    await page.getByRole("button", { name: /挂载监听组件/ }).click();
    await expect(page.locator(".demo-console").first()).toContainText("Setup 建立");
    await page.evaluate(() => window.dispatchEvent(new Event("resize")));
    await expect(page.locator(".demo-console-log").filter({ hasText: "窗口宽度变更为" })).toHaveCount(1);

    await openDemo(page, "响应式 Effect 生命周期与依赖");
    await page.getByRole("button", { name: "房间 #102", exact: true }).click();
    await expect(page.getByText("房间 #102 实时消息通道", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: /开启静音/ }).click();
    await expect(page.getByRole("button", { name: /当前已静音/ })).toBeVisible();
    await expect(page.getByText(/来自房间 #102 的实时消息/)).toHaveCount(1, { timeout: 3_000 });

    await openDemo(page, "useEffectEvent 非响应式逻辑");
    const connectionAlert = page.locator(".demo-alert").filter({ hasText: "连接次数：" }).first();
    await expect(connectionAlert).toContainText("已连接 general，当前主题 light", { timeout: 2_000 });
    await page.getByRole("button", { name: /切换 theme/ }).click();
    await expect(connectionAlert).toContainText("连接次数：1");
    await expect(connectionAlert).toContainText("当前主题 light");
    await page.getByLabel("房间").selectOption("react");
    await expect(connectionAlert).toContainText("连接次数：2");
    await expect(connectionAlert).toContainText("当前主题 dark");

    await openDemo(page, "Custom Hooks");
    const counters = page.locator(".demo-grid-2 .demo-alert-tip");
    const counterA = counters.nth(0);
    const counterB = counters.nth(1);
    await counterA.getByRole("button", { name: "+1", exact: true }).click();
    await expect(counterA).toContainText("A: 1");
    await expect(counterB).toContainText("B: 0");

    await openDemo(page, "Portal 与第三方 DOM");
    await page.getByRole("button", { name: "打开 Portal", exact: true }).click();
    await expect(page.getByRole("dialog", { name: "Portal demo" })).toBeVisible();
    await page.getByRole("dialog", { name: "Portal demo" }).getByRole("button", { name: "关闭", exact: true }).click();
    await expect(page.getByRole("dialog", { name: "Portal demo" })).toBeHidden();
    await page.getByRole("button", { name: "切换 series，触发重建", exact: true }).click();
    await expect(page.locator("pre").filter({ hasText: /setup/ }).first()).toContainText("cleanup");

    await openDemo(page, "useSyncExternalStore 外部订阅");
    const readerA = page.locator(".demo-alert-tip").filter({ hasText: "Reader A" }).first();
    const readerB = page.locator(".demo-alert-tip").filter({ hasText: "Reader B" }).first();
    await expect(readerA).toContainText("当前订阅者：2");
    await page.getByRole("button", { name: /externalStore.increment/ }).click();
    await expect(readerA).toContainText("snapshot.value = 1");
    await expect(readerB).toContainText("snapshot.value = 1");
    await openDemo(page, "Props 基础与解构");
    await openDemo(page, "useSyncExternalStore 外部订阅");
    await expect(readerA).toContainText("当前订阅者：2");
  });
});
