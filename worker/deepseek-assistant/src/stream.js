const encoder = new TextEncoder();

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

  let reader = null;
  let cancelled = false;

  return new ReadableStream({
    async start(controller) {
      const decoder = new TextDecoder();
      reader = upstreamBody.getReader();
      let buffer = "";
      let finishReason = null;
      let usage = null;

      const processLine = (line) => {
        if (!line.trim()) return false;
        const chunk = parseDeepSeekChunk(line.replace(/\r$/, ""));
        if (!chunk) return false;
        if (chunk.done) return true;
        if (chunk.delta && !cancelled) {
          controller.enqueue(encodeEvent({ type: "delta", text: chunk.delta }));
        }
        if (chunk.finishReason) finishReason = chunk.finishReason;
        if (chunk.usage) usage = chunk.usage;
        return false;
      };

      try {
        controller.enqueue(encodeEvent({ type: "start" }));

        while (!cancelled) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let boundary;
          while ((boundary = buffer.indexOf("\n")) >= 0) {
            const line = buffer.slice(0, boundary);
            buffer = buffer.slice(boundary + 1);
            if (processLine(line)) {
              if (!cancelled) {
                controller.enqueue(encodeEvent({ type: "done", finishReason, usage }));
                controller.close();
              }
              return;
            }
          }
        }

        if (cancelled) return;

        buffer += decoder.decode();
        if (buffer.trim() && processLine(buffer)) {
          controller.enqueue(encodeEvent({ type: "done", finishReason, usage }));
          controller.close();
          return;
        }

        controller.enqueue(encodeEvent({ type: "done", finishReason, usage }));
        controller.close();
      } catch {
        if (!cancelled) {
          controller.enqueue(encodeEvent({ type: "error", message: "upstream stream failed" }));
          controller.close();
        }
      } finally {
        reader?.releaseLock?.();
      }
    },
    async cancel(reason) {
      cancelled = true;
      try {
        await reader?.cancel(reason);
      } catch {
        // Cancellation is best-effort; the downstream stream is already closed.
      }
    },
  });
}
