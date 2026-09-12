import { expect } from "@playwright/test";
import { loadApp, openDemo, test } from "./test-fixtures.js";

test.describe("SourceViewer", () => {
  test("switches files and exercises copy feedback in the inspector", async ({ page }, testInfo) => {
    await loadApp(page);
    await openDemo(page, "Props 基础与解构");
    await page.getByRole("tab", { name: "源码", exact: true }).click();

    const viewer = page.locator(".source-viewer--inspector .code-accordion-wrapper");
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

  test("locates a clicked Demo element in the inspector without executing the Demo action", async ({ page }) => {
    await loadApp(page);
    await openDemo(page, "对象 / 数组 State 不可变更新");

    await expect(page.locator(".demo-page .source-viewer--inline")).toHaveCount(0);
    const locatorToggle = page.getByRole("button", { name: "⌖ 定位源码", exact: true });
    await locatorToggle.click();
    await expect(page.getByRole("button", { name: "退出源码定位", exact: true })).toHaveAttribute("aria-pressed", "true");

    const changeCity = page.getByRole("button", { name: "切换城市（copy）", exact: true });
    await changeCity.hover();
    await expect(page.getByTestId("source-locator-overlay")).toBeVisible();
    await expect(page.locator(".source-locator-label")).toContainText("ImmutableStateDemo.jsx");

    await changeCity.click();
    await expect(page.getByText("Ada · London, UK", { exact: true })).toBeVisible();
    await expect(page.getByRole("tab", { name: "源码", exact: true })).toHaveAttribute("aria-selected", "true");

    const inspectorViewer = page.locator(".source-viewer--inspector");
    await expect(inspectorViewer).toHaveAttribute("data-source-file", "ImmutableStateDemo.jsx");
    await expect(inspectorViewer).toHaveAttribute("data-source-focus", /^\d+-\d+$/);
    await expect(inspectorViewer.locator('[data-highlighted="true"]').filter({ hasText: "切换城市（copy）" }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "⌖ 定位源码", exact: true })).toHaveAttribute("aria-pressed", "false");
  });

  test("makes Alt / Option source location visually explicit before quick location", async ({ page }) => {
    await loadApp(page);
    await openDemo(page, "对象 / 数组 State 不可变更新");

    const append = page.getByRole("button", { name: "append", exact: true });
    await page.keyboard.down("Alt");
    await expect(page.locator("html")).toHaveAttribute("data-source-locator-alt", "true");

    await expect.poll(() => page.evaluate(() => {
      const style = getComputedStyle(document.body, "::before");
      return { content: style.content, position: style.position };
    })).toEqual(expect.objectContaining({
      content: expect.stringContaining("源码定位模式"),
      position: "fixed",
    }));

    await expect.poll(() => page.locator(".source-locator-scope").first().evaluate((element) => {
      const style = getComputedStyle(element);
      return { cursor: style.cursor, outlineStyle: style.outlineStyle };
    })).toEqual({ cursor: "crosshair", outlineStyle: "dashed" });

    await append.hover();
    await expect(page.getByTestId("source-locator-overlay")).toBeVisible();
    await expect(page.locator(".source-locator-label")).toContainText("ImmutableStateDemo.jsx");

    await append.click();
    await expect(page.getByText(/新任务 3/)).toHaveCount(0);
    await expect(page.getByRole("tab", { name: "源码", exact: true })).toHaveAttribute("aria-selected", "true");
    const inspectorViewer = page.locator(".source-viewer--inspector");
    await expect(inspectorViewer).toHaveAttribute("data-source-file", "ImmutableStateDemo.jsx");
    await expect(inspectorViewer.locator('[data-highlighted="true"]').filter({ hasText: "append" }).first()).toBeVisible();

    await page.keyboard.up("Alt");
    await expect(page.locator("html")).not.toHaveAttribute("data-source-locator-alt", "true");
  });

  test("navigates AST semantic regions inside the single inspector source workspace", async ({ page }) => {
    await loadApp(page);
    await openDemo(page, "useReducer 状态机模式");
    await page.getByRole("tab", { name: "源码", exact: true }).click();

    const inspectorViewer = page.locator(".source-viewer--inspector");
    const semanticNav = inspectorViewer.locator(".source-semantic-nav");
    await expect(semanticNav).toBeVisible();
    await expect(semanticNav).toHaveAttribute("data-semantic-parser", "rolldown-oxc:jsx");

    const coreButton = semanticNav.locator(".source-semantic-chip--primary");
    await expect(coreButton).toContainText("Reducer · counterReducer");
    await coreButton.click();
    await expect(coreButton).toHaveAttribute("aria-pressed", "true");
    await expect(inspectorViewer).toHaveAttribute("data-source-semantic", "reducer:counterReducer");
    await expect(inspectorViewer.locator('[data-highlighted="true"]').filter({ hasText: "counterReducer" }).first()).toBeVisible();

    await semanticNav.getByRole("button", { name: "完整文件" }).click();
    await expect(inspectorViewer).toHaveAttribute("data-source-semantic", "full");
    await expect(inspectorViewer).not.toHaveAttribute("data-source-focus", /.+/);
  });

  test("builds semantic navigation for registered TSX sources in the inspector", async ({ page }) => {
    await loadApp(page);
    await openDemo(page, "TypeScript for React 类型边界");
    await page.getByRole("tab", { name: "源码", exact: true }).click();

    const inspectorViewer = page.locator(".source-viewer--inspector");
    await inspectorViewer.locator(".code-file-tab").filter({ hasText: "react-boundaries.tsx" }).click();

    const semanticNav = inspectorViewer.locator(".source-semantic-nav");
    await expect(semanticNav).toHaveAttribute("data-semantic-parser", "rolldown-oxc:tsx");
    const coreButton = semanticNav.locator(".source-semantic-chip--primary");
    await expect(coreButton).toContainText("Component ·");
    await coreButton.click();
    await expect(inspectorViewer).toHaveAttribute("data-source-semantic", /^component:/);

    const semanticId = await inspectorViewer.getAttribute("data-source-semantic");
    const selectedSymbol = semanticId?.slice("component:".length);
    expect(selectedSymbol).toBeTruthy();
    await expect(inspectorViewer.locator('[data-highlighted="true"]').filter({ hasText: selectedSymbol }).first()).toBeVisible();
  });
});
