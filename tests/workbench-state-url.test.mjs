import test from "node:test";
import assert from "node:assert/strict";
import {
  clampInspectorWidth,
  clearPersistedWorkbenchState,
  getEffectiveInspectorWidth,
  normalizePreferredInspectorWidth,
  persistWorkbenchState,
  readPersistedWorkbenchState,
} from "../src/workbench/stateStorage.js";
import {
  buildDemoUrl,
  readDemoUrlState,
  resolveDemoId,
} from "../src/workbench/demoUrlState.js";

function createMemoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
    removeItem(key) {
      values.delete(key);
    },
    dump() {
      return Object.fromEntries(values);
    },
  };
}

test("reads defaults when storage is empty or corrupt", () => {
  const storage = createMemoryStorage({
    "react-learning-workbench:navigation-collapsed": "maybe",
    "react-learning-workbench:inspector-open": "broken",
    "react-learning-workbench:inspector-width": "NaN",
    "react-learning-workbench:inspector-tab": "console",
  });

  assert.deepEqual(readPersistedWorkbenchState({ storage, viewportWidth: 1600 }), {
    navigationCollapsed: false,
    inspectorOpen: true,
    inspectorWidth: 480,
    inspectorTab: "notes",
    sourceFile: null,
  });
});

test("persists canonical values and clears them safely", () => {
  const storage = createMemoryStorage();
  assert.equal(persistWorkbenchState({
    navigationCollapsed: true,
    inspectorOpen: false,
    inspectorWidth: 720,
    inspectorTab: "source",
    sourceFile: "Demo.jsx",
  }, { storage, viewportWidth: 1440 }), true);

  assert.deepEqual(readPersistedWorkbenchState({ storage, viewportWidth: 1440 }), {
    navigationCollapsed: true,
    inspectorOpen: false,
    inspectorWidth: 720,
    inspectorTab: "source",
    sourceFile: "Demo.jsx",
  });

  assert.equal(clearPersistedWorkbenchState({ storage }), true);
  assert.deepEqual(storage.dump(), {});
});

test("clamps inspector width to hard and viewport bounds", () => {
  assert.equal(clampInspectorWidth(100, 1600), 360);
  assert.equal(clampInspectorWidth(2000, 1600), 900);
  assert.equal(clampInspectorWidth(900, 1000), 600);
  assert.equal(clampInspectorWidth(480, 400), 360);
});

test("keeps the preferred width through narrow viewport transitions", () => {
  const storage = createMemoryStorage({
    "react-learning-workbench:inspector-width": "720",
  });

  const mobileState = readPersistedWorkbenchState({ storage, viewportWidth: 390 });
  assert.equal(mobileState.inspectorWidth, 720);
  assert.equal(getEffectiveInspectorWidth(mobileState.inspectorWidth, 390), 360);

  assert.equal(persistWorkbenchState(mobileState, { storage, viewportWidth: 390 }), true);
  assert.equal(storage.dump()["react-learning-workbench:inspector-width"], "720");
  assert.equal(getEffectiveInspectorWidth(readPersistedWorkbenchState({ storage }).inspectorWidth, 1440), 720);
});

test("only explicit resize updates the stored preferred width", () => {
  const storage = createMemoryStorage();
  assert.equal(normalizePreferredInspectorWidth(650), 650);
  assert.equal(persistWorkbenchState({ inspectorWidth: 650 }, { storage }), true);
  assert.equal(storage.dump()["react-learning-workbench:inspector-width"], "650");
});

test("resolves invalid demo ids to a stable fallback", () => {
  const demos = [{ id: "props" }, { id: "state" }];
  assert.equal(resolveDemoId("state", demos, "props"), "state");
  assert.equal(resolveDemoId("missing", demos, "props"), "props");
  assert.equal(resolveDemoId("missing", demos, "also-missing"), "props");
});

test("reads demo id from URL and marks invalid query values", () => {
  const demos = [{ id: "props" }, { id: "state" }];
  assert.deepEqual(
    readDemoUrlState({ search: "?demo=state" }, demos, "props"),
    {
      demoId: "state",
      requestedDemoId: "state",
      hasDemoParam: true,
      isValid: true,
    },
  );
  assert.deepEqual(
    readDemoUrlState({ search: "?demo=nope" }, demos, "props"),
    {
      demoId: "props",
      requestedDemoId: "nope",
      hasDemoParam: true,
      isValid: false,
    },
  );
});

test("buildDemoUrl preserves GitHub Pages path, other query params and hash", () => {
  const url = buildDemoUrl(
    {
      pathname: "/react-learning-playground/",
      search: "?mode=debug&demo=props",
      hash: "#section",
    },
    "state",
  );

  assert.equal(
    url,
    "/react-learning-playground/?mode=debug&demo=state#section",
  );
});
