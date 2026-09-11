import { expect, test } from "@playwright/test";

const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";

function openAiTab(page) {
  return page.goto("?demo=props").then(async () => {
    await page.getByRole("tab", { name: "AI" }).click();
  });
}

test("users can configure their own DeepSeek key and choose V4 Pro", async ({ page }) => {
  const requests = [];
  await page.route(DEEPSEEK_URL, async (route) => {
    requests.push({
      headers: route.request().headers(),
      body: route.request().postDataJSON(),
    });
    await route.fulfill({
      status: 200,
      contentType: "text/event-stream",
      body: [
        'data: {"choices":[{"delta":{"content":"来自浏览器直连"}}]}',
        "",
        'data: {"choices":[{"delta":{},"finish_reason":"stop"}]}',
        "",
        "data: [DONE]",
        "",
      ].join("\n"),
    });
  });

  await openAiTab(page);
  await page.getByRole("button", { name: /配置 DeepSeek/ }).click();
  await page.getByLabel("API Key").fill("sk-browser-user");
  await page.getByLabel("模型").selectOption("deepseek-v4-pro");
  await page.getByRole("checkbox", { name: /长期保存 API Key/ }).check();
  await page.getByRole("button", { name: "保存配置" }).click();

  await expect(page.getByRole("button", { name: /DeepSeek 已配置/ })).toContainText("浏览器直连");
  await expect(page.getByText("DeepSeek · deepseek-v4-pro")).toBeVisible();

  const stored = await page.evaluate(() => ({
    key: localStorage.getItem("react-learning.ai.deepseek.api-key"),
    model: localStorage.getItem("react-learning.ai.deepseek.model"),
    remember: localStorage.getItem("react-learning.ai.deepseek.remember-api-key"),
  }));
  expect(stored).toEqual({ key: "sk-browser-user", model: "deepseek-v4-pro", remember: "1" });

  const composer = page.getByRole("textbox", { name: "向 AI 助手提问" });
  await composer.fill("结合当前 MDX 和源码解释 props");
  await page.getByRole("button", { name: "发送" }).click();
  await expect(page.getByText("来自浏览器直连")).toBeVisible();

  expect(requests).toHaveLength(1);
  expect(requests[0].headers.authorization).toBe("Bearer sk-browser-user");
  expect(requests[0].body.model).toBe("deepseek-v4-pro");
  expect(requests[0].body.stream).toBe(true);
  const lastMessage = requests[0].body.messages.at(-1).content;
  expect(lastMessage).toContain("props.mdx");
  expect(lastMessage).toContain("PropsBasicsDemo.jsx");
  expect(lastMessage).toContain("结合当前 MDX 和源码解释 props");
});

test("API key defaults to session storage and can be cleared", async ({ page }) => {
  await openAiTab(page);
  await page.getByRole("button", { name: /配置 DeepSeek/ }).click();
  await page.getByLabel("API Key").fill("sk-session-only");
  await page.getByLabel("模型").selectOption("deepseek-v4-flash");
  await page.getByRole("button", { name: "保存配置" }).click();

  const stored = await page.evaluate(() => ({
    local: localStorage.getItem("react-learning.ai.deepseek.api-key"),
    session: sessionStorage.getItem("react-learning.ai.deepseek.api-key"),
  }));
  expect(stored).toEqual({ local: null, session: "sk-session-only" });

  await page.getByRole("button", { name: /DeepSeek 已配置/ }).click();
  await page.getByRole("button", { name: "清除 Key" }).click();
  await expect(page.getByRole("button", { name: /配置 DeepSeek/ })).toContainText(/站点网关|待配置/);

  const cleared = await page.evaluate(() => ({
    local: localStorage.getItem("react-learning.ai.deepseek.api-key"),
    session: sessionStorage.getItem("react-learning.ai.deepseek.api-key"),
  }));
  expect(cleared).toEqual({ local: null, session: null });
});
