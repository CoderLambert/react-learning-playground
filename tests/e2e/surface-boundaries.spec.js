import { expect } from "@playwright/test";
import { loadApp, test } from "./test-fixtures.js";

async function expectNoPageOverflow(page) {
  const overflow = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));

  expect(overflow.document, JSON.stringify(overflow)).toBeLessThanOrEqual(overflow.viewport + 1);
  expect(overflow.body, JSON.stringify(overflow)).toBeLessThanOrEqual(overflow.viewport + 1);
}

test.describe("responsive inspector surface boundaries", () => {
  test("keeps the 641-900px inspector wrapper out of the partial-overlay hit area", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 800 });
    await loadApp(page);

    const slot = page.locator(".workbench-inspector-slot");
    const inspector = page.locator(".learning-inspector");
    const content = page.locator(".workbench-content-slot");

    await expect(slot).toBeVisible();
    await expect(inspector).toBeVisible();
    await expect(content).toBeVisible();

    const slotBox = await slot.boundingBox();
    const inspectorBox = await inspector.boundingBox();
    const contentBox = await content.boundingBox();

    expect(slotBox).not.toBeNull();
    expect(inspectorBox).not.toBeNull();
    expect(contentBox).not.toBeNull();
    expect(slotBox?.width ?? Infinity).toBeLessThanOrEqual(1);
    expect(slotBox?.height ?? Infinity).toBeLessThanOrEqual(1);
    expect(inspectorBox?.top ?? 0).toBeGreaterThanOrEqual(59);
    expect(inspectorBox?.x ?? 0).toBeGreaterThan(0);
    expect((inspectorBox?.x ?? 0) + (inspectorBox?.width ?? 0)).toBeLessThanOrEqual(769);
    expect(contentBox?.width ?? 0).toBeGreaterThanOrEqual(767);

    const outsideInspectorIsOwnedBySlot = await page.evaluate(() => {
      const element = document.elementFromPoint(24, 120);
      return Boolean(element?.closest(".workbench-inspector-slot"));
    });
    expect(outsideInspectorIsOwnedBySlot).toBe(false);

    await expectNoPageOverflow(page);
  });

  test("retains the intentional full-screen inspector contract at 640px and below", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await loadApp(page);

    const slot = page.locator(".workbench-inspector-slot");
    const inspector = page.locator(".learning-inspector");
    const content = page.locator(".workbench-content-slot");

    const slotBox = await slot.boundingBox();
    const inspectorBox = await inspector.boundingBox();
    expect(slotBox?.width).toBeGreaterThanOrEqual(389);
    expect(slotBox?.height).toBeGreaterThanOrEqual(843);
    expect(inspectorBox?.width).toBeGreaterThanOrEqual(389);
    expect(inspectorBox?.height).toBeGreaterThanOrEqual(843);
    await expect(content).toHaveAttribute("inert", "");
    await expectNoPageOverflow(page);
  });

  test("retains the 901-1023px no-grid-reservation overlay contract", async ({ page }) => {
    await page.setViewportSize({ width: 950, height: 800 });
    await loadApp(page);

    const navigationBox = await page.locator(".workbench-navigation-slot").boundingBox();
    const contentBox = await page.locator(".workbench-content-slot").boundingBox();
    const inspectorBox = await page.locator(".learning-inspector").boundingBox();

    expect(navigationBox).not.toBeNull();
    expect(contentBox).not.toBeNull();
    expect(inspectorBox).not.toBeNull();
    expect((contentBox?.width ?? 0) + (navigationBox?.width ?? 0)).toBeGreaterThanOrEqual(949);
    expect(inspectorBox?.x).toBeGreaterThan(contentBox?.x ?? 0);
    await expectNoPageOverflow(page);
  });
});
