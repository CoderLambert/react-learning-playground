import { normalizeFinishReason } from "../../../src/ai/finishReason.js";
import {
  MODEL_FINISH_REASONS,
  normalizeModelFinishReason,
} from "../../../src/ai/providers/modelClient.js";

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
    ...(Array.isArray(choice?.delta?.tool_calls) ? { toolCalls: choice.delta.tool_calls } : {}),
    finishReason: choice?.finish_reason == null
      ? null
      : normalizeFinishReason(choice.finish_reason),
    usage: parsed?.usage ?? null,
  };
}

export function parseDeepSeekModelChunk(line) {
  if (!line.startsWith("data:")) return null;
  const payload = line.slice(5).trim();
  if (!payload) return null;
  if (payload === "[DONE]") return { done: true };

  const parsed = JSON.parse(payload);
  if (parsed?.error) {
    const error = new Error("upstream model stream failed");
    error.code = "UPSTREAM_STREAM_ERROR";
    throw error;
  }
  const choice = parsed?.choices?.[0];
  return {
    done: false,
    text: typeof choice?.delta?.content === "string" ? choice.delta.content : "",
    toolCalls: Array.isArray(choice?.delta?.tool_calls) ? choice.delta.tool_calls : [],
    finishReason: choice?.finish_reason ?? null,
    usage: parsed?.usage ?? null,
  };
}

function createToolAccumulator() {
  const calls = new Map();
  return {
    append(deltaCalls = []) {
      for (const delta of deltaCalls) {
        const index = Number.isInteger(delta?.index) ? delta.index : 0;
        const current = calls.get(index) ?? { id: "", name: "", argumentsText: "" };
        if (typeof delta?.id === "string") current.id += delta.id;
        if (typeof delta?.function?.name === "string") current.name += delta.function.name;
        if (typeof delta?.function?.arguments === "string") {
          current.argumentsText += delta.function.arguments;
        }
        calls.set(index, current);
      }
    },
    complete() {
      return [...calls.entries()]
        .sort(([a], [b]) => a - b)
        .map(([, call]) => {
          const argumentsValue = JSON.parse(call.argumentsText || "{}");
          if (!call.id || !call.name || !argumentsValue || typeof argumentsValue !== "object" || Array.isArray(argumentsValue)) {
            throw new Error("invalid upstream tool call");
          }
          return {
            id: call.id,
            name: call.name,
            arguments: argumentsValue,
          };
        });
    },
    get hasCalls() {
      return calls.size > 0;
    },
  };
}

export function normalizeDeepSeekModelStream(upstreamBody) {
  if (!upstreamBody) throw new Error("DeepSeek response missing body");

  let reader = null;
  let cancelled = false;

  return new ReadableStream({
    async start(controller) {
      const decoder = new TextDecoder();
      reader = upstreamBody.getReader();
      const accumulator = createToolAccumulator();
      let buffer = "";
      let finishReason = null;
      let usage = null;
      let completed = false;

      const emitCompletion = () => {
        if (completed || cancelled) return;
        const toolCalls = accumulator.complete();
        for (const toolCall of toolCalls) {
          controller.enqueue(encodeEvent({ type: "tool_call", toolCall }));
        }
        completed = true;
        controller.enqueue(encodeEvent({
          type: "turn_complete",
          finishReason: accumulator.hasCalls
            ? MODEL_FINISH_REASONS.TOOL_CALLS
            : normalizeModelFinishReason(finishReason),
          usage,
        }));
        controller.close();
      };

      const processLine = (line) => {
        if (!line.trim()) return false;
        const chunk = parseDeepSeekModelChunk(line.replace(/\r$/, ""));
        if (!chunk) return false;
        if (chunk.done) {
          emitCompletion();
          return true;
        }
        if (chunk.text && !cancelled) controller.enqueue(encodeEvent({ type: "text_delta", text: chunk.text }));
        if (chunk.toolCalls.length) accumulator.append(chunk.toolCalls);
        if (chunk.finishReason) finishReason = chunk.finishReason;
        if (chunk.usage) usage = chunk.usage;
        return false;
      };

      try {
        controller.enqueue(encodeEvent({ type: "turn_start" }));
        while (!cancelled) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          let boundary;
          while ((boundary = buffer.indexOf("\n")) >= 0) {
            const line = buffer.slice(0, boundary);
            buffer = buffer.slice(boundary + 1);
            if (processLine(line)) return;
          }
        }

        if (cancelled) return;
        buffer += decoder.decode();
        if (buffer.trim() && processLine(buffer)) return;
        emitCompletion();
      } catch {
        if (!cancelled && !completed) {
          controller.enqueue(encodeEvent({
            type: "error",
            code: "UPSTREAM_STREAM_ERROR",
            message: "upstream stream failed",
          }));
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

export function normalizeDeepSeekStream(upstreamBody, { protocol = "chat" } = {}) {
  if (protocol === "model_turn") return normalizeDeepSeekModelStream(upstreamBody);
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
                controller.enqueue(encodeEvent({
                  type: "done",
                  finishReason: normalizeFinishReason(finishReason),
                  usage,
                }));
                controller.close();
              }
              return;
            }
          }
        }

        if (cancelled) return;

        buffer += decoder.decode();
        if (buffer.trim() && processLine(buffer)) {
          controller.enqueue(encodeEvent({
            type: "done",
            finishReason: normalizeFinishReason(finishReason),
            usage,
          }));
          controller.close();
          return;
        }

        controller.enqueue(encodeEvent({
          type: "done",
          finishReason: normalizeFinishReason(finishReason),
          usage,
        }));
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
