import { normalizeChatEvent } from "./contracts.js";
import { normalizeFinishReason } from "./finishReason.js";

function parseRecord(record) {
  const trimmed = record.trim();
  if (!trimmed || trimmed.startsWith(":")) return null;

  const payload = trimmed.startsWith("data:") ? trimmed.slice(5).trim() : trimmed;
  if (!payload || payload === "[DONE]") return null;

  let parsed;
  try {
    parsed = JSON.parse(payload);
  } catch (error) {
    throw new SyntaxError(`invalid AI stream event JSON: ${error.message}`);
  }
  const event = normalizeChatEvent(parsed);
  if (event.type !== "done") return event;
  return {
    ...event,
    finishReason: normalizeFinishReason(parsed.finishReason),
  };
}

export class ChatStreamParser {
  #buffer = "";

  push(chunk) {
    this.#buffer += typeof chunk === "string" ? chunk : new TextDecoder().decode(chunk, { stream: true });
    const normalized = this.#buffer.replace(/\r\n/g, "\n");
    const records = normalized.split("\n");
    this.#buffer = records.pop() ?? "";

    const events = [];
    for (const record of records) {
      const event = parseRecord(record);
      if (event) events.push(event);
    }
    return events;
  }

  finish() {
    const tail = this.#buffer.trim();
    this.#buffer = "";
    if (!tail) return [];
    const event = parseRecord(tail);
    return event ? [event] : [];
  }
}

export async function* parseChatEventStream(readableStream) {
  if (!readableStream?.getReader) throw new TypeError("response body is not a readable stream");

  const reader = readableStream.getReader();
  const decoder = new TextDecoder();
  const parser = new ChatStreamParser();

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const text = decoder.decode(value, { stream: true });
      for (const event of parser.push(text)) yield event;
    }

    const finalText = decoder.decode();
    if (finalText) {
      for (const event of parser.push(finalText)) yield event;
    }
    for (const event of parser.finish()) yield event;
  } finally {
    reader.releaseLock?.();
  }
}
