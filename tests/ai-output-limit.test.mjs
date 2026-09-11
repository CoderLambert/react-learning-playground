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

test("streaming output keeps exactly the first 6000 Unicode characters", () => {
  const first = appendWithinOutputLimit("", "中".repeat(AI_ASSISTANT_MAX_OUTPUT_CHARS - 1));
  assert.equal(first.characterCount, AI_ASSISTANT_MAX_OUTPUT_CHARS - 1);
  assert.equal(first.outputLimitExceeded, false);

  const final = appendWithinOutputLimit(first.content, "😀尾部不应保留");
  assert.equal(countUnicodeCharacters(final.content), AI_ASSISTANT_MAX_OUTPUT_CHARS);
  assert.equal(final.content.endsWith("😀"), true);
  assert.equal(final.acceptedText, "😀");
  assert.equal(final.outputLimitExceeded, true);
});

test("reaching exactly 6000 characters does not claim overflow until another delta arrives", () => {
  const exact = appendWithinOutputLimit("中".repeat(AI_ASSISTANT_MAX_OUTPUT_CHARS - 1), "😀");
  assert.equal(exact.characterCount, AI_ASSISTANT_MAX_OUTPUT_CHARS);
  assert.equal(exact.outputLimitExceeded, false);

  const overflow = appendWithinOutputLimit(exact.content, "x");
  assert.equal(overflow.acceptedText, "");
  assert.equal(overflow.outputLimitExceeded, true);
});

test("streaming limiter fires its upstream stop hook once and ignores buffered late deltas", () => {
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
