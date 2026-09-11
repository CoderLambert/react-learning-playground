import assert from "node:assert/strict";
import test from "node:test";

import {
  AI_ASSISTANT_MAX_OUTPUT_CHARS,
  appendWithinOutputLimit,
  countUnicodeCharacters,
  createUnicodeOutputLimiter,
} from "../src/ai/outputLimit.js";

test("output character counting uses Unicode code points instead of UTF-16 code units", () => {
  assert.equal("A😀中".length, 4);
  assert.equal(countUnicodeCharacters("A😀中"), 3);
});

test("assistant output is unlimited by default", () => {
  assert.equal(AI_ASSISTANT_MAX_OUTPUT_CHARS, Number.POSITIVE_INFINITY);

  const chunk = "中😀".repeat(4_000);
  const result = appendWithinOutputLimit("", chunk);
  assert.equal(result.content, chunk);
  assert.equal(result.acceptedText, chunk);
  assert.equal(result.characterCount, 8_000);
  assert.equal(result.outputLimitExceeded, false);
});

test("streaming limiter does not stop long answers when no explicit cap is configured", () => {
  let stops = 0;
  const limiter = createUnicodeOutputLimiter({
    onOutputLimitExceeded: () => { stops += 1; },
  });

  const first = limiter.push("🙂".repeat(6_001));
  const second = limiter.push("继续输出");

  assert.equal(first.outputLimitExceeded, false);
  assert.equal(second.outputLimitExceeded, false);
  assert.equal(second.content.endsWith("继续输出"), true);
  assert.equal(stops, 0);
});

test("an explicit finite limiter still caps output for callers that opt in", () => {
  let stops = 0;
  const limiter = createUnicodeOutputLimiter({
    maxCharacters: 3,
    onOutputLimitExceeded: () => { stops += 1; },
  });

  assert.deepEqual(limiter.push("你😀"), {
    content: "你😀",
    acceptedText: "你😀",
    characterCount: 2,
    outputLimitExceeded: false,
  });
  assert.equal(limiter.push("好late").acceptedText, "好");
  assert.equal(limiter.push("buffered").acceptedText, "");
  assert.deepEqual(limiter.snapshot(), {
    content: "你😀好",
    characterCount: 3,
    outputLimitExceeded: true,
  });
  assert.equal(stops, 1);
});
