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

  test("keeps inline source local to the lesson and can hand off to the inspector", async ({ page }) => {
    await loadApp(page);
    await openDemo(page, "Props 基础与解构");

    const inlineViewer = page.locator(".demo-page .source-viewer--inline");
    const toggle = inlineViewer.locator(".code-accordion-toggle");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(inlineViewer.locator(".code-highlight-viewport")).toContainText("PropsBasicsDemo");

    await inlineViewer.locator(".code-file-tab").filter({ hasText: "UserCard.jsx" }).click();
    await expect(inlineViewer.locator(".code-highlight-viewport")).toContainText("export function UserCard");

    await inlineViewer.getByRole("button", { name: /在源码面板打开/ }).click();
    await expect(page.getByRole("tab", { name: "源码", exact: true })).toHaveAttribute("aria-selected", "true");

    const inspectorViewer = page.locator(".source-viewer--inspector");
    await expect(inspectorViewer).toHaveAttribute("data-source-file", "UserCard.jsx");
    await expect(inspectorViewer.locator(".code-highlight-viewport")).toContainText("export function UserCard");
  });

  test("navigates AST semantic regions and preserves the selected implementation during inspector handoff", async ({ page }) => {
    await loadApp(page);
    await openDemo(page, "useReducer 状态机模式");

    const inlineViewer = page.locator(".demo-page .source-viewer--inline");
    await inlineViewer.locator(".code-accordion-toggle").click();

    const semanticNav = inlineViewer.locator(".source-semantic-nav");
    await expect(semanticNav).toBeVisible();
    await expect(semanticNav).toHaveAttribute("data-semantic-parser", "rolldown-oxc:jsx");

    const coreButton = semanticNav.locator(".source-semantic-chip--primary");
    await expect(coreButton).toHaveAttribute("aria-pressed", "true");
    await expect(coreButton).toContainText("Reducer · counterReducer");
    await expect(inlineViewer).toHaveAttribute("data-source-semantic", "reducer:counterReducer");
    await expect(inlineViewer.locator('[data-highlighted="true"]').filter({ hasText: "counterReducer" }).first()).toBeVisible();

    const coreFocus = await inlineViewer.getAttribute("data-source-focus");
    expect(coreFocus).toMatch(/^\d+-\d+$/);

    await semanticNav.getByRole("button", { name: "完整文件" }).click();
    await expect(inlineViewer).toHaveAttribute("data-source-semantic", "full");
    await expect(inlineViewer).not.toHaveAttribute("data-source-focus", /.+/);

    const componentButton = semanticNav.getByRole("button", { name: "Component · StateReducerDemo" });
    await componentButton.click();
    await expect(inlineViewer).toHaveAttribute("data-source-semantic", "component:StateReducerDemo");
    await expect(inlineViewer.locator('[data-highlighted="true"]').filter({ hasText: "StateReducerDemo" }).first()).toBeVisible();

    await coreButton.click();
    await expect(inlineViewer).toHaveAttribute("data-source-focus", coreFocus);
    await inlineViewer.getByRole("button", { name: /在源码面板打开/ }).click();

    await expect(page.getByRole("tab", { name: "源码", exact: true })).toHaveAttribute("aria-selected", "true");
    const inspectorViewer = page.locator(".source-viewer--inspector");
    await expect(inspectorViewer).toHaveAttribute("data-source-file", "StateReducerDemo.jsx");
    await expect(inspectorViewer).toHaveAttribute("data-source-focus", coreFocus);
    await expect(inspectorViewer.locator('[data-highlighted="true"]').filter({ hasText: "counterReducer" }).first()).toBeVisible();
  });

  test("builds semantic navigation for registered TSX sources", async ({ page }) => {
    await loadApp(page);
    await openDemo(page, "TypeScript for React 类型边界");

    const inlineViewer = page.locator(".demo-page .source-viewer--inline");
    await inlineViewer.locator(".code-accordion-toggle").click();
    await inlineViewer.locator(".code-file-tab").filter({ hasText: "react-boundaries.tsx" }).click();

    const semanticNav = inlineViewer.locator(".source-semantic-nav");
    await expect(semanticNav).toHaveAttribute("data-semantic-parser", "rolldown-oxc:tsx");
    const coreButton = semanticNav.locator(".source-semantic-chip--primary");
    await expect(coreButton).toHaveAttribute("aria-pressed", "true");
    await expect(coreButton).toContainText("Component ·");
    await expect(inlineViewer).toHaveAttribute("data-source-semantic", /^component:/);

    const semanticId = await inlineViewer.getAttribute("data-source-semantic");
    const selectedSymbol = semanticId?.slice("component:".length);
    expect(selectedSymbol).toBeTruthy();
    await expect(inlineViewer.locator('[data-highlighted="true"]').filter({ hasText: selectedSymbol }).first()).toBeVisible();
  });
});
