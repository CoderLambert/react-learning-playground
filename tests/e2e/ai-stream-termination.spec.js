import { expect, test } from "@playwright/test";

const GATEWAY_PATH = "/__ai-test__";
const OUTPUT_LIMIT = 6_000;

async function installStreamingGateway(page) {
  await page.addInitScript(({ gatewayPath, outputLimit }) => {
    const originalFetch = window.fetch.bind(window);
    const encoder = new TextEncoder();
    const encode = (event) => encoder.encode(`${JSON.stringify(event)}\n`);
    const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

    window.__aiOutputUpstreamAborted = false;
    window.fetch = async (input, init = {}) => {
      const url = typeof input === "string" ? input : input?.url;
      if (!url || !new URL(url, window.location.href).pathname.endsWith(gatewayPath)) {
        return originalFetch(input, init);
      }

      const { question } = JSON.parse(init.body);
      const signal = init.signal;
      const response = (events, { interval = 0, stayOpen = false, trackCancellation = false } = {}) => {
        let stopped = false;
        let streamController;
        const markStopped = () => {
          if (stopped) return;
          stopped = true;
          if (trackCancellation) window.__aiOutputUpstreamAborted = true;
          try {
            streamController?.error(new DOMException("aborted", "AbortError"));
          } catch {
            // The consumer may already have cancelled the stream.
          }
        };

        const body = new ReadableStream({
          start(controller) {
            streamController = controller;
            signal?.addEventListener("abort", markStopped, { once: true });
            void (async () => {
              for (const event of events) {
                if (stopped) return;
                controller.enqueue(encode(event));
                if (interval) await delay(interval);
              }
              if (!stopped && !stayOpen) controller.close();
            })();
          },
          cancel() {
            stopped = true;
            if (trackCancellation) window.__aiOutputUpstreamAborted = true;
          },
        });

        return new Response(body, {
          status: 200,
          headers: { "content-type": "application/x-ndjson; charset=utf-8" },
        });
      };

      if (question === "e2e:long-stream") {
        return response([
          { type: "start" },
          ...Array.from({ length: 12 }, (_, index) => ({
            type: "delta",
            text: `流式片段-${index + 1} `,
          })),
          { type: "done", finishReason: "stop" },
        ], { interval: 75 });
      }

      if (question === "e2e:output-limit") {
        return response([
          { type: "start" },
          { type: "delta", text: "🙂".repeat(outputLimit + 1) },
          { type: "delta", text: "不应被消费" },
          { type: "done", finishReason: "stop" },
        ], { interval: 250, trackCancellation: true });
      }

      if (question === "e2e:user-abort") {
        return response([
          { type: "start" },
          { type: "delta", text: "停止前的部分回答" },
        ], { interval: 25, stayOpen: true });
      }

      if (question === "e2e:error") {
        return response([
          { type: "start" },
          { type: "delta", text: "错误前的部分回答" },
          { type: "error", message: "mock upstream failure", code: "MOCK_FAILURE" },
        ], { interval: 25 });
      }

      const finishReason = question === "e2e:length" ? "length" : "stop";
      return response([
        { type: "start" },
        { type: "delta", text: `${finishReason} answer` },
        { type: "done", finishReason },
      ], { interval: 25 });
    };
  }, { gatewayPath: GATEWAY_PATH, outputLimit: OUTPUT_LIMIT });
}

async function openAssistant(page) {
  await installStreamingGateway(page);
  await page.goto("?demo=props");
  await page.getByRole("tab", { name: "AI" }).click();
  const composer = page.getByRole("textbox", { name: "向 AI 助手提问" });
  await expect(composer).toBeEnabled();
  return {
    composer,
    transcript: page.getByRole("log", { name: "AI 对话记录" }),
  };
}

async function submit(page, composer, question) {
  await composer.fill(question);
  await page.getByRole("button", { name: "发送", exact: true }).click();
}

test("a long answer renders incrementally and creates exactly one assistant message", async ({ page }) => {
  const { composer, transcript } = await openAssistant(page);
  const assistantMessage = transcript.locator('[data-message-role="assistant"]');

  await submit(page, composer, "e2e:long-stream");

  await expect(assistantMessage).toHaveCount(1);
  await expect(assistantMessage).toHaveAttribute("aria-busy", "true");
  await expect(assistantMessage).toContainText("流式片段-1");
  await expect(assistantMessage).not.toContainText("流式片段-12");

  await expect(assistantMessage).toContainText("流式片段-12");
  await expect(assistantMessage).toHaveAttribute("data-finish-reason", "stop");
  await expect(assistantMessage).not.toHaveAttribute("aria-busy", "true");
  await expect(assistantMessage).toHaveCount(1);
});

test("more than 6000 Unicode characters stops upstream and finalizes at output_limit", async ({ page }) => {
  const { composer, transcript } = await openAssistant(page);
  const assistantMessage = transcript.locator('[data-message-role="assistant"]');

  await submit(page, composer, "e2e:output-limit");

  await expect(assistantMessage).toHaveCount(1);
  await expect(assistantMessage).toHaveAttribute("data-finish-reason", "output_limit");
  await expect(assistantMessage.getByRole("status")).toHaveText("回答已达到 6000 字上限");
  await expect.poll(async () => assistantMessage.locator(".ai-assistant-markdown").evaluate(
    (node) => Array.from(node.textContent ?? "").length,
  )).toBe(OUTPUT_LIMIT);
  await expect(assistantMessage).not.toContainText("不应被消费");
  await expect.poll(() => page.evaluate(() => window.__aiOutputUpstreamAborted)).toBe(true);
  await expect(assistantMessage).toHaveCount(1);

  const persisted = await page.evaluate(() => new Promise((resolve, reject) => {
    const open = indexedDB.open("react-learning-ai");
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const db = open.result;
      const request = db.transaction("messages", "readonly").objectStore("messages").getAll();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        resolve(request.result.filter((message) => message.role === "assistant"));
        db.close();
      };
    };
  }));
  expect(persisted).toHaveLength(1);
  expect(Array.from(persisted[0].content)).toHaveLength(OUTPUT_LIMIT);
  expect(persisted[0]).toMatchObject({
    status: "complete",
    metadata: { finishReason: "output_limit" },
  });

  await page.reload();
  await page.getByRole("tab", { name: "AI" }).click();
  const restored = page.getByRole("log", { name: "AI 对话记录" }).locator('[data-message-role="assistant"]');
  await expect(restored).toHaveCount(1);
  await expect(restored).toHaveAttribute("data-finish-reason", "output_limit");
  await expect(restored.getByRole("status")).toHaveText("回答已达到 6000 字上限");
});

test("stop and provider length expose distinct terminal UI states", async ({ page }) => {
  const { composer, transcript } = await openAssistant(page);
  let assistantMessage = transcript.locator('[data-message-role="assistant"]');

  await submit(page, composer, "e2e:stop");
  await expect(assistantMessage).toHaveCount(1);
  await expect(assistantMessage).toHaveAttribute("data-finish-reason", "stop");
  await expect(assistantMessage.locator(".ai-assistant-finish-reason")).toHaveCount(0);

  await page.getByRole("button", { name: "新对话", exact: true }).click();
  assistantMessage = transcript.locator('[data-message-role="assistant"]');
  await submit(page, composer, "e2e:length");
  await expect(assistantMessage).toHaveCount(1);
  await expect(assistantMessage).toHaveAttribute("data-finish-reason", "length");
  await expect(assistantMessage.locator(".ai-assistant-finish-reason")).toHaveText(
    "模型达到 provider token 上限，回答可能未完整结束。",
  );
});

test("user abort and stream error expose distinct terminal UI states", async ({ page }) => {
  const { composer, transcript } = await openAssistant(page);
  let assistantMessage = transcript.locator('[data-message-role="assistant"]');

  await submit(page, composer, "e2e:user-abort");
  await expect(assistantMessage).toHaveCount(1);
  await expect(assistantMessage).toContainText("停止前的部分回答");
  await page.getByRole("button", { name: "停止", exact: true }).click();
  await expect(assistantMessage).toHaveAttribute("data-finish-reason", "user_abort");
  await expect(assistantMessage.locator(".ai-assistant-finish-reason")).toHaveText("回答已由你停止。");
  await expect(assistantMessage).toHaveCount(1);

  await page.getByRole("button", { name: "新对话", exact: true }).click();
  assistantMessage = transcript.locator('[data-message-role="assistant"]');
  await submit(page, composer, "e2e:error");
  await expect(assistantMessage).toHaveCount(1);
  await expect(assistantMessage).toHaveAttribute("data-finish-reason", "error");
  await expect(assistantMessage.locator(".ai-assistant-finish-reason")).toHaveText("回答因错误中断。");
  await expect(page.getByRole("alert")).toHaveText(/mock upstream failure/);
  await expect(assistantMessage).toHaveCount(1);
});
