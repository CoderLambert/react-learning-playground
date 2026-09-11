const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function encodeEvent(event) {
  return encoder.encode(`${JSON.stringify(event)}\n`);
}

export function parseDeepSeekChunk(line) {
  if (!line.startsWith("data:")) return null;
  const payload = line.slice(5).trim();
  if (!payload) return null;
  if (payload === "[DONE]") return { done: true };
  const parsed = JSON.parse(payload);
  const choice = parsed?.choices?.[0];
  return {
    done: false,
    delta: typeof choice?.delta?.content === "string" ? choice.delta.content : "",
    finishReason: choice?.finish_reason ?? null,
    usage: parsed?.usage ?? null,
  };
}

export function normalizeDeepSeekStream(upstreamBody) {
  if (!upstreamBody) throw new Error("DeepSeek response missing body");

  return new ReadableStream({
    async start(controller) {
      controller.enqueue(encodeEvent({ type: "start" }));
      const reader = upstreamBody.getReader();
      let buffer = "";
      let finishReason = null;
      let usage = null;

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          let boundary;
          while ((boundary = buffer.indexOf("\n")) >= 0) {
            const line = buffer.slice(0, boundary).replace(/\r$/, "");
            buffer = buffer.slice(boundary + 1);
            if (!line.trim()) continue;
            const chunk = parseDeepSeekChunk(line);
            if (!chunk) continue;
            if (chunk.done) {
              controller.enqueue(encodeEvent({ type: "done", finishReason, usage }));
              controller.close();
              return;
            }
            if (chunk.delta) controller.enqueue(encodeEvent({ type: "delta", text: chunk.delta }));
            if (chunk.finishReason) finishReason = chunk.finishReason;
            if (chunk.usage) usage = chunk.usage;
          }
        }
        controller.enqueue(encodeEvent({ type: "done", finishReason, usage }));
        controller.close();
      } catch (error) {
        controller.enqueue(encodeEvent({ type: "error", message: "upstream stream failed" }));
        controller.close();
      } finally {
        reader.releaseLock();
      }
    },
    cancel(reason) {
      upstreamBody.cancel?.(reason).catch?.(() => {});
    },
  });
}
