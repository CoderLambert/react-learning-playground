import { expect, test } from "@playwright/test";

const GATEWAY_URL = "http://127.0.0.1:4173/__ai-test__";

function normalizedStream(...events) {
  return `${events.map((event) => JSON.stringify(event)).join("\n")}\n`;
}

async function openAiTab(page, demoId = "props") {
  await page.goto(`?demo=${demoId}`);
  await page.getByRole("tab", { name: "AI" }).click();
  const composer = page.getByRole("textbox", { name: "向 AI 助手提问" });
  await expect(composer).toBeEnabled();
  return composer;
}

test("AI assistant sends current note, numbered source and active source context", async ({ page }) => {
  const requests = [];
  await page.route(GATEWAY_URL, async (route) => {
    const body = route.request().postDataJSON();
    requests.push(body);
    await route.fulfill({
      status: 200,
      contentType: "application/x-ndjson",
      body: normalizedStream(
        { type: "start" },
        { type: "delta", text: `回答:${body.context.learningUnit.id}:` },
        { type: "delta", text: body.context.activeSourceFile },
        { type: "done" },
      ),
    });
  });

  const composer = await openAiTab(page);
  await expect(page.getByText("props.mdx")).toBeVisible();
  await expect(page.getByText("PropsBasicsDemo.jsx", { exact: true })).toBeVisible();

  await composer.fill("结合当前代码解释 props");
  await page.getByRole("button", { name: "发送" }).click();
  await expect(page.getByText("回答:props:PropsBasicsDemo.jsx")).toBeVisible();

  expect(requests).toHaveLength(1);
  const first = requests[0];
  expect(first.context.learningUnit.id).toBe("props");
  expect(first.context.note.name).toBe("props.mdx");
  expect(first.context.note.content.length).toBeGreaterThan(50);
  expect(first.context.sources[0].name).toBe("PropsBasicsDemo.jsx");
  expect(first.context.sources[0].code).toMatch(/^1 \|/);
  expect(first.context.activeSourceFile).toBe("PropsBasicsDemo.jsx");

  await page.getByRole("tab", { name: "源码" }).click();
  await page.getByRole("tab", { name: "UserCard.jsx" }).click();
  await page.getByRole("tab", { name: "AI" }).click();
  await expect(page.getByText("UserCard.jsx", { exact: true }).last()).toBeVisible();

  await composer.fill("分析当前选中的辅助文件");
  await page.getByRole("button", { name: "发送" }).click();
  await expect.poll(() => requests.length).toBe(2);
  expect(requests[1].context.activeSourceFile).toBe("UserCard.jsx");
});

test("changing demos resets the context-bound chat and prevents stale context", async ({ page }) => {
  const requests = [];
  await page.route(GATEWAY_URL, async (route) => {
    const body = route.request().postDataJSON();
    requests.push(body);
    await route.fulfill({
      status: 200,
      contentType: "application/x-ndjson",
      body: normalizedStream(
        { type: "start" },
        { type: "delta", text: `unit=${body.context.learningUnit.id}` },
        { type: "done" },
      ),
    });
  });

  let composer = await openAiTab(page, "props");
  await composer.fill("props question");
  await page.getByRole("button", { name: "发送" }).click();
  await expect(page.getByText("unit=props")).toBeVisible();

  await page.getByRole("button", { name: /Children 默认插槽/ }).click();
  await expect(page).toHaveURL(/demo=children/);
  await expect(page.getByText("props question")).toHaveCount(0);

  await page.getByRole("tab", { name: "AI" }).click();
  composer = page.getByRole("textbox", { name: "向 AI 助手提问" });
  await expect(composer).toBeEnabled();
  await composer.fill("children question");
  await page.getByRole("button", { name: "发送" }).click();
  await expect(page.getByText("unit=children")).toBeVisible();

  expect(requests.map((request) => request.context.learningUnit.id)).toEqual(["props", "children"]);
  expect(requests[1].context.note.name).toBe("children.mdx");
  expect(requests[1].context.note.content).not.toContain("props question");
});

test("AI assistant handles normalized errors, stop and New Chat", async ({ page }) => {
  const requests = [];
  await page.route(GATEWAY_URL, async (route) => {
    const body = route.request().postDataJSON();
    requests.push(body);

    if (body.question.includes("错误")) {
      await route.fulfill({
        status: 200,
        contentType: "application/x-ndjson",
        body: normalizedStream({ type: "start" }, { type: "error", message: "mock quota", code: "RATE_LIMIT" }),
      });
      return;
    }

    if (body.question.includes("慢")) {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      try {
        await route.fulfill({
          status: 200,
          contentType: "application/x-ndjson",
          body: normalizedStream({ type: "start" }, { type: "delta", text: "late" }, { type: "done" }),
        });
      } catch {
        // The browser request can be aborted by the Stop action before fulfillment.
      }
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/x-ndjson",
      body: normalizedStream({ type: "start" }, { type: "delta", text: "ok" }, { type: "done" }),
    });
  });

  const composer = await openAiTab(page);
  await composer.fill("触发错误");
  await page.getByRole("button", { name: "发送" }).click();
  await expect(page.getByRole("alert")).toContainText("mock quota");

  await page.getByRole("button", { name: "新对话" }).click();
  await expect(page.getByRole("alert")).toHaveCount(0);
  await expect(page.getByText("触发错误")).toHaveCount(0);

  await composer.fill("慢回答");
  await page.getByRole("button", { name: "发送" }).click();
  await expect.poll(() => requests.some((request) => request.question === "慢回答")).toBe(true);
  await page.getByRole("button", { name: "停止" }).click();
  await expect(page.getByRole("button", { name: "发送" })).toBeVisible();
  await expect(page.getByText("late")).toHaveCount(0);
});
