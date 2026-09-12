import assert from "node:assert/strict";
import test from "node:test";

import {
  getTranscriptDistanceToBottom,
  isTranscriptNearBottom,
  isTranscriptScrollKey,
  resolveAutoFollowState,
} from "../src/components/ai-assistant/streaming/aiTutorScrollBehavior.js";

test("distance to bottom is clamped and near-bottom uses the configured threshold", () => {
  assert.equal(getTranscriptDistanceToBottom({ scrollHeight: 1000, scrollTop: 700, clientHeight: 250 }), 50);
  assert.equal(getTranscriptDistanceToBottom({ scrollHeight: 100, scrollTop: 80, clientHeight: 40 }), 0);
  assert.equal(isTranscriptNearBottom({ scrollHeight: 1000, scrollTop: 700, clientHeight: 250 }, 56), true);
  assert.equal(isTranscriptNearBottom({ scrollHeight: 1000, scrollTop: 600, clientHeight: 250 }, 56), false);
});

test("programmatic smooth-scroll intermediate events do not pause following", () => {
  const metrics = { scrollHeight: 1200, scrollTop: 500, clientHeight: 400 };
  assert.equal(resolveAutoFollowState({ current: true, userInitiated: false, metrics }), true);
});

test("explicit user scrolling away pauses following and returning to bottom resumes it", () => {
  const away = { scrollHeight: 1200, scrollTop: 500, clientHeight: 400 };
  const bottom = { scrollHeight: 1200, scrollTop: 800, clientHeight: 400 };
  assert.equal(resolveAutoFollowState({ current: true, userInitiated: true, metrics: away }), false);
  assert.equal(resolveAutoFollowState({ current: false, userInitiated: true, metrics: bottom }), true);
});

test("keyboard intent covers transcript scrolling keys without swallowing unrelated keys", () => {
  for (const key of ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "]) {
    assert.equal(isTranscriptScrollKey(key), true, key);
  }
  assert.equal(isTranscriptScrollKey("Enter"), false);
  assert.equal(isTranscriptScrollKey("Tab"), false);
});
