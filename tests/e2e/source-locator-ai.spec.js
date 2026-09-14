import { expect } from "@playwright/test";
import { loadApp, openDemo, test } from "./test-fixtures.js";

const GATEWAY_URL = "http://127.0.0.1:4173/__ai-test__";

test("Visual Source Locator prefills exact source context in AI without auto-submit", async ({ page }) => {
  const requests = [];
  await page.route(GATEWAY_URL, async (route) => {
    requests.push(route.request().postDataJSON());
    await route.fulfill({ status: 500, body: "unexpected auto-submit" });
  });

  await loadApp(page);
  await openDemo(page, "对象 / 数组 State 不可变更新");

  await page.getByRole("button", { name: "⌖ 定位源码", exact: true }).click();
  const target = page.getByRole("button", { name: "切换城市（copy）", exact: true });
  await target.hover();

  const explain = page.getByRole("button", { name: /用 AI 解释 ImmutableStateDemo\.jsx L\d+(?:–L\d+)?/ });
  await expect(explain).toBeVisible();
  await explain.click();

  await expect(page.getByRole("tab", { name: "AI", exact: true })).toHaveAttribute("aria-selected", "true");
  const composer = page.getByRole("textbox", { name: "向 AI 助手提问" });
  await expect(composer).toBeVisible();
  await expect(composer).toHaveValue(/\[文件\] ImmutableStateDemo\.jsx/);
  await expect(composer).toHaveValue(/\[范围\] L\d+-L\d+/);
  await expect(composer).toHaveValue(/<selected_material>[\s\S]*切换城市（copy）/);
  await expect(page.getByRole("button", { name: "发送", exact: true })).toBeVisible();
  expect(requests).toHaveLength(0);
});
